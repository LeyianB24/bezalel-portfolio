import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import { z } from "zod"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import { authConfig } from "./auth.config"
import { loginLimiter } from "@/lib/ratelimit"

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  trustHost: true,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials)

        if (!parsedCredentials.success) {
          return null
        }

        const { email, password } = parsedCredentials.data

        // Rate limit by email to prevent brute-force / credential stuffing
        const limitResult = await loginLimiter.limit(`login:${email.toLowerCase().trim()}`)
        if (!limitResult.success) {
          throw new Error("Too many login attempts. Please wait 1 minute before trying again.")
        }

        const user = await prisma.user.findUnique({
          where: { email: email.toLowerCase().trim() },
        })

        if (!user || !user.password) {
          return null
        }

        const passwordsMatch = await bcrypt.compare(password, user.password)

        if (passwordsMatch) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            permissions: user.permissions,
            image: user.image,
          }
        }

        return null
      },
    }),
  ],
})
