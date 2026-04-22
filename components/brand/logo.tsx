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
