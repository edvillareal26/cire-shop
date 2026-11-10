import { SubscribeForm } from "@/components/join/subscribe-form";

// Sits last on the home page at its natural height, so it shares the final full-page screen with the footer.
export function CireInsider() {
  return (
    <section
      aria-labelledby="insider-heading"
      className="bg-[#f2ebdd] px-6 py-14 text-[#3b2821] sm:pt-13 sm:pb-15"
      data-full-page-section
    >
      <div className="mx-auto grid max-w-3xl justify-items-center text-center">
        <p className="font-serif text-xl tracking-[0.3em] text-[#6b5041] uppercase">Cire Insider</p>
        <h2
          className="mt-10 font-serif text-[2.375rem]/none font-normal italic uppercase sm:mt-12"
          id="insider-heading"
        >
          Join the Cire List
        </h2>
        <p className="mt-5 text-[15px] tracking-[0.18em] text-[#6b5041]">
          Get the latest news, exclusive offers and discounts.
        </p>
        <div className="mt-12 grid w-full justify-items-center">
          <SubscribeForm />
        </div>
      </div>
    </section>
  );
}
