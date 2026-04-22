"use client";

import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { saveInvoiceDraft } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/utils";
import { type InvoiceDraftInput, invoiceDraftSchema } from "@/validators/invoice";

type ClientOption = {
  id: string;
  name: string;
  companyName: string;
};

type InvoiceFormProps = {
  clients: ClientOption[];
  defaultValues?: {
    id: string;
    clientId: string;
    projectId?: string | null;
    type: InvoiceDraftInput["type"];
    issueDate?: Date;
    dueDate?: Date | null;
    notes?: string | null;
    items: Array<{
      id: string;
      title: string;
      description: string | null;
      quantity: number;
      unitPrice: number;
    }>;
  };
};

export function InvoiceForm({ clients, defaultValues }: InvoiceFormProps) {
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<InvoiceDraftInput>({
    resolver: zodResolver(invoiceDraftSchema),
    defaultValues: {
      id: defaultValues?.id,
      clientId: defaultValues?.clientId ?? clients[0]?.id ?? "",
      projectId: defaultValues?.projectId ?? "",
      type: defaultValues?.type ?? "DEVELOPMENT",
      issueDate: defaultValues?.issueDate ?? new Date(),
      notes: defaultValues?.notes ?? "",
      items:
        defaultValues?.items.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description ?? "",
          quantity: item.quantity,
          unitPrice: item.unitPrice
        })) ?? [{ title: "", description: "", quantity: 1, unitPrice: 0 }]
    }
  });
  const type = form.watch("type");
  const items = form.watch("items");
  const { fields, append, remove, replace } = useFieldArray({
    control: form.control,
    name: "items"
  });

  useEffect(() => {
    if (type === "SUBSCRIPTION") {
      replace([]);
      return;
    }

    if (fields.length === 0) {
      replace([{ title: "", description: "", quantity: 1, unitPrice: 0 }]);
    }
  }, [fields.length, replace, type]);

  const estimatedTotal =
    type === "DEVELOPMENT"
      ? items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), 0)
      : 0;

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await saveInvoiceDraft(values);
      setServerMessage(result.message);

      if (result.success && !values.id) {
        form.reset({
          clientId: clients[0]?.id ?? "",
          projectId: "",
          type: "DEVELOPMENT",
          issueDate: new Date(),
          notes: "",
          items: [{ title: "", description: "", quantity: 1, unitPrice: 0 }]
        });
      }
    });
  });

  return (
    <form className="grid gap-5" onSubmit={onSubmit}>
      <input type="hidden" {...form.register("id")} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field error={form.formState.errors.clientId?.message} label="Client">
          <Select {...form.register("clientId")}>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name} - {client.companyName}
              </option>
            ))}
          </Select>
        </Field>
        <Field error={form.formState.errors.type?.message} label="Invoice Type">
          <Select {...form.register("type")}>
            <option value="DEVELOPMENT">Development</option>
            <option value="SUBSCRIPTION">Subscription</option>
            <option value="SERVICE">Service</option>
            <option value="HOSTING">Hosting/server</option>
            <option value="DOMAIN">Domain</option>
            <option value="MAILBOX">Mailbox/email</option>
            <option value="MAINTENANCE">Maintenance/support</option>
            <option value="OTHER">Other</option>
          </Select>
        </Field>
        <Field label="Issue date">
          <Input type="date" {...form.register("issueDate")} />
        </Field>
        <Field label="Due date">
          <Input type="date" {...form.register("dueDate")} />
        </Field>
      </div>

      {type === "DEVELOPMENT" ? (
        <div className="grid gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Invoice Items</h3>
              <p className="text-sm text-slate-500">Development drafts are calculated from these line items.</p>
            </div>
            <Button
              onClick={() => append({ title: "", description: "", quantity: 1, unitPrice: 0 })}
              type="button"
              variant="ghost"
            >
              Add item
            </Button>
          </div>
          {fields.map((field, index) => (
            <div key={field.id} className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field error={form.formState.errors.items?.[index]?.title?.message} label="Title">
                  <Input placeholder="Frontend retainer" {...form.register(`items.${index}.title`)} />
                </Field>
                <Field error={form.formState.errors.items?.[index]?.description?.message} label="Description">
                  <Textarea placeholder="Monthly feature delivery and support" {...form.register(`items.${index}.description`)} />
                </Field>
              </div>
              <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
                <Field error={form.formState.errors.items?.[index]?.quantity?.message} label="Quantity">
                  <Input min="1" step="1" type="number" {...form.register(`items.${index}.quantity`)} />
                </Field>
                <Field error={form.formState.errors.items?.[index]?.unitPrice?.message} label="Unit Price">
                  <Input min="0" step="0.01" type="number" {...form.register(`items.${index}.unitPrice`)} />
                </Field>
                <div className="flex items-end">
                  <Button
                    className="w-full"
                    disabled={fields.length === 1}
                    onClick={() => remove(index)}
                    type="button"
                    variant="danger"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {form.formState.errors.items?.message ? (
            <p className="text-sm text-rose-600">{form.formState.errors.items.message}</p>
          ) : null}
          <div className="rounded-2xl bg-mist px-4 py-3 text-sm font-medium text-slate-700">
            Draft total: {formatCurrency(estimatedTotal)}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-accent/30 bg-mist px-4 py-5 text-sm text-slate-700">
          Subscription invoices pull all subscriptions for the selected client when you generate the invoice. A 25% service tax is applied automatically.
        </div>
      )}

      <Field label="Notes">
        <Textarea placeholder="Client-visible notes or payment instructions" {...form.register("notes")} />
      </Field>

      {serverMessage ? <p className="text-sm text-slate-600">{serverMessage}</p> : null}
      <Button disabled={isPending} type="submit">
        {isPending ? "Saving..." : defaultValues?.id ? "Update draft invoice" : "Create draft invoice"}
      </Button>
    </form>
  );
}
