import type { NextAuthConfig } from "next-auth"
import { Role, AdminPermission } from "@prisma/client"

export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.permissions = user.permissions;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as Role;
        session.user.permissions = token.permissions as AdminPermission[];
      }
      return session;
    },
  },
  providers: [], // Configured with full dependencies in auth.ts
} satisfies NextAuthConfig;
