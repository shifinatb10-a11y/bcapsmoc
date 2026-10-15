"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAdminSession } from "@/lib/auth";
import { canManage } from "@/lib/types";
import { uploadPublicFile, file, optional, text } from "@/lib/upload";
import type { ActionState } from "@/lib/action-state";

function refresh() {
  revalidatePath("/admin/settings");
  revalidatePath("/department");
  revalidatePath("/");
}

export async function saveSettings(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await getAdminSession();
  if (!admin || !canManage(admin.role, "department")) {
    return { error: "You are not authorised to change site settings." };
  }

  const supabase = await createClient();

  const upload = await uploadPublicFile(
    supabase,
    "gallery",
    "site",
    file(formData, "hero_image"),
  );
  if (upload.error) return { error: `Hero image upload failed: ${upload.error}` };

  const rows: { key: string; value: string | null; updated_at: string }[] = [];
  const now = new Date().toISOString();

  const stringKeys = [
    "hero_tagline",
    "department_intro",
    "department_intro_secondary",
  ];
  for (const key of stringKeys) {
    rows.push({ key, value: optional(formData, key), updated_at: now });
  }

  if (upload.url) {
    rows.push({ key: "hero_image_url", value: upload.url, updated_at: now });
  }

  const { error } = await supabase
    .from("site_settings")
    .upsert(rows, { onConflict: "key" });
  if (error) return { error: error.message };

  refresh();
  revalidatePath("/association");
  revalidatePath("/club");
  revalidatePath("/study-zone");
  return { ok: true, message: "Site settings saved." };
}
