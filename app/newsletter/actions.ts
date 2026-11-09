"use server";

import {
  isNewsletterConfigured,
  subscribeToNewsletter,
} from "@/lib/shopify/admin";

export type JoinListState =
  | { status: "idle" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

// Deliberately strict: no quotes or spaces, so it's safe in a search query.
const EMAIL = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export async function joinList(
  _prev: JoinListState,
  formData: FormData,
): Promise<JoinListState> {
  // Honeypot: real visitors never see or fill this field.
  if (formData.get("company")) {
    return { status: "success", message: "You’re on the list." };
  }

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (email.length > 254 || !EMAIL.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  if (!isNewsletterConfigured) {
    return {
      status: "error",
      message: "Sign-ups aren’t open yet. Please check back soon.",
    };
  }

  try {
    await subscribeToNewsletter(email);
  } catch (error) {
    console.error("Newsletter sign-up failed", error);
    return {
      status: "error",
      message: "We couldn’t sign you up just now. Please try again.",
    };
  }
  return { status: "success", message: "You’re on the list. Welcome to CIRE." };
}
