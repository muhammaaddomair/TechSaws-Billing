import { LoginForm } from "@/components/auth/login-form";
import { TechSawsLogo } from "@/components/brand/logo";

export function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#efe1c7] px-6 py-12">
      <div className="absolute inset-y-0 left-0 hidden w-1/2 bg-black lg:block" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.22),_transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.32),_transparent_20%)]" />
      <div className="pointer-events-none absolute left-[calc(50%-7rem)] top-1/2 hidden h-56 w-56 -translate-y-1/2 rounded-full border border-white/15 bg-white/8 blur-3xl lg:block" />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center">
        <div className="mb-6 flex items-center justify-center rounded-[28px] bg-black p-4 shadow-[0_22px_70px_rgba(0,0,0,0.28)]">
          <TechSawsLogo priority size={64} />
        </div>
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-500">TechSaws</p>
          <p className="mt-2 text-sm text-slate-600">Sign in</p>
        </div>
        <div className="w-full">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
