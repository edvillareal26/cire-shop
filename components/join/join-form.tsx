"use client";

import { ArrowRight, Mail } from "lucide-react";

import { useJoinListForm } from "@/lib/newsletter/client";

export function JoinForm() {
  const [state, formAction, pending] = useJoinListForm();

  if (state.status === "success") {
    return (
      <p className="font-serif text-2xl italic sm:text-3xl" role="status">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="grid w-full max-w-110 gap-3">
      <div className="flex h-12.75 items-center gap-3 border border-[#bab4a4] px-5 transition-colors focus-within:border-cream">
        <label className="sr-only" htmlFor="join-email">
          Email address
        </label>
        <input
          autoComplete="email"
          className="min-w-0 flex-1 bg-transparent text-sm tracking-[0.06em] outline-none placeholder:text-[13px] placeholder:uppercase placeholder:tracking-[0.22em] placeholder:text-cream/45 sm:placeholder:text-sm sm:placeholder:tracking-[0.24em]"
          id="join-email"
          name="email"
          placeholder="Your email address"
          required
          type="email"
        />
        <Mail aria-hidden className="size-5.5 shrink-0 text-cream/85" strokeWidth={1.5} />
        <input
          aria-hidden
          autoComplete="off"
          className="hidden"
          name="company"
          tabIndex={-1}
          type="text"
        />
      </div>
      <button
        className="flex h-13 w-full cursor-pointer items-center justify-center gap-3 bg-[linear-gradient(90deg,#363f2c_55%,#546540)] text-sm font-medium uppercase tracking-[0.26em] transition-[filter] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "Joining…" : "Join the Cire List"}
        <ArrowRight aria-hidden className="size-5" strokeWidth={1.5} />
      </button>
      <p aria-live="polite" className="text-sm text-cream/85 empty:hidden">
        {state.status === "error" ? state.message : null}
      </p>
    </form>
  );
}
