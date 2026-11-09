import { cn } from "cn";
import type { ComponentProps } from "react";

import { Link } from "@/components/ui/link";
import type { OptionGroupState } from "@/lib/product/types";

interface OptionPickerProps extends ComponentProps<"div"> {
  compact?: boolean;
  onSelectValue?: (optionName: string, value: string) => void;
  option: OptionGroupState;
}

export function OptionPicker({
  compact = false,
  onSelectValue,
  option,
  className,
  ...props
}: OptionPickerProps) {
  const selected = option.values.find((value) => value.selected);
  return (
    <div className={cn("grid", compact ? "gap-2" : "gap-3", className)} {...props}>
      <p className={compact ? "text-sm" : "text-lg"}>
        {option.name}
        {selected ? `: ${selected.name}` : null}
      </p>
      <div className="flex flex-wrap gap-2">
        {option.values.map((value) => {
          const classes = cn(
            "grid min-w-13 place-items-center rounded-md border px-3.5 text-center transition-colors",
            compact ? "h-9 text-sm" : "h-11 text-base sm:min-w-15 sm:text-lg",
            !value.exists
              ? "cursor-not-allowed border-dashed border-border text-muted-foreground/50 line-through"
              : value.selected
                ? "border-white bg-white text-olive-deep"
                : "border-foreground/80 text-foreground hover:bg-foreground/10",
            value.exists && !value.available && "border-dashed line-through",
          );

          // Invisible medium-weight twin reserves the bold width so pills don't shift on selection.
          const label = (
            <>
              <span className="col-start-1 row-start-1">{value.name}</span>
              <span aria-hidden="true" className="invisible col-start-1 row-start-1 font-medium">
                {value.name}
              </span>
            </>
          );

          if (!value.exists) {
            return (
              <button
                key={value.name}
                aria-label={`${option.name}: ${value.name} (unavailable)`}
                className={classes}
                disabled
                type="button"
              >
                {label}
              </button>
            );
          }

          return (
            <Link
              key={value.name}
              href={value.href}
              scroll={false}
              className={classes}
              aria-current={value.selected ? "true" : undefined}
              aria-label={value.available ? undefined : `${option.name}: ${value.name} (sold out)`}
              onClick={
                onSelectValue && !value.crossProduct
                  ? (event) => {
                      event.preventDefault();
                      onSelectValue(option.name, value.name);
                    }
                  : undefined
              }
            >
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
