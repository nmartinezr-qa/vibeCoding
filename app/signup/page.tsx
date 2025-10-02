import { getServerSupabase } from "@/src/lib/supabase/server";
import { redirect } from "next/navigation";
import ClientSignupForm from "./ClientSignupForm";
import Header from "../components/header";
import Footer from "../components/footer";

export const dynamic = "force-dynamic";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function evaluatePassword(password: string) {
  const rules = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  } as const;
  const ok = Object.values(rules).every(Boolean);
  return { ok, rules };
}

async function signUpAction(formData: FormData) {
  "use server";
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();
  const fullname = String(formData.get("fullname") || "").trim();
  const username = String(formData.get("username") || "").trim();

  // Basic validations
  if (!isValidEmail(email)) {
    redirect(`/signup?error=${encodeURIComponent("Invalid email format")}`);
  }
  const pass = evaluatePassword(password);
  if (!pass.ok) {
    redirect(`/signup?error=${encodeURIComponent("Weak password")}`);
  }

  const supabase = await getServerSupabase();

  // Username uniqueness
  if (username) {
    const { data: existing } = await supabase
      .from("profile")
      .select("id")
      .eq("username", username)
      .limit(1)
      .maybeSingle();
    if (existing) {
      redirect(`/signup?error=${encodeURIComponent("Username already taken")}`);
    }
  }

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error || !data.user) {
    redirect(
      `/signup?error=${encodeURIComponent(
        error?.message || "Failed to sign up"
      )}`
    );
  }

  // Create profile row best-effort
  await supabase
    .from("profile")
    .upsert({ id: data.user.id, fullname, username });
  redirect("/");
}

export default async function SignupPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await props.searchParams;
  const error = typeof sp.error === "string" ? sp.error : undefined;

  return (
    <>
      <Header />

      <div className="mx-auto max-w-md px-6 pt-20">
        <h1 className="text-2xl font-semibold text-center">Sign up</h1>

        {error ? (
          <p
            className="mt-3 text-sm text-red-600 dark:text-red-400 text-center"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <div className="mt-6">
          <ClientSignupForm action={signUpAction} />
        </div>

        <p className="mt-6 text-sm text-center text-black/60 dark:text-white/60">
          Already have an account?{" "}
          <a className="underline hover:text-blue-600" href="/login">
            Log in
          </a>
        </p>
      </div>
      <Footer />
    </>
  );
}
