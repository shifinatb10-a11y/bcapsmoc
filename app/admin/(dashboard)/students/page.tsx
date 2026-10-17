import { redirect } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { getAdminSession } from "@/lib/auth";
import { getStudents } from "@/lib/queries";
import { canManage, canView, SEMESTERS, STUDENT_BATCHES } from "@/lib/types";
import {
  AdminPageHeader,
  AdminCard,
  Unauthorized,
} from "@/components/admin/AdminPage";
import { StudentForm } from "@/components/admin/entity-forms";
import { StudentFilters } from "@/components/admin/StudentFilters";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Badge } from "@/components/ui";
import { deleteStudent } from "@/app/actions/students";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ batch?: string; sem?: string }>;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  // Student records are private to the Department Admin and the Super Admin.
  if (!canView(session.role, "students")) {
    return <Unauthorized section="students" />;
  }

  const params = await searchParams;
  const batch =
    params.batch && STUDENT_BATCHES.includes(params.batch)
      ? params.batch
      : STUDENT_BATCHES[0];
  const parsedSem = Number.parseInt(params.sem ?? "1", 10);
  const semester = SEMESTERS.includes(parsedSem) ? parsedSem : 1;

  const students = await getStudents(batch, semester);
  const canEdit = canManage(session.role, "students");

  return (
    <>
      <AdminPageHeader
        title="Students"
        description="Private student records, kept separate by batch year and semester. This page is never shown on the public website."
        action={canEdit ? undefined : <Badge tone="muted">View only</Badge>}
      />

      <StudentFilters batch={batch} semester={semester} />

      {canEdit ? (
        <div className="mt-6">
          <AdminCard
            title={`Add a student to ${batch} · Semester ${semester}`}
            description="Fields marked with * are required."
          >
            <StudentForm batch={batch} semester={semester} />
          </AdminCard>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-ink-100 bg-ink-50 p-5 text-sm text-ink-600">
          You have read-only access to student records.
        </div>
      )}

      <div className="mt-8 space-y-4">
        <h2 className="font-display text-lg font-semibold text-ink-900">
          {batch} · Semester {semester} — {students.length}{" "}
          {students.length === 1 ? "student" : "students"}
        </h2>

        {students.length === 0 ? (
          <p className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-ink-100 bg-white px-5 py-10 text-center text-sm text-ink-500">
            <GraduationCap className="h-4 w-4" />
            No students added for this batch and semester yet.
          </p>
        ) : (
          students.map((student) => (
            <div
              key={student.id}
              className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-ink-900">
                      {student.name}
                    </span>
                    {student.gender ? (
                      <Badge tone="muted">{student.gender}</Badge>
                    ) : null}
                  </div>
                  <div className="mt-1 text-xs text-ink-500">
                    {[
                      student.roll_no ? `Roll ${student.roll_no}` : null,
                      student.register_no
                        ? `Reg ${student.register_no}`
                        : null,
                      student.admission_no
                        ? `Adm ${student.admission_no}`
                        : null,
                    ]
                      .filter(Boolean)
                      .join(" · ") || "—"}
                  </div>
                  <dl className="mt-3 grid gap-x-6 gap-y-1 text-sm text-ink-600 sm:grid-cols-2">
                    <div className="flex gap-1.5">
                      <dt className="text-ink-500">APAAR ID:</dt>
                      <dd className="font-medium text-ink-700">
                        {student.apaar_id || "—"}
                      </dd>
                    </div>
                    <div className="flex gap-1.5">
                      <dt className="text-ink-500">DOB:</dt>
                      <dd className="font-medium text-ink-700">
                        {formatDate(student.dob) || "—"}
                      </dd>
                    </div>
                    <div className="flex gap-1.5">
                      <dt className="text-ink-500">Mobile:</dt>
                      <dd className="font-medium text-ink-700">
                        {student.mobile || "—"}
                      </dd>
                    </div>
                    <div className="flex gap-1.5">
                      <dt className="text-ink-500">Email:</dt>
                      <dd className="min-w-0 break-all font-medium text-ink-700">
                        {student.email || "—"}
                      </dd>
                    </div>
                  </dl>
                </div>
                {canEdit ? (
                  <DeleteButton
                    action={deleteStudent}
                    id={student.id}
                    confirmMessage={`Delete ${student.name}'s record? This cannot be undone.`}
                  />
                ) : null}
              </div>

              {canEdit ? (
                <details className="mt-4 border-t border-ink-100 pt-4">
                  <summary className="cursor-pointer text-sm font-semibold text-brand-600">
                    Edit details
                  </summary>
                  <div className="mt-4">
                    <StudentForm
                      student={student}
                      batch={batch}
                      semester={semester}
                    />
                  </div>
                </details>
              ) : null}
            </div>
          ))
        )}
      </div>
    </>
  );
}
