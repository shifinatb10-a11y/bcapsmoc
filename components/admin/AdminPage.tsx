import type { ReactNode } from "react";
import { ShieldAlert } from "lucide-react";
import { ROLE_LABELS, type Section } from "@/lib/types";

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-500">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

const SECTION_OWNER: Record<Section, string> = {
  department: "Super Admin",
  association: "Association Admin",
  club: "Club Admin",
  studyzone: "Study Zone Admin",
};

export function Unauthorized({ section }: { section: Section }) {
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-8 text-center shadow-card">
      <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600">
        <ShieldAlert className="h-6 w-6" />
      </span>
      <h2 className="font-display text-xl font-semibold text-ink-900">
        You don&apos;t have access to this section
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">
        This area is managed by the {SECTION_OWNER[section]} role. If you need
        access, ask the Super Admin to update your role.
      </p>
    </div>
  );
}

export function AdminCard({
  title,
  description,
  children,
  tone = "default",
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  tone?: "default" | "muted";
}) {
  return (
    <section
      className={
        tone === "muted"
          ? "rounded-2xl border border-ink-100 bg-ink-50 p-6"
          : "rounded-2xl border border-ink-100 bg-white p-6 shadow-card"
      }
    >
      {title ? (
        <div className="mb-5">
          <h2 className="font-display text-lg font-semibold text-ink-900">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 text-sm text-ink-500">{description}</p>
          ) : null}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function RoleBadge({ role }: { role: keyof typeof ROLE_LABELS }) {
  const superAdmin = role === "superadmin";
  return (
    <span
      className={
        superAdmin
          ? "inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800"
          : "inline-flex rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700"
      }
    >
      {ROLE_LABELS[role]}
    </span>
  );
}
