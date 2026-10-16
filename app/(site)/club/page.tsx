import { CalendarDays, Sparkles } from "lucide-react";
import { getClub } from "@/lib/queries";
import { Container, EmptyState, PageHero } from "@/components/ui";
import { DocumentActions } from "@/components/DocumentActions";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";
import { publicPageVisible } from "@/lib/page-visibility";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Department Club",
  description:
    "Events and activity reports of the BCA Department club at PSMO College (Autonomous), Tirurangadi.",
};

export default async function ClubPage() {
  if (!(await publicPageVisible("club"))) notFound();

  const club = await getClub();

  return (
    <>
      <PageHero
        eyebrow="Department Club"
        title={club?.name ?? "BCA Department Club"}
        description={
          club?.tagline ||
          club?.description ||
          "A student-driven club that brings together technology enthusiasts through activities, competitions and hands-on learning."
        }
      />

      {club?.cover_image_url ? (
        <Container className="-mt-8 relative z-10">
          <div className="overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-lift">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={club.cover_image_url}
              alt={club.name}
              className="h-56 w-full object-cover sm:h-80"
            />
          </div>
        </Container>
      ) : null}

      <Container className="py-14 sm:py-20">
        {!club ? (
          <EmptyState
            title="The club is being set up"
            description="Our department is working on launching a student club. Events and reports will be published here soon."
          />
        ) : (
          <>
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-600">
                <Sparkles className="h-4 w-4" />
                About the club
              </div>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-700">
                {club.description ||
                  club.tagline ||
                  "Club details will be published here soon."}
              </p>
            </div>

            <div className="mt-12 flex items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-semibold text-ink-900 sm:text-3xl">
                  Club events &amp; activities
                </h2>
                <p className="mt-2 text-sm text-ink-500">
                  Every event includes its published report for reference.
                </p>
              </div>
              <span className="hidden shrink-0 rounded-full bg-brand-50 px-3.5 py-1.5 text-xs font-semibold text-brand-700 sm:inline-flex">
                {club.events.length}{" "}
                {club.events.length === 1 ? "event" : "events"}
              </span>
            </div>

            {club.events.length === 0 ? (
              <div className="mt-8">
                <EmptyState
                  title="No club events yet"
                  description="Events conducted by the club will appear here with their reports."
                />
              </div>
            ) : (
              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {club.events.map((event) => (
                  <article
                    key={event.id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-lift"
                  >
                    <div className="aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-brand-600 to-brand-900">
                      {event.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-white/80">
                          <Sparkles className="h-9 w-9" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      {event.event_date ? (
                        <div className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {formatDate(event.event_date)}
                        </div>
                      ) : null}
                      <h3 className="font-display text-lg font-semibold text-ink-900">
                        {event.title}
                      </h3>
                      {event.description ? (
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-500">
                          {event.description}
                        </p>
                      ) : (
                        <div className="flex-1" />
                      )}
                      {event.report_url ? (
                        <DocumentActions
                          url={event.report_url}
                          title={`${event.title} — Report`}
                          className="mt-4"
                        />
                      ) : (
                        <span className="mt-4 text-xs font-medium text-ink-500">
                          Report coming soon
                        </span>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </Container>
    </>
  );
}
