import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { clerkClient } from "@clerk/nextjs/server";

const isStudentRoute = createRouteMatcher(["/user/(.*)"]);
const isTeacherRoute = createRouteMatcher(["/teacher/(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims, userId } = await auth();
  
  let userRole: "student" | "teacher" = "student";
  
  // Try to get from session claims first
  if (sessionClaims?.publicMetadata) {
    userRole =
      (sessionClaims.publicMetadata as { userType?: "student" | "teacher" })
        ?.userType || "student";
  } else if (userId) {
    // Fallback: Fetch from Clerk API if not in token
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      userRole = (user.publicMetadata.userType as "student" | "teacher") || "student";
    } catch (error) {
      console.error("❌ Error fetching user:", error);
      userRole = "student"; // Default to student on error
    }
  }

  console.log("🔍 Middleware check:", {
    path: req.nextUrl.pathname,
    userId,
    userRole,
    hasPublicMetadata: !!sessionClaims?.publicMetadata,
  });

  if (isStudentRoute(req)) {
    if (userRole !== "student") {
      const url = new URL("/teacher/courses", req.url);
      return NextResponse.redirect(url);
    }
  }

  if (isTeacherRoute(req)) {
    if (userRole !== "teacher") {
      const url = new URL("/user/courses", req.url);
      return NextResponse.redirect(url);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
