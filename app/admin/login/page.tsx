import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";
import { getAdminSession } from "@/lib/auth";
import { signIn } from "@/app/actions/auth";
import { AdminForm } from "@/components/admin/AdminForm";
import { Field, inputClass } from "@/components/admin/Field";
import { Crest } from "@/components/Crest";
import { ADMIN_ROLES, ROLE_DESCRIPTIONS, ROLE_LABELS } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Login",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  const params = await searchParams;

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden bg-brand-950 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(560px circle at 20% 15%, rgba(51,102,245,0.55), transparent 60%), radial-gradient(500px circle at 90% 85%, rgba(240,180,41,0.25), transparent 55%)",
          }}
        />
        <div className="relative">
          <div className="flex items-center gap-3">
            <Crest className="h-12 w-12" />
            <div className="leading-tight">
              <div className="font-display text-lg font-semibold">
                PSMO College (Autonomous)
              </div>
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-300">
                Department of Computer Applications
              </div>
            </div>
          </div>
          <h1 className="mt-12 font-display text-3xl font-semibold leading-tight">
            Department Administration
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-brand-100/85">
            A single secure dashboard for the department team. Each
            administrator only manages the section assigned to their role.
          </p>

          <ul className="mt-8 space-y-3">
            {ADMIN_ROLES.map((role) => (
              <li key={role} className="flex gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-300" />
                <span>
                  <span className="block text-sm font-semibold text-white">
                    {ROLE_LABELS[role]}
                  </span>
                  <span className="block text-xs text-brand-100/70">
                    {ROLE_DESCRIPTIONS[role]}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-xs text-brand-100/60">
          Passwords are stored securely by Supabase Auth and are never kept in
          the site code.
        </p>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center bg-ink-50 px-5 py-14 sm:px-10">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-ink-500 transition-colors hover:text-brand-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to website
          </Link>

          <div className="rounded-2xl border border-ink-100 bg-white p-7 shadow-card sm:p-8">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <LockKeyhole className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-xl font-semibold text-ink-900">
                  Admin login
                </h2>
                <p className="text-sm text-ink-500">
                  Sign in with your administrator account.
                </p>
              </div>
            </div>

            <AdminForm
              action={signIn}
              submitLabel="Log in"
              hiddenFields={{ redirectTo: params.from ?? "/admin" }}
              className="space-y-5"
            >
              <Field label="Email address" htmlFor="email" required>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@psmoc.edu"
                  className={inputClass}
                />
              </Field>
              <Field label="Password" htmlFor="password" required>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className={inputClass}
                />
              </Field>
            </AdminForm>
          </div>

          <p className="mt-6 text-center text-xs text-ink-500">
            Trouble signing in? Contact the department admin to reset your
            account.
          </p>
        </div>
      </div>
    </div>
  );
}
