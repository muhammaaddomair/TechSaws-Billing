import { LoginForm } from "@/components/auth/login-form";
import { TechSawsBrand } from "@/components/brand/logo";

export function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#efe1c7] px-6 py-12">
      <div className="absolute inset-y-0 left-0 hidden w-1/2 bg-white lg:block" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.32),_transparent_20%)]" />

      <div className="relative z-10 flex w-full max-w-sm flex-col items-center">
        <div className="mb-8 rounded-[28px] bg-white p-5 shadow-[0_22px_70px_rgba(15,23,42,0.14)]">
          <TechSawsBrand logoSize={88} priority />
        </div>
        <div className="mb-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-slate-500">TechSaws Billing</p>
          <p className="mt-2 text-sm text-slate-600">Sign in</p>
        </div>
        <div className="w-full">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
