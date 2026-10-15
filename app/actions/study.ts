"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAdminSession } from "@/lib/auth";
import { canManage, type MaterialCategory } from "@/lib/types";
import { uploadPublicFile, file, optional, text } from "@/lib/upload";
import type { ActionState } from "@/lib/action-state";

function refresh() {
  revalidatePath("/admin/study-zone");
  revalidatePath("/study-zone");
  revalidatePath("/");
}

const CATEGORIES: MaterialCategory[] = ["question_paper", "notes"];

export async function saveMaterial(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await getAdminSession();
  if (!admin || !canManage(admin.role, "studyzone")) {
    return { error: "You are not authorised to manage study materials." };
  }

  const title = text(formData, "title");
  if (!title) return { error: "Title is required." };

  const rawCategory = text(formData, "category") as MaterialCategory;
  const category: MaterialCategory = CATEGORIES.includes(rawCategory)
    ? rawCategory
    : "question_paper";

  const supabase = await createClient();
  const id = text(formData, "id");

  const upload = await uploadPublicFile(
    supabase,
    "documents",
    category === "notes" ? "study-zone/notes" : "study-zone/question-papers",
    file(formData, "document"),
  );
  if (upload.error) return { error: `File upload failed: ${upload.error}` };

  const payload = {
    title,
    category,
    subject: optional(formData, "subject"),
    semester: optional(formData, "semester"),
    year: optional(formData, "year"),
    description: optional(formData, "description"),
  };

  if (id) {
    const update: Record<string, unknown> = { ...payload };
    if (upload.url) update.file_url = upload.url;

    const { error } = await supabase
      .from("study_materials")
      .update(update)
      .eq("id", id);
    if (error) return { error: error.message };
    refresh();
    return { ok: true, message: "Material updated." };
  }

  if (!upload.url) return { error: "Please attach a PDF file." };

  const { error } = await supabase
    .from("study_materials")
    .insert([{ ...payload, file_url: upload.url }]);
  if (error) return { error: error.message };
  refresh();
  return { ok: true, message: "Material added." };
}

export async function deleteMaterial(formData: FormData) {
  const admin = await getAdminSession();
  if (!admin || !canManage(admin.role, "studyzone")) return;

  const id = text(formData, "id");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("study_materials").delete().eq("id", id);
  refresh();
}
