import { Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

const settings = [
  ["Company settings", "TechSaws business profile, default contact details, and owner metadata."],
  ["Invoice settings", "Default invoice terms, tax/discount placeholders, and invoice numbering preferences."],
  ["User / role placeholder", "Owner, partner, and staff role support is modelled for role-aware rendering."],
  ["Status / label config", "Centralized constants keep client, project, invoice, and payment states consistent."],
  ["Default currency", "USD is the current default. Payments retain a currency field for future multi-currency support."],
  ["Business preferences", "Renewal alert thresholds, health score thresholds, and project risk thresholds are ready for tuning."]
];

export default function SettingsPage() {
  return (
    <div className="grid gap-6">
      <Card className="rounded-[32px] bg-[#f7f2ec]">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white">
          <Settings className="h-3.5 w-3.5" />
          Settings
        </div>
        <h2 className="text-3xl font-semibold tracking-tight text-ink">Operational preferences and configuration surface.</h2>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {settings.map(([title, description]) => (
          <Card className="rounded-[28px]" key={title}>
            <div className="mb-3"><Badge>Configured</Badge></div>
            <h3 className="text-lg font-semibold text-ink">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
