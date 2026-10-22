"use client";

import { useState } from "react";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type ProfileSkill = {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  category: { name: string };
};

type ProfileClientProps = {
  profile: { name: string | null; email: string; imageUrl: string | null };
  skills: ProfileSkill[];
};

const firebaseErrorMessages: Record<string, string> = {
  "auth/invalid-email": "The email address is not valid.",
  "auth/user-disabled": "This user account has been disabled.",
  "auth/user-not-found": "No user found with this email address.",
  "auth/wrong-password": "Incorrect password. Please try again.",
  "auth/email-already-in-use": "This email is already registered.",
  "auth/weak-password":
    "The password is too weak. Please choose a stronger password.",
  "auth/requires-recent-login":
    "Please log out and log in again to update your profile.",
  default: "An unexpected error occurred. Please try again.",
};

function getFirebaseErrorMessage(error: unknown) {
  if (typeof error === "object" && error !== null && "code" in error) {
    const code = String(error.code);
    return firebaseErrorMessages[code] || firebaseErrorMessages.default;
  }
  return error instanceof Error
    ? error.message
    : firebaseErrorMessages.default;
}

export function ProfileClient({ profile, skills }: ProfileClientProps) {
  const [user, loading] = useAuthState(auth);
  const [name, setName] = useState(profile.name || "");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState<string | null>(
    profile.imageUrl
  );
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUpdateProfile = async () => {
    if (!user) {
      setError("Your login session is not ready. Please try again.");
      return;
    }

    try {
      const requestBody = avatar ? new FormData() : JSON.stringify({ name });
      if (avatar && requestBody instanceof FormData) {
        requestBody.append("name", name);
        requestBody.append("avatar", avatar);
      }

      const response = await fetch("/api/profile", {
        method: "PUT",
        ...(avatar ? {} : { headers: { "Content-Type": "application/json" } }),
        body: requestBody,
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "Failed to update profile");
      }

      const photoURL = result.photoURL || previewAvatar;
      await updateProfile(user, { displayName: name });
      setPreviewAvatar(photoURL);
      setAvatar(null);
      setSuccess("Profile updated successfully!");
      setError("");
    } catch (updateError) {
      setError(getFirebaseErrorMessage(updateError));
      setSuccess("");
    }
  };

  const handlePasswordChange = async () => {
    if (!user?.email) {
      setError("Your login session is not ready. Please try again.");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setSuccess("Password updated successfully!");
      setError("");
      setCurrentPassword("");
      setNewPassword("");
    } catch (passwordError) {
      setError(getFirebaseErrorMessage(passwordError));
      setSuccess("");
    }
  };

  if (loading) {
    return <div className="container mx-auto p-6">Loading profile...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-4xl font-bold">Profile Settings</h1>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-1">
          <div className="mb-6 flex flex-col items-center">
            <div className="relative mb-4 h-32 w-32">
              {previewAvatar ? (
                <Image
                  src={previewAvatar}
                  alt="Profile avatar"
                  fill
                  className="rounded-full object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gray-200">
                  No Avatar
                </div>
              )}
            </div>
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  setAvatar(file);
                  setPreviewAvatar(URL.createObjectURL(file));
                }
              }}
              className="mb-2"
            />
            <p className="text-xs text-muted-foreground">
              JPEG, PNG, WebP, or GIF. Maximum size: 1 MB.
            </p>
          </div>
          <div className="mb-4">
            <label htmlFor="profile-name" className="mb-2 block">
              Name
            </label>
            <Input
              id="profile-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your name"
            />
            <p className="mt-1 text-sm text-muted-foreground">{profile.email}</p>
          </div>
          <div className="mb-4">
            <label htmlFor="current-password" className="mb-2 block">
              Current Password
            </label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              placeholder="Enter current password"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="new-password" className="mb-2 block">
              New Password
            </label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="Enter new password"
            />
          </div>
          {error && <div className="mb-4 text-red-500">{error}</div>}
          {success && <div className="mb-4 text-green-600">{success}</div>}
          <div className="space-y-4">
            <Button
              onClick={handleUpdateProfile}
              className="w-full"
              disabled={!user}
            >
              Update Profile
            </Button>
            <Button
              onClick={handlePasswordChange}
              variant="secondary"
              className="w-full"
              disabled={!user}
            >
              Change Password
            </Button>
          </div>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                My Skills
                <Link href="/skills/create" className="text-sm text-primary">
                  + Add New Skill
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {skills.length === 0 ? (
                <div className="text-center text-muted-foreground">
                  You haven&apos;t added any skills yet.
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="rounded-lg border p-4 transition-shadow hover:shadow-sm"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <h2 className="font-semibold">{skill.title}</h2>
                        <span className="text-xs text-muted-foreground">
                          {skill.category.name}
                        </span>
                      </div>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {skill.description}
                      </p>
                      <div className="mt-2 flex justify-between">
                        <span className="text-xs text-muted-foreground">
                          Created: {new Date(skill.createdAt).toLocaleDateString()}
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
