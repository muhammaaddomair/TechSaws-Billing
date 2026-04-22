"use client";

import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Mail, Printer, PlusCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { saveManualInvoice, sendInvoiceEmail } from "@/lib/actions";
import { manualInvoiceSchema, type ManualInvoiceInput } from "@/validators/invoice";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";

type ManualInvoiceModalProps = {
  mode?: "create" | "edit";
  defaultValues?: Partial<ManualInvoiceInput>;
};

function todayValue() {
  return new Date().toISOString().slice(0, 10);
}

export function ManualInvoiceModal({ mode = "create", defaultValues }: ManualInvoiceModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<ManualInvoiceInput>({
    resolver: zodResolver(manualInvoiceSchema),
    defaultValues: {
      id: defaultValues?.id,
      clientName: defaultValues?.clientName ?? "",
      email: defaultValues?.email ?? "",
      companyName: defaultValues?.companyName ?? "",
      totalProjectCost: defaultValues?.totalProjectCost ?? 0,
      advancePercent: defaultValues?.advancePercent ?? 0,
      advanceAmount: defaultValues?.advanceAmount ?? 0,
      timeline: "",
      projectType: defaultValues?.projectType ?? "",
      chargeType: defaultValues?.chargeType ?? "DEVELOPMENT",
      billingMode: defaultValues?.billingMode ?? "ONE_TIME",
      paidAmount: defaultValues?.paidAmount ?? 0,
      issueDate: defaultValues?.issueDate ?? new Date(),
      notes: defaultValues?.notes ?? ""
    }
  });
  const totalProjectCost = Number(form.watch("totalProjectCost")) || 0;
  const advancePercent = Number(form.watch("advancePercent")) || 0;
  const advanceAmount = Number(form.watch("advanceAmount")) || 0;
  const paidAmount = Number(form.watch("paidAmount")) || 0;
  const chargeType = form.watch("chargeType");
  const billingMode = form.watch("billingMode");
  const serviceTax = chargeType === "SUBSCRIPTION" && billingMode === "MONTHLY" ? totalProjectCost * 0.2 : 0;
  const invoiceTotal = totalProjectCost + serviceTax;

  useEffect(() => {
    const computedAmount = totalProjectCost * (advancePercent / 100);
    if (Number.isFinite(computedAmount) && Math.abs(computedAmount - advanceAmount) > 0.01) {
      form.setValue("advanceAmount", Number(computedAmount.toFixed(2)), { shouldValidate: false });
    }
  }, [advanceAmount, advancePercent, form, totalProjectCost]);

  const updatePercentFromAmount = (value: string) => {
    const amount = Number(value) || 0;
    form.setValue("advanceAmount", amount);
    form.setValue("advancePercent", totalProjectCost > 0 ? Number(((amount / totalProjectCost) * 100).toFixed(2)) : 0);
  };

  const onSubmit = form.handleSubmit((values) => {
    setMessage(null);
    startTransition(async () => {
      const result = await saveManualInvoice({
        ...values,
        advanceAmount,
        advancePercent,
        paidAmount,
        totalProjectCost
      });
      setMessage(result.message);
      if (result.success) {
        setOpen(false);
        router.refresh();
        if (mode === "create") {
          form.reset({
            clientName: "",
            email: "",
            companyName: "",
            totalProjectCost: 0,
            advancePercent: 0,
            advanceAmount: 0,
            timeline: "",
            projectType: "",
            chargeType: "DEVELOPMENT",
            billingMode: "ONE_TIME",
            paidAmount: 0,
            issueDate: new Date(),
            notes: ""
          });
        }
      }
    });
  }, (errors) => {
    const firstError = Object.values(errors)[0]?.message;
    setMessage(typeof firstError === "string" ? firstError : "Please check the highlighted invoice fields.");
  });

  return (
    <>
      <Button onClick={() => setOpen(true)} type="button" variant={mode === "create" ? "primary" : "ghost"}>
        {mode === "create" ? <PlusCircle className="mr-2 h-4 w-4" /> : <Edit className="mr-2 h-4 w-4" />}
        {mode === "create" ? "Create invoice" : "Edit"}
      </Button>

      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-4 py-6">
          <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-[34px] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.25)]">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Invoice</p>
                <h2 className="mt-2 text-2xl font-semibold text-ink">{mode === "create" ? "Create invoice" : "Edit invoice"}</h2>
              </div>
              <button className="rounded-xl bg-slate-100 p-2 text-slate-600" onClick={() => setOpen(false)} type="button" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form className="grid gap-5" onSubmit={onSubmit}>
              <input type="hidden" {...form.register("id")} />
              <div className="grid gap-4 md:grid-cols-3">
                <Field error={form.formState.errors.clientName?.message} label="Client name">
                  <Input {...form.register("clientName")} placeholder="Client contact name" />
                </Field>
                <Field error={form.formState.errors.email?.message} label="Email (optional)">
                  <Input {...form.register("email")} placeholder="client@company.com" />
                </Field>
                <Field error={form.formState.errors.companyName?.message} label="Company name">
                  <Input {...form.register("companyName")} placeholder="Company LLC" />
                </Field>
                <Field error={form.formState.errors.totalProjectCost?.message} label="Total project cost">
                  <Input min="0" step="0.01" type="number" {...form.register("totalProjectCost")} />
                </Field>
                <Field error={form.formState.errors.advancePercent?.message} label="Advance %">
                  <Input min="0" max="100" step="0.01" type="number" {...form.register("advancePercent")} />
                </Field>
                <Field error={form.formState.errors.advanceAmount?.message} label="Advance amount">
                  <Input min="0" step="0.01" type="number" value={advanceAmount} onChange={(event) => updatePercentFromAmount(event.target.value)} />
                </Field>
                <Field error={form.formState.errors.projectType?.message} label="Project type">
                  <Input {...form.register("projectType")} placeholder="Website, SaaS tool, support retainer" />
                </Field>
                <Field label="Charge category">
                  <Select {...form.register("chargeType")}>
                    <option value="SUBSCRIPTION">Subscription</option>
                    <option value="DEVELOPMENT">Software</option>
                    <option value="MAINTENANCE">Support charges</option>
                  </Select>
                </Field>
                <Field label="Billing">
                  <Select {...form.register("billingMode")}>
                    <option value="ONE_TIME">One-time</option>
                    <option value="MONTHLY">Monthly subscription</option>
                  </Select>
                </Field>
                <Field label="Paid manually">
                  <Input min="0" step="0.01" type="number" {...form.register("paidAmount")} />
                </Field>
                <Field label="Issue date">
                  <Input defaultValue={todayValue()} type="date" {...form.register("issueDate")} />
                </Field>
                <Field label="Due date">
                  <Input type="date" {...form.register("dueDate")} />
                </Field>
              </div>

              <div className="grid gap-4 rounded-[28px] bg-[#f7f2ec] p-5 md:grid-cols-4">
                <Summary label="Project cost" value={formatCurrency(totalProjectCost)} />
                <Summary label="Service tax" value={formatCurrency(serviceTax)} />
                <Summary label="Invoice total" value={formatCurrency(invoiceTotal)} />
                <Summary label="Remaining" value={formatCurrency(Math.max(0, invoiceTotal - paidAmount))} />
              </div>

              <Field label="Notes">
                <Textarea {...form.register("notes")} placeholder="Manual instructions, terms, or internal context" />
              </Field>

              {message ? <p className="rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">{message}</p> : null}

              <div className="flex flex-wrap justify-end gap-3">
                <Button onClick={() => setOpen(false)} type="button" variant="ghost">Cancel</Button>
                <Button disabled={isPending} type="submit">{isPending ? "Saving..." : "Save invoice"}</Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

export function InvoiceEmailButton({ invoiceId }: { invoiceId: string }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="grid gap-1">
      <Button
        disabled={isPending}
        onClick={() => startTransition(async () => setMessage((await sendInvoiceEmail(invoiceId)).message))}
        type="button"
        variant="ghost"
      >
        <Mail className="mr-2 h-4 w-4" />
        Send email
      </Button>
      {message ? <span className="max-w-[220px] text-xs text-slate-500">{message}</span> : null}
    </div>
  );
}

export function InvoicePdfLink({ href }: { href: string }) {
  return (
    <a className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50" href={href} target="_blank">
      <Printer className="mr-2 h-4 w-4" />
      Generate PDF
    </a>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-3">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  );
}
