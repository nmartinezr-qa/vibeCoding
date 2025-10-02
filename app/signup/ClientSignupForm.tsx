"use client";

import * as React from "react";
import { Eye, EyeOff, CircleSlash } from "lucide-react";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/i.test(email);
}

function evaluatePassword(password: string) {
  const rules = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  } as const;
  return { ok: Object.values(rules).every(Boolean), rules };
}

export default function ClientSignupForm({
  action,
}: {
  action: (
    fd: FormData
  ) => Promise<{
    usernameTaken?: boolean;
    invalidEmail?: boolean;
    weakPassword?: boolean;
    signUpError?: string;
    success?: boolean;
  } | void>;
}) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [showRules, setShowRules] = React.useState(false);
  const [usernameTaken, setUsernameTaken] = React.useState(false);
  const [showEmailError, setShowEmailError] = React.useState(false);
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  const emailValid = isValidEmail(email);
  const pass = evaluatePassword(password);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!emailValid || !pass.ok || username.trim().length === 0) {
      setShowEmailError(!emailValid);
      setShowRules(true);
      return;
    }

    const fd = new FormData(e.currentTarget);
    const result = await action(fd);

    if (result?.usernameTaken) {
      setUsernameTaken(true);
      return;
    }
    if (result?.invalidEmail) {
      setShowEmailError(true);
      return;
    }
    if (result?.weakPassword) {
      setShowRules(true);
      return;
    }
  }

  return (
    <div className="pt-20 max-w-lg mx-auto p-6">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="text-sm">
          <span className="sr-only">Full name</span>
          <input
            name="fullname"
            type="text"
            placeholder="Full name"
            className="w-full h-11 rounded-lg px-3 bg-white dark:bg-black/30 border border-gray-300 dark:border-white/[.145] outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>

        <label className="text-sm">
          <span className="sr-only">Username</span>
          <input
            name="username"
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setUsernameTaken(false);
            }}
            placeholder="Username"
            className="w-full h-11 rounded-lg px-3 bg-white dark:bg-black/30 border border-gray-300 dark:border-white/[.145] outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        {usernameTaken && (
          <p className="text-xs text-red-600 dark:text-red-400">
            This username is already taken
          </p>
        )}

        <label className="text-sm">
          <span className="sr-only">Email</span>
          <input
            name="email"
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setShowEmailError(false);
            }}
            placeholder="you@example.com"
            className="w-full h-11 rounded-lg px-3 bg-white dark:bg-black/30 border border-gray-300 dark:border-white/[.145] outline-none focus:ring-2 focus:ring-blue-500"
          />
        </label>
        {showEmailError && !emailValid && (
          <p className="text-xs text-red-600 dark:text-red-400">
            Invalid email format
          </p>
        )}

        <label className="text-sm relative">
          <span className="sr-only">Password</span>
          <input
            name="password"
            type={passwordVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            className="w-full h-11 rounded-lg px-3 pr-10 bg-white dark:bg-black/30 border border-gray-300 dark:border-white/[.145] outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={() => setPasswordVisible((v) => !v)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-foreground"
          >
            {passwordVisible ? (
              <Eye className="h-5 w-5" />
            ) : (
              <EyeOff className="h-5 w-5" />
            )}
          </button>
        </label>

        {showRules && (
          <div
            className="text-xs rounded-lg border border-gray-300 dark:border-white/[.145] p-3"
            aria-live="polite"
          >
            <p className="mb-1 font-medium">Password must contain:</p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-1">
              <PasswordRule
                ok={pass.rules.length}
                label="At least 8 characters"
              />
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
        )}

        <button
          type="submit"
          className="h-11 rounded-lg bg-foreground text-background font-medium hover:opacity-90"
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
          ? "flex items-center gap-2 text-green-600 dark:text-green-400"
          : "flex items-center gap-2 text-red-600 dark:text-red-400"
      }
    >
      {ok ? "✓" : <CircleSlash className="h-4 w-4" />}
      {label}
    </li>
  );
}
