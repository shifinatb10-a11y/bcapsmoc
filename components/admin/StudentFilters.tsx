"use client";

import Link from "next/link";
import { changeBatchSemester } from "@/app/actions/students";
import { SEMESTERS, type StudentBatch } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Batch-year tabs (each showing its current semester) plus a semester control
 * that updates the semester of the selected batch. Changing it moves the whole
 * batch, because students are stored against the batch year — not a semester.
 */
export function StudentFilters({
  batches,
  batch,
  semester,
}: {
  batches: StudentBatch[];
  batch: string | null;
  semester: number;
}) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-ink-100 bg-white p-5 shadow-card lg:flex-row lg:items-end lg:justify-between">
      <div>
        <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-500">
          Batch year
        </span>
        <div className="flex flex-wrap gap-2">
          {batches.map((item) => {
            const active = item.label === batch;
            return (
              <Link
                key={item.label}
                href={`/admin/students?batch=${encodeURIComponent(item.label)}`}
                className={cn(
                  "inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors",
                  active
                    ? "border-brand-600 bg-brand-600 text-white shadow-lift"
                    : "border-ink-100 bg-white text-ink-700 hover:border-brand-300 hover:text-brand-700",
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                    active ? "bg-white/20" : "bg-brand-50 text-brand-700",
                  )}
                >
                  Sem {item.current_semester}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {batch ? (
        <form action={changeBatchSemester} className="block">
          <input type="hidden" name="label" value={batch} />
          <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-500">
            Current semester
          </span>
          <div className="flex items-center gap-2">
            <select
              name="semester"
              value={semester}
              onChange={(event) => event.currentTarget.form?.requestSubmit()}
              className="w-full rounded-xl border border-ink-100 bg-ink-50 px-4 py-2.5 text-sm font-semibold text-ink-900 transition-colors focus:border-brand-400 focus:bg-white focus:outline-none sm:w-44"
            >
              {SEMESTERS.map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
            <noscript>
              <button
                type="submit"
                className="rounded-xl border border-ink-100 px-4 py-2.5 text-sm font-semibold text-ink-700"
              >
                Update
              </button>
            </noscript>
          </div>
          <span className="mt-1 block text-xs text-ink-500">
            Moves every student in {batch}.
          </span>
        </form>
      ) : null}
    </div>
  );
}
