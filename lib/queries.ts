import { createClient } from "@/lib/supabase/server";
import { defaultVisibility, type VisibilityMap } from "@/lib/pages";
import type {
  Association,
  AssociationReport,
  Club,
  ClubEvent,
  Faculty,
  GalleryItem,
  SiteSetting,
  StudyMaterial,
  Transaction,
} from "@/lib/types";

/**
 * Every query degrades gracefully: if a table has not been created yet (or the
 * request fails) we return an empty result so public pages never crash.
 */

export async function getFaculty(): Promise<Faculty[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("faculty")
      .select("*")
      .order("display_order", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: true });
    if (error) return [];
    return (data ?? []) as Faculty[];
  } catch {
    return [];
  }
}

export interface AssociationWithReports extends Association {
  reports: AssociationReport[];
}

export async function getAssociations(): Promise<AssociationWithReports[]> {
  try {
    const supabase = await createClient();
    const [assocRes, reportsRes] = await Promise.all([
      supabase
        .from("associations")
        .select("*")
        .order("display_order", { ascending: true })
        .order("start_year", { ascending: false }),
      supabase
        .from("association_reports")
        .select("*")
        .order("event_date", { ascending: false }),
    ]);

    if (assocRes.error) return [];
    const associations = (assocRes.data ?? []) as Association[];
    const reports = (reportsRes.data ?? []) as AssociationReport[];

    return associations.map((association) => ({
      ...association,
      reports: reports.filter((r) => r.association_id === association.id),
    }));
  } catch {
    return [];
  }
}

export interface ClubWithEvents extends Club {
  events: ClubEvent[];
}

export async function getClub(): Promise<ClubWithEvents | null> {
  try {
    const supabase = await createClient();
    const { data: club, error } = await supabase
      .from("clubs")
      .select("*")
      .order("display_order", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (error || !club) return null;

    const { data: events } = await supabase
      .from("club_events")
      .select("*")
      .eq("club_id", (club as Club).id)
      .order("event_date", { ascending: false });

    return { ...(club as Club), events: (events ?? []) as ClubEvent[] };
  } catch {
    return null;
  }
}

export async function getClubList(): Promise<Club[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("clubs")
      .select("*")
      .order("display_order", { ascending: true });
    if (error) return [];
    return (data ?? []) as Club[];
  } catch {
    return [];
  }
}

export async function getStudyMaterials(): Promise<StudyMaterial[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("study_materials")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) return [];
    return (data ?? []) as StudyMaterial[];
  } catch {
    return [];
  }
}

export async function getSettings(): Promise<Record<string, string>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*");
    if (error) return {};
    return ((data ?? []) as SiteSetting[]).reduce<Record<string, string>>(
      (acc, row) => {
        if (row.value != null) acc[row.key] = row.value;
        return acc;
      },
      {},
    );
  } catch {
    return {};
  }
}

/** The hero background photo URL (falls back to the bundled college photo). */
export async function getHeroImage(): Promise<string> {
  const settings = await getSettings();
  return settings.hero_image_url || "/college-photo.jpg";
}

export async function getTransactions(): Promise<Transaction[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .order("transaction_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });
    if (error) return [];
    return (data ?? []) as Transaction[];
  } catch {
    return [];
  }
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gallery_items")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) return [];
    return (data ?? []) as GalleryItem[];
  } catch {
    return [];
  }
}

/** Reads the page visibility switches (public read, safe for everyone). */
export async function getPageVisibility(): Promise<VisibilityMap> {
  const map = defaultVisibility();
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("page_visibility")
      .select("*");
    if (error) return map;
    for (const row of (data ?? []) as {
      page: string;
      public_visible: boolean;
      admin_visible: boolean;
    }[]) {
      if (map[row.page]) {
        map[row.page] = {
          public_visible: row.public_visible,
          admin_visible: row.admin_visible,
        };
      }
    }
    return map;
  } catch {
    return map;
  }
}
