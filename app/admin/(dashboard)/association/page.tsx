import { redirect } from "next/navigation";
import { CalendarDays, FileText } from "lucide-react";
import { getAdminSession } from "@/lib/auth";
import { getAssociations } from "@/lib/queries";
import { canManage } from "@/lib/types";
import { AdminPageHeader, AdminCard, Unauthorized } from "@/components/admin/AdminPage";
import { AssociationForm, ReportForm } from "@/components/admin/entity-forms";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Badge } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import { deleteAssociation, deleteReport } from "@/app/actions/association";

export const dynamic = "force-dynamic";

export default async function AdminAssociationPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  if (!canManage(session.role, "association")) {
    return <Unauthorized section="association" />;
  }

  const associations = await getAssociations();

  return (
    <>
      <AdminPageHeader
        title="Association"
        description="Manage each association term: the secretary, completed event reports (PDF) and the department magazine."
      />

      <AdminCard
        title="Add an association term"
        description="For example the 2027–2028 committee. Only year label is required."
      >
        <AssociationForm />
      </AdminCard>

      <div className="mt-8 space-y-6">
        <h2 className="font-display text-lg font-semibold text-ink-900">
          Association terms ({associations.length})
        </h2>

        {associations.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-ink-100 bg-white px-5 py-10 text-center text-sm text-ink-500">
            No association terms yet. Add the first one above.
          </p>
        ) : (
          associations.map((association) => (
            <div
              key={association.id}
              className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone="gold">{association.year_label}</Badge>
                    <span className="font-display text-base font-semibold text-ink-900">
                      {association.name}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-ink-500">
                    Secretary: {association.secretary_name || "—"}
                    {association.magazine_url ? " · Magazine published" : ""}
                  </div>
                </div>
                <DeleteButton
                  action={deleteAssociation}
                  id={association.id}
                  confirmMessage={`Delete the ${association.year_label} association and all its reports? This cannot be undone.`}
                />
              </div>

              <details className="mt-4 border-t border-ink-100 pt-4">
                <summary className="cursor-pointer text-sm font-semibold text-brand-600">
                  Edit association details
                </summary>
                <div className="mt-4">
                  <AssociationForm association={association} />
                </div>
              </details>

              {/* Reports */}
              <div className="mt-6 rounded-xl border border-ink-100 bg-ink-50 p-4 sm:p-5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700">
                  <FileText className="h-4 w-4" />
                  Event reports ({association.reports.length})
                </div>

                {association.reports.length > 0 ? (
                  <ul className="mt-3 space-y-2">
                    {association.reports.map((report) => (
                      <li
                        key={report.id}
                        className="rounded-lg border border-ink-100 bg-white p-3.5"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-ink-900">
                              {report.title}
                            </div>
                            {report.event_date ? (
                              <div className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-ink-500">
                                <CalendarDays className="h-3.5 w-3.5" />
                                {formatDate(report.event_date)}
                              </div>
                            ) : null}
                          </div>
                          <DeleteButton
                            action={deleteReport}
                            id={report.id}
                            label="Remove"
                            confirmMessage={`Delete report "${report.title}"?`}
                          />
                        </div>
                        <details className="mt-3">
                          <summary className="cursor-pointer text-xs font-semibold text-brand-600">
                            Edit report
                          </summary>
                          <div className="mt-3">
                            <ReportForm
                              associations={associations}
                              report={report}
                            />
                          </div>
                        </details>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-ink-500">
                    No reports for this term yet.
                  </p>
                )}

                <details className="mt-4">
                  <summary className="cursor-pointer text-sm font-semibold text-brand-600">
                    + Add a report to {association.year_label}
                  </summary>
                  <div className="mt-4">
                    <ReportForm
                      associations={associations}
                      defaultAssociationId={association.id}
                    />
                  </div>
                </details>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}
