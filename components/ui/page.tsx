import { cn } from "cn";
import type { ComponentProps } from "react";

export function Page({ children, className, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("pt-16 pb-20 lg:pt-24 lg:pb-28", className)} {...props}>
      {children}
    </div>
  );
}
