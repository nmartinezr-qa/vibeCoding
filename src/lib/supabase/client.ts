/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/src/types/database.types";

let browserClient: ReturnType<typeof createClient<Database>> | null =
  null as any;

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
              const value = window.localStorage.getItem(key);
              return value;
            }
            return null;
          },
          setItem: (key: string, value: string) => {
            if (typeof window !== "undefined") {
              window.localStorage.setItem(key, value);
            }
          },
          removeItem: (key: string) => {
            if (typeof window !== "undefined") {
              window.localStorage.removeItem(key);
            }
          },
        },
      },
    }
  );

  return browserClient;
}
