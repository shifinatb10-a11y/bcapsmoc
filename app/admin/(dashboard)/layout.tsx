import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getAdminSession } from "@/lib/auth";
import { getPageVisibility } from "@/lib/queries";
import { isAdminVisible, PAGES } from "@/lib/pages";
import { AdminShell } from "@/components/admin/AdminShell";

export const dynamic = "force-dynamic";

// Keep the whole dashboard out of search engines.
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

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
