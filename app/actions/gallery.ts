"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAdminSession } from "@/lib/auth";
import { canManage } from "@/lib/types";
import { uploadToImageKit, deleteFromImageKit } from "@/lib/imagekit/server";
import { file, intOrNull, optional, text } from "@/lib/upload";
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

  const imageFile = file(formData, "image");
  const videoUrl = optional(formData, "video_url");

  // ---- Validation ----
  if (mediaType === "video" && !videoUrl && !id) {
    return { error: "Please paste a video link (for example a YouTube URL)." };
  }
  if (mediaType === "image" && !imageFile && !id) {
    return { error: "Please choose an image to upload." };
  }

  const payload: Record<string, unknown> = {
    title,
    media_type: mediaType,
    description: optional(formData, "description"),
    display_order: intOrNull(formData, "display_order") ?? 0,
  };

  // ---- Image upload → ImageKit ----
  if (imageFile) {
    const upload = await uploadToImageKit(imageFile, "gallery", ["gallery", "bca-psmo"]);
    if (upload.error) return { error: `Image upload failed: ${upload.error}` };
    if (upload.data) {
      payload.url = upload.data.url;
      payload.thumbnail_url = upload.data.thumbnailUrl;
      // Store ImageKit fileId so we can delete later
      payload.imagekit_file_id = upload.data.fileId;
    }
  }

  // ---- Video: just store the external URL ----
  if (mediaType === "video" && videoUrl) {
    payload.url = videoUrl;
  }

  if (id) {
    // Keep existing URL if no new file/url provided
    const update: Record<string, unknown> = { ...payload };
    if (!imageFile && !videoUrl) {
      delete update.url;
      delete update.thumbnail_url;
      delete update.imagekit_file_id;
    }
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

  // Fetch the item to get its ImageKit fileId before deleting
  const { data: item } = await supabase
    .from("gallery_items")
    .select("imagekit_file_id")
    .eq("id", id)
    .maybeSingle();

  // Delete from Supabase first
  await supabase.from("gallery_items").delete().eq("id", id);

  // Then clean up from ImageKit (best-effort — don't block on error)
  const fileId = (item as Record<string, unknown> | null)?.imagekit_file_id as string | undefined;
  if (fileId) {
    await deleteFromImageKit(fileId);
  }

  refresh();
}
