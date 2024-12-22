import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "firebase-admin/auth";

export async function POST(request: NextRequest) {
  try {
    // Verify the session cookie
    const sessionCookie = request.cookies.get("session")?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the session
    const decodedToken = await getAuth().verifySessionCookie(
      sessionCookie,
      true
    );
    const userId = decodedToken.uid;

    // Parse the request body
    const { title, description, categoryId, tags } = await request.json();

    // Create the skill
    const newSkill = await prisma.skill.create({
      data: {
        title,
        description,
        categoryId,
        tags,
        userId,
      },
    });

    return NextResponse.json(newSkill, { status: 201 });
  } catch (error) {
    console.error("Skill creation error:", error);
    return NextResponse.json(
      { error: "Failed to create skill" },
      { status: 500 }
    );
  }
}
