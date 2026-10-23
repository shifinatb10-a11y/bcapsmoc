import { createClient } from "@/lib/supabase/server";
import type { AdminRole } from "@/lib/types";

export interface AdminUserRow {
  id: string;
  user_id: string;
  email: string | null;
  role: AdminRole;
  created_at: string | null;
}

export async function getAdminUsers(): Promise<AdminUserRow[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .order("created_at", { ascending: true });
    if (error) return [];
    return (data ?? []) as AdminUserRow[];
  } catch {
    return [];
  }
}
