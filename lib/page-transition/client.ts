"use client";

import { animate } from "motion";

const PAGE_SELECTOR = '#main-content, [data-slot="storefront-chrome"] > footer';
const OFFSET_PX = 24;
const LEAVE = { duration: 0.35, ease: [0.55, 0, 1, 0.45] } as const;
const ENTER = { duration: 0.6, ease: [0.22, 1, 0.36, 1] } as const;
// A navigation that never changes the path (a redirect back, a failed fetch) must not leave the page hidden.
const RECOVER_MS = 4000;

let animation: { stop: () => void } | undefined;
let fromHistory = false;
let generation = 0;
let lastPathname: string | undefined;
let leaving = false;
let pendingNavigate: (() => void) | undefined;
let recoverTimer: number | undefined;

if (typeof window !== "undefined") {
  window.addEventListener("popstate", () => {
    fromHistory = true;
    pendingNavigate = undefined;
  });
}

function pageElements(): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>(PAGE_SELECTOR)];
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// A lingering transform would make the page the containing block of its fixed descendants.
function clearStyles(elements: HTMLElement[]) {
  for (const element of elements) {
    element.style.opacity = "";
    element.style.transform = "";
  }
}

function reveal(offset: number, transition: typeof ENTER) {
  const id = ++generation;
  const elements = pageElements();
  animation?.stop();
  if (prefersReducedMotion()) {
    clearStyles(elements);
    return;
  }
  for (const element of elements) {
    element.style.opacity = "0";
    element.style.transform = `translateY(${offset}px)`;
  }
  const current = animate(elements, { opacity: [0, 1], y: [offset, 0] }, transition);
  animation = current;
  // Motion commits its final frame after the promise settles.
  current.then(() =>
    requestAnimationFrame(() => {
      if (id === generation) clearStyles(elements);
    }),
  );
}

/** Fades the page up and out, then runs `navigate`; returns false when the link should navigate untouched. */
export function leavePage(destination: URL, navigate: () => void): boolean {
  if (
    destination.origin !== window.location.origin ||
    destination.pathname === window.location.pathname ||
    prefersReducedMotion()
  ) {
    return false;
  }

  pendingNavigate = navigate;
  if (leaving) return true;
  leaving = true;
  fromHistory = false;
  window.clearTimeout(recoverTimer);

  const id = ++generation;
  animation?.stop();
  const current = animate(pageElements(), { opacity: 0, y: -OFFSET_PX }, LEAVE);
  animation = current;
  current.then(() => {
    if (id !== generation) return;
    leaving = false;
    const go = pendingNavigate;
    pendingNavigate = undefined;
    recoverTimer = window.setTimeout(() => {
      if (id === generation) reveal(-OFFSET_PX, ENTER);
    }, RECOVER_MS);
    go?.();
  });
  return true;
}

/** Brings a newly rendered page in: rising from below, or dropping from above after Back or Forward. */
export function enterPage(pathname: string) {
  const previous = lastPathname;
  lastPathname = pathname;
  if (previous === undefined || previous === pathname) return;

  leaving = false;
  pendingNavigate = undefined;
  window.clearTimeout(recoverTimer);
  const offset = fromHistory ? -OFFSET_PX : OFFSET_PX;
  fromHistory = false;
  reveal(offset, ENTER);
}
