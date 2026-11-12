"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { authClient } from "@/lib/auth-client";

export function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const signUp = mode === "sign-up";

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        const email = String(data.get("email"));
        const password = String(data.get("password"));
        setError(null);
        startTransition(async () => {
          const { error } = signUp
            ? await authClient.signUp.email({ email, password, name: String(data.get("name")) })
            : await authClient.signIn.email({ email, password });
          if (error) {
            setError(error.message ?? "Something went wrong. Please try again.");
            return;
          }
          router.refresh();
        });
      }}
    >
      <h2 className="text-heading-sm">{signUp ? "Create an account" : "Sign in"}</h2>
      {signUp && (
        <label>
          <span className="sr-only">Name</span>
          <input name="name" required autoComplete="name" placeholder="Name" className="input-field" />
        </label>
      )}
      <label>
        <span className="sr-only">Email address</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="Email address"
          className="input-field"
        />
      </label>
      <label>
        <span className="sr-only">Password</span>
        <input
          type="password"
          name="password"
          required
          minLength={8}
          autoComplete={signUp ? "new-password" : "current-password"}
          placeholder="Password"
          className="input-field"
        />
      </label>
      {error && (
        <p role="alert" className="text-body-sm text-sale">
          {error}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn btn-primary btn-block disabled:opacity-60">
        {pending ? "One moment…" : signUp ? "Create account" : "Sign in"}
      </button>
      <p className="text-body-sm text-ink-muted">
        {signUp ? "Already have an account? " : "New to Atelier? "}
        <button
          type="button"
          onClick={() => {
            setMode(signUp ? "sign-in" : "sign-up");
            setError(null);
          }}
          className="link-underline text-ink"
        >
          {signUp ? "Sign in" : "Create an account"}
        </button>
      </p>
    </form>
  );
}

export function SignOutButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await authClient.signOut();
          router.refresh();
        })
      }
      className="link-underline text-body-sm text-ink-muted hover:text-ink"
    >
      Sign out
    </button>
  );
}
