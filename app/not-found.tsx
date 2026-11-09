import { NotFoundContent } from "@/components/not-found-content";
import { SiteChrome } from "@/components/site-chrome";

// URLs that match no route render here, outside app/(site), so this page
// brings its own header and footer.
export default function NotFound() {
  return (
    <SiteChrome>
      <NotFoundContent />
    </SiteChrome>
  );
}
