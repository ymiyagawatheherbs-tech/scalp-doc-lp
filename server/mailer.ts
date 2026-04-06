import nodemailer from "nodemailer";
import { ENV } from "./_core/env";

/**
 * Outlook SMTP経由でメールを送信するヘルパー
 * SMTP設定: smtp.office365.com:587 (STARTTLS)
 */
function createTransporter() {
  return nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    secure: false, // STARTTLS
    auth: {
      user: ENV.smtpUser,
      pass: ENV.smtpPass,
    },
    tls: {
      ciphers: "SSLv3",
      rejectUnauthorized: false,
    },
  });
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
 * 神戸阪急店の予約申し込みをcx@the-herbs.co.jpへメール通知する
 */
export async function sendBookingNotification(data: BookingNotificationData): Promise<boolean> {
  if (!ENV.smtpUser || !ENV.smtpPass) {
    console.warn("[mailer] SMTP credentials not configured. Skipping email notification.");
    return false;
  }

  const transporter = createTransporter();

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

  const textBody = `
THE HERBS SCALP LAB 予約申し込みがありました。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
■ 申し込み情報
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
店舗：${data.storeName}
お名前：${data.name} 様
電話番号：${data.phone}
メールアドレス：${data.email}
ご希望コース：${courseLabel}
ご希望日：${data.preferredDate}
ご希望時間：${timeLabel}
${data.message ? `\nメッセージ：\n${data.message}` : ""}

申し込み日時：${data.submittedAt}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

※ ご返信をもってご予約確定となります。
※ ご希望に添えない場合がございます。
※ 余裕を持ったご予約をお願いいたします。

THE HERBS SCALP LAB 予約管理システム
`.trim();

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
    await transporter.sendMail({
      from: `"THE HERBS SCALP LAB 予約システム" <${ENV.smtpUser}>`,
      to: ENV.notifyEmail,
      subject,
      text: textBody,
      html: htmlBody,
    });
    console.log(`[mailer] Booking notification sent to ${ENV.notifyEmail}`);
    return true;
  } catch (err) {
    console.error("[mailer] Failed to send booking notification:", err);
    return false;
  }
}
