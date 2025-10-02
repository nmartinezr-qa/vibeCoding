"use client";

import Link from "next/link";
import { Home } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full h-14 flex items-center justify-between px-6 border-b border-black/10 dark:border-white/10 bg-white dark:bg-black z-50">
      <div className="text-lg font-semibold text-foreground">
        Recipes Factory
      </div>
      <Link
        href="/"
        className="ml-auto flex items-center gap-2 text-lg font-semibold text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        aria-label="Go to home"
      >
        <Home className="h-5 w-5" />
      </Link>
    </header>
  );
}
