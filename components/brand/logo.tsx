import Image from "next/image";
import techSawsLogo from "@/assets/IMG-20260421-WA0025_4.jpg.jpeg";

export function TechSawsLogo({
  size = 44,
  priority = false
}: {
  size?: number;
  priority?: boolean;
}) {
  return (
    <div
      className="overflow-hidden rounded-2xl bg-black shadow-[0_18px_40px_rgba(0,0,0,0.25)]"
      style={{ height: size, width: size }}
    >
      <Image
        alt="TechSaws logo"
        className="h-full w-full object-cover"
        height={size}
        priority={priority}
        src={techSawsLogo}
        width={size}
      />
    </div>
  );
}

export function TechSawsBrand({
  logoSize = 72,
  priority = false,
  inverse = false
}: {
  logoSize?: number;
  priority?: boolean;
  inverse?: boolean;
}) {
  return (
    <div className="flex items-center gap-4">
      <TechSawsLogo priority={priority} size={logoSize} />
      <div className="min-w-0">
        <p className={inverse ? "text-xl font-semibold tracking-tight text-white" : "text-xl font-semibold tracking-tight text-slate-950"}>
          TechSaws Billing
        </p>
        <p className={inverse ? "mt-1 text-xs font-medium uppercase tracking-[0.2em] text-white/55" : "mt-1 text-xs font-medium uppercase tracking-[0.2em] text-slate-500"}>
          Invoice workspace
        </p>
      </div>
    </div>
  );
}
