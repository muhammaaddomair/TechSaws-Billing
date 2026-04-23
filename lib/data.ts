import { Prisma } from "@/generated/prisma";
import { assertDatabaseUrl } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import {
  annualEquivalent,
  calculateHealthScore,
  currentMonthRange,
  daysBetween,
  decimalToNumber,
  invoiceBalance,
  isInvoiceOverdue,
  isProjectDelayed,
  marginPercent,
  monthlyEquivalent,
  roundMoney
} from "@/lib/business";
import {
  type ClientDetail,
  type ClientListItem,
  type DashboardOverview,
  type InvoiceDetail,
  type InvoiceListItem
} from "@/lib/types";

type InvoiceForMapping = {
  id: string;
  invoiceNumber: string;
  clientId: string;
  projectId: string | null;
  type: string;
  status: string;
  totalAmount: Prisma.Decimal;
  taxAmount: Prisma.Decimal;
  finalAmount: Prisma.Decimal;
  amountPaid: Prisma.Decimal;
  balanceAmount: Prisma.Decimal;
  projectCost: Prisma.Decimal;
  advancePercent: Prisma.Decimal | null;
  advanceAmount: Prisma.Decimal;
  timeline: string | null;
  issueDate: Date;
  dueDate: Date | null;
  createdAt: Date;
  items: { id: string }[];
  client: { name: string; email?: string; companyName: string };
  project?: { name: string } | null;
};

function mapInvoiceListItem(invoice: InvoiceForMapping): InvoiceListItem {
  const paid = decimalToNumber(invoice.amountPaid);
  const finalAmount = decimalToNumber(invoice.finalAmount);
  const balance = invoice.balanceAmount ? decimalToNumber(invoice.balanceAmount) : invoiceBalance(finalAmount, paid);

  return {
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    clientId: invoice.clientId,
    projectId: invoice.projectId,
    projectName: invoice.project?.name ?? null,
    clientName: invoice.client.name,
    clientEmail: invoice.client.email ?? "",
    companyName: invoice.client.companyName,
    type: invoice.type as InvoiceListItem["type"],
    status: invoice.status as InvoiceListItem["status"],
    totalAmount: decimalToNumber(invoice.totalAmount),
    taxAmount: decimalToNumber(invoice.taxAmount),
    finalAmount,
    amountPaid: paid,
    balanceAmount: balance,
    projectCost: decimalToNumber(invoice.projectCost),
    advancePercent: invoice.advancePercent === null ? null : decimalToNumber(invoice.advancePercent),
    advanceAmount: decimalToNumber(invoice.advanceAmount),
    timeline: invoice.timeline,
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate,
    createdAt: invoice.createdAt,
    itemCount: invoice.items.length,
    isOverdue: isInvoiceOverdue(invoice.dueDate, balance)
  };
}

export async function getClients(): Promise<ClientListItem[]> {
  assertDatabaseUrl();
  const clients = await prisma.client.findMany({
    where: { archivedAt: null },
    orderBy: { createdAt: "desc" },
    include: {
      projects: true,
      invoices: true,
      payments: { orderBy: { paymentDate: "desc" }, take: 1 },
      revenueRecords: true,
      costRecords: true,
      _count: { select: { invoices: true } }
    }
  });

  return clients.map((client) => {
    const invoiceOutstanding = client.invoices.reduce((sum, invoice) => {
      const balance = decimalToNumber(invoice.balanceAmount) || invoiceBalance(decimalToNumber(invoice.finalAmount), decimalToNumber(invoice.amountPaid));
      return sum + balance;
    }, 0);
    const recognizedRevenue =
      client.revenueRecords
        .filter((record) => record.status === "RECOGNIZED")
        .reduce((sum, record) => sum + decimalToNumber(record.amount), 0) +
      client.invoices
        .filter((invoice) => ["GENERATED", "SENT", "PARTIALLY_PAID", "PAID"].includes(invoice.status))
        .reduce((sum, invoice) => sum + decimalToNumber(invoice.finalAmount), 0);
    const costs = client.costRecords.reduce((sum, record) => sum + decimalToNumber(record.amount), 0);
    const profit = recognizedRevenue - costs;
    const overdueInvoices = client.invoices.filter((invoice) => {
      const balance = decimalToNumber(invoice.balanceAmount) || invoiceBalance(decimalToNumber(invoice.finalAmount), decimalToNumber(invoice.amountPaid));
      return isInvoiceOverdue(invoice.dueDate, balance);
    });
    const delayedProjects = client.projects.filter((project) => isProjectDelayed(project.revisedDeadline ?? project.deadline, project.status));
    const health = calculateHealthScore({
      overdueInvoices: overdueInvoices.length,
      overdueAmount: overdueInvoices.reduce((sum, invoice) => sum + decimalToNumber(invoice.balanceAmount), 0),
      delayedProjects: delayedProjects.length,
      marginPercent: marginPercent(recognizedRevenue, costs)
    });

    return {
      id: client.id,
      name: client.name,
      email: client.email,
      companyName: client.companyName,
      contactPerson: client.contactPerson,
      phone: client.phone,
      type: client.type,
      status: client.status,
      createdAt: client.createdAt,
      invoiceCount: client._count.invoices,
      activeProjects: client.projects.filter((project) => !["COMPLETED", "DELIVERED", "CANCELLED"].includes(project.status)).length,
      totalLifetimeRevenue: roundMoney(recognizedRevenue),
      totalCosts: roundMoney(costs),
      profit: roundMoney(profit),
      outstandingBalance: roundMoney(invoiceOutstanding),
      lastPaymentDate: client.payments[0]?.paymentDate ?? null,
      healthScore: health.score,
      healthBand: health.band
    };
  });
}

export async function getClientOptions() {
  assertDatabaseUrl();
  return prisma.client.findMany({
    where: { archivedAt: null },
    orderBy: { name: "asc" },
    select: { id: true, name: true, companyName: true }
  });
}

export async function getProjectOptions() {
  assertDatabaseUrl();
  return prisma.project.findMany({
    where: { archivedAt: null },
    orderBy: { name: "asc" },
    select: { id: true, name: true, clientId: true }
  });
}

export async function getClientDetail(clientId: string): Promise<ClientDetail | null> {
  assertDatabaseUrl();
  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      projects: { orderBy: { createdAt: "desc" }, include: { milestones: true } },
      invoices: {
        orderBy: { createdAt: "desc" },
        include: { client: { select: { name: true, email: true, companyName: true } }, project: { select: { name: true } }, items: { select: { id: true } } }
      },
      payments: { orderBy: { paymentDate: "desc" }, include: { allocations: { include: { invoice: true } } } },
      revenueRecords: true,
      costRecords: true
    }
  });

  if (!client) {
    return null;
  }

  const list = (await getClients()).find((item) => item.id === client.id);

  return {
    id: client.id,
    name: client.name,
    email: client.email,
    companyName: client.companyName,
    contactPerson: client.contactPerson,
    phone: client.phone,
    type: client.type,
    status: client.status,
    contractStatus: client.contractStatus,
    startDate: client.startDate,
    tags: client.tags,
    createdAt: client.createdAt,
    invoices: client.invoices.map(mapInvoiceListItem),
    projects: client.projects.map((project) => ({
      id: project.id,
      name: project.name,
      status: project.status,
      priority: project.priority,
      deadline: project.deadline,
      progress: project.progress,
      delayed: isProjectDelayed(project.revisedDeadline ?? project.deadline, project.status),
      milestoneCount: project.milestones.length
    })),
    payments: client.payments.map((payment) => ({
      id: payment.id,
      paymentDate: payment.paymentDate,
      amountReceived: decimalToNumber(payment.amountReceived),
      method: payment.method,
      referenceNumber: payment.referenceNumber,
      allocatedAmount: payment.allocations.reduce((sum, allocation) => sum + decimalToNumber(allocation.amount), 0)
    })),
    metrics: {
      totalRevenue: list?.totalLifetimeRevenue ?? 0,
      totalCosts: list?.totalCosts ?? 0,
      profit: list?.profit ?? 0,
      marginPercent: marginPercent(list?.totalLifetimeRevenue ?? 0, list?.totalCosts ?? 0),
      outstandingBalance: list?.outstandingBalance ?? 0,
      healthScore: list?.healthScore ?? 100,
      healthBand: list?.healthBand ?? "Healthy"
    }
  };
}

export async function getInvoices(filters?: {
  clientId?: string;
  type?: InvoiceListItem["type"];
  status?: InvoiceListItem["status"];
  search?: string;
  paymentState?: "PAID" | "PENDING" | "PARTIAL";
}): Promise<InvoiceListItem[]> {
  assertDatabaseUrl();
  const invoices = await prisma.invoice.findMany({
    where: {
      clientId: filters?.clientId || undefined,
      type: filters?.type || undefined,
      status: filters?.status || undefined,
      OR: filters?.search
        ? [
            { invoiceNumber: { contains: filters.search, mode: "insensitive" } },
            { client: { name: { contains: filters.search, mode: "insensitive" } } },
            { client: { companyName: { contains: filters.search, mode: "insensitive" } } },
            { project: { name: { contains: filters.search, mode: "insensitive" } } }
          ]
        : undefined
    },
    orderBy: { createdAt: "desc" },
    include: {
      client: { select: { name: true, email: true, companyName: true } },
      project: { select: { name: true } },
      items: { select: { id: true } }
    }
  });

  return invoices.map(mapInvoiceListItem).filter((invoice) => {
    if (!filters?.paymentState) {
      return true;
    }

    if (filters.paymentState === "PAID") {
      return invoice.balanceAmount <= 0;
    }

    if (filters.paymentState === "PARTIAL") {
      return invoice.amountPaid > 0 && invoice.balanceAmount > 0;
    }

    return invoice.amountPaid <= 0 && invoice.balanceAmount > 0;
  });
}

export async function getInvoiceDetail(invoiceId: string): Promise<InvoiceDetail | null> {
  assertDatabaseUrl();
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      client: { select: { id: true, name: true, email: true, companyName: true } },
      project: { select: { id: true, name: true } },
      allocations: { include: { payment: true }, orderBy: { createdAt: "desc" } },
      items: { orderBy: { createdAt: "asc" } }
    }
  });

  if (!invoice) {
    return null;
  }

  return {
    id: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    type: invoice.type,
    status: invoice.status,
    totalAmount: decimalToNumber(invoice.totalAmount),
    taxAmount: decimalToNumber(invoice.taxAmount),
    discountAmount: decimalToNumber(invoice.discountAmount),
    finalAmount: decimalToNumber(invoice.finalAmount),
    amountPaid: decimalToNumber(invoice.amountPaid),
    balanceAmount: decimalToNumber(invoice.balanceAmount),
    projectCost: decimalToNumber(invoice.projectCost),
    advancePercent: invoice.advancePercent === null ? null : decimalToNumber(invoice.advancePercent),
    advanceAmount: decimalToNumber(invoice.advanceAmount),
    timeline: invoice.timeline,
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate,
    createdAt: invoice.createdAt,
    notes: invoice.notes,
    client: invoice.client,
    project: invoice.project,
    payments: invoice.allocations.map((allocation) => ({
      id: allocation.payment.id,
      amount: decimalToNumber(allocation.amount),
      paymentDate: allocation.payment.paymentDate,
      method: allocation.payment.method,
      referenceNumber: allocation.payment.referenceNumber
    })),
    items: invoice.items.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      quantity: item.quantity,
      unitPrice: decimalToNumber(item.unitPrice),
      total: decimalToNumber(item.total)
    }))
  };
}

export async function getDraftInvoice(invoiceId: string) {
  assertDatabaseUrl();
  return prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { items: { orderBy: { createdAt: "asc" } } }
  });
}

export async function getProjects() {
  assertDatabaseUrl();
  const projects = await prisma.project.findMany({
    where: { archivedAt: null },
    orderBy: [{ deadline: "asc" }, { createdAt: "desc" }],
    include: {
      client: { select: { id: true, name: true, companyName: true } },
      invoices: true,
      milestones: true
    }
  });

  return projects.map((project) => ({
    ...project,
    budgetAmount: decimalToNumber(project.budgetAmount),
    internalCostEstimate: decimalToNumber(project.internalCostEstimate),
    deductionAmount: decimalToNumber(project.deductionAmount),
    delayed: isProjectDelayed(project.revisedDeadline ?? project.deadline, project.status),
    daysDelayed: isProjectDelayed(project.revisedDeadline ?? project.deadline, project.status)
      ? Math.abs(daysBetween(project.revisedDeadline ?? project.deadline ?? new Date()))
      : 0,
    invoiceStatus: project.invoices.some((invoice) => invoice.status === "PAID") ? "Paid" : project.invoices.length ? "Open" : "Unbilled",
    milestoneProgress:
      project.milestones.length === 0
        ? project.progress
        : Math.round((project.milestones.filter((milestone) => milestone.status === "DONE").length / project.milestones.length) * 100)
  }));
}

export async function getProjectDetail(projectId: string) {
  assertDatabaseUrl();
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      client: { select: { id: true, name: true, companyName: true } },
      milestones: { orderBy: { dueDate: "asc" } },
      invoices: { include: { client: { select: { name: true, email: true, companyName: true } }, project: { select: { name: true } }, items: { select: { id: true } } } },
      revenueRecords: true,
      costRecords: true,
      revisions: { orderBy: { createdAt: "desc" } },
      scopeChanges: { orderBy: { createdAt: "desc" } }
    }
  });

  if (!project) {
    return null;
  }

  const revenue = project.revenueRecords.reduce((sum, record) => sum + decimalToNumber(record.amount), 0) + project.invoices.reduce((sum, invoice) => sum + decimalToNumber(invoice.finalAmount), 0);
  const costs = project.costRecords.reduce((sum, record) => sum + decimalToNumber(record.amount), 0) + decimalToNumber(project.internalCostEstimate);

  return {
    ...project,
    budgetAmount: decimalToNumber(project.budgetAmount),
    internalCostEstimate: decimalToNumber(project.internalCostEstimate),
    deductionAmount: decimalToNumber(project.deductionAmount),
    delayed: isProjectDelayed(project.revisedDeadline ?? project.deadline, project.status),
    revenue,
    costs,
    profit: roundMoney(revenue - costs),
    marginPercent: marginPercent(revenue, costs),
    invoices: project.invoices.map(mapInvoiceListItem)
  };
}

export async function getPayments() {
  assertDatabaseUrl();
  const payments = await prisma.payment.findMany({
    orderBy: { paymentDate: "desc" },
    include: {
      client: { select: { id: true, name: true, companyName: true } },
      enteredBy: { select: { name: true, email: true } },
      allocations: { include: { invoice: { select: { id: true, invoiceNumber: true } } } }
    }
  });

  return payments.map((payment) => {
    const allocatedAmount = payment.allocations.reduce((sum, allocation) => sum + decimalToNumber(allocation.amount), 0);
    const amountReceived = decimalToNumber(payment.amountReceived);
    return {
      ...payment,
      amountReceived,
      allocatedAmount,
      unallocatedAmount: roundMoney(amountReceived - allocatedAmount)
    };
  });
}

export async function getFinanceSummary() {
  assertDatabaseUrl();
  const [clients, revenueRecords, costRecords, invoices] = await Promise.all([
    getClients(),
    prisma.revenueRecord.findMany({ include: { client: true, project: true }, orderBy: { recognizedDate: "desc" } }),
    prisma.costRecord.findMany({ include: { client: true, project: true }, orderBy: { incurredDate: "desc" } }),
    getInvoices()
  ]);
  const revenueTotal =
    revenueRecords.filter((record) => record.status === "RECOGNIZED").reduce((sum, record) => sum + decimalToNumber(record.amount), 0) +
    invoices.filter((invoice) => ["GENERATED", "SENT", "PARTIALLY_PAID", "PAID"].includes(invoice.status)).reduce((sum, invoice) => sum + invoice.finalAmount, 0);
  const costTotal = costRecords.reduce((sum, record) => sum + decimalToNumber(record.amount), 0);
  const mrr = revenueRecords.filter((record) => record.status === "RECOGNIZED").reduce((sum, record) => sum + monthlyEquivalent(decimalToNumber(record.amount), record.frequency), 0);

  return {
    revenueTotal: roundMoney(revenueTotal),
    costTotal: roundMoney(costTotal),
    profit: roundMoney(revenueTotal - costTotal),
    marginPercent: marginPercent(revenueTotal, costTotal),
    mrr: roundMoney(mrr),
    arr: annualEquivalent(mrr, "MONTHLY"),
    outstanding: invoices.reduce((sum, invoice) => sum + invoice.balanceAmount, 0),
    clients,
    revenueRecords: revenueRecords.map((record) => ({ ...record, amount: decimalToNumber(record.amount) })),
    costRecords: costRecords.map((record) => ({ ...record, amount: decimalToNumber(record.amount) }))
  };
}

export async function getDashboardOverview(): Promise<DashboardOverview> {
  assertDatabaseUrl();

  const month = currentMonthRange();
  const [clients, invoices, projects, payments, finance] = await Promise.all([
    getClients(),
    getInvoices(),
    getProjects(),
    getPayments(),
    getFinanceSummary()
  ]);
  const monthlyRevenue = invoices
    .filter((invoice) => invoice.issueDate >= month.start && invoice.issueDate < month.end)
    .reduce((sum, invoice) => sum + invoice.finalAmount, 0);
  const monthlyCosts = finance.costRecords
    .filter((record) => record.incurredDate >= month.start && record.incurredDate < month.end)
    .reduce((sum, record) => sum + record.amount, 0);
  const overdueInvoices = invoices.filter((invoice) => invoice.isOverdue);
  const delayedProjects = projects.filter((project) => project.delayed);
  const receivedPayments = payments.reduce((sum, payment) => sum + payment.amountReceived, 0);
  const expectedFromInvoices = invoices.reduce((sum, invoice) => sum + invoice.finalAmount, 0);
  const expectedFromOrders = projects.reduce((sum, project) => sum + project.budgetAmount, 0);

  return {
    clientCount: clients.length,
    invoiceCount: invoices.length,
    draftCount: invoices.filter((invoice) => invoice.status === "DRAFT").length,
    paidCount: invoices.filter((invoice) => invoice.status === "PAID").length,
    generatedRevenue: finance.revenueTotal,
    activeProjects: projects.filter((project) => !["COMPLETED", "DELIVERED", "CANCELLED"].includes(project.status)).length,
    monthlyRevenue: roundMoney(monthlyRevenue),
    outstandingInvoices: roundMoney(invoices.reduce((sum, invoice) => sum + invoice.balanceAmount, 0)),
    overdueInvoicesCount: overdueInvoices.length,
    monthlyCosts: roundMoney(monthlyCosts),
    estimatedMonthlyProfit: roundMoney(monthlyRevenue - monthlyCosts),
    delayedProjectsCount: delayedProjects.length,
    mostProfitableClients: [...clients].sort((a, b) => b.profit - a.profit).slice(0, 5),
    lowMarginClients: [...clients].filter((client) => client.totalLifetimeRevenue > 0).sort((a, b) => a.profit - b.profit).slice(0, 5),
    clientsWithOverduePayments: clients.filter((client) => client.outstandingBalance > 0).slice(0, 5),
    recentPayments: payments.slice(0, 6),
    paymentGraph: {
      expectedFromInvoices: roundMoney(expectedFromInvoices),
      receivedPayments: roundMoney(receivedPayments),
      expectedFromOrders: roundMoney(expectedFromOrders)
    }
  };
}
