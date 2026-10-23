"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Trash2, TriangleAlert } from "lucide-react";

/**
 * A delete control that always asks for confirmation first. Clicking the button
 * opens a warning dialog; only the explicit "Delete" button submits the server
 * action. Used for every destructive action in the dashboard.
 */
export function DeleteButton({
  action,
  id,
  name = "id",
  label = "Delete",
  title,
  confirmMessage = "Are you sure you want to delete this? This cannot be undone.",
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string | number;
  name?: string;
  label?: string;
  title?: string;
  confirmMessage?: string;
}) {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!open) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <form ref={formRef} action={action}>
        <input type="hidden" name={name} value={id} />
      </form>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
      >
        <Trash2 className="h-3.5 w-3.5" />
        {label}
      </button>

      {open
        ? createPortal(
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <button
                type="button"
                aria-label="Cancel"
                onClick={() => setOpen(false)}
                className="absolute inset-0 cursor-default bg-ink-900/60 backdrop-blur-sm"
              />
              <div
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="delete-dialog-title"
                className="relative w-full max-w-md rounded-2xl border border-ink-100 bg-white p-6 shadow-lift"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <TriangleAlert className="h-6 w-6" />
                </span>
                <h2
                  id="delete-dialog-title"
                  className="mt-4 font-display text-xl font-semibold text-ink-900"
                >
                  {title ?? "Delete this item?"}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">
                  {confirmMessage}
                </p>
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-lg border border-ink-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:border-ink-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      formRef.current?.requestSubmit();
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
