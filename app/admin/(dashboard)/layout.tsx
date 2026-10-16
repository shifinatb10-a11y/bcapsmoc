import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { getPageVisibility } from "@/lib/queries";
import { isAdminVisible, PAGES } from "@/lib/pages";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const visibility = await getPageVisibility();
  const hiddenPages = PAGES.filter(
    (page) => !isAdminVisible(visibility, page.key),
  ).map((page) => page.key);

  return (
    <AdminShell
      role={session.role}
      email={session.email}
      hiddenPages={hiddenPages}
    >
      {children}
    </AdminShell>
  );
}
