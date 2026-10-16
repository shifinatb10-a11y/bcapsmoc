import { redirect } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { getAdminSession } from "@/lib/auth";
import { getPageVisibility } from "@/lib/queries";
import { isSuperAdmin } from "@/lib/types";
import { isAdminVisible, isPublicVisible, PAGES } from "@/lib/pages";
import {
  AdminPageHeader,
  AdminCard,
  Unauthorized,
} from "@/components/admin/AdminPage";
import { PageToggleForm } from "@/components/admin/extra-forms";
import { Badge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminPagesPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  if (!isSuperAdmin(session.role)) {
    return <Unauthorized section="department" />;
  }

  const visibility = await getPageVisibility();

  return (
    <>
      <AdminPageHeader
        title="Pages"
        description="Show or hide each page on the public website and in the admin dashboards. Only you, the Super Admin, can change this."
      />

      <div className="space-y-4">
        {PAGES.map((page) => {
          const state = visibility[page.key] ?? {
            public_visible: true,
            admin_visible: true,
          };
          const publicVisible = isPublicVisible(visibility, page.key);
          const adminVisible = isAdminVisible(visibility, page.key);

          return (
            <AdminCard key={page.key}>
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-display text-lg font-semibold text-ink-900">
                      {page.label}
                    </h2>
                    {publicVisible ? (
                      <Badge tone="brand">
                        <Eye className="h-3.5 w-3.5" />
                        Public
                      </Badge>
                    ) : (
                      <Badge tone="muted">
                        <EyeOff className="h-3.5 w-3.5" />
                        Hidden from public
                      </Badge>
                    )}
                    {page.adminHref ? (
                      adminVisible ? null : (
                        <Badge tone="muted">
                          <EyeOff className="h-3.5 w-3.5" />
                          Hidden from admins
                        </Badge>
                      )
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-ink-500">
                    {page.description}
                  </p>
                </div>
              </div>

              <PageToggleForm
                pageKey={page.key}
                label={page.label}
                hasPublic={page.publicHref !== null}
                hasAdmin={page.adminHref !== null}
                visibility={state}
              />
            </AdminCard>
          );
        })}
      </div>
    </>
  );
}
