import { describe, it, expect, vi } from "vitest";

// Mock Next.js and Auth runtime dependencies
vi.mock("@/auth", () => ({
  auth: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

import { hasPermission, ADMIN_PERMISSIONS_LIST } from "@/lib/permissions";
import { AdminPermission } from "@prisma/client";

describe("RBAC Permissions: hasPermission", () => {
  it("allows access when no required permission is specified", () => {
    expect(hasPermission([], undefined)).toBe(true);
    expect(hasPermission(["CAREERS"], undefined)).toBe(true);
    expect(hasPermission(null, undefined)).toBe(true);
  });

  it("defaults to granting access when user permissions array is null or empty (legacy session compatibility)", () => {
    expect(hasPermission(null, "PORTFOLIO")).toBe(true);
    expect(hasPermission(undefined, "STORE")).toBe(true);
    expect(hasPermission([], "MESSAGES")).toBe(true);
  });

  it("grants full access across all permissions when user has FULL_ACCESS", () => {
    const superAdminPerms: AdminPermission[] = ["FULL_ACCESS"];
    
    for (const permDef of ADMIN_PERMISSIONS_LIST) {
      expect(hasPermission(superAdminPerms, permDef.key)).toBe(true);
    }
  });

  it("grants access only to specifically assigned permissions for granular roles", () => {
    const editorPerms: AdminPermission[] = ["PORTFOLIO", "CAREERS"];

    expect(hasPermission(editorPerms, "PORTFOLIO")).toBe(true);
    expect(hasPermission(editorPerms, "CAREERS")).toBe(true);
    expect(hasPermission(editorPerms, "STORE")).toBe(false);
    expect(hasPermission(editorPerms, "PROJECTS_QUOTATIONS")).toBe(false);
    expect(hasPermission(editorPerms, "EQUIPMENT")).toBe(false);
    expect(hasPermission(editorPerms, "TECH_ARSENAL")).toBe(false);
    expect(hasPermission(editorPerms, "MESSAGES")).toBe(false);
    expect(hasPermission(editorPerms, "FULL_ACCESS")).toBe(false);
  });

  it("handles multiple permissions correctly", () => {
    const opsPerms: AdminPermission[] = ["STORE", "EQUIPMENT", "MESSAGES"];

    expect(hasPermission(opsPerms, "STORE")).toBe(true);
    expect(hasPermission(opsPerms, "EQUIPMENT")).toBe(true);
    expect(hasPermission(opsPerms, "MESSAGES")).toBe(true);
    expect(hasPermission(opsPerms, "PORTFOLIO")).toBe(false);
  });
});
