"use server";

import { z } from "zod";

import type { JoinListState } from "@/lib/newsletter/types";
import { isAdminApiConfigured, subscribeToEmailMarketing } from "@/lib/shopify/admin/server";

// The honeypot field is hidden from people; bots that fill it get a quiet success.
const JOIN_INPUT = z.strictObject({
  company: z.string(),
  email: z.email().max(254),
});

export async function joinListAction(input: {
  company: string;
  email: string;
}): Promise<JoinListState> {
  const parsed = JOIN_INPUT.safeParse({ ...input, email: input.email?.trim().toLowerCase() });
  if (!parsed.success) {
    return { message: "Please enter a valid email address.", status: "error" };
  }
  if (parsed.data.company) return { message: "You’re on the list.", status: "success" };

  if (!isAdminApiConfigured) {
    return { message: "Sign-ups aren’t open yet. Please check back soon.", status: "error" };
  }

  try {
    await subscribeToEmailMarketing(parsed.data.email);
  } catch (error) {
    console.error("Newsletter sign-up failed", error);
    return { message: "We couldn’t sign you up just now. Please try again.", status: "error" };
  }
  return { message: "You’re on the list. Welcome to CIRE.", status: "success" };
}
