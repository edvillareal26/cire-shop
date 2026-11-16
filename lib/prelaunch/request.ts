import { NextResponse, type NextRequest } from "next/server";

const PREVIEW_KEY = process.env.PRELAUNCH_PREVIEW_KEY;
const PREVIEW_COOKIE = "cire_preview";
const PREVIEW_MAX_AGE = 60 * 60 * 24 * 60;
const PREVIEW_PARAM = "preview";
const PRELAUNCH_PATH = "/join";
// Webhooks, the cart API, Shopify's agent endpoints, and public images keep working before launch.
const OPEN_PATH = /^\/(?:api|\.well-known|images)\//;

// `?preview=<key>` stores the key in a cookie that shows the full site; any other value clears it.
export function getPrelaunchPreviewRedirect(request: NextRequest): NextResponse | null {
  const value = request.nextUrl.searchParams.get(PREVIEW_PARAM);
  if (!PREVIEW_KEY || value === null) return null;

  const url = request.nextUrl.clone();
  url.searchParams.delete(PREVIEW_PARAM);
  const response = NextResponse.redirect(url);
  if (value === PREVIEW_KEY) {
    response.cookies.set(PREVIEW_COOKIE, PREVIEW_KEY, {
      httpOnly: true,
      maxAge: PREVIEW_MAX_AGE,
      path: "/",
      sameSite: "lax",
      secure: url.protocol === "https:",
    });
  } else {
    response.cookies.delete(PREVIEW_COOKIE);
  }
  return response;
}

export function getPrelaunchRewritePath(request: NextRequest): string | null {
  if (!PREVIEW_KEY) return null;
  const { pathname } = request.nextUrl;
  if (pathname === PRELAUNCH_PATH || OPEN_PATH.test(pathname)) return null;
  return request.cookies.get(PREVIEW_COOKIE)?.value === PREVIEW_KEY ? null : PRELAUNCH_PATH;
}
