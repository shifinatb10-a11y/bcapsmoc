import { Building2, GraduationCap, Mail, MonitorSmartphone, Users } from "lucide-react";
import { getFaculty, getSettings } from "@/lib/queries";
import { Avatar, Badge, Container, EmptyState, PageHero } from "@/components/ui";
import { notFound } from "next/navigation";
import { publicPageVisible } from "@/lib/page-visibility";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Department",
  description:
    "About the Department of Computer Applications and its faculty at PSMO College (Autonomous), Tirurangadi.",
};

const HIGHLIGHTS = [
  {
    icon: GraduationCap,
    title: "3-Year BCA Programme",
    description:
      "A six-semester undergraduate programme affiliated to the University of Calicut, covering programming, databases, networking and modern application development.",
  },
  {
    icon: MonitorSmartphone,
    title: "Well-equipped Labs",
    description:
      "Modern computer labs with the latest software, high-speed internet and dedicated practical sessions for every semester.",
  },
  {
    icon: Users,
    title: "Active Student Life",
    description:
      "A vibrant student association and department club that organise workshops, technical fests and industry interactions.",
  },
];

export default async function DepartmentPage() {
  if (!(await publicPageVisible("department"))) notFound();

  const [faculty, settings] = await Promise.all([getFaculty(), getSettings()]);

  const intro =
    settings.department_intro ||
    "The Department of Computer Applications at PSMO College (Autonomous), Tirurangadi offers an undergraduate BCA programme that blends strong theoretical foundations with hands-on practical training. Our faculty guide students through programming, software development, database systems, computer networks and emerging technologies such as web and mobile application development.";

  const intro2 =
    settings.department_intro_secondary ||
    "Beyond the classroom, the department maintains modern computer labs and an active student association that conducts technical fests, workshops, seminars and extension activities throughout the academic year. Our aim is to shape graduates who are skilled, curious and industry-ready.";

  return (
    <>
      <PageHero
        eyebrow="About the Department"
        title="Department of Computer Applications"
        description="Nurturing the next generation of software professionals through quality teaching, modern facilities and a thriving student community."
      />

      <Container className="py-14 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div className="animate-in">
            <Badge tone="brand">
              <Building2 className="h-3.5 w-3.5" />
              Overview
            </Badge>
            <h2 className="mt-4 font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
              Who we are
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-700">
              {intro}
            </p>
            <p className="mt-4 text-[15px] leading-relaxed text-ink-700">
              {intro2}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
              <div className="text-xs font-bold uppercase tracking-wider text-brand-600">
                Established programme
              </div>
              <div className="mt-1 font-display text-3xl font-semibold text-ink-900">
                BCA
              </div>
              <div className="text-sm text-ink-500">
                Bachelor of Computer Applications
              </div>
            </div>
            <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
              <div className="text-xs font-bold uppercase tracking-wider text-brand-600">
                Faculty
              </div>
              <div className="mt-1 font-display text-3xl font-semibold text-ink-900">
                {faculty.length || "—"}
              </div>
              <div className="text-sm text-ink-500">
                Dedicated teaching staff
              </div>
            </div>
            <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
              <div className="text-xs font-bold uppercase tracking-wider text-brand-600">
                Affiliation
              </div>
              <div className="mt-1 font-display text-xl font-semibold text-ink-900">
                University of Calicut
              </div>
              <div className="text-sm text-ink-500">NAAC Accredited</div>
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-3">
          {HIGHLIGHTS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="rounded-2xl border border-ink-100 bg-white p-6 shadow-card"
              >
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-display text-lg font-semibold text-ink-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </Container>

      {/* Faculty */}
      <div className="bg-white py-14 sm:py-20">
        <Container>
          <div className="max-w-2xl">
            <Badge tone="gold">
              <Users className="h-3.5 w-3.5" />
              Faculty Directory
            </Badge>
            <h2 className="mt-4 font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
              Meet our faculty members
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-500">
              Experienced teachers and mentors who guide our students through the
              programme and beyond.
            </p>
          </div>

          {faculty.length === 0 ? (
            <div className="mt-8">
              <EmptyState
                title="Faculty profiles are being updated"
                description="Faculty photographs and details will appear here soon."
              />
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {faculty.map((member) => (
                <article
                  key={member.id}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-brand-50">
                    <Avatar
                      src={member.photo_url}
                      name={member.name}
                      rounded="rounded-none"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="font-display text-lg font-semibold text-ink-900">
                      {member.name}
                    </h3>
                    <div className="mt-1 text-sm font-semibold text-brand-600">
                      {member.designation || member.role_title || "Faculty"}
                    </div>
                    {member.qualification ? (
                      <div className="mt-2 text-xs text-ink-500">
                        {member.qualification}
                      </div>
                    ) : null}
                    {member.bio ? (
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-500">
                        {member.bio}
                      </p>
                    ) : null}
                    {member.email ? (
                      <a
                        href={`mailto:${member.email}`}
                        className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-600 hover:text-brand-700"
                      >
                        <Mail className="h-4 w-4" />
                        {member.email}
                      </a>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </Container>
      </div>
    </>
  );
}
