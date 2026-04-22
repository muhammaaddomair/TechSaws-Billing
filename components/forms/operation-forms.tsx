"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import {
  addInternalNote,
  renewAsset,
  saveAsset,
  saveCostRecord,
  saveMilestone,
  savePayment,
  saveRevenueRecord,
  saveTask,
} from "@/lib/actions";
import {
  assetSchema,
  costRecordSchema,
  milestoneSchema,
  noteSchema,
  paymentRequestSchema,
  paymentSchema,
  paymentStatusSchema,
  projectSchema,
  renewalSchema,
  revenueRecordSchema,
  taskSchema,
  type AssetInput,
  type CostRecordInput,
  type MilestoneInput,
  type PaymentInput,
  type PaymentRequestInput,
  type PaymentStatusInput,
  type ProjectInput,
  type RenewalInput,
  type RevenueRecordInput,
  type TaskInput
} from "@/validators/operations";
import {
  assetTypes,
  billingCycles,
  costCategories,
  paymentMethods,
  priorities,
  projectStatuses,
  revenueCategories,
  taskStatuses
} from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type ClientOption = { id: string; name: string; companyName: string };
type ProjectOption = { id: string; name: string; clientId: string };
type InvoiceOption = { id: string; invoiceNumber: string; clientId: string; balanceAmount: number; companyName: string };
type AssetOption = { id: string; name: string; clientId: string };
type PaymentStatusRecord = {
  id: string;
  finalAmount: number;
  amountPaid: number;
  balanceAmount: number;
  status: string;
};

function todayValue() {
  return new Date().toISOString().slice(0, 10);
}

function optionList(options: readonly (readonly [string, string])[]) {
  return options.map(([value, label]) => (
    <option key={value} value={value}>
      {label}
    </option>
  ));
}

function ServerMessage({ message }: { message: string | null }) {
  return message ? <p className="text-sm text-slate-600">{message}</p> : null;
}

export function ProjectForm({
  clients,
  defaultValues,
  onSuccess
}: {
  clients: ClientOption[];
  defaultValues?: Partial<ProjectInput>;
  onSuccess?: () => void;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const form = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      id: defaultValues?.id,
      clientId: defaultValues?.clientId ?? clients[0]?.id ?? "",
      name: defaultValues?.name ?? "",
      type: defaultValues?.type ?? "CLIENT_SERVICE",
      status: defaultValues?.status ?? "NOT_STARTED",
      priority: defaultValues?.priority ?? "MEDIUM",
      description: defaultValues?.description ?? "",
      scopeSummary: defaultValues?.scopeSummary ?? "",
      budgetAmount: defaultValues?.budgetAmount ?? 0,
      internalCostEstimate: defaultValues?.internalCostEstimate ?? 0,
      progress: defaultValues?.progress ?? 0,
      blockers: defaultValues?.blockers ?? ""
    }
  });

  return (
    <form action="/api/projects" className="grid gap-4" method="post">
      <input type="hidden" {...form.register("id")} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field error={form.formState.errors.clientId?.message} label="Client">
          <Select {...form.register("clientId")}>{clients.map((client) => <option key={client.id} value={client.id}>{client.name} - {client.companyName}</option>)}</Select>
        </Field>
        <Field error={form.formState.errors.name?.message} label="Project name">
          <Input {...form.register("name")} placeholder="Client portal build" />
        </Field>
        <Field label="Type">
          <Select {...form.register("type")}>
            <option value="CLIENT_SERVICE">Client service</option>
            <option value="SOFTWARE_PRODUCT">Software product</option>
            <option value="INTERNAL_TOOL">Internal tool</option>
            <option value="SUBSCRIPTION_SETUP">Subscription setup</option>
            <option value="INFRASTRUCTURE">Infrastructure</option>
            <option value="SUPPORT">Support</option>
            <option value="OTHER">Other</option>
          </Select>
        </Field>
        <Field label="Status">
          <Select {...form.register("status")}>{optionList(projectStatuses)}</Select>
        </Field>
        <Field label="Priority">
          <Select {...form.register("priority")}>{optionList(priorities)}</Select>
        </Field>
        <Field error={form.formState.errors.progress?.message} label="Progress %">
          <Input min="0" max="100" type="number" {...form.register("progress")} />
        </Field>
        <Field label="Start date">
          <Input type="date" {...form.register("startDate")} />
        </Field>
        <Field label="Deadline">
          <Input type="date" {...form.register("deadline")} />
        </Field>
        <Field label="Budget / revenue value">
          <Input min="0" step="0.01" type="number" {...form.register("budgetAmount")} />
        </Field>
        <Field label="Internal cost estimate">
          <Input min="0" step="0.01" type="number" {...form.register("internalCostEstimate")} />
        </Field>
      </div>
      <Field label="Scope summary">
        <Textarea {...form.register("scopeSummary")} />
      </Field>
      <Field label="Blockers">
        <Textarea {...form.register("blockers")} />
      </Field>
      <ServerMessage message={message} />
      <Button type="submit">Save project</Button>
    </form>
  );
}

export function MilestoneForm({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<MilestoneInput>({
    resolver: zodResolver(milestoneSchema),
    defaultValues: { projectId, title: "", description: "", status: "TODO", owner: "" }
  });

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit((values) => startTransition(async () => {
      const result = await saveMilestone(values);
      setMessage(result.message);
      if (result.success) {
        router.refresh();
      }
    }))}>
      <input type="hidden" {...form.register("projectId")} />
      <Field error={form.formState.errors.title?.message} label="Milestone title"><Input {...form.register("title")} /></Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Due date"><Input type="date" {...form.register("dueDate")} /></Field>
        <Field label="Status"><Select {...form.register("status")}><option value="TODO">Todo</option><option value="IN_PROGRESS">In progress</option><option value="DONE">Done</option><option value="BLOCKED">Blocked</option><option value="CANCELLED">Cancelled</option></Select></Field>
      </div>
      <Field label="Owner"><Input {...form.register("owner")} /></Field>
      <Field label="Description"><Textarea {...form.register("description")} /></Field>
      <ServerMessage message={message} />
      <Button disabled={isPending} type="submit">{isPending ? "Saving..." : "Add milestone"}</Button>
    </form>
  );
}

export function PaymentForm({ clients, invoices }: { clients: ClientOption[]; invoices: InvoiceOption[] }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<PaymentInput>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      clientId: clients[0]?.id ?? "",
      paymentDate: new Date(),
      amountReceived: 0,
      currency: "USD",
      method: "BANK_TRANSFER",
      allocations: []
    }
  });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "allocations" });
  const amount = Number(form.watch("amountReceived")) || 0;
  const allocated = (form.watch("allocations") ?? []).reduce((sum, allocation) => sum + (Number(allocation.amount) || 0), 0);

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit((values) => startTransition(async () => {
      const result = await savePayment(values);
      setMessage(result.message);
      if (result.success) {
        router.refresh();
      }
    }))}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Client"><Select {...form.register("clientId")}>{clients.map((client) => <option key={client.id} value={client.id}>{client.name} - {client.companyName}</option>)}</Select></Field>
        <Field label="Payment date"><Input type="date" defaultValue={todayValue()} {...form.register("paymentDate")} /></Field>
        <Field error={form.formState.errors.amountReceived?.message} label="Amount received"><Input min="0" step="0.01" type="number" {...form.register("amountReceived")} /></Field>
        <Field label="Method"><Select {...form.register("method")}>{optionList(paymentMethods)}</Select></Field>
        <Field label="Reference / transaction ID"><Input {...form.register("referenceNumber")} /></Field>
        <Field label="Currency"><Input {...form.register("currency")} /></Field>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Invoice allocations</h3>
            <p className="text-sm text-slate-500">Remaining unallocated: {formatCurrency(amount - allocated)}</p>
          </div>
          <Button onClick={() => append({ invoiceId: invoices[0]?.id ?? "", amount: 0 })} type="button" variant="ghost">Add allocation</Button>
        </div>
        <div className="grid gap-3">
          {fields.length === 0 ? <p className="text-sm text-slate-500">Leave allocations empty to record an unapplied payment.</p> : null}
          {fields.map((field, index) => (
            <div className="grid gap-3 md:grid-cols-[1fr_160px_auto]" key={field.id}>
              <Select {...form.register(`allocations.${index}.invoiceId`)}>
                {invoices.map((invoice) => <option key={invoice.id} value={invoice.id}>{invoice.invoiceNumber} - {invoice.companyName} ({formatCurrency(invoice.balanceAmount)})</option>)}
              </Select>
              <Input min="0" step="0.01" type="number" {...form.register(`allocations.${index}.amount`)} />
              <Button onClick={() => remove(index)} type="button" variant="danger">Remove</Button>
            </div>
          ))}
        </div>
      </div>
      <Field label="Notes"><Textarea {...form.register("notes")} /></Field>
      <ServerMessage message={message} />
      <Button disabled={isPending} type="submit">{isPending ? "Saving..." : "Log payment"}</Button>
    </form>
  );
}

export function PaymentRequestForm({ clients, projects, onSuccess }: { clients: ClientOption[]; projects: ProjectOption[]; onSuccess?: () => void }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<PaymentRequestInput>({
    resolver: zodResolver(paymentRequestSchema),
    defaultValues: {
      clientId: clients[0]?.id ?? "",
      projectId: "",
      createProject: false,
      projectName: "",
      projectType: "CLIENT_SERVICE",
      paymentType: "PRODUCT",
      amount: 0,
      advancePercent: 0,
      advanceAmount: 0,
      dueDate: new Date(),
      notes: ""
    }
  });
  const clientId = form.watch("clientId");
  const paymentType = form.watch("paymentType");
  const amount = Number(form.watch("amount")) || 0;
  const advancePercent = Number(form.watch("advancePercent")) || 0;
  const advanceAmount = Number(form.watch("advanceAmount")) || 0;
  const createProject = Boolean(form.watch("createProject"));
  const serviceTax = paymentType === "MONTHLY_SUBSCRIPTION" ? amount * 0.2 : 0;
  const filteredProjects = projects.filter((project) => project.clientId === clientId);

  const updateAdvanceAmount = (value: string) => {
    const percent = Number(value) || 0;
    form.setValue("advancePercent", percent);
    form.setValue("advanceAmount", Number((amount * (percent / 100)).toFixed(2)));
  };

  const updateAdvancePercent = (value: string) => {
    const received = Number(value) || 0;
    form.setValue("advanceAmount", received);
    form.setValue("advancePercent", amount > 0 ? Number(((received / amount) * 100).toFixed(2)) : 0);
  };

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit((values) => startTransition(async () => {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values)
      });
      const result = (await response.json()) as { success: boolean; message: string };
      setMessage(result.message);
      if (result.success) {
        form.reset({
          clientId: clients[0]?.id ?? "",
          projectId: "",
          createProject: false,
          projectName: "",
          projectType: "CLIENT_SERVICE",
          paymentType: "PRODUCT",
          amount: 0,
          advancePercent: 0,
          advanceAmount: 0,
          dueDate: new Date(),
          notes: ""
        });
        router.refresh();
        onSuccess?.();
      }
    }))}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Client">
          <Select {...form.register("clientId")}>{clients.map((client) => <option key={client.id} value={client.id}>{client.name} - {client.companyName}</option>)}</Select>
        </Field>
        <Field label="Payment type">
          <Select {...form.register("paymentType")}>
            <option value="PRODUCT">Product</option>
            <option value="SUPPORT">Support charges</option>
            <option value="MONTHLY_SUBSCRIPTION">Monthly subscription</option>
          </Select>
        </Field>
        <Field error={form.formState.errors.amount?.message} label={paymentType === "PRODUCT" ? "Product amount" : "Amount to be paid"}>
          <Input min="0" step="0.01" type="number" {...form.register("amount")} />
        </Field>
        <Field error={form.formState.errors.dueDate?.message} label={paymentType === "PRODUCT" ? "Due date" : "Expected payment date"}>
          <Input defaultValue={todayValue()} type="date" {...form.register("dueDate")} />
        </Field>
      </div>

      {paymentType === "PRODUCT" ? (
        <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-slate-800">Product project</h3>
            <label className="inline-flex items-center gap-2 text-sm font-medium text-slate-700">
              <input className="h-4 w-4" type="checkbox" {...form.register("createProject")} />
              Add project
            </label>
          </div>
          {createProject ? (
            <div className="grid gap-4 md:grid-cols-2">
              <Field error={form.formState.errors.projectName?.message} label="New project name">
                <Input {...form.register("projectName")} placeholder="Client app, website, portal" />
              </Field>
              <Field label="Project type">
                <Select {...form.register("projectType")}>
                  <option value="SOFTWARE_PRODUCT">Software product</option>
                  <option value="CLIENT_SERVICE">Client service</option>
                  <option value="INTERNAL_TOOL">Internal tool</option>
                  <option value="SUBSCRIPTION_SETUP">Subscription setup</option>
                  <option value="INFRASTRUCTURE">Infrastructure</option>
                  <option value="SUPPORT">Support</option>
                  <option value="OTHER">Other</option>
                </Select>
              </Field>
            </div>
          ) : (
            <Field error={form.formState.errors.projectId?.message} label="Select product">
              <Select {...form.register("projectId")}>
                <option value="">Choose saved project</option>
                {filteredProjects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}
              </Select>
            </Field>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Advance %">
              <Input min="0" max="100" step="0.01" type="number" value={advancePercent} onChange={(event) => updateAdvanceAmount(event.target.value)} />
            </Field>
            <Field label="Advance amount">
              <Input min="0" step="0.01" type="number" value={advanceAmount} onChange={(event) => updateAdvancePercent(event.target.value)} />
            </Field>
          </div>
        </div>
      ) : null}

      <div className="grid gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-700 sm:grid-cols-3">
        <span>Base: {formatCurrency(amount)}</span>
        <span>Service tax: {formatCurrency(serviceTax)}</span>
        <span className="font-semibold text-slate-950">Total: {formatCurrency(amount + serviceTax)}</span>
      </div>
      <Field label="Notes"><Textarea {...form.register("notes")} /></Field>
      <ServerMessage message={message} />
      <Button disabled={isPending} type="submit">{isPending ? "Saving..." : "Add payment"}</Button>
    </form>
  );
}

export function PaymentRequestModal({ clients, projects }: { clients: ClientOption[]; projects: ProjectOption[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} type="button">
        Add new payment
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-4 py-6">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[28px] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.25)]">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Payment</p>
                <h2 className="mt-2 text-2xl font-semibold text-ink">Add new payment</h2>
              </div>
              <button className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600" onClick={() => setOpen(false)} type="button">
                Close
              </button>
            </div>
            <PaymentRequestForm clients={clients} projects={projects} onSuccess={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </>
  );
}

export function ProjectModal({ clients }: { clients: ClientOption[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} type="button">
        Add project
      </Button>
      {open ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 px-4 py-6">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[28px] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.25)]">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Project</p>
                <h2 className="mt-2 text-2xl font-semibold text-ink">Add project</h2>
              </div>
              <button className="rounded-xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-600" onClick={() => setOpen(false)} type="button">
                Close
              </button>
            </div>
            <ProjectForm clients={clients} onSuccess={() => setOpen(false)} />
          </div>
        </div>
      ) : null}
    </>
  );
}

export function PaymentStatusControl({ invoice }: { invoice: PaymentStatusRecord }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<PaymentStatusInput>({
    resolver: zodResolver(paymentStatusSchema),
    defaultValues: {
      invoiceId: invoice.id,
      status: invoice.balanceAmount <= 0 ? "PAID" : invoice.amountPaid > 0 ? "PARTIALLY_PAID" : "PENDING",
      amountReceived: 0,
      method: "BANK_TRANSFER",
      referenceNumber: ""
    }
  });
  const status = form.watch("status");

  return (
    <form
      className="grid min-w-[220px] gap-2"
      onSubmit={form.handleSubmit((values) => startTransition(async () => {
        const response = await fetch("/api/payment-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values)
        });
        const result = (await response.json()) as { success: boolean; message: string };
        setMessage(result.message);
        if (result.success) {
          form.reset({
            invoiceId: invoice.id,
            status: values.status,
            amountReceived: 0,
            method: values.method,
            referenceNumber: ""
          });
          router.refresh();
        }
      }))}
    >
      <input type="hidden" {...form.register("invoiceId")} />
      <Select {...form.register("status")}>
        <option value="PENDING">Pending payment</option>
        <option value="PARTIALLY_PAID">Partially paid</option>
        <option value="PAID">Fully paid</option>
      </Select>
      {status === "PARTIALLY_PAID" ? (
        <Input min="0" max={invoice.balanceAmount} step="0.01" type="number" placeholder="Amount received" {...form.register("amountReceived")} />
      ) : null}
      {status !== "PENDING" ? (
        <Select {...form.register("method")}>{optionList(paymentMethods)}</Select>
      ) : null}
      <Button className="w-full" disabled={isPending} type="submit" variant="ghost">{isPending ? "Saving..." : "Update"}</Button>
      {message ? <span className="text-xs text-slate-500">{message}</span> : null}
    </form>
  );
}

export function AssetForm({ clients }: { clients: ClientOption[] }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<AssetInput>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      clientId: clients[0]?.id ?? "",
      name: "",
      type: "DOMAIN",
      billingFrequency: "YEARLY",
      internalCost: 0,
      clientCharge: 0,
      status: "ACTIVE",
      autoRenewal: false,
      alertDays: 30
    }
  });

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit((values) => startTransition(async () => {
      const result = await saveAsset(values);
      setMessage(result.message);
      if (result.success) {
        router.refresh();
      }
    }))}>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Client"><Select {...form.register("clientId")}>{clients.map((client) => <option key={client.id} value={client.id}>{client.name} - {client.companyName}</option>)}</Select></Field>
        <Field error={form.formState.errors.name?.message} label="Asset name"><Input placeholder="example.com" {...form.register("name")} /></Field>
        <Field label="Type"><Select {...form.register("type")}>{optionList(assetTypes)}</Select></Field>
        <Field label="Provider"><Input {...form.register("provider")} /></Field>
        <Field label="Billing frequency"><Select {...form.register("billingFrequency")}>{optionList(billingCycles)}</Select></Field>
        <Field label="Renewal date"><Input type="date" {...form.register("renewalDate")} /></Field>
        <Field label="Internal cost"><Input min="0" step="0.01" type="number" {...form.register("internalCost")} /></Field>
        <Field label="Client charge"><Input min="0" step="0.01" type="number" {...form.register("clientCharge")} /></Field>
        <Field label="Status"><Select {...form.register("status")}><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option><option value="EXPIRING">Expiring</option><option value="EXPIRED">Expired</option><option value="CANCELLED">Cancelled</option></Select></Field>
        <Field label="Alert days"><Input min="1" type="number" {...form.register("alertDays")} /></Field>
      </div>
      <Field label="Notes"><Textarea {...form.register("notes")} /></Field>
      <ServerMessage message={message} />
      <Button disabled={isPending} type="submit">{isPending ? "Saving..." : "Save asset"}</Button>
    </form>
  );
}

export function RenewalForm({ assetId }: { assetId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<RenewalInput>({
    resolver: zodResolver(renewalSchema),
    defaultValues: { assetId, dateRenewed: new Date(), newRenewalDate: new Date(), cost: 0, clientCharge: 0, notes: "" }
  });

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit((values) => startTransition(async () => {
      const result = await renewAsset(values);
      setMessage(result.message);
      if (result.success) {
        router.refresh();
      }
    }))}>
      <input type="hidden" {...form.register("assetId")} />
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Date renewed"><Input type="date" defaultValue={todayValue()} {...form.register("dateRenewed")} /></Field>
        <Field label="New renewal date"><Input type="date" {...form.register("newRenewalDate")} /></Field>
        <Field label="Cost"><Input min="0" step="0.01" type="number" {...form.register("cost")} /></Field>
        <Field label="Client charge"><Input min="0" step="0.01" type="number" {...form.register("clientCharge")} /></Field>
      </div>
      <Field label="Notes"><Textarea {...form.register("notes")} /></Field>
      <ServerMessage message={message} />
      <Button disabled={isPending} type="submit">{isPending ? "Saving..." : "Mark renewed"}</Button>
    </form>
  );
}

export function TaskForm({ clients, projects }: { clients: ClientOption[]; projects: ProjectOption[] }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<TaskInput>({
    resolver: zodResolver(taskSchema),
    defaultValues: { title: "", description: "", status: "TODO", priority: "MEDIUM", clientId: "", projectId: "" }
  });

  return (
    <form className="grid gap-4" onSubmit={form.handleSubmit((values) => startTransition(async () => {
      const result = await saveTask(values);
      setMessage(result.message);
      if (result.success) {
        router.refresh();
      }
    }))}>
      <Field error={form.formState.errors.title?.message} label="Task title"><Input {...form.register("title")} /></Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Status"><Select {...form.register("status")}>{optionList(taskStatuses)}</Select></Field>
        <Field label="Priority"><Select {...form.register("priority")}>{optionList(priorities)}</Select></Field>
        <Field label="Due date"><Input type="date" {...form.register("dueDate")} /></Field>
        <Field label="Related client"><Select {...form.register("clientId")}><option value="">Internal</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.companyName}</option>)}</Select></Field>
        <Field label="Related project"><Select {...form.register("projectId")}><option value="">No project</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</Select></Field>
      </div>
      <Field label="Description"><Textarea {...form.register("description")} /></Field>
      <ServerMessage message={message} />
      <Button disabled={isPending} type="submit">{isPending ? "Saving..." : "Save task"}</Button>
    </form>
  );
}

export function FinanceRecordForms({ clients, projects, assets }: { clients: ClientOption[]; projects: ProjectOption[]; assets: AssetOption[] }) {
  const router = useRouter();
  const [revenueMessage, setRevenueMessage] = useState<string | null>(null);
  const [costMessage, setCostMessage] = useState<string | null>(null);
  const [isRevenuePending, startRevenueTransition] = useTransition();
  const [isCostPending, startCostTransition] = useTransition();
  const revenue = useForm<RevenueRecordInput>({
    resolver: zodResolver(revenueRecordSchema),
    defaultValues: { clientId: clients[0]?.id ?? "", sourceType: "PROJECT_SERVICE", frequency: "ONE_TIME", amount: 0, status: "RECOGNIZED", recognizedDate: new Date() }
  });
  const cost = useForm<CostRecordInput>({
    resolver: zodResolver(costRecordSchema),
    defaultValues: { clientId: "", projectId: "", assetId: "", costType: "OTHER_OPERATIONAL", billingFrequency: "ONE_TIME", amount: 0, incurredDate: new Date() }
  });

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <form className="grid gap-4" onSubmit={revenue.handleSubmit((values) => startRevenueTransition(async () => {
        const result = await saveRevenueRecord(values);
        setRevenueMessage(result.message);
        if (result.success) {
          router.refresh();
        }
      }))}>
        <h3 className="text-lg font-semibold text-ink">Revenue record</h3>
        <Field label="Client"><Select {...revenue.register("clientId")}>{clients.map((client) => <option key={client.id} value={client.id}>{client.companyName}</option>)}</Select></Field>
        <Field label="Category"><Select {...revenue.register("sourceType")}>{optionList(revenueCategories)}</Select></Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Frequency"><Select {...revenue.register("frequency")}>{optionList(billingCycles)}</Select></Field>
          <Field label="Amount"><Input min="0" step="0.01" type="number" {...revenue.register("amount")} /></Field>
          <Field label="Date"><Input defaultValue={todayValue()} type="date" {...revenue.register("recognizedDate")} /></Field>
          <Field label="Project"><Select {...revenue.register("projectId")}><option value="">No project</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</Select></Field>
        </div>
        <Field label="Reference"><Input {...revenue.register("reference")} /></Field>
        <Field label="Notes"><Textarea {...revenue.register("notes")} /></Field>
        <ServerMessage message={revenueMessage} />
        <Button disabled={isRevenuePending} type="submit">{isRevenuePending ? "Saving..." : "Save revenue"}</Button>
      </form>

      <form className="grid gap-4" onSubmit={cost.handleSubmit((values) => startCostTransition(async () => {
        const result = await saveCostRecord(values);
        setCostMessage(result.message);
        if (result.success) {
          router.refresh();
        }
      }))}>
        <h3 className="text-lg font-semibold text-ink">Cost record</h3>
        <Field label="Category"><Select {...cost.register("costType")}>{optionList(costCategories)}</Select></Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Amount"><Input min="0" step="0.01" type="number" {...cost.register("amount")} /></Field>
          <Field label="Frequency"><Select {...cost.register("billingFrequency")}>{optionList(billingCycles)}</Select></Field>
          <Field label="Date"><Input defaultValue={todayValue()} type="date" {...cost.register("incurredDate")} /></Field>
          <Field label="Client"><Select {...cost.register("clientId")}><option value="">Internal/general</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.companyName}</option>)}</Select></Field>
          <Field label="Project"><Select {...cost.register("projectId")}><option value="">No project</option>{projects.map((project) => <option key={project.id} value={project.id}>{project.name}</option>)}</Select></Field>
          <Field label="Asset"><Select {...cost.register("assetId")}><option value="">No asset</option>{assets.map((asset) => <option key={asset.id} value={asset.id}>{asset.name}</option>)}</Select></Field>
        </div>
        <Field label="Vendor/provider"><Input {...cost.register("vendor")} /></Field>
        <Field label="Notes"><Textarea {...cost.register("notes")} /></Field>
        <ServerMessage message={costMessage} />
        <Button disabled={isCostPending} type="submit">{isCostPending ? "Saving..." : "Save cost"}</Button>
      </form>
    </div>
  );
}

export function NoteForm({ entityType, entityId }: { entityType: "CLIENT" | "PROJECT" | "INVOICE" | "PAYMENT" | "ASSET" | "TASK"; entityId: string }) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm({ resolver: zodResolver(noteSchema), defaultValues: { entityType, entityId, body: "" } });

  return (
    <form className="grid gap-3" onSubmit={form.handleSubmit((values) => startTransition(async () => {
      const result = await addInternalNote(values);
      setMessage(result.message);
      if (result.success) {
        router.refresh();
      }
    }))}>
      <input type="hidden" {...form.register("entityType")} />
      <input type="hidden" {...form.register("entityId")} />
      <Field error={form.formState.errors.body?.message} label="Internal note"><Textarea {...form.register("body")} /></Field>
      <ServerMessage message={message} />
      <Button disabled={isPending} type="submit">{isPending ? "Saving..." : "Add note"}</Button>
    </form>
  );
}
