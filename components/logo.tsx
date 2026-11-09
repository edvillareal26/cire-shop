import Image from "next/image";
import logo from "@/public/images/cire-logo.png";

/**
 * Cire wordmark. "white" is the logo file as-is; "cream" recolours it with a
 * CSS mask (used in the footer).
 */
export function Logo({
  className = "h-[58px]",
  tone = "white",
}: {
  className?: string;
  tone?: "white" | "cream";
}) {
  if (tone === "cream") {
    const mask = `url(${logo.src}) center / contain no-repeat`;
    return (
      <span
        role="img"
        aria-label="Cire Lash Collection"
        className={`bg-cream block ${className}`}
        style={{
          aspectRatio: `${logo.width} / ${logo.height}`,
          mask,
          WebkitMask: mask,
        }}
      />
    );
  }

  return (
    <Image
      src={logo}
      alt="Cire Lash Collection"
      loading="eager"
      sizes="160px"
      className={`w-auto ${className}`}
    />
  );
}
