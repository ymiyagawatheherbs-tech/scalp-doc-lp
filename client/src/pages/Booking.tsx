/*
 * スカルプラボ — 専用予約フォームページ
 * URL: /booking
 * LINEリッチメニューから誘導するための独立した予約フォーム
 * デザイン: LPと統一（Shippori Mincho × Cream × Deep Brown）
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";

const COURSES = [
  { value: "free", label: "無料スカルプチェック", sub: "5〜10分・無料", desc: "マイクロスコープで頭皮の状態を確認。初めての方に最適です。" },
  { value: "standard", label: "スカルプラボ定期ケア", sub: "30〜40分・3,000〜5,000円", desc: "定期的な頭皮チェック＋ボタニカルミストケア。継続的なサポートを希望の方に。" },
  { value: "consult", label: "まずは相談したい", sub: "内容を相談", desc: "コースや料金など、まずはお気軽にご相談ください。" },
];

const TIME_SLOTS = [
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30",
];

type FormState = {
  name: string;
  phone: string;
  desiredDate: string;
  desiredTime: string;
  plan: string;
  message: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

export default function Booking() {
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    desiredDate: "",
    desiredTime: "",
    plan: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  const createReservation = trpc.reservation.create.useMutation({
    onSuccess: () => setSubmitted(true),
  });

  const today = new Date().toISOString().split("T")[0];

  function validate(): boolean {
    const e: Errors = {};
    if (!form.name.trim()) e.name = "お名前を入力してください";
    if (!form.phone.trim()) e.phone = "電話番号を入力してください";
    else if (!/^[\d\-\+\(\)\s]{7,20}$/.test(form.phone.trim())) e.phone = "正しい電話番号を入力してください";
    if (!form.desiredDate) e.desiredDate = "ご希望日を選択してください";
    if (!form.desiredTime) e.desiredTime = "ご希望時間を選択してください";
    if (!form.plan) e.plan = "コースを選択してください";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    createReservation.mutate({
      name: form.name.trim(),
      phone: form.phone.trim(),
      desiredDate: form.desiredDate,
      desiredTime: form.desiredTime,
      plan: form.plan as "free" | "standard" | "personal" | "consult",
      message: form.message.trim() || undefined,
      gender: "women",
    });
  }

  // 送信完了画面
  if (submitted) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          background: "oklch(0.97 0.015 75)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem 1rem",
          fontFamily: "'Noto Sans JP', sans-serif",
        }}
      >
        <link
          href="https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@400;600;700&family=Noto+Sans+JP:wght@300;400;500;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&display=swap"
          rel="stylesheet"
        />
        <div
          style={{
            maxWidth: "480px",
            width: "100%",
            textAlign: "center",
            padding: "3rem 2rem",
            background: "white",
            borderRadius: "4px",
            boxShadow: "0 4px 32px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: "oklch(0.72 0.12 70)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p
            style={{
              fontFamily: "'Shippori Mincho B1', serif",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "oklch(0.22 0.045 42)",
              marginBottom: "1rem",
            }}
          >
            ご予約を受け付けました
          </p>
          <p
            style={{
              fontSize: "0.9rem",
              color: "oklch(0.45 0.04 42)",
              lineHeight: 1.8,
              marginBottom: "2rem",
            }}
          >
            ご予約内容を確認後、担当者よりお電話またはLINEにてご連絡いたします。<br />
            しばらくお待ちください。
          </p>
          <a
            href="/"
            style={{
              display: "inline-block",
              padding: "0.75rem 2rem",
              background: "oklch(0.22 0.045 42)",
              color: "white",
              fontSize: "0.875rem",
              fontWeight: 500,
              textDecoration: "none",
              borderRadius: "2px",
            }}
          >
            トップページへ戻る
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "oklch(0.97 0.015 75)",
        fontFamily: "'Noto Sans JP', sans-serif",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@400;600;700&family=Noto+Sans+JP:wght@300;400;500;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&display=swap"
        rel="stylesheet"
      />

      {/* ヘッダー */}
      <header
        style={{
          background: "oklch(0.22 0.045 42)",
          padding: "1rem 1.5rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "oklch(0.72 0.12 70)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "14px",
              fontWeight: 700,
              color: "white",
            }}
          >
            S
          </div>
          <div>
            <div style={{ fontFamily: "'Shippori Mincho B1', serif", fontSize: "0.95rem", fontWeight: 700, color: "white", letterSpacing: "0.05em" }}>
              スカルプラボ
            </div>
            <div style={{ fontSize: "0.6rem", color: "oklch(0.75 0.06 75)", letterSpacing: "0.15em" }}>SCALP LABO</div>
          </div>
        </a>
        <span style={{ fontSize: "0.75rem", color: "oklch(0.75 0.06 75)", letterSpacing: "0.05em" }}>ご予約フォーム</span>
      </header>

      {/* メインコンテンツ */}
      <main style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem 1rem 4rem" }}>
        {/* タイトル */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p style={{ fontSize: "0.7rem", letterSpacing: "0.2em", color: "oklch(0.72 0.12 70)", marginBottom: "0.5rem" }}>
            RESERVATION
          </p>
          <h1
            style={{
              fontFamily: "'Shippori Mincho B1', serif",
              fontSize: "1.6rem",
              fontWeight: 700,
              color: "oklch(0.22 0.045 42)",
              lineHeight: 1.4,
              marginBottom: "0.75rem",
            }}
          >
            ご予約・お申し込み
          </h1>
          <p style={{ fontSize: "0.85rem", color: "oklch(0.45 0.04 42)", lineHeight: 1.7 }}>
            下記フォームにご入力の上、送信してください。<br />
            担当者よりご連絡いたします。
          </p>
        </div>

        {/* フォーム */}
        <form onSubmit={handleSubmit} noValidate>
          <div
            style={{
              background: "white",
              borderRadius: "4px",
              boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
              padding: "2rem 1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
            }}
          >
            {/* お名前 */}
            <div>
              <label style={labelStyle}>
                お名前 <span style={requiredStyle}>*</span>
              </label>
              <input
                type="text"
                placeholder="山田 花子"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={errors.name ? { ...inputStyle, borderColor: "#ef4444" } : inputStyle}
              />
              {errors.name && <p style={errorStyle}>{errors.name}</p>}
            </div>

            {/* 電話番号 */}
            <div>
              <label style={labelStyle}>
                電話番号 <span style={requiredStyle}>*</span>
              </label>
              <input
                type="tel"
                placeholder="090-0000-0000"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                style={errors.phone ? { ...inputStyle, borderColor: "#ef4444" } : inputStyle}
              />
              {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
            </div>

            {/* 希望日 */}
            <div>
              <label style={labelStyle}>
                ご希望日 <span style={requiredStyle}>*</span>
              </label>
              <input
                type="date"
                min={today}
                value={form.desiredDate}
                onChange={(e) => setForm({ ...form, desiredDate: e.target.value })}
                style={errors.desiredDate ? { ...inputStyle, borderColor: "#ef4444" } : inputStyle}
              />
              {errors.desiredDate && <p style={errorStyle}>{errors.desiredDate}</p>}
            </div>

            {/* 希望時間 */}
            <div>
              <label style={labelStyle}>
                ご希望時間 <span style={requiredStyle}>*</span>
              </label>
              <select
                value={form.desiredTime}
                onChange={(e) => setForm({ ...form, desiredTime: e.target.value })}
                style={errors.desiredTime ? { ...inputStyle, borderColor: "#ef4444" } : inputStyle}
              >
                <option value="">時間を選択してください</option>
                {TIME_SLOTS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errors.desiredTime && <p style={errorStyle}>{errors.desiredTime}</p>}
            </div>

            {/* 希望コース */}
            <div>
              <label style={labelStyle}>
                ご希望コース <span style={requiredStyle}>*</span>
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
                {COURSES.map((course) => (
                  <button
                    key={course.value}
                    type="button"
                    onClick={() => setForm({ ...form, plan: course.value })}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      padding: "1rem 1.25rem",
                      border: form.plan === course.value
                        ? "2px solid oklch(0.72 0.12 70)"
                        : "1.5px solid oklch(0.88 0.025 75)",
                      borderRadius: "4px",
                      background: form.plan === course.value ? "oklch(0.97 0.025 75)" : "white",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                      <div
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          border: form.plan === course.value ? "5px solid oklch(0.72 0.12 70)" : "2px solid oklch(0.75 0.04 75)",
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "oklch(0.22 0.045 42)" }}>
                        {course.label}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "oklch(0.72 0.12 70)", marginLeft: "0.25rem" }}>
                        {course.sub}
                      </span>
                    </div>
                    <p style={{ fontSize: "0.78rem", color: "oklch(0.5 0.04 42)", lineHeight: 1.6, paddingLeft: "1.5rem" }}>
                      {course.desc}
                    </p>
                  </button>
                ))}
              </div>
              {errors.plan && <p style={errorStyle}>{errors.plan}</p>}
            </div>

            {/* ご質問・ご要望 */}
            <div>
              <label style={labelStyle}>
                ご質問・ご要望 <span style={{ fontSize: "0.7rem", color: "oklch(0.6 0.04 75)" }}>（任意）</span>
              </label>
              <textarea
                placeholder="気になる症状、ご要望などをご記入ください"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={4}
                style={{ ...inputStyle, resize: "vertical", minHeight: "100px" }}
              />
            </div>

            {/* 送信エラー */}
            {createReservation.isError && (
              <div
                style={{
                  padding: "0.75rem 1rem",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  borderRadius: "4px",
                  fontSize: "0.85rem",
                  color: "#dc2626",
                }}
              >
                送信中にエラーが発生しました。しばらくしてから再度お試しください。
              </div>
            )}

            {/* 送信ボタン */}
            <button
              type="submit"
              disabled={createReservation.isPending}
              style={{
                width: "100%",
                padding: "1rem",
                background: createReservation.isPending ? "oklch(0.65 0.08 70)" : "oklch(0.72 0.12 70)",
                color: "white",
                fontSize: "1rem",
                fontWeight: 700,
                fontFamily: "'Noto Sans JP', sans-serif",
                border: "none",
                borderRadius: "2px",
                cursor: createReservation.isPending ? "not-allowed" : "pointer",
                letterSpacing: "0.05em",
                transition: "background 0.2s",
              }}
            >
              {createReservation.isPending ? "送信中..." : "予約を申し込む"}
            </button>

            <p style={{ fontSize: "0.75rem", color: "oklch(0.6 0.04 75)", textAlign: "center", lineHeight: 1.7 }}>
              ご入力いただいた情報は予約管理のみに使用し、<br />
              第三者への提供は行いません。
            </p>
          </div>
        </form>

        {/* 店舗案内 */}
        <div
          style={{
            marginTop: "2rem",
            padding: "1.5rem",
            background: "white",
            borderRadius: "4px",
            boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
          }}
        >
          <p style={{ fontSize: "0.7rem", letterSpacing: "0.15em", color: "oklch(0.72 0.12 70)", marginBottom: "1rem" }}>
            STORE INFORMATION
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div>
              <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "oklch(0.22 0.045 42)", marginBottom: "0.25rem" }}>
                スカルプラボ 神戸阪急店
              </p>
              <p style={{ fontSize: "0.8rem", color: "oklch(0.45 0.04 42)", lineHeight: 1.7 }}>
                兵庫県神戸市中央区小野柄通8丁目1番8号<br />
                神戸阪急本館6階 モーニングフロー内<br />
                営業時間：10:00〜20:00
              </p>
            </div>
            <div>
              <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "oklch(0.22 0.045 42)", marginBottom: "0.25rem" }}>
                スカルプラボ THE HERBSサロン
              </p>
              <p style={{ fontSize: "0.8rem", color: "oklch(0.45 0.04 42)", lineHeight: 1.7 }}>
                兵庫県神戸市灘区大内通1-7-17 1F<br />
                営業時間：水・金 10:00〜18:00 / 土 13:00〜20:00<br />
                定休日：火曜・日曜・祝日
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// スタイル定数
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.85rem",
  fontWeight: 600,
  color: "oklch(0.22 0.045 42)",
  marginBottom: "0.5rem",
  letterSpacing: "0.02em",
};

const requiredStyle: React.CSSProperties = {
  color: "oklch(0.72 0.12 70)",
  fontSize: "0.8rem",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  border: "1.5px solid oklch(0.88 0.025 75)",
  borderRadius: "4px",
  fontSize: "0.9rem",
  color: "oklch(0.22 0.045 42)",
  background: "white",
  outline: "none",
  fontFamily: "'Noto Sans JP', sans-serif",
  boxSizing: "border-box",
  transition: "border-color 0.15s",
};

const errorStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  color: "#ef4444",
  marginTop: "0.35rem",
};
