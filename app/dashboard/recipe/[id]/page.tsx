"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import type { User } from "@supabase/supabase-js";
import { getBrowserSupabase } from "@/src/lib/supabase/client";
import { useToast } from "@/src/contexts/ToastContext";
import { useDialog } from "@/src/contexts/DialogContext";
import MainHeader from "../../../components/mainHeader";
import Footer from "../../../components/footer";

interface Recipe {
  id: string;
  title: string | null;
  description: string | null;
  ingredients: string | null;
  coocking_time: number | null;
  difficulty: string[] | null;
  category: string | null;
  instructions: string[] | null;
  image_url: string | null;
  created_at: string;
  user_id: string | null;
}

function toDirectImageUrl(url?: string | null) {
  if (!url) return null;
  const m = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (m?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${m[1]}`;
  }
  return url;
}

export default function RecipeDetail() {
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const params = useParams();
  const router = useRouter();
  const supabase = getBrowserSupabase();
  const { addToast } = useToast();
  const { showDialog } = useDialog();

  useEffect(() => {
    const fetchRecipeAndUser = async () => {
      const recipeId = Array.isArray(params.id) ? params.id[0] : params.id;
      if (!recipeId) return;

      try {
        setLoading(true);

        // Fetch current user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (user) {
          setCurrentUser(user);
        }

        // Fetch recipe
        const { data, error } = await supabase
          .from("recipe")
          .select("*")
          .eq("id", recipeId)
          .single();

        if (error) {
          console.error("Error fetching recipe:", error);
          setError("Recipe not found");
          return;
        }

        setRecipe(data as Recipe);
      } catch (error) {
        console.error("Unexpected error:", error);
        setError("Failed to load recipe");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeAndUser();
  }, [params.id, supabase]);

  const handleDeleteRecipe = async () => {
    if (!recipe || !currentUser) return;

    // Show custom confirmation dialog
    showDialog({
      type: "confirm",
      variant: "danger",
      title: "Delete Recipe",
      message: `Are you sure you want to delete "${
        recipe.title || "this recipe"
      }"? This action cannot be undone.`,
      confirmText: "Delete Recipe",
      cancelText: "Keep Recipe",
      onConfirm: async () => {
        setIsDeleting(true);

        try {
          // Delete the recipe from Supabase
          const { error } = await supabase
            .from("recipe")
            .delete()
            .eq("id", recipe.id)
            .eq("user_id", currentUser.id);

          if (error) {
            console.error("Error deleting recipe:", error);
            addToast({
              type: "error",
              title: "Delete Failed",
              message: `Failed to delete recipe: ${error.message}`,
              persistent: true,
            });
            return;
          }

          // Success - show toast and redirect
          addToast({
            type: "success",
            title: "Recipe Deleted",
            message: `"${
              recipe.title || "Recipe"
            }" has been successfully deleted.`,
          });

          // Redirect to dashboard after a short delay
          setTimeout(() => {
            router.push("/dashboard");
          }, 1500);
        } catch (error) {
          console.error("Unexpected error during deletion:", error);
          addToast({
            type: "error",
            title: "Delete Failed",
            message: "An unexpected error occurred while deleting the recipe.",
            persistent: true,
          });
        } finally {
          setIsDeleting(false);
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="font-sans min-h-screen">
        <MainHeader fixed />
        <main className="mx-auto max-w-4xl px-6 py-10 sm:py-14 pt-[4rem]">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-foreground mx-auto mb-4"></div>
              <p className="text-sm text-black/60 dark:text-white/60">
                Loading recipe...
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="font-sans min-h-screen">
        <MainHeader fixed />
        <main className="mx-auto max-w-4xl px-6 py-10 sm:py-14 pt-[4rem]">
          <div className="text-center min-h-[400px] flex items-center justify-center">
            <div>
              <h1 className="text-2xl font-semibold mb-2">Recipe Not Found</h1>
              <p className="text-sm text-black/60 dark:text-white/60 mb-6">
                {error || "The recipe you're looking for doesn't exist."}
              </p>
              <button
                onClick={() => router.push("/dashboard")}
                className="h-11 px-6 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="font-sans min-h-screen">
      <MainHeader fixed />

      <main className="mx-auto max-w-4xl px-6 py-10 sm:py-14 pt-[4rem]">
        <article className="bg-white/60 dark:bg-black/20 backdrop-blur rounded-xl border border-black/[.08] dark:border-white/[.145] overflow-hidden">
          {/* Back to Dashboard Button */}
          <div className="p-6 sm:p-8 pb-4">
            <button
              onClick={() => router.push("/dashboard")}
              className="inline-flex items-center gap-2 text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Dashboard
            </button>
          </div>

          {/* Recipe Image */}
          {recipe.image_url && (
            <div className="relative aspect-[16/9] bg-[#f2f2f2] dark:bg-[#111]">
              <Image
                src={toDirectImageUrl(recipe.image_url) || "/vercel.svg"}
                alt={recipe.title || "Recipe image"}
                fill
                className="object-cover"
              />
            </div>
          )}

          <div className="p-6 sm:p-8">
            {/* Recipe Header */}
            <header className="mb-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-2">
                    {recipe.title || "Untitled Recipe"}
                  </h1>
                  {recipe.description && (
                    <p className="text-lg text-black/70 dark:text-white/70 leading-relaxed">
                      {recipe.description}
                    </p>
                  )}
                </div>

                {/* Recipe Meta */}
                <div className="flex flex-wrap gap-4 text-sm">
                  {recipe.category && (
                    <div className="px-3 py-1 rounded-full bg-black/10 dark:bg-white/10 text-black/80 dark:text-white/80">
                      {recipe.category}
                    </div>
                  )}
                  {recipe.coocking_time && (
                    <div className="px-3 py-1 rounded-full bg-black/10 dark:bg-white/10 text-black/80 dark:text-white/80">
                      ⏱️ {recipe.coocking_time} min
                    </div>
                  )}
                </div>
              </div>

              {/* Difficulty Tag */}
              {recipe.difficulty && recipe.difficulty.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-foreground/10 text-foreground">
                    {recipe.difficulty[0]}{" "}
                    {/* Show first (and only) difficulty level */}
                  </span>
                </div>
              )}
            </header>

            {/* Ingredients */}
            {recipe.ingredients && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
                <div className="bg-black/5 dark:bg-white/5 rounded-lg p-4">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                    {recipe.ingredients}
                  </pre>
                </div>
              </section>
            )}

            {/* Instructions */}
            {recipe.instructions && recipe.instructions.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Instructions</h2>
                <div className="space-y-4">
                  {recipe.instructions.map((instruction, index) => (
                    <div
                      key={index}
                      className="flex gap-4 bg-black/5 dark:bg-white/5 rounded-lg p-4"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-foreground text-background text-sm font-medium flex items-center justify-center">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed">{instruction}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Recipe Footer */}
            <footer className="pt-6 border-t border-black/10 dark:border-white/10">
              <div className="flex items-center justify-between text-xs text-black/50 dark:text-white/50">
                <span>
                  Created: {new Date(recipe.created_at).toLocaleDateString()}
                </span>
                {/* Only show edit/delete buttons if user owns the recipe */}
                {currentUser && recipe.user_id === currentUser.id && (
                  <div className="flex gap-4">
                    <button
                      onClick={() =>
                        router.push(`/dashboard/edit/${recipe.id}`)
                      }
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Edit Recipe
                    </button>
                    <button
                      onClick={handleDeleteRecipe}
                      disabled={isDeleting}
                      className={`${
                        isDeleting
                          ? "text-red-400 cursor-not-allowed"
                          : "text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      } transition-colors`}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                )}
              </div>
            </footer>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
