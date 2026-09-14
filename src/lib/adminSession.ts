export const COACH_COOKIE = "hp_coach";

export function getCoachTokenFromCookie(cookieHeader: string | null) {
  if (!cookieHeader) return null;
  const parts = cookieHeader.split(";").map((part) => part.trim());
  const row = parts.find((part) => part.startsWith(`${COACH_COOKIE}=`));
  return row ? decodeURIComponent(row.slice(COACH_COOKIE.length + 1)) : null;
}
