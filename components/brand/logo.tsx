import { cn } from "cn";
import Image from "next/image";

import logo from "@/public/images/cire-logo.png";

interface LogoProps {
  className?: string;
  loading?: "eager" | "lazy";
  tone?: "cream" | "white";
}

export function Logo({ className, loading = "lazy", tone = "white" }: LogoProps) {
  if (tone === "cream") {
    const mask = `url(${logo.src}) center / contain no-repeat`;
    return (
      <span
        aria-label="Cire Lash Collection"
        className={cn("block bg-cream", className)}
        role="img"
        style={{ aspectRatio: `${logo.width} / ${logo.height}`, mask, WebkitMask: mask }}
      />
    );
  }
  return (
    <Image
      alt="Cire Lash Collection"
      className={cn("w-auto", className)}
      loading={loading}
      src={logo}
      unoptimized
    />
  );
}
