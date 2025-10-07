"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/src/lib/supabase/client";
import MainHeader from "../../../components/mainHeader";
import Sidebar from "../../../components/sidebar";
import Footer from "../../../components/footer";
import RecipeForm from "../../../components/recipeForm";

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

export default function EditRecipe() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();
  const supabase = getBrowserSupabase();

  useEffect(() => {
    const fetchRecipe = async () => {
      const recipeId = Array.isArray(params.id) ? params.id[0] : params.id;
      if (!recipeId) return;

      try {
        setLoading(true);
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

    fetchRecipe();
  }, [params.id, supabase]);

  const handleRecipeSubmit = async (formData: RecipeFormData) => {
    if (!recipe) return;

    setIsSubmitting(true);

    try {
      // Get current user to check permissions
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("You must be logged in to edit recipes");
        router.push("/login");
        return;
      }

      console.log("Current user ID:", user.id);
      console.log("Recipe owner ID:", recipe.user_id);

      // Check if user owns the recipe
      if (recipe.user_id !== user.id) {
        alert("You can only edit recipes that you created");
        return;
      }

      // Filter out empty instructions
      const filteredInstructions = formData.instructions.filter(
        (instruction: string) => instruction.trim()
      );

      // Prepare recipe data for update
      const recipeData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        ingredients: formData.ingredients.trim(),
        coocking_time: formData.cooking_time,
        difficulty: [formData.difficulty], // Convert single string to array for database
        category: formData.category,
        instructions: filteredInstructions,
        image_url: formData.image_url.trim() || null,
      };

      console.log("Updating recipe with ID:", recipe.id);
      console.log("Update data:", recipeData);

      // Try the update - first check if recipe exists and user owns it
      console.log("Checking recipe ownership...");
      const { data: existingRecipe, error: checkError } = await supabase
        .from("recipe")
        .select("id, user_id")
        .eq("id", recipe.id)
        .eq("user_id", user.id)
        .single();

      if (checkError || !existingRecipe) {
        console.error("Recipe not found or access denied:", checkError);
        alert("Recipe not found or you don't have permission to edit it");
        return;
      }

      console.log("Recipe ownership verified, proceeding with update...");

      // Now update the recipe
      const { data, error } = await supabase
        .from("recipe")
        .update(recipeData)
        .eq("id", recipe.id)
        .eq("user_id", user.id)
        .select()
        .single();

      console.log("Update result:", { data, error });

      if (error) {
        console.error("Supabase error:", error);
        console.error("Error type:", typeof error);
        console.error("Error keys:", Object.keys(error || {}));

        const errorMessage =
          error.message ||
          error.details ||
          error.hint ||
          "Unknown database error";
        alert("Failed to update recipe: " + errorMessage);
        return;
      }

      if (!data) {
        alert("No data returned from update operation");
        return;
      }

      console.log("Recipe updated successfully:", data);

      // Redirect to recipe detail page
      router.push(`/dashboard/recipe/${recipe.id}`);
    } catch (error) {
      console.error("Unexpected error:", error);
      console.error("Error type:", typeof error);
      console.error(
        "Error message:",
        error instanceof Error ? error.message : error
      );
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="font-sans min-h-screen flex">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="flex-1 transition-all duration-300">
          <MainHeader offsetLeft={sidebarOpen ? "18rem" : "6rem"} fixed />
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
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="font-sans min-h-screen flex">
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <div className="flex-1 transition-all duration-300">
          <MainHeader offsetLeft={sidebarOpen ? "18rem" : "6rem"} fixed />
          <main className="mx-auto max-w-4xl px-6 py-10 sm:py-14 pt-[4rem]">
            <div className="text-center min-h-[400px] flex items-center justify-center">
              <div>
                <h1 className="text-2xl font-semibold mb-2">
                  Recipe Not Found
                </h1>
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
      </div>
    );
  }

  // Convert recipe data for form initialization
  const initialFormData: Partial<RecipeFormData> = {
    title: recipe.title || "",
    description: recipe.description || "",
    ingredients: recipe.ingredients || "",
    cooking_time: recipe.coocking_time || 0,
    difficulty:
      recipe.difficulty && recipe.difficulty.length > 0
        ? recipe.difficulty[0]
        : "",
    category: recipe.category || "",
    instructions:
      recipe.instructions && recipe.instructions.length > 0
        ? recipe.instructions
        : [""],
    image_url: recipe.image_url || "",
  };

  return (
    <div className="font-sans min-h-screen flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main content */}
      <div className="flex-1 transition-all duration-300">
        {/* Header */}
        <MainHeader offsetLeft={sidebarOpen ? "18rem" : "6rem"} fixed />

        {/* Main */}
        <main className="mx-auto max-w-4xl px-6 py-10 sm:py-14 pt-[4rem]">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight mb-2">
              Edit Recipe
            </h1>
            <p className="text-sm text-black/70 dark:text-white/70">
              Make changes to your recipe
            </p>
          </div>

          <RecipeForm
            initialData={initialFormData}
            onSubmit={handleRecipeSubmit}
            submitButtonText="Update Recipe"
            isSubmitting={isSubmitting}
            cancelHref={`/dashboard/recipe/${recipe.id}`}
          />
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
