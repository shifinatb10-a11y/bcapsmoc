"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAdminSession } from "@/lib/auth";
import { canManage } from "@/lib/types";
import { uploadPublicFile, file, optional, text, intOrNull } from "@/lib/upload";
import type { ActionState } from "@/lib/action-state";

function refresh() {
  revalidatePath("/admin/association");
  revalidatePath("/association");
  revalidatePath("/");
}

export async function saveAssociation(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await getAdminSession();
  if (!admin || !canManage(admin.role, "association")) {
    return { error: "You are not authorised to manage associations." };
  }

  const name = text(formData, "name") || "BCA Students' Association";
  const yearLabel = text(formData, "year_label");
  if (!yearLabel) return { error: "Year label (e.g. 2026–2027) is required." };

  const supabase = await createClient();
  const id = text(formData, "id");

  const photoUpload = await uploadPublicFile(
    supabase,
    "gallery",
    "association/secretary",
    file(formData, "secretary_photo"),
  );
  if (photoUpload.error) {
    return { error: `Secretary photo upload failed: ${photoUpload.error}` };
  }

  const magazineUpload = await uploadPublicFile(
    supabase,
    "documents",
    "association/magazine",
    file(formData, "magazine"),
  );
  if (magazineUpload.error) {
    return { error: `Magazine upload failed: ${magazineUpload.error}` };
  }

  const payload = {
    name,
    year_label: yearLabel,
    start_year: intOrNull(formData, "start_year"),
    end_year: intOrNull(formData, "end_year"),
    secretary_name: optional(formData, "secretary_name"),
    secretary_designation:
      optional(formData, "secretary_designation") ?? "Association Secretary",
    secretary_details: optional(formData, "secretary_details"),
    description: optional(formData, "description"),
    magazine_title: optional(formData, "magazine_title"),
    display_order: intOrNull(formData, "display_order") ?? 0,
  };

  if (id) {
    const update: Record<string, unknown> = { ...payload };
    if (photoUpload.url) update.secretary_photo_url = photoUpload.url;
    if (magazineUpload.url) update.magazine_url = magazineUpload.url;

    const { error } = await supabase
      .from("associations")
      .update(update)
      .eq("id", id);
    if (error) return { error: error.message };
    refresh();
    return { ok: true, message: "Association updated." };
  }

  const { error } = await supabase.from("associations").insert([
    {
      ...payload,
      secretary_photo_url: photoUpload.url ?? null,
      magazine_url: magazineUpload.url ?? null,
    },
  ]);
  if (error) return { error: error.message };
  refresh();
  return { ok: true, message: "Association added." };
}

export async function deleteAssociation(formData: FormData) {
  const admin = await getAdminSession();
  if (!admin || !canManage(admin.role, "association")) return;

  const id = text(formData, "id");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("associations").delete().eq("id", id);
  refresh();
}

export async function saveReport(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await getAdminSession();
  if (!admin || !canManage(admin.role, "association")) {
    return { error: "You are not authorised to manage reports." };
  }

  const associationId = text(formData, "association_id");
  const title = text(formData, "title");
  if (!associationId) return { error: "Please select an association." };
  if (!title) return { error: "Report title is required." };

  const supabase = await createClient();
  const id = text(formData, "id");

  const upload = await uploadPublicFile(
    supabase,
    "documents",
    "association/reports",
    file(formData, "document"),
  );
  if (upload.error) return { error: `Report upload failed: ${upload.error}` };

  const payload = {
    association_id: associationId,
    title,
    description: optional(formData, "description"),
    event_date: optional(formData, "event_date"),
  };

  if (id) {
    const update: Record<string, unknown> = { ...payload };
    if (upload.url) update.file_url = upload.url;

    const { error } = await supabase
      .from("association_reports")
      .update(update)
      .eq("id", id);
    if (error) return { error: error.message };
    refresh();
    return { ok: true, message: "Report updated." };
  }

  if (!upload.url) return { error: "Please attach the report PDF." };

  const { error } = await supabase
    .from("association_reports")
    .insert([{ ...payload, file_url: upload.url }]);
  if (error) return { error: error.message };
  refresh();
  return { ok: true, message: "Report added." };
}

export async function deleteReport(formData: FormData) {
  const admin = await getAdminSession();
  if (!admin || !canManage(admin.role, "association")) return;

  const id = text(formData, "id");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("association_reports").delete().eq("id", id);
  refresh();
}
