"use client";

import { useActionState } from "react";

import { sendEnquiryAction } from "@/lib/contact/action";
import type { EnquiryInput, EnquiryState } from "@/lib/contact/types";

type EnquiryFormState =
  | (Exclude<EnquiryState, { status: "idle" }> & { input?: EnquiryInput })
  | { status: "idle" };

const INITIAL_STATE: EnquiryFormState = { status: "idle" };

/** Form state for the contact enquiry; a failed send returns what was typed so the reset form keeps it. */
export function useEnquiryForm() {
  return useActionState(
    async (_previous: EnquiryFormState, formData: FormData): Promise<EnquiryFormState> => {
      const input: EnquiryInput = {
        company: String(formData.get("company") ?? ""),
        email: String(formData.get("email") ?? ""),
        message: String(formData.get("message") ?? ""),
        name: String(formData.get("name") ?? ""),
        phone: String(formData.get("phone") ?? ""),
      };
      const state = await sendEnquiryAction(input);
      return state.status === "error" ? { ...state, input } : state;
    },
    INITIAL_STATE,
  );
}
