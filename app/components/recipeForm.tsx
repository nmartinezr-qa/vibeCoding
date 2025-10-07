"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getBrowserSupabase } from "@/src/lib/supabase/client";
import { useToast } from "@/src/contexts/ToastContext";

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

interface FormErrors {
  title?: string;
  description?: string;
  ingredients?: string;
  cooking_time?: string;
  difficulty?: string;
  category?: string;
  instructions?: string;
  image_url?: string;
}

interface RecipeFormProps {
  initialData?: Partial<RecipeFormData>;
  onSubmit: (data: RecipeFormData) => Promise<void>;
  submitButtonText: string;
  isSubmitting?: boolean;
  cancelHref?: string;
}

const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"];
const CATEGORY_OPTIONS = [
  "Appetizers",
  "Main",
  "Desserts",
  "Breakfast",
  "Snack",
];

export default function RecipeForm({
  initialData,
  onSubmit,
  submitButtonText,
  isSubmitting = false,
  cancelHref,
}: RecipeFormProps) {
  const [formData, setFormData] = useState<RecipeFormData>({
    title: "",
    description: "",
    ingredients: "",
    cooking_time: 0,
    difficulty: "",
    category: "",
    instructions: [""],
    image_url: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const router = useRouter();
  const { addToast } = useToast();

  // Initialize form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        description: initialData.description || "",
        ingredients: initialData.ingredients || "",
        cooking_time: initialData.cooking_time || 0,
        difficulty: initialData.difficulty || "",
        category: initialData.category || "",
        instructions:
          initialData.instructions && initialData.instructions.length > 0
            ? initialData.instructions
            : [""],
        image_url: initialData.image_url || "",
      });
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.ingredients.trim())
      newErrors.ingredients = "Ingredients are required";
    if (!formData.cooking_time || formData.cooking_time <= 0) {
      newErrors.cooking_time = "Cooking time must be greater than 0";
    }
    if (!formData.difficulty)
      newErrors.difficulty = "Please select a difficulty level";
    if (!formData.category) newErrors.category = "Category is required";
    if (
      formData.instructions.filter((instruction) => instruction.trim())
        .length === 0
    ) {
      newErrors.instructions = "At least one instruction is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    field: keyof RecipeFormData,
    value: string | number | string[]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = [...formData.instructions];
    newInstructions[index] = value;
    handleInputChange("instructions", newInstructions);
  };

  const addInstruction = () => {
    handleInputChange("instructions", [...formData.instructions, ""]);
  };

  const removeInstruction = (index: number) => {
    if (formData.instructions.length > 1) {
      const newInstructions = formData.instructions.filter(
        (_, i) => i !== index
      );
      handleInputChange("instructions", newInstructions);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Recipe Title *
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange("title", e.target.value)}
          className={`w-full h-11 rounded-lg px-4 text-sm bg-white dark:bg-black/30 border ${
            errors.title
              ? "border-red-500"
              : "border-black/[.08] dark:border-white/[.145]"
          } outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20`}
          placeholder="Enter recipe title"
        />
        {errors.title && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
            {errors.title}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          Description *
        </label>
        <textarea
          id="description"
          rows={3}
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          className={`w-full rounded-lg px-4 py-3 text-sm bg-white dark:bg-black/30 border ${
            errors.description
              ? "border-red-500"
              : "border-black/[.08] dark:border-white/[.145]"
          } outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20`}
          placeholder="Describe your recipe"
        />
        {errors.description && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
            {errors.description}
          </p>
        )}
      </div>

      {/* Category and Cooking Time */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-2">
            Category *
          </label>
          <div className="relative">
            <select
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className={`w-full h-11 rounded-lg px-4 pr-10 text-sm bg-white dark:bg-black/30 border backdrop-blur-sm transition-all duration-200 ${
                errors.category
                  ? "border-red-500 focus:ring-red-500/20"
                  : "border-black/[.08] dark:border-white/[.145] hover:border-black/20 dark:hover:border-white/30 focus:border-black/30 dark:focus:border-white/40"
              } outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20 appearance-none cursor-pointer`}
            >
              <option
                value=""
                disabled
                className="text-black/50 dark:text-white/50"
              >
                Select category
              </option>
              {CATEGORY_OPTIONS.map((category) => (
                <option
                  key={category}
                  value={category}
                  className="bg-white dark:bg-black text-black dark:text-white"
                >
                  {category}
                </option>
              ))}
            </select>
            {/* Custom dropdown arrow */}
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 text-black/60 dark:text-white/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          {errors.category && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              {errors.category}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="cooking_time"
            className="block text-sm font-medium mb-2"
          >
            Cooking Time (minutes) *
          </label>
          <input
            type="number"
            id="cooking_time"
            min="1"
            value={formData.cooking_time || ""}
            onChange={(e) =>
              handleInputChange("cooking_time", parseInt(e.target.value) || 0)
            }
            className={`w-full h-11 rounded-lg px-4 text-sm bg-white dark:bg-black/30 border ${
              errors.cooking_time
                ? "border-red-500"
                : "border-black/[.08] dark:border-white/[.145]"
            } outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20`}
            placeholder="30"
          />
          {errors.cooking_time && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              {errors.cooking_time}
            </p>
          )}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <label htmlFor="difficulty" className="block text-sm font-medium mb-2">
          Difficulty Level *
        </label>
        <div className="relative">
          <select
            id="difficulty"
            value={formData.difficulty}
            onChange={(e) => handleInputChange("difficulty", e.target.value)}
            className={`w-full h-11 rounded-lg px-4 pr-10 text-sm bg-white dark:bg-black/30 border backdrop-blur-sm transition-all duration-200 ${
              errors.difficulty
                ? "border-red-500 focus:ring-red-500/20"
                : "border-black/[.08] dark:border-white/[.145] hover:border-black/20 dark:hover:border-white/30 focus:border-black/30 dark:focus:border-white/40"
            } outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20 appearance-none cursor-pointer`}
          >
            <option
              value=""
              disabled
              className="text-black/50 dark:text-white/50"
            >
              Select difficulty
            </option>
            {DIFFICULTY_OPTIONS.map((difficulty) => (
              <option
                key={difficulty}
                value={difficulty}
                className="bg-white dark:bg-black text-black dark:text-white"
              >
                {difficulty}
              </option>
            ))}
          </select>
          {/* Custom dropdown arrow */}
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg
              className="w-4 h-4 text-black/60 dark:text-white/60"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
        {errors.difficulty && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
            {errors.difficulty}
          </p>
        )}
      </div>

      {/* Ingredients */}
      <div>
        <label htmlFor="ingredients" className="block text-sm font-medium mb-2">
          Ingredients *
        </label>
        <textarea
          id="ingredients"
          rows={4}
          value={formData.ingredients}
          onChange={(e) => handleInputChange("ingredients", e.target.value)}
          className={`w-full rounded-lg px-4 py-3 text-sm bg-white dark:bg-black/30 border ${
            errors.ingredients
              ? "border-red-500"
              : "border-black/[.08] dark:border-white/[.145]"
          } outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20`}
          placeholder="List all ingredients, one per line"
        />
        {errors.ingredients && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
            {errors.ingredients}
          </p>
        )}
      </div>

      {/* Instructions */}
      <div>
        <label className="block text-sm font-medium mb-2">Instructions *</label>
        {formData.instructions.map((instruction, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <div className="flex-1">
              <textarea
                value={instruction}
                onChange={(e) => handleInstructionChange(index, e.target.value)}
                className={`w-full rounded-lg px-4 py-3 text-sm bg-white dark:bg-black/30 border ${
                  errors.instructions
                    ? "border-red-500"
                    : "border-black/[.08] dark:border-white/[.145]"
                } outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20`}
                placeholder={`Step ${index + 1}`}
                rows={2}
              />
            </div>
            {formData.instructions.length > 1 && (
              <button
                type="button"
                onClick={() => removeInstruction(index)}
                className="px-3 py-2 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addInstruction}
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          + Add Step
        </button>
        {errors.instructions && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-1">
            {errors.instructions}
          </p>
        )}
      </div>

      {/* Image URL */}
      <div>
        <label htmlFor="image_url" className="block text-sm font-medium mb-2">
          Image URL (optional)
        </label>
        <input
          type="url"
          id="image_url"
          value={formData.image_url}
          onChange={(e) => handleInputChange("image_url", e.target.value)}
          className="w-full h-11 rounded-lg px-4 text-sm bg-white dark:bg-black/30 border border-black/[.08] dark:border-white/[.145] outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.push(cancelHref || "/dashboard")}
          className="h-11 px-6 rounded-full border border-black/[.08] dark:border-white/[.145] text-sm font-medium hover:bg-[#f2f2f2] dark:hover:bg-[#111]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-11 px-6 rounded-full bg-foreground text-background text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : submitButtonText}
        </button>
      </div>
    </form>
  );
}
