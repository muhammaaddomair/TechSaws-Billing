"use server";

import { Prisma } from "@/generated/prisma";
import { ZodError } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearSession, setSession } from "@/lib/auth";
import { calculateDevelopmentInvoice } from "@/lib/calculations";
import { invoiceBalance } from "@/lib/business";
import { assertDatabaseUrl } from "@/lib/env";
import { generateInvoicePdf } from "@/lib/invoice-pdf";
import { verifyPassword } from "@/lib/passwords";
import { prisma } from "@/lib/prisma";
import { sendMail } from "@/lib/smtp-mailer";
import { clientSchema } from "@/validators/client";
import { loginSchema } from "@/validators/auth";
import { generateInvoiceSchema, invoiceDraftSchema, manualInvoiceSchema } from "@/validators/invoice";
import {
  costRecordSchema,
  milestoneSchema,
  noteSchema,
  paymentRequestSchema,
  paymentSchema,
  paymentStatusSchema,
  projectSchema,
  revenueRecordSchema
} from "@/validators/operations";

function toDecimal(value: number) {
  return new Prisma.Decimal(value.toFixed(2));
}

type ActionResult = {
  success: boolean;
  message: string;
};

function validationErrorMessage(error: unknown) {
  if (error instanceof ZodError) {
    return error.issues[0]?.message ?? "Please check the submitted fields.";
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong.";
}

async function logActivity(input: {
  entityType: "CLIENT" | "PROJECT" | "INVOICE" | "PAYMENT" | "ASSET" | "TASK" | "NOTE" | "MILESTONE" | "SETTINGS";
  entityId: string;
  action:
    | "CREATED"
    | "UPDATED"
    | "DELETED"
    | "ARCHIVED"
    | "REACTIVATED"
    | "STATUS_CHANGED"
    | "PAYMENT_LOGGED"
    | "RENEWED"
    | "NOTE_ADDED"
    | "COMPLETED";
  message: string;
  actorId?: string | null;
}) {
  try {
    await prisma.activityLog.create({
      data: input
    });
  } catch (error) {
    console.error("Activity log failed", error);
  }
}

export async function saveClient(input: unknown): Promise<ActionResult> {
  try {
    assertDatabaseUrl();
    const data = clientSchema.parse(input);

    if (data.id) {
      await prisma.client.update({
        where: { id: data.id },
        data: {
          name: data.name,
          ...(data.email ? { email: data.email } : {}),
          companyName: data.companyName,
          contactPerson: data.contactPerson || null,
          phone: data.phone || null,
          type: data.type,
          status: data.status,
          contractStatus: data.contractStatus,
          startDate: data.startDate,
          tags: data.tagsText
            ?.split(",")
            .map((tag) => tag.trim())
            .filter(Boolean) ?? []
        }
      });
      await logActivity({
        entityType: "CLIENT",
        entityId: data.id,
        action: "UPDATED",
        message: `Client ${data.companyName} updated.`
      });
    } else {
      const clientEmail = data.email?.trim() || `client-${Date.now()}-${Math.random().toString(36).slice(2)}@internal.local`;
      const client = await prisma.client.create({
        data: {
          name: data.name,
          email: clientEmail,
          companyName: data.companyName,
          contactPerson: data.contactPerson || null,
          phone: data.phone || null,
          type: data.type,
          status: data.status,
          contractStatus: data.contractStatus,
          startDate: data.startDate,
          tags: data.tagsText
            ?.split(",")
            .map((tag) => tag.trim())
            .filter(Boolean) ?? []
        }
      });
      await logActivity({
        entityType: "CLIENT",
        entityId: client.id,
        action: "CREATED",
        message: `Client ${data.companyName} created.`
      });
    }

    revalidatePath("/dashboard/clients");
    if (data.id) {
      revalidatePath(`/dashboard/clients/${data.id}`);
    }

    return {
      success: true,
      message: "Client saved successfully."
    };
  } catch (error) {
    return {
      success: false,
      message: validationErrorMessage(error)
    };
  }
}

export async function deleteClient(clientId: string): Promise<ActionResult> {
  try {
    assertDatabaseUrl();
    await prisma.client.update({
      where: {
        id: clientId
      },
      data: {
        status: "ARCHIVED",
        archivedAt: new Date()
      }
    });
    await logActivity({
      entityType: "CLIENT",
      entityId: clientId,
      action: "ARCHIVED",
      message: "Client archived."
    });

    revalidatePath("/dashboard/clients");
    revalidatePath("/dashboard/invoices");

    return {
      success: true,
      message: "Client archived."
    };
  } catch (error) {
    return {
      success: false,
      message: validationErrorMessage(error)
    };
  }
}

export async function saveInvoiceDraft(input: unknown): Promise<ActionResult> {
  try {
    assertDatabaseUrl();
    const data = invoiceDraftSchema.parse(input);
    const developmentItems =
      data.type === "DEVELOPMENT"
        ? data.items.map((item) => ({
            title: item.title,
            description: item.description || null,
            quantity: item.quantity,
            unitPrice: toDecimal(item.unitPrice),
            total: toDecimal(item.quantity * item.unitPrice)
          }))
        : [];

    const draftSummary =
      data.type === "DEVELOPMENT"
        ? calculateDevelopmentInvoice(data.items.map((item) => ({
            quantity: item.quantity,
            unitPrice: item.unitPrice
          })))
        : {
            totalAmount: 0,
            taxAmount: 0,
            finalAmount: 0
          };

    if (data.id) {
      await prisma.$transaction(async (tx) => {
        await tx.invoice.update({
          where: { id: data.id },
          data: {
            clientId: data.clientId,
            projectId: data.projectId || null,
            type: data.type,
            totalAmount: toDecimal(draftSummary.totalAmount),
            taxAmount: toDecimal(draftSummary.taxAmount),
            discountAmount: toDecimal(0),
            finalAmount: toDecimal(draftSummary.finalAmount),
            balanceAmount: toDecimal(draftSummary.finalAmount),
            issueDate: data.issueDate ?? new Date(),
            dueDate: data.dueDate,
            notes: data.notes || null,
            status: "DRAFT"
          }
        });

        await tx.invoiceItem.deleteMany({
          where: {
            invoiceId: data.id
          }
        });

        if (developmentItems.length > 0) {
          await tx.invoiceItem.createMany({
            data: developmentItems.map((item) => ({
              invoiceId: data.id!,
              ...item
            }))
          });
        }
      });
    } else {
      await prisma.$transaction(async (tx) => {
        const invoice = await tx.invoice.create({
          data: {
            clientId: data.clientId,
            projectId: data.projectId || null,
            type: data.type,
            totalAmount: toDecimal(draftSummary.totalAmount),
            taxAmount: toDecimal(draftSummary.taxAmount),
            discountAmount: toDecimal(0),
            finalAmount: toDecimal(draftSummary.finalAmount),
            balanceAmount: toDecimal(draftSummary.finalAmount),
            issueDate: data.issueDate ?? new Date(),
            dueDate: data.dueDate,
            notes: data.notes || null,
            status: "DRAFT"
          }
        });

        if (developmentItems.length > 0) {
          await tx.invoiceItem.createMany({
            data: developmentItems.map((item) => ({
              invoiceId: invoice.id,
              ...item
            }))
          });
        }
      });
    }

    revalidatePath("/dashboard/invoices");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Draft invoice saved."
    };
  } catch (error) {
    return {
      success: false,
      message: validationErrorMessage(error)
    };
  }
}

export async function markInvoicePaid(invoiceId: string): Promise<ActionResult> {
  try {
    assertDatabaseUrl();
    const invoice = await prisma.invoice.findUnique({
      where: {
        id: invoiceId
      },
      select: {
        finalAmount: true
      }
    });

    if (!invoice) {
      throw new Error("Invoice not found.");
    }

    await prisma.invoice.update({
      where: {
        id: invoiceId
      },
        data: {
          status: "PAID",
          amountPaid: invoice.finalAmount,
          balanceAmount: toDecimal(0)
        }
      });

    revalidatePath("/dashboard/invoices");
    revalidatePath(`/dashboard/invoices/${invoiceId}`);

    return {
      success: true,
      message: "Invoice marked as paid."
    };
  } catch (error) {
    return {
      success: false,
      message: validationErrorMessage(error)
    };
  }
}

export async function saveManualInvoice(input: unknown): Promise<ActionResult> {
  try {
    assertDatabaseUrl();
    const data = manualInvoiceSchema.parse(input);
    const normalizedItems = data.items.map((item) => {
      const amount = item.amount > 0 ? item.amount : item.quantity * item.unitPrice;
      return {
        ...item,
        amount: Number(amount.toFixed(2))
      };
    });
    const subtotal = Number(normalizedItems.reduce((sum, item) => sum + item.amount, 0).toFixed(2));
    const taxAmount = subtotal * (data.taxPercent / 100);
    const finalAmount = Math.max(0, Number((subtotal + taxAmount - data.discountAmount).toFixed(2)));
    const clientEmail = data.email?.trim() || `invoice-${Date.now()}-${Math.random().toString(36).slice(2)}@internal.local`;
    const pdfMeta = JSON.stringify({
      bankName: data.bankName || "",
      accountName: data.accountName || "",
      accountNumber: data.accountNumber || "",
      iban: data.iban || "",
      taxPercent: data.taxPercent
    });

    const invoice = await prisma.$transaction(async (tx) => {
      const client = await tx.client.upsert({
        where: {
          email: clientEmail
        },
        update: {
          name: data.clientName,
          companyName: data.companyName
        },
        create: {
          name: data.clientName,
          email: clientEmail,
          companyName: data.companyName,
          type: "SERVICE"
        }
      });

      const savedInvoice = data.id
          ? await tx.invoice.update({
              where: { id: data.id },
              data: {
                invoiceNumber: data.invoiceNumber,
                clientId: client.id,
                type: "DEVELOPMENT",
                totalAmount: toDecimal(subtotal),
                taxAmount: toDecimal(taxAmount),
                discountAmount: toDecimal(data.discountAmount),
                finalAmount: toDecimal(finalAmount),
                amountPaid: toDecimal(0),
                balanceAmount: toDecimal(finalAmount),
                projectCost: toDecimal(subtotal),
                advancePercent: null,
                advanceAmount: toDecimal(0),
                timeline: null,
                issueDate: data.issueDate ?? new Date(),
                dueDate: data.dueDate,
                notes: data.notes || null,
                internalComments: pdfMeta,
                status: "SENT"
              }
            })
          : await tx.invoice.create({
              data: {
                invoiceNumber: data.invoiceNumber,
                clientId: client.id,
                type: "DEVELOPMENT",
                totalAmount: toDecimal(subtotal),
                taxAmount: toDecimal(taxAmount),
                discountAmount: toDecimal(data.discountAmount),
                finalAmount: toDecimal(finalAmount),
                amountPaid: toDecimal(0),
                balanceAmount: toDecimal(finalAmount),
                projectCost: toDecimal(subtotal),
                advancePercent: null,
                advanceAmount: toDecimal(0),
                timeline: null,
                issueDate: data.issueDate ?? new Date(),
                dueDate: data.dueDate,
                notes: data.notes || null,
                internalComments: pdfMeta,
                status: "SENT"
              }
            });

      await tx.invoiceItem.deleteMany({
        where: {
          invoiceId: savedInvoice.id
        }
      });

        await tx.invoiceItem.createMany({
          data: normalizedItems.map((item) => ({
            invoiceId: savedInvoice.id,
            title: item.description,
            description: null,
            quantity: Math.max(1, Math.round(item.quantity)),
            unitPrice: toDecimal(item.unitPrice),
            total: toDecimal(item.amount),
            category: "PROJECT_SERVICE",
            recurring: false
          }))
        });

      return savedInvoice;
    });

    await logActivity({
      entityType: "INVOICE",
      entityId: invoice.id,
      action: data.id ? "UPDATED" : "CREATED",
      message: `Invoice ${invoice.invoiceNumber} ${data.id ? "updated" : "created"}.`
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/invoices");
    revalidatePath(`/dashboard/invoices/${invoice.id}`);
    return { success: true, message: "Invoice saved successfully." };
  } catch (error) {
    return { success: false, message: validationErrorMessage(error) };
  }
}

export async function sendInvoiceEmail(invoiceId: string): Promise<ActionResult> {
  try {
    assertDatabaseUrl();
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { client: true }
    });

    if (!invoice) {
      throw new Error("Invoice not found.");
    }

    if (!invoice.client.email || invoice.client.email.endsWith("@internal.local")) {
      throw new Error("Client email is missing.");
    }

    const pdf = await generateInvoicePdf(invoice.id);

    await sendMail({
      to: invoice.client.email,
      subject: `Invoice ${invoice.invoiceNumber}`,
      text: "Kindly see attached invoice.",
      attachments: [
        {
          filename: pdf.filename,
          contentType: "application/pdf",
          content: pdf.bytes
        }
      ]
    });

    await prisma.invoice.update({
      where: { id: invoice.id },
      data: { status: invoice.status === "PAID" || invoice.status === "PARTIALLY_PAID" ? invoice.status : "SENT" }
    });

    await logActivity({
      entityType: "INVOICE",
      entityId: invoice.id,
      action: "UPDATED",
      message: `Invoice email sent to ${invoice.client.email}.`
    });

    revalidatePath("/dashboard/payments");
    revalidatePath("/dashboard/invoices");
    revalidatePath(`/dashboard/invoices/${invoiceId}`);

    return { success: true, message: `Invoice emailed to ${invoice.client.email}.` };
  } catch (error) {
    return { success: false, message: validationErrorMessage(error) };
  }
}

export async function generateInvoice(input: unknown): Promise<ActionResult> {
  try {
    assertDatabaseUrl();
    const { invoiceId } = generateInvoiceSchema.parse(input);

    await prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.findUnique({
        where: {
          id: invoiceId
        },
        include: {
          items: true,
          client: true
        }
      });

      if (!invoice) {
        throw new Error("Invoice not found.");
      }

      if (invoice.status !== "DRAFT") {
        throw new Error("Only draft invoices can be generated.");
      }

      if (invoice.items.length === 0) {
        throw new Error("Invoices require at least one item.");
      }

      const summary = calculateDevelopmentInvoice(invoice.items);

      await tx.invoice.update({
        where: {
          id: invoiceId
        },
        data: {
          totalAmount: toDecimal(summary.totalAmount),
          taxAmount: toDecimal(summary.taxAmount),
          finalAmount: toDecimal(summary.finalAmount),
          balanceAmount: toDecimal(summary.finalAmount),
          status: "GENERATED"
        }
      });
    });

    revalidatePath("/dashboard/invoices");
    revalidatePath(`/dashboard/invoices/${invoiceId}`);

    return {
      success: true,
      message: "Invoice generated successfully."
    };
  } catch (error) {
    return {
      success: false,
      message: validationErrorMessage(error)
    };
  }
}

export async function saveProject(input: unknown): Promise<ActionResult> {
  try {
    assertDatabaseUrl();
    const data = projectSchema.parse(input);
    const payload = {
      clientId: data.clientId,
      name: data.name,
      type: data.type,
      description: data.description || null,
      scopeSummary: data.scopeSummary || null,
      status: data.status,
      priority: data.priority,
      startDate: data.startDate,
      deadline: data.deadline,
      revisedDeadline: data.revisedDeadline,
      deliveryDate: data.deliveryDate,
      budgetAmount: toDecimal(data.budgetAmount),
      internalCostEstimate: toDecimal(data.internalCostEstimate),
      progress: data.progress,
      blockers: data.blockers || null
    };
    const project = data.id
      ? await prisma.project.update({ where: { id: data.id }, data: payload })
      : await prisma.project.create({ data: payload });

    await logActivity({
      entityType: "PROJECT",
      entityId: project.id,
      action: data.id ? "UPDATED" : "CREATED",
      message: `Project ${project.name} ${data.id ? "updated" : "created"}.`
    });
    revalidatePath("/dashboard/projects");
    revalidatePath(`/dashboard/projects/${project.id}`);
    revalidatePath(`/dashboard/clients/${project.clientId}`);
    revalidatePath("/dashboard");
    return { success: true, message: "Project saved successfully." };
  } catch (error) {
    return { success: false, message: validationErrorMessage(error) };
  }
}

export async function saveMilestone(input: unknown): Promise<ActionResult> {
  try {
    assertDatabaseUrl();
    const data = milestoneSchema.parse(input);
    const milestone = data.id
      ? await prisma.milestone.update({
          where: { id: data.id },
          data: {
            title: data.title,
            description: data.description || null,
            dueDate: data.dueDate,
            status: data.status,
            owner: data.owner || null,
            completionDate: data.status === "DONE" ? new Date() : null
          }
        })
      : await prisma.milestone.create({
          data: {
            projectId: data.projectId,
            title: data.title,
            description: data.description || null,
            dueDate: data.dueDate,
            status: data.status,
            owner: data.owner || null,
            completionDate: data.status === "DONE" ? new Date() : null
          }
        });

    await logActivity({
      entityType: "MILESTONE",
      entityId: milestone.id,
      action: data.id ? "UPDATED" : "CREATED",
      message: `Milestone ${milestone.title} ${data.id ? "updated" : "created"}.`
    });
    revalidatePath(`/dashboard/projects/${milestone.projectId}`);
    return { success: true, message: "Milestone saved successfully." };
  } catch (error) {
    return { success: false, message: validationErrorMessage(error) };
  }
}

export async function savePayment(input: unknown): Promise<ActionResult> {
  try {
    assertDatabaseUrl();
    const data = paymentSchema.parse(input);
    await prisma.$transaction(async (tx) => {
      const payment = data.id
        ? await tx.payment.update({
            where: { id: data.id },
            data: {
              clientId: data.clientId,
              paymentDate: data.paymentDate,
              amountReceived: toDecimal(data.amountReceived),
              currency: data.currency,
              method: data.method,
              referenceNumber: data.referenceNumber || null,
              notes: data.notes || null
            }
          })
        : await tx.payment.create({
            data: {
              clientId: data.clientId,
              paymentDate: data.paymentDate,
              amountReceived: toDecimal(data.amountReceived),
              currency: data.currency,
              method: data.method,
              referenceNumber: data.referenceNumber || null,
              notes: data.notes || null
            }
          });

      await tx.paymentAllocation.deleteMany({ where: { paymentId: payment.id } });
      const positiveAllocations = data.allocations.filter((allocation) => allocation.amount > 0);
      if (positiveAllocations.length > 0) {
        await tx.paymentAllocation.createMany({
          data: positiveAllocations.map((allocation) => ({
            paymentId: payment.id,
            invoiceId: allocation.invoiceId,
            amount: toDecimal(allocation.amount)
          }))
        });
      }

      const invoiceIds = positiveAllocations.map((allocation) => allocation.invoiceId);
      for (const invoiceId of invoiceIds) {
        const invoice = await tx.invoice.findUnique({
          where: { id: invoiceId },
          select: { finalAmount: true }
        });
        if (!invoice) {
          throw new Error("Invoice not found for allocation.");
        }
        const allocations = await tx.paymentAllocation.findMany({
          where: { invoiceId },
          select: { amount: true }
        });
        const paid = allocations.reduce((sum, allocation) => sum + Number(allocation.amount), 0);
        const balance = invoiceBalance(Number(invoice.finalAmount), paid);
        await tx.invoice.update({
          where: { id: invoiceId },
          data: {
            amountPaid: toDecimal(paid),
            balanceAmount: toDecimal(balance),
            status: balance <= 0 ? "PAID" : paid > 0 ? "PARTIALLY_PAID" : "SENT"
          }
        });
      }

      await logActivity({
        entityType: "PAYMENT",
        entityId: payment.id,
        action: "PAYMENT_LOGGED",
        message: `Payment of ${data.amountReceived.toFixed(2)} logged.`
      });
    });

    revalidatePath("/dashboard/payments");
    revalidatePath("/dashboard/invoices");
    revalidatePath("/dashboard");
    return { success: true, message: "Payment saved successfully." };
  } catch (error) {
    return { success: false, message: validationErrorMessage(error) };
  }
}

export async function savePaymentRequest(input: unknown): Promise<ActionResult> {
  try {
    assertDatabaseUrl();
    const data = paymentRequestSchema.parse(input);
    const baseAmount = data.amount;
    const taxAmount = 0;
    const finalAmount = baseAmount + taxAmount;
    const advanceAmount =
      data.advanceAmount !== undefined && !Number.isNaN(data.advanceAmount)
        ? data.advanceAmount
        : (baseAmount * (data.advancePercent ?? 0)) / 100;
    const advancePercent =
      data.advancePercent !== undefined && !Number.isNaN(data.advancePercent)
        ? data.advancePercent
        : baseAmount > 0
          ? (advanceAmount / baseAmount) * 100
          : 0;

    const invoice = await prisma.$transaction(async (tx) => {
      const project =
        data.createProject && data.projectName
          ? await tx.project.create({
              data: {
                clientId: data.clientId,
                name: data.projectName,
                type: data.projectType,
                status: "NOT_STARTED",
                priority: "MEDIUM",
                budgetAmount: toDecimal(baseAmount)
              }
            })
          : data.projectId
            ? await tx.project.findUnique({ where: { id: data.projectId } })
            : null;

      const invoiceType = data.paymentType === "SUPPORT" ? "MAINTENANCE" : "DEVELOPMENT";
      const title = data.paymentType === "SUPPORT" ? "Support charges" : project?.name ?? "Product payment";
      const createdInvoice = await tx.invoice.create({
        data: {
          clientId: data.clientId,
          projectId: project?.id ?? null,
          type: invoiceType,
          totalAmount: toDecimal(baseAmount),
          taxAmount: toDecimal(taxAmount),
          discountAmount: toDecimal(0),
          finalAmount: toDecimal(finalAmount),
          amountPaid: toDecimal(0),
          balanceAmount: toDecimal(finalAmount),
          projectCost: toDecimal(baseAmount),
          advancePercent: toDecimal(advancePercent),
          advanceAmount: toDecimal(advanceAmount),
          dueDate: data.dueDate,
          notes: data.notes || null,
          status: "SENT"
        }
      });

      await tx.invoiceItem.createMany({
        data: [
          {
            invoiceId: createdInvoice.id,
            title,
            description: data.notes || null,
            quantity: 1,
            unitPrice: toDecimal(baseAmount),
            total: toDecimal(baseAmount),
            category: data.paymentType === "SUPPORT" ? "MAINTENANCE_SUPPORT" : "PROJECT_SERVICE",
            recurring: false
          }
        ]
      });

      return createdInvoice;
    });

    await logActivity({
      entityType: "INVOICE",
      entityId: invoice.id,
      action: "CREATED",
      message: `Payment request ${invoice.invoiceNumber} created.`
    });

    revalidatePath("/dashboard/payments");
    revalidatePath("/dashboard/invoices");
    revalidatePath("/dashboard/projects");
    revalidatePath("/dashboard");
    return { success: true, message: "Payment request added." };
  } catch (error) {
    return { success: false, message: validationErrorMessage(error) };
  }
}

export async function updatePaymentStatus(input: unknown): Promise<ActionResult> {
  try {
    assertDatabaseUrl();
    const data = paymentStatusSchema.parse(input);
    const invoice = await prisma.invoice.findUnique({
      where: { id: data.invoiceId },
      include: { allocations: true }
    });

    if (!invoice) {
      throw new Error("Payment record not found.");
    }

    const alreadyPaid = invoice.allocations.reduce((sum, allocation) => sum + Number(allocation.amount), 0);
    const targetPayment = data.status === "PAID" ? Math.max(0, Number(invoice.finalAmount) - alreadyPaid) : data.amountReceived;
    const receivedNow = Math.min(targetPayment, Math.max(0, Number(invoice.finalAmount) - alreadyPaid));
    const paid = alreadyPaid + receivedNow;
    const balance = invoiceBalance(Number(invoice.finalAmount), paid);
    const invoiceStatus = balance <= 0 ? "PAID" : paid > 0 ? "PARTIALLY_PAID" : "SENT";

    await prisma.$transaction(async (tx) => {
      if (receivedNow > 0) {
        const payment = await tx.payment.create({
          data: {
            clientId: invoice.clientId,
            paymentDate: new Date(),
            amountReceived: toDecimal(receivedNow),
            currency: "USD",
            method: data.method,
            referenceNumber: data.referenceNumber || null,
            notes: `Payment recorded from status control for ${invoice.invoiceNumber}.`
          }
        });

        await tx.paymentAllocation.create({
          data: {
            paymentId: payment.id,
            invoiceId: invoice.id,
            amount: toDecimal(receivedNow)
          }
        });
      }

      await tx.invoice.update({
        where: { id: invoice.id },
        data: {
          amountPaid: toDecimal(paid),
          balanceAmount: toDecimal(balance),
          status: invoiceStatus
        }
      });
    });

    await logActivity({
      entityType: "PAYMENT",
      entityId: invoice.id,
      action: "PAYMENT_LOGGED",
      message: `Payment status changed to ${invoiceStatus.toLowerCase().replace("_", " ")}.`
    });

    revalidatePath("/dashboard/payments");
    revalidatePath("/dashboard/invoices");
    revalidatePath(`/dashboard/invoices/${invoice.id}`);
    revalidatePath("/dashboard");
    return { success: true, message: "Payment status updated." };
  } catch (error) {
    return { success: false, message: validationErrorMessage(error) };
  }
}

export async function saveRevenueRecord(input: unknown): Promise<ActionResult> {
  try {
    assertDatabaseUrl();
    const data = revenueRecordSchema.parse(input);
    const record = data.id
      ? await prisma.revenueRecord.update({
          where: { id: data.id },
          data: {
            clientId: data.clientId,
            projectId: data.projectId || null,
            sourceType: data.sourceType,
            reference: data.reference || null,
            frequency: data.frequency,
            amount: toDecimal(data.amount),
            status: data.status,
            recognizedDate: data.recognizedDate,
            notes: data.notes || null
          }
        })
      : await prisma.revenueRecord.create({
          data: {
            clientId: data.clientId,
            projectId: data.projectId || null,
            sourceType: data.sourceType,
            reference: data.reference || null,
            frequency: data.frequency,
            amount: toDecimal(data.amount),
            status: data.status,
            recognizedDate: data.recognizedDate,
            notes: data.notes || null
          }
        });
    await logActivity({
      entityType: "SETTINGS",
      entityId: record.id,
      action: data.id ? "UPDATED" : "CREATED",
      message: "Revenue record saved."
    });
    revalidatePath("/dashboard/finance");
    revalidatePath("/dashboard");
    return { success: true, message: "Revenue record saved successfully." };
  } catch (error) {
    return { success: false, message: validationErrorMessage(error) };
  }
}

export async function saveCostRecord(input: unknown): Promise<ActionResult> {
  try {
    assertDatabaseUrl();
    const data = costRecordSchema.parse(input);
    const record = data.id
      ? await prisma.costRecord.update({
          where: { id: data.id },
          data: {
            clientId: data.clientId || null,
            projectId: data.projectId || null,
            assetId: data.assetId || null,
            costType: data.costType,
            amount: toDecimal(data.amount),
            billingFrequency: data.billingFrequency,
            vendor: data.vendor || null,
            incurredDate: data.incurredDate,
            notes: data.notes || null
          }
        })
      : await prisma.costRecord.create({
          data: {
            clientId: data.clientId || null,
            projectId: data.projectId || null,
            assetId: data.assetId || null,
            costType: data.costType,
            amount: toDecimal(data.amount),
            billingFrequency: data.billingFrequency,
            vendor: data.vendor || null,
            incurredDate: data.incurredDate,
            notes: data.notes || null
          }
        });
    await logActivity({
      entityType: "SETTINGS",
      entityId: record.id,
      action: data.id ? "UPDATED" : "CREATED",
      message: "Cost record saved."
    });
    revalidatePath("/dashboard/finance");
    revalidatePath("/dashboard");
    return { success: true, message: "Cost record saved successfully." };
  } catch (error) {
    return { success: false, message: validationErrorMessage(error) };
  }
}

export async function addInternalNote(input: unknown): Promise<ActionResult> {
  try {
    assertDatabaseUrl();
    const data = noteSchema.parse(input);
    const note = await prisma.internalNote.create({
      data: {
        entityType: data.entityType,
        entityId: data.entityId,
        body: data.body
      }
    });
    await logActivity({
      entityType: "NOTE",
      entityId: note.id,
      action: "NOTE_ADDED",
      message: `Note added to ${data.entityType.toLowerCase()}.`
    });
    return { success: true, message: "Note added." };
  } catch (error) {
    return { success: false, message: validationErrorMessage(error) };
  }
}

export async function loginUser(input: unknown): Promise<ActionResult> {
  try {
    assertDatabaseUrl();
    const data = loginSchema.parse(input);
    const user = await prisma.user.findUnique({
      where: {
        email: data.email
      }
    });

    if (!user || !verifyPassword(data.password, user.passwordHash)) {
      return {
        success: false,
        message: "Invalid email or password."
      };
    }

    await setSession(user.id);

    return {
      success: true,
      message: "Login successful."
    };
  } catch (error) {
    return {
      success: false,
      message: validationErrorMessage(error)
    };
  }
}

export async function logoutUser() {
  await clearSession();
  redirect("/");
}
