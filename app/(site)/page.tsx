import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Building2,
  GraduationCap,
  Images,
  Sparkles,
  Users,
} from "lucide-react";
import {
  getAssociations,
  getClub,
  getFaculty,
  getPageVisibility,
  getSettings,
  getStudyMaterials,
} from "@/lib/queries";
import { Avatar, Badge, Container, SectionHeading, StatCard } from "@/components/ui";
import { DocumentActions } from "@/components/DocumentActions";
import { SpecularButton } from "@/components/SpecularButton";
import { notFound } from "next/navigation";
import { publicPageVisible } from "@/lib/page-visibility";
import { isPublicVisible, PAGES } from "@/lib/pages";

export const dynamic = "force-dynamic";

export const metadata = {
  alternates: { canonical: "/" },
};

const QUICK_LINKS = [
  {
    href: "/department",
    label: "Department",
    description:
      "Meet our faculty, learn about the programme and department facilities.",
    icon: Building2,
    accent: "from-brand-500 to-brand-700",
  },
  {
    href: "/association",
    label: "Association",
    description:
      "Office bearers, annual event reports and department magazines.",
    icon: Users,
    accent: "from-amber-400 to-amber-600",
  },
  {
    href: "/club",
    label: "Club",
    description: "Club activities, events and their published reports.",
    icon: Sparkles,
    accent: "from-emerald-400 to-emerald-600",
  },
  {
    href: "/study-zone",
    label: "Study Zone",
    description:
      "Previous year question papers and study notes, ready to view or download.",
    icon: BookOpen,
    accent: "from-accent-500 to-accent-700",
  },
  {
    href: "/gallery",
    label: "Gallery",
    description: "Photos and videos from association events and club activities.",
    icon: Images,
    accent: "from-rose-400 to-rose-600",
  },
];

export default async function DashboardPage() {
  if (!(await publicPageVisible("home"))) notFound();

  const [settings, faculty, associations, club, materials, visibility] =
    await Promise.all([
      getSettings(),
      getFaculty(),
      getAssociations(),
      getClub(),
      getStudyMaterials(),
      getPageVisibility(),
    ]);

  const hiddenPublicHrefs = PAGES.filter(
    (page) => page.publicHref && !isPublicVisible(visibility, page.key),
  ).map((page) => page.publicHref as string);

  const heroImage = settings.hero_image_url || "/college-photo.jpg";
  const heroTagline =
    settings.hero_tagline ||
    "Programme details, faculty, student association activities, club events and a complete study zone — all in one place.";

  const currentAssociation =
    associations.length > 0
      ? associations.reduce((latest, item) =>
          (item.start_year ?? 0) > (latest.start_year ?? 0) ? item : latest,
        )
      : null;

  const recentMaterials = materials.slice(0, 3);
  const eventCount =
    (club?.events.length ?? 0) +
    associations.reduce((sum, item) => sum + item.reports.length, 0);

  return (
    <>
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-brand-950">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroImage}
          alt="PSMO College (Autonomous), Tirurangadi"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* Blue duotone blend so the photo sits into the brand colour */}
        <div className="absolute inset-0 bg-brand-900/55 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-950 via-brand-950/85 to-brand-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/25 to-transparent" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-mesh-hero opacity-40 mix-blend-screen"
        />
        <div
          aria-hidden="true"
          className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand-500/30 blur-3xl animate-float"
        />
        <div
          aria-hidden="true"
          className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-accent-500/25 blur-3xl animate-float-slow"
        />

        <Container className="relative py-20 sm:py-28 lg:py-32">
          <div className="max-w-3xl animate-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-amber-300 backdrop-blur">
              <GraduationCap className="h-3.5 w-3.5" />
              PSMO College (Autonomous) · Tirurangadi
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.06] text-white sm:text-5xl lg:text-[3.6rem]">
              Department of <br />
              <span className="text-gradient-light">Computer Applications</span>
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-brand-100/85 sm:text-lg">
              {heroTagline}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <SpecularButton href="/department" variant="primary">
                Explore Department
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </SpecularButton>
              <SpecularButton href="/study-zone" variant="secondary">
                <BookOpen className="h-4 w-4" />
                Study Zone
              </SpecularButton>
            </div>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <Container className="relative z-10 -mt-12">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <StatCard value="120+" label="BCA Students" icon={<GraduationCap className="h-4 w-4" />} />
          <StatCard value={faculty.length || "—"} label="Faculty Members" icon={<Users className="h-4 w-4" />} />
          <StatCard value={associations.length || "—"} label="Associations" icon={<Sparkles className="h-4 w-4" />} />
          <StatCard value={eventCount} label="Reports & Events" icon={<BookOpen className="h-4 w-4" />} />
        </div>
      </Container>

      {/* Quick access */}
      <Container className="py-16 sm:py-20">
        <SectionHeading
          eyebrow="Dashboard"
          title="Where would you like to go?"
          description="Everything about the department is organised into four sections."
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {QUICK_LINKS.filter(
            (link) => !hiddenPublicHrefs.includes(link.href),
          ).map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group card-hover relative flex flex-col overflow-hidden rounded-3xl border border-ink-100 bg-white p-6 shadow-card"
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-brand-500/10 to-accent-500/10 blur-2xl transition-opacity group-hover:opacity-100"
                />
                <span
                  className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${link.accent} text-white shadow-md transition-transform group-hover:scale-110`}
                >
                  <Icon className="h-6 w-6" />
                </span>
                <span className="font-display text-lg font-semibold text-ink-900">
                  {link.label}
                </span>
                <span className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-500">
                  {link.description}
                </span>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                  Open
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </Container>

      {/* About — descriptive copy for visitors and search engines */}
      <div className="bg-white py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1.7fr_1fr] lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="About the Department"
                title="A four-year BCA programme at PSMO College, Tirurangadi"
              />
              <div className="mt-6 space-y-4 text-[15px] leading-relaxed text-ink-700">
                <p>
                  The Department of Computer Applications at PSMO College
                  (Autonomous), Tirurangadi offers a four-year Bachelor of
                  Computer Applications (BCA) programme affiliated to the
                  University of Calicut. Across eight semesters, students build
                  a strong foundation in programming, data structures,
                  databases, computer networks, web and mobile application
                  development and software engineering &mdash; supported by
                  hands-on laboratory work and project-based learning.
                </p>
                <p>
                  Beyond the classroom, the department runs an active student
                  association and club that organise technical workshops,
                  coding sessions, seminars, industry interactions and cultural
                  activities, giving students the communication and teamwork
                  skills that employers look for.
                </p>
                <p>
                  This website is the department&rsquo;s digital noticeboard.
                  Browse the faculty directory, read past event reports and
                  department magazines, download previous-year BCA question
                  papers and study notes from the Study Zone, and follow the
                  department gallery.
                </p>
              </div>
            </div>
            <dl className="self-start rounded-3xl border border-ink-100 bg-ink-50/60 p-6 sm:p-8">
              {[
                ["Programme", "Bachelor of Computer Applications (BCA)"],
                ["Duration", "4 years · 8 semesters"],
                ["Affiliation", "University of Calicut"],
                ["College", "PSMO College (Autonomous)"],
                ["Location", "Tirurangadi, Malappuram, Kerala"],
              ].map(([term, detail]) => (
                <div
                  key={term}
                  className="border-b border-ink-100 py-3 first:pt-0 last:border-b-0 last:pb-0"
                >
                  <dt className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-500">
                    {term}
                  </dt>
                  <dd className="mt-1 font-display text-base font-semibold text-ink-900">
                    {detail}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </div>

      {/* Association spotlight */}
      {currentAssociation ? (
        <div className="bg-white py-16 sm:py-20">
          <Container>
            <SectionHeading
              eyebrow="Student Association"
              title="Meet the current association office bearer"
              description={`${currentAssociation.name} · ${currentAssociation.year_label}`}
              action={
                <Link
                  href="/association"
                  className="inline-flex items-center gap-2 rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-700"
                >
                  All associations
                  <ArrowRight className="h-4 w-4" />
                </Link>
              }
            />
            <div className="mt-8 grid gap-6 lg:grid-cols-[320px_1fr]">
              <div className="overflow-hidden rounded-3xl border border-ink-100 bg-ink-50 shadow-card">
                <div className="aspect-[4/5] w-full">
                  <Avatar
                    src={currentAssociation.secretary_photo_url}
                    name={currentAssociation.secretary_name}
                    rounded="rounded-none"
                  />
                </div>
                <div className="p-5">
                  <div className="font-display text-lg font-semibold text-ink-900">
                    {currentAssociation.secretary_name ?? "To be announced"}
                  </div>
                  <div className="mt-0.5 text-sm font-medium text-brand-600">
                    {currentAssociation.secretary_designation ??
                      "Association Secretary"}
                  </div>
                </div>
              </div>
              <div className="relative overflow-hidden rounded-3xl border border-ink-100 bg-gradient-to-br from-ink-50 to-white p-6 sm:p-8">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent-500/10 blur-2xl"
                />
                <Badge tone="gold">{currentAssociation.year_label}</Badge>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-700">
                  {currentAssociation.description ||
                    currentAssociation.secretary_details ||
                    "Association details will be published here soon."}
                </p>
                <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-ink-100 bg-white p-4">
                    <div className="font-display text-2xl font-semibold text-brand-700">
                      {currentAssociation.reports.length}
                    </div>
                    <div className="text-xs font-medium uppercase tracking-wide text-ink-500">
                      Event reports
                    </div>
                  </div>
                  <div className="rounded-2xl border border-ink-100 bg-white p-4">
                    <div className="font-display text-2xl font-semibold text-brand-700">
                      {currentAssociation.magazine_url ? "1" : "0"}
                    </div>
                    <div className="text-xs font-medium uppercase tracking-wide text-ink-500">
                      Magazine
                    </div>
                  </div>
                  <div className="rounded-2xl border border-ink-100 bg-white p-4">
                    <div className="font-display text-2xl font-semibold text-brand-700">
                      {currentAssociation.end_year ?? "—"}
                    </div>
                    <div className="text-xs font-medium uppercase tracking-wide text-ink-500">
                      Term ends
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      ) : null}

      {/* Latest study materials */}
      {recentMaterials.length > 0 ? (
        <Container className="py-16 sm:py-20">
          <SectionHeading
            eyebrow="Study Zone"
            title="Recently added study material"
            description="Question papers and notes uploaded by the department."
            action={
              <Link
                href="/study-zone"
                className="inline-flex items-center gap-2 rounded-xl border border-ink-200 px-4 py-2.5 text-sm font-semibold text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-700"
              >
                Open Study Zone
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {recentMaterials.map((material) => (
              <div
                key={material.id}
                className="card-hover flex flex-col rounded-3xl border border-ink-100 bg-white p-5 shadow-card"
              >
                <Badge tone={material.category === "notes" ? "brand" : "gold"}>
                  {material.category === "notes" ? "Notes" : "Question Paper"}
                </Badge>
                <h3 className="mt-3 font-display text-base font-semibold text-ink-900">
                  {material.title}
                </h3>
                <div className="mt-1 text-xs text-ink-500">
                  {[material.subject, material.semester, material.year]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
                <DocumentActions
                  url={material.file_url}
                  title={material.title}
                  className="mt-4"
                />
              </div>
            ))}
          </div>
        </Container>
      ) : null}

      {/* Club teaser */}
      {club ? (
        <div className="bg-white py-16 sm:py-20">
          <Container>
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-brand-950 via-brand-800 to-accent-700 p-8 text-white shadow-lift sm:p-12">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-mesh-hero opacity-40 mix-blend-screen"
              />
              <div
                aria-hidden="true"
                className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-amber-400/20 blur-3xl animate-float"
              />
              <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <Badge className="bg-white/10 text-amber-300 ring-white/15">
                    <Sparkles className="h-3.5 w-3.5" />
                    Department Club
                  </Badge>
                  <h2 className="mt-4 font-display text-2xl font-semibold sm:text-3xl">
                    {club.name}
                  </h2>
                  <p className="mt-3 text-[15px] leading-relaxed text-brand-100/85">
                    {club.tagline || club.description}
                  </p>
                </div>
                <SpecularButton href="/club" variant="white">
                  Visit Club
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </SpecularButton>
              </div>
            </div>
          </Container>
        </div>
      ) : null}
    </>
  );
}
