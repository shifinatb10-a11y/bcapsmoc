"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAdminSession } from "@/lib/auth";
import { ADMIN_ROLES, canManage, isSuperAdmin, type AdminRole } from "@/lib/types";
import { text } from "@/lib/upload";
import type { ActionState } from "@/lib/action-state";

export async function updateAdminRole(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await getAdminSession();
  if (!admin || !canManage(admin.role, "department")) {
    return { error: "Only a Super Admin can change admin roles." };
  }

  const id = text(formData, "id");
  const role = text(formData, "role") as AdminRole;

  if (!id) return { error: "Admin not found." };
  if (!ADMIN_ROLES.includes(role)) return { error: "Invalid role." };

  const supabase = await createClient();

  // The Super Admin role can only be granted or removed by another Super Admin.
  if (!isSuperAdmin(admin.role)) {
    const { data: target } = await supabase
      .from("admin_users")
      .select("role")
      .eq("id", id)
      .maybeSingle();
    if (role === "superadmin" || target?.role === "superadmin") {
      return {
        error: "Only a Super Admin can grant or remove the Super Admin role.",
      };
    }
  }

  const { error } = await supabase
    .from("admin_users")
    .update({ role })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/team");
  return { ok: true, message: "Role updated." };
}
