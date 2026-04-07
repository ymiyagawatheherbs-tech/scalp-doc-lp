/*
 * * THE HERBS SCALP LABO 専用予約フォームページ
 * URL: /booking
 * LINEリッチメニューから誘導するための独立した予約フォーム
 * デザイン: LPと統一（Shippori Mincho × Cream × Deep Brown）
 *
 * フロー:
 *   1. 店舗を選ぶ
 *   2a. 神戸阪急店 → フォーム入力（担当者から折り返し）
 *   2b. THE HERBSサロン → Square予約システムへ直接誘導
 */

import { useState } from "react";
import { trpc } from "@/lib/trpc";

// 全コース定義
const ALL_COURSES = [
  { value: "free",     label: "無料スカルプチェック",  sub: "5〜10分・無料",            desc: "マイクロスコープで頭皮の状態を確認。初めての方に最適です。" },
  { value: "standard", label: "THE HERBS SCALP LAB定期ケア",  sub: "30〜40分・3,000〜5,000円", desc: "定期的な頭皮チェック＋ボタニカルミストケア。継続的なサポートを希望の方に。" },
  { value: "consult",  label: "まずは相談したい",       sub: "内容を相談",               desc: "お気軽にご相談ください。" },
];

// Square予約URL（THE HERBSサロン）
const SQUARE_BOOKING_URL = "https://book.squareup.com/appointments/jsufqo133zf3ec/location/LEWSC49JS30BF/services";

// 店舗定義
const STORES = [
  {
    value: "hankyu",
    label: "THE HERBS神戸阪急店",
    address: "神戸阪急本館6階 モーニングフロー内",
    hours: "10:00 〜 20:00",
    checkHours: "頭皮チェック受付時間：12:00 〜 16:00（随時受付も可）",
    courses: ["free", "standard", "consult"],
    useSquare: false,
    note: "担当者よりメールまたはお電話にてご連絡いたします。",
  },
  {
    value: "salon",
    label: "THE HERBSサロン",
    address: "兵庫県神戸市灘区大内通1-7-17 1F",
    courses: ["free", "standard", "consult"],
    useSquare: true,
    note: "Square予約システムにて日時・コースをご選択ください。",
  },
];

// 神戸阪急店の時間帯（12:00〜16:00 / それ以外は随時受付）
const HANKYU_TIME_SLOTS = [
  "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00",
];
const HANKYU_TIME_SLOTS_OTHER = [
  "随時受付（時間帯ご相談）",
];

type FormState = {
  name: string;
  phone: string;
  desiredDate: string;
  desiredTime: string;
  plan: string;
  message: string;
};

type Errors = Partial<Record<keyof FormState | "submit", string>>;

// ---- スタイル定数 ----
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.82rem",
  fontWeight: 600,
  color: "oklch(0.35 0.04 42)",
  marginBottom: "0.45rem",
  letterSpacing: "0.03em",
};
const requiredStyle: React.CSSProperties = {
  color: "#ef4444",
  marginLeft: "2px",
};
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.7rem 0.9rem",
  border: "1.5px solid oklch(0.88 0.025 75)",
  borderRadius: "4px",
  fontSize: "0.9rem",
  color: "oklch(0.22 0.045 42)",
  background: "oklch(0.99 0.008 75)",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "'Noto Sans JP', sans-serif",
};
const errorStyle: React.CSSProperties = {
  fontSize: "0.75rem",
  color: "#ef4444",
  marginTop: "0.3rem",
};

export default function Booking() {
  const [selectedStore, setSelectedStore] = useState<string>("");
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

  const store = STORES.find((s) => s.value === selectedStore);
  const availableCourses = store
    ? ALL_COURSES.filter((c) => store.courses.includes(c.value))
    : [];
  const today = new Date().toISOString().split("T")[0];

  const createReservation = trpc.reservation.create.useMutation({
    onSuccess: () => setSubmitted(true),
  });

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
      message: `【店舗】${store?.label ?? selectedStore}\n${form.message.trim()}`.trim(),
      gender: "women",
    });
  }

  // ---- 送信完了画面 ----
  if (submitted) {
    return (
      <div style={{ minHeight: "100dvh", background: "oklch(0.97 0.015 75)", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem", fontFamily: "'Noto Sans JP', sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@400;600;700&family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet" />
        <div style={{ maxWidth: "480px", width: "100%", textAlign: "center", padding: "3rem 2rem", background: "white", borderRadius: "4px", boxShadow: "0 4px 32px rgba(0,0,0,0.06)" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "oklch(0.72 0.12 70)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p style={{ fontFamily: "'Shippori Mincho B1', serif", fontSize: "1.5rem", fontWeight: 700, color: "oklch(0.22 0.045 42)", marginBottom: "1rem" }}>
            ご予約を受け付けました
          </p>
          <p style={{ fontSize: "0.9rem", color: "oklch(0.45 0.04 42)", lineHeight: 1.8, marginBottom: "2rem" }}>
            ご予約内容を確認後、担当者よりメールまたはお電話にてご連絡いたします。<br />
            しばらくお待ちください。
          </p>
          <a href="/" style={{ display: "inline-block", padding: "0.75rem 2rem", background: "oklch(0.22 0.045 42)", color: "white", fontSize: "0.875rem", fontWeight: 500, textDecoration: "none", borderRadius: "2px" }}>
            トップページへ戻る
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100dvh", background: "oklch(0.97 0.015 75)", fontFamily: "'Noto Sans JP', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@400;600;700&family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet" />

      {/* ヘッダー */}
      <header style={{ background: "oklch(0.22 0.045 42)", padding: "0.75rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
        <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/logo_grayge_p_transparent_47bbd755.png"
            alt="SCALP LABO"
            style={{ height: "40px", width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)" }}
          />
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
            <span style={{ fontFamily: "'Noto Sans JP', sans-serif", fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.95)" }}>スカルプラボ</span>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.55rem", letterSpacing: "0.18em", color: "rgba(255,255,255,0.45)" }}>SCALP LABO</span>
          </div>
        </a>
        {/* 中央：presented by THE HERBS（sm以上のみ） */}
        <div className="hidden sm:flex" style={{ flexDirection: "column", alignItems: "center" }}>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.52rem", letterSpacing: "0.22em", color: "rgba(255,255,255,0.35)", textTransform: "uppercase" }}>presented by</span>
          <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600, fontSize: "0.78rem", letterSpacing: "0.22em", color: "rgba(255,255,255,0.75)", textTransform: "uppercase" }}>THE HERBS</span>
        </div>
        <span style={{ fontSize: "0.72rem", color: "oklch(0.75 0.06 75)", letterSpacing: "0.05em", flexShrink: 0 }}>ご予約フォーム</span>
      </header>

      <main style={{ maxWidth: "600px", margin: "0 auto", padding: "2.5rem 1rem 5rem" }}>

        {/* タイトル */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p style={{ fontSize: "0.7rem", letterSpacing: "0.2em", color: "oklch(0.72 0.12 70)", marginBottom: "0.5rem" }}>RESERVATION</p>
          <h1 style={{ fontFamily: "'Shippori Mincho B1', serif", fontSize: "1.6rem", fontWeight: 700, color: "oklch(0.22 0.045 42)", lineHeight: 1.4, marginBottom: "0.75rem" }}>
            ご予約・お申し込み
          </h1>
          <p style={{ fontSize: "0.85rem", color: "oklch(0.45 0.04 42)", lineHeight: 1.7 }}>
            ご希望の店舗をお選びください。
          </p>
        </div>

        {/* ご予約に関するご注意 */}
        <div style={{ background: "oklch(0.98 0.018 75)", border: "1px solid oklch(0.88 0.04 70)", borderRadius: "6px", padding: "1.25rem 1.5rem", marginBottom: "2rem" }}>
          <p style={{ fontSize: "0.72rem", letterSpacing: "0.15em", color: "oklch(0.72 0.12 70)", marginBottom: "0.75rem", fontWeight: 600 }}>
            ご予約に関するご注意
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              "ご希望日時に添えない場合がございます。",
              "担当者の返信をもってご予約確定となります。",
            ].map((note, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem", fontSize: "0.82rem", color: "oklch(0.4 0.04 42)", lineHeight: 1.7 }}>
                <span style={{ color: "oklch(0.72 0.12 70)", fontWeight: 700, flexShrink: 0, marginTop: "0.1rem" }}>・</span>
                {note}
              </li>
            ))}
          </ul>
        </div>

        {/* STEP 1: 店舗選択 */}
        <div style={{ marginBottom: "2rem" }}>
          <p style={{ fontSize: "0.72rem", letterSpacing: "0.15em", color: "oklch(0.72 0.12 70)", fontWeight: 600, marginBottom: "0.75rem" }}>
            STEP 1 — 店舗を選ぶ
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            {STORES.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => {
                  setSelectedStore(s.value);
                  setForm({ name: "", phone: "", desiredDate: "", desiredTime: "", plan: "", message: "" });
                  setErrors({});
                }}
                style={{
                  padding: "1.25rem 1rem",
                  border: selectedStore === s.value
                    ? "2px solid oklch(0.72 0.12 70)"
                    : "1.5px solid oklch(0.88 0.025 75)",
                  borderRadius: "8px",
                  background: selectedStore === s.value ? "oklch(0.97 0.025 75)" : "white",
                  cursor: "pointer",
                  textAlign: "left",
                  boxShadow: selectedStore === s.value
                    ? "0 0 0 3px rgba(180,130,60,0.15)"
                    : "0 2px 8px rgba(0,0,0,0.04)",
                  transition: "all 0.15s",
                }}
              >
                <p style={{ fontWeight: 700, fontSize: "0.88rem", color: "oklch(0.22 0.045 42)", marginBottom: "0.3rem", lineHeight: 1.4 }}>
                  {s.label}
                </p>
                <p style={{ fontSize: "0.72rem", color: "oklch(0.55 0.04 42)", lineHeight: 1.5 }}>
                  {s.address}
                </p>
                {"hours" in s && s.hours && (
                  <p style={{ fontSize: "0.68rem", color: "oklch(0.45 0.04 42)", marginTop: "0.3rem", lineHeight: 1.5 }}>
                    営業時間：{(s as { hours: string }).hours}
                  </p>
                )}
                {s.useSquare && (
                  <p style={{ fontSize: "0.68rem", color: "oklch(0.72 0.12 70)", marginTop: "0.4rem", fontWeight: 600 }}>
                    Square予約システム利用
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* THE HERBSサロン選択時 → Square誘導 */}
        {selectedStore === "salon" && (
          <div style={{ background: "white", borderRadius: "8px", boxShadow: "0 2px 16px rgba(0,0,0,0.06)", padding: "2rem 1.5rem", marginBottom: "2rem", textAlign: "center" }}>
            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "oklch(0.97 0.025 75)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="oklch(0.72 0.12 70)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <p style={{ fontFamily: "'Shippori Mincho B1', serif", fontSize: "1.1rem", fontWeight: 700, color: "oklch(0.22 0.045 42)", marginBottom: "0.5rem" }}>
              THE HERBSサロンのご予約
            </p>
            <p style={{ fontSize: "0.83rem", color: "oklch(0.45 0.04 42)", lineHeight: 1.8, marginBottom: "1.5rem" }}>
              THE HERBSサロンはSquare予約システムをご利用いただいています。<br />
              ご希望の日時・コースをそのままお選びいただけます。
            </p>
            <a
              href={SQUARE_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.9rem 2rem",
                background: "oklch(0.22 0.045 42)",
                color: "white",
                textDecoration: "none",
                borderRadius: "4px",
                fontWeight: 700,
                fontSize: "0.9rem",
                letterSpacing: "0.05em",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Square予約ページへ進む
            </a>
            <p style={{ fontSize: "0.75rem", color: "oklch(0.6 0.04 75)", marginTop: "1rem" }}>
              別タブで予約ページが開きます
            </p>
          </div>
        )}

        {/* 神戸阪急店選択時 → フォーム */}
        {selectedStore === "hankyu" && (
          <form onSubmit={handleSubmit} noValidate>
            {/* 営業時間・受付時間インフォ */}
            <div style={{ background: "oklch(0.97 0.02 70)", border: "1px solid oklch(0.85 0.06 70)", borderRadius: "6px", padding: "0.9rem 1.1rem", marginBottom: "1rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="oklch(0.6 0.1 70)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "oklch(0.35 0.06 60)" }}>THE HERBS神戸阪急店</span>
              </div>
              <p style={{ fontSize: "0.72rem", color: "oklch(0.4 0.04 42)", lineHeight: 1.6, margin: 0, paddingLeft: "1.3rem" }}>
                営業時間：<strong>10:00 〜 20:00</strong>
              </p>
              <p style={{ fontSize: "0.72rem", color: "oklch(0.4 0.04 42)", lineHeight: 1.6, margin: 0, paddingLeft: "1.3rem" }}>
                頭皮チェック受付：<strong>12:00 〜 16:00</strong>（それ以外は随時受付となります）
              </p>
            </div>
            <p style={{ fontSize: "0.72rem", letterSpacing: "0.15em", color: "oklch(0.72 0.12 70)", fontWeight: 600, marginBottom: "0.75rem" }}>
              STEP 2 — ご予約内容を入力する
            </p>
            <div style={{ background: "white", borderRadius: "4px", boxShadow: "0 2px 16px rgba(0,0,0,0.05)", padding: "2rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

              {/* お名前 */}
              <div>
                <label style={labelStyle}>お名前 <span style={requiredStyle}>*</span></label>
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
                <label style={labelStyle}>電話番号 <span style={requiredStyle}>*</span></label>
                <input
                  type="tel"
                  placeholder="090-0000-0000"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  style={errors.phone ? { ...inputStyle, borderColor: "#ef4444" } : inputStyle}
                />
                {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
              </div>

              {/* ご希望日 */}
              <div>
                <label style={labelStyle}>ご希望日 <span style={requiredStyle}>*</span></label>
                <input
                  type="date"
                  min={today}
                  value={form.desiredDate}
                  onChange={(e) => setForm({ ...form, desiredDate: e.target.value })}
                  style={errors.desiredDate ? { ...inputStyle, borderColor: "#ef4444" } : inputStyle}
                />
                {errors.desiredDate && <p style={errorStyle}>{errors.desiredDate}</p>}
              </div>

              {/* ご希望時間 */}
              <div>
                <label style={labelStyle}>ご希望時間 <span style={requiredStyle}>*</span></label>
                <select
                  value={form.desiredTime}
                  onChange={(e) => setForm({ ...form, desiredTime: e.target.value })}
                  style={errors.desiredTime ? { ...inputStyle, borderColor: "#ef4444" } : inputStyle}
                >
                  <option value="">時間を選択してください</option>
                  <optgroup label="予約可能時間帯（12:00〜16:00）">
                    {HANKYU_TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </optgroup>
                  <optgroup label="その他">
                    {HANKYU_TIME_SLOTS_OTHER.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </optgroup>
                </select>
                {errors.desiredTime && <p style={errorStyle}>{errors.desiredTime}</p>}
              </div>

              {/* コース選択 */}
              <div>
                <label style={labelStyle}>ご希望コース <span style={requiredStyle}>*</span></label>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {availableCourses.map((course) => (
                    <button
                      key={course.value}
                      type="button"
                      onClick={() => setForm({ ...form, plan: course.value })}
                      style={{
                        padding: "0.9rem 1rem",
                        border: form.plan === course.value
                          ? "2px solid oklch(0.72 0.12 70)"
                          : "1.5px solid oklch(0.88 0.025 75)",
                        borderRadius: "6px",
                        background: form.plan === course.value ? "oklch(0.97 0.025 75)" : "white",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.15s",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.2rem" }}>
                        <span style={{ fontWeight: 700, fontSize: "0.88rem", color: "oklch(0.22 0.045 42)" }}>{course.label}</span>
                        <span style={{ fontSize: "0.72rem", color: "oklch(0.72 0.12 70)", fontWeight: 600 }}>{course.sub}</span>
                      </div>
                      <p style={{ fontSize: "0.75rem", color: "oklch(0.5 0.04 42)", lineHeight: 1.6, margin: 0 }}>{course.desc}</p>
                    </button>
                  ))}
                </div>
                {errors.plan && <p style={errorStyle}>{errors.plan}</p>}
              </div>

              {/* ご要望・備考 */}
              <div>
                <label style={labelStyle}>ご要望・備考（任意）</label>
                <textarea
                  placeholder="気になる症状、アレルギー、その他ご要望があればご記入ください"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>

              {/* エラー表示 */}
              {errors.submit && (
                <p style={{ fontSize: "0.82rem", color: "#ef4444", textAlign: "center" }}>{errors.submit}</p>
              )}

              {/* 送信ボタン */}
              <button
                type="submit"
                disabled={createReservation.isPending}
                style={{
                  width: "100%",
                  padding: "1rem",
                  background: createReservation.isPending ? "oklch(0.75 0.06 75)" : "oklch(0.22 0.045 42)",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  cursor: createReservation.isPending ? "not-allowed" : "pointer",
                  fontFamily: "'Noto Sans JP', sans-serif",
                  transition: "background 0.2s",
                }}
              >
                {createReservation.isPending ? "送信中..." : "予約を申し込む"}
              </button>

              <p style={{ fontSize: "0.75rem", color: "oklch(0.6 0.04 75)", textAlign: "center", lineHeight: 1.7 }}>
                ※ 担当者よりメールまたはお電話にてご連絡いたします。<br />
                個人情報は予約確認の目的のみに使用し、第三者に提供しません。
              </p>
            </div>
          </form>
        )}

      </main>

      {/* フッター */}
      <footer style={{ backgroundColor: "#1a1a1a", padding: "2rem 1.5rem", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/logo-mark-transparent_70663ccb.png"
            alt="SCALP LABO mark"
            style={{ height: "2rem", width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.7 }}
          />
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/logo-text-greige-transparent_123f5ff1.png"
            alt="SCALP LABO"
            style={{ height: "1.25rem", width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.7 }}
          />
        </div>
        <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", fontFamily: "'Noto Sans JP', sans-serif" }}>
          © 2025 SCALP LABO / THE HERBS. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
