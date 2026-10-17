import { redirect } from "next/navigation";
import { GraduationCap } from "lucide-react";
import { getAdminSession } from "@/lib/auth";
import { getStudentBatches, getStudents } from "@/lib/queries";
import { canManage, canView } from "@/lib/types";
import {
  AdminPageHeader,
  AdminCard,
  Unauthorized,
} from "@/components/admin/AdminPage";
import { BatchForm, StudentForm } from "@/components/admin/entity-forms";
import { StudentFilters } from "@/components/admin/StudentFilters";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Badge } from "@/components/ui";
import { deleteStudent } from "@/app/actions/students";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ batch?: string }>;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  // Student records are private to the Department Admin and the Super Admin.
  if (!canView(session.role, "students")) {
    return <Unauthorized section="students" />;
  }

  const params = await searchParams;
  const batches = await getStudentBatches();

  const active =
    batches.find((batch) => batch.label === params.batch) ?? batches[0] ?? null;

  const students = active ? await getStudents(active.label) : [];
  const canEdit = canManage(session.role, "students");

  return (
    <>
      <AdminPageHeader
        title="Students"
        description="Private student records, kept under each batch year. Change a batch's semester to move the whole group. This page is never shown on the public website."
        action={canEdit ? undefined : <Badge tone="muted">View only</Badge>}
      />

      {batches.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-100 bg-white p-6 text-sm text-ink-500">
          No batch years yet. Add your first batch below.
        </div>
      ) : (
        <StudentFilters
          batches={batches}
          batch={active?.label ?? null}
          semester={active?.current_semester ?? 1}
        />
      )}

      {active && canEdit ? (
        <div className="mt-6">
          <AdminCard
            title={`Add a student to ${active.label} · Semester ${active.current_semester}`}
            description="Fields marked with * are required."
          >
            <StudentForm batch={active.label} />
          </AdminCard>
        </div>
      ) : null}

      {canEdit ? (
        <details className="mt-6 rounded-2xl border border-ink-100 bg-white p-6 shadow-card">
          <summary className="cursor-pointer font-display text-lg font-semibold text-ink-900">
            Add a batch year
          </summary>
          <p className="mt-1 text-sm text-ink-500">
            Create a new batch when a fresh group of students joins, e.g.
            2027-2031.
          </p>
          <div className="mt-5">
            <BatchForm />
          </div>
        </details>
      ) : null}

      {active ? (
        <div className="mt-8 space-y-4">
          <h2 className="font-display text-lg font-semibold text-ink-900">
            {active.label} · Semester {active.current_semester} —{" "}
            {students.length} {students.length === 1 ? "student" : "students"}
          </h2>

          {students.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-ink-100 bg-white px-5 py-10 text-center text-sm text-ink-500">
              No students added for this batch yet.
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
                      <StudentForm student={student} batch={active.label} />
                    </div>
                  </details>
                ) : null}
              </div>
            ))
          )}
        </div>
      ) : null}
    </>
  );
}
