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

  const subject = `【THE HERBS SCALP LABO】新規予約申し込み：${data.name} 様`;

  const htmlBody = `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"></head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #2a1a0a; color: #c9a96e; padding: 20px 24px; border-radius: 4px 4px 0 0;">
    <h1 style="margin: 0; font-size: 18px; letter-spacing: 0.1em;">THE HERBS SCALP LABO</h1>
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
    THE HERBS SCALP LABO 予約管理システム
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

export interface CustomerConfirmationData {
  name: string;
  phone: string;
  email: string;
  course: string;
  preferredDate: string;
  preferredTime: string;
  storeName: string;
  message?: string;
  submittedAt: string;
}

/**
 * お客様へ予約受付確認メールを送信する
 * Microsoft Graph API (Mail.Send) を使用
 */
export async function sendCustomerConfirmation(data: CustomerConfirmationData): Promise<boolean> {
  if (!ENV.smtpUser || !ENV.azureClientId || !ENV.azureTenantId || !ENV.azureClientSecret) {
    console.warn("[mailer] Graph API credentials not configured. Skipping customer confirmation.");
    return false;
  }

  const courseLabels: Record<string, string> = {
    free_check: "無料頭皮チェック（初回）",
    regular_care: "定期頭皮ケア",
    consultation: "まずは相談したい",
  };
  const courseLabel = courseLabels[data.course] ?? data.course;

  const subject = `【THE HERBS SCALP LABO】ご予約を受け付けました — ${data.name} 様`;
  const htmlBody = `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"></head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #2a1a0a; color: #c9a96e; padding: 20px 24px; border-radius: 4px 4px 0 0;">
    <h1 style="margin: 0; font-size: 18px; letter-spacing: 0.1em;">THE HERBS SCALP LABO</h1>
    <p style="margin: 4px 0 0; font-size: 12px; opacity: 0.8;">ご予約受付確認</p>
  </div>
  <div style="background: #fff; border: 1px solid #e8ddd0; border-top: none; padding: 24px; border-radius: 0 0 4px 4px;">
    <p style="font-size: 15px; margin-top: 0;">${data.name} 様</p>
    <p style="font-size: 14px; line-height: 1.8; color: #555;">
      この度はTHE HERBS SCALP LABOへのご予約申し込みをいただき、誠にありがとうございます。<br>
      以下の内容でご予約を受け付けました。<br>
      担当者より改めてご連絡いたしますので、しばらくお待ちください。
    </p>
    <div style="background: #fdf8f3; border: 1px solid #e8ddd0; border-radius: 4px; padding: 16px 20px; margin: 20px 0;">
      <p style="font-size: 12px; letter-spacing: 0.1em; color: #c9a96e; font-weight: bold; margin: 0 0 12px;">ご予約内容</p>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr style="border-bottom: 1px solid #f0e8e0;">
          <td style="padding: 8px 6px; color: #888; width: 120px;">店舗</td>
          <td style="padding: 8px 6px; font-weight: bold;">${data.storeName}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f0e8e0;">
          <td style="padding: 8px 6px; color: #888;">ご希望コース</td>
          <td style="padding: 8px 6px; font-weight: bold; color: #8b5e3c;">${courseLabel}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f0e8e0;">
          <td style="padding: 8px 6px; color: #888;">ご希望日時</td>
          <td style="padding: 8px 6px;">${data.preferredDate}（${data.preferredTime}〜）</td>
        </tr>
        <tr style="border-bottom: 1px solid #f0e8e0;">
          <td style="padding: 8px 6px; color: #888;">お名前</td>
          <td style="padding: 8px 6px;">${data.name} 様</td>
        </tr>
        <tr style="border-bottom: 1px solid #f0e8e0;">
          <td style="padding: 8px 6px; color: #888;">電話番号</td>
          <td style="padding: 8px 6px;">${data.phone}</td>
        </tr>
        ${data.message ? `
        <tr>
          <td style="padding: 8px 6px; color: #888; vertical-align: top;">ご要望</td>
          <td style="padding: 8px 6px;">${data.message.replace(/\n/g, "<br>")}</td>
        </tr>` : ""}
      </table>
    </div>
    <div style="padding: 14px 16px; background: #f9f5f0; border-left: 3px solid #c9a96e; font-size: 13px; color: #666; line-height: 1.8;">
      ※ このメールは自動送信です。ご返信いただいても対応できない場合があります。<br>
      ※ 担当者より改めてご連絡いたします。しばらくお待ちください。<br>
      ※ ご希望日時に添えない場合がございます。あらかじめご了承ください。
    </div>
    <div style="margin-top: 20px; padding: 16px 20px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; text-align: center;">
      <p style="font-size: 13px; color: #166534; font-weight: bold; margin: 0 0 8px;">📱 LINEでもお気軽にご相談ください</p>
      <a href="https://lin.ee/ptkrxTw" style="display: inline-block; background: #06c755; color: white; text-decoration: none; padding: 10px 24px; border-radius: 24px; font-size: 14px; font-weight: bold; letter-spacing: 0.05em;">LINE公式アカウントを友だち追加</a>
      <p style="font-size: 11px; color: #888; margin: 8px 0 0;">@theherbs_kobe</p>
    </div>
    <p style="font-size: 13px; color: #555; margin-top: 20px; line-height: 1.8;">
      ご不明な点は下記までお気軽にお問い合わせください。<br>
      <strong>THE HERBS神戸阪急店</strong>（神戸阪急本館6階 モーニングフロー内）<br>
      営業時間：10:00〜20:00<br>
      <a href="https://scalp-labo.jp" style="color: #c9a96e;">https://scalp-labo.jp</a>
    </p>
  </div>
  <p style="font-size: 11px; color: #aaa; text-align: center; margin-top: 16px;">
    THE HERBS SCALP LABO | presented by THE HERBS
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
              address: data.email,
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
      console.log(`[mailer] Customer confirmation sent to ${data.email} via Graph API`);
      return true;
    } else {
      const errorText = await response.text();
      console.error(`[mailer] Graph API error (customer): ${response.status} ${errorText.substring(0, 200)}`);
      return false;
    }
  } catch (err) {
    console.error("[mailer] Failed to send customer confirmation:", err);
    return false;
  }
}

export interface BookingConfirmedData {
  name: string;
  email: string;
  course: string;
  preferredDate: string;
  preferredTime: string;
  storeName: string;
  phone: string;
}

/**
 * 予約確定通知メールをお客様に送信する
 * 管理者が「確定」ステータスに変更した際に呼び出す
 */
export async function sendBookingConfirmed(data: BookingConfirmedData): Promise<boolean> {
  if (!ENV.smtpUser || !ENV.azureClientId || !ENV.azureTenantId || !ENV.azureClientSecret) {
    console.warn("[mailer] Graph API credentials not configured. Skipping booking confirmed mail.");
    return false;
  }

  const courseLabels: Record<string, string> = {
    free_check: "無料頭皮チェック（初回）",
    regular_care: "定期頭皮ケア",
    consultation: "まずは相談したい",
  };
  const courseLabel = courseLabels[data.course] ?? data.course;

  const subject = `【THE HERBS SCALP LABO】ご予約が確定しました — ${data.name} 様`;
  const htmlBody = `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"></head>
<body style="font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: #2a1a0a; color: #c9a96e; padding: 20px 24px; border-radius: 4px 4px 0 0;">
    <h1 style="margin: 0; font-size: 18px; letter-spacing: 0.1em;">THE HERBS SCALP LABO</h1>
    <p style="margin: 4px 0 0; font-size: 12px; opacity: 0.8;">ご予約確定のお知らせ</p>
  </div>
  <div style="background: #fff; border: 1px solid #e8ddd0; border-top: none; padding: 24px; border-radius: 0 0 4px 4px;">
    <p style="font-size: 15px; margin-top: 0;">${data.name} 様</p>
    <p style="font-size: 14px; line-height: 1.8; color: #555;">
      この度はTHE HERBS SCALP LABOへのご予約ありがとうございます。<br>
      以下の内容でご予約が確定いたしました。当日のご来店をスタッフ一同心よりお待ちしております。
    </p>

    <!-- 予約内容 -->
    <div style="background: #fdf8f3; border: 1px solid #e8ddd0; border-radius: 4px; padding: 16px 20px; margin: 20px 0;">
      <p style="font-size: 12px; letter-spacing: 0.1em; color: #c9a96e; font-weight: bold; margin: 0 0 12px;">✓ 確定したご予約内容</p>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr style="border-bottom: 1px solid #f0e8e0;">
          <td style="padding: 8px 6px; color: #888; width: 120px;">店舗</td>
          <td style="padding: 8px 6px; font-weight: bold;">${data.storeName}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f0e8e0;">
          <td style="padding: 8px 6px; color: #888;">コース</td>
          <td style="padding: 8px 6px; font-weight: bold; color: #8b5e3c;">${courseLabel}</td>
        </tr>
        <tr style="border-bottom: 1px solid #f0e8e0;">
          <td style="padding: 8px 6px; color: #888;">日時</td>
          <td style="padding: 8px 6px; font-weight: bold; font-size: 15px; color: #2a1a0a;">${data.preferredDate}（${data.preferredTime}〜）</td>
        </tr>
        <tr>
          <td style="padding: 8px 6px; color: #888;">お名前</td>
          <td style="padding: 8px 6px;">${data.name} 様</td>
        </tr>
      </table>
    </div>

    <!-- 来店前のご案内 -->
    <div style="background: #fffbf5; border: 1px solid #e8ddd0; border-radius: 4px; padding: 16px 20px; margin: 16px 0;">
      <p style="font-size: 12px; letter-spacing: 0.1em; color: #8b5e3c; font-weight: bold; margin: 0 0 10px;">📌 来店前のご案内</p>
      <ul style="font-size: 13px; color: #555; line-height: 2; margin: 0; padding-left: 18px;">
        <li>ゴージュやスクラブなど頭皮に刷き込むケアをされている場合は、当日はお控えください。</li>
        <li>ヘアカラー・パーマ・縮毛矯正をご予定の方は、施術前日は洗髪をお控えいただくと頭皮のバリア機能が高まります。</li>
        <li>特に持ち物はございません。リラックスしてお越しください。</li>
        <li>店舗の場合は、施術の10分前までにお越しいただくとスムーズです。</li>
      </ul>
    </div>

    <!-- キャンセルポリシー -->
    <div style="padding: 14px 16px; background: #fef9f0; border-left: 3px solid #f59e0b; font-size: 13px; color: #666; line-height: 1.9; margin: 16px 0;">
      <p style="font-weight: bold; color: #92400e; margin: 0 0 6px;">⚠️ キャンセルポリシー</p>
      キャンセルをご希望の際は、電話またはメールにて前日までにご連絡をお願いいたします。<br>
      当日のご予約はお電話にて承ります。
    </div>

    <!-- アクセス・問合せ -->
    <div style="margin-top: 16px; padding: 16px 20px; background: #f9f5f0; border-radius: 4px; font-size: 13px; color: #555; line-height: 1.9;">
      <p style="font-weight: bold; color: #2a1a0a; margin: 0 0 8px;">📍 店舗アクセス・お問合せ</p>
      <strong>THE HERBS神戸阪急店</strong>（神戸阪急本館６階 モーニングフロー内）<br>
      営業時間：水・金・土 10:00〜20:00<br>
      電話：<a href="tel:070-2642-7366" style="color: #c9a96e; font-weight: bold;">070-2642-7366</a>（直通）<br>
      メール：<a href="mailto:cx@the-herbs.co.jp" style="color: #c9a96e;">cx@the-herbs.co.jp</a><br>
      <a href="https://scalp-labo.jp" style="color: #c9a96e;">https://scalp-labo.jp</a>
    </div>

    <!-- LINE -->
    <div style="margin-top: 16px; padding: 16px 20px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 6px; text-align: center;">
      <p style="font-size: 13px; color: #166534; font-weight: bold; margin: 0 0 8px;">📱 LINEでもお気軽にご相談ください</p>
      <a href="https://lin.ee/WPbdXE5" style="display: inline-block; background: #06c755; color: white; text-decoration: none; padding: 10px 24px; border-radius: 24px; font-size: 14px; font-weight: bold; letter-spacing: 0.05em;">LINE公式アカウントを友だち追加</a>
    </div>
  </div>
  <p style="font-size: 11px; color: #aaa; text-align: center; margin-top: 16px;">
    THE HERBS SCALP LABO | presented by THE HERBS<br>
    &copy; 2026 SCALP LABO / THE HERBS. All rights reserved.
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
        body: { contentType: "HTML", content: htmlBody },
        toRecipients: [{ emailAddress: { address: data.email } }],
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
      console.log(`[mailer] Booking confirmed mail sent to ${data.email}`);
      return true;
    } else {
      const errorText = await response.text();
      console.error(`[mailer] Graph API error (confirmed): ${response.status} ${errorText.substring(0, 200)}`);
      return false;
    }
  } catch (err) {
    console.error("[mailer] Failed to send booking confirmed mail:", err);
    return false;
  }
}
