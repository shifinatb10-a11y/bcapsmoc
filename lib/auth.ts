import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { AdminRole } from "@/lib/types";

export interface AdminSession {
  userId: string;
  email: string | null;
  role: AdminRole;
}

/**
 * Returns the signed-in Supabase user, or null. Cached per request.
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/**
 * Returns the admin session (user + role) if the signed-in user has a row in
 * `admin_users`. Passwords are never handled here: authentication is done by
 * Supabase Auth, which stores them as salted bcrypt hashes.
 */
export const getAdminSession = cache(
  async (): Promise<AdminSession | null> => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from("admin_users")
      .select("role, email")
      .eq("user_id", user.id)
      .maybeSingle();

    if (error || !data?.role) return null;

    return {
      userId: user.id,
      email: (data.email as string | null) ?? user.email ?? null,
      role: data.role as AdminRole,
    };
  },
);
