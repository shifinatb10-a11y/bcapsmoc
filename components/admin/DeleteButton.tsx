"use client";

import { Trash2 } from "lucide-react";

export function DeleteButton({
  action,
  id,
  name = "id",
  label = "Delete",
  confirmMessage = "Are you sure you want to delete this? This cannot be undone.",
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string | number;
  name?: string;
  label?: string;
  confirmMessage?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage)) event.preventDefault();
      }}
    >
      <input type="hidden" name={name} value={id} />
      <button
        type="submit"
        className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
      >
        <Trash2 className="h-3.5 w-3.5" />
        {label}
      </button>
    </form>
  );
}
