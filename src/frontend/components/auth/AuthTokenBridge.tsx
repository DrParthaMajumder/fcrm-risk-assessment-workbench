"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { registerAuthTokenGetter } from "@/lib/api/auth-token";

export function AuthTokenBridge() {
  const { getToken, isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    registerAuthTokenGetter(() => getToken());
  }, [getToken, isLoaded]);

  return null;
}
