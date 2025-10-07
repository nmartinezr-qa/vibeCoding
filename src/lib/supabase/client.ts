/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/src/types/database.types";

let browserClient: ReturnType<typeof createClient<Database>> | null =
  null as any;

// Utility function to clear expired sessions
export async function clearExpiredSession() {
  if (typeof window !== "undefined") {
    try {
      const keysToRemove = [
        "sb-access-token",
        "sb-refresh-token",
        "supabase.auth.token",
      ];

      keysToRemove.forEach((key) => {
        window.localStorage.removeItem(key);
      });

      console.log("🧹 Cleared expired session data");
    } catch (error) {
      console.warn("Failed to clear session data:", error);
    }
  }
}

// Utility function to check if session is valid
export async function validateSession(): Promise<boolean> {
  try {
    const supabase = getBrowserSupabase();
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      if (
        error.message.includes("Refresh Token Not Found") ||
        error.message.includes("Invalid Refresh Token")
      ) {
        await clearExpiredSession();
        return false;
      }
    }

    return !!data.session?.user;
  } catch (error) {
    console.error("Session validation error:", error);
    return false;
  }
}

export function getBrowserSupabase() {
  if (browserClient) return browserClient;

  browserClient = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: "pkce",
        storage: {
          getItem: (key: string) => {
            if (typeof window !== "undefined") {
              try {
                const value = window.localStorage.getItem(key);
                return value;
              } catch (error) {
                console.warn("Failed to get item from localStorage:", error);
                return null;
              }
            }
            return null;
          },
          setItem: (key: string, value: string) => {
            if (typeof window !== "undefined") {
              try {
                window.localStorage.setItem(key, value);
              } catch (error) {
                console.warn("Failed to set item in localStorage:", error);
              }
            }
          },
          removeItem: (key: string) => {
            if (typeof window !== "undefined") {
              try {
                window.localStorage.removeItem(key);
              } catch (error) {
                console.warn("Failed to remove item from localStorage:", error);
              }
            }
          },
        },
      },
    }
  );

  return browserClient;
}
