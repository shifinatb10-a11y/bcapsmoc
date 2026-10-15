import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { getAdminSession } from "@/lib/auth";
import {
  getAssociations,
  getClub,
  getFaculty,
  getStudyMaterials,
} from "@/lib/queries";
import { canManage, ROLE_DESCRIPTIONS, ROLE_LABELS } from "@/lib/types";
import { AdminPageHeader } from "@/components/admin/AdminPage";
import { ADMIN_NAV } from "@/components/admin/nav";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const [faculty, associations, club, materials] = await Promise.all([
    getFaculty(),
    getAssociations(),
    getClub(),
    getStudyMaterials(),
  ]);

  const reportCount = associations.reduce(
    (sum, item) => sum + item.reports.length,
    0,
  );

  const counts: Record<string, { value: number; label: string }> = {
    "/admin/faculty": { value: faculty.length, label: "Faculty members" },
    "/admin/association": { value: associations.length, label: "Associations" },
    "/admin/club": { value: club?.events.length ?? 0, label: "Club events" },
    "/admin/study-zone": { value: materials.length, label: "Study materials" },
  };

  const actions = ADMIN_NAV.filter(
    (item) => item.section !== null && canManage(session.role, item.section),
  );

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
          <p className="mt-1 text-brand-800/80">
            Your account can manage the{" "}
            {actions.map((item) => item.label.toLowerCase()).join(", ") ||
              "dashboard"}{" "}
            section. Other sections stay locked to their own administrators.
          </p>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {actions.map((item) => {
          const Icon = item.icon;
          const count = counts[item.href];
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
                <span className="block font-semibold text-ink-900">
                  {item.label}
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
