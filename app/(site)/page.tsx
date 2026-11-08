import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  Code2,
  GraduationCap,
  Images,
  MoveUpRight,
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
    label: "The Department",
    kicker: "01 / Discover",
    description: "Explore our programme, meet the faculty and discover the learning environment.",
    icon: Building2,
    accent: "bg-sky-100 text-sky-800",
  },
  {
    href: "/association",
    label: "Student Association",
    kicker: "02 / Connect",
    description: "See the people, initiatives and reports shaping student life.",
    icon: Users,
    accent: "bg-amber-100 text-amber-800",
  },
  {
    href: "/club",
    label: "Department Club",
    kicker: "03 / Create",
    description: "Follow technical activities, workshops and creative collaborations.",
    icon: Sparkles,
    accent: "bg-emerald-100 text-emerald-800",
  },
  {
    href: "/study-zone",
    label: "Study Zone",
    kicker: "04 / Learn",
    description: "Find notes, previous question papers and useful learning resources.",
    icon: BookOpen,
    accent: "bg-violet-100 text-violet-800",
  },
  {
    href: "/gallery",
    label: "Campus Stories",
    kicker: "05 / Explore",
    description: "Browse moments from events, projects and department activities.",
    icon: Images,
    accent: "bg-rose-100 text-rose-800",
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
    "A place to think critically, build boldly and turn ideas into meaningful technology.";

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
      <section className="relative isolate overflow-hidden bg-[#08172b] text-white">
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(38,139,194,.28),transparent_32%),radial-gradient(circle_at_85%_75%,rgba(243,178,75,.16),transparent_28%)]" />
        <div aria-hidden="true" className="absolute inset-0 bg-grid-faint opacity-[0.12]" />
        <Container className="relative grid min-h-[650px] items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:py-24">
          <div className="relative z-10 max-w-2xl">
            <div className="animate-in inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-[10px] font-bold uppercase tracking-[.2em] text-sky-200 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-amber-300 shadow-[0_0_14px_rgba(252,211,77,.8)]" />
              PSMO College (Autonomous) · Tirurangadi
            </div>
            <p className="animate-in mt-9 text-xs font-semibold uppercase tracking-[.28em] text-amber-300 [animation-delay:100ms]">
              Department of Computer Applications
            </p>
            <h1 className="animate-in mt-5 max-w-3xl font-display text-[clamp(3.2rem,7vw,6.4rem)] font-semibold leading-[.96] tracking-[-.055em] text-white [animation-delay:180ms]">
              Ideas into
              <span className="block text-[#8bd5f4]">impact<span className="text-amber-300">.</span></span>
            </h1>
            <p className="animate-in mt-7 max-w-xl text-base leading-8 text-slate-300 sm:text-lg [animation-delay:260ms]">
              {heroTagline}
            </p>
            <div className="animate-in mt-9 flex flex-wrap items-center gap-3 [animation-delay:340ms]">
              <SpecularButton href="/department" variant="primary">
                Explore the department
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </SpecularButton>
              <Link href="/study-zone" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition-all hover:border-white/50 hover:bg-white/10">
                <BookOpen className="h-4 w-4" /> Explore Study Zone
              </Link>
            </div>
            <div className="animate-in mt-14 flex items-center gap-4 text-xs text-slate-400 [animation-delay:420ms]">
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15"><ArrowDownRight className="h-4 w-4" /></span>
              <span className="uppercase tracking-[.18em]">Scroll to discover</span>
              <span className="h-px w-16 bg-white/20" />
              <span>Learn · Build · Lead</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[560px] animate-in [animation-delay:220ms]">
            <div className="absolute -inset-5 rounded-[2rem] border border-white/10 rotate-[-4deg]" />
            <div className="absolute -inset-5 rounded-[2rem] border border-sky-300/20 rotate-[3deg] animate-float-slow" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.7rem] border border-white/15 bg-slate-800 shadow-[0_35px_100px_-35px_rgba(0,0,0,.8)] sm:aspect-[5/4] lg:aspect-[4/5]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={heroImage} alt="PSMO College campus" className="h-full w-full object-cover transition-transform duration-[1400ms] hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071426]/95 via-[#071426]/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                <div className="text-[10px] font-bold uppercase tracking-[.24em] text-amber-300">The next chapter starts here</div>
                <div className="mt-3 max-w-sm font-display text-2xl font-semibold leading-tight sm:text-3xl">Curiosity is our starting point. Creation is our direction.</div>
                <div className="mt-6 flex items-center justify-between border-t border-white/20 pt-4 text-xs text-slate-300">
                  <span>PSMO · BCA</span>
                  <span className="flex items-center gap-2">Explore campus <MoveUpRight className="h-4 w-4" /></span>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-4 hidden rounded-2xl border border-slate-200/70 bg-white p-4 text-[#10243b] shadow-xl sm:block lg:-left-10">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-800"><Code2 className="h-5 w-5" /></span>
                <span><strong className="block text-sm">Think. Make. Matter.</strong><small className="text-xs text-slate-500">A future-focused BCA journey</small></span>
              </div>
            </div>
          </div>
        </Container>
        <div className="relative overflow-hidden border-t border-white/10 bg-white/[.04]">
          <div className="flex min-w-max animate-marquee items-center gap-10 py-4 text-[10px] font-bold uppercase tracking-[.24em] text-slate-300">
            {Array.from({ length: 2 }).map((_, index) => (
              <span key={index} className="flex items-center gap-10">
                <span>Computer Applications</span><span className="text-amber-300">✳</span>
                <span>Creative Thinking</span><span className="text-sky-300">✳</span>
                <span>Technology & Research</span><span className="text-amber-300">✳</span>
                <span>Community & Collaboration</span><span className="text-sky-300">✳</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      <Container className="relative z-10 -mt-1 py-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard value={faculty.length || "—"} label="Faculty members" icon={<Users className="h-4 w-4" />} />
          <StatCard value={associations.length || "—"} label="Association terms" icon={<GraduationCap className="h-4 w-4" />} />
          <StatCard value={eventCount} label="Published activities" icon={<CalendarDays className="h-4 w-4" />} />
          <StatCard value={materials.length} label="Study resources" icon={<BookOpen className="h-4 w-4" />} />
        </div>
      </Container>

      <Container className="py-20 sm:py-28">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[.24em] text-sky-700">Explore the ecosystem / 01—05</p>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-tight text-[#10243b] sm:text-5xl">Everything that makes<br className="hidden sm:block" /> campus life move.</h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-slate-500">A connected space for academic information, student initiatives, resources and the moments in between.</p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {QUICK_LINKS.filter((link) => !hiddenPublicHrefs.includes(link.href)).map((link, index) => {
            const Icon = link.icon;
            return (
              <Link key={link.href} href={link.href} className="group relative flex min-h-[260px] flex-col overflow-hidden rounded-[1.6rem] border border-slate-200 bg-white p-7 shadow-[0_8px_30px_-24px_rgba(15,23,42,.35)] transition-all duration-500 hover:-translate-y-2 hover:border-sky-200 hover:shadow-[0_28px_65px_-32px_rgba(14,116,144,.35)]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[.2em] text-slate-400">{link.kicker}</span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:border-sky-300 group-hover:bg-sky-50 group-hover:text-sky-800"><MoveUpRight className="h-4 w-4" /></span>
                </div>
                <span className={`mt-8 flex h-12 w-12 items-center justify-center rounded-2xl ${link.accent}`}><Icon className="h-5 w-5" /></span>
                <h3 className="mt-5 font-display text-xl font-semibold text-[#10243b]">{link.label}</h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">{link.description}</p>
                <div className="absolute bottom-0 left-7 right-7 h-[3px] origin-left scale-x-0 bg-gradient-to-r from-sky-500 to-amber-400 transition-transform duration-500 group-hover:scale-x-100" />
              </Link>
            );
          })}
        </div>
      </Container>

      <section className="overflow-hidden bg-[#eef4f7] py-20 sm:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.24em] text-sky-800">About the department</p>
              <h2 className="mt-4 max-w-2xl font-display text-4xl font-semibold leading-tight tracking-tight text-[#10243b] sm:text-5xl">Technology changes. The ability to think stays.</h2>
              <div className="mt-7 max-w-2xl space-y-4 text-[15px] leading-8 text-slate-600">
                <p>The Department of Computer Applications at PSMO College (Autonomous), Tirurangadi offers a four-year Bachelor of Computer Applications (BCA) programme affiliated to the University of Calicut. Across eight semesters, students build a strong foundation in programming, data structures, databases, computer networks, web and mobile application development and software engineering — supported by hands-on laboratory work and project-based learning.</p>
                <p>Beyond the classroom, the department runs an active student association and club that organise technical workshops, coding sessions, seminars, industry interactions and cultural activities, giving students the communication and teamwork skills that employers look for.</p>
                <p>This website is the department’s digital noticeboard. Browse the faculty directory, read past event reports and department magazines, download previous-year BCA question papers and study notes from the Study Zone, and follow the department gallery.</p>
              </div>
              <Link href="/department" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-sky-800 transition-all hover:gap-4">More about the department <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] border border-sky-900/10 rotate-3" />
              <dl className="relative rounded-[1.7rem] bg-[#10243b] p-7 text-white shadow-2xl sm:p-9">
                <div className="mb-8 flex items-center gap-3 text-amber-300"><GraduationCap className="h-5 w-5" /><span className="text-[10px] font-bold uppercase tracking-[.22em]">Programme snapshot</span></div>
                {[
                  ["Programme", "Bachelor of Computer Applications"],
                  ["Duration", "4 years · 8 semesters"],
                  ["Affiliation", "University of Calicut"],
                  ["Institution", "PSMO College (Autonomous)"],
                  ["Location", "Tirurangadi, Kerala"],
                ].map(([term, detail]) => (
                  <div key={term} className="border-b border-white/10 py-4 last:border-0 last:pb-0">
                    <dt className="text-[10px] font-bold uppercase tracking-[.18em] text-sky-200/70">{term}</dt>
                    <dd className="mt-1.5 font-display text-base font-semibold text-white">{detail}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </section>

      {currentAssociation ? (
        <Container className="py-20 sm:py-28">
          <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-stretch">
            <div className="overflow-hidden rounded-[1.7rem] bg-slate-100">
              <div className="aspect-[4/3] lg:aspect-auto lg:h-full">
                <Avatar src={currentAssociation.secretary_photo_url} name={currentAssociation.secretary_name} rounded="rounded-none" />
              </div>
            </div>
            <div className="flex flex-col justify-center rounded-[1.7rem] bg-[#10243b] p-8 text-white sm:p-12">
              <p className="text-xs font-bold uppercase tracking-[.24em] text-amber-300">Student association · {currentAssociation.year_label}</p>
              <h2 className="mt-5 font-display text-3xl font-semibold sm:text-4xl">Leadership grows through participation.</h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-300">{currentAssociation.description || currentAssociation.secretary_details || "Association details will be published here soon."}</p>
              <div className="mt-8 flex flex-wrap items-end justify-between gap-6 border-t border-white/15 pt-6">
                <div><div className="text-xl font-semibold">{currentAssociation.secretary_name ?? "To be announced"}</div><div className="mt-1 text-xs text-sky-200">{currentAssociation.secretary_designation ?? "Association Secretary"}</div></div>
                <div className="flex gap-7 text-center">
                  <div><div className="font-display text-2xl font-semibold text-amber-300">{currentAssociation.reports.length}</div><div className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">Reports</div></div>
                  <div><div className="font-display text-2xl font-semibold text-amber-300">{currentAssociation.magazine_url ? "1" : "0"}</div><div className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">Magazine</div></div>
                </div>
              </div>
              <Link href="/association" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-white transition-all hover:gap-4">Meet the association <ArrowRight className="h-4 w-4" /></Link>
            </div>
          </div>
        </Container>
      ) : null}

      {recentMaterials.length > 0 ? (
        <Container className="py-20 sm:py-24">
          <SectionHeading eyebrow="The Study Zone" title="Knowledge, within reach." description="Recently added question papers and learning materials." action={<Link href="/study-zone" className="inline-flex items-center gap-2 text-sm font-bold text-sky-800">All resources <ArrowRight className="h-4 w-4" /></Link>} />
          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {recentMaterials.map((material) => (
              <article key={material.id} className="rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <Badge tone={material.category === "notes" ? "brand" : "gold"}>{material.category === "notes" ? "Notes" : "Question Paper"}</Badge>
                <h3 className="mt-4 font-display text-lg font-semibold text-[#10243b]">{material.title}</h3>
                <p className="mt-2 text-xs text-slate-500">{[material.subject, material.semester, material.year].filter(Boolean).join(" · ")}</p>
                <DocumentActions url={material.file_url} title={material.title} className="mt-5" />
              </article>
            ))}
          </div>
        </Container>
      ) : null}

      {club ? (
        <section className="px-4 pb-20 sm:px-6 sm:pb-28">
          <Container>
            <div className="relative overflow-hidden rounded-[2rem] bg-[#dff2f7] p-8 sm:p-14">
              <div aria-hidden="true" className="absolute -right-16 -top-24 h-80 w-80 rounded-full border-[1px] border-sky-900/10" />
              <div aria-hidden="true" className="absolute -right-6 -top-14 h-60 w-60 rounded-full border-[1px] border-sky-900/10" />
              <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl">
                  <p className="text-xs font-bold uppercase tracking-[.24em] text-sky-800">Make something matter</p>
                  <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-[#10243b] sm:text-5xl">{club.name}</h2>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-slate-600">{club.tagline || club.description}</p>
                </div>
                <SpecularButton href="/club" variant="primary">Explore the club <ArrowRight className="h-4 w-4" /></SpecularButton>
              </div>
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
