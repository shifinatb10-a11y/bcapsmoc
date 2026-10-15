"use client";

import { useActionState } from "react";
import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";
import type { ActionState } from "@/lib/action-state";
import { cn } from "@/lib/utils";

export function AdminForm({
  action,
  submitLabel = "Save",
  children,
  className,
  hiddenFields,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel?: string;
  children?: ReactNode;
  className?: string;
  hiddenFields?: Record<string, string | number | null | undefined>;
}) {
  const [state, formAction, pending] = useActionState(action, {} as ActionState);

  return (
    <form action={formAction} className={cn("space-y-4", className)}>
      {hiddenFields
        ? Object.entries(hiddenFields).map(([key, value]) =>
            value === undefined || value === null ? null : (
              <input key={key} type="hidden" name={key} value={value} />
            ),
          )
        : null}

      {children}

      {state?.error ? (
        <p className="rounded-lg border border-red-100 bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700">
          {state.error}
        </p>
      ) : null}
      {state?.message ? (
        <p className="rounded-lg border border-emerald-100 bg-emerald-50 px-3.5 py-2.5 text-sm font-medium text-emerald-700">
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
