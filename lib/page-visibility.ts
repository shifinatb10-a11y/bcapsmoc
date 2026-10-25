import { getPageVisibility } from "@/lib/queries";
import { isPublicVisible, isAdminVisible } from "@/lib/pages";

/** True when the Super Admin has left this public page visible. */
export async function publicPageVisible(key: string): Promise<boolean> {
  const visibility = await getPageVisibility();
  return isPublicVisible(visibility, key);
}

/** True when the Super Admin has left this admin page visible to admins. */
export async function adminPageVisible(key: string): Promise<boolean> {
  const visibility = await getPageVisibility();
  return isAdminVisible(visibility, key);
}
