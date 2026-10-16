"use client";

import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/lib/firebase/auth";
import { establishSession } from "@/lib/firebase/session";

export function AuthStateListener() {
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      establishSession(user).catch((error: unknown) => {
        console.error("Failed to synchronize authenticated session:", error);
      });
    }
  }, [user]);

  return null;
}
