import { ClipboardList } from "lucide-react";
import { TaskForm } from "@/components/forms/operation-forms";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getClientOptions, getProjects, getTasks } from "@/lib/data";
import { labelFor, priorities, taskStatuses } from "@/lib/constants";
import { daysBetween } from "@/lib/business";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
  const [clients, projects, tasks] = await Promise.all([getClientOptions(), getProjects(), getTasks()]);
  const projectOptions = projects.map((project) => ({ id: project.id, name: project.name, clientId: project.clientId }));

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="rounded-[32px] bg-[#f7f2ec]">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white">
            <ClipboardList className="h-3.5 w-3.5" />
            Tasks
          </div>
          <TaskForm clients={clients} projects={projectOptions} />
        </Card>
        <Card className="rounded-[32px] bg-black text-white">
          <h2 className="text-xl font-semibold">Task summary</h2>
          <div className="mt-5 grid gap-3">
            <Stat label="Open" value={tasks.filter((task) => !["DONE", "CANCELLED"].includes(task.status)).length.toString()} />
            <Stat label="Blocked" value={tasks.filter((task) => task.status === "BLOCKED").length.toString()} />
            <Stat label="Overdue" value={tasks.filter((task) => task.dueDate && daysBetween(task.dueDate) < 0 && task.status !== "DONE").length.toString()} />
          </div>
        </Card>
      </div>

      <Card>
        <div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-semibold text-ink">Task list</h2><Badge>{tasks.length}</Badge></div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead><tr className="text-left text-xs uppercase tracking-[0.2em] text-slate-500"><th className="px-4">Task</th><th className="px-4">Client</th><th className="px-4">Project</th><th className="px-4">Priority</th><th className="px-4">Due</th><th className="px-4">Status</th><th className="px-4">Updated</th></tr></thead>
            <tbody>
              {tasks.length === 0 ? <tr><td className="px-4 py-10 text-center text-sm text-slate-500" colSpan={7}>No tasks yet.</td></tr> : tasks.map((task) => {
                const overdue = task.dueDate ? daysBetween(task.dueDate) < 0 && task.status !== "DONE" : false;
                return <tr key={task.id} className="bg-[#fbfaf8] text-sm"><td className="rounded-l-2xl px-4 py-4 font-semibold text-slate-900">{task.title}</td><td className="px-4 py-4">{task.client?.companyName ?? "Internal"}</td><td className="px-4 py-4">{task.project?.name ?? "-"}</td><td className="px-4 py-4">{labelFor(task.priority, priorities)}</td><td className="px-4 py-4">{task.dueDate ? formatDate(task.dueDate) : "-"}</td><td className="px-4 py-4"><Badge tone={overdue ? "danger" : task.status === "DONE" ? "success" : "default"}>{overdue ? "Overdue" : labelFor(task.status, taskStatuses)}</Badge></td><td className="rounded-r-2xl px-4 py-4">{formatDate(task.updatedAt)}</td></tr>;
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3"><span className="text-sm text-white/70">{label}</span><span className="font-semibold">{value}</span></div>;
}
