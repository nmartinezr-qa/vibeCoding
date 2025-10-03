import { getServerSupabase } from "@/src/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import ClientSignupForm from "./ClientSignupForm";
import Header from "../components/loginHeader";
import Footer from "../components/footer";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function SignupPage() {
  async function signUpAction(formData: FormData) {
    "use server";

    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();
    const fullname = String(formData.get("fullname") || "").trim();
    const username = String(formData.get("username") || "").trim();

    const supabase = await getServerSupabase();
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error || !data.user) {
      console.error("Signup failed:", error);
      return;
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error: profileError } = await supabaseAdmin.from("profile").upsert({
      id: data.user.id,
      fullname,
      username,
      email,
      password,
    });

    if (profileError) {
      console.error("Profile creation failed:", profileError);
      return;
    }

    redirect("/signup/success");
  }

  return (
    <>
      <Header />
      <div className="mx-auto max-w-md px-6 pt-20">
        <h1 className="text-2xl font-semibold text-center">Sign up</h1>
        <div className="mt-6">
          <ClientSignupForm action={signUpAction} />
        </div>
      </div>
      <Footer />
    </>
  );
}
