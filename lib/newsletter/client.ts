"use client";

import { useActionState } from "react";

import { joinListAction } from "@/lib/newsletter/action";
import type { JoinListState } from "@/lib/newsletter/types";

const INITIAL_STATE: JoinListState = { status: "idle" };

/** Form state for The Cire List sign-up; the form needs `email` and a hidden `company` honeypot. */
export function useJoinListForm() {
  return useActionState(
    (_previous: JoinListState, formData: FormData) =>
      joinListAction({
        company: String(formData.get("company") ?? ""),
        email: String(formData.get("email") ?? ""),
      }),
    INITIAL_STATE,
  );
}
