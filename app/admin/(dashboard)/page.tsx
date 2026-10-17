import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { getAdminSession } from "@/lib/auth";
import {
  getAssociations,
  getClub,
  getFaculty,
  getGalleryItems,
  getPageVisibility,
  getStudentCount,
  getStudyMaterials,
  getTransactions,
} from "@/lib/queries";
import {
  canManage,
  canView,
  isSuperAdmin,
  ROLE_DESCRIPTIONS,
  ROLE_LABELS,
} from "@/lib/types";
import { isAdminVisible, PAGES } from "@/lib/pages";
import { AdminPageHeader } from "@/components/admin/AdminPage";
import { navItemsFor } from "@/components/admin/nav";
import { Badge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const [
    faculty,
    associations,
    club,
    materials,
    transactions,
    galleryItems,
    visibility,
    studentCount,
  ] = await Promise.all([
    getFaculty(),
    getAssociations(),
    getClub(),
    getStudyMaterials(),
    getTransactions(),
    getGalleryItems(),
    getPageVisibility(),
    canView(session.role, "students")
      ? getStudentCount()
      : Promise.resolve(0),
  ]);

  const reportCount = associations.reduce(
    (sum, item) => sum + item.reports.length,
    0,
  );

  const counts: Record<string, { value: number; label: string }> = {
    "/admin/students": { value: studentCount, label: "Student records" },
    "/admin/faculty": { value: faculty.length, label: "Faculty members" },
    "/admin/association": { value: associations.length, label: "Associations" },
    "/admin/club": { value: club?.events.length ?? 0, label: "Club events" },
    "/admin/study-zone": { value: materials.length, label: "Study materials" },
    "/admin/finance": { value: transactions.length, label: "Transactions" },
    "/admin/gallery": { value: galleryItems.length, label: "Gallery items" },
  };

  const hiddenPages = PAGES.filter(
    (page) => !isAdminVisible(visibility, page.key),
  ).map((page) => page.key);

  const visible = navItemsFor(session.role, hiddenPages).filter(
    (item) => item.href !== "/admin",
  );
  const manageable = visible.filter(
    (item) => item.section === null || canManage(session.role, item.section),
  );
  const viewOnly = visible.filter(
    (item) => item.section !== null && !canManage(session.role, item.section),
  );

  const summary = isSuperAdmin(session.role)
    ? "You have full access to every section of the dashboard and can manage all other administrator accounts."
    : manageable.length > 0
      ? `Your account can manage the ${manageable
          .map((item) => item.label.toLowerCase())
          .join(", ")} section${
          manageable.length > 1 ? "s" : ""
        }. Other sections stay locked to their own administrators.`
      : viewOnly.length > 0
        ? `You have read-only access to the ${viewOnly
            .map((item) => item.label.toLowerCase())
            .join(", ")} section. Editing is limited to its own administrator.`
        : "You have view-only access to the dashboard. Faculty, site settings and administrator accounts are managed by the Super Admin.";

  return (
    <>
      <AdminPageHeader
        title={`Welcome, ${ROLE_LABELS[session.role]}`}
        description={ROLE_DESCRIPTIONS[session.role]}
      />

      <div className="mb-8 flex items-start gap-4 rounded-2xl border border-brand-100 bg-brand-50 p-5">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
          <ShieldCheck className="h-5 w-5" />
        </span>
        <div className="text-sm">
          <div className="font-semibold text-brand-900">
            You are signed in as {session.email ?? "an administrator"}
          </div>
          <p className="mt-1 text-brand-800/80">{summary}</p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {visible.length === 0 ? (
          <p className="rounded-2xl border border-ink-100 bg-white p-6 text-sm text-ink-500 shadow-card sm:col-span-2">
            No pages are currently available to your account.
          </p>
        ) : null}
        {visible.map((item) => {
          const Icon = item.icon;
          const count = counts[item.href];
          const readOnly =
            item.section !== null && !canManage(session.role, item.section);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-start gap-4 rounded-2xl border border-ink-100 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lift"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="font-semibold text-ink-900">
                    {item.label}
                  </span>
                  {readOnly ? <Badge tone="muted">View only</Badge> : null}
                </span>
                <span className="block text-sm text-ink-500">
                  {item.description}
                </span>
                {count ? (
                  <span className="mt-2 inline-flex rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-semibold text-ink-700">
                    {count.value} {count.label}
                  </span>
                ) : null}
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-ink-500 transition-transform group-hover:translate-x-1" />
            </Link>
          );
        })}
      </div>

      {canManage(session.role, "association") ? (
        <p className="mt-6 text-sm text-ink-500">
          {reportCount} association event{" "}
          {reportCount === 1 ? "report" : "reports"} are currently published
          across all association terms.
        </p>
      ) : null}
    </>
  );
}
