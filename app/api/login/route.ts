import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import admin from "@/lib/firebase-admin";
import { syncUserWithDatabase } from "@/lib/auth/sync-user";

const loginSchema = z.object({
  token: z.string().min(1),
  profile: z
    .object({
      name: z.string().trim().min(1).max(100).optional(),
      bio: z.string().max(500).optional(),
      learningInterests: z
        .array(z.string().trim().min(1).max(80))
        .max(20)
        .optional(),
    })
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid login data" },
        { status: 400 }
      );
    }

    let decodedToken;
    try {
      decodedToken = await admin.auth().verifyIdToken(parsed.data.token);
    } catch (error) {
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        String(error.code).startsWith("auth/")
      ) {
        return NextResponse.json(
          { error: "Invalid ID token" },
          { status: 401 }
        );
      }
      throw error;
    }

    await syncUserWithDatabase(decodedToken, parsed.data.profile);
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await admin
      .auth()
      .createSessionCookie(parsed.data.token, { expiresIn });

    const response = NextResponse.json({ success: true });
    response.cookies.set("session", sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });
    return response;
  } catch (error) {
    console.error("Session creation error:", error);
    return NextResponse.json(
      { error: "Unable to create session" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("session", "", {
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  return response;
}
