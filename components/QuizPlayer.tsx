"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  X,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Trophy,
  ExternalLink,
} from "lucide-react";
import type { Quiz } from "@/lib/types";

export function QuizPlayer({
  quiz,
  onClose,
}: {
  quiz: Quiz;
  onClose: () => void;
}) {
  const questions = quiz.questions || [];
  const total = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(() => {
    return quiz.duration_minutes ? quiz.duration_minutes * 60 : null;
  });

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (submitted || timeLeft === null) return;
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted, handleSubmit]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleSelectOption = (optIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => ({
      ...prev,
      [currentIndex]: optIndex,
    }));
  };

  const answeredCount = Object.keys(answers).length;

  const score = useMemo(() => {
    return questions.reduce((acc, q, idx) => {
      return acc + (answers[idx] === q.correct_option ? 1 : 0);
    }, 0);
  }, [questions, answers]);

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  const handleRetake = () => {
    setAnswers({});
    setSubmitted(false);
    setCurrentIndex(0);
    setTimeLeft(quiz.duration_minutes ? quiz.duration_minutes * 60 : null);
  };

  const currentQ = questions[currentIndex];

  // Prevent background scrolling while modal is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (total === 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl text-center">
          <h3 className="font-display text-lg font-semibold text-ink-900">
            {quiz.title}
          </h3>
          <p className="mt-2 text-sm text-ink-500">
            This quiz does not have built-in questions yet.
          </p>
          {quiz.quiz_url ? (
            <a
              href={quiz.quiz_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Open External Quiz Form
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
          <div className="mt-4">
            <button
              onClick={onClose}
              className="text-sm font-medium text-ink-600 hover:text-ink-900"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/70 p-3 sm:p-6 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-ink-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4 bg-brand-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-100/80 px-2 py-0.5 rounded">
                {quiz.semester} · {quiz.subject}
              </span>
              {timeLeft !== null && !submitted ? (
                <span
                  className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded ${
                    timeLeft < 60
                      ? "bg-red-100 text-red-700 animate-pulse"
                      : "bg-ink-100 text-ink-700"
                  }`}
                >
                  <Clock className="h-3 w-3" />
                  {formatTime(timeLeft)}
                </span>
              ) : null}
            </div>
            <h2 className="mt-1 font-display text-lg font-bold text-ink-900 sm:text-xl line-clamp-1">
              {quiz.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-ink-400 hover:bg-ink-100 hover:text-ink-700 transition-colors"
            title="Close Quiz"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress Bar */}
        {!submitted ? (
          <div className="h-1.5 w-full bg-ink-100">
            <div
              className="h-full bg-brand-600 transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
            />
          </div>
        ) : null}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {!submitted ? (
            /* Active Quiz Taking View */
            <div className="space-y-6">
              {/* Question Navigation Bubbles */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-ink-500 mr-1">
                  Questions:
                </span>
                {questions.map((_, idx) => {
                  const isAnswered = answers[idx] !== undefined;
                  const isCurrent = idx === currentIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-7 w-7 rounded-lg text-xs font-bold transition-all ${
                        isCurrent
                          ? "bg-brand-600 text-white ring-2 ring-brand-300"
                          : isAnswered
                          ? "bg-brand-100 text-brand-800"
                          : "bg-ink-100 text-ink-600 hover:bg-ink-200"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              {/* Current Question */}
              <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-ink-400 mb-2">
                  Question {currentIndex + 1} of {total}
                </div>
                <h3 className="font-display text-base font-semibold text-ink-900 leading-snug sm:text-lg">
                  {currentQ.question}
                </h3>

                {/* Options List */}
                <div className="mt-5 space-y-3">
                  {currentQ.options.map((optionText, optIdx) => {
                    const isSelected = answers[currentIndex] === optIdx;
                    const letter = String.fromCharCode(65 + optIdx); // A, B, C, D

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() => handleSelectOption(optIdx)}
                        className={`flex w-full items-center gap-3.5 rounded-xl border p-3.5 text-left transition-all ${
                          isSelected
                            ? "border-brand-600 bg-brand-50/70 shadow-sm"
                            : "border-ink-200 bg-ink-50/30 hover:border-ink-300 hover:bg-white"
                        }`}
                      >
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                            isSelected
                              ? "bg-brand-600 text-white"
                              : "bg-ink-200 text-ink-700"
                          }`}
                        >
                          {letter}
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            isSelected ? "text-brand-950 font-semibold" : "text-ink-800"
                          }`}
                        >
                          {optionText}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Results & Review View */
            <div className="space-y-6">
              {/* Score Header Card */}
              <div className="rounded-2xl bg-gradient-to-br from-brand-700 via-brand-800 to-indigo-900 p-6 text-white text-center shadow-lg">
                <Trophy className="mx-auto h-12 w-12 text-amber-300 mb-2 animate-bounce" />
                <h3 className="font-display text-2xl font-bold">Quiz Completed!</h3>
                <p className="mt-1 text-sm text-brand-100">
                  {percentage >= 80
                    ? "Outstanding performance! You mastered this subject."
                    : percentage >= 50
                    ? "Good effort! Review the solutions below to improve further."
                    : "Keep practicing! Review each explanation below."}
                </p>

                <div className="mt-5 flex items-center justify-center gap-6">
                  <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
                    <div className="font-display text-2xl font-bold">{score} / {total}</div>
                    <div className="text-[11px] uppercase tracking-wider text-brand-200">Score</div>
                  </div>
                  <div className="rounded-xl bg-white/10 px-4 py-2 backdrop-blur-sm">
                    <div className="font-display text-2xl font-bold">{percentage}%</div>
                    <div className="text-[11px] uppercase tracking-wider text-brand-200">Accuracy</div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handleRetake}
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2 text-xs font-semibold text-brand-900 hover:bg-brand-50 transition-colors shadow"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Retake Quiz
                  </button>
                  {quiz.quiz_url ? (
                    <a
                      href={quiz.quiz_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-brand-600/60 border border-white/20 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-600 transition-colors"
                    >
                      External Form Link
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : null}
                </div>
              </div>

              {/* Question by Question Detailed Review */}
              <div>
                <h4 className="font-display text-base font-bold text-ink-900 mb-4">
                  Question Review & Explanations
                </h4>

                <div className="space-y-4">
                  {questions.map((q, idx) => {
                    const studentAns = answers[idx];
                    const isCorrect = studentAns === q.correct_option;
                    const isUnanswered = studentAns === undefined;

                    return (
                      <div
                        key={q.id || idx}
                        className={`rounded-2xl border p-4 sm:p-5 transition-all ${
                          isCorrect
                            ? "border-emerald-200 bg-emerald-50/20"
                            : "border-red-200 bg-red-50/20"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-ink-500">
                              Question {idx + 1}
                            </span>
                            {isCorrect ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-800">
                                <CheckCircle2 className="h-3.5 w-3.5" /> Correct
                              </span>
                            ) : isUnanswered ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                                Unanswered
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-800">
                                <XCircle className="h-3.5 w-3.5" /> Incorrect
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="mt-2 text-sm font-semibold text-ink-900">
                          {q.question}
                        </p>

                        {/* Options */}
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          {q.options.map((opt, oIdx) => {
                            const isThisCorrect = oIdx === q.correct_option;
                            const isThisStudentChoice = studentAns === oIdx;

                            let optClass = "border-ink-100 bg-white text-ink-700";
                            if (isThisCorrect) {
                              optClass = "border-emerald-500 bg-emerald-50 font-semibold text-emerald-900 ring-1 ring-emerald-400";
                            } else if (isThisStudentChoice && !isCorrect) {
                              optClass = "border-red-500 bg-red-50 font-semibold text-red-900 ring-1 ring-red-400";
                            }

                            return (
                              <div
                                key={oIdx}
                                className={`flex items-center gap-2 rounded-xl border p-2.5 text-xs ${optClass}`}
                              >
                                <span className="font-bold">
                                  {String.fromCharCode(65 + oIdx)}.
                                </span>
                                <span className="flex-1">{opt}</span>
                                {isThisCorrect ? (
                                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                                ) : isThisStudentChoice ? (
                                  <XCircle className="h-4 w-4 text-red-600 shrink-0" />
                                ) : null}
                              </div>
                            );
                          })}
                        </div>

                        {/* Explanation */}
                        {q.explanation ? (
                          <div className="mt-3 rounded-xl bg-ink-50 p-3 text-xs text-ink-700 border border-ink-100">
                            <span className="font-bold text-ink-900 flex items-center gap-1 mb-0.5">
                              <HelpCircle className="h-3.5 w-3.5 text-brand-600" />
                              Explanation:
                            </span>
                            {q.explanation}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls */}
        {!submitted ? (
          <div className="flex items-center justify-between border-t border-ink-100 px-6 py-4 bg-ink-50/50">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              className="inline-flex items-center gap-1 rounded-xl border border-ink-200 bg-white px-3.5 py-2 text-xs font-semibold text-ink-700 hover:bg-ink-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <span className="text-xs font-medium text-ink-500 hidden sm:inline">
              Answered {answeredCount} of {total}
            </span>

            <div className="flex items-center gap-2">
              {currentIndex < total - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => Math.min(total - 1, prev + 1))}
                  className="inline-flex items-center gap-1 rounded-xl bg-brand-600 px-4 py-2 text-xs font-semibold text-white hover:bg-brand-700"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : null}

              <button
                type="button"
                onClick={handleSubmit}
                className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 shadow-sm"
              >
                Submit Quiz
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-end border-t border-ink-100 px-6 py-3.5 bg-ink-50/50">
            <button
              onClick={onClose}
              className="rounded-xl bg-ink-900 px-5 py-2 text-xs font-semibold text-white hover:bg-black transition-colors"
            >
              Close Review
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
