import { getServerSupabase } from "@/src/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

async function signInAction(formData: FormData) {
  "use server";
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();

  const supabase = await getServerSupabase();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }
  redirect("/");
}

export default async function LoginPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await props.searchParams;
  const error = typeof sp.error === "string" ? sp.error : undefined;

  return (
    <div className="mx-auto max-w-md px-6 py-10">
      <h1 className="text-2xl font-semibold">Log in</h1>
      {error ? (
        <p className="mt-3 text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      ) : null}
      <form action={signInAction} className="mt-6 flex flex-col gap-3">
        <label className="text-sm">
          <span className="sr-only">Email</span>
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="w-full h-11 rounded-lg px-3 bg-white dark:bg-black/30 border border-black/[.08] dark:border-white/[.145] outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
          />
        </label>
        <label className="text-sm">
          <span className="sr-only">Password</span>
          <input
            name="password"
            type="password"
            required
            placeholder="Your password"
            className="w-full h-11 rounded-lg px-3 bg-white dark:bg-black/30 border border-black/[.08] dark:border-white/[.145] outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
          />
        </label>
        <button
          type="submit"
          className="h-11 rounded-lg bg-foreground text-background font-medium hover:opacity-90"
        >
          Log in
        </button>
      </form>
      <p className="mt-4 text-sm text-black/60 dark:text-white/60">
        Don’t have an account?{" "}
        <a className="underline" href="/signup">
          Sign up
        </a>
      </p>
    </div>
  );
}
