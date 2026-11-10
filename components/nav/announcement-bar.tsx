import { Container } from "@/components/ui/container";
import { Link } from "@/components/ui/link";

export function AnnouncementBar() {
  return (
    <div className="border-b border-cream/25 bg-olive text-cream">
      <Container className="flex h-9 items-center justify-center text-[11px] tracking-[0.14em] sm:justify-between sm:text-[13px]">
        <p>Free U.S Shipping on Orders $125+</p>
        <Link className="hidden hover:underline sm:block" href="/join">
          Join the CIRE List →
        </Link>
      </Container>
    </div>
  );
}
