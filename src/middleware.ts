import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
export { default } from "next-auth/middleware";

export async function middleware(req: NextRequest) {
   const token = await getToken({ 
      req,
      secret: process.env.NEXT_AUTH_SECRET 
   });

   const path = req.nextUrl.pathname;
   const publicPaths = ["/signin", "/signup", "/verify"];
   const isPublicPath = publicPaths.some((e) => path.startsWith(e));

   if (isPublicPath && token) {
      return NextResponse.redirect(new URL("/", req.url));
   }

   if (!(isPublicPath || path == "/") && !token) {
      return NextResponse.redirect(new URL("/signin", req.url));
   }

   return NextResponse.next();
}

// if add "/u/username" then not access non sign in user
export const config = {
   matcher: ["/signin", "/signup", "/", "/dashboard/:path*", "/verify/:path*"],
};
