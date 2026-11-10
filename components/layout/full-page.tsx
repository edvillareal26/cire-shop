"use client";

import { animate } from "motion";
import { useEffect } from "react";

const SECTION_SELECTOR = "[data-full-page-section]";
const PAGE_SELECTOR = '#main-content, [data-slot="storefront-chrome"]';
const NAV_SELECTOR = "#nav-outer";
const NATIVE_KEY_SELECTOR =
  "input, textarea, select, [contenteditable], [role=listbox], [role=menu], [role=radiogroup], [role=slider], [role=tablist]";
const EASE = [0.7, 0, 0.2, 1] as const;
const EDGE_MS = 200;
const EPSILON_PX = 2;
// Trackpads keep sending wheel events after a flick; a gesture ends after this long without one.
const GESTURE_PAUSE_MS = 200;
// The wheel moves past a tall section only on a new gesture, not the one that reached its end.
const INNER_GAP_MS = 600;
const KEYS: Record<string, 1 | -1> = { " ": 1, ArrowDown: 1, ArrowUp: -1, PageDown: 1, PageUp: -1 };
const MIN_LOCK_MS = 700;
const REDUCED_SPEED_MS = 300;
const SETTLE_MS = 450;
const SPEED_MS = 900;
const SWIPE_SHARE = 0.05;

interface Stop {
  element: HTMLElement;
  end: number;
  start: number;
}

interface Touch {
  mode: "done" | "native" | "pending" | "swipe";
  x: number;
  y: number;
}

/** One wheel gesture, swipe or key press moves one `data-full-page-section`; taller sections scroll through first. */
export function FullPage() {
  useEffect(() => startFullPage(), []);
  return null;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function isPageTarget(target: EventTarget | null): boolean {
  if (target === document || target === document.body || target === document.documentElement) {
    return true;
  }
  return target instanceof Element && target.closest(PAGE_SELECTOR) !== null;
}

function scrollsInside(target: EventTarget | null, direction: 1 | -1): boolean {
  for (
    let element = target instanceof Element ? target : null;
    element && element !== document.body;
    element = element.parentElement
  ) {
    if (element.scrollHeight <= element.clientHeight) continue;
    const { overflowY } = getComputedStyle(element);
    if (overflowY !== "auto" && overflowY !== "scroll") continue;
    const room =
      direction > 0
        ? element.scrollHeight - element.clientHeight - element.scrollTop
        : element.scrollTop;
    if (room > 1) return true;
  }
  return false;
}

function wheelPixels(event: WheelEvent): number {
  if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return event.deltaY * 16;
  if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) return event.deltaY * window.innerHeight;
  return event.deltaY;
}

function navHeight(): number {
  return document.querySelector(NAV_SELECTOR)?.getBoundingClientRect().height ?? 0;
}

// Measured on every input: sections stream in, and images and fonts change their heights.
function measureStops(): Stop[] {
  const offset = navHeight();
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const stops: Stop[] = [];
  for (const element of document.querySelectorAll<HTMLElement>(SECTION_SELECTOR)) {
    const rect = element.getBoundingClientRect();
    if (rect.height === 0) continue;
    const start = clamp(Math.round(rect.top + y - offset), 0, max);
    const overflow = Math.round(rect.bottom + y - window.innerHeight) - start;
    const end = overflow > EPSILON_PX ? Math.min(start + overflow, max) : start;
    const previous = stops.at(-1);
    if (previous && previous.start === start) previous.end = Math.max(previous.end, end);
    else stops.push({ element, end, start });
  }
  return stops;
}

function currentStop(stops: Stop[], y: number): Stop | undefined {
  return stops.findLast((stop) => stop.start <= y + EPSILON_PX) ?? stops[0];
}

// The edge a tall section can still scroll toward, or null when the next input should change sections.
function innerEdge(direction: 1 | -1): number | null {
  const y = window.scrollY;
  const stop = currentStop(measureStops(), y);
  if (!stop || stop.end - stop.start <= EPSILON_PX) return null;
  if (direction > 0) return y < stop.end - EPSILON_PX ? stop.end : null;
  return y > stop.start + EPSILON_PX && y <= stop.end + EPSILON_PX ? stop.start : null;
}

// Moving up into a tall section lands on its end, so it reads back upward.
function stepTarget(direction: 1 | -1): number | null {
  const stops = measureStops();
  const y = window.scrollY;
  if (direction > 0) return stops.find((stop) => stop.start > y + EPSILON_PX)?.start ?? null;
  const stop = currentStop(stops, y);
  if (stop && y > stop.start + EPSILON_PX) return y > stop.end + EPSILON_PX ? stop.end : stop.start;
  return stops.findLast((candidate) => candidate.start < y - EPSILON_PX)?.end ?? null;
}

function startFullPage(): () => void {
  const controller = new AbortController();
  const { signal } = controller;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let animating = false;
  let holding = false;
  let innerTarget = 0;
  let lastInner = 0;
  let lastWheel = 0;
  let lockTimer: number | undefined;
  let moving = false;
  let scrolling: { stop: () => void } | undefined;
  let settleTimer: number | undefined;
  let touch: Touch | null = null;

  function scrollToY(top: number, ms: number) {
    scrolling?.stop();
    if (Math.abs(top - window.scrollY) < 1) {
      animating = false;
      return;
    }
    animating = true;
    scrolling = animate(window.scrollY, top, {
      duration: ms / 1000,
      ease: EASE,
      onComplete: () => {
        animating = false;
      },
      onUpdate: (value) => window.scrollTo({ behavior: "instant", top: value }),
    });
  }

  function move(top: number) {
    const ms = reducedMotion.matches ? REDUCED_SPEED_MS : SPEED_MS;
    moving = true;
    holding = true;
    scrollToY(top, ms);
    window.clearTimeout(lockTimer);
    lockTimer = window.setTimeout(
      () => {
        moving = false;
      },
      Math.max(ms, MIN_LOCK_MS),
    );
  }

  // Native scrolling (momentum, scrollbar, find in page, focus) can stop between sections; finish it at the nearer edge.
  function settle() {
    if (animating || touch) return;
    const stops = measureStops();
    const y = window.scrollY;
    const stop = currentStop(stops, y);
    if (!stop || y <= stop.end + EPSILON_PX) return;
    const next = stops.find((candidate) => candidate.start > y + EPSILON_PX);
    const active = document.activeElement;
    const focused =
      active instanceof HTMLElement && active.matches(":focus-visible") ? active : null;
    const holder = focused ? [stop, next].find((s) => s?.element.contains(focused)) : undefined;
    const toNext = next !== undefined && (holder ? holder === next : next.start - y < y - stop.end);
    scrollToY(toNext ? next.start : stop.end, SETTLE_MS);
  }

  function scheduleSettle() {
    window.clearTimeout(settleTimer);
    settleTimer = window.setTimeout(settle, 150);
  }

  document.addEventListener(
    "wheel",
    (event) => {
      const now = performance.now();
      const gap = now - lastWheel;
      lastWheel = now;
      if (event.ctrlKey || !isPageTarget(event.target)) return;
      if (!event.deltaY || Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const direction = event.deltaY > 0 ? 1 : -1;
      if (scrollsInside(event.target, direction)) return;
      if (holding) {
        if (moving || gap <= GESTURE_PAUSE_MS) {
          event.preventDefault();
          return;
        }
        holding = false;
      }

      const edge = innerEdge(direction);
      if (edge !== null) {
        innerTarget =
          (now - lastInner < GESTURE_PAUSE_MS ? innerTarget : window.scrollY) + wheelPixels(event);
        lastInner = now;
        if (direction > 0 ? innerTarget > edge : innerTarget < edge) {
          event.preventDefault();
          scrollToY(edge, EDGE_MS);
        }
        return;
      }

      event.preventDefault();
      if (now - lastInner <= INNER_GAP_MS) return;
      const top = stepTarget(direction);
      if (top !== null) move(top);
    },
    { passive: false, signal },
  );

  document.addEventListener(
    "touchstart",
    (event) => {
      const point = event.touches[0];
      touch =
        event.touches.length === 1 && point && isPageTarget(event.target)
          ? { mode: "pending", x: point.clientX, y: point.clientY }
          : null;
    },
    { passive: true, signal },
  );

  document.addEventListener(
    "touchmove",
    (event) => {
      const point = event.touches[0];
      if (!touch || !point || touch.mode === "native") return;
      const dx = touch.x - point.clientX;
      const dy = touch.y - point.clientY;
      const direction = dy > 0 ? 1 : -1;

      if (touch.mode === "pending") {
        if (!dx && !dy) return;
        // Sideways swipes belong to carousels; pull-to-refresh and tall sections pan natively.
        if (
          Math.abs(dx) > Math.abs(dy) ||
          (!moving &&
            (scrollsInside(event.target, direction) ||
              innerEdge(direction) !== null ||
              stepTarget(direction) === null))
        ) {
          touch.mode = "native";
          return;
        }
        touch.mode = "swipe";
      }

      if (event.cancelable) event.preventDefault();
      if (touch.mode === "done" || moving) return;
      if (Math.abs(dy) < window.innerHeight * SWIPE_SHARE) return;
      touch.mode = "done";
      const top = stepTarget(direction);
      if (top !== null) move(top);
    },
    { passive: false, signal },
  );

  const endTouch = () => {
    const wasNative = touch?.mode === "native";
    touch = null;
    if (wasNative) scheduleSettle();
  };
  document.addEventListener("touchend", endTouch, { passive: true, signal });
  document.addEventListener("touchcancel", endTouch, { passive: true, signal });

  document.addEventListener(
    "keydown",
    (event) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      if (!isPageTarget(event.target)) return;
      const target = event.target instanceof Element ? event.target : null;
      if (target?.closest(NATIVE_KEY_SELECTOR)) return;

      if (event.key === "Home" || event.key === "End") {
        const stops = measureStops();
        const last = stops.at(-1);
        if (!last) return;
        event.preventDefault();
        if (!moving) move(event.key === "Home" ? 0 : last.end);
        return;
      }

      let direction = KEYS[event.key];
      if (!direction) return;
      if (event.key === " ") {
        if (target?.closest("a, button, summary, audio, video")) return;
        if (event.shiftKey) direction = -1;
      }
      if (scrollsInside(target, direction) || innerEdge(direction) !== null) return;
      event.preventDefault();
      if (moving) return;
      const top = stepTarget(direction);
      if (top !== null) move(top);
    },
    { signal },
  );

  document.addEventListener(
    "click",
    (event) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      ) {
        return;
      }
      const anchor =
        event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor || !isPageTarget(anchor)) return;
      const url = new URL(anchor.href);
      if (
        url.hash.length < 2 ||
        url.origin !== window.location.origin ||
        url.pathname !== window.location.pathname ||
        url.search !== window.location.search
      ) {
        return;
      }
      const destination = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      const stop = destination
        ? measureStops().find((candidate) => candidate.element.contains(destination))
        : undefined;
      if (!stop) return;
      event.preventDefault();
      move(stop.start);
    },
    { signal },
  );

  const supportsScrollEnd = "onscrollend" in window;
  window.addEventListener(supportsScrollEnd ? "scrollend" : "scroll", scheduleSettle, {
    passive: true,
    signal,
  });
  window.addEventListener("resize", scheduleSettle, { signal });

  return () => {
    controller.abort();
    scrolling?.stop();
    window.clearTimeout(lockTimer);
    window.clearTimeout(settleTimer);
  };
}
