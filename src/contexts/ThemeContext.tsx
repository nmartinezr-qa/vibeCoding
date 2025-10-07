"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { Theme, ThemeContextType } from "@/src/types/theme.types";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");

  // Get system theme preference
  const getSystemTheme = useCallback((): "light" | "dark" => {
    if (typeof window === "undefined") return "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }, []);

  // Update resolved theme based on current theme setting
  const updateResolvedTheme = useCallback(
    (currentTheme: Theme) => {
      if (currentTheme === "system") {
        setResolvedTheme(getSystemTheme());
      } else {
        setResolvedTheme(currentTheme);
      }
    },
    [getSystemTheme]
  );

  // Set theme and save to localStorage
  const setTheme = useCallback(
    (newTheme: Theme) => {
      setThemeState(newTheme);
      updateResolvedTheme(newTheme);

      // Save to localStorage only on client-side
      if (
        typeof window !== "undefined" &&
        typeof localStorage !== "undefined"
      ) {
        try {
          localStorage.setItem("theme", newTheme);
        } catch (error) {
          // Handle cases where localStorage is not available
          console.warn("Failed to save theme to localStorage:", error);
        }
      }
    },
    [updateResolvedTheme]
  );

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    const currentResolved = resolvedTheme;
    setTheme(currentResolved === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  // Initialize theme from localStorage or default
  useEffect(() => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      try {
        const savedTheme = localStorage.getItem("theme") as Theme;
        if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
          setThemeState(savedTheme);
          updateResolvedTheme(savedTheme);
        } else {
          setThemeState(defaultTheme);
          updateResolvedTheme(defaultTheme);
        }
      } catch (error) {
        // Handle cases where localStorage is not available
        console.warn("Failed to read theme from localStorage:", error);
        setThemeState(defaultTheme);
        updateResolvedTheme(defaultTheme);
      }
    } else {
      // Server-side rendering or localStorage not available
      setThemeState(defaultTheme);
      updateResolvedTheme(defaultTheme);
    }
  }, [defaultTheme, updateResolvedTheme]);

  // Listen for system theme changes when theme is "system"
  useEffect(() => {
    if (theme !== "system" || typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      setResolvedTheme(getSystemTheme());
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, getSystemTheme]);

  // Apply theme to document
  useEffect(() => {
    if (typeof document === "undefined") return;

    const root = document.documentElement;

    // Remove previous theme classes
    root.classList.remove("light", "dark");

    // Add current theme class
    root.classList.add(resolvedTheme);

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        resolvedTheme === "dark" ? "#000000" : "#ffffff"
      );
    }
  }, [resolvedTheme]);

  const value: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
