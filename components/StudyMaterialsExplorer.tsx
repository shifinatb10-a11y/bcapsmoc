"use client";

import { useMemo, useState } from "react";
<<<<<<< HEAD
import { FileText, Search } from "lucide-react";
import type { StudyMaterial } from "@/lib/types";
import { Badge, EmptyState } from "@/components/ui";
import { DocumentActions } from "@/components/DocumentActions";
=======
import { FileText, NotebookPen, Search } from "lucide-react";
import type { StudyMaterial } from "@/lib/types";
import { Badge, EmptyState } from "@/components/ui";
import { DocumentActions } from "@/components/DocumentActions";
import { cn } from "@/lib/utils";

type Category = "all" | "question_paper" | "notes";

const TABS: { id: Category; label: string }[] = [
  { id: "all", label: "All" },
  { id: "question_paper", label: "Question Papers" },
  { id: "notes", label: "Notes" },
];
>>>>>>> a7d5e2003262c482901d72bd8a30a640729bf83b

export function StudyMaterialsExplorer({
  materials,
}: {
  materials: StudyMaterial[];
}) {
<<<<<<< HEAD
  const [semester, setSemester] = useState("all");
  const [query, setQuery] = useState("");

  // Only question papers (notes removed)
  const questionPapers = useMemo(() => {
    return materials.filter((item) => item.category !== "notes");
  }, [materials]);

  const semesters = useMemo(() => {
    const set = new Set<string>();
    questionPapers.forEach((item) => {
      if (item.semester) set.add(item.semester);
    });
    return Array.from(set).sort();
  }, [questionPapers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return questionPapers.filter((item) => {
=======
  const [category, setCategory] = useState<Category>("all");
  const [semester, setSemester] = useState("all");
  const [query, setQuery] = useState("");

  const semesters = useMemo(() => {
    const set = new Set<string>();
    materials.forEach((item) => {
      if (item.semester) set.add(item.semester);
    });
    return Array.from(set).sort();
  }, [materials]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return materials.filter((item) => {
      if (category !== "all" && item.category !== category) return false;
>>>>>>> a7d5e2003262c482901d72bd8a30a640729bf83b
      if (semester !== "all" && item.semester !== semester) return false;
      if (
        q &&
        !`${item.title} ${item.subject ?? ""} ${item.year ?? ""}`
          .toLowerCase()
          .includes(q)
      ) {
        return false;
      }
      return true;
    });
<<<<<<< HEAD
  }, [questionPapers, semester, query]);

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-2xl border border-ink-100 bg-white p-4 shadow-card sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-base font-semibold text-ink-900">
              Previous Year Question Papers
            </h3>
            <p className="text-xs text-ink-500">
              Download or view exam question papers in PDF format
            </p>
          </div>
=======
  }, [materials, category, semester, query]);

  return (
    <div>
      <div className="flex flex-col gap-4 rounded-2xl border border-ink-100 bg-white p-4 shadow-card lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setCategory(tab.id)}
              className={cn(
                "shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                category === tab.id
                  ? "bg-brand-600 text-white"
                  : "bg-ink-50 text-ink-700 hover:bg-ink-100",
              )}
            >
              {tab.label}
            </button>
          ))}
>>>>>>> a7d5e2003262c482901d72bd8a30a640729bf83b
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
<<<<<<< HEAD
              placeholder="Search title, subject or year…"
=======
              placeholder="Search title or subject…"
>>>>>>> a7d5e2003262c482901d72bd8a30a640729bf83b
              className="w-full rounded-lg border border-ink-100 bg-ink-50 py-2.5 pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-500 focus:border-brand-400 focus:bg-white focus:outline-none sm:w-60"
            />
          </div>
          {semesters.length > 0 ? (
            <select
              value={semester}
              onChange={(event) => setSemester(event.target.value)}
              className="rounded-lg border border-ink-100 bg-ink-50 px-3 py-2.5 text-sm font-medium text-ink-700 focus:border-brand-400 focus:bg-white focus:outline-none"
            >
              <option value="all">All semesters</option>
              {semesters.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          ) : null}
        </div>
      </div>

      <div className="mt-4 text-sm font-medium text-ink-500">
<<<<<<< HEAD
        {filtered.length} {filtered.length === 1 ? "question paper" : "question papers"}
=======
        {filtered.length} {filtered.length === 1 ? "resource" : "resources"}
>>>>>>> a7d5e2003262c482901d72bd8a30a640729bf83b
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6">
          <EmptyState
<<<<<<< HEAD
            title="No question papers found"
            description={
              questionPapers.length === 0
                ? "Previous year question papers will be uploaded by the department soon."
                : "No question paper matches your search or semester filter."
=======
            title="Nothing here yet"
            description={
              materials.length === 0
                ? "Question papers and notes will be uploaded by the department soon."
                : "No resource matches your filters. Try a different search."
>>>>>>> a7d5e2003262c482901d72bd8a30a640729bf83b
            }
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((material) => (
            <article
              key={material.id}
              className="flex flex-col rounded-2xl border border-ink-100 bg-white p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="flex items-center justify-between gap-3">
<<<<<<< HEAD
                <Badge tone="gold">
                  <FileText className="h-3.5 w-3.5" />
                  Question Paper
=======
                <Badge tone={material.category === "notes" ? "brand" : "gold"}>
                  {material.category === "notes" ? (
                    <>
                      <NotebookPen className="h-3.5 w-3.5" />
                      Notes
                    </>
                  ) : (
                    <>
                      <FileText className="h-3.5 w-3.5" />
                      Question Paper
                    </>
                  )}
>>>>>>> a7d5e2003262c482901d72bd8a30a640729bf83b
                </Badge>
                {material.year ? (
                  <span className="text-xs font-semibold text-ink-500">
                    {material.year}
                  </span>
                ) : null}
              </div>

              <h3 className="mt-3 font-display text-lg font-semibold text-ink-900">
                {material.title}
              </h3>

              <div className="mt-1.5 text-xs font-medium text-ink-500">
                {[material.subject, material.semester]
                  .filter(Boolean)
                  .join(" · ")}
              </div>

              {material.description ? (
                <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-500">
                  {material.description}
                </p>
              ) : (
                <div className="flex-1" />
              )}

              <DocumentActions
                url={material.file_url}
                title={material.title}
                className="mt-4"
              />
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
