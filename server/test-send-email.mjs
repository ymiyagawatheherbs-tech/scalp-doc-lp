import { ConfidentialClientApplication } from "@azure/msal-node";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env") });

const clientId = process.env.AZURE_CLIENT_ID;
const tenantId = process.env.AZURE_TENANT_ID;
const clientSecret = process.env.AZURE_CLIENT_SECRET;
const smtpUser = process.env.SMTP_USER;
const notifyEmail = process.env.NOTIFY_EMAIL || "cx1@the-herbs.co.jp";

console.log("=== SMTP OAuth2 テスト送信 ===");
console.log("From:", smtpUser);
console.log("To:", notifyEmail);
console.log("Client ID:", clientId?.substring(0, 8) + "...");

if (!clientId || !tenantId || !clientSecret || !smtpUser) {
  console.error("必要な環境変数が設定されていません");
  process.exit(1);
}

try {
  // OAuthトークン取得
  console.log("\n1. OAuthトークンを取得中...");
  const msalClient = new ConfidentialClientApplication({
    auth: {
      clientId,
      authority: `https://login.microsoftonline.com/${tenantId}`,
      clientSecret,
    },
  });

  const result = await msalClient.acquireTokenByClientCredential({
    scopes: ["https://outlook.office365.com/.default"],
  });

  if (!result?.accessToken) {
    throw new Error("トークン取得失敗");
  }
  console.log("✓ トークン取得成功");

  // SMTP送信
  console.log("\n2. メール送信中...");
  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false,
    auth: {
      type: "OAuth2",
      user: smtpUser,
      accessToken: result.accessToken,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  await transporter.sendMail({
    from: `"THE HERBS SCALP LAB 予約システム" <${smtpUser}>`,
    to: notifyEmail,
    subject: "【テスト】スカルプドック予約システム メール送信テスト",
    text: `
これはスカルプドック予約システムのテストメールです。

送信日時：${new Date().toLocaleString("ja-JP")}
送信元：${smtpUser}
送信先：${notifyEmail}

このメールが届いていれば、SMTP OAuth2認証が正常に機能しています。

THE HERBS SCALP LAB 予約管理システム
    `.trim(),
  });

  console.log("✓ メール送信成功！");
  console.log(`  → ${notifyEmail} にメールが届いているか確認してください`);

} catch (err) {
  console.error("✗ エラー:", err.message);
  if (err.errorCode) {
    console.error("  エラーコード:", err.errorCode);
  }
  process.exit(1);
}
