"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SEMESTERS, STUDENT_BATCHES } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Batch-year tabs + a Semester 1–8 selector. The chosen batch and semester are
 * encoded in the URL so the page can load just that group of students.
 */
export function StudentFilters({
  batch,
  semester,
}: {
  batch: string;
  semester: number;
}) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-ink-100 bg-white p-5 shadow-card sm:flex-row sm:items-end sm:justify-between">
      <div>
        <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-500">
          Batch year
        </span>
        <div className="flex flex-wrap gap-2">
          {STUDENT_BATCHES.map((item) => {
            const active = item === batch;
            return (
              <Link
                key={item}
                href={`/admin/students?batch=${encodeURIComponent(item)}&sem=${semester}`}
                className={cn(
                  "rounded-xl border px-4 py-2 text-sm font-semibold transition-colors",
                  active
                    ? "border-brand-600 bg-brand-600 text-white shadow-lift"
                    : "border-ink-100 bg-white text-ink-700 hover:border-brand-300 hover:text-brand-700",
                )}
              >
                {item}
              </Link>
            );
          })}
        </div>
      </div>

      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-ink-500">
          Semester
        </span>
        <select
          value={semester}
          onChange={(event) =>
            router.push(
              `/admin/students?batch=${encodeURIComponent(batch)}&sem=${event.target.value}`,
            )
          }
          className="w-full rounded-xl border border-ink-100 bg-ink-50 px-4 py-2.5 text-sm font-semibold text-ink-900 transition-colors focus:border-brand-400 focus:bg-white focus:outline-none sm:w-44"
        >
          {SEMESTERS.map((sem) => (
            <option key={sem} value={sem}>
              Semester {sem}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
