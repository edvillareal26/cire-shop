"use server";

import { z } from "zod";

import { CONTACT_EMAIL, ENQUIRY_THANK_YOU } from "@/lib/contact";
import type { EnquiryInput, EnquiryState } from "@/lib/contact/types";
import { isEmailConfigured, sendEmail } from "@/lib/email/server";

const oneLine = (value: string) => value.replace(/\s+/g, " ").trim();

// The honeypot field is hidden from people; bots that fill it get a quiet success.
const ENQUIRY_INPUT = z.strictObject({
  company: z.string(),
  email: z.string().trim().toLowerCase().pipe(z.email().max(254)),
  message: z.string().trim().min(1).max(5000),
  name: z.string().max(120).transform(oneLine),
  phone: z.string().max(40).transform(oneLine),
});

export async function sendEnquiryAction(input: EnquiryInput): Promise<EnquiryState> {
  const parsed = ENQUIRY_INPUT.safeParse(input);
  if (!parsed.success) {
    return { message: "Please enter a valid email address and a message.", status: "error" };
  }
  const { company, email, message, name, phone } = parsed.data;
  if (company) return { message: ENQUIRY_THANK_YOU, status: "success" };

  if (!isEmailConfigured) {
    return {
      message: `Our enquiry form isn’t open yet. Please email us at ${CONTACT_EMAIL}.`,
      status: "error",
    };
  }

  try {
    await sendEmail({
      replyTo: email,
      subject: `Website enquiry from ${name || email}`,
      text: [`Name: ${name || "–"}`, `Email: ${email}`, `Phone: ${phone || "–"}`, "", message].join(
        "\n",
      ),
      to: CONTACT_EMAIL,
    });
  } catch (error) {
    console.error("Enquiry email failed", error);
    return {
      message: `We couldn’t send your enquiry just now. Please try again or email us at ${CONTACT_EMAIL}.`,
      status: "error",
    };
  }

  // The reply carries no shopper-entered text, so the form can't relay content to other inboxes.
  try {
    await sendEmail({
      subject: "Thank you for your enquiry",
      text: `${ENQUIRY_THANK_YOU}\n\nCire Lash Collection\nPerfect the ritual. Notice the detail.`,
      to: email,
    });
  } catch (error) {
    console.error("Enquiry confirmation email failed", error);
  }
  return { message: ENQUIRY_THANK_YOU, status: "success" };
}
