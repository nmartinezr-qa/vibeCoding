"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Recipe } from "../../src/types/database.types";
import Footer from "../components/footer";
import MainHeader from "../components/mainHeader";

interface RecipeCardProps {
  id: string;
  title: string;
  category: string | null;
  image?: string | null;
}

function toDirectImageUrl(url?: string | null) {
  if (!url) return null;
  const m = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  return m?.[1] ? `https://drive.google.com/uc?export=view&id=${m[1]}` : url;
}

function RecipeCard({ id, title, category, image }: RecipeCardProps) {
  return (
    <Link href={`/dashboard/recipe/${id}`}>
      <article className="group rounded-xl border border-black/[.06] dark:border-white/[.08] overflow-hidden bg-white/70 dark:bg-black/30 backdrop-blur-md hover:shadow-lg hover:border-black/[.12] dark:hover:border-white/[.18] transition-all duration-300 cursor-pointer">
        <div className="relative aspect-[4/3] bg-gradient-to-br from-gray-100 via-white to-gray-50 dark:from-gray-900 dark:via-black dark:to-gray-800">
          <Image
            src={toDirectImageUrl(image) || "/vercel.svg"}
            alt={title}
            fill
            className="object-contain p-6 transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </div>
        <div className="p-4 flex flex-col gap-1">
          <h3 className="text-base font-medium tracking-tight text-gray-900 dark:text-white">
            {title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {category ?? "Uncategorized"}
          </p>
        </div>
      </article>
    </Link>
  );
}

export default function DashboardClient({
  user,
  recipes,
  error,
  activeCategory,
}: {
  user: { email?: string };
  recipes: Pick<Recipe, "title" | "category" | "id" | "image_url">[];
  error: { message?: string } | null;
  activeCategory?: string;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const searchParams = useSearchParams();
  const isMyRecipesActive = searchParams.get("my-recipes") === "true";

  const filteredRecipes = useMemo(() => {
    if (!recipes) return [];
    let filtered = recipes;

    if (activeCategory && activeCategory !== "All") {
      filtered = filtered.filter(
        (recipe) =>
          recipe.category?.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(
        (recipe) =>
          recipe.title?.toLowerCase().includes(query) ||
          recipe.category?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [recipes, activeCategory, searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="font-sans min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900 transition-colors">
      {/* Header */}
      <MainHeader fixed />

      {/* Main */}
      <main className="mx-auto max-w-6xl px-6 pt-[4rem] pb-16">
        {/* Hero */}
        <section className="sm:text-left mb-10 border-b border-black/5 dark:border-white/10 pb-8">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900 dark:text-white">
            Share and discover <span className="text-primary">recipes</span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
            Your digital cookbook — upload your favorite dishes, explore
            culinary ideas, and inspire others to cook with passion.
          </p>

          {/* Search + Button Row */}
          <form
            onSubmit={handleSearchSubmit}
            className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 w-full sm:w-auto flex-1 sm:max-w-[60%]">
              <input
                id="search"
                type="search"
                placeholder="Search by recipe or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 rounded-full px-5 text-sm bg-white dark:bg-black/30 border border-black/[.08] dark:border-white/[.1] focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20 transition-all"
              />
              <button
                type="submit"
                className="h-11 px-6 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 transition-all"
              >
                Search
              </button>
            </div>

            {/* Add New Recipe button */}
            <a
              href="/dashboard/add"
              className="inline-flex items-center justify-center h-11 px-6 rounded-full bg-black text-white dark:bg-white dark:text-black text-sm font-medium hover:opacity-90 transition-all shadow-md hover:shadow-lg whitespace-nowrap"
            >
              + Add New Recipe
            </a>
          </form>
        </section>

        {/* Categories */}
        <section id="categories" className="mb-10">
          <ul className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {[
              {
                label: "All",
                href: "/dashboard",
                active:
                  (activeCategory ?? "All") === "All" && !isMyRecipesActive,
              },
              {
                label: "My Recipes",
                href: "/dashboard?my-recipes=true",
                active: isMyRecipesActive,
              },
              ...["Appetizers", "Main", "Desserts", "Breakfast", "Snack"].map(
                (c) => ({
                  label: c,
                  href: `/dashboard?category=${encodeURIComponent(c)}`,
                  active: (activeCategory ?? "All") === c,
                })
              ),
            ].map(({ label, href, active }) => (
              <li key={label}>
                <a
                  href={href}
                  className={`px-4 h-9 rounded-full text-xs inline-flex items-center justify-center font-medium transition-all ${
                    active
                      ? "bg-foreground text-background shadow-sm"
                      : "border border-black/[.08] dark:border-white/[.145] text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* Recipes */}
        <section id="recipes">
          {error ? (
            <p className="text-sm text-red-600 dark:text-red-400">
              Failed to load recipes.
            </p>
          ) : !recipes || recipes.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No recipes yet. Be the first to share your creation!
            </p>
          ) : filteredRecipes.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No recipes match your search or filters.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredRecipes.map((r) => (
                <RecipeCard
                  key={r.id}
                  id={r.id}
                  title={r.title ?? "Untitled"}
                  category={r.category}
                  image={r.image_url}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
