"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/src/lib/supabase/client";

export default function MainHeader() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = getBrowserSupabase();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        console.log("🔍 Current session check:", {
          hasSession: !!session,
          userId: session?.user?.id,
          userEmail: session?.user?.email,
          error: error?.message,
        });

        setIsAuthenticated(!!session?.user);
      } catch (error) {
        console.error("❌ Error checking auth:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Logout error:", error);
      } else {
        console.log("✅ Logout successful");
        router.push("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full h-14 flex items-center justify-between px-6 border-b border-black/10 dark:border-white/10 bg-white dark:bg-black z-50">
      <div className="text-lg font-semibold text-foreground">RecipeShare</div>

      {!isLoading && isAuthenticated && (
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-foreground hover:text-red-600 dark:hover:text-red-400 transition-colors"
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}
