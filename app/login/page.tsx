"use client"

import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { KeyRound, Mail, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/studio"
  const errorParam = searchParams.get("error")

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
    } catch (error) {
      toast.error("An error occurred during authentication.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="z-10 w-full max-w-md space-y-6 rounded-xl border border-zinc-800 bg-zinc-900/40 p-8 shadow-2xl backdrop-blur-md">
      {/* Logo/Header */}
      <div className="space-y-2 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 text-emerald-500 font-mono font-bold text-lg shadow-inner">
          B//
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white font-mono">
          SECURE_LOGIN
        </h2>
        <p className="text-xs font-mono uppercase tracking-wider text-zinc-500">
          Bezalel Studio Terminal Access
        </p>
      </div>

      {errorParam === "Unauthorized" && (
        <div className="rounded-md border border-red-500/20 bg-red-950/20 p-3 text-center text-xs font-mono text-red-400 animate-pulse">
          ACCESS_DENIED: ADMIN_PRIVILEGES_REQUIRED
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
        {/* Email input */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
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
              className="w-full rounded-md border border-zinc-800 bg-zinc-950 py-2.5 pr-4 pl-10 text-zinc-200 outline-none transition-all placeholder:text-zinc-700 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 disabled:opacity-55"
            />
          </div>
        </div>

        {/* Password input */}
        <div className="space-y-1.5">
          <label className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
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
              className="w-full rounded-md border border-zinc-800 bg-zinc-950 py-2.5 pr-4 pl-10 text-zinc-200 outline-none transition-all placeholder:text-zinc-700 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 disabled:opacity-55"
            />
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-emerald-600 py-3 font-semibold text-white transition-all hover:bg-emerald-500 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              VERIFYING...
            </>
          ) : (
            "AUTHENTICATE //"
          )}
        </button>
      </form>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-4 text-zinc-100 selection:bg-emerald-600/30 selection:text-emerald-500">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(5,150,105,0.08),rgba(255,255,255,0))]" />
      
      {/* Back to site button */}
      <Link 
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-zinc-500 transition-colors hover:text-zinc-200"
      >
        <ArrowLeft size={14} /> Back to Site
      </Link>

      <Suspense fallback={
        <div className="z-10 w-full max-w-md text-center py-10 font-mono text-zinc-500">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-emerald-500 mb-2" />
          BOOTING_SECURE_Terminal...
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  )
}
