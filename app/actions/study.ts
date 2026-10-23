"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAdminSession } from "@/lib/auth";
<<<<<<< HEAD
import { canManage, type MaterialCategory, type QuizQuestion } from "@/lib/types";
=======
import { canManage, type MaterialCategory } from "@/lib/types";
>>>>>>> a7d5e2003262c482901d72bd8a30a640729bf83b
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
<<<<<<< HEAD

export async function saveQuiz(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await getAdminSession();
  if (!admin || !canManage(admin.role, "studyzone")) {
    return { error: "You are not authorised to manage quizzes." };
  }

  const title = text(formData, "title");
  if (!title) return { error: "Quiz title is required." };

  const semester = text(formData, "semester");
  if (!semester) return { error: "Semester is required." };

  const subject = text(formData, "subject");
  if (!subject) return { error: "Subject is required." };

  const description = optional(formData, "description");
  const rawDuration = text(formData, "duration_minutes");
  const duration_minutes = rawDuration ? parseInt(rawDuration, 10) : null;
  const quiz_url = optional(formData, "quiz_url");

  let questions: QuizQuestion[] = [];
  const questionsJson = text(formData, "questions_json");
  if (questionsJson) {
    try {
      const parsed = JSON.parse(questionsJson);
      if (Array.isArray(parsed)) {
        questions = parsed.map((q, idx) => ({
          id: q.id || `q_${idx + 1}`,
          question: String(q.question || "").trim(),
          options: Array.isArray(q.options)
            ? q.options.map((opt: unknown) => String(opt || "").trim())
            : [],
          correct_option: typeof q.correct_option === "number" ? q.correct_option : 0,
          explanation: q.explanation ? String(q.explanation).trim() : undefined,
        }));
      }
    } catch {
      return { error: "Invalid questions format." };
    }
  }

  const id = text(formData, "id");
  const supabase = await createClient();

  const payload = {
    title,
    semester,
    subject,
    description,
    duration_minutes: isNaN(duration_minutes as number) ? null : duration_minutes,
    quiz_url,
    questions,
  };

  if (id) {
    const { error } = await supabase
      .from("quizzes")
      .update(payload)
      .eq("id", id);
    if (error) return { error: error.message };
    refresh();
    return { ok: true, message: "Quiz updated successfully." };
  }

  const { error } = await supabase
    .from("quizzes")
    .insert([payload]);
  if (error) return { error: error.message };
  refresh();
  return { ok: true, message: "Quiz created successfully." };
}

export async function deleteQuiz(formData: FormData) {
  const admin = await getAdminSession();
  if (!admin || !canManage(admin.role, "studyzone")) return;

  const id = text(formData, "id");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("quizzes").delete().eq("id", id);
  refresh();
}
=======
>>>>>>> a7d5e2003262c482901d72bd8a30a640729bf83b
