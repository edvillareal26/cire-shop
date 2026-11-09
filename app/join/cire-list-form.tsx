"use client";

import { useActionState } from "react";
import { joinList, type JoinListState } from "@/app/newsletter/actions";
import { ArrowRightIcon, MailIcon } from "@/components/icons";

export function CireListForm() {
  const [state, formAction, pending] = useActionState<JoinListState, FormData>(
    joinList,
    { status: "idle" },
  );

  if (state.status === "success") {
    return (
      <p
        role="status"
        className="mt-12 font-serif text-2xl italic sm:mt-11 sm:text-3xl"
      >
        {state.message}
      </p>
    );
  }

  return (
    <form action={formAction} className="mt-10 w-full max-w-[440px] sm:mt-[clamp(1.5rem,4.7svh,2.75rem)]">
      <div className="flex h-[51px] items-center gap-3 border border-[#bab4a4] px-5 transition-colors focus-within:border-cream">
        <label htmlFor="join-email" className="sr-only">
          Email address
        </label>
        <input
          id="join-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Your email address"
          className="placeholder:text-cream/45 min-w-0 flex-1 bg-transparent font-sans text-sm tracking-[0.06em] outline-none placeholder:text-[13px] placeholder:tracking-[0.22em] placeholder:uppercase sm:placeholder:text-sm sm:placeholder:tracking-[0.24em]"
        />
        <MailIcon className="text-cream/85 size-[22px] shrink-0" />
        {/* Honeypot for bots; hidden from people and assistive tech. */}
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="mt-3 flex h-[52px] w-full items-center justify-center gap-3 bg-[linear-gradient(90deg,#363f2c_55%,#546540)] font-sans text-sm font-medium tracking-[0.26em] uppercase transition-[filter] hover:brightness-110 disabled:opacity-60"
      >
        {pending ? "Joining…" : "Join the Cire List"}
        <ArrowRightIcon className="size-5" />
      </button>
      <p aria-live="polite" className="text-cream/85 mt-3 text-sm empty:mt-0">
        {state.status === "error" ? state.message : null}
      </p>
    </form>
  );
}
