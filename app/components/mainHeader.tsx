"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/src/lib/supabase/client";

interface MainHeaderProps {
  offsetLeft?: string; // ancho dinámico del sidebar
  fixed?: boolean; // si debe ser fixed o no
}

export default function MainHeader({
  offsetLeft = "0rem",
  fixed = false,
}: MainHeaderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = getBrowserSupabase();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setIsAuthenticated(!!session?.user);
      } catch {
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
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header
      className={`
        ${fixed ? "fixed top-0" : "relative"} 
        right-0 h-16 flex items-center justify-between px-6 
        border-b border-black/10 dark:border-white/10 
        bg-white dark:bg-black z-50 transition-all duration-300
      `}
      style={{ left: offsetLeft }}
    >
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
