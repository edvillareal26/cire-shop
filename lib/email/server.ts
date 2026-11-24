import { createTransport } from "nodemailer";

import { CONTACT_EMAIL } from "@/lib/contact";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PASSWORD = process.env.SMTP_PASSWORD;
const SMTP_USER = process.env.SMTP_USER;

export const isEmailConfigured = Boolean(SMTP_HOST && SMTP_PASSWORD && SMTP_USER);

const transport = isEmailConfigured
  ? createTransport({
      auth: { pass: SMTP_PASSWORD, user: SMTP_USER },
      host: SMTP_HOST,
      port: 465,
      secure: true,
    })
  : undefined;

/** Sends a plain-text email from the shop's contact address. */
export async function sendEmail({
  replyTo,
  subject,
  text,
  to,
}: {
  replyTo?: string;
  subject: string;
  text: string;
  to: string;
}): Promise<void> {
  if (!transport) throw new Error("SMTP_HOST, SMTP_USER, and SMTP_PASSWORD are not set.");
  await transport.sendMail({
    from: { address: CONTACT_EMAIL, name: "Cire Lash Collection" },
    replyTo,
    subject,
    text,
    to,
  });
}
