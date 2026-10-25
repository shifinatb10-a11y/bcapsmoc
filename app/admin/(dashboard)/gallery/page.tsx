import { redirect } from "next/navigation";
import { Images, PlayCircle } from "lucide-react";
import { getAdminSession } from "@/lib/auth";
import { getGalleryItems, getPageVisibility } from "@/lib/queries";
import { canManage } from "@/lib/types";
import { isAdminVisible } from "@/lib/pages";
import {
  AdminPageHeader,
  AdminCard,
  Unauthorized,
} from "@/components/admin/AdminPage";
import { GalleryItemForm } from "@/components/admin/extra-forms";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { Badge } from "@/components/ui";
import { deleteGalleryItem } from "@/app/actions/gallery";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  if (!canManage(session.role, "gallery")) {
    return <Unauthorized section="gallery" />;
  }

  const visibility = await getPageVisibility();
  if (!isAdminVisible(visibility, "gallery")) {
    return <Unauthorized section="gallery" />;
  }

  const items = await getGalleryItems();

  return (
    <>
      <AdminPageHeader
        title="Gallery"
        description="Add photos and videos to the public gallery. Everything you add here is visible to everyone on the website."
      />

      <AdminCard title="Add to the gallery">
        <GalleryItemForm />
      </AdminCard>

      <div className="mt-8 space-y-4">
        <h2 className="font-display text-lg font-semibold text-ink-900">
          Gallery items ({items.length})
        </h2>

        {items.length === 0 ? (
          <p className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-ink-100 bg-white px-5 py-10 text-center text-sm text-ink-500">
            <Images className="h-4 w-4" />
            Nothing in the gallery yet. Add the first image or video above.
          </p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card"
              >
                <div className="flex h-44 items-center justify-center bg-ink-50">
                  {item.media_type === "image" ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.url}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 text-brand-600"
                    >
                      <PlayCircle className="h-10 w-10" />
                      <span className="text-xs font-semibold">Open video</span>
                    </a>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Badge tone={item.media_type === "video" ? "gold" : "brand"}>
                          {item.media_type === "video" ? "Video" : "Image"}
                        </Badge>
                        <span className="truncate font-semibold text-ink-900">
                          {item.title}
                        </span>
                      </div>
                      {item.description ? (
                        <p className="mt-1 text-sm text-ink-500">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                    <DeleteButton
                      action={deleteGalleryItem}
                      id={item.id}
                      confirmMessage={`Delete "${item.title}"?`}
                    />
                  </div>

                  <details className="mt-4 border-t border-ink-100 pt-4">
                    <summary className="cursor-pointer text-sm font-semibold text-brand-600">
                      Edit item
                    </summary>
                    <div className="mt-4">
                      <GalleryItemForm item={item} />
                    </div>
                  </details>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
