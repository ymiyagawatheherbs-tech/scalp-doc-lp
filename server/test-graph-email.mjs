import { ConfidentialClientApplication } from "@azure/msal-node";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env") });

const clientId = process.env.AZURE_CLIENT_ID;
const tenantId = process.env.AZURE_TENANT_ID;
const clientSecret = process.env.AZURE_CLIENT_SECRET;
const smtpUser = process.env.SMTP_USER || "cx1@the-herbs.co.jp";
const notifyEmail = process.env.NOTIFY_EMAIL || "cx1@the-herbs.co.jp";

console.log("=== Microsoft Graph API メール送信テスト ===");
console.log("From:", smtpUser);
console.log("To:", notifyEmail);

if (!clientId || !tenantId || !clientSecret) {
  console.error("必要な環境変数が設定されていません");
  process.exit(1);
}

try {
  // Graph APIトークン取得
  console.log("\n1. Graph APIトークンを取得中...");
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

  if (!result?.accessToken) {
    throw new Error("トークン取得失敗");
  }
  console.log("✓ Graph APIトークン取得成功");

  // Graph APIでメール送信
  console.log("\n2. Graph APIでメール送信中...");
  const sendMailUrl = `https://graph.microsoft.com/v1.0/users/${smtpUser}/sendMail`;

  const mailBody = {
    message: {
      subject: "【テスト】スカルプドック予約システム Graph API メール送信テスト",
      body: {
        contentType: "Text",
        content: `これはスカルプドック予約システムのテストメールです（Graph API経由）。

送信日時：${new Date().toLocaleString("ja-JP")}
送信元：${smtpUser}
送信先：${notifyEmail}

このメールが届いていれば、Microsoft Graph API認証が正常に機能しています。

THE HERBS SCALP LAB 予約管理システム`,
      },
      toRecipients: [
        {
          emailAddress: {
            address: notifyEmail,
          },
        },
      ],
    },
    saveToSentItems: false,
  };

  const response = await fetch(sendMailUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${result.accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(mailBody),
  });

  if (response.status === 202) {
    console.log("✓ メール送信成功！（202 Accepted）");
    console.log(`  → ${notifyEmail} にメールが届いているか確認してください`);
  } else {
    const errorText = await response.text();
    console.error(`✗ 送信失敗: ${response.status} ${response.statusText}`);
    console.error("  詳細:", errorText.substring(0, 500));
    process.exit(1);
  }

} catch (err) {
  console.error("✗ エラー:", err.message);
  process.exit(1);
}
