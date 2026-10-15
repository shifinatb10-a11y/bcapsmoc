"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ExternalLink, LogOut, Menu, X } from "lucide-react";
import { Crest } from "@/components/Crest";
import { ADMIN_NAV } from "./nav";
import { signOut } from "@/app/actions/auth";
import { canManage, ROLE_LABELS, type AdminRole } from "@/lib/types";
import { cn } from "@/lib/utils";

export function AdminShell({
  role,
  email,
  children,
}: {
  role: AdminRole;
  email: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const items = ADMIN_NAV.filter(
    (item) => item.section === null || canManage(role, item.section),
  );

  const sidebar = (
    <div className="flex h-full flex-col bg-brand-950 text-brand-100">
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <Crest className="h-9 w-9 shrink-0" />
        <div className="leading-tight">
          <div className="text-sm font-semibold text-white">BCA Admin</div>
          <div className="text-[11px] text-brand-100/70">
            PSMO College (Autonomous)
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-white/10 text-white"
                  : "text-brand-100/80 hover:bg-white/5 hover:text-white",
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              <span className="min-w-0">
                <span className="block truncate">{item.label}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="mb-3 rounded-xl bg-white/5 px-3 py-2.5">
          <div className="text-[11px] uppercase tracking-wide text-brand-100/60">
            Signed in as
          </div>
          <div className="truncate text-sm font-semibold text-white">
            {email ?? "Administrator"}
          </div>
          <div className="mt-1 inline-flex rounded-full bg-amber-400/20 px-2 py-0.5 text-[11px] font-semibold text-amber-300">
            {ROLE_LABELS[role]}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold text-brand-100 transition-colors hover:bg-white/10"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View site
          </Link>
          <form action={signOut} className="flex-1">
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500/90 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-500"
            >
              <LogOut className="h-3.5 w-3.5" />
              Log out
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ink-50 lg:grid lg:grid-cols-[264px_1fr]">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen lg:block">{sidebar}</aside>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-ink-100 bg-white px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2.5">
          <Crest className="h-8 w-8" />
          <span className="text-sm font-semibold text-ink-900">BCA Admin</span>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open admin menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-ink-100 text-ink-700"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink-900/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[80%] max-w-xs">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-4 z-10 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white"
            >
              <X className="h-4 w-4" />
            </button>
            {sidebar}
          </div>
        </div>
      ) : null}

      <main className="min-w-0">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}
