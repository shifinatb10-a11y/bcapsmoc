import Link from "next/link";
import {
  ArrowDownRight, ArrowRight, BookOpen, Building2, CalendarDays,
  GraduationCap, Images, Laptop2, Sparkles, Users, MoveUpRight,
} from "lucide-react";
import {
  getAssociations, getClub, getFaculty, getPageVisibility,
  getSettings, getStudyMaterials,
} from "@/lib/queries";
import { Avatar, Badge, Container, SectionHeading, StatCard } from "@/components/ui";
import { DocumentActions } from "@/components/DocumentActions";
import { SpecularButton } from "@/components/SpecularButton";
import { notFound } from "next/navigation";
import { publicPageVisible } from "@/lib/page-visibility";
import { isPublicVisible, PAGES } from "@/lib/pages";

export const dynamic = "force-dynamic";
export const metadata = { alternates: { canonical: "/" } };

const LINKS = [
  { href: "/department", label: "The Department", kicker: "01 / Discover", description: "Explore our programme, faculty, facilities and the people shaping the next generation of computing.", icon: Building2 },
  { href: "/association", label: "Student Association", kicker: "02 / Community", description: "Ideas become initiatives. Meet student leaders and explore reports from department activities.", icon: Users },
  { href: "/club", label: "Clubs & Activities", kicker: "03 / Create", description: "Workshops, collaborative projects and experiences beyond the classroom.", icon: Sparkles },
  { href: "/study-zone", label: "Learning Resources", kicker: "04 / Learn", description: "Find notes and previous question papers to support your learning journey.", icon: BookOpen },
  { href: "/gallery", label: "Campus Stories", kicker: "05 / Moments", description: "A visual record of the people, projects and moments that make our department.", icon: Images },
];

export default async function DashboardPage() {
  if (!(await publicPageVisible("home"))) notFound();
  const [settings, faculty, associations, club, materials, visibility] = await Promise.all([
    getSettings(), getFaculty(), getAssociations(), getClub(), getStudyMaterials(), getPageVisibility(),
  ]);
  const hidden = PAGES.filter(p => p.publicHref && !isPublicVisible(visibility, p.key)).map(p => p.publicHref as string);
  const heroImage = settings.hero_image_url || "/college-photo.jpg";
  const tagline = settings.hero_tagline || "Curiosity to code. Ideas to impact. Discover the people, programmes and possibilities at the Department of Computer Applications.";
  const current = associations.length ? associations.reduce((a, b) => (b.start_year ?? 0) > (a.start_year ?? 0) ? b : a) : null;
  const recent = materials.slice(0, 3);
  const eventCount = (club?.events.length ?? 0) + associations.reduce((sum, a) => sum + a.reports.length, 0);

  return (
    <div className="academic-home">
      <section className="relative isolate min-h-[660px] overflow-hidden bg-[#07152b] text-white sm:min-h-[730px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={heroImage} alt="PSMO College (Autonomous), Tirurangadi" className="absolute inset-0 h-full w-full object-cover opacity-45" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061326] via-[#071a31]/90 to-[#071a31]/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07152b] via-transparent to-[#07152b]/30" />
        <div aria-hidden="true" className="academic-orb absolute -right-24 top-24 h-96 w-96 rounded-full bg-blue-500/25 blur-[100px]" />
        <div aria-hidden="true" className="academic-grid absolute inset-0 opacity-20" />
        <Container className="relative flex min-h-[660px] items-center py-24 sm:min-h-[730px]">
          <div className="max-w-4xl">
            <div className="academic-reveal inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/[0.08] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-blue-100 backdrop-blur-md sm:text-xs">
              <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_16px_4px_rgba(103,232,249,.5)]" />
              PSMO College (Autonomous) · Tirurangadi
            </div>
            <p className="academic-reveal mt-10 text-xs font-semibold uppercase tracking-[0.32em] text-cyan-300" style={{ animationDelay: "100ms" }}>Department of</p>
            <h1 className="academic-reveal mt-4 max-w-4xl font-display text-5xl font-medium leading-[.98] tracking-[-.045em] text-white sm:text-7xl lg:text-[6.4rem]" style={{ animationDelay: "180ms" }}>
              Computer <span className="academic-title-accent italic">Applications.</span>
            </h1>
            <p className="academic-reveal mt-8 max-w-xl text-base leading-8 text-slate-200/85 sm:text-lg" style={{ animationDelay: "260ms" }}>{tagline}</p>
            <div className="academic-reveal mt-10 flex flex-wrap items-center gap-4" style={{ animationDelay: "340ms" }}>
              <SpecularButton href="/department" variant="primary">Explore the department <ArrowRight className="h-4 w-4" /></SpecularButton>
              <Link href="/study-zone" className="group inline-flex items-center gap-2 px-3 py-3 text-sm font-semibold text-white/90 transition-colors hover:text-cyan-300">Explore Study Zone <MoveUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></Link>
            </div>
          </div>
          <div className="absolute bottom-9 right-6 hidden items-center gap-3 text-[10px] font-semibold uppercase tracking-[.25em] text-white/55 lg:flex">
            <span className="h-px w-12 bg-white/40" /> Scroll to explore <ArrowDownRight className="h-4 w-4" />
          </div>
        </Container>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />
      </section>

      <Container className="relative z-10 -mt-1">
        <div className="grid grid-cols-2 border-x border-b border-slate-200 bg-white shadow-[0_20px_70px_-45px_rgba(7,21,43,.35)] sm:grid-cols-4">
          <StatCard value="120+" label="BCA Students" icon={<GraduationCap className="h-4 w-4" />} />
          <StatCard value={faculty.length || "—"} label="Faculty Members" icon={<Users className="h-4 w-4" />} />
          <StatCard value={associations.length || "—"} label="Associations" icon={<Sparkles className="h-4 w-4" />} />
          <StatCard value={eventCount} label="Reports & Events" icon={<CalendarDays className="h-4 w-4" />} />
        </div>
      </Container>

      <Container className="py-24 sm:py-32">
        <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-xs font-bold uppercase tracking-[.28em] text-blue-600">Explore / BCA PSMO</p>
            <h2 className="mt-5 font-display text-4xl font-medium leading-tight tracking-[-.035em] text-[#0a1a31] sm:text-5xl">A place to <span className="italic text-blue-600">learn, build</span> and belong.</h2>
            <p className="mt-6 max-w-md text-[15px] leading-7 text-slate-600">Everything happening across the Department of Computer Applications, thoughtfully brought together in one place.</p>
            <div className="mt-8 flex items-center gap-3 text-sm font-semibold text-slate-500"><span className="h-px w-10 bg-blue-500" /> Five ways to explore</div>
          </div>
          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {LINKS.filter(item => !hidden.includes(item.href)).map((item, i) => {
              const Icon = item.icon;
              return <Link key={item.href} href={item.href} className="academic-link group grid gap-4 py-7 transition-all sm:grid-cols-[54px_1fr_48px] sm:items-center">
                <span className="text-xs font-semibold tracking-widest text-blue-600">{item.kicker.split(" / ")[0]}</span>
                <span>
                  <span className="flex items-center gap-3 font-display text-2xl font-medium tracking-tight text-[#0a1a31] transition-colors group-hover:text-blue-600 sm:text-3xl">{item.label}<Icon className="h-5 w-5 text-blue-500/70 sm:hidden" /></span>
                  <span className="mt-2 block max-w-xl text-sm leading-6 text-slate-500">{item.description}</span>
                </span>
                <span className="hidden h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-all group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white sm:flex"><ArrowDownRight className="h-5 w-5 transition-transform group-hover:rotate-[-45deg]" /></span>
              </Link>;
            })}
          </div>
        </div>
      </Container>

      <section className="bg-[#f2f6fb] py-24 sm:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.15fr_.85fr] lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.28em] text-blue-600">The programme</p>
              <h2 className="mt-5 max-w-2xl font-display text-4xl font-medium leading-tight tracking-[-.035em] text-[#0a1a31] sm:text-5xl">Build a foundation for <span className="italic text-blue-600">what comes next.</span></h2>
              <div className="mt-7 max-w-2xl space-y-4 text-[15px] leading-7 text-slate-600">
                <p>The Department of Computer Applications at PSMO College (Autonomous), Tirurangadi offers a four-year Bachelor of Computer Applications (BCA) programme affiliated to the University of Calicut. Across eight semesters, students build a foundation in programming, data structures, databases, computer networks, web and mobile application development and software engineering.</p>
                <p>Beyond the classroom, student association and club activities create opportunities for workshops, coding sessions, seminars, industry interactions and collaborative learning.</p>
              </div>
              <Link href="/department" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-blue-700 hover:gap-3">Discover the department <ArrowRight className="h-4 w-4" /></Link>
            </div>
            <div className="relative min-h-[360px] overflow-hidden bg-[#0a1a31] p-8 text-white sm:p-10">
              <div className="academic-grid absolute inset-0 opacity-25" />
              <div className="relative">
                <Laptop2 className="h-8 w-8 text-cyan-300" />
                <p className="mt-16 text-xs font-bold uppercase tracking-[.25em] text-cyan-300">At a glance</p>
                <div className="mt-5 space-y-5">
                  {[["Programme", "Bachelor of Computer Applications"], ["Duration", "4 years · 8 semesters"], ["Affiliation", "University of Calicut"], ["Location", "Tirurangadi, Kerala"]].map(([label, value]) => <div key={label} className="border-b border-white/15 pb-4 last:border-0"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-white/45">{label}</p><p className="mt-1 text-lg font-medium text-white">{value}</p></div>)}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {current ? <Container className="py-24 sm:py-28">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <SectionHeading eyebrow="Student community" title="The people behind the progress" description={`${current.name} · ${current.year_label}`} />
          <Link href="/association" className="inline-flex items-center gap-2 text-sm font-bold text-blue-700">View association <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="mt-10 grid overflow-hidden border border-slate-200 bg-white md:grid-cols-[260px_1fr]">
          <div className="aspect-[4/3] md:aspect-auto"><Avatar src={current.secretary_photo_url} name={current.secretary_name} rounded="rounded-none" /></div>
          <div className="p-7 sm:p-10">
            <Badge tone="gold">{current.year_label}</Badge>
            <p className="mt-5 text-xs font-bold uppercase tracking-[.2em] text-blue-600">Association Secretary</p>
            <h3 className="mt-2 font-display text-3xl font-medium text-[#0a1a31]">{current.secretary_name ?? "To be announced"}</h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">{current.description || current.secretary_details || "Association details will be published here soon."}</p>
            <div className="mt-8 flex flex-wrap gap-8">{[[current.reports.length, "Event reports"], [current.magazine_url ? "01" : "00", "Magazine"], [current.end_year ?? "—", "Term ends"]].map(([value, label]) => <div key={label}><p className="font-display text-2xl text-blue-700">{value}</p><p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p></div>)}</div>
          </div>
        </div>
      </Container> : null}

      {recent.length ? <section className="bg-[#07152b] py-24 text-white sm:py-28">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div><p className="text-xs font-bold uppercase tracking-[.28em] text-cyan-300">Keep learning</p><h2 className="mt-4 font-display text-4xl font-medium tracking-tight sm:text-5xl">Fresh from the Study Zone.</h2><p className="mt-4 text-sm text-slate-300">Recently added notes and question papers.</p></div>
            <Link href="/study-zone" className="inline-flex items-center gap-2 text-sm font-bold text-cyan-300 hover:gap-3">All resources <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">{recent.map(material => <article key={material.id} className="academic-resource border border-white/15 bg-white/[.06] p-6 backdrop-blur-sm transition-colors hover:bg-white/[.1]">
            <Badge tone={material.category === "notes" ? "brand" : "gold"}>{material.category === "notes" ? "Notes" : "Question Paper"}</Badge>
            <h3 className="mt-5 font-display text-xl font-medium text-white">{material.title}</h3>
            <p className="mt-2 text-xs text-slate-400">{[material.subject, material.semester, material.year].filter(Boolean).join(" · ")}</p>
            <DocumentActions url={material.file_url} title={material.title} className="mt-5" />
          </article>)}</div>
        </Container>
      </section> : null}

      {club ? <section className="bg-white py-20 sm:py-24"><Container><div className="relative overflow-hidden bg-blue-600 px-7 py-12 text-white sm:px-12 sm:py-16"><div className="academic-grid absolute inset-0 opacity-20" /><div className="relative flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.25em] text-blue-100">Make things happen</p><h2 className="mt-4 font-display text-3xl font-medium sm:text-4xl">{club.name}</h2><p className="mt-3 max-w-xl text-sm leading-7 text-blue-50">{club.tagline || club.description}</p></div><SpecularButton href="/club" variant="white">Explore the club <ArrowRight className="h-4 w-4" /></SpecularButton></div></div></Container></section> : null}
    </div>
  );
}
