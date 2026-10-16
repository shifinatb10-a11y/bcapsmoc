"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAdminSession } from "@/lib/auth";
import { canManage } from "@/lib/types";
import { uploadPublicFile, file, intOrNull, optional, text } from "@/lib/upload";
import type { ActionState } from "@/lib/action-state";

function refresh() {
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
  revalidatePath("/");
}

export async function saveGalleryItem(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await getAdminSession();
  if (!admin || !canManage(admin.role, "gallery")) {
    return { error: "You are not authorised to manage the gallery." };
  }

  const title = text(formData, "title");
  const mediaType = text(formData, "media_type") === "video" ? "video" : "image";
  if (!title) return { error: "Please enter a title for this item." };

  const supabase = await createClient();
  const id = text(formData, "id");

  // Images are uploaded to storage; videos are added as a URL (e.g. YouTube).
  const upload = await uploadPublicFile(
    supabase,
    "gallery",
    "gallery",
    file(formData, "image"),
  );
  if (upload.error) return { error: `Image upload failed: ${upload.error}` };

  const videoUrl = optional(formData, "video_url");
  if (mediaType === "video" && !videoUrl && !id) {
    return { error: "Please paste a video link (for example a YouTube URL)." };
  }
  if (mediaType === "image" && !upload.url && !id) {
    return { error: "Please choose an image to upload." };
  }

  const payload: Record<string, unknown> = {
    title,
    media_type: mediaType,
    description: optional(formData, "description"),
    display_order: intOrNull(formData, "display_order") ?? 0,
  };

  if (upload.url) payload.url = upload.url;
  if (videoUrl) payload.url = videoUrl;
  if (mediaType === "video" && videoUrl) payload.url = videoUrl;

  if (id) {
    const update: Record<string, unknown> = { ...payload };
    if (!upload.url && !videoUrl) delete update.url;
    const { error } = await supabase
      .from("gallery_items")
      .update(update)
      .eq("id", id);
    if (error) return { error: error.message };
    refresh();
    return { ok: true, message: "Gallery item updated." };
  }

  const { error } = await supabase.from("gallery_items").insert([payload]);
  if (error) return { error: error.message };
  refresh();
  return { ok: true, message: "Gallery item added." };
}

export async function deleteGalleryItem(formData: FormData) {
  const admin = await getAdminSession();
  if (!admin || !canManage(admin.role, "gallery")) return;

  const id = text(formData, "id");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("gallery_items").delete().eq("id", id);
  refresh();
}
