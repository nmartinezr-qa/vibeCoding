import { redirect } from "next/navigation";
import { getServerSupabase } from "@/src/lib/supabase/server";
import type { Recipe } from "../../src/types/database.types";
import DashboardClient from "./dashboard-client";

export default async function DashboardContent(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const sp = await props.searchParams;
  const activeCategory =
    typeof sp.category === "string" ? sp.category : undefined;

  // Fetch recipes from Supabase with optional category filtering
  let query = supabase
    .from("recipe")
    .select("id,title,category,image_url,created_at");

  if (activeCategory && activeCategory !== "All") {
    query = query.eq("category", activeCategory);
  }

  const { data: recipes, error } = await query
    .order("created_at", { ascending: false })
    .limit(12);

  return (
    <DashboardClient
      user={user}
      recipes={recipes || []}
      error={error}
      activeCategory={activeCategory}
    />
  );
}
