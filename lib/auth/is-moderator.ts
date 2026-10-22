import "server-only";

export function isModerator(email: string | null | undefined) {
  if (!email) {
    return false;
  }
  const allowedEmails = (process.env.MODERATOR_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
  return allowedEmails.includes(email.toLowerCase());
}
