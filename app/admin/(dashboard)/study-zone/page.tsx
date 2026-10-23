import { redirect } from "next/navigation";
import {
  FileText,
  HelpCircle,
  Clock,
  Layers,
  BookOpen,
  FolderOpen,
} from "lucide-react";
import { getAdminSession } from "@/lib/auth";
import { getStudyMaterials, getQuizzes } from "@/lib/queries";
import { canManage, isSuperAdmin, type Quiz } from "@/lib/types";
import { adminPageVisible } from "@/lib/page-visibility";
import { AdminPageHeader, AdminCard, Unauthorized } from "@/components/admin/AdminPage";
import { MaterialForm } from "@/components/admin/entity-forms";
import { QuizForm } from "@/components/admin/QuizForm";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Badge } from "@/components/ui";
import { deleteMaterial, deleteQuiz } from "@/app/actions/study";

export const dynamic = "force-dynamic";

export default async function AdminStudyZonePage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  if (!canManage(session.role, "studyzone")) {
    return <Unauthorized section="studyzone" />;
  }
  if (!isSuperAdmin(session.role) && !(await adminPageVisible("study-zone"))) {
    return <Unauthorized section="studyzone" />;
  }

  const [allMaterials, quizzes] = await Promise.all([
    getStudyMaterials(),
    getQuizzes(),
  ]);

  // Notes section is removed - only question papers are managed
  const questionPapers = allMaterials.filter(
    (item) => item.category !== "notes",
  );

  const totalQuestions = quizzes.reduce(
    (acc, q) => acc + (q.questions?.length || 0),
    0,
  );

  // Group quizzes by Semester -> Subject -> Quizzes
  const quizzesBySemester: Record<string, Record<string, Quiz[]>> = {};
  const existingSubjectsSet = new Set<string>();

  quizzes.forEach((quiz) => {
    const sem = quiz.semester || "Unassigned Semester";
    const sub = quiz.subject || "General";
    existingSubjectsSet.add(sub);

    if (!quizzesBySemester[sem]) {
      quizzesBySemester[sem] = {};
    }
    if (!quizzesBySemester[sem][sub]) {
      quizzesBySemester[sem][sub] = [];
    }
    quizzesBySemester[sem][sub].push(quiz);
  });

  const existingSubjects = Array.from(existingSubjectsSet);
  const semestersList = Object.keys(quizzesBySemester).sort();

  return (
    <>
      <AdminPageHeader
        title="Study Zone"
        description="Manage subject quizzes and previous year question papers. Quizzes are organised under each subject in its corresponding semester."
      />

      {/* Overview Stat Counters */}
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-ink-100 bg-white p-4 text-center shadow-card">
          <div className="font-display text-2xl font-semibold text-brand-700">
            {quizzes.length}
          </div>
          <div className="text-xs font-medium uppercase tracking-wide text-ink-500">
            Quizzes
          </div>
        </div>

        <div className="rounded-xl border border-ink-100 bg-white p-4 text-center shadow-card">
          <div className="font-display text-2xl font-semibold text-brand-700">
            {totalQuestions}
          </div>
          <div className="text-xs font-medium uppercase tracking-wide text-ink-500">
            Questions
          </div>
        </div>

        <div className="rounded-xl border border-ink-100 bg-white p-4 text-center shadow-card">
          <div className="font-display text-2xl font-semibold text-brand-700">
            {existingSubjects.length}
          </div>
          <div className="text-xs font-medium uppercase tracking-wide text-ink-500">
            Subjects
          </div>
        </div>

        <div className="rounded-xl border border-ink-100 bg-white p-4 text-center shadow-card">
          <div className="font-display text-2xl font-semibold text-brand-700">
            {questionPapers.length}
          </div>
          <div className="text-xs font-medium uppercase tracking-wide text-ink-500">
            Question Papers
          </div>
        </div>
      </div>

      {/* QUIZZES SECTION (Primary Focus) */}
      <div className="space-y-8">
        <AdminCard
          title="Add New Subject Quiz"
          description="Create interactive multiple-choice quizzes under specific subjects and semesters for students to practice."
        >
          <QuizForm existingSubjects={existingSubjects} />
        </AdminCard>

        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display text-xl font-semibold text-ink-900">
                Published Quizzes ({quizzes.length})
              </h2>
              <p className="text-xs text-ink-500">
                Organised hierarchically: Semesters → Subjects → Quizzes
              </p>
            </div>
          </div>

          {quizzes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-ink-200 bg-white px-5 py-12 text-center text-sm text-ink-500">
              <HelpCircle className="mx-auto h-8 w-8 text-ink-400 mb-2" />
              <p className="font-semibold text-ink-700">No quizzes published yet</p>
              <p className="mt-1 text-xs">
                Use the form above to add your first quiz under any semester and subject.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {semestersList.map((sem) => {
                const subjectsObj = quizzesBySemester[sem];
                const subjectNames = Object.keys(subjectsObj).sort();

                return (
                  <div
                    key={sem}
                    className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card"
                  >
                    <div className="flex items-center justify-between border-b border-ink-100 bg-brand-50/50 px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-brand-600" />
                        <h3 className="font-display text-base font-bold text-brand-900">
                          {sem}
                        </h3>
                      </div>
                      <span className="text-xs font-semibold text-brand-700">
                        {subjectNames.length} {subjectNames.length === 1 ? "Subject" : "Subjects"}
                      </span>
                    </div>

                    <div className="p-5 space-y-6">
                      {subjectNames.map((subj) => {
                        const subjectQuizzes = subjectsObj[subj];

                        return (
                          <div
                            key={subj}
                            className="rounded-xl border border-ink-100 bg-ink-50/30 p-4"
                          >
                            <div className="flex items-center gap-2 mb-3">
                              <BookOpen className="h-4 w-4 text-ink-600" />
                              <h4 className="font-display text-sm font-bold text-ink-900">
                                Subject: {subj}
                              </h4>
                              <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-[11px] font-semibold text-ink-600 border border-ink-100">
                                {subjectQuizzes.length} {subjectQuizzes.length === 1 ? "quiz" : "quizzes"}
                              </span>
                            </div>

                            <div className="space-y-3">
                              {subjectQuizzes.map((quiz) => (
                                <div
                                  key={quiz.id}
                                  className="rounded-xl border border-ink-100 bg-white p-4 shadow-sm"
                                >
                                  <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div>
                                      <div className="flex flex-wrap items-center gap-2">
                                        <Badge tone="brand">
                                          {quiz.questions?.length ?? 0} Questions
                                        </Badge>
                                        {quiz.duration_minutes ? (
                                          <Badge tone="muted">
                                            <Clock className="h-3 w-3 mr-1" />
                                            {quiz.duration_minutes} mins
                                          </Badge>
                                        ) : (
                                          <Badge tone="muted">Untimed</Badge>
                                        )}
                                        <span className="font-semibold text-ink-900">
                                          {quiz.title}
                                        </span>
                                      </div>

                                      {quiz.description ? (
                                        <p className="mt-2 text-xs text-ink-600">
                                          {quiz.description}
                                        </p>
                                      ) : null}

                                      {quiz.quiz_url ? (
                                        <div className="mt-2">
                                          <a
                                            href={quiz.quiz_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs font-semibold text-brand-600 hover:text-brand-700 underline"
                                          >
                                            External Link: {quiz.quiz_url}
                                          </a>
                                        </div>
                                      ) : null}
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <DeleteButton
                                        action={deleteQuiz}
                                        id={quiz.id}
                                        confirmMessage={`Delete quiz "${quiz.title}"?`}
                                      />
                                    </div>
                                  </div>

                                  <details className="mt-3 border-t border-ink-100 pt-3">
                                    <summary className="cursor-pointer text-xs font-semibold text-brand-600 hover:text-brand-700">
                                      Edit quiz details & questions
                                    </summary>
                                    <div className="mt-4">
                                      <QuizForm
                                        quiz={quiz}
                                        existingSubjects={existingSubjects}
                                      />
                                    </div>
                                  </details>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* QUESTION PAPERS SECTION (Notes removed) */}
        <div className="pt-8 border-t border-ink-200">
          <div className="mb-6">
            <h2 className="font-display text-xl font-semibold text-ink-900">
              Previous Year Question Papers
            </h2>
            <p className="text-xs text-ink-500">
              Upload and manage university examination question papers for BCA students.
            </p>
          </div>

          <AdminCard title="Upload a Question Paper">
            <MaterialForm />
          </AdminCard>

          <div className="mt-6 space-y-4">
            <h3 className="font-display text-base font-semibold text-ink-900">
              Published Question Papers ({questionPapers.length})
            </h3>

            {questionPapers.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-ink-100 bg-white px-5 py-10 text-center text-sm text-ink-500">
                No question papers uploaded yet. Add the first one above.
              </p>
            ) : (
              questionPapers.map((material) => (
                <div
                  key={material.id}
                  className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge tone="gold">
                          <FileText className="h-3.5 w-3.5" />
                          Question Paper
                        </Badge>
                        <span className="font-semibold text-ink-900">
                          {material.title}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-ink-500">
                        {[material.subject, material.semester, material.year]
                          .filter(Boolean)
                          .join(" · ")}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-3">
                        <a
                          href={material.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                        >
                          Open file
                        </a>
                      </div>
                    </div>
                    <DeleteButton
                      action={deleteMaterial}
                      id={material.id}
                      confirmMessage={`Delete "${material.title}"?`}
                    />
                  </div>

                  <details className="mt-4 border-t border-ink-100 pt-4">
                    <summary className="cursor-pointer text-sm font-semibold text-brand-600">
                      Edit question paper
                    </summary>
                    <div className="mt-4">
                      <MaterialForm material={material} />
                    </div>
                  </details>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
