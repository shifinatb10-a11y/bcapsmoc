"use client";

import { useState } from "react";
import { AdminForm } from "./AdminForm";
import { Field, FormGrid, inputClass } from "./Field";
import { saveTransaction } from "@/app/actions/finance";
import { saveGalleryItem } from "@/app/actions/gallery";
import { setPageVisibility } from "@/app/actions/pages";
import type { GalleryItem, Transaction } from "@/lib/types";

const fileClass =
  "block w-full cursor-pointer rounded-lg border border-ink-100 bg-ink-50 text-sm text-ink-700 file:mr-3 file:cursor-pointer file:rounded-md file:border-0 file:bg-brand-600 file:px-3 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-700";

export function TransactionForm({
  transaction,
}: {
  transaction?: Transaction;
}) {
  return (
    <AdminForm
      action={saveTransaction}
      submitLabel={transaction ? "Save changes" : "Add transaction"}
      hiddenFields={transaction ? { id: transaction.id } : undefined}
    >
      <FormGrid cols={2}>
        <Field label="Description" htmlFor="title" required>
          <input
            id="title"
            name="title"
            required
            defaultValue={transaction?.title ?? ""}
            placeholder="e.g. Association day collection"
            className={inputClass}
          />
        </Field>
        <Field label="Type" htmlFor="kind" required>
          <select
            id="kind"
            name="kind"
            defaultValue={transaction?.kind ?? "income"}
            className={inputClass}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </Field>
        <Field label="Amount (₹)" htmlFor="amount" required>
          <input
            id="amount"
            name="amount"
            type="number"
            min="0"
            step="0.01"
            required
            defaultValue={transaction?.amount ?? ""}
            placeholder="0.00"
            className={inputClass}
          />
        </Field>
        <Field label="Date" htmlFor="transaction_date">
          <input
            id="transaction_date"
            name="transaction_date"
            type="date"
            defaultValue={transaction?.transaction_date ?? ""}
            className={inputClass}
          />
        </Field>
        <Field label="Category" htmlFor="category">
          <input
            id="category"
            name="category"
            defaultValue={transaction?.category ?? ""}
            placeholder="e.g. Events, Stationery, Magazine"
            className={inputClass}
          />
        </Field>
        <Field label="Reference / bill no." htmlFor="reference">
          <input
            id="reference"
            name="reference"
            defaultValue={transaction?.reference ?? ""}
            placeholder="Optional"
            className={inputClass}
          />
        </Field>
      </FormGrid>
      <Field label="Notes" htmlFor="description">
        <textarea
          id="description"
          name="description"
          rows={2}
          defaultValue={transaction?.description ?? ""}
          className={inputClass}
        />
      </Field>
    </AdminForm>
  );
}

export function GalleryItemForm({ item }: { item?: GalleryItem }) {
  const [mediaType, setMediaType] = useState<"image" | "video">(
    item?.media_type ?? "image",
  );

  return (
    <AdminForm
      action={saveGalleryItem}
      submitLabel={item ? "Save changes" : "Add to gallery"}
      hiddenFields={item ? { id: item.id } : undefined}
    >
      <FormGrid cols={2}>
        <Field label="Title" htmlFor="title" required>
          <input
            id="title"
            name="title"
            required
            defaultValue={item?.title ?? ""}
            placeholder="e.g. Association inauguration 2026"
            className={inputClass}
          />
        </Field>
        <Field label="Type" htmlFor="media_type" required>
          <select
            id="media_type"
            name="media_type"
            value={mediaType}
            onChange={(event) =>
              setMediaType(event.target.value === "video" ? "video" : "image")
            }
            className={inputClass}
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
        </Field>
      </FormGrid>

      {mediaType === "image" ? (
        <Field
          label={item ? "Replace image" : "Image"}
          htmlFor="image"
          hint={item ? "Leave empty to keep the current image." : undefined}
          required={!item}
        >
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            className={fileClass}
          />
        </Field>
      ) : (
        <Field
          label="Video link"
          htmlFor="video_url"
          hint="Paste a YouTube or other video URL."
          required={!item}
        >
          <input
            id="video_url"
            name="video_url"
            type="url"
            defaultValue={item?.media_type === "video" ? item.url : ""}
            placeholder="https://www.youtube.com/watch?v=…"
            className={inputClass}
          />
        </Field>
      )}

      <FormGrid cols={2}>
        <Field label="Caption" htmlFor="description">
          <input
            id="description"
            name="description"
            defaultValue={item?.description ?? ""}
            className={inputClass}
          />
        </Field>
        <Field label="Display order" htmlFor="display_order" hint="Lower numbers appear first.">
          <input
            id="display_order"
            name="display_order"
            type="number"
            defaultValue={item?.display_order ?? 0}
            className={inputClass}
          />
        </Field>
      </FormGrid>
    </AdminForm>
  );
}

export function PageToggleForm({
  pageKey,
  label,
  hasPublic,
  hasAdmin,
  visibility,
}: {
  pageKey: string;
  label: string;
  hasPublic: boolean;
  hasAdmin: boolean;
  visibility: { public_visible: boolean; admin_visible: boolean };
}) {
  return (
    <AdminForm
      action={setPageVisibility}
      submitLabel="Save"
      hiddenFields={{ page: pageKey }}
      className="space-y-3"
    >
      <div className="flex flex-wrap items-center gap-6">
        {hasPublic ? (
          <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
            <input
              type="checkbox"
              name="public_visible"
              defaultChecked={visibility.public_visible}
              className="h-4 w-4 rounded border-ink-200 text-brand-600 focus:ring-brand-400"
            />
            Visible to the public
          </label>
        ) : (
          <span className="text-sm text-ink-500">Not shown to the public</span>
        )}
        {hasAdmin ? (
          <label className="flex items-center gap-2 text-sm font-medium text-ink-700">
            <input
              type="checkbox"
              name="admin_visible"
              defaultChecked={visibility.admin_visible}
              className="h-4 w-4 rounded border-ink-200 text-brand-600 focus:ring-brand-400"
            />
            Visible to admin logins
          </label>
        ) : null}
      </div>
    </AdminForm>
  );
}
