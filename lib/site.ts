// Store details shown in the footer. Fill these in; anything left empty is
// hidden (an empty email falls back to a link to the Contact page).

export const CONTACT_EMAIL = "";

export const SOCIAL_LINKS = {
  facebook: "", // e.g. "https://www.facebook.com/cirelashcollection"
  instagram: "", // e.g. "https://www.instagram.com/cirelashcollection"
  tiktok: "", // e.g. "https://www.tiktok.com/@cirelashcollection"
};

/** Payment marks shown in the footer, in display order. */
export const PAYMENT_METHODS = [
  { name: "American Express", src: "/images/payment/amex.svg" },
  { name: "Google Pay", src: "/images/payment/google-pay.svg" },
  { name: "Apple Pay", src: "/images/payment/apple-pay.svg" },
  { name: "PayPal", src: "/images/payment/paypal.svg" },
  { name: "Mastercard", src: "/images/payment/mastercard.svg" },
  { name: "Visa", src: "/images/payment/visa.svg" },
];
