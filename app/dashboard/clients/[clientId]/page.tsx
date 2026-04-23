import Link from "next/link";
import type { Route } from "next";
import { notFound } from "next/navigation";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { ClientForm } from "@/components/forms/client-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { deleteClient } from "@/lib/actions";
import { getClientDetail } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

async function deleteCurrentClient(clientId: string) {
  "use server";
  return deleteClient(clientId);
}

export default async function ClientDetailPage({
  params
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const client = await getClientDetail(clientId);

  if (!client) {
    notFound();
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-6">
        <Card>
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <Link className="text-sm font-medium text-accent" href="/dashboard/clients">
                Back to clients
              </Link>
              <h2 className="mt-3 text-2xl font-semibold text-ink">{client.name}</h2>
              <p className="mt-2 text-sm text-slate-600">
                {client.companyName}
              </p>
              <p className="mt-1 text-sm text-slate-500">Client since {formatDate(client.createdAt)}</p>
            </div>
            <DeleteButton action={deleteCurrentClient.bind(null, client.id)} label="client" redirectTo="/dashboard/clients" />
          </div>
          <ClientForm
            defaultValues={{
              id: client.id,
              name: client.name,
              companyName: client.companyName,
              type: client.type,
              status: client.status,
              contractStatus: client.contractStatus,
              startDate: client.startDate ?? undefined,
              tagsText: client.tags.join(", ")
            }}
            submitLabel="Update client"
          />
        </Card>
      </div>

      <div className="grid gap-6">
        <Card>
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-ink">Invoice History</h3>
              <p className="mt-2 text-sm text-slate-600">All invoices linked to this client.</p>
            </div>
            <Link className="text-sm font-semibold text-accent" href="/dashboard/invoices">
              Open invoices
            </Link>
          </div>
          <div className="grid gap-4">
            {client.invoices.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 px-5 py-8 text-center text-sm text-slate-500">
                No invoices for this client yet.
              </div>
            ) : (
              client.invoices.map((invoice) => (
                <Link
                  key={invoice.id}
                  className="grid gap-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-5 transition hover:border-accent/30 hover:bg-white"
                  href={`/dashboard/invoices/${invoice.id}` as Route}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Badge tone={invoice.status === "PAID" ? "success" : invoice.status === "GENERATED" ? "warning" : "default"}>
                        {invoice.status}
                      </Badge>
                      <span className="text-sm font-medium text-slate-600">{invoice.type}</span>
                    </div>
                    <span className="text-sm text-slate-500">{formatDate(invoice.createdAt)}</span>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">{formatCurrency(invoice.finalAmount)}</p>
                </Link>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
