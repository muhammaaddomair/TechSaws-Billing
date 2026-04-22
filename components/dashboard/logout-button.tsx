"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { logoutUser } from "@/lib/actions";

export function LogoutButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-60"
      onClick={() => {
        startTransition(async () => {
          await logoutUser();
        });
      }}
      type="button"
    >
      <LogOut className="h-4 w-4" />
      {isPending ? "Signing out..." : "Logout"}
    </button>
  );
}
