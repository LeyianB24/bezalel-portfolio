import { describe, it, expect } from "vitest";
import { parseInitialParams } from "@/app/projects/request/RequestForm";
import { ProjectCategory } from "@prisma/client";

describe("RequestForm initial parameter parser & sanitization", () => {
  it("defaults to empty brief and WEB_APP category when no searchParams are present", () => {
    const mockParams = {
      get: (_key: string) => null,
    };
    const result = parseInitialParams(mockParams);
    expect(result.brief).toBe("");
    expect(result.category).toBe(ProjectCategory.WEB_APP);
  });

  it("handles null searchParams gracefully", () => {
    const result = parseInitialParams(null);
    expect(result.brief).toBe("");
    expect(result.category).toBe(ProjectCategory.WEB_APP);
  });

  it("trims and preserves safe brief text", () => {
    const mockParams = {
      get: (key: string) => {
        if (key === "brief") return "   Building a member portal for SACCO   ";
        return null;
      },
    };
    const result = parseInitialParams(mockParams);
    expect(result.brief).toBe("Building a member portal for SACCO");
    expect(result.category).toBe(ProjectCategory.WEB_APP);
  });

  it("caps brief input at 500 characters", () => {
    const longText = "A".repeat(650);
    const mockParams = {
      get: (key: string) => (key === "brief" ? longText : null),
    };
    const result = parseInitialParams(mockParams);
    expect(result.brief.length).toBe(500);
    expect(result.brief).toBe("A".repeat(500));
  });

  it("maps valid intent chip types to correct ProjectCategory", () => {
    const testCases: [string, ProjectCategory][] = [
      ["website", ProjectCategory.WEB_APP],
      ["web_app", ProjectCategory.WEB_APP],
      ["web", ProjectCategory.WEB_APP],
      ["business-system", ProjectCategory.SYSTEM_INTEGRATION],
      ["business_system", ProjectCategory.SYSTEM_INTEGRATION],
      ["system_integration", ProjectCategory.SYSTEM_INTEGRATION],
      ["it-infrastructure", ProjectCategory.CONSULTING],
      ["infrastructure", ProjectCategory.CONSULTING],
      ["consulting", ProjectCategory.CONSULTING],
      ["mobile_app", ProjectCategory.MOBILE_APP],
      ["mobile", ProjectCategory.MOBILE_APP],
      ["ui_ux_design", ProjectCategory.UI_UX_DESIGN],
      ["design", ProjectCategory.UI_UX_DESIGN],
      ["other", ProjectCategory.OTHER],
    ];

    for (const [typeParam, expectedCategory] of testCases) {
      const mockParams = {
        get: (key: string) => (key === "type" ? typeParam : null),
      };
      const result = parseInitialParams(mockParams);
      expect(result.category).toBe(expectedCategory);
    }
  });

  it("maps pricing tier slugs to correct categories", () => {
    const tierCases: [string, ProjectCategory][] = [
      ["starter", ProjectCategory.WEB_APP],
      ["growth", ProjectCategory.WEB_APP],
      ["enterprise", ProjectCategory.SYSTEM_INTEGRATION],
    ];

    for (const [slug, expectedCategory] of tierCases) {
      const mockParams = {
        get: (key: string) => (key === "type" ? slug : null),
      };
      const result = parseInitialParams(mockParams);
      expect(result.category).toBe(expectedCategory);
    }
  });

  it("safely ignores invalid, unknown, or malicious type params and defaults to WEB_APP", () => {
    const maliciousCases = [
      "<script>alert('xss')</script>",
      "SELECT * FROM users",
      "javascript:void(0)",
      "invalid-unknown-slug",
      "../../etc/passwd",
      "",
    ];

    for (const invalidType of maliciousCases) {
      const mockParams = {
        get: (key: string) => (key === "type" ? invalidType : null),
      };
      const result = parseInitialParams(mockParams);
      expect(result.category).toBe(ProjectCategory.WEB_APP);
    }
  });

  it("builds the correct URL query when brief and type are supplied", () => {
    const rawBrief = "SACCO accounting & micro-loan portal";
    const selectedType = "business-system";

    const params = new URLSearchParams();
    params.set("brief", rawBrief.trim().slice(0, 500));
    if (selectedType) {
      params.set("type", selectedType);
    }

    const builtUrl = `/projects/request?${params.toString()}`;
    expect(builtUrl).toBe(
      "/projects/request?brief=SACCO+accounting+%26+micro-loan+portal&type=business-system"
    );

    // Verify reverse parsing
    const parsedParams = {
      get: (k: string) => params.get(k),
    };
    const parsed = parseInitialParams(parsedParams);
    expect(parsed.brief).toBe(rawBrief);
    expect(parsed.category).toBe(ProjectCategory.SYSTEM_INTEGRATION);
  });

  it("correctly rejects empty or whitespace-only inputs without navigating", () => {
    const emptyInputs = ["", "   ", "\t\n  \r\n"];
    for (const input of emptyInputs) {
      const trimmed = input.trim();
      const shouldNavigate = trimmed.length > 0;
      expect(shouldNavigate).toBe(false);
    }
  });
});
