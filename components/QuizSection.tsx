"use client";

import { useMemo, useState } from "react";
import {
  Search,
  BookOpen,
  Layers,
  Clock,
  HelpCircle,
  PlayCircle,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import type { Quiz } from "@/lib/types";
import { Badge, EmptyState } from "@/components/ui";
import { QuizPlayer } from "@/components/QuizPlayer";
import { cn } from "@/lib/utils";

export function QuizSection({ quizzes }: { quizzes: Quiz[] }) {
  const [selectedSemester, setSelectedSemester] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);

  // Extract distinct semesters from the available quizzes
  const semesters = useMemo(() => {
    const set = new Set<string>();
    quizzes.forEach((q) => {
      if (q.semester) set.add(q.semester);
    });
    return Array.from(set).sort();
  }, [quizzes]);

  // Filter quizzes based on selected semester and search query
  const filteredQuizzes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return quizzes.filter((quiz) => {
      if (selectedSemester !== "all" && quiz.semester !== selectedSemester) {
        return false;
      }
      if (
        q &&
        !`${quiz.title} ${quiz.subject} ${quiz.semester} ${quiz.description ?? ""}`
          .toLowerCase()
          .includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [quizzes, selectedSemester, searchQuery]);

  // Group filtered quizzes by Semester -> Subject -> Quizzes
  const groupedData = useMemo(() => {
    const map: Record<string, Record<string, Quiz[]>> = {};

    filteredQuizzes.forEach((quiz) => {
      const sem = quiz.semester || "General";
      const sub = quiz.subject || "General";

      if (!map[sem]) map[sem] = {};
      if (!map[sem][sub]) map[sem][sub] = [];
      map[sem][sub].push(quiz);
    });

    return map;
  }, [filteredQuizzes]);

  const activeSemesters = Object.keys(groupedData).sort();

  return (
    <div className="space-y-8">
      {/* Search and Semester Filter Toolbar */}
      <div className="flex flex-col gap-4 rounded-2xl border border-ink-100 bg-white p-4 shadow-card lg:flex-row lg:items-center lg:justify-between">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setSelectedSemester("all")}
            className={cn(
              "shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
              selectedSemester === "all"
                ? "bg-brand-600 text-white"
                : "bg-ink-50 text-ink-700 hover:bg-ink-100",
            )}
          >
            All Semesters
          </button>
          {semesters.map((sem) => (
            <button
              key={sem}
              type="button"
              onClick={() => setSelectedSemester(sem)}
              className={cn(
                "shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                selectedSemester === sem
                  ? "bg-brand-600 text-white"
                  : "bg-ink-50 text-ink-700 hover:bg-ink-100",
              )}
            >
              {sem}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-500" />
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search quiz, subject or topic…"
            className="w-full rounded-lg border border-ink-100 bg-ink-50 py-2.5 pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-500 focus:border-brand-400 focus:bg-white focus:outline-none sm:w-64"
          />
        </div>
      </div>

      <div className="text-sm font-medium text-ink-500">
        Showing {filteredQuizzes.length}{" "}
        {filteredQuizzes.length === 1 ? "quiz" : "quizzes"} across{" "}
        {activeSemesters.length}{" "}
        {activeSemesters.length === 1 ? "semester" : "semesters"}
      </div>

      {filteredQuizzes.length === 0 ? (
        <EmptyState
          title="No quizzes found"
          description={
            quizzes.length === 0
              ? "Subject quizzes will be added by the Study Zone administrator soon."
              : "No quizzes match your selected semester or search keywords. Try a different filter."
          }
        />
      ) : (
        /* Hierarchical Semester -> Subject -> Quizzes Display */
        <div className="space-y-10">
          {activeSemesters.map((semesterName) => {
            const subjectsObj = groupedData[semesterName];
            const subjectNames = Object.keys(subjectsObj).sort();

            return (
              <section
                key={semesterName}
                className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card transition-all"
              >
                {/* Semester Header */}
                <div className="border-b border-ink-100 bg-gradient-to-r from-brand-50/80 via-ink-50/40 to-white px-6 py-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-sm">
                        <Layers className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-bold text-ink-900 sm:text-xl">
                          {semesterName}
                        </h3>
                        <p className="text-xs text-ink-500">
                          {subjectNames.length}{" "}
                          {subjectNames.length === 1 ? "Subject" : "Subjects"} listed
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subjects under this semester */}
                <div className="p-6 space-y-8">
                  {subjectNames.map((subjectName) => {
                    const subjectQuizzes = subjectsObj[subjectName];

                    return (
                      <div
                        key={subjectName}
                        className="rounded-2xl border border-ink-100 bg-ink-50/20 p-5"
                      >
                        {/* Subject Title */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-100/80 pb-3 mb-4">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-brand-600" />
                            <h4 className="font-display text-base font-bold text-ink-900">
                              {subjectName}
                            </h4>
                          </div>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink-600 border border-ink-100 shadow-xs">
                            {subjectQuizzes.length}{" "}
                            {subjectQuizzes.length === 1 ? "quiz" : "quizzes"}
                          </span>
                        </div>

                        {/* Quizzes under this subject */}
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {subjectQuizzes.map((quiz) => {
                            const questionCount = quiz.questions?.length || 0;

                            return (
                              <article
                                key={quiz.id}
                                className="group flex flex-col justify-between rounded-2xl border border-ink-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-card hover:border-brand-200"
                              >
                                <div>
                                  <div className="flex flex-wrap items-center gap-2 mb-2.5">
                                    <Badge tone="brand">
                                      <HelpCircle className="h-3.5 w-3.5 mr-1" />
                                      {questionCount}{" "}
                                      {questionCount === 1 ? "Question" : "Questions"}
                                    </Badge>

                                    {quiz.duration_minutes ? (
                                      <Badge tone="muted">
                                        <Clock className="h-3.5 w-3.5 mr-1" />
                                        {quiz.duration_minutes}m
                                      </Badge>
                                    ) : (
                                      <Badge tone="muted">Untimed</Badge>
                                    )}
                                  </div>

                                  <h5 className="font-display text-base font-bold text-ink-900 group-hover:text-brand-700 transition-colors">
                                    {quiz.title}
                                  </h5>

                                  {quiz.description ? (
                                    <p className="mt-2 text-xs leading-relaxed text-ink-500 line-clamp-3">
                                      {quiz.description}
                                    </p>
                                  ) : null}
                                </div>

                                <div className="mt-5 pt-3 border-t border-ink-50 flex items-center justify-between gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setActiveQuiz(quiz)}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-bold text-white transition-all hover:bg-brand-700 hover:shadow shadow-xs active:scale-98"
                                  >
                                    <PlayCircle className="h-4 w-4" />
                                    Take Quiz
                                  </button>

                                  {quiz.quiz_url ? (
                                    <a
                                      href={quiz.quiz_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      title="Open external quiz link"
                                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-ink-200 text-ink-600 hover:bg-ink-50 hover:text-ink-900 transition-colors"
                                    >
                                      <ExternalLink className="h-4 w-4" />
                                    </a>
                                  ) : null}
                                </div>
                              </article>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* Interactive Quiz Runner Modal */}
      {activeQuiz ? (
        <QuizPlayer quiz={activeQuiz} onClose={() => setActiveQuiz(null)} />
      ) : null}
    </div>
  );
}
