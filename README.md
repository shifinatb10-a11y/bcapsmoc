# BCA Department Website — PSMO College (Autonomous), Tirurangadi

Official website for the **Department of Computer Applications (BCA)** at PSMO
College (Autonomous), Tirurangadi. Rebuilt with **Next.js 15 (App Router)**,
**TypeScript**, **Tailwind CSS** and **Supabase**.

---

## ✨ What's included

| Page             | URL            | Description                                                                                 |
| ---------------- | -------------- | ------------------------------------------------------------------------------------------- |
| Dashboard        | `/`            | Clean landing page with the PSMO College photo, highlights and quick links.                  |
| Department       | `/department`  | Department description, facilities and the faculty directory with photos and details.        |
| Association      | `/association` | Tabbed association terms (2025–2026, 2026–2027). Each shows its secretary, event reports (PDF) and magazine. |
| Club             | `/club`        | Department club details, events and their published reports.                                 |
| Study Zone       | `/study-zone`  | Previous year question papers and notes, filterable and viewable/downloadable as PDF.        |
| Gallery          | `/gallery`     | Public photos and videos managed by the Media Admin.                                          |
| Admin login      | `/admin/login` | Secure email + password login.                                                               |
| Admin dashboard  | `/admin`       | Role-aware management area.                                                                  |
| Finance ledger   | `/admin/finance` | **Private.** Transactions, visible to the Department, Association and Finance admins.        |
| Student records  | `/admin/students` | **Private.** Students stored under each batch year (2025-2029…). Add/delete batch years, change a batch's semester. Department Admin only. |
| Page visibility  | `/admin/pages` | **Super Admin only.** Show or hide every page from the public and from admin logins.          |

### The seven admin roles

| Role              | Can manage                                                    |
| ----------------- | ------------------------------------------------------------- |
| **Super Admin**   | Everything — every section below, all administrator accounts, and which pages are visible. |
| **Department**    | Student records and batch years, plus read-only access to the finance ledger. |

Every destructive action in the dashboard opens a warning dialog and only
deletes after you confirm — deleting a batch year also removes its students.
| **Association**   | Association terms, secretaries, event reports and magazines (plus read-only finance). |
| **Club**          | Club details, club events and their reports.                  |
| **Study Zone**    | Previous year question papers and study notes.                |
| **Finance**       | Adds, edits and deletes transactions in the private finance ledger. |
| **Media**         | Adds and deletes the images and videos shown in the public gallery. |

Each role can only open and edit its own section — enforced both in the UI and
in the database (Row Level Security). The **Super Admin** is the exception: it
can open and edit **every** section. Only a Super Admin can grant or remove the
Super Admin role (enforced in the app *and* by a database trigger).

### Page visibility

As the **Super Admin**, open **Admin → Pages** to switch each page on or off:

- **Visible to the public** — hides the page (and its menu link) from the
  website entirely; visitors get a 404.
- **Visible to admin logins** — removes the page from the admin dashboards for
  every other administrator (you keep access).

### Security

- **Passwords are never stored in the code.** Authentication is handled by
  **Supabase Auth**, which stores passwords as salted bcrypt hashes.
- The public site can be read by everyone, but **writing requires the correct
  admin role**, enforced by Row Level Security policies in `sql/schema.sql`.
- Sessions use secure, HTTP-only cookies via `@supabase/ssr`.

**Hardening (see `next.config.mjs`)**

- Every response carries a **Content-Security-Policy**
  (`default-src 'self'`; Supabase is the only allowed external host), plus
  `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`, `Cross-Origin-Opener-Policy`,
  `Cross-Origin-Resource-Policy` and `Strict-Transport-Security`.
- The `X-Powered-By` header is disabled (`poweredByHeader: false`).
- A `security.txt` (RFC 9116) is served from
  `public/.well-known/security.txt` — update the `Contact` before the
  `Expires` date.
- Fonts are self-hosted via `next/font`, so the site makes **no request to
  Google**.
- A branded Open Graph / Twitter image is generated at `app/opengraph-image.tsx`.

Things that can only be set on the **domain** (not in this repo): SPF, DMARC
and DKIM records, DNSSEC, and a Web Application Firewall. They need a domain
you control and a DNS/mail provider; they are informational for a
`*.vercel.app` URL.

### Search engine optimisation (SEO)

- **`/robots.txt`** and **`/sitemap.xml`** are generated by `app/robots.ts`
  and `app/sitemap.ts` (the sitemap is built from `MAIN_NAV`, so every public
  page is listed automatically). The dashboard is disallowed and additionally
  sends `noindex` from `app/admin/(dashboard)/layout.tsx`.
- Every public page sets a **canonical URL** and a unique title/description
  in its `metadata`.
- **Structured data (JSON-LD)** describing the college, the website and the
  four-year BCA programme is emitted by `components/StructuredData.tsx`.
- Site-wide URL/details live in **`lib/site.ts`** — fill in the department's
  **phone, e-mail and social profile links** there (`SOCIAL_LINKS`) and they
  appear in the footer and in the schema automatically.
- **Google Analytics 4** is optional and off by default: set
  `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX` to enable it (`components/Analytics.tsx`).
  The Content-Security-Policy already allows the Google Tag Manager and
  Analytics domains.

---

## 🚀 Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env.local` and fill in your Supabase project values
(Supabase Dashboard → **Project Settings → API**):

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> The **anon key is public** and safe to expose in the browser. Never put the
> `service_role` key in this file.

### 3. Create the database tables

Open your Supabase project → **SQL Editor** → **New query**, paste the whole of
[`sql/schema.sql`](sql/schema.sql) and click **Run**.

This creates every table, the security policies, the storage buckets and seeds
the two association terms plus a default club. It is safe to run more than once.

### 4. Create your first administrator

1. In Supabase go to **Authentication → Users → Add user** and create an account
   with an email and password.
2. Copy the new user's **UUID**.
3. In the **SQL Editor** run:

```sql
insert into public.admin_users (user_id, email, role)
values ('PASTE-THE-USER-UUID', 'admin@example.com', 'department')
on conflict (user_id) do update set role = excluded.role;
```

Valid roles: `superadmin`, `department`, `association`, `club`, `studyzone`, `finance`, `media`.
Use `superadmin` for an account that manages every section (see
[`sql/add-superadmin.sql`](sql/add-superadmin.sql) if your database already
exists).

If your database already exists, also run these two migrations once each (both
are safe to re-run and never delete data):

- [`sql/add-superadmin.sql`](sql/add-superadmin.sql) — Super Admin role, the
  `guard_admin_role` trigger and the corrected admin read policy.
- [`sql/add-finance-gallery-pages.sql`](sql/add-finance-gallery-pages.sql) —
  the `transactions`, `gallery_items` and `page_visibility` tables with their
  Row Level Security policies (Finance, Gallery and Page visibility features).
- [`sql/add-students.sql`](sql/add-students.sql) — the private `student_batches`
  and `students` tables and their Row Level Security policy (Students feature).

### 5. Run the site

```bash
npm run dev      # development  → http://localhost:3000
npm run build    # production build
npm run start    # run the production build
```

---

## ☁️ Deploying to Vercel

1. Push this repository to GitHub.
2. In Vercel, import the repository. Vercel detects **Next.js** automatically.
   - If the project was previously configured as a static site, open
     **Settings → Build & Development Settings** and set the **Framework Preset**
     to **Next.js** (Build Command `next build`, Output Directory `.next`).
3. Add the environment variables from `.env.local` under
   **Settings → Environment Variables**.
4. Deploy. Update `NEXT_PUBLIC_SITE_URL` to your production URL
   (`https://bcapsmoc.vercel.app`).

---

## 🗂️ Project structure

```
app/
  (site)/                 Public pages (shared header + footer)
    page.tsx              Dashboard
    department/page.tsx
    association/page.tsx
    club/page.tsx
    study-zone/page.tsx
  admin/
    login/page.tsx        Standalone login screen
    (dashboard)/          Guarded admin area (sidebar shell)
      page.tsx            Overview
      students/ faculty/ association/ club/ study-zone/ team/ settings/
  actions/                Server actions (all writes happen here)
components/               Shared UI + admin components
lib/
  supabase/               Browser, server and middleware clients
  auth.ts types.ts queries.ts nav.ts pages.ts utils.ts
sql/schema.sql            Full database setup script
sql/add-superadmin.sql    Migration for databases created before the Super Admin
sql/add-finance-gallery-pages.sql
                          Migration adding Finance, Gallery and Page visibility
sql/add-students.sql      Migration adding private student records
```

---

## 📝 Notes

- Uploaded images go to the public **`gallery`** Supabase Storage bucket, and
  PDFs (reports, magazines, question papers, notes) go to the public
  **`documents`** bucket. Both are created by `sql/schema.sql`.
- The old single-file HTML/CSS/JS version and its pages have been removed as
  requested. The previous database tables are untouched but no longer used.
- To replace the placeholder homepage image, sign in as the **Super Admin**
  and use **Admin → Site Settings**.
