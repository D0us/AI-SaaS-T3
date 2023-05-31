import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
// import { NextResponse } from "next/server";

export default authMiddleware({
  publicRoutes: ["/api/webhooks"],
  afterAuth(auth, req, evt) {
    // handle users who aren't authenticated
    // if (!auth.userId && !auth.isPublicRoute) {
    //   const signInUrl = new URL("/sign-in", req.url);
    //   signInUrl.searchParams.set("redirect_url", req.url);
    //   return NextResponse.redirect(signInUrl);
    // }
    // // rededirect them to organization selection page
    // if (!auth.orgId) {
    //   const orgSelection = new URL("/org-selection", req.url);
    //   return NextResponse.redirect(orgSelection);
    // }
    return NextResponse.next();
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
