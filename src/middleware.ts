import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
export { default } from "next-auth/middleware";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
   const token = await getToken({ req: request });

   const path = request.nextUrl.pathname;
   const publicPaths = ["/signin", "/signup", "/verify", "/"];
   const isPublicPath = publicPaths.some((e) => path.startsWith(e));

   if (isPublicPath && token) {
      return NextResponse.redirect(new URL("/", request.url));
   }

   if (!isPublicPath && !token) {
      return NextResponse.redirect(new URL("/signin", request.url));
   }
}

export const config = {
   matcher: ["/signin", "/signup", "/", "/dashboard/:path*", "/verify/:path*"],
};
