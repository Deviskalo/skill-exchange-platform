"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAuth,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {
  doc,
  updateDoc,
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

// Firebase Error Mapping
const firebaseErrorMessages: { [key: string]: string } = {
  // Authentication Errors
  "auth/invalid-email": "The email address is not valid.",
  "auth/user-disabled": "This user account has been disabled.",
  "auth/user-not-found": "No user found with this email address.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/email-already-in-use": "This email is already registered.",
  "auth/weak-password":
    "The password is too weak. Please choose a stronger password.",

  // Profile Update Errors
  "auth/requires-recent-login":
    "Please log out and log in again to update your profile.",

  // Password Change Errors
  "auth/credential-already-in-use": "These credentials are already in use.",

  // Default Error
  default: "An unexpected error occurred. Please try again.",
};

// Helper function to get user-friendly error message
const getFirebaseErrorMessage = (error: any): string => {
  if (error.code) {
    return (
      firebaseErrorMessages[error.code] || firebaseErrorMessages["default"]
    );
  }
  return error.message || firebaseErrorMessages["default"];
};

export default function ProfilePage() {
  const auth = getAuth();
  const storage = getStorage();
  const db = getFirestore();
  const router = useRouter();

  const [user, setUser] = useState(auth.currentUser);
  const [name, setName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(
    user?.photoURL || null
  );
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [userSkills, setUserSkills] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setName(currentUser?.displayName || "");
      setEmail(currentUser?.email || "");
      setPreviewAvatar(currentUser?.photoURL || null);
    });

    const fetchUserSkills = async () => {
      if (!user) return;

      try {
        const skills = await prisma.skill.findMany({
          where: { userId: user.uid },
          include: {
            category: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        });
        setUserSkills(skills);
      } catch (err) {
        console.error("Error fetching user skills:", err);
      }
    };

    fetchUserSkills();

    return () => unsubscribe();
  }, [user, auth]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(file);
      setPreviewAvatar(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async () => {
    try {
      // Ensure user is authenticated
      if (!user) {
        setError("No authenticated user found");
        return;
      }

      let downloadURL = previewAvatar;

      // Upload avatar if a new file is selected
      if (avatar) {
        const storageRef = ref(storage, `avatars/${user.uid}`);
        const snapshot = await uploadBytes(storageRef, avatar);
        downloadURL = await getDownloadURL(storageRef);
      }

      // Send update to server
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          ...(downloadURL && { photoURL: downloadURL }),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      // Update local Firebase profile
      await updateProfile(user, {
        displayName: name,
        ...(downloadURL && { photoURL: downloadURL }),
      });

      setSuccess("Profile updated successfully!");
      setError("");
      setPreviewAvatar(downloadURL);
    } catch (error) {
      console.error("Profile update error:", error);
      setError(
        error instanceof Error
          ? getFirebaseErrorMessage(error)
          : "Failed to update profile. Please try again."
      );
    }
  };

  const handlePasswordChange = async () => {
    if (!user || !user.email) return;

    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      setSuccess("Password updated successfully!");
      setError("");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: any) {
      setError(getFirebaseErrorMessage(err));
      setSuccess("");
    }
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        Please log in to view your profile.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-8">Profile Settings</h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Profile Details Column */}
        <div className="md:col-span-1">
          {/* Avatar Upload Section */}
          <div className="mb-6 flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              {previewAvatar ? (
                <Image
                  src={previewAvatar}
                  alt="Profile Avatar"
                  fill
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                  No Avatar
                </div>
              )}
            </div>
            <Input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="mb-2"
            />
          </div>

          {/* Name Update */}
          <div className="mb-4">
            <label className="block mb-2">Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          {/* Password Change */}
          <div className="mb-4">
            <label className="block mb-2">Current Password</label>
            <Input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">New Password</label>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          {/* Error and Success Messages */}
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {success && <div className="text-green-500 mb-4">{success}</div>}

          {/* Update Buttons */}
          <div className="space-y-4">
            <Button onClick={handleUpdateProfile} className="w-full">
              Update Profile
            </Button>
            <Button
              onClick={handlePasswordChange}
              variant="secondary"
              className="w-full"
            >
              Change Password
            </Button>
          </div>
        </div>

        {/* Skills Column */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                My Skills
                <Link href="/skills/create" className="text-sm text-primary">
                  + Add New Skill
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userSkills.length === 0 ? (
                <div className="text-center text-muted-foreground">
                  You haven&apos;t added any skills yet.
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {userSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">{skill.title}</h3>
                        <span className="text-xs text-muted-foreground">
                          {skill.category.name}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {skill.description}
                      </p>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          Created:{" "}
                          {new Date(skill.createdAt).toLocaleDateString()}
                        </span>
                        <Link
                          href={`/skills/${skill.id}`}
                          className="text-xs text-primary hover:underline"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
