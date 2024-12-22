import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuth } from "firebase-admin/auth";
import { db } from "@/lib/firebase";
import {
  doc,
  updateDoc,
  query,
  collection,
  where,
  getDocs,
} from "firebase/firestore";

export async function PUT(request: NextRequest) {
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
    const { name, photoURL } = await request.json();

    // Update Firestore user document
    const userQuery = query(
      collection(db, "users"),
      where("uid", "==", userId)
    );

    const querySnapshot = await getDocs(userQuery);
    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      await updateDoc(userDoc.ref, {
        name,
        ...(photoURL && { photoURL }),
      });
    }

    // Update Prisma user
    await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        ...(photoURL && { imageUrl: photoURL }),
      },
    });

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
