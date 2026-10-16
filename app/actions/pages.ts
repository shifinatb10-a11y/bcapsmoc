"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAdminSession } from "@/lib/auth";
import { isSuperAdmin } from "@/lib/types";
import { PAGE_KEYS } from "@/lib/pages";
import type { ActionState } from "@/lib/action-state";

export async function setPageVisibility(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await getAdminSession();
  if (!admin || !isSuperAdmin(admin.role)) {
    return { error: "Only the Super Admin can show or hide pages." };
  }

  const page = String(formData.get("page") ?? "");
  if (!PAGE_KEYS.includes(page)) return { error: "Unknown page." };

  const public_visible = formData.get("public_visible") === "on";
  const admin_visible = formData.get("admin_visible") === "on";

  const supabase = await createClient();
  const { error } = await supabase.from("page_visibility").upsert(
    [
      {
        page,
        public_visible,
        admin_visible,
        updated_at: new Date().toISOString(),
      },
    ],
    { onConflict: "page" },
  );
  if (error) return { error: error.message };

  revalidatePath("/admin/pages");
  revalidatePath("/", "layout");
  return { ok: true, message: "Page visibility updated." };
}
