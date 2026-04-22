"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { saveSubscription } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { type SubscriptionInput, subscriptionSchema } from "@/validators/client";

export function SubscriptionForm({
  clientId,
  defaultValues
}: {
  clientId: string;
  defaultValues?: Partial<SubscriptionInput>;
}) {
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const form = useForm<SubscriptionInput>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      id: defaultValues?.id,
      clientId,
      serviceName: defaultValues?.serviceName ?? "",
      monthlyCost: defaultValues?.monthlyCost ?? 0,
      billingCycle: defaultValues?.billingCycle ?? "MONTHLY"
    }
  });

  const onSubmit = form.handleSubmit((values) => {
    startTransition(async () => {
      const result = await saveSubscription(values);
      setServerMessage(result.message);

      if (result.success && !values.id) {
        form.reset({
          clientId,
          serviceName: "",
          monthlyCost: 0,
          billingCycle: "MONTHLY"
        });
      }
    });
  });

  return (
    <form className="grid gap-4" onSubmit={onSubmit}>
      <input type="hidden" {...form.register("id")} />
      <input type="hidden" {...form.register("clientId")} />
      <Field error={form.formState.errors.serviceName?.message} label="Service">
        <Input placeholder="Vercel Pro" {...form.register("serviceName")} />
      </Field>
      <Field error={form.formState.errors.monthlyCost?.message} label="Monthly Cost">
        <Input min="0" placeholder="49" step="0.01" type="number" {...form.register("monthlyCost")} />
      </Field>
      <Field error={form.formState.errors.billingCycle?.message} label="Billing Cycle">
        <Select {...form.register("billingCycle")}>
          <option value="MONTHLY">Monthly</option>
          <option value="YEARLY">Yearly</option>
        </Select>
      </Field>
      {serverMessage ? <p className="text-sm text-slate-600">{serverMessage}</p> : null}
      <Button className="w-full" disabled={isPending} type="submit" variant="secondary">
        {isPending ? "Saving..." : defaultValues?.id ? "Update subscription" : "Add subscription"}
      </Button>
    </form>
  );
}
