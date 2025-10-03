"use client";

import { useState } from "react";
import Image from "next/image";
import type { Recipe } from "../../src/types/database.types";
import Footer from "../components/footer";
import Sidebar from "../components/sidebar";
import MainHeader from "../components/mainHeader";

interface RecipeCardProps {
  title: string;
  category: string | null;
  image?: string | null;
}

function toDirectImageUrl(url?: string | null) {
  if (!url) return null;
  const m = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (m?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${m[1]}`;
  }
  return url;
}

function RecipeCard({ title, category, image }: RecipeCardProps) {
  return (
    <article className="group rounded-xl border border-black/[.08] dark:border-white/[.145] overflow-hidden bg-white/60 dark:bg-black/20 backdrop-blur">
      <div className="relative aspect-[4/3] bg-[#f2f2f2] dark:bg-[#111]">
        <Image
          src={toDirectImageUrl(image) || "/vercel.svg"}
          alt={title}
          fill
          className="object-contain p-6"
        />
      </div>
      <div className="p-4 flex flex-col gap-1">
        <h3 className="text-sm font-semibold tracking-[-0.01em]">{title}</h3>
        <p className="text-xs text-black/60 dark:text-white/60">
          {category ?? "Uncategorized"}
        </p>
      </div>
    </article>
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
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="font-sans min-h-screen flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main content */}
      <div className="flex-1 transition-all duration-300">
        {/* Header con offset */}
        <MainHeader offsetLeft={sidebarOpen ? "18rem" : "6rem"} fixed />

        {/* Main */}
        <main className="mx-auto max-w-6xl px-6 py-10 sm:py-14 pt-20">
          {/* Hero */}
          <section
            aria-labelledby="hero-heading"
            className="text-center sm:text-left"
          >
            <h1
              id="hero-heading"
              className="text-3xl sm:text-4xl font-semibold tracking-tight"
            >
              Share and discover delicious recipes
            </h1>
            <p className="mt-2 text-sm text-black/70 dark:text-white/70 max-w-2xl mx-auto sm:mx-0">
              A simple place to upload your favorite dishes and explore new
              ideas from the community.
            </p>

            {/* Search */}
            <form className="mt-6" role="search" aria-label="Search recipes">
              <div className="flex items-center gap-2">
                <label htmlFor="search" className="sr-only">
                  Search recipes
                </label>
                <input
                  id="search"
                  name="search"
                  type="search"
                  placeholder="Search recipes, ingredients..."
                  className="w-full sm:w-[480px] h-11 rounded-full px-4 text-sm bg-white dark:bg-black/30 border border-black/[.08] dark:border-white/[.145] outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
                />
                <button
                  type="submit"
                  className="h-11 px-4 rounded-full text-sm font-medium bg-foreground text-background hover:opacity-90"
                  aria-label="Search"
                >
                  Search
                </button>
              </div>
            </form>
          </section>

          {/* CTA */}
          <div className="mt-4">
            <a
              href="/share"
              className="inline-flex items-center justify-center h-11 px-5 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90"
            >
              Start sharing
            </a>
          </div>

          {/* Categories */}
          <section
            id="categories"
            aria-label="Recipe categories"
            className="mt-8"
          >
            <ul className="flex flex-wrap gap-2">
              {[
                "All",
                "Appetizers",
                "Main",
                "Desserts",
                "Breakfast",
                "Snack",
              ].map((c) => {
                const isActive = (activeCategory ?? "All") === c;
                const href =
                  c === "All"
                    ? "/dashboard"
                    : `/dashboard?category=${encodeURIComponent(c)}`;
                return (
                  <li key={c}>
                    <a
                      href={href}
                      aria-current={isActive ? "page" : undefined}
                      className={
                        `px-3 h-8 rounded-full text-xs inline-flex items-center justify-center font-medium ` +
                        (isActive
                          ? `bg-foreground text-background border border-transparent shadow-sm`
                          : `border border-black/[.08] dark:border-white/[.145] text-black/80 dark:text-white/80 hover:bg-[#f2f2f2] dark:hover:bg-[#111]`)
                      }
                    >
                      {c}
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* Grid */}
          <section
            id="recipes"
            aria-labelledby="recipes-heading"
            className="mt-8"
          >
            <h2 id="recipes-heading" className="sr-only">
              Recipes
            </h2>
            {error ? (
              <p className="text-sm text-red-600 dark:text-red-400">
                Failed to load recipes.
              </p>
            ) : !recipes || recipes.length === 0 ? (
              <p className="text-sm text-black/60 dark:text-white/60">
                No recipes yet. Be the first to share!
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {recipes.map(
                  (
                    r: Pick<Recipe, "title" | "category" | "id" | "image_url">
                  ) => (
                    <RecipeCard
                      key={r.id}
                      title={r.title ?? "Untitled"}
                      category={r.category}
                      image={r.image_url}
                    />
                  )
                )}
              </div>
            )}
          </section>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
