import "server-only";

import type { DecodedIdToken } from "firebase-admin/auth";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type ProfileData = {
  name?: string;
  bio?: string;
  learningInterests?: string[];
};

export async function syncUserWithDatabase(
  firebaseUser: DecodedIdToken,
  profile: ProfileData = {}
) {
  if (!firebaseUser.email) {
    throw new Error("User must have an email");
  }

  const tokenName = firebaseUser.name || undefined;
  const imageUrl = firebaseUser.picture || undefined;
  const existingUser = await prisma.user.findUnique({
    where: { firebaseUid: firebaseUser.uid },
  });

  if (existingUser) {
    return prisma.user.update({
      where: { id: existingUser.id },
      data: {
        email: firebaseUser.email,
        ...((profile.name || existingUser.name || tokenName) && {
          name: profile.name || existingUser.name || tokenName,
        }),
        ...(imageUrl && !existingUser.imageUrl && { imageUrl }),
        ...(profile.bio !== undefined && { bio: profile.bio }),
        ...(profile.learningInterests && {
          learningInterests: profile.learningInterests,
        }),
      },
    });
  }

  const existingEmail = await prisma.user.findUnique({
    where: { email: firebaseUser.email },
  });

  if (existingEmail) {
    return prisma.user.update({
      where: { id: existingEmail.id },
      data: {
        firebaseUid: firebaseUser.uid,
        ...((profile.name || existingEmail.name || tokenName) && {
          name: profile.name || existingEmail.name || tokenName,
        }),
        ...(imageUrl && !existingEmail.imageUrl && { imageUrl }),
        ...(profile.bio !== undefined && { bio: profile.bio }),
        ...(profile.learningInterests && {
          learningInterests: profile.learningInterests,
        }),
      },
    });
  }

  try {
    return await prisma.user.create({
      data: {
        email: firebaseUser.email,
        firebaseUid: firebaseUser.uid,
        name: profile.name || tokenName || firebaseUser.email.split("@")[0],
        imageUrl,
        bio: profile.bio,
        learningInterests: profile.learningInterests || [],
      },
    });
  } catch (error) {
    if (
      !(error instanceof Prisma.PrismaClientKnownRequestError) ||
      error.code !== "P2002"
    ) {
      throw error;
    }

    const concurrentlyCreatedUser = await prisma.user.findFirst({
      where: {
        OR: [
          { firebaseUid: firebaseUser.uid },
          { email: firebaseUser.email },
        ],
      },
    });
    if (!concurrentlyCreatedUser) {
      throw error;
    }

    return prisma.user.update({
      where: { id: concurrentlyCreatedUser.id },
      data: {
        email: firebaseUser.email,
        firebaseUid: firebaseUser.uid,
        ...((profile.name || concurrentlyCreatedUser.name || tokenName) && {
          name: profile.name || concurrentlyCreatedUser.name || tokenName,
        }),
        ...(imageUrl &&
          !concurrentlyCreatedUser.imageUrl && { imageUrl }),
        ...(profile.bio !== undefined && { bio: profile.bio }),
        ...(profile.learningInterests && {
          learningInterests: profile.learningInterests,
        }),
      },
    });
  }
}
