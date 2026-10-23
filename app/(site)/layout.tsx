import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { StructuredData } from "@/components/StructuredData";
import { Analytics } from "@/components/Analytics";
import { MagnetLines } from "@/components/MagnetLines";
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
      {/* Animated magnet-lines background — subtle indigo needles */}
      <MagnetLines
        color="rgba(99, 102, 241, 0.13)"
        spacing={26}
        lineWidth={1.5}
        lineHeight={13}
      />
      {/* All page content sits above the canvas */}
      <div className="relative z-10 flex min-h-screen flex-col">
        <SiteHeader hiddenHrefs={hiddenHrefs} />
        <main className="flex-1">{children}</main>
        <SiteFooter hiddenHrefs={hiddenHrefs} />
      </div>
      <Analytics />
    </div>
  );
}
