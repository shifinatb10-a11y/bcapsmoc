import { redirect } from "next/navigation";
import { CalendarDays, ImageIcon } from "lucide-react";
import { getAdminSession } from "@/lib/auth";
import { getClub } from "@/lib/queries";
import { canManage } from "@/lib/types";
import { AdminPageHeader, AdminCard, Unauthorized } from "@/components/admin/AdminPage";
import { ClubForm, ClubEventForm } from "@/components/admin/entity-forms";
import { DeleteButton } from "@/components/admin/DeleteButton";
import { formatDate } from "@/lib/utils";
import { deleteClubEvent } from "@/app/actions/club";

export const dynamic = "force-dynamic";

export default async function AdminClubPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  if (!canManage(session.role, "club")) {
    return <Unauthorized section="club" />;
  }

  const club = await getClub();

  return (
    <>
      <AdminPageHeader
        title="Club"
        description="Set up the department club and publish its events with their activity reports."
      />

      {!club ? (
        <AdminCard
          title="Create the department club"
          description="Give your club a name and description. You can add events once it is created."
        >
          <ClubForm />
        </AdminCard>
      ) : (
        <>
          <AdminCard title="Club details">
            <ClubForm club={club} />
          </AdminCard>

          <div className="mt-8 space-y-4">
            <h2 className="font-display text-lg font-semibold text-ink-900">
              Club events ({club.events.length})
            </h2>

            {club.events.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-ink-100 bg-white px-5 py-10 text-center text-sm text-ink-500">
                No club events yet. Add the first one below.
              </p>
            ) : (
              club.events.map((event) => (
                <div
                  key={event.id}
                  className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card"
                >
                  <div className="flex items-start gap-4">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-brand-50">
                      {event.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={event.image_url}
                          alt={event.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-brand-400">
                          <ImageIcon className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-ink-900">
                        {event.title}
                      </div>
                      {event.event_date ? (
                        <div className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-ink-500">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {formatDate(event.event_date)}
                        </div>
                      ) : null}
                      {event.description ? (
                        <p className="mt-1 line-clamp-2 text-sm text-ink-500">
                          {event.description}
                        </p>
                      ) : null}
                    </div>
                    <DeleteButton
                      action={deleteClubEvent}
                      id={event.id}
                      confirmMessage={`Delete event "${event.title}"?`}
                    />
                  </div>

                  <details className="mt-4 border-t border-ink-100 pt-4">
                    <summary className="cursor-pointer text-sm font-semibold text-brand-600">
                      Edit event
                    </summary>
                    <div className="mt-4">
                      <ClubEventForm club={club} event={event} />
                    </div>
                  </details>
                </div>
              ))
            )}

            <AdminCard title="Add a club event">
              <ClubEventForm club={club} />
            </AdminCard>
          </div>
        </>
      )}
    </>
  );
}
