"use client";

import { useState } from "react";
import { Plus, Trash2, CheckCircle2, HelpCircle } from "lucide-react";
import { AdminForm } from "./AdminForm";
import { Field, FormGrid, inputClass } from "./Field";
import { saveQuiz } from "@/app/actions/study";
import type { Quiz, QuizQuestion } from "@/lib/types";

const SEMESTERS = [
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Semester 7",
  "Semester 8",
];

const DEFAULT_QUESTION: QuizQuestion = {
  id: "q_1",
  question: "",
  options: ["", "", "", ""],
  correct_option: 0,
  explanation: "",
};

export function QuizForm({
  quiz,
  existingSubjects = [],
}: {
  quiz?: Quiz;
  existingSubjects?: string[];
}) {
  const [semester, setSemester] = useState(quiz?.semester ?? "Semester 1");
  const [customSemester, setCustomSemester] = useState(
    quiz && !SEMESTERS.includes(quiz.semester) ? quiz.semester : "",
  );
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => {
    if (quiz?.questions && Array.isArray(quiz.questions) && quiz.questions.length > 0) {
      return quiz.questions;
    }
    return [{ ...DEFAULT_QUESTION, id: "q_1" }];
  });

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        id: `q_${Date.now()}`,
        question: "",
        options: ["", "", "", ""],
        correct_option: 0,
        explanation: "",
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length <= 1) {
      setQuestions([
        {
          id: `q_${Date.now()}`,
          question: "",
          options: ["", "", "", ""],
          correct_option: 0,
          explanation: "",
        },
      ]);
      return;
    }
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuestionText = (index: number, text: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], question: text };
      return copy;
    });
  };

  const updateOptionText = (
    qIndex: number,
    optIndex: number,
    text: string,
  ) => {
    setQuestions((prev) => {
      const copy = [...prev];
      const newOptions = [...copy[qIndex].options];
      newOptions[optIndex] = text;
      copy[qIndex] = { ...copy[qIndex], options: newOptions };
      return copy;
    });
  };

  const setCorrectOption = (qIndex: number, optIndex: number) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIndex] = { ...copy[qIndex], correct_option: optIndex };
      return copy;
    });
  };

  const updateExplanation = (qIndex: number, explanation: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[qIndex] = { ...copy[qIndex], explanation };
      return copy;
    });
  };

  const effectiveSemester = semester === "custom" ? customSemester : semester;

  return (
    <AdminForm
      action={saveQuiz}
      submitLabel={quiz ? "Save changes" : "Publish Quiz"}
      hiddenFields={{
        ...(quiz ? { id: quiz.id } : {}),
        semester: effectiveSemester,
        questions_json: JSON.stringify(questions),
      }}
    >
      <FormGrid cols={2}>
        <Field label="Quiz Title" htmlFor="quiz_title" required>
          <input
            id="quiz_title"
            name="title"
            required
            defaultValue={quiz?.title ?? ""}
            placeholder="e.g. C Programming Basics Quiz"
            className={inputClass}
          />
        </Field>

        <Field label="Semester" htmlFor="quiz_semester" required>
          <div className="space-y-2">
            <select
              id="quiz_semester"
              value={SEMESTERS.includes(semester) ? semester : "custom"}
              onChange={(e) => setSemester(e.target.value)}
              className={inputClass}
            >
              {SEMESTERS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
              <option value="custom">Other / Custom</option>
            </select>
            {semester === "custom" || !SEMESTERS.includes(semester) ? (
              <input
                type="text"
                placeholder="Enter custom semester (e.g. Semester 1)"
                value={customSemester}
                onChange={(e) => setCustomSemester(e.target.value)}
                required
                className={inputClass}
              />
            ) : null}
          </div>
        </Field>

        <Field
          label="Subject"
          htmlFor="quiz_subject"
          hint="e.g. Data Structures, Problem Solving using C"
          required
        >
          <input
            id="quiz_subject"
            name="subject"
            required
            list="subject-suggestions"
            defaultValue={quiz?.subject ?? ""}
            placeholder="e.g. Problem Solving using C"
            className={inputClass}
          />
          {existingSubjects.length > 0 ? (
            <datalist id="subject-suggestions">
              {existingSubjects.map((sub) => (
                <option key={sub} value={sub} />
              ))}
            </datalist>
          ) : null}
        </Field>

        <Field
          label="Duration (minutes, optional)"
          htmlFor="duration_minutes"
          hint="Leave blank for untimed quiz"
        >
          <input
            id="duration_minutes"
            name="duration_minutes"
            type="number"
            min={1}
            max={180}
            defaultValue={quiz?.duration_minutes ?? ""}
            placeholder="e.g. 15"
            className={inputClass}
          />
        </Field>
      </FormGrid>

      <Field label="Description / Instructions" htmlFor="quiz_desc">
        <textarea
          id="quiz_desc"
          name="description"
          rows={2}
          defaultValue={quiz?.description ?? ""}
          placeholder="Brief description, covered topics, or instructions for students…"
          className={inputClass}
        />
      </Field>

      <Field
        label="External Quiz Link (Optional)"
        htmlFor="quiz_url"
        hint="If you want to link out to Google Forms, Kahoot, or Quizizz instead of or alongside built-in questions"
      >
        <input
          id="quiz_url"
          name="quiz_url"
          type="url"
          defaultValue={quiz?.quiz_url ?? ""}
          placeholder="https://forms.google.com/..."
          className={inputClass}
        />
      </Field>

      {/* Questions Builder */}
      <div className="mt-6 rounded-2xl border border-ink-100 bg-ink-50/50 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 pb-4">
          <div>
            <h3 className="font-display text-base font-semibold text-ink-900">
              Interactive Quiz Questions ({questions.length})
            </h3>
            <p className="mt-0.5 text-xs text-ink-500">
              Add multiple choice questions with 4 options and mark the correct answer.
            </p>
          </div>
          <button
            type="button"
            onClick={addQuestion}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-100 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Question
          </button>
        </div>

        <div className="mt-5 space-y-6">
          {questions.map((q, qIdx) => (
            <div
              key={q.id || qIdx}
              className="rounded-xl border border-ink-100 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                  Question {qIdx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeQuestion(qIdx)}
                  className="text-xs font-medium text-red-600 hover:text-red-700 inline-flex items-center gap-1"
                  title="Remove this question"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </button>
              </div>

              <div className="mb-3">
                <label className="block text-xs font-semibold text-ink-700 mb-1">
                  Question Prompt *
                </label>
                <textarea
                  value={q.question}
                  onChange={(e) => updateQuestionText(qIdx, e.target.value)}
                  placeholder="Enter the question text here…"
                  rows={2}
                  className={inputClass}
                  required
                />
              </div>

              <div className="grid gap-2.5 sm:grid-cols-2 mb-3">
                {["A", "B", "C", "D"].map((optLabel, optIdx) => {
                  const isCorrect = q.correct_option === optIdx;
                  return (
                    <div
                      key={optLabel}
                      className={`flex items-center gap-2 rounded-lg border p-2 transition-colors ${
                        isCorrect
                          ? "border-emerald-500 bg-emerald-50/40"
                          : "border-ink-100 bg-ink-50/40"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setCorrectOption(qIdx, optIdx)}
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                          isCorrect
                            ? "bg-emerald-600 text-white"
                            : "bg-ink-200 text-ink-700 hover:bg-ink-300"
                        }`}
                        title={isCorrect ? "Correct answer" : "Mark as correct answer"}
                      >
                        {isCorrect ? <CheckCircle2 className="h-4 w-4" /> : optLabel}
                      </button>
                      <input
                        type="text"
                        value={q.options[optIdx] ?? ""}
                        onChange={(e) => updateOptionText(qIdx, optIdx, e.target.value)}
                        placeholder={`Option ${optLabel}`}
                        className="flex-1 bg-transparent text-xs text-ink-900 focus:outline-none placeholder:text-ink-400"
                        required
                      />
                    </div>
                  );
                })}
              </div>

              <div className="mt-2">
                <label className="flex items-center gap-1 text-xs font-semibold text-ink-500 mb-1">
                  <HelpCircle className="h-3.5 w-3.5" />
                  Explanation / Solution Note (shown after submission)
                </label>
                <input
                  type="text"
                  value={q.explanation ?? ""}
                  onChange={(e) => updateExplanation(qIdx, e.target.value)}
                  placeholder="e.g. In C, arrays are passed by reference using pointers."
                  className="w-full rounded-lg border border-ink-100 bg-ink-50/40 px-3 py-1.5 text-xs text-ink-900 placeholder:text-ink-400 focus:border-brand-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addQuestion}
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700"
        >
          <Plus className="h-3.5 w-3.5" />
          Add another question
        </button>
      </div>
    </AdminForm>
  );
}
