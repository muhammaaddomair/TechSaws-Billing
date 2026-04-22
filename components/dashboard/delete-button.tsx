"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";

export function DeleteButton({
  action,
  label,
  redirectTo
}: {
  action: () => Promise<{ success: boolean; message: string }>;
  label: string;
  redirectTo?: Route;
}) {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="grid gap-2">
      <Button
        disabled={isPending}
        onClick={() => {
          if (!window.confirm(`Delete ${label}? This cannot be undone.`)) {
            return;
          }

          startTransition(async () => {
            const result = await action();
            setMessage(result.message);

            if (result.success && redirectTo) {
              router.push(redirectTo);
              router.refresh();
            } else if (result.success) {
              router.refresh();
            }
          });
        }}
        variant="danger"
      >
        {isPending ? "Deleting..." : `Delete ${label}`}
      </Button>
      {message ? <p className="text-sm text-slate-600">{message}</p> : null}
    </div>
  );
}
