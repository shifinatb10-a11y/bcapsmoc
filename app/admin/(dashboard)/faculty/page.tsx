import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getFaculty } from "@/lib/queries";
import { canManage } from "@/lib/types";
import { AdminPageHeader, AdminCard, Unauthorized } from "@/components/admin/AdminPage";
import { FacultyForm } from "@/components/admin/entity-forms";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Avatar, Badge } from "@/components/ui";
import { deleteFaculty } from "@/app/actions/faculty";

export const dynamic = "force-dynamic";

export default async function AdminFacultyPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  if (!canManage(session.role, "department")) {
    return <Unauthorized section="department" />;
  }

  const faculty = await getFaculty();

  return (
    <>
      <AdminPageHeader
        title="Faculty"
        description="Add faculty members shown on the public Department page — photo, designation, qualification and a short description."
      />

      <AdminCard
        title="Add a faculty member"
        description="Fields marked with * are required."
      >
        <FacultyForm />
      </AdminCard>

      <div className="mt-8 space-y-4">
        <h2 className="font-display text-lg font-semibold text-ink-900">
          Current faculty ({faculty.length})
        </h2>

        {faculty.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-ink-100 bg-white px-5 py-10 text-center text-sm text-ink-500">
            No faculty members yet. Add the first one above.
          </p>
        ) : (
          faculty.map((member) => (
            <div
              key={member.id}
              className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card"
            >
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl">
                  <Avatar src={member.photo_url} name={member.name} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-ink-900">
                    {member.name}
                  </div>
                  <div className="text-sm text-brand-600">
                    {member.designation || member.role_title || "Faculty"}
                  </div>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-ink-500">
                    {member.qualification ? (
                      <Badge tone="muted">{member.qualification}</Badge>
                    ) : null}
                    {member.email ? <span>{member.email}</span> : null}
                  </div>
                </div>
                <DeleteButton
                  action={deleteFaculty}
                  id={member.id}
                  confirmMessage={`Delete ${member.name}? This cannot be undone.`}
                />
              </div>

              <details className="mt-4 border-t border-ink-100 pt-4">
                <summary className="cursor-pointer text-sm font-semibold text-brand-600">
                  Edit details
                </summary>
                <div className="mt-4">
                  <FacultyForm faculty={member} />
                </div>
              </details>
            </div>
          ))
        )}
      </div>
    </>
  );
}
