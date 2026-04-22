import Link from "next/link";
import { notFound } from "next/navigation";
import { MilestoneForm, NoteForm } from "@/components/forms/operation-forms";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getProjectDetail } from "@/lib/data";
import { labelFor, priorities, projectStatuses, taskStatuses } from "@/lib/constants";
import { formatCurrency, formatDate, formatPercent } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const project = await getProjectDetail(projectId);
  if (!project) notFound();

  return (
    <div className="grid gap-6">
      <Card>
        <Link className="text-sm font-medium text-accent" href="/dashboard/projects">Back to projects</Link>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold text-ink">{project.name}</h2>
            <p className="mt-2 text-sm text-slate-600">{project.client.companyName} · {labelFor(project.status, projectStatuses)} · {labelFor(project.priority, priorities)}</p>
          </div>
          <Badge tone={project.delayed ? "danger" : "default"}>{project.delayed ? "Delayed" : `${project.progress}% progress`}</Badge>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <Metric label="Revenue" value={formatCurrency(project.revenue)} />
          <Metric label="Costs" value={formatCurrency(project.costs)} />
          <Metric label="Profit" value={formatCurrency(project.profit)} />
          <Metric label="Margin" value={formatPercent(project.marginPercent)} />
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <h3 className="mb-4 text-xl font-semibold text-ink">Add milestone</h3>
          <MilestoneForm projectId={project.id} />
        </Card>
        <Card>
          <h3 className="mb-4 text-xl font-semibold text-ink">Project overview</h3>
          <div className="grid gap-3 text-sm text-slate-700">
            <Row label="Start date" value={project.startDate ? formatDate(project.startDate) : "-"} />
            <Row label="Original deadline" value={project.deadline ? formatDate(project.deadline) : "-"} />
            <Row label="Revised deadline" value={project.revisedDeadline ? formatDate(project.revisedDeadline) : "-"} />
            <Row label="Delivery date" value={project.deliveryDate ? formatDate(project.deliveryDate) : "-"} />
            <Row label="Budget" value={formatCurrency(project.budgetAmount)} />
            <Row label="Internal estimate" value={formatCurrency(project.internalCostEstimate)} />
            <Row label="Blockers" value={project.blockers ?? "-"} />
          </div>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-xl font-semibold text-ink">Milestones</h3>
          <div className="grid gap-3">
            {project.milestones.length === 0 ? <Empty text="No milestones yet." /> : project.milestones.map((milestone) => (
              <div key={milestone.id} className="rounded-2xl bg-[#fbfaf8] p-4 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-semibold text-slate-900">{milestone.title}</p>
                  <Badge tone={milestone.status === "DONE" ? "success" : "default"}>{milestone.status}</Badge>
                </div>
                <p className="mt-2 text-slate-500">{milestone.dueDate ? formatDate(milestone.dueDate) : "No due date"}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="mb-4 text-xl font-semibold text-ink">Tasks</h3>
          <div className="grid gap-3">
            {project.tasks.length === 0 ? <Empty text="No linked tasks." /> : project.tasks.map((task) => (
              <div key={task.id} className="rounded-2xl bg-[#fbfaf8] p-4 text-sm">
                <p className="font-semibold text-slate-900">{task.title}</p>
                <p className="mt-2 text-slate-500">{labelFor(task.status, taskStatuses)} · {task.dueDate ? formatDate(task.dueDate) : "No due date"}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="mb-4 text-xl font-semibold text-ink">Internal notes</h3>
        <NoteForm entityId={project.id} entityType="PROJECT" />
      </Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-[24px] bg-[#fbfaf8] px-5 py-4"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p></div>;
}
function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4 rounded-2xl bg-[#fbfaf8] px-4 py-3"><span className="text-slate-500">{label}</span><span className="font-medium text-slate-900">{value}</span></div>;
}
function Empty({ text }: { text: string }) {
  return <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">{text}</div>;
}
