// app/api/skills/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "firebase-admin/auth";

export async function POST(request: NextRequest) {
  try {
    // Log all incoming request details
    console.log(
      "Skill Creation Request Headers:",
      Object.fromEntries(request.headers)
    );
    console.log("Skill Creation Request Cookies:", request.cookies);

    // Verify the session cookie
    const sessionCookie = request.cookies.get("session")?.value;
    console.log("Session Cookie:", sessionCookie);

    if (!sessionCookie) {
      console.error("No session cookie found");
      return NextResponse.json(
        { error: "Unauthorized: No session" },
        { status: 401 }
      );
    }

    // Verify the session
    let decodedToken;
    try {
      decodedToken = await getAuth().verifySessionCookie(sessionCookie, true);
      console.log("Decoded Token:", decodedToken);
    } catch (verifyError) {
      console.error("Session verification error:", verifyError);
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    const userId = decodedToken.uid;
    console.log("User ID:", userId);

    // Parse the request body
    const body = await request.json();
    console.log("Request Body:", body);

    const { title, description, categoryId, tags } = body;

    // Validate input
    if (!title || !description || !categoryId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the skill
    const newSkill = await prisma.skill.create({
      data: {
        title,
        description,
        categoryId,
        tags: tags || [],
        userId,
      },
    });

    console.log("Skill Created:", newSkill);

    return NextResponse.json(newSkill, { status: 201 });
  } catch (error) {
    console.error("Skill creation error:", error);
    return NextResponse.json(
      {
        error: "Failed to create skill",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
