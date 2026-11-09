import { Star } from "lucide-react";

interface ProductRatingProps {
  count: number;
  value: number;
}

export function ProductRating({ count, value }: ProductRatingProps) {
  return (
    <p className="flex items-center gap-2 text-lg">
      {count > 0 ? (
        <>
          <span className="text-muted-foreground">
            {count.toLocaleString("en-US")} {count === 1 ? "Review" : "Reviews"}
          </span>
          <span aria-hidden className="text-muted-foreground">
            •
          </span>
        </>
      ) : null}
      <Star aria-hidden className="size-5 fill-amber-500 text-amber-500" />
      <span className="font-semibold">
        <span className="sr-only">Rated </span>
        {value.toFixed(1)}
        <span className="sr-only"> out of 5</span>
      </span>
    </p>
  );
}
