import Link from "next/link";
import type { Route } from "next";
import { PackageCheck } from "lucide-react";
import { AssetForm } from "@/components/forms/operation-forms";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getAssets, getClientOptions } from "@/lib/data";
import { assetTypes, labelFor } from "@/lib/constants";
import { formatCurrency, formatDate, formatPercent } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AssetsPage() {
  const [clients, assets] = await Promise.all([getClientOptions(), getAssets()]);

  return (
    <div className="grid gap-6">
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card className="rounded-[32px] bg-[#f7f2ec]">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white">
            <PackageCheck className="h-3.5 w-3.5" />
            Assets & subscriptions
          </div>
          <AssetForm clients={clients} />
        </Card>
        <Card className="rounded-[32px] bg-black text-white">
          <h2 className="text-xl font-semibold">Recurring asset summary</h2>
          <div className="mt-5 grid gap-3">
            <Stat label="Active assets" value={assets.filter((asset) => asset.status === "ACTIVE").length.toString()} />
            <Stat label="Monthly contribution" value={formatCurrency(assets.reduce((sum, asset) => sum + asset.monthlyContribution, 0))} />
            <Stat label="Due soon" value={assets.filter((asset) => asset.dueSoon).length.toString()} />
            <Stat label="Unprofitable" value={assets.filter((asset) => asset.unprofitable).length.toString()} />
          </div>
        </Card>
      </div>
      <Card>
        <div className="mb-5 flex items-center justify-between"><h2 className="text-xl font-semibold text-ink">Assets list</h2><Badge>{assets.length} total</Badge></div>
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-3">
            <thead><tr className="text-left text-xs uppercase tracking-[0.2em] text-slate-500"><th className="px-4">Asset</th><th className="px-4">Type</th><th className="px-4">Client</th><th className="px-4">Provider</th><th className="px-4">Cost</th><th className="px-4">Charge</th><th className="px-4">Margin</th><th className="px-4">Renewal</th><th className="px-4">Status</th></tr></thead>
            <tbody>
              {assets.length === 0 ? <tr><td className="px-4 py-10 text-center text-sm text-slate-500" colSpan={9}>No assets yet.</td></tr> : assets.map((asset) => (
                <tr key={asset.id} className="bg-[#fbfaf8] text-sm text-slate-700">
                  <td className="rounded-l-2xl px-4 py-4 font-semibold text-slate-900"><Link href={`/dashboard/assets/${asset.id}` as Route}>{asset.name}</Link></td>
                  <td className="px-4 py-4">{labelFor(asset.type, assetTypes)}</td>
                  <td className="px-4 py-4">{asset.client.companyName}</td>
                  <td className="px-4 py-4">{asset.provider ?? "-"}</td>
                  <td className="px-4 py-4">{formatCurrency(asset.internalCost)}</td>
                  <td className="px-4 py-4">{formatCurrency(asset.clientCharge)}</td>
                  <td className="px-4 py-4">{formatCurrency(asset.margin)} · {formatPercent(asset.marginPercent)}</td>
                  <td className="px-4 py-4">{asset.renewalDate ? formatDate(asset.renewalDate) : "-"}</td>
                  <td className="rounded-r-2xl px-4 py-4"><Badge tone={asset.unprofitable ? "danger" : asset.dueSoon ? "warning" : "default"}>{asset.unprofitable ? "Unprofitable" : asset.status}</Badge></td>
                </tr>
              ))}
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
