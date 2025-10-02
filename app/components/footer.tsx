"use client";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full h-14 border-t border-black/[.08] dark:border-white/[.145] bg-white dark:bg-black z-50">
      <div className="mx-auto max-w-6xl h-full px-6 flex items-center justify-between text-xs text-black/60 dark:text-white/60">
        <p>© {new Date().getFullYear()} VibeCooking</p>
        <a className="hover:underline underline-offset-4" href="#about">
          About
        </a>
      </div>
    </footer>
  );
}
