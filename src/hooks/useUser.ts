"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getBrowserSupabase } from "@/src/lib/supabase/client";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getBrowserSupabase();

    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("❌ Error getting session:", error.message);

          // Handle specific refresh token errors
          if (
            error.message.includes("Refresh Token Not Found") ||
            error.message.includes("Invalid Refresh Token")
          ) {
            console.warn(
              "🔄 Refresh token expired or invalid, clearing session"
            );
            await supabase.auth.signOut({ scope: "local" });
          }
        }

        setUser(data.session?.user ?? null);
      } catch (error) {
        console.error("❌ Unexpected error during auth initialization:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("🔄 Auth state changed:", event, !!session?.user);

        if (event === "TOKEN_REFRESHED") {
          console.log("✅ Token refreshed successfully");
        } else if (event === "SIGNED_OUT") {
          console.log("👋 User signed out");
          setUser(null);
        } else if (event === "SIGNED_IN") {
          console.log("🎉 User signed in");
          setUser(session?.user ?? null);
        }

        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
}
