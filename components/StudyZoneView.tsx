"use client";

import { useState } from "react";
import { HelpCircle, FileText } from "lucide-react";
import type { Quiz, StudyMaterial } from "@/lib/types";
import { QuizSection } from "@/components/QuizSection";
import { StudyMaterialsExplorer } from "@/components/StudyMaterialsExplorer";
import { cn } from "@/lib/utils";

type ActiveTab = "quizzes" | "papers";

export function StudyZoneView({
  quizzes,
  materials,
}: {
  quizzes: Quiz[];
  materials: StudyMaterial[];
}) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("quizzes");

  const questionPapersCount = materials.filter(
    (item) => item.category !== "notes",
  ).length;

  return (
    <div className="space-y-8">
      {/* Primary Section Switcher Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-2xl border border-ink-100 bg-white p-1.5 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab("quizzes")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all",
              activeTab === "quizzes"
                ? "bg-brand-600 text-white shadow-sm"
                : "text-ink-600 hover:text-ink-900 hover:bg-ink-50",
            )}
          >
            <HelpCircle className="h-4 w-4" />
            Subject Quizzes
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-semibold",
                activeTab === "quizzes"
                  ? "bg-brand-700/60 text-white"
                  : "bg-ink-100 text-ink-700",
              )}
            >
              {quizzes.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("papers")}
            className={cn(
              "flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold transition-all",
              activeTab === "papers"
                ? "bg-brand-600 text-white shadow-sm"
                : "text-ink-600 hover:text-ink-900 hover:bg-ink-50",
            )}
          >
            <FileText className="h-4 w-4" />
            Question Papers
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-semibold",
                activeTab === "papers"
                  ? "bg-brand-700/60 text-white"
                  : "bg-ink-100 text-ink-700",
              )}
            >
              {questionPapersCount}
            </span>
          </button>
        </div>
      </div>

      {/* Render Selected View */}
      {activeTab === "quizzes" ? (
        <QuizSection quizzes={quizzes} />
      ) : (
        <StudyMaterialsExplorer materials={materials} />
      )}
    </div>
  );
}
