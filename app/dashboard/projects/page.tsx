import Link from "next/link";
import type { Route } from "next";
import { BriefcaseBusiness } from "lucide-react";
import { ProjectModal } from "@/components/forms/operation-forms";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getClientOptions, getProjects } from "@/lib/data";
import { labelFor, priorities, projectStatuses } from "@/lib/constants";
import { formatCurrency, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProjectsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const rawFilters = await searchParams;
  const search = typeof rawFilters.search === "string" ? rawFilters.search.toLowerCase() : "";
  const status = typeof rawFilters.status === "string" ? rawFilters.status : "";
  const clientId = typeof rawFilters.clientId === "string" ? rawFilters.clientId : "";
  const [clients, allProjects] = await Promise.all([getClientOptions(), getProjects()]);
  const projects = allProjects.filter((project) => {
    const matchesSearch = search
      ? [project.name, project.client.companyName, project.client.name, project.description ?? "", project.scopeSummary ?? ""].some((value) => value.toLowerCase().includes(search))
      : true;
    const matchesStatus = status ? project.status === status : true;
    const matchesClient = clientId ? project.clientId === clientId : true;
    return matchesSearch && matchesStatus && matchesClient;
  });

  return (
    <div className="grid gap-6">
      <Card className="rounded-[24px] bg-[#f7f2ec]">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white">
              <BriefcaseBusiness className="h-3.5 w-3.5" />
              Projects
            </div>
            <h2 className="text-2xl font-semibold tracking-tight text-ink">All projects</h2>
          </div>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
            <form className="grid gap-3 sm:grid-cols-[minmax(180px,1fr)_180px_180px_auto]" method="get">
              <input
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-accent"
                defaultValue={search}
                name="search"
                placeholder="Search projects"
              />
              <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-accent" defaultValue={clientId} name="clientId">
                <option value="">All clients</option>
                {clients.map((client) => <option key={client.id} value={client.id}>{client.companyName}</option>)}
              </select>
              <select className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-950 outline-none focus:border-accent" defaultValue={status} name="status">
                <option value="">All statuses</option>
                {projectStatuses.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
              <button className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white" type="submit">Search</button>
            </form>
            <ProjectModal clients={clients} />
          </div>
        </div>
      </Card>

      <Card className="rounded-[24px]">
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-xl font-semibold text-ink">Projects list</h2>
          <Badge>{projects.length} total</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.2em] text-slate-500">
                <th className="px-4">Project</th>
                <th className="px-4">Client</th>
                <th className="px-4">Status</th>
                <th className="px-4">Priority</th>
                <th className="px-4">Deadline</th>
                <th className="px-4">Progress</th>
                <th className="px-4">Value</th>
                <th className="px-4">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr><td className="px-4 py-10 text-center text-sm text-slate-500" colSpan={8}>No projects match the current filters.</td></tr>
              ) : projects.map((project) => (
                <tr key={project.id} className="bg-[#fbfaf8] text-sm text-slate-700">
                  <td className="rounded-l-2xl px-4 py-4 font-semibold text-slate-900"><Link href={`/dashboard/projects/${project.id}` as Route}>{project.name}</Link></td>
                  <td className="px-4 py-4">{project.client.companyName}</td>
                  <td className="px-4 py-4"><Badge tone={project.delayed ? "danger" : project.status === "COMPLETED" ? "success" : "default"}>{project.delayed ? "Delayed" : labelFor(project.status, projectStatuses)}</Badge></td>
                  <td className="px-4 py-4">{labelFor(project.priority, priorities)}</td>
                  <td className="px-4 py-4">{project.deadline ? formatDate(project.deadline) : "-"}</td>
                  <td className="px-4 py-4">{project.milestoneProgress}%</td>
                  <td className="px-4 py-4 font-semibold text-slate-900">{formatCurrency(project.budgetAmount)}</td>
                  <td className="rounded-r-2xl px-4 py-4">{project.invoiceStatus}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
