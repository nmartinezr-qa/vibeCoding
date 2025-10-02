"use client";

import * as React from "react";

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
  action: (fd: FormData) => Promise<void>;
}) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [username, setUsername] = React.useState("");
  const [showRules, setShowRules] = React.useState(false);
  const [showEmailError, setShowEmailError] = React.useState(false);

  const emailValid = isValidEmail(email);
  const pass = evaluatePassword(password);

  function validateBeforeSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!emailValid || !pass.ok || username.trim().length === 0) {
      e.preventDefault();
      setShowEmailError(!emailValid);
      setShowRules(!pass.ok);
    }
  }

  return (
    <form
      action={action}
      onSubmit={validateBeforeSubmit}
      className="flex flex-col gap-3"
    >
      <input
        name="fullname"
        type="text"
        placeholder="Full name"
        className="w-full h-11 rounded-lg px-3 border"
      />
      <input
        name="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        className="w-full h-11 rounded-lg px-3 border"
      />
      <input
        name="email"
        type="text"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setShowEmailError(false);
        }}
        placeholder="you@example.com"
        className="w-full h-11 rounded-lg px-3 border"
      />
      {showEmailError && (
        <p className="text-xs text-red-600">Invalid email format</p>
      )}
      <input
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Create a password"
        className="w-full h-11 rounded-lg px-3 border"
      />
      {showRules && (
        <ul className="text-xs border p-2">
          <li>{pass.rules.length ? "✓" : "✗"} ≥ 8 characters</li>
          <li>{pass.rules.upper ? "✓" : "✗"} Uppercase</li>
          <li>{pass.rules.lower ? "✓" : "✗"} Lowercase</li>
          <li>{pass.rules.number ? "✓" : "✗"} Number</li>
          <li>{pass.rules.special ? "✓" : "✗"} Special character</li>
        </ul>
      )}
      <button
        type="submit"
        className="h-11 rounded-lg bg-foreground text-background font-medium"
      >
        Create account
      </button>
    </form>
  );
}
