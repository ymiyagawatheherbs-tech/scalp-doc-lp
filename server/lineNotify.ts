/**
 * LINE Messaging API — 予約通知ヘルパー
 *
 * フォーム送信時に各店舗のLINE公式アカウントへ通知を送信する。
 * 管理者はLINEアプリからそのままお客様に返信できる。
 *
 * 仕組み：
 * - LINE Messaging APIの「ブロードキャスト」または「プッシュメッセージ」を使用
 * - 管理者がLINE公式アカウントに友だち追加している場合、通知が届く
 * - 通知メッセージにお客様の電話番号・メールアドレスを含めることで
 *   LINEまたは電話で折り返し連絡できる
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
 * LINE Messaging APIのブロードキャストエンドポイントへ送信
 * （公式アカウントをフォローしている全ユーザーに届く）
 */
async function sendLineMessage(accessToken: string, text: string): Promise<boolean> {
  try {
    const res = await fetch("https://api.line.me/v2/bot/message/broadcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
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
      console.error(`[LINE Notify] Broadcast failed: ${res.status} ${body}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[LINE Notify] Network error:", err);
    return false;
  }
}

/**
 * 予約通知をLINEに送信する
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

  if (!accessToken) {
    console.warn(`[LINE Notify] Access token not set for store: ${params.store}`);
    return false;
  }

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
    `このメッセージに返信してご予約を確定してください。`,
  ]
    .filter(Boolean)
    .join("\n");

  return sendLineMessage(accessToken, message);
}
