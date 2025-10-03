import { redirect } from "next/navigation";
import { getServerSupabase } from "@/src/lib/supabase/server";
import HomePublic from "./homePublic";

export default async function Home() {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return <HomePublic />;
}
