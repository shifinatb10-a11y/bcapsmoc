"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAdminSession } from "@/lib/auth";
import { canManage } from "@/lib/types";
import { uploadPublicFile, file, optional, text, intOrNull } from "@/lib/upload";
import type { ActionState } from "@/lib/action-state";

function refresh() {
  revalidatePath("/admin/club");
  revalidatePath("/club");
  revalidatePath("/");
}

export async function saveClub(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await getAdminSession();
  if (!admin || !canManage(admin.role, "club")) {
    return { error: "You are not authorised to manage the club." };
  }

  const name = text(formData, "name");
  if (!name) return { error: "Club name is required." };

  const supabase = await createClient();
  const id = text(formData, "id");

  const upload = await uploadPublicFile(
    supabase,
    "gallery",
    "club",
    file(formData, "cover_image"),
  );
  if (upload.error) return { error: `Cover image upload failed: ${upload.error}` };

  const payload = {
    name,
    tagline: optional(formData, "tagline"),
    description: optional(formData, "description"),
    display_order: intOrNull(formData, "display_order") ?? 0,
  };

  if (id) {
    const update: Record<string, unknown> = { ...payload };
    if (upload.url) update.cover_image_url = upload.url;

    const { error } = await supabase.from("clubs").update(update).eq("id", id);
    if (error) return { error: error.message };
    refresh();
    return { ok: true, message: "Club updated." };
  }

  const { error } = await supabase
    .from("clubs")
    .insert([{ ...payload, cover_image_url: upload.url ?? null }]);
  if (error) return { error: error.message };
  refresh();
  return { ok: true, message: "Club created." };
}

export async function saveClubEvent(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await getAdminSession();
  if (!admin || !canManage(admin.role, "club")) {
    return { error: "You are not authorised to manage club events." };
  }

  const clubId = text(formData, "club_id");
  const title = text(formData, "title");
  if (!clubId) return { error: "Club not found. Create the club first." };
  if (!title) return { error: "Event title is required." };

  const supabase = await createClient();
  const id = text(formData, "id");

  const imageUpload = await uploadPublicFile(
    supabase,
    "gallery",
    "club/events",
    file(formData, "image"),
  );
  if (imageUpload.error) {
    return { error: `Event image upload failed: ${imageUpload.error}` };
  }

  const reportUpload = await uploadPublicFile(
    supabase,
    "documents",
    "club/reports",
    file(formData, "report"),
  );
  if (reportUpload.error) {
    return { error: `Report upload failed: ${reportUpload.error}` };
  }

  const payload = {
    club_id: clubId,
    title,
    description: optional(formData, "description"),
    event_date: optional(formData, "event_date"),
  };

  if (id) {
    const update: Record<string, unknown> = { ...payload };
    if (imageUpload.url) update.image_url = imageUpload.url;
    if (reportUpload.url) update.report_url = reportUpload.url;

    const { error } = await supabase
      .from("club_events")
      .update(update)
      .eq("id", id);
    if (error) return { error: error.message };
    refresh();
    return { ok: true, message: "Club event updated." };
  }

  const { error } = await supabase.from("club_events").insert([
    {
      ...payload,
      image_url: imageUpload.url ?? null,
      report_url: reportUpload.url ?? null,
    },
  ]);
  if (error) return { error: error.message };
  refresh();
  return { ok: true, message: "Club event added." };
}

export async function deleteClubEvent(formData: FormData) {
  const admin = await getAdminSession();
  if (!admin || !canManage(admin.role, "club")) return;

  const id = text(formData, "id");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("club_events").delete().eq("id", id);
  refresh();
}
