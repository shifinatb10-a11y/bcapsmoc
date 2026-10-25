import type { SupabaseClient } from "@supabase/supabase-js";
import { safeFileName } from "./utils";

/**
 * Uploads a file to a public Supabase Storage bucket and returns its URL.
 * Called only from server actions, using the signed-in admin's session
 * (storage RLS policies enforce that only admins can upload).
 */
export async function uploadPublicFile(
  supabase: SupabaseClient,
  bucket: string,
  folder: string,
  file: File | null | undefined,
): Promise<{ url?: string; error?: string }> {
  if (!file || file.size === 0) return {};

  const prefix = folder ? `${folder.replace(/\/+$/, "")}/` : "";
  const path = `${prefix}${Date.now()}-${safeFileName(file.name)}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });

  if (error) return { error: error.message };

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl };
}

export function text(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

export function optional(formData: FormData, key: string): string | null {
  const value = text(formData, key);
  return value.length > 0 ? value : null;
}

export function intOrNull(formData: FormData, key: string): number | null {
  const value = text(formData, key);
  if (!value) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

export function file(formData: FormData, key: string): File | null {
  const value = formData.get(key);
  if (value instanceof File && value.size > 0) return value;
  return null;
}
