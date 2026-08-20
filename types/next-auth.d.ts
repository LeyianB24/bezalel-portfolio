import { DefaultSession } from "next-auth"
import { Role, AdminPermission } from "@prisma/client"

declare module "next-auth" {
  interface User {
    role?: Role
    permissions?: AdminPermission[]
  }
  interface Session {
    user: {
      id: string
      role?: Role
      permissions?: AdminPermission[]
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    role?: Role
    permissions?: AdminPermission[]
  }
}
