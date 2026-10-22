import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth/server";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().trim().min(1).max(100),
  photoURL: z.string().url().optional(),
});

const maxAvatarSize = 1 * 1024 * 1024;

export const dynamic = "force-dynamic";

function getImageContentType(bytes: Buffer) {
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  ) {
    return "image/jpeg";
  }
  if (
    bytes.length >= 8 &&
    bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  ) {
    return "image/png";
  }
  if (
    bytes.length >= 12 &&
    bytes.toString("ascii", 0, 4) === "RIFF" &&
    bytes.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }
  if (
    bytes.length >= 6 &&
    ["GIF87a", "GIF89a"].includes(bytes.toString("ascii", 0, 6))
  ) {
    return "image/gif";
  }
  return null;
}

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      name: user.name,
      imageUrl: user.imageUrl,
    });
  } catch (error) {
    console.error("Profile retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const isMultipart = request.headers
      .get("content-type")
      ?.includes("multipart/form-data");
    let parsed;
    let photoURL: string | undefined;

    if (isMultipart) {
      const formData = await request.formData();
      const file = formData.get("avatar");
      parsed = profileSchema.safeParse({ name: formData.get("name") });
      if (!parsed.success) {
        return NextResponse.json(
          { error: "Invalid profile data" },
          { status: 400 }
        );
      }
      if (!(file instanceof File)) {
        return NextResponse.json(
          { error: "Avatar file is required" },
          { status: 400 }
        );
      }
      if (file.size === 0 || file.size > maxAvatarSize) {
        return NextResponse.json(
          { error: "Avatar must be an image smaller than 1 MB" },
          { status: 400 }
        );
      }

      const bytes = Buffer.from(await file.arrayBuffer());
      const contentType = getImageContentType(bytes);
      if (!contentType || contentType !== file.type) {
        return NextResponse.json(
          { error: "Upload a valid JPEG, PNG, WebP, or GIF image" },
          { status: 400 }
        );
      }

      photoURL = `data:${contentType};base64,${bytes.toString("base64")}`;
    } else {
      parsed = profileSchema.safeParse(await request.json());
      photoURL = parsed.success ? parsed.data.photoURL : undefined;
    }

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid profile data" },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: parsed.data.name,
        ...(photoURL && { imageUrl: photoURL }),
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      photoURL: photoURL || user.imageUrl,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
