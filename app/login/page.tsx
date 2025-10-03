"use client";

import { signInAction } from "./actions";
import Header from "../components/loginHeader";
import Footer from "../components/footer";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/src/lib/supabase/client";
import { useUser } from "@/src/hooks/useUser";

export default function LoginPage() {
  const { user, loading } = useUser();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const session = await signInAction(formData);

      if (session) {
        const supabase = getBrowserSupabase();
        await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
        });
        router.push("/dashboard");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="mx-auto max-w-md px-6 pt-20">
        <h1 className="text-2xl font-semibold text-center">Log in</h1>

        {error && (
          <p
            className="mt-3 text-sm text-red-600 dark:text-red-400 text-center"
            role="alert"
          >
            {error}
          </p>
        )}

        <form
          className="mt-6 flex flex-col gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            await handleSubmit(formData);
          }}
        >
          <label className="text-sm">
            <span className="sr-only">Email</span>
            <input
              name="email"
              type="text"
              placeholder="you@example.com"
              className="w-full h-11 rounded-lg px-3 bg-white dark:bg-black/30
              border border-black/[.08] dark:border-white/[.145]
              outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
              suppressHydrationWarning
            />
          </label>

          <label className="text-sm">
            <span className="sr-only">Password</span>
            <input
              name="password"
              type="password"
              placeholder="Your password"
              className="w-full h-11 rounded-lg px-3 bg-white dark:bg-black/30
              border border-black/[.08] dark:border-white/[.145]
              outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
              suppressHydrationWarning
            />
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="h-11 rounded-lg bg-foreground text-background font-medium hover:opacity-90 disabled:opacity-50"
          >
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-sm text-center text-black/60 dark:text-white/60">
          Don’t have an account?{" "}
          <a className="underline hover:text-blue-600" href="/signup">
            Sign up
          </a>
        </p>
      </div>
      <Footer />
    </>
  );
}
