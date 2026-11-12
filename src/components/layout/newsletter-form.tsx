"use client";

import { useState } from "react";

// Front-end only for now: there is no subscription endpoint yet.
export function NewsletterForm() {
  const [subscribed, setSubscribed] = useState(false);

  if (subscribed) {
    return (
      <p role="status" className="text-body text-success">
        You’re subscribed. Look out for our next letter in your inbox.
      </p>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubscribed(true);
      }}
      className="flex flex-col gap-4 sm:flex-row sm:items-end"
    >
      <label className="flex-1">
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
      <button type="submit" className="btn btn-primary">
        Subscribe
      </button>
    </form>
  );
}
