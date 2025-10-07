"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/src/lib/supabase/client";
import MainHeader from "../../components/mainHeader";
import Footer from "../../components/footer";
import RecipeForm from "../../components/recipeForm";

interface RecipeFormData {
  title: string;
  description: string;
  ingredients: string;
  cooking_time: number;
  difficulty: string;
  category: string;
  instructions: string[];
  image_url: string;
}

export default function AddRecipe() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const supabase = getBrowserSupabase();

  const handleRecipeSubmit = async (formData: RecipeFormData) => {
    setIsSubmitting(true);

    try {
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("You must be logged in to add a recipe");
        router.push("/login");
        return;
      }

      // Filter out empty instructions
      const filteredInstructions = formData.instructions.filter(
        (instruction: string) => instruction.trim()
      );

      // Prepare recipe data
      const recipeData = {
        user_id: user.id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        ingredients: formData.ingredients.trim(),
        coocking_time: formData.cooking_time,
        difficulty: [formData.difficulty], // Convert single string to array for database
        category: formData.category,
        instructions: filteredInstructions,
        image_url: formData.image_url.trim() || null,
      };

      // Insert recipe into database
      const { data, error } = await supabase
        .from("recipe")
        .insert([recipeData])
        .select();

      if (error) {
        console.error("Error creating recipe:", error);
        const errorMessage =
          error.message ||
          error.details ||
          error.hint ||
          "Unknown error occurred";
        alert("Failed to create recipe: " + errorMessage);
        return;
      }

      console.log("Recipe created successfully:", data);

      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="font-sans min-h-screen">
      {/* Header */}
      <MainHeader fixed />

      {/* Back to Dashboard Button - Top Left */}
      <div className="fixed top-20 left-6 z-40">
        <button
          onClick={() => router.push("/dashboard")}
          className="inline-flex items-center gap-2 text-sm text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white transition-colors bg-white/80 dark:bg-black/20 backdrop-blur-sm px-3 py-2 rounded-lg border border-black/10 dark:border-white/20"
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

      {/* Main content */}
      <main className="mx-auto max-w-4xl px-6 py-10 sm:py-14 pt-[4rem]">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">
            Add New Recipe
          </h1>
          <p className="text-sm text-black/70 dark:text-white/70">
            Share your favorite recipe with the community
          </p>
        </div>

        <RecipeForm
          onSubmit={handleRecipeSubmit}
          submitButtonText="Create Recipe"
          isSubmitting={isSubmitting}
        />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
