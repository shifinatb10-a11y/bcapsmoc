import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { getAdminSession } from "@/lib/auth";
import { getAdminUsers } from "@/lib/queries-admin";
import { canManage, ADMIN_ROLES, ROLE_DESCRIPTIONS, ROLE_LABELS } from "@/lib/types";
import { AdminPageHeader, AdminCard, Unauthorized } from "@/components/admin/AdminPage";
import { AdminForm } from "@/components/admin/AdminForm";
import { inputClass } from "@/components/admin/Field";
import { updateAdminRole } from "@/app/actions/team";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  if (!canManage(session.role, "department")) {
    return <Unauthorized section="department" />;
  }

  const admins = await getAdminUsers();

  return (
    <>
      <AdminPageHeader
        title="Admin Team"
        description="Review every administrator account and the section each role is allowed to manage."
      />

      <AdminCard title="Administrator accounts">
        {admins.length === 0 ? (
          <p className="text-sm text-ink-500">
            No administrator accounts were returned. If you have already created
            one, check the Row Level Security policies in Supabase.
          </p>
        ) : (
          <ul className="space-y-3">
            {admins.map((admin) => (
              <li
                key={admin.id}
                className="flex flex-col gap-4 rounded-xl border border-ink-100 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <ShieldCheck className="h-5 w-5" />
                  </span>
                  <div>
                    <div className="font-semibold text-ink-900">
                      {admin.email ?? "Unknown email"}
                    </div>
                    <div className="text-xs text-ink-500">
                      Current role: {ROLE_LABELS[admin.role] ?? admin.role}
                    </div>
                  </div>
                </div>

                <AdminForm
                  action={updateAdminRole}
                  submitLabel="Update role"
                  hiddenFields={{ id: admin.id }}
                  className="sm:w-64"
                >
                  <select
                    name="role"
                    defaultValue={admin.role}
                    className={inputClass}
                  >
                    {ADMIN_ROLES.map((role) => (
                      <option key={role} value={role}>
                        {ROLE_LABELS[role]}
                      </option>
                    ))}
                  </select>
                </AdminForm>
              </li>
            ))}
          </ul>
        )}
      </AdminCard>

      <div className="mt-8">
        <AdminCard
          title="About the four admin roles"
          description="Each role only sees and edits its own section."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {ADMIN_ROLES.map((role) => (
              <div
                key={role}
                className="rounded-xl border border-ink-100 bg-ink-50 p-4"
              >
                <div className="text-sm font-semibold text-ink-900">
                  {ROLE_LABELS[role]}
                </div>
                <p className="mt-1 text-sm text-ink-500">
                  {ROLE_DESCRIPTIONS[role]}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-amber-100 bg-amber-50 p-4 text-sm text-amber-900">
            <div className="font-semibold">Adding a new administrator</div>
            <p className="mt-1">
              For security, administrator accounts are created inside Supabase,
              not from this website. In the Supabase dashboard open{" "}
              <strong>Authentication → Users → Add user</strong>, create the
              account with an email and password, then add a matching row in the{" "}
              <code className="rounded bg-white px-1.5 py-0.5 text-xs">
                admin_users
              </code>{" "}
              table with that user&apos;s id and the role you want. The SQL file
              in the repository (<code>sql/schema.sql</code>) includes examples.
            </p>
          </div>
        </AdminCard>
      </div>
    </>
  );
}
