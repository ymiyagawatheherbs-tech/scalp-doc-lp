/*
 * スカルプラボ — 専用予約フォームページ
 * URL: /booking
 * LINEリッチメニューから誘導するための独立した予約フォーム
 * デザイン: LPと統一（Shippori Mincho × Cream × Deep Brown）
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";

// 全コース定義
const ALL_COURSES = [
  { value: "free", label: "無料スカルプチェック", sub: "5〜10分・無料", desc: "マイクロスコープで頭皮の状態を確認。初めての方に最適です。" },
  { value: "standard", label: "スカルプラボ定期ケア", sub: "30〜40分・3,000〜5,000円", desc: "定期的な頭皮チェック＋ボタニカルミストケア。継続的なサポートを希望の方に。" },
  { value: "consult", label: "まずは相談したい", sub: "内容を相談", desc: "コースや料金など、まずはお気軽にご相談ください。" },
];

// Square予約URL（THE HERBSサロン）
const SQUARE_BOOKING_URL = "https://book.squareup.com/appointments/jsufqo133zf3ec/location/LEWSC49JS30BF/services";

// 店舗定義
const STORES = [
  {
    value: "hankyu",
    label: "スカルプラボ 神戸阪急店",
    address: "神戸阪急本館6階 モーニングフロー内",
    courses: ["free", "standard"],
    lineUrl: "https://lin.ee/RhtIZDl",
    lineId: "@theherbs_kobe",
    useSquare: false,
  },
  {
    value: "salon",
    label: "スカルプラボ THE HERBSサロン",
    address: "兵庫県神戸市灘区大内通1-7-17 1F",
    courses: ["free", "standard", "consult"],
    lineUrl: "https://lin.ee/oWeHStW",
    lineId: "@theherbs39",
    useSquare: true,
  },
];

// 店舗ごとの時間帯
const STORE_TIME_SLOTS: Record<string, string[]> = {
  // 神戸阪急店：10:30〜
  hankyu: [
    "10:30", "11:00", "11:30", "12:00", "12:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
    "19:00", "19:30",
  ],
  salon: [
    "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
    "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30",
  ],
};

const DEFAULT_TIME_SLOTS = [
  "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30",
];

type BookingMethod = "form" | "line";

type FormState = {
  name: string;
  phone: string;
  store: string;
  desiredDate: string;
  desiredTime: string;
  plan: string;
  message: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

export default function Booking() {
  const [bookingMethod, setBookingMethod] = useState<BookingMethod | null>(null);
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    store: "",
    desiredDate: "",
    desiredTime: "",
    plan: "",
    message: "",
  });

  const selectedStore = STORES.find((s) => s.value === form.store);
  const availableCourses = selectedStore
    ? ALL_COURSES.filter((c) => selectedStore.courses.includes(c.value))
    : [];
  const availableTimeSlots = form.store ? (STORE_TIME_SLOTS[form.store] ?? DEFAULT_TIME_SLOTS) : DEFAULT_TIME_SLOTS;
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
    if (!form.store) e.store = "ご希望の店舗を選択してください";
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
      message: `【店舗】${selectedStore?.label ?? form.store}\n${form.message.trim()}`.trim(),
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
            ご希望の予約方法をお選びください。
          </p>
        </div>

        {/* ご予約に関するご注意 */}
        <div
          style={{
            background: "oklch(0.98 0.018 75)",
            border: "1px solid oklch(0.88 0.04 70)",
            borderRadius: "6px",
            padding: "1.25rem 1.5rem",
            marginBottom: "2rem",
          }}
        >
          <p
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.15em",
              color: "oklch(0.72 0.12 70)",
              marginBottom: "0.75rem",
              fontWeight: 600,
            }}
          >
            ご予約に関するご注意
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              "ご希望の日時に添えない場合がございます。",
              "担当者からのご返信をもってご予約確定となります。",
              "お日にちに余裕を持ったご予約をお願いいたします。",
            ].map((note, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.82rem", color: "oklch(0.38 0.045 42)", lineHeight: 1.6 }}>
                <span style={{ color: "oklch(0.72 0.12 70)", fontWeight: 700, flexShrink: 0, marginTop: "0.05rem" }}>・</span>
                {note}
              </li>
            ))}
          </ul>
        </div>

        {/* 予約方法選択 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          {/* LINEで予約 */}
          <button
            type="button"
            onClick={() => setBookingMethod("line")}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              padding: "1.5rem 1rem",
              border: bookingMethod === "line"
                ? "2px solid #06C755"
                : "1.5px solid oklch(0.88 0.025 75)",
              borderRadius: "8px",
              background: bookingMethod === "line" ? "#f0fff4" : "white",
              cursor: "pointer",
              transition: "all 0.15s",
              boxShadow: bookingMethod === "line" ? "0 0 0 3px rgba(6,199,85,0.15)" : "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="10" fill="#06C755"/>
              <path d="M33 18.8C33 13.4 27.6 9 21 9C14.4 9 9 13.4 9 18.8C9 23.6 13.2 27.6 18.8 28.6C19.2 28.7 19.8 28.9 19.9 29.3C20 29.7 19.9 30.3 19.8 30.7C19.8 30.7 19.6 31.7 19.6 31.9C19.5 32.3 19.3 33.3 21 32.6C22.7 31.9 30.4 27.1 33.6 23.5C34.8 22.2 33 20.9 33 18.8Z" fill="white"/>
            </svg>
            <div>
              <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "oklch(0.22 0.045 42)", marginBottom: "0.2rem" }}>
                LINEで予約
              </p>
              <p style={{ fontSize: "0.72rem", color: "oklch(0.5 0.04 42)", lineHeight: 1.5 }}>
                LINEで直接<br />やりとりできます
              </p>
            </div>
          </button>

          {/* フォームで予約 */}
          <button
            type="button"
            onClick={() => setBookingMethod("form")}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              padding: "1.5rem 1rem",
              border: bookingMethod === "form"
                ? "2px solid oklch(0.72 0.12 70)"
                : "1.5px solid oklch(0.88 0.025 75)",
              borderRadius: "8px",
              background: bookingMethod === "form" ? "oklch(0.97 0.025 75)" : "white",
              cursor: "pointer",
              transition: "all 0.15s",
              boxShadow: bookingMethod === "form" ? "0 0 0 3px rgba(180,130,60,0.15)" : "0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="10" fill="oklch(0.72 0.12 70)"/>
              <rect x="11" y="12" width="18" height="2.5" rx="1.25" fill="white"/>
              <rect x="11" y="18" width="14" height="2.5" rx="1.25" fill="white"/>
              <rect x="11" y="24" width="10" height="2.5" rx="1.25" fill="white"/>
            </svg>
            <div>
              <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "oklch(0.22 0.045 42)", marginBottom: "0.2rem" }}>
                フォームで予約
              </p>
              <p style={{ fontSize: "0.72rem", color: "oklch(0.5 0.04 42)", lineHeight: 1.5 }}>
                24時間いつでも<br />お申し込みできます
              </p>
            </div>
          </button>
        </div>

        {/* LINE予約パネル */}
        {bookingMethod === "line" && (
          <div
            style={{
              background: "white",
              borderRadius: "8px",
              boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
              padding: "2rem 1.5rem",
              marginBottom: "2rem",
            }}
          >
            <p
              style={{
                fontFamily: "'Shippori Mincho B1', serif",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "oklch(0.22 0.045 42)",
                marginBottom: "0.5rem",
              }}
            >
              LINEでご予約
            </p>
            <p style={{ fontSize: "0.83rem", color: "oklch(0.45 0.04 42)", lineHeight: 1.8, marginBottom: "1.5rem" }}>
              各店舗のLINE公式アカウントを友だち追加して、<br />
              メッセージでご希望の日時・コースをお送りください。
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* 神戸阪急店 */}
              <div
                style={{
                  border: "1.5px solid oklch(0.88 0.025 75)",
                  borderRadius: "8px",
                  padding: "1.25rem",
                  background: "oklch(0.99 0.008 75)",
                }}
              >
                <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "oklch(0.22 0.045 42)", marginBottom: "0.25rem" }}>
                  スカルプラボ 神戸阪急店
                </p>
                <p style={{ fontSize: "0.78rem", color: "oklch(0.55 0.04 42)", marginBottom: "1rem" }}>
                  神戸阪急本館6階 モーニングフロー内
                </p>
                <a
                  href="https://lin.ee/RhtIZDl"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "0.75rem 1.25rem",
                    background: "#06C755",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "6px",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    letterSpacing: "0.03em",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M33 18.8C33 13.4 27.6 9 21 9C14.4 9 9 13.4 9 18.8C9 23.6 13.2 27.6 18.8 28.6C19.2 28.7 19.8 28.9 19.9 29.3C20 29.7 19.9 30.3 19.8 30.7C19.8 30.7 19.6 31.7 19.6 31.9C19.5 32.3 19.3 33.3 21 32.6C22.7 31.9 30.4 27.1 33.6 23.5C34.8 22.2 33 20.9 33 18.8Z" fill="white"/>
                  </svg>
                  @theherbs_kobe を友だち追加
                </a>
              </div>

              {/* THE HERBSサロン */}
              <div
                style={{
                  border: "1.5px solid oklch(0.88 0.025 75)",
                  borderRadius: "8px",
                  padding: "1.25rem",
                  background: "oklch(0.99 0.008 75)",
                }}
              >
                <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "oklch(0.22 0.045 42)", marginBottom: "0.25rem" }}>
                  スカルプラボ THE HERBSサロン
                </p>
                <p style={{ fontSize: "0.78rem", color: "oklch(0.55 0.04 42)", marginBottom: "1rem" }}>
                  兵庫県神戸市灘区大内通1-7-17 1F
                </p>
                <a
                  href="https://lin.ee/oWeHStW"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    padding: "0.75rem 1.25rem",
                    background: "#06C755",
                    color: "white",
                    textDecoration: "none",
                    borderRadius: "6px",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    letterSpacing: "0.03em",
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M33 18.8C33 13.4 27.6 9 21 9C14.4 9 9 13.4 9 18.8C9 23.6 13.2 27.6 18.8 28.6C19.2 28.7 19.8 28.9 19.9 29.3C20 29.7 19.9 30.3 19.8 30.7C19.8 30.7 19.6 31.7 19.6 31.9C19.5 32.3 19.3 33.3 21 32.6C22.7 31.9 30.4 27.1 33.6 23.5C34.8 22.2 33 20.9 33 18.8Z" fill="white"/>
                  </svg>
                  @theherbs39 を友だち追加
                </a>
              </div>
            </div>

            <p style={{ fontSize: "0.75rem", color: "oklch(0.6 0.04 75)", marginTop: "1.25rem", lineHeight: 1.7, textAlign: "center" }}>
              友だち追加後、「予約希望」とメッセージを送ると<br />
              担当者よりご返信いたします。
            </p>
          </div>
        )}

        {/* フォーム予約パネル */}
        {bookingMethod === "form" && (
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

              {/* 店舗選択 */}
              <div>
                <label style={labelStyle}>
                  ご希望店舗 <span style={requiredStyle}>*</span>
                </label>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginTop: "0.5rem" }}>
                  {STORES.map((store) => (
                    <button
                      key={store.value}
                      type="button"
                      onClick={() => setForm({ ...form, store: store.value, plan: "", desiredTime: "" })}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        padding: "0.875rem 1.25rem",
                        border: form.store === store.value
                          ? "2px solid oklch(0.72 0.12 70)"
                          : "1.5px solid oklch(0.88 0.025 75)",
                        borderRadius: "4px",
                        background: form.store === store.value ? "oklch(0.97 0.025 75)" : "white",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.15s",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <div
                          style={{
                            width: "16px",
                            height: "16px",
                            borderRadius: "50%",
                            border: form.store === store.value ? "5px solid oklch(0.72 0.12 70)" : "2px solid oklch(0.75 0.04 75)",
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "oklch(0.22 0.045 42)" }}>
                          {store.label}
                        </span>
                        {store.useSquare && (
                          <span
                            style={{
                              fontSize: "0.65rem",
                              background: "oklch(0.22 0.045 42)",
                              color: "white",
                              padding: "0.1rem 0.45rem",
                              borderRadius: "20px",
                              letterSpacing: "0.03em",
                              flexShrink: 0,
                            }}
                          >
                            Square予約
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: "0.78rem", color: "oklch(0.5 0.04 42)", marginTop: "0.25rem", paddingLeft: "1.5rem" }}>
                        {store.address}
                      </p>
                    </button>
                  ))}
                </div>
                {errors.store && <p style={errorStyle}>{errors.store}</p>}
              </div>

              {/* THE HERBSサロン選択時：Squareへ誘導 */}
              {form.store === "salon" && (
                <div
                  style={{
                    background: "oklch(0.97 0.015 75)",
                    border: "1.5px solid oklch(0.85 0.04 70)",
                    borderRadius: "8px",
                    padding: "1.5rem",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Shippori Mincho B1', serif",
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "oklch(0.22 0.045 42)",
                      marginBottom: "0.5rem",
                    }}
                  >
                    THE HERBSサロンのご予約
                  </p>
                  <p style={{ fontSize: "0.82rem", color: "oklch(0.45 0.04 42)", lineHeight: 1.8, marginBottom: "1.25rem" }}>
                    THE HERBSサロンはオンライン予約システム（Square）を<br />
                    ご利用いただけます。空き状況をリアルタイムで確認しながら<br />
                    ご予約が可能です。
                  </p>
                  <a
                    href={SQUARE_BOOKING_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.875rem 2rem",
                      background: "oklch(0.22 0.045 42)",
                      color: "white",
                      textDecoration: "none",
                      borderRadius: "4px",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      letterSpacing: "0.05em",
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    Square予約システムへ
                  </a>
                  <p style={{ fontSize: "0.72rem", color: "oklch(0.6 0.04 75)", marginTop: "1rem", lineHeight: 1.6 }}>
                    ※ Square予約ページが新しいタブで開きます
                  </p>
                </div>
              )}

              {/* 神戸阪急店選択時のみ：日時・コース入力 */}
              {form.store === "hankyu" && (
                <>
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
                      {availableTimeSlots.map((t) => (
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
                      {availableCourses.map((course) => (
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
                </>
              )}

              {/* 店舗未選択時のガイド */}
              {!form.store && (
                <p style={{ fontSize: "0.82rem", color: "oklch(0.55 0.04 75)", padding: "0.75rem", background: "oklch(0.96 0.01 75)", borderRadius: "4px", textAlign: "center" }}>
                  上の「ご希望店舗」を選択してください
                </p>
              )}
            </div>
          </form>
        )}

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
                営業時間：10:30〜20:00
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
