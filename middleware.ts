import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
import { NextResponse } from "next/server"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const isStudioRoute = nextUrl.pathname.startsWith("/studio")
  const isLoginRoute = nextUrl.pathname === "/login"

  if (isStudioRoute) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", nextUrl)
      loginUrl.searchParams.set("callbackUrl", nextUrl.pathname)
      return NextResponse.redirect(loginUrl)
    }

    const userRole = req.auth?.user?.role
    if (userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/?error=Unauthorized", nextUrl))
    }
  }

  if (isLoginRoute && isLoggedIn) {
    const userRole = req.auth?.user?.role
    if (userRole === "ADMIN") {
      return NextResponse.redirect(new URL("/studio", nextUrl))
    }
    return NextResponse.redirect(new URL("/", nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/studio/:path*", "/login"],
}
