"use client";

import { useActionState } from "react";
import { updateCartLine, type CartActionState } from "./actions";

export function LineQuantity({
  lineId,
  quantity,
}: {
  lineId: string;
  quantity: number;
}) {
  const [state, formAction, pending] = useActionState<CartActionState, FormData>(
    updateCartLine,
    { status: "idle" },
  );

  const stepper =
    "grid size-9 place-items-center text-base disabled:opacity-40 hover:bg-surface";

  return (
    <form action={formAction} className="flex flex-col items-end gap-2">
      <input type="hidden" name="lineId" value={lineId} />
      <div className="flex items-center gap-3">
        <div
          className={`border-foreground/25 flex items-center border ${pending ? "opacity-60" : ""}`}
        >
          <button
            type="submit"
            name="quantity"
            value={quantity - 1}
            disabled={pending}
            aria-label="Decrease quantity"
            className={stepper}
          >
            −
          </button>
          <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">
            <span className="sr-only">Quantity </span>
            {quantity}
          </span>
          <button
            type="submit"
            name="quantity"
            value={quantity + 1}
            disabled={pending}
            aria-label="Increase quantity"
            className={stepper}
          >
            +
          </button>
        </div>
        <button
          type="submit"
          name="quantity"
          value={0}
          disabled={pending}
          className="text-muted hover:text-foreground font-sans text-[11px] tracking-[0.18em] uppercase underline-offset-4 hover:underline disabled:opacity-40"
        >
          Remove
        </button>
      </div>
      {state.status === "error" && !pending ? (
        <p role="alert" className="text-danger max-w-56 text-right text-sm">
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
