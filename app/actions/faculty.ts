"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAdminSession } from "@/lib/auth";
import { canManage } from "@/lib/types";
import { uploadPublicFile, file, optional, text, intOrNull } from "@/lib/upload";
import type { ActionState } from "@/lib/action-state";

function refresh() {
  revalidatePath("/admin/faculty");
  revalidatePath("/department");
  revalidatePath("/");
}

export async function saveFaculty(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await getAdminSession();
  if (!admin || !canManage(admin.role, "department")) {
    return { error: "You are not authorised to manage faculty." };
  }

  const name = text(formData, "name");
  if (!name) return { error: "Faculty name is required." };

  const supabase = await createClient();
  const id = text(formData, "id");

  const upload = await uploadPublicFile(
    supabase,
    "gallery",
    "faculty",
    file(formData, "photo"),
  );
  if (upload.error) return { error: `Photo upload failed: ${upload.error}` };

  const payload = {
    name,
    role_title: optional(formData, "role_title"),
    designation: optional(formData, "designation"),
    qualification: optional(formData, "qualification"),
    email: optional(formData, "email"),
    bio: optional(formData, "bio"),
    display_order: intOrNull(formData, "display_order"),
  };

  if (id) {
    const { error } = await supabase.from("faculty").update(payload).eq("id", id);
    if (error) return { error: error.message };
    refresh();
    return { ok: true, message: "Faculty member updated." };
  }

  const { error } = await supabase.from("faculty").insert([
    { ...payload, photo_url: upload.url ?? null },
  ]);
  if (error) return { error: error.message };
  refresh();
  return { ok: true, message: "Faculty member added." };
}

export async function updateFacultyPhoto(formData: FormData) {
  const admin = await getAdminSession();
  if (!admin || !canManage(admin.role, "department")) return;

  const id = text(formData, "id");
  if (!id) return;

  const supabase = await createClient();
  const upload = await uploadPublicFile(
    supabase,
    "gallery",
    "faculty",
    file(formData, "photo"),
  );
  if (!upload.url) return;

  await supabase
    .from("faculty")
    .update({ photo_url: upload.url })
    .eq("id", id);
  refresh();
}

export async function deleteFaculty(formData: FormData) {
  const admin = await getAdminSession();
  if (!admin || !canManage(admin.role, "department")) return;

  const id = text(formData, "id");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("faculty").delete().eq("id", id);
  refresh();
}
