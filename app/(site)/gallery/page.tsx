import { notFound } from "next/navigation";
import { getGalleryItems, getHeroImage } from "@/lib/queries";
import { publicPageVisible } from "@/lib/page-visibility";
import { Container, EmptyState, PageHero } from "@/components/ui";
import { GalleryGrid } from "@/components/GalleryGrid";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gallery",
  description:
    "Photos and videos from the Department of Computer Applications, PSMO College (Autonomous), Tirurangadi.",
  alternates: { canonical: "/gallery" },
};

export default async function GalleryPage() {
  if (!(await publicPageVisible("gallery"))) notFound();

  const [items, heroImage] = await Promise.all([
    getGalleryItems(),
    getHeroImage(),
  ]);

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Moments from the department"
        description="Photos and videos from association events, club activities, seminars and campus life at the Department of Computer Applications."
        imageUrl={heroImage}
      />

      <Container className="py-14 sm:py-20">
        {items.length === 0 ? (
          <EmptyState
            title="No photos or videos yet"
            description="The gallery is being prepared. Please check back soon."
          />
        ) : (
          <GalleryGrid items={items} />
        )}
      </Container>
    </>
  );
}
