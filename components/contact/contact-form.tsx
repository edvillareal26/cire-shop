"use client";

import { cn } from "cn";

import { useEnquiryForm } from "@/lib/contact/client";

const FIELD_CLASS =
  "w-full border border-[#c8c8c4] bg-white px-8 text-lg text-[#2e3226] outline-none placeholder:text-[#85857f] focus-visible:ring-2 focus-visible:ring-cream";

export function ContactForm() {
  const [state, formAction, pending] = useEnquiryForm();

  if (state.status === "success") {
    return (
      <p className="border border-cream/40 px-8 py-12 text-center text-xl" role="status">
        {state.message}
      </p>
    );
  }

  const input = state.status === "error" ? state.input : undefined;
  return (
    <form action={formAction} className="grid gap-4">
      <label>
        <span className="sr-only">Name</span>
        <input
          autoComplete="name"
          className={cn(FIELD_CLASS, "h-14")}
          defaultValue={input?.name}
          maxLength={120}
          name="name"
          placeholder="Name"
        />
      </label>
      <label>
        <span className="sr-only">Email (required)</span>
        <input
          autoComplete="email"
          className={cn(FIELD_CLASS, "h-14")}
          defaultValue={input?.email}
          maxLength={254}
          name="email"
          placeholder="Email*"
          required
          type="email"
        />
      </label>
      <label>
        <span className="sr-only">Phone number</span>
        <input
          autoComplete="tel"
          className={cn(FIELD_CLASS, "h-14")}
          defaultValue={input?.phone}
          maxLength={40}
          name="phone"
          placeholder="Phone Number"
          type="tel"
        />
      </label>
      <label>
        <span className="sr-only">Message (required)</span>
        <textarea
          className={cn(FIELD_CLASS, "block h-34 resize-y py-4")}
          defaultValue={input?.message}
          maxLength={5000}
          name="message"
          placeholder="Message"
          required
        />
      </label>
      <input aria-hidden autoComplete="off" className="hidden" name="company" tabIndex={-1} />
      <div className="flex flex-wrap items-center justify-end gap-x-6 gap-y-3">
        <p aria-live="polite" className="mr-auto text-base text-cream/90 empty:hidden">
          {state.status === "error" ? state.message : null}
        </p>
        <button
          className="h-11 w-40 cursor-pointer rounded-lg border border-[#a9a9a3] bg-[#f3ece1] text-lg text-[#2e3226] transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-60"
          disabled={pending}
          type="submit"
        >
          {pending ? "Sending…" : "Send"}
        </button>
      </div>
    </form>
  );
}
