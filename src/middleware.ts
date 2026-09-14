import { NextRequest, NextResponse } from "next/server";

const CANONICAL_HOST = "hybridpro.in";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  if (
    process.env.VERCEL_ENV === "production" &&
    host.endsWith(".vercel.app")
  ) {
    const url = request.nextUrl.clone();
    url.host = CANONICAL_HOST;
    url.protocol = "https:";
    url.port = "";
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
