"use client";

import * as React from "react";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function evaluatePassword(password: string) {
  const rules = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  } as const;
  const ok = Object.values(rules).every(Boolean);
  return { ok, rules };
}

export default function SignupPage({
  action,
}: {
  action: (fd: FormData) => void;
}) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [username, setUsername] = React.useState("");

  const emailValid = isValidEmail(email);
  const pass = evaluatePassword(password);

  return (
    <div className="pt-20 max-w-lg mx-auto p-6">
      <form action={action} className="flex flex-col gap-3">
        <label className="text-sm">
          <span className="sr-only">Full name</span>
          <input
            name="fullname"
            type="text"
            placeholder="Full name"
            className="w-full h-11 rounded-lg px-3 bg-white dark:bg-black/30 border border-black/[.08] dark:border-white/[.145] outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
          />
        </label>

        <label className="text-sm">
          <span className="sr-only">Username</span>
          <input
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full h-11 rounded-lg px-3 bg-white dark:bg-black/30 border border-black/[.08] dark:border-white/[.145] outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
          />
        </label>

        <label className="text-sm">
          <span className="sr-only">Email</span>
          <input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            aria-invalid={!emailValid}
            className="w-full h-11 rounded-lg px-3 bg-white dark:bg-black/30 border border-black/[.08] dark:border-white/[.145] outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
          />
        </label>

        {!emailValid && email.length > 0 ? (
          <p className="text-xs text-red-600 dark:text-red-400">
            Invalid email format
          </p>
        ) : null}

        <label className="text-sm">
          <span className="sr-only">Password</span>
          <input
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Create a password"
            className="w-full h-11 rounded-lg px-3 bg-white dark:bg-black/30 border border-black/[.08] dark:border-white/[.145] outline-none focus:ring-2 focus:ring-black/10 dark:focus:ring-white/20"
          />
        </label>

        <div
          className="text-xs rounded-lg border border-black/[.08] dark:border-white/[.145] p-3"
          aria-live="polite"
        >
          <p className="mb-1 font-medium">Password must contain:</p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-1">
            <PasswordRule ok={pass.rules.length} label=">= 8 characters" />
            <PasswordRule
              ok={pass.rules.upper}
              label="Uppercase letter (A-Z)"
            />
            <PasswordRule
              ok={pass.rules.lower}
              label="Lowercase letter (a-z)"
            />
            <PasswordRule ok={pass.rules.number} label="Number (0-9)" />
            <PasswordRule
              ok={pass.rules.special}
              label="Special character (!@#$...)"
            />
          </ul>
        </div>

        <button
          type="submit"
          className="h-11 rounded-lg bg-foreground text-background font-medium hover:opacity-90 disabled:opacity-60"
          disabled={!emailValid || !pass.ok || username.trim().length === 0}
        >
          Create account
        </button>
      </form>
    </div>
  );
}

function PasswordRule({ ok, label }: { ok: boolean; label: string }) {
  return (
    <li
      className={
        ok
          ? "text-green-600 dark:text-green-400"
          : "text-red-600 dark:text-red-400"
      }
    >
      {ok ? "✓" : "✗"} {label}
    </li>
  );
}
