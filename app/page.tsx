"use client";

import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/src/lib/supabase/client";
import Footer from "../app/components/footer";

export default function Home() {
  const router = useRouter();
  const supabase = getBrowserSupabase();

  const handleStartSharing = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    } catch (error) {
      console.error("Error checking session:", error);
      router.push("/login");
    }
  };

  return (
    <div className="font-sans min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-black/[.08] dark:border-white/[.145]">
        <div className="mx-auto max-w-6xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold">RecipeShare</h1>
          </div>
          <nav className="flex items-center gap-3 text-sm">
            <a
              className="inline-flex items-center justify-center h-9 px-4 rounded-full hover:bg-[#f2f2f2] dark:hover:bg-[#111]"
              href="/login"
            >
              Login
            </a>
            <a
              className="inline-flex items-center justify-center h-9 px-4 rounded-full bg-foreground text-background hover:opacity-90"
              href="/signup"
            >
              Sign Up
            </a>
          </nav>
        </div>
      </header>

      {/* Main - Hero Section */}
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-3xl">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Share Your Culinary Masterpieces
          </h2>
          <p className="text-base sm:text-lg text-black/70 dark:text-white/70 mb-8 max-w-2xl mx-auto">
            Join our community of food lovers. Share recipes, discover new
            dishes, and connect with fellow cooking enthusiasts.
          </p>
          <button
            onClick={handleStartSharing}
            className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-foreground text-background text-base font-medium hover:opacity-90"
          >
            Start Sharing
          </button>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
