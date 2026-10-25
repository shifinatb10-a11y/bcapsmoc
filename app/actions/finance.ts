"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getAdminSession } from "@/lib/auth";
import { canManage } from "@/lib/types";
import { optional, text } from "@/lib/upload";
import type { ActionState } from "@/lib/action-state";

function refresh() {
  revalidatePath("/admin/finance");
}

export async function saveTransaction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const admin = await getAdminSession();
  if (!admin || !canManage(admin.role, "finance")) {
    return { error: "You are not authorised to manage the finance ledger." };
  }

  const title = text(formData, "title");
  const amount = Number.parseFloat(text(formData, "amount"));
  const kind = text(formData, "kind") === "expense" ? "expense" : "income";

  if (!title) return { error: "Please enter a description for the transaction." };
  if (!Number.isFinite(amount) || amount <= 0) {
    return { error: "Please enter a valid amount greater than zero." };
  }

  const supabase = await createClient();
  const id = text(formData, "id");

  const payload = {
    title,
    kind,
    amount,
    category: optional(formData, "category"),
    transaction_date: optional(formData, "transaction_date"),
    reference: optional(formData, "reference"),
    description: optional(formData, "description"),
  };

  if (id) {
    const { error } = await supabase
      .from("transactions")
      .update(payload)
      .eq("id", id);
    if (error) return { error: error.message };
    refresh();
    return { ok: true, message: "Transaction updated." };
  }

  const { error } = await supabase.from("transactions").insert([payload]);
  if (error) return { error: error.message };
  refresh();
  return { ok: true, message: "Transaction added." };
}

export async function deleteTransaction(formData: FormData) {
  const admin = await getAdminSession();
  if (!admin || !canManage(admin.role, "finance")) return;

  const id = text(formData, "id");
  if (!id) return;

  const supabase = await createClient();
  await supabase.from("transactions").delete().eq("id", id);
  refresh();
}
