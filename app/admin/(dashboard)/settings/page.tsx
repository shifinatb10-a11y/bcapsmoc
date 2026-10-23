import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getSettings } from "@/lib/queries";
import { canManage } from "@/lib/types";
import { AdminPageHeader, AdminCard, Unauthorized } from "@/components/admin/AdminPage";
import { SettingsForm } from "@/components/admin/entity-forms";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  if (!canManage(session.role, "department")) {
    return <Unauthorized section="department" />;
  }

  const settings = await getSettings();
  const heroImage = settings.hero_image_url || "/college-photo.jpg";

  return (
    <>
      <AdminPageHeader
        title="Site Settings"
        description="Change the homepage image and the department text shown on the public website."
      />

      <AdminCard title="Current homepage image">
        <div className="overflow-hidden rounded-xl border border-ink-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroImage}
            alt="Current homepage hero"
            className="h-52 w-full object-cover sm:h-72"
          />
        </div>
        <p className="mt-3 text-xs text-ink-500">
          {settings.hero_image_url
            ? "This image has been uploaded by an administrator."
            : "The default placeholder is being used. Upload the PSMO College photo below to replace it."}
        </p>
      </AdminCard>

      <div className="mt-8">
        <AdminCard title="Homepage & department text">
          <SettingsForm settings={settings} />
        </AdminCard>
      </div>
    </>
  );
}
