import { redirect } from "next/navigation";
import { FileText, NotebookPen } from "lucide-react";
import { getAdminSession } from "@/lib/auth";
import { getStudyMaterials } from "@/lib/queries";
import { canManage, isSuperAdmin } from "@/lib/types";
import { adminPageVisible } from "@/lib/page-visibility";
import { AdminPageHeader, AdminCard, Unauthorized } from "@/components/admin/AdminPage";
import { MaterialForm } from "@/components/admin/entity-forms";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Badge } from "@/components/ui";
import { deleteMaterial } from "@/app/actions/study";

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

  const materials = await getStudyMaterials();
  const questionPapers = materials.filter(
    (item) => item.category === "question_paper",
  ).length;
  const notes = materials.filter((item) => item.category === "notes").length;

  return (
    <>
      <AdminPageHeader
        title="Study Zone"
        description="Upload previous year question papers and study notes. Students can view or download them from the public Study Zone page."
      />

      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-ink-100 bg-white p-4 text-center shadow-card">
          <div className="font-display text-2xl font-semibold text-brand-700">
            {questionPapers}
          </div>
          <div className="text-xs font-medium uppercase tracking-wide text-ink-500">
            Question papers
          </div>
        </div>
        <div className="rounded-xl border border-ink-100 bg-white p-4 text-center shadow-card">
          <div className="font-display text-2xl font-semibold text-brand-700">
            {notes}
          </div>
          <div className="text-xs font-medium uppercase tracking-wide text-ink-500">
            Notes
          </div>
        </div>
        <div className="rounded-xl border border-ink-100 bg-white p-4 text-center shadow-card">
          <div className="font-display text-2xl font-semibold text-brand-700">
            {materials.length}
          </div>
          <div className="text-xs font-medium uppercase tracking-wide text-ink-500">
            Total
          </div>
        </div>
      </div>

      <AdminCard title="Upload a study material">
        <MaterialForm />
      </AdminCard>

      <div className="mt-8 space-y-4">
        <h2 className="font-display text-lg font-semibold text-ink-900">
          Published materials ({materials.length})
        </h2>

        {materials.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-ink-100 bg-white px-5 py-10 text-center text-sm text-ink-500">
            Nothing uploaded yet. Add the first resource above.
          </p>
        ) : (
          materials.map((material) => (
            <div
              key={material.id}
              className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={material.category === "notes" ? "brand" : "gold"}>
                      {material.category === "notes" ? (
                        <>
                          <NotebookPen className="h-3.5 w-3.5" />
                          Notes
                        </>
                      ) : (
                        <>
                          <FileText className="h-3.5 w-3.5" />
                          Question Paper
                        </>
                      )}
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
                  Edit material
                </summary>
                <div className="mt-4">
                  <MaterialForm material={material} />
                </div>
              </details>
            </div>
          ))
        )}
      </div>
    </>
  );
}
