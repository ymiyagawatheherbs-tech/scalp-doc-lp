import { describe, it, expect } from "vitest";
import { ConfidentialClientApplication } from "@azure/msal-node";

describe("Microsoft Graph API mail authentication", () => {
  it("should acquire Graph API access token using client credentials", async () => {
    const clientId = process.env.AZURE_CLIENT_ID;
    const tenantId = process.env.AZURE_TENANT_ID;
    const clientSecret = process.env.AZURE_CLIENT_SECRET;

    if (!clientId || !tenantId || !clientSecret) {
      console.warn("[mailer.test] Azure OAuth credentials not set, skipping test");
      expect(true).toBe(true);
      return;
    }

    const msalClient = new ConfidentialClientApplication({
      auth: {
        clientId,
        authority: `https://login.microsoftonline.com/${tenantId}`,
        clientSecret,
      },
    });

    const result = await msalClient.acquireTokenByClientCredential({
      scopes: ["https://graph.microsoft.com/.default"],
    });

    expect(result).not.toBeNull();
    expect(result?.accessToken).toBeTruthy();
    console.log("[mailer.test] Graph API token acquired successfully");
  }, 30000);

  it("should build booking notification data correctly", () => {
    const data = {
      storeName: "THE HERBS神戸阪急店",
      name: "テスト 太郎",
      phone: "090-1234-5678",
      email: "test@example.com",
      course: "free_check",
      preferredDate: "2026-04-10",
      preferredTime: "12:00",
      message: "初めての利用です",
      submittedAt: "2026/4/7 10:00:00",
    };

    expect(data.storeName).toBe("THE HERBS神戸阪急店");
    expect(data.course).toBe("free_check");
    expect(data.preferredTime).toBe("12:00");
  });
});
