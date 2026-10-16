import { Images, PlayCircle } from "lucide-react";
import { notFound } from "next/navigation";
import { getGalleryItems } from "@/lib/queries";
import { publicPageVisible } from "@/lib/page-visibility";
import { Container, EmptyState, PageHero } from "@/components/ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Gallery",
  description:
    "Photos and videos from the Department of Computer Applications, PSMO College (Autonomous), Tirurangadi.",
};

export default async function GalleryPage() {
  if (!(await publicPageVisible("gallery"))) notFound();

  const items = await getGalleryItems();

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Moments from the department"
        description="Photos and videos from association events, club activities, seminars and campus life at the Department of Computer Applications."
      />

      <Container className="py-14 sm:py-20">
        {items.length === 0 ? (
          <EmptyState
            title="No photos or videos yet"
            description="The gallery is being prepared. Please check back soon."
          />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) =>
              item.media_type === "image" ? (
                <figure
                  key={item.id}
                  className="group overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card"
                >
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block overflow-hidden"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.url}
                      alt={item.title}
                      className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </a>
                  <figcaption className="p-4">
                    <div className="font-semibold text-ink-900">
                      {item.title}
                    </div>
                    {item.description ? (
                      <p className="mt-1 text-sm text-ink-500">
                        {item.description}
                      </p>
                    ) : null}
                  </figcaption>
                </figure>
              ) : (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center justify-center gap-3 rounded-2xl border border-ink-100 bg-brand-950 p-8 text-center text-white shadow-card transition-transform hover:-translate-y-0.5"
                >
                  <PlayCircle className="h-12 w-12 text-amber-300 transition-transform group-hover:scale-110" />
                  <div>
                    <div className="font-display font-semibold">
                      {item.title}
                    </div>
                    {item.description ? (
                      <p className="mt-1 text-sm text-brand-100/80">
                        {item.description}
                      </p>
                    ) : null}
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-amber-300">
                    Watch video
                  </span>
                </a>
              ),
            )}
          </div>
        )}

        {items.length > 0 ? (
          <p className="mt-10 flex items-center justify-center gap-2 text-xs text-ink-500">
            <Images className="h-3.5 w-3.5" />
            {items.length} {items.length === 1 ? "item" : "items"} in the gallery
          </p>
        ) : null}
      </Container>
    </>
  );
}
