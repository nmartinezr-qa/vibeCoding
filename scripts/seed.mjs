import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import path from "node:path";

// Load env from .env.local if present
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY; // SERVER-ONLY

if (!url || !serviceRole) {
  console.error(
    "Missing env: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
  );
  process.exit(1);
}

// Validate the provided key is a service role key by inspecting the JWT payload
function getJwtRole(jwt) {
  try {
    const payload = jwt.split(".")[1];
    const decoded = JSON.parse(
      Buffer.from(
        payload.replace(/-/g, "+").replace(/_/g, "/"),
        "base64"
      ).toString("utf8")
    );
    return decoded?.role || decoded?.app_metadata?.role || null;
  } catch {
    return null;
  }
}

const role = getJwtRole(serviceRole);
if (role !== "service_role") {
  console.error(
    "The key in SUPABASE_SERVICE_ROLE_KEY is not a service role key. Role detected:",
    role
  );
  console.error(
    "Go to Supabase → Project Settings → API and copy the Service role secret."
  );
  process.exit(1);
}

const supabase = createClient(url, serviceRole);

const SEED_EMAIL = process.env.SEED_EMAIL || "jane@example.com";
const SEED_PASSWORD = process.env.SEED_PASSWORD || "StrongPass!123";

async function main() {
  // 1) Create user (email confirmed) or reuse if exists
  let userId;
  const { data: created, error: createErr } =
    await supabase.auth.admin.createUser({
      email: SEED_EMAIL,
      password: SEED_PASSWORD,
      email_confirm: true,
    });
  if (createErr && createErr.code === "email_exists") {
    const existing = await supabase.auth.admin.listUsers({ email: SEED_EMAIL });
    const u = existing?.data?.users?.[0];
    if (!u) throw createErr;
    userId = u.id;
  } else if (createErr || !created?.user) {
    throw createErr;
  } else {
    userId = created.user.id;
  }

  // 2) Upsert profile
  const { error: profileErr } = await supabase.from("profile").upsert({
    id: userId,
    username: "chefjane",
    fullname: "Jane Doe",
  });
  if (profileErr) throw profileErr;

  // 3) Insert recipes (retry without optional columns if schema lacks them)
  const fullRows = [
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
  ];

  let { error: recipeErr } = await supabase.from("recipe").insert(fullRows);
  if (recipeErr && recipeErr.code === "PGRST204") {
    console.warn(
      "Schema appears to be missing some columns (e.g., difficulty/instructions). Retrying with minimal columns..."
    );
    const minimalRows = fullRows.map(
      ({ difficulty, instructions, ...rest }) => rest
    );
    const retry = await supabase.from("recipe").insert(minimalRows);
    if (retry.error) throw retry.error;
  } else if (recipeErr) {
    throw recipeErr;
  }

  console.log("Seed complete:", userId);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
