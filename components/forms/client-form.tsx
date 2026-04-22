"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type ClientInput, clientSchema } from "@/validators/client";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { clientStatuses, clientTypes } from "@/lib/constants";

export function ClientForm({
  defaultValues,
  submitLabel = "Save client",
  onSuccess
}: {
  defaultValues?: Partial<ClientInput>;
  submitLabel?: string;
  onSuccess?: () => void;
}) {
  const form = useForm<ClientInput>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      id: defaultValues?.id,
      name: defaultValues?.name ?? "",
      email: defaultValues?.email ?? "",
      companyName: defaultValues?.companyName ?? "",
      contactPerson: "",
      phone: "",
      type: defaultValues?.type ?? "SERVICE",
      status: defaultValues?.status ?? "ACTIVE",
      contractStatus: defaultValues?.contractStatus ?? "NONE",
      startDate: defaultValues?.startDate,
      tagsText: defaultValues?.tagsText ?? ""
    }
  });

  return (
    <form action="/api/clients" className="grid gap-4" method="post">
      <input type="hidden" {...form.register("id")} />
      <Field error={form.formState.errors.name?.message} label="Name">
        <Input placeholder="Sarah Ali" {...form.register("name")} />
      </Field>
      <Field error={form.formState.errors.companyName?.message} label="Company">
        <Input placeholder="Client Studio LLC" {...form.register("companyName")} />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Client type">
          <Select {...form.register("type")}>
            {clientTypes.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Status">
          <Select {...form.register("status")}>
            {clientStatuses.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Contract status">
          <Select {...form.register("contractStatus")}>
            <option value="NONE">None</option>
            <option value="PENDING">Pending</option>
            <option value="ACTIVE">Active</option>
            <option value="EXPIRED">Expired</option>
          </Select>
        </Field>
        <Field label="Start date">
          <Input type="date" {...form.register("startDate")} />
        </Field>
      </div>
      <Field label="Tags">
        <Input placeholder="retainer, priority, ecommerce" {...form.register("tagsText")} />
      </Field>
      <Button className="w-full" type="submit">
        {submitLabel}
      </Button>
    </form>
  );
}

export function ClientModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} type="button">
        Add client
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-4 py-6">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[28px] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.25)]">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Client</p>
                <h2 className="mt-2 text-2xl font-semibold text-ink">Add client</h2>
              </div>
              <button className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600" onClick={() => setOpen(false)} type="button">
                Close
              </button>
            </div>
            <ClientForm onSuccess={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </>
  );
}
