import Link from "next/link";
import { notFound } from "next/navigation";
import { RenewalForm, NoteForm } from "@/components/forms/operation-forms";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { getAssetDetail } from "@/lib/data";
import { assetTypes, labelFor } from "@/lib/constants";
import { formatCurrency, formatDate, formatPercent } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AssetDetailPage({ params }: { params: Promise<{ assetId: string }> }) {
  const { assetId } = await params;
  const asset = await getAssetDetail(assetId);
  if (!asset) notFound();

  return (
    <div className="grid gap-6">
      <Card>
        <Link className="text-sm font-medium text-accent" href="/dashboard/assets">Back to assets</Link>
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold text-ink">{asset.name}</h2>
            <p className="mt-2 text-sm text-slate-600">{asset.client.companyName} · {labelFor(asset.type, assetTypes)} · {asset.provider ?? "No provider"}</p>
          </div>
          <Badge tone={asset.unprofitable ? "danger" : asset.dueSoon ? "warning" : "default"}>{asset.unprofitable ? "Unprofitable" : asset.status}</Badge>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <Metric label="Cost" value={formatCurrency(asset.internalCost)} />
          <Metric label="Charge" value={formatCurrency(asset.clientCharge)} />
          <Metric label="Margin" value={formatCurrency(asset.margin)} />
          <Metric label="Margin %" value={formatPercent(asset.marginPercent)} />
        </div>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card><h3 className="mb-4 text-xl font-semibold text-ink">Renew asset</h3><RenewalForm assetId={asset.id} /></Card>
        <Card>
          <h3 className="mb-4 text-xl font-semibold text-ink">Billing</h3>
          <div className="grid gap-3 text-sm">
            <Row label="Billing frequency" value={asset.billingFrequency} />
            <Row label="Renewal date" value={asset.renewalDate ? formatDate(asset.renewalDate) : "-"} />
            <Row label="Auto renewal" value={asset.autoRenewal ? "Yes" : "No"} />
            <Row label="Alert threshold" value={`${asset.alertDays} days`} />
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="mb-4 text-xl font-semibold text-ink">Renewal history</h3>
        <div className="grid gap-3">
          {asset.renewals.length === 0 ? <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">No renewal history yet.</div> : asset.renewals.map((renewal) => (
            <div key={renewal.id} className="rounded-2xl bg-[#fbfaf8] p-4 text-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-semibold text-slate-900">{formatDate(renewal.dateRenewed)}</p>
                <p>{formatCurrency(renewal.cost)} cost · {formatCurrency(renewal.clientCharge)} charge</p>
              </div>
              <p className="mt-2 text-slate-500">Next renewal {formatDate(renewal.newRenewalDate)}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card><h3 className="mb-4 text-xl font-semibold text-ink">Internal notes</h3><NoteForm entityId={asset.id} entityType="ASSET" /></Card>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="rounded-[24px] bg-[#fbfaf8] px-5 py-4"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-semibold text-slate-950">{value}</p></div>;
}
function Row({ label, value }: { label: string; value: string }) {
  return <div className="flex justify-between gap-4 rounded-2xl bg-[#fbfaf8] px-4 py-3"><span className="text-slate-500">{label}</span><span className="font-medium text-slate-900">{value}</span></div>;
}
