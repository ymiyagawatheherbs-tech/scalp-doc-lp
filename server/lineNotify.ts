/**
 * LINE Messaging API — 予約通知ヘルパー
 *
 * 予約フォーム送信時に、管理者のLINEアカウントへ直接プッシュ通知を送信する。
 * フォロワーへの一斉配信（ブロードキャスト）は行わない。
 *
 * 仕組み：
 * - LINE Messaging APIの「プッシュメッセージ」を使用
 * - 送信先は LINE_ADMIN_USER_ID に設定した管理者のLINEユーザーIDのみ
 * - フォロワーには一切届かない
 *
 * 管理者LINEユーザーIDの取得方法：
 * 1. LINE公式アカウントに管理者本人が友だち追加
 * 2. Webhookで受信したfollowイベントのuserIdを確認
 * 3. または LINE Developers Console > Messaging API > Webhook で確認
 */

import { ENV } from "./_core/env";

interface ReservationNotifyParams {
  store: "kobe" | "salon";
  name: string;
  phone: string;
  email?: string;
  desiredDate: string;
  desiredTime: string;
  plan: string;
  message?: string;
}

const PLAN_LABELS: Record<string, string> = {
  free: "無料スカルプチェック（5〜10分）",
  standard: "THE HERBS SCALP LAB定期ケア（30〜40分）",
  personal: "パーソナルスカルプケア",
  consult: "まずは相談したい",
};

/**
 * LINE Messaging APIのプッシュメッセージエンドポイントへ送信
 * 特定のユーザーID（管理者）にのみ届く。フォロワーへの配信は行わない。
 */
async function sendLinePushMessage(
  accessToken: string,
  toUserId: string,
  text: string
): Promise<boolean> {
  try {
    const res = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        to: toUserId,
        messages: [
          {
            type: "text",
            text,
          },
        ],
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[LINE Notify] Push failed: ${res.status} ${body}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[LINE Notify] Network error:", err);
    return false;
  }
}

/**
 * 予約通知を管理者のLINEアカウントへプッシュ送信する
 * LINE_KOBE_ADMIN_USER_ID 環境変数に管理者のLINEユーザーIDを設定する必要がある
 */
export async function notifyReservationViaLine(params: ReservationNotifyParams): Promise<boolean> {
  const planLabel = PLAN_LABELS[params.plan] ?? params.plan;
  const storeName =
    params.store === "kobe"
      ? "THE HERBS SCALP LAB 神戸阪急店"
      : "THE HERBS SCALP LAB サロン";

  const accessToken =
    params.store === "kobe"
      ? ENV.lineKobeChannelAccessToken
      : ENV.lineSalonChannelAccessToken;

  // 管理者のLINEユーザーIDを環境変数から取得
  const adminUserId =
    params.store === "kobe"
      ? process.env.LINE_KOBE_ADMIN_USER_ID
      : process.env.LINE_SALON_ADMIN_USER_ID;

  if (!accessToken) {
    console.warn(`[LINE Notify] Access token not set for store: ${params.store}`);
    return false;
  }

  if (!adminUserId) {
    console.warn(`[LINE Notify] Admin user ID not set for store: ${params.store}. Set LINE_KOBE_ADMIN_USER_ID or LINE_SALON_ADMIN_USER_ID env var.`);
    return false;
  }

  const now = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });

  const message = [
    `📋 【新規予約申し込み】`,
    `━━━━━━━━━━━━━━`,
    `🏪 店舗：${storeName}`,
    `👤 お名前：${params.name} 様`,
    `📞 電話番号：${params.phone}`,
    params.email ? `📧 メール：${params.email}` : null,
    `📅 ご希望日時：${params.desiredDate} ${params.desiredTime}`,
    `💆 コース：${planLabel}`,
    params.message ? `💬 メッセージ：${params.message}` : null,
    `━━━━━━━━━━━━━━`,
    `受信時刻：${now}`,
    `メールまたはお電話にて予約確定の連絡をしてください。`,
  ]
    .filter(Boolean)
    .join("\n");

  return sendLinePushMessage(accessToken, adminUserId, message);
}
