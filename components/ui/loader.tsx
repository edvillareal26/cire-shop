import { cn } from "cn";
import { LoaderCircle } from "lucide-react";
import type { ComponentProps } from "react";

interface LoaderProps extends ComponentProps<"div"> {
  label: string;
}

export function Loader({ className, label, ...props }: LoaderProps) {
  return (
    <div
      aria-busy="true"
      className={cn("grid place-items-center", className)}
      data-slot="loader"
      role="status"
      {...props}
    >
      <LoaderCircle
        aria-hidden="true"
        className="size-9 animate-spin text-muted-foreground"
        strokeWidth={1.25}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
