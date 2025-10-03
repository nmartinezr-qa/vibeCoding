"use client";

import Link from "next/link";
import { Home, LogOut } from "lucide-react";
import { getBrowserSupabase } from "@/src/lib/supabase/client";
import { useEffect, useState } from "react";

export default function LoginHeader() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const supabase = getBrowserSupabase();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="fixed top-0 left-0 w-full h-14 flex items-center justify-between px-6 border-b border-black/10 dark:border-white/10 bg-white dark:bg-black z-50">
      <div className="text-lg font-semibold text-foreground">RecipeShare</div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          aria-label="Go to home"
        >
          <Home className="h-5 w-5" />
        </Link>

        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-red-600 dark:hover:text-red-400 transition-colors"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        )}
      </div>
    </header>
  );
}
