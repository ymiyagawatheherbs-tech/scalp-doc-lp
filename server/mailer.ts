import { ConfidentialClientApplication } from "@azure/msal-node";
import { ENV } from "./_core/env";

/**
 * Microsoft Graph API アクセストークンを取得する
 */
async function getGraphAccessToken(): Promise<string> {
  const msalClient = new ConfidentialClientApplication({
    auth: {
      clientId: ENV.azureClientId,
      authority: `https://login.microsoftonline.com/${ENV.azureTenantId}`,
      clientSecret: ENV.azureClientSecret,
    },
  });

  const result = await msalClient.acquireTokenByClientCredential({
    scopes: ["https://graph.microsoft.com/.default"],
  });

  if (!result?.accessToken) {
    throw new Error("[mailer] Failed to acquire Graph API access token");
  }

  return result.accessToken;
}

export interface BookingNotificationData {
  storeName: string;
  name: string;
  phone: string;
  email: string;
  course: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
  submittedAt: string;
}

/**
 * 神戸阪急店の予約申し込みをcx1@the-herbs.co.jpへメール通知する
 * Microsoft Graph API (Mail.Send) を使用
 */
export async function sendBookingNotification(data: BookingNotificationData): Promise<boolean> {
  if (!ENV.smtpUser || !ENV.azureClientId || !ENV.azureTenantId || !ENV.azureClientSecret) {
    console.warn("[mailer] Graph API credentials not configured. Skipping email notification.");
    return false;
  }

  const courseLabels: Record<string, string> = {
    free_check: "無料頭皮チェック（初回）",
    regular_care: "定期頭皮ケア",
    consultation: "まずは相談したい",
  };

  const timeLabels: Record<string, string> = {
    "12:00": "12:00〜",
    "12:30": "12:30〜",
    "13:00": "13:00〜",
    "13:30": "13:30〜",
    "14:00": "14:00〜",
    "14:30": "14:30〜",
    "15:00": "15:00〜",
    "15:30": "15:30〜",
    "16:00": "16:00〜",
    "随時受付（時間帯ご相談）": "随時受付（時間帯ご相談）",
  };

  const courseLabel = courseLabels[data.course] ?? data.course;
  const timeLabel = timeLabels[data.preferredTime] ?? data.preferredTime;

  const subject = `【THE HERBS SCALP LAB】新規予約申し込み：${data.name} 様`;

  const htmlBody = `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"></head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #2a1a0a; color: #c9a96e; padding: 20px 24px; border-radius: 4px 4px 0 0;">
    <h1 style="margin: 0; font-size: 18px; letter-spacing: 0.1em;">THE HERBS SCALP LAB</h1>
    <p style="margin: 4px 0 0; font-size: 12px; opacity: 0.8;">新規予約申し込み通知</p>
  </div>
  <div style="background: #fff; border: 1px solid #e8ddd0; border-top: none; padding: 24px; border-radius: 0 0 4px 4px;">
    <p style="font-size: 15px; margin-top: 0;"><strong>${data.name} 様</strong>より予約申し込みがありました。</p>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tr style="border-bottom: 1px solid #f0e8e0;">
        <td style="padding: 10px 8px; color: #888; width: 130px;">店舗</td>
        <td style="padding: 10px 8px; font-weight: bold;">${data.storeName}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f0e8e0;">
        <td style="padding: 10px 8px; color: #888;">お名前</td>
        <td style="padding: 10px 8px;">${data.name} 様</td>
      </tr>
      <tr style="border-bottom: 1px solid #f0e8e0;">
        <td style="padding: 10px 8px; color: #888;">電話番号</td>
        <td style="padding: 10px 8px;"><a href="tel:${data.phone}" style="color: #c9a96e;">${data.phone}</a></td>
      </tr>
      <tr style="border-bottom: 1px solid #f0e8e0;">
        <td style="padding: 10px 8px; color: #888;">メールアドレス</td>
        <td style="padding: 10px 8px;"><a href="mailto:${data.email}" style="color: #c9a96e;">${data.email}</a></td>
      </tr>
      <tr style="border-bottom: 1px solid #f0e8e0;">
        <td style="padding: 10px 8px; color: #888;">ご希望コース</td>
        <td style="padding: 10px 8px; font-weight: bold; color: #8b5e3c;">${courseLabel}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f0e8e0;">
        <td style="padding: 10px 8px; color: #888;">ご希望日</td>
        <td style="padding: 10px 8px;">${data.preferredDate}</td>
      </tr>
      <tr style="border-bottom: 1px solid #f0e8e0;">
        <td style="padding: 10px 8px; color: #888;">ご希望時間</td>
        <td style="padding: 10px 8px;">${timeLabel}</td>
      </tr>
      ${data.message ? `
      <tr style="border-bottom: 1px solid #f0e8e0;">
        <td style="padding: 10px 8px; color: #888; vertical-align: top;">メッセージ</td>
        <td style="padding: 10px 8px;">${data.message.replace(/\n/g, "<br>")}</td>
      </tr>` : ""}
      <tr>
        <td style="padding: 10px 8px; color: #888;">申し込み日時</td>
        <td style="padding: 10px 8px; font-size: 12px; color: #999;">${data.submittedAt}</td>
      </tr>
    </table>
    <div style="margin-top: 20px; padding: 14px 16px; background: #fdf8f3; border-left: 3px solid #c9a96e; font-size: 13px; color: #666; line-height: 1.7;">
      ※ ご返信をもってご予約確定となります。<br>
      ※ ご希望に添えない場合がございます。<br>
      ※ 余裕を持ったご予約をお願いいたします。
    </div>
  </div>
  <p style="font-size: 11px; color: #aaa; text-align: center; margin-top: 16px;">
    THE HERBS SCALP LAB 予約管理システム
  </p>
</body>
</html>
`.trim();

  try {
    const accessToken = await getGraphAccessToken();

    const sendMailUrl = `https://graph.microsoft.com/v1.0/users/${ENV.smtpUser}/sendMail`;

    const mailBody = {
      message: {
        subject,
        body: {
          contentType: "HTML",
          content: htmlBody,
        },
        toRecipients: [
          {
            emailAddress: {
              address: ENV.notifyEmail,
            },
          },
        ],
      },
      saveToSentItems: false,
    };

    const response = await fetch(sendMailUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(mailBody),
    });

    if (response.status === 202) {
      console.log(`[mailer] Booking notification sent to ${ENV.notifyEmail} via Graph API`);
      return true;
    } else {
      const errorText = await response.text();
      console.error(`[mailer] Graph API error: ${response.status} ${errorText.substring(0, 200)}`);
      return false;
    }
  } catch (err) {
    console.error("[mailer] Failed to send booking notification:", err);
    return false;
  }
}
