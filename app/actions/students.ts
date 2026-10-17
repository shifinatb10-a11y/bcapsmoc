"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAdminSession } from "@/lib/auth";
import { canManage, SEMESTERS } from "@/lib/types";
import { optional, text } from "@/lib/upload";
import type { ActionState } from "@/lib/action-state";

function refresh() {
  revalidatePath("/admin/students");
  revalidatePath("/admin");
}

/** Add or update a student record. Students belong to a batch (year). */
export async function saveStudent(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await getAdminSession();
  if (!admin || !canManage(admin.role, "students")) {
    return { error: "You are not authorised to manage student records." };
  }

  const name = text(formData, "name");
  if (!name) return { error: "Student name is required." };

  const batch = text(formData, "batch");
  if (!batch) return { error: "Please choose a batch year." };

  const supabase = await createClient();

  const { data: batchRow } = await supabase
    .from("student_batches")
    .select("label")
    .eq("label", batch)
    .maybeSingle();
  if (!batchRow) return { error: "That batch year no longer exists." };

  const id = text(formData, "id");

  const payload = {
    batch,
    name,
    roll_no: optional(formData, "roll_no"),
    admission_no: optional(formData, "admission_no"),
    register_no: optional(formData, "register_no"),
    apaar_id: optional(formData, "apaar_id"),
    gender: optional(formData, "gender"),
    dob: optional(formData, "dob"),
    mobile: optional(formData, "mobile"),
    email: optional(formData, "email"),
  };

  if (id) {
    const { error } = await supabase
      .from("students")
      .update(payload)
      .eq("id", id);
    if (error) return { error: error.message };
    refresh();
    return { ok: true, message: "Student record updated." };
  }

  const { error } = await supabase.from("students").insert([payload]);
  if (error) return { error: error.message };
  refresh();
  return { ok: true, message: "Student record added." };
}

export async function deleteStudent(formData: FormData) {
  const admin = await getAdminSession();
  if (!admin || !canManage(admin.role, "students")) return;

  const id = text(formData, "id");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("students").delete().eq("id", id);
  refresh();
}

/** Add a new batch year (e.g. 2027-2031) with its starting semester. */
export async function addBatch(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await getAdminSession();
  if (!admin || !canManage(admin.role, "students")) {
    return { error: "You are not authorised to manage batch years." };
  }

  const label = text(formData, "label");
  if (!label) return { error: "Please enter the batch year, e.g. 2027-2031." };

  const semester = Number.parseInt(text(formData, "current_semester"), 10);
  if (!SEMESTERS.includes(semester)) {
    return { error: "Please choose a semester between 1 and 8." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("student_batches")
    .insert([{ label, current_semester: semester }]);
  if (error) {
    if (error.code === "23505") {
      return { error: `The batch "${label}" already exists.` };
    }
    return { error: error.message };
  }
  refresh();
  return { ok: true, message: `Batch ${label} added.` };
}

/** Change the current semester of a batch (moves the whole group). */
export async function changeBatchSemester(formData: FormData) {
  const admin = await getAdminSession();
  if (!admin || !canManage(admin.role, "students")) return;

  const label = text(formData, "label");
  if (!label) return;

  const semester = Number.parseInt(text(formData, "semester"), 10);
  if (!SEMESTERS.includes(semester)) return;

  const supabase = await createClient();
  await supabase
    .from("student_batches")
    .update({ current_semester: semester })
    .eq("label", label);
  refresh();
}
