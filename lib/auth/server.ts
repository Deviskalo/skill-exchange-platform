import "server-only";

import { cookies } from "next/headers";
import admin, { isFirebaseAdminConfigured } from "@/lib/firebase-admin";
import { prisma } from "@/lib/prisma";

export async function getSessionUser() {
  const sessionCookie = cookies().get("session")?.value;
  if (!sessionCookie || !isFirebaseAdminConfigured()) {
    return null;
  }

  let decodedToken;
  try {
    decodedToken = await admin.auth().verifySessionCookie(sessionCookie, true);
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      String(error.code).startsWith("auth/")
    ) {
      return null;
    }
    throw error;
  }

  return prisma.user.findUnique({
    where: { firebaseUid: decodedToken.uid },
  });
}
