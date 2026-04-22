"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { loginUser } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { type LoginInput, loginSchema } from "@/validators/auth";

export function LoginForm() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await loginUser(values);
      setMessage(result.message);

      if (result.success) {
        router.push("/dashboard/clients");
        router.refresh();
      }
    });
  });

  return (
    <div className="w-full rounded-[28px] border border-black/10 bg-white/95 p-6 shadow-[0_22px_80px_rgba(0,0,0,0.16)] backdrop-blur">
      <form className="grid gap-4" onSubmit={onSubmit}>
        <Field error={form.formState.errors.email?.message} label="Email">
          <Input autoComplete="email" placeholder="name@techsaws.com" {...form.register("email")} />
        </Field>
        <Field error={form.formState.errors.password?.message} label="Password">
          <Input autoComplete="current-password" placeholder="********" type="password" {...form.register("password")} />
        </Field>

        {message ? <p className={resultTone(message)}>{message}</p> : null}

        <Button className="mt-1 h-11 rounded-2xl text-sm" disabled={isPending} type="submit">
          {isPending ? "Signing in..." : "Login"}
        </Button>
      </form>
    </div>
  );
}

function resultTone(message: string) {
  return message.toLowerCase().includes("success")
    ? "text-sm text-emerald-600"
    : "text-sm text-rose-600";
}
