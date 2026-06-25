import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Les claviers mobiles capitalisent souvent automatiquement la première lettre
// d'une URL tapée à la main (ex: /Dashboard), ce qui donne un 404 sur les routes
// Next.js (sensibles à la casse) alors que la même URL fonctionne au clavier desktop.
// On normalise systématiquement vers la casse minuscule.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const lower = pathname.toLowerCase();

  if (pathname !== lower) {
    const url = request.nextUrl.clone();
    url.pathname = lower;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/).*)"],
};
