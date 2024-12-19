"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  getAuth, 
  updateProfile, 
  updatePassword, 
  reauthenticateWithCredential, 
  EmailAuthProvider 
} from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { doc, updateDoc, getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setName(currentUser?.displayName || "");
      setEmail(currentUser?.email || "");
      setPreviewAvatar(currentUser?.photoURL || null);
    });

    return () => unsubscribe();
  }, [auth]);

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
  
      console.log("Current user:", user);
      console.log("Name to update:", name);
  
      // Update profile in Firebase Authentication
      await updateProfile(user, {
        displayName: name,
        ...(previewAvatar && { photoURL: previewAvatar })
      });
  
      console.log("Firebase profile updated");
  
      // Update avatar if selected
      if (avatar) {
        const storageRef = ref(storage, `avatars/${user.uid}`);
        
        try {
          // Upload the file
          const snapshot = await uploadBytes(storageRef, avatar);
          console.log("Avatar uploaded successfully");
  
          // Get download URL
          const downloadURL = await getDownloadURL(storageRef);
          console.log("Avatar download URL:", downloadURL);
  
          // Update profile with new photo URL
          await updateProfile(user, { photoURL: downloadURL });
  
          // Update Firestore user document
          const userQuery = query(
            collection(db, "users"), 
            where("uid", "==", user.uid)
          );
          
          const querySnapshot = await getDocs(userQuery);
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            await updateDoc(userDoc.ref, {
              name,
              photoURL: downloadURL
            });
            console.log("Firestore user document updated");
          } else {
            console.error("No user document found in Firestore");
          }
  
          setPreviewAvatar(downloadURL);
        } catch (uploadError: unknown) {
          console.error("Avatar upload error:", uploadError);
          setError(`Failed to upload avatar: ${uploadError instanceof Error ? uploadError.message : String(uploadError)}`);
          return;
        }
      } else {
        // If no new avatar, just update name in Firestore
        const userQuery = query(
          collection(db, "users"), 
          where("uid", "==", user.uid)
        );
        
        const querySnapshot = await getDocs(userQuery);
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0];
          await updateDoc(userDoc.ref, { name });
          console.log("Firestore user name updated");
        } else {
          console.error("No user document found in Firestore");
        }
      }
  
      setSuccess("Profile updated successfully!");
      setError("");
    } catch (err: any) {
      console.error("Full update error:", err);
      setError(`Update failed: ${err.message}`);
      setSuccess("");
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
      setError(err.message);
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
    <div className="max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold mb-8">Profile Settings</h1>

      {/* Avatar Upload */}
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
      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}
      {success && (
        <div className="text-green-500 mb-4">{success}</div>
      )}

      {/* Update Buttons */}
      <div className="space-y-4">
        <Button 
          onClick={handleUpdateProfile} 
          className="w-full"
        >
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
  );
}