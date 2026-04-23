"use client";

import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Mail, Printer, PlusCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { saveManualInvoice, sendInvoiceEmail } from "@/lib/actions";
import { manualInvoiceSchema, type ManualInvoiceInput } from "@/validators/invoice";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";

type ManualInvoiceModalProps = {
  mode?: "create" | "edit";
  defaultValues?: Partial<ManualInvoiceInput>;
};

function todayValue() {
  return new Date().toISOString().slice(0, 10);
}

function defaultInvoiceNumber() {
  return `INV-${Date.now().toString().slice(-6)}`;
}

const emptyItem = {
  description: "",
  quantity: 1,
  unitPrice: 0,
  amount: 0
};

function roundMoney(value: number) {
  return Number((Number.isFinite(value) ? value : 0).toFixed(2));
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
      invoiceNumber: defaultValues?.invoiceNumber ?? defaultInvoiceNumber(),
      clientName: defaultValues?.clientName ?? "",
      email: defaultValues?.email ?? "",
      companyName: defaultValues?.companyName ?? "",
      issueDate: defaultValues?.issueDate ?? new Date(),
      dueDate: defaultValues?.dueDate,
      notes: defaultValues?.notes ?? "",
      bankName: defaultValues?.bankName ?? "",
      accountName: defaultValues?.accountName ?? "",
      accountNumber: defaultValues?.accountNumber ?? "",
      iban: defaultValues?.iban ?? "",
      subtotal: defaultValues?.subtotal ?? 0,
      taxPercent: defaultValues?.taxPercent ?? 0,
      discountAmount: defaultValues?.discountAmount ?? 0,
      totalAmount: defaultValues?.totalAmount ?? 0,
      items: defaultValues?.items?.length ? defaultValues.items : [emptyItem]
    }
  });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" });
  const watchedItems = form.watch("items");
  const watchedTaxPercent = Number(form.watch("taxPercent")) || 0;
  const watchedDiscount = Number(form.watch("discountAmount")) || 0;
  const calculatedSubtotal = roundMoney(
    (watchedItems ?? []).reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      return sum + quantity * unitPrice;
    }, 0)
  );
  const calculatedTax = roundMoney(calculatedSubtotal * (watchedTaxPercent / 100));
  const calculatedTotal = Math.max(0, roundMoney(calculatedSubtotal + calculatedTax - watchedDiscount));

  useEffect(() => {
    const items = watchedItems ?? [];
    let subtotal = 0;

    items.forEach((item, index) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      const amount = roundMoney(quantity * unitPrice);
      subtotal += amount;

      if (Number(item.amount) !== amount) {
        form.setValue(`items.${index}.amount`, amount, { shouldDirty: true, shouldValidate: false });
      }
    });

    const roundedSubtotal = roundMoney(subtotal);
    const total = roundMoney(roundedSubtotal + roundedSubtotal * (watchedTaxPercent / 100) - watchedDiscount);

    if (Number(form.getValues("subtotal")) !== roundedSubtotal) {
      form.setValue("subtotal", roundedSubtotal, { shouldDirty: true, shouldValidate: false });
    }

    if (Number(form.getValues("totalAmount")) !== total) {
      form.setValue("totalAmount", Math.max(0, total), { shouldDirty: true, shouldValidate: false });
    }
  }, [form, watchedDiscount, watchedItems, watchedTaxPercent]);

  const onSubmit = form.handleSubmit((values) => {
    setMessage(null);
    startTransition(async () => {
      const result = await saveManualInvoice(values);
      setMessage(result.message);
      if (result.success) {
        setOpen(false);
        router.refresh();
        if (mode === "create") {
          form.reset({
            invoiceNumber: defaultInvoiceNumber(),
            clientName: "",
            email: "",
            companyName: "",
            issueDate: new Date(),
            dueDate: undefined,
            notes: "",
            bankName: "",
            accountName: "",
            accountNumber: "",
            iban: "",
            subtotal: 0,
            taxPercent: 0,
            discountAmount: 0,
            totalAmount: 0,
            items: [emptyItem]
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
                <Field error={form.formState.errors.invoiceNumber?.message} label="Invoice #">
                  <Input {...form.register("invoiceNumber")} placeholder="INV-001" />
                </Field>
                <Field error={form.formState.errors.clientName?.message} label="Client name">
                  <Input {...form.register("clientName")} placeholder="Client contact name" />
                </Field>
                <Field error={form.formState.errors.email?.message} label="Email (optional)">
                  <Input {...form.register("email")} placeholder="client@company.com" />
                </Field>
                <Field error={form.formState.errors.companyName?.message} label="Company name">
                  <Input {...form.register("companyName")} placeholder="Company LLC" />
                </Field>
                <Field label="Issue date">
                  <Input defaultValue={todayValue()} type="date" {...form.register("issueDate")} />
                </Field>
                <Field label="Due date">
                  <Input type="date" {...form.register("dueDate")} />
                </Field>
                <Field error={form.formState.errors.taxPercent?.message} label="Tax %">
                  <Input min="0" step="0.01" type="number" {...form.register("taxPercent")} />
                </Field>
                <Field error={form.formState.errors.discountAmount?.message} label="Discount">
                  <Input min="0" step="0.01" type="number" {...form.register("discountAmount")} />
                </Field>
              </div>
              <input type="hidden" {...form.register("subtotal")} />
              <input type="hidden" {...form.register("totalAmount")} />

              <div className="grid gap-3 rounded-[28px] bg-[#f7f2ec] p-5 sm:grid-cols-4">
                <Summary label="Subtotal" value={formatCurrency(calculatedSubtotal)} />
                <Summary label="Tax" value={formatCurrency(calculatedTax)} />
                <Summary label="Discount" value={formatCurrency(watchedDiscount)} />
                <Summary label="Total" value={formatCurrency(calculatedTotal)} />
              </div>

              <div className="grid gap-4 rounded-[28px] bg-[#f7f2ec] p-5 md:grid-cols-2">
                <Field label="Bank name">
                  <Input {...form.register("bankName")} />
                </Field>
                <Field label="Account name">
                  <Input {...form.register("accountName")} />
                </Field>
                <Field label="Account number">
                  <Input {...form.register("accountNumber")} />
                </Field>
                <Field label="IBAN">
                  <Input {...form.register("iban")} />
                </Field>
              </div>

              <div className="grid gap-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold text-slate-900">Invoice items</h3>
                  <Button onClick={() => append(emptyItem)} type="button" variant="ghost">Add item</Button>
                </div>
                <div className="grid gap-3">
                  {fields.map((field, index) => (
                    <div className="grid gap-3 rounded-2xl bg-[#fbfaf8] p-4 md:grid-cols-[1fr_100px_140px_auto]" key={field.id}>
                      <Field error={form.formState.errors.items?.[index]?.description?.message} label={`Description ${index + 1}`}>
                        <Input {...form.register(`items.${index}.description`)} />
                      </Field>
                      <Field error={form.formState.errors.items?.[index]?.quantity?.message} label="QTY">
                        <Input min="0" step="0.01" type="number" {...form.register(`items.${index}.quantity`)} />
                      </Field>
                      <Field error={form.formState.errors.items?.[index]?.unitPrice?.message} label="Unit price">
                        <Input min="0" step="0.01" type="number" {...form.register(`items.${index}.unitPrice`)} />
                      </Field>
                      <input type="hidden" {...form.register(`items.${index}.amount`)} />
                      <button className="self-end rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600 disabled:opacity-50" disabled={fields.length === 1} onClick={() => remove(index)} type="button">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <Field label="Notes">
                <Textarea {...form.register("notes")} placeholder="Invoice notes" />
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
        <Mail className="mr-2 h-4 w-4 shrink-0" />
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
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-slate-950">{value}</p>
    </div>
  );
}
