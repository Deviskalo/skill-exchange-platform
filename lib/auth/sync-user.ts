import { User as FirebaseUser } from "firebase/auth";
import { prisma } from "@/lib/prisma";

export async function syncUserWithDatabase(firebaseUser: FirebaseUser) {
  if (!firebaseUser.email) {
    throw new Error("User must have an email");
  }

  try {
    // Try to find existing user
    const existingUser = await prisma.user.findUnique({
      where: { email: firebaseUser.email },
    });

    if (!existingUser) {
      // Create new user if doesn't exist
      return await prisma.user.create({
        data: {
          email: firebaseUser.email,
          name: firebaseUser.displayName || firebaseUser.email.split("@")[0],
          imageUrl: firebaseUser.photoURL || null,
        },
      });
    }

    // Update existing user
    return await prisma.user.update({
      where: { email: firebaseUser.email },
      data: {
        name: firebaseUser.displayName || existingUser.name,
        imageUrl: firebaseUser.photoURL || existingUser.imageUrl,
      },
    });
  } catch (error) {
    console.error("Error syncing user with database:", error);
    throw error;
  }
}
