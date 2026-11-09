"use client";

import { useJoinListForm } from "@/lib/newsletter/client";

// The inline email and button row from the home page's Cire Insider section.
export function SubscribeForm() {
  const [state, formAction, pending] = useJoinListForm();

  if (state.status === "success") {
    return (
      <p className="font-serif text-2xl italic sm:text-3xl" role="status">
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="grid w-full max-w-126 gap-3">
      <div className="flex h-15 border border-current transition-shadow focus-within:shadow-[0_0_0_1px_currentColor]">
        <label className="sr-only" htmlFor="subscribe-email">
          Email address
        </label>
        <input
          autoComplete="email"
          className="min-w-0 flex-1 bg-transparent px-4 text-center text-sm tracking-[0.2em] outline-none placeholder:text-[#988c82]"
          id="subscribe-email"
          name="email"
          placeholder="your@email.com"
          required
          type="email"
        />
        <input
          aria-hidden
          autoComplete="off"
          className="hidden"
          name="company"
          tabIndex={-1}
          type="text"
        />
        <button
          className="w-32 shrink-0 cursor-pointer bg-[linear-gradient(90deg,#363f2c_55%,#5c6a48)] text-[13px] font-medium tracking-[0.2em] text-[#f5f1e8] uppercase transition-[filter] hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current disabled:cursor-not-allowed disabled:opacity-60 sm:w-38"
          disabled={pending}
          type="submit"
        >
          {pending ? "Joining…" : "Subscribe"}
        </button>
      </div>
      <p aria-live="polite" className="text-sm empty:hidden">
        {state.status === "error" ? state.message : null}
      </p>
    </form>
  );
}
