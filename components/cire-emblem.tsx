import type { SVGProps } from "react";

/**
 * The Cire woven diamond, rebuilt as vector from the brand artwork: a 3×3
 * basket weave (bars 18.7 thick, lanes 43 apart, 3.5 gap at each crossing)
 * rotated 45°, with a square at each point. Inherits colour from `color`.
 */
export function CireEmblem(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="-136 -136 272 272" fill="currentColor" aria-hidden="true" {...props}>
      <g transform="rotate(45)">
        <rect x="-52.35" y="-95.5" width="18.7" height="82.65" rx="1" />
        <rect x="-52.35" y="12.85" width="18.7" height="82.65" rx="1" />
        <rect x="-9.35" y="-95.5" width="18.7" height="39.65" rx="1" />
        <rect x="-9.35" y="-30.15" width="18.7" height="60.3" rx="1" />
        <rect x="-9.35" y="55.85" width="18.7" height="39.65" rx="1" />
        <rect x="33.65" y="-95.5" width="18.7" height="82.65" rx="1" />
        <rect x="33.65" y="12.85" width="18.7" height="82.65" rx="1" />
        <rect x="-95.5" y="-52.35" width="39.65" height="18.7" rx="1" />
        <rect x="-30.15" y="-52.35" width="60.3" height="18.7" rx="1" />
        <rect x="55.85" y="-52.35" width="39.65" height="18.7" rx="1" />
        <rect x="-95.5" y="-9.35" width="82.65" height="18.7" rx="1" />
        <rect x="12.85" y="-9.35" width="82.65" height="18.7" rx="1" />
        <rect x="-95.5" y="33.65" width="39.65" height="18.7" rx="1" />
        <rect x="-30.15" y="33.65" width="60.3" height="18.7" rx="1" />
        <rect x="55.85" y="33.65" width="39.65" height="18.7" rx="1" />
        <rect x="-91.35" y="-91.35" width="18.7" height="18.7" rx="1" />
        <rect x="-91.35" y="72.65" width="18.7" height="18.7" rx="1" />
        <rect x="72.65" y="-91.35" width="18.7" height="18.7" rx="1" />
        <rect x="72.65" y="72.65" width="18.7" height="18.7" rx="1" />
      </g>
    </svg>
  );
}
