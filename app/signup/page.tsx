import { getServerSupabase } from "@/src/lib/supabase/server";
import ClientSignupForm from "./ClientSignupForm";
import Header from "../components/header";
import Footer from "../components/footer";

export const dynamic = "force-dynamic";

async function signUpAction(formData: FormData) {
  "use server";
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "").trim();
  const fullname = String(formData.get("fullname") || "").trim();
  const username = String(formData.get("username") || "").trim();

  const supabase = await getServerSupabase();

  const { data: existing } = await supabase
    .from("profile")
    .select("id")
    .eq("username", username)
    .limit(1)
    .maybeSingle();

  if (existing) return { usernameTaken: true };

  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error || !data.user) return { signUpError: error?.message || "Failed" };

  await supabase.from("profile").upsert({
    id: data.user.id,
    fullname,
    username,
  });

  return { success: true };
}

export default async function SignupPage() {
  return (
    <>
      <Header />
      <div className="mx-auto max-w-md px-6 pt-20">
        <h1 className="text-2xl font-semibold text-center">Sign up</h1>
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
