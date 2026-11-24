export interface EnquiryInput {
  company: string;
  email: string;
  message: string;
  name: string;
  phone: string;
}

export type EnquiryState = { status: "idle" } | { message: string; status: "error" | "success" };
