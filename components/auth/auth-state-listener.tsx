"use client";

import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/auth";
import { syncUserWithDatabase } from "@/lib/auth/sync-user";

export function AuthStateListener() {
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      syncUserWithDatabase(user).catch(console.error);
    }
  }, [user]);

  return null;
}
