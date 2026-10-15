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
| Admin login      | `/admin/login` | Secure email + password login.                                                               |
| Admin dashboard  | `/admin`       | Role-aware management area.                                                                  |

### The four admin roles

| Role              | Can manage                                                    |
| ----------------- | ------------------------------------------------------------- |
| **Department**    | Faculty profiles, the homepage image and department text, admin team roles. |
| **Association**   | Association terms, secretaries, event reports and magazines.  |
| **Club**          | Club details, club events and their reports.                  |
| **Study Zone**    | Previous year question papers and study notes.                |

Each role can only open and edit its own section — enforced both in the UI and
in the database (Row Level Security).

### Security

- **Passwords are never stored in the code.** Authentication is handled by
  **Supabase Auth**, which stores passwords as salted bcrypt hashes.
- The public site can be read by everyone, but **writing requires the correct
  admin role**, enforced by Row Level Security policies in `sql/schema.sql`.
- Sessions use secure, HTTP-only cookies via `@supabase/ssr`.

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

Valid roles: `department`, `association`, `club`, `studyzone`.

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
      faculty/ association/ club/ study-zone/ team/ settings/
  actions/                Server actions (all writes happen here)
components/               Shared UI + admin components
lib/
  supabase/               Browser, server and middleware clients
  auth.ts types.ts queries.ts nav.ts utils.ts
sql/schema.sql            Full database setup script
```

---

## 📝 Notes

- Uploaded images go to the public **`gallery`** Supabase Storage bucket, and
  PDFs (reports, magazines, question papers, notes) go to the public
  **`documents`** bucket. Both are created by `sql/schema.sql`.
- The old single-file HTML/CSS/JS version and its pages have been removed as
  requested. The previous database tables are untouched but no longer used.
- To replace the placeholder homepage image, sign in as a **Department Admin**
  and use **Admin → Site Settings**.
"# bca_psmoc_new" 
