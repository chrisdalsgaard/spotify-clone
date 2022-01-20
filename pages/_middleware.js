import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.JWT_SECRET });
  const { pathname } = req.nextUrl;

  // Allow requests to the auth endpoint or if user has a token
  if (pathname.includes("/api/auth") || token) {
    return NextResponse.next();
  }

  // Redirect all unauthenticated users to the login page
  if (!token && pathname !== "/login") {
    return NextResponse.redirect("/login");
  }
}
