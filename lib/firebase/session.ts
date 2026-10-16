import type { User } from "firebase/auth";

export async function establishSession(
  user: User,
  profile?: {
    name?: string;
    bio?: string;
    learningInterests?: string[];
  }
) {
  const token = await user.getIdToken();
  const response = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, profile }),
  });

  if (!response.ok) {
    const result = await response.json().catch(() => null);
    throw new Error(result?.error || "Unable to establish your session");
  }
}
