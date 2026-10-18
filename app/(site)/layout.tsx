import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StructuredData } from "@/components/StructuredData";
import { Analytics } from "@/components/Analytics";
import { getPageVisibility } from "@/lib/queries";
import { isPublicVisible, PAGES } from "@/lib/pages";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const visibility = await getPageVisibility();
  const hiddenHrefs = PAGES.filter(
    (page) => page.publicHref && !isPublicVisible(visibility, page.key),
  ).map((page) => page.publicHref as string);

  return (
    <div className="flex min-h-screen flex-col">
      <StructuredData />
      <SiteHeader hiddenHrefs={hiddenHrefs} />
      <main className="flex-1">{children}</main>
      <SiteFooter hiddenHrefs={hiddenHrefs} />
      <Analytics />
    </div>
  );
}
