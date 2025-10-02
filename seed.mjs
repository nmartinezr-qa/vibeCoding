// seed.ts
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server-only

const supabase = createClient(url, serviceRole);

async function main() {
  // 1) Create user (email confirmed)
  const { data: created, error: createErr } =
    await supabase.auth.admin.createUser({
      email: "jane@example.com",
      password: "StrongPass!123",
      email_confirm: true,
    });
  if (createErr || !created.user) throw createErr;

  const userId = created.user.id;

  // 2) Upsert profile
  await supabase.from("profile").upsert({
    id: userId,
    username: "chefjane",
    fullname: "Jane Doe",
  });

  // 3) Insert recipes
  await supabase.from("recipe").insert([
    {
      user_id: userId,
      title: "Classic Pancakes",
      description: "Fluffy pancakes perfect for breakfast.",
      ingredients: "flour\nmilk\neggs\nsugar\nbaking powder\nsalt",
      coocking_time: 20,
      difficulty: ["easy"],
      category: "Breakfast",
      instructions: [
        "Mix dry ingredients",
        "Add wet ingredients",
        "Cook on a hot greased pan",
      ],
    },
    {
      user_id: userId,
      title: "Creamy Carbonara",
      description: "Traditional pasta with eggs, cheese, and cured pork.",
      ingredients:
        "spaghetti\neggs\nguanciale or pancetta\npecorino romano\nblack pepper",
      coocking_time: 25,
      difficulty: ["medium"],
      category: "Main",
      instructions: [
        "Boil pasta",
        "Render guanciale",
        "Temper eggs with pasta water",
        "Combine off-heat and serve",
      ],
    },
  ]);

  console.log("Seed complete:", userId);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
