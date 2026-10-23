"use client";

import { useState } from "react";
import {
  BookMarked,
  CalendarDays,
  FileText,
  UserRound,
} from "lucide-react";
import type { Association, AssociationReport } from "@/lib/types";
import { Avatar, Badge, EmptyState } from "@/components/ui";
import { DocumentActions } from "@/components/DocumentActions";
import { cn, formatDate } from "@/lib/utils";

type AssociationWithReports = Association & { reports: AssociationReport[] };

export function AssociationsExplorer({
  associations,
}: {
  associations: AssociationWithReports[];
}) {
  const [activeId, setActiveId] = useState(
    () => associations[0]?.id ?? "",
  );
  const active =
    associations.find((item) => item.id === activeId) ?? associations[0];

  if (!active) {
    return (
      <EmptyState
        title="No associations published yet"
        description="Association details will be published here by the department."
      />
    );
  }

  const newestStart = Math.max(
    ...associations.map((item) => item.start_year ?? 0),
  );

  return (
    <div>
      {/* Tabs */}
      <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {associations.map((item) => {
          const isActive = item.id === active.id;
          const isCurrent = (item.start_year ?? 0) === newestStart;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveId(item.id)}
              className={cn(
                "flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all",
                isActive
                  ? "border-brand-600 bg-brand-600 text-white shadow-lift"
                  : "border-ink-100 bg-white text-ink-700 hover:border-brand-300 hover:text-brand-700",
              )}
            >
              {item.year_label}
              {isCurrent ? (
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-amber-100 text-amber-700",
                  )}
                >
                  Current
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* Left: secretary + magazine */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
            <div className="flex items-center gap-2 border-b border-ink-100 bg-brand-50 px-4 py-3 text-xs font-bold uppercase tracking-wider text-brand-700">
              <UserRound className="h-4 w-4" />
              Association Secretary
            </div>
            <div className="aspect-[4/5] w-full bg-ink-50">
              <Avatar
                src={active.secretary_photo_url}
                name={active.secretary_name}
                rounded="rounded-none"
              />
            </div>
            <div className="p-5">
              <div className="font-display text-lg font-semibold text-ink-900">
                {active.secretary_name ?? "To be announced"}
              </div>
              <div className="mt-0.5 text-sm font-semibold text-brand-600">
                {active.secretary_designation ?? "Association Secretary"}
              </div>
              {active.secretary_details ? (
                <p className="mt-3 text-sm leading-relaxed text-ink-500">
                  {active.secretary_details}
                </p>
              ) : null}
            </div>
          </div>

          <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700">
              <BookMarked className="h-4 w-4" />
              Department Magazine
            </div>
            <div className="mt-3 font-display text-base font-semibold text-ink-900">
              {active.magazine_title || "Magazine"}
            </div>
            {active.magazine_url ? (
              <DocumentActions
                url={active.magazine_url}
                title={active.magazine_title || "Magazine"}
                className="mt-4"
              />
            ) : (
              <p className="mt-2 text-sm text-ink-500">
                The magazine for this term has not been published yet.
              </p>
            )}
          </div>
        </div>

        {/* Right: description + reports */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card sm:p-8">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone="gold">{active.year_label}</Badge>
              <span className="font-display text-lg font-semibold text-ink-900">
                {active.name}
              </span>
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-700">
              {active.description ||
                "Details about this association term will be published here."}
            </p>
          </div>

          <div className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700">
                <FileText className="h-4 w-4" />
                Event Reports
              </div>
              <span className="text-xs font-semibold text-ink-500">
                {active.reports.length}{" "}
                {active.reports.length === 1 ? "report" : "reports"}
              </span>
            </div>

            {active.reports.length === 0 ? (
              <p className="mt-4 rounded-xl border border-dashed border-ink-100 bg-ink-50 px-4 py-8 text-center text-sm text-ink-500">
                Reports for completed events will be added here.
              </p>
            ) : (
              <ul className="mt-5 space-y-3">
                {active.reports.map((report) => (
                  <li
                    key={report.id}
                    className="flex flex-col gap-4 rounded-xl border border-ink-100 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="font-semibold text-ink-900">
                        {report.title}
                      </div>
                      {report.event_date ? (
                        <div className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-ink-500">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {formatDate(report.event_date)}
                        </div>
                      ) : null}
                      {report.description ? (
                        <p className="mt-1.5 text-sm text-ink-500">
                          {report.description}
                        </p>
                      ) : null}
                    </div>
                    {report.file_url ? (
                      <DocumentActions
                        url={report.file_url}
                        title={report.title}
                        className="shrink-0"
                      />
                    ) : (
                      <span className="shrink-0 text-xs font-medium text-ink-500">
                        No file
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
