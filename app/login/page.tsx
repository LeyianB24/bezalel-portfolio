/* eslint-disable @next/next/no-img-element */
"use client"

import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { KeyRound, Mail, Loader2, ArrowLeft, ShieldCheck } from "lucide-react"
import Link from "next/link"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawCallbackUrl = searchParams.get("callbackUrl") || "/studio"
  const errorParam = searchParams.get("error")

  // Ensure callbackUrl is always relative within the current host (prevents localhost redirect leaks)
  let callbackUrl = "/studio"
  try {
    if (rawCallbackUrl.startsWith("/")) {
      callbackUrl = rawCallbackUrl
    } else {
      const parsed = new URL(rawCallbackUrl)
      callbackUrl = parsed.pathname + parsed.search + parsed.hash || "/studio"
    }
  } catch {
    callbackUrl = "/studio"
  }

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (res?.error) {
        toast.error("Invalid credentials. Access denied.")
      } else {
        toast.success("Welcome back. System online.")
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      toast.error("An error occurred during authentication.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="z-10 w-full max-w-md space-y-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8 shadow-2xl backdrop-blur-xl">
      {/* Official Brand Logo/Header */}
      <div className="space-y-3 text-center">
        <div className="flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-accent/40 bg-accent/15 p-2 shadow-inner">
            <img
              src="/logos/bezalel-mark-gold.svg"
              alt="Bezalel Technologies"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-center">
            <img
              src="/logos/bezalel-logo-horizontal-light.png"
              alt="Bezalel Technologies"
              className="h-8 w-auto object-contain"
            />
          </div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-accent-light/90 mt-1">
            EXECUTIVE STUDIO OPS • ADMIN TERMINAL
          </p>
        </div>
      </div>

      {errorParam === "Unauthorized" && (
        <div className="rounded-md border border-red-500/20 bg-red-950/20 p-3 text-center text-xs font-mono text-red-400 animate-pulse">
          ACCESS_DENIED: ADMIN_PRIVILEGES_REQUIRED
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
        {/* Email input */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
            Operator Email
          </label>
          <div className="relative">
            <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="email"
              required
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@bezalelstudio.com"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950/90 py-2.5 pr-4 pl-10 text-zinc-100 outline-none transition-all placeholder:text-zinc-600 focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-55"
            />
          </div>
        </div>

        {/* Password input */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">
            Passkey Code
          </label>
          <div className="relative">
            <KeyRound className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="password"
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950/90 py-2.5 pr-4 pl-10 text-zinc-100 outline-none transition-all placeholder:text-zinc-600 focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-55"
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent py-3 font-bold text-accent-foreground transition-all hover:bg-accent-light shadow-md disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              VERIFYING CREDENTIALS...
            </>
          ) : (
            <>
              <ShieldCheck size={16} />
              AUTHENTICATE CONSOLE //
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 text-zinc-100 selection:bg-accent/30 selection:text-accent-light">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(201,162,75,0.12),rgba(0,0,0,0))] pointer-events-none" />
      
      {/* Back to site button */}
      <Link 
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-400 transition-colors hover:text-zinc-100"
      >
        <ArrowLeft size={14} /> Back to Site
      </Link>

      <Suspense fallback={
        <div className="z-10 w-full max-w-md text-center py-10 font-mono text-zinc-400">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-accent mb-2" />
          BOOTING_SECURE_TERMINAL...
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  )
}
