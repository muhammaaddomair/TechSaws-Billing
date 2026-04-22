import Link from "next/link";
import type { Route } from "next";
import { Users2 } from "lucide-react";
import { ClientModal } from "@/components/forms/client-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { clientStatuses, clientTypes, labelFor } from "@/lib/constants";
import { getClients } from "@/lib/data";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ClientsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const rawFilters = await searchParams;
  const search = typeof rawFilters.search === "string" ? rawFilters.search.toLowerCase() : "";
  const type = typeof rawFilters.type === "string" ? rawFilters.type : "";
  const status = typeof rawFilters.status === "string" ? rawFilters.status : "";
  const allClients = await getClients();
  const clients = allClients.filter((client) => {
    const matchesSearch = search
      ? [client.name, client.companyName].some((value) => value.toLowerCase().includes(search))
      : true;
    const matchesType = type ? client.type === type : true;
    const matchesStatus = status ? client.status === status : true;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="grid gap-6">
      <Card className="rounded-[24px] bg-[#f7f2ec]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white">
              <Users2 className="h-3.5 w-3.5" />
              Clients
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink">All clients</h2>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
            <form className="grid gap-3 sm:grid-cols-[minmax(180px,1fr)_180px_160px_auto]" method="get">
              <input
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-accent"
                defaultValue={search}
                name="search"
                placeholder="Search clients"
              />
              <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-accent" defaultValue={type} name="type">
                <option value="">All types</option>
                {clientTypes.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
              <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-accent" defaultValue={status} name="status">
                <option value="">All statuses</option>
                {clientStatuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
              <button className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white" type="submit">Search</button>
            </form>
            <ClientModal />
          </div>
        </div>
      </Card>

      <Card className="rounded-[24px]">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-ink">Clients list</h2>
          <Badge>{clients.length} total</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                <th className="px-4">Company</th>
                <th className="px-4">Client type</th>
                <th className="px-4">Status</th>
                <th className="px-4">Created</th>
                <th className="px-4">Open</th>
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr><td className="px-4 py-10 text-center text-sm text-slate-500" colSpan={5}>No clients match the current filters.</td></tr>
              ) : clients.map((client) => (
                <tr key={client.id} className="bg-[#fbfaf8] text-sm text-slate-700">
                  <td className="rounded-l-2xl px-4 py-4">
                    <div className="font-semibold text-slate-950">{client.companyName}</div>
                    <div className="mt-1 text-sm text-slate-500">{client.name}</div>
                  </td>
                  <td className="px-4 py-4">{labelFor(client.type, clientTypes)}</td>
                  <td className="px-4 py-4">
                    <Badge tone={client.status === "ACTIVE" ? "success" : client.status === "RISK" ? "danger" : client.status === "WATCH" ? "warning" : "default"}>
                      {labelFor(client.status, clientStatuses)}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">{formatDate(client.createdAt)}</td>
                  <td className="rounded-r-2xl px-4 py-4">
                    <Link className="font-semibold text-slate-950" href={`/dashboard/clients/${client.id}` as Route}>
                      Open profile
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
