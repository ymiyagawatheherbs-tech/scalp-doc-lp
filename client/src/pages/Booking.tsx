/*
 * THE HERBS SCALP LABO 専用予約フォームページ
 * URL: /booking
 *
 * フロー:
 *   1. メニュー一覧（名前・時間・料金のみ表示）
 *   2. クリックで詳細展開（画像・説明・施術内容・対象者）
 *   3. 「このメニューで予約する」ボタン
 *   4. 店舗選択
 *   5. 情報入力 → 申し込み
 */

import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";

const SQUARE_BOOKING_URL = "https://book.squareup.com/appointments/jsufqo133zf3ec/location/LEWSC49JS30BF/services";

const STORES = [
  {
    value: "hankyu",
    label: "THE HERBS神戸阪急店",
    address: "神戸阪急本館6階 モーニングフロー内",
    hours: "10:00 〜 20:00",
    checkHours: "頭皮チェック受付：12:00 〜 16:00（随時受付も可）",
    useSquare: false,
  },
  {
    value: "salon",
    label: "THE HERBS植物美容サロン",
    address: "兵庫県神戸市灘区大内通1-7-17 1F",
    useSquare: true,
  },
];

const HANKYU_TIME_SLOTS = [
  "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00",
];
const HANKYU_TIME_SLOTS_OTHER = ["随時受付（時間帯ご相談）"];

type FormState = {
  name: string;
  phone: string;
  email: string;
  desiredDate: string;
  desiredTime: string;
  plan: string;
  message: string;
  agreeCancel: boolean;
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
const requiredStyle: React.CSSProperties = { color: "#ef4444", marginLeft: "2px" };
const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.7rem 0.9rem",
  border: "1.5px solid oklch(0.88 0.020 130)",
  borderRadius: "4px",
  fontSize: "0.9rem",
  color: "oklch(0.30 0.045 130)",
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

// ステップ管理
type Step = "menu" | "store" | "form";

export default function Booking() {
  const [step, setStep] = useState<Step>("menu");
  const [expandedMenuId, setExpandedMenuId] = useState<string | null>(null);
  const [selectedMenuId, setSelectedMenuId] = useState<string>("");
  const [selectedStore, setSelectedStore] = useState<string>("");
  const [form, setForm] = useState<FormState>({
    name: "", phone: "", email: "", desiredDate: "",
    desiredTime: "", plan: "", message: "", agreeCancel: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);

  // DBからメニューを取得（全件）
  const { data: dbMenus, isLoading: menusLoading } = trpc.menu.list.useQuery(
    {},
    { staleTime: 60_000 }
  );

  const menus = useMemo(() => {
    if (dbMenus && dbMenus.length > 0) {
      return dbMenus.map((m: any) => ({
        id: String(m.id),
        name: m.name,
        kana: m.kana ?? null,
        category: m.category ?? null,
        price: m.price,
        priceLabel: m.priceLabel ?? "税込",
        durationMin: m.durationMin ?? null,
        description: m.description ?? "",
        treatmentContent: m.treatmentContent ?? null,
        targetCustomer: m.targetCustomer ?? null,
        imageUrl: m.imageUrl ?? null,
        sortOrder: m.sortOrder ?? 0,
      }));
    }
    // フォールバック
    return [
      { id: "free", name: "無料スカルプチェック", kana: null, category: "スカルプケア", price: 0, priceLabel: "無料", durationMin: 10, description: "マイクロスコープで頭皮の状態を確認します。初めての方に最適です。", treatmentContent: null, targetCustomer: "頭皮の状態が気になる方、初めてご来店の方", imageUrl: null, sortOrder: 1 },
      { id: "standard", name: "定期チェック＆スカルプケア", kana: null, category: "スカルプケア", price: 3850, priceLabel: "税込〜", durationMin: 45, description: "定期的な頭皮チェック＋ボタニカルミストケア。継続的なサポートを希望の方に。", treatmentContent: null, targetCustomer: "定期的なケアを希望の方", imageUrl: null, sortOrder: 2 },
      { id: "consult", name: "まずは相談したい", kana: null, category: null, price: 0, priceLabel: "要相談", durationMin: 15, description: "頭皮や髪のお悩みをお聞きし、ケアの見直しなどのカウンセリングを行います。\nご希望があれば頭皮チェックを行い、より具体的なケアをご提案させていただきます。", treatmentContent: null, targetCustomer: null, imageUrl: null, sortOrder: 3 },
    ];
  }, [dbMenus]);

  const selectedMenu = menus.find((m) => m.id === selectedMenuId);

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const y = tomorrow.getFullYear();
    const mo = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const d = String(tomorrow.getDate()).padStart(2, "0");
    return `${y}-${mo}-${d}`;
  };
  const minDate = getMinDate();

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
    if (!form.agreeCancel) e.agreeCancel = "キャンセルポリシーへの同意が必要です";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const store = STORES.find((s) => s.value === selectedStore);
    createReservation.mutate({
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
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
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "oklch(0.69 0.060 130)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <p style={{ fontFamily: "'Shippori Mincho B1', serif", fontSize: "1.5rem", fontWeight: 700, color: "oklch(0.30 0.045 130)", marginBottom: "1rem" }}>
            ご予約を受け付けました
          </p>
          <p style={{ fontSize: "0.9rem", color: "oklch(0.42 0.07 140)", lineHeight: 1.8, marginBottom: "2rem" }}>
            ご予約内容を確認後、担当者よりメールまたはお電話にてご連絡いたします。<br />
            しばらくお待ちください。
          </p>
          <a href="/" style={{ display: "inline-block", padding: "0.75rem 2rem", background: "oklch(0.42 0.055 130)", color: "white", fontSize: "0.875rem", fontWeight: 500, textDecoration: "none", borderRadius: "2px" }}>
            トップページへ戻る
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100dvh", background: "oklch(0.978 0.008 90)", fontFamily: "'Noto Sans JP', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@400;600;700&family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet" />

      {/* ヘッダー */}
      <header style={{ background: "oklch(0.42 0.055 130)", padding: "0.75rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
        <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }}>
          <img src="/favicon.webp" alt="THE HERBSロゴマーク" style={{ height: "44px", width: "44px", objectFit: "contain" }} />
          <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.55rem", letterSpacing: "0.25em", color: "rgba(255,255,255,0.55)", textTransform: "uppercase" }}>botanical beauty</span>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: "1.15rem", letterSpacing: "0.18em", color: "rgba(255,255,255,0.95)", textTransform: "uppercase" }}>THE HERBS</span>
          </div>
        </a>
        <span style={{ fontSize: "0.72rem", color: "oklch(0.82 0.045 130)", letterSpacing: "0.05em", flexShrink: 0 }}>ご予約フォーム</span>
      </header>

      <main style={{ maxWidth: "640px", margin: "0 auto", padding: "2.5rem 1rem 5rem" }}>

        {/* タイトル */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <p style={{ fontSize: "0.7rem", letterSpacing: "0.2em", color: "oklch(0.69 0.060 130)", marginBottom: "0.5rem" }}>RESERVATION</p>
          <h1 style={{ fontFamily: "'Shippori Mincho B1', serif", fontSize: "1.6rem", fontWeight: 700, color: "oklch(0.30 0.045 130)", lineHeight: 1.4, marginBottom: "0.75rem" }}>
            ご予約・お申し込み
          </h1>
        </div>

        {/* ステップインジケーター */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "2rem" }}>
          {[
            { key: "menu", label: "メニュー選択" },
            { key: "store", label: "店舗選択" },
            { key: "form", label: "情報入力" },
          ].map((s, i) => (
            <div key={s.key} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "0.35rem",
                opacity: step === s.key ? 1 : 0.45,
              }}>
                <div style={{
                  width: "22px", height: "22px", borderRadius: "50%",
                  background: step === s.key ? "oklch(0.42 0.055 130)" : "oklch(0.85 0.02 75)",
                  color: step === s.key ? "white" : "oklch(0.5 0.03 75)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.7rem", fontWeight: 700, flexShrink: 0,
                }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: "0.72rem", fontWeight: step === s.key ? 700 : 400, color: step === s.key ? "oklch(0.30 0.045 130)" : "oklch(0.6 0.03 75)", whiteSpace: "nowrap" }}>
                  {s.label}
                </span>
              </div>
              {i < 2 && <span style={{ color: "oklch(0.75 0.02 75)", fontSize: "0.8rem" }}>›</span>}
            </div>
          ))}
        </div>

        {/* ---- STEP 1: メニュー一覧 ---- */}
        {step === "menu" && (
          <div>
            <p style={{ fontSize: "0.72rem", letterSpacing: "0.15em", color: "oklch(0.69 0.060 130)", fontWeight: 600, marginBottom: "1rem" }}>
              STEP 1 — ご希望のメニューをお選びください
            </p>

            {menusLoading && (
              <div style={{ textAlign: "center", padding: "3rem", color: "oklch(0.6 0.04 75)", fontSize: "0.85rem" }}>
                メニューを読み込んでいます...
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {menus.map((menu) => {
                const isExpanded = expandedMenuId === menu.id;
                const priceText = menu.price === 0
                  ? (menu.priceLabel === "無料" ? "無料" : menu.priceLabel)
                  : `¥${menu.price.toLocaleString()}（${menu.priceLabel}）`;
                const durationText = menu.durationMin ? `${menu.durationMin}分` : null;

                return (
                  <div key={menu.id} style={{
                    background: "white",
                    borderRadius: "8px",
                    border: selectedMenuId === menu.id
                      ? "2px solid oklch(0.69 0.060 130)"
                      : "1.5px solid oklch(0.90 0.015 75)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    overflow: "hidden",
                    transition: "border 0.15s",
                  }}>
                    {/* メニュー行（常時表示） */}
                    <button
                      type="button"
                      onClick={() => setExpandedMenuId(isExpanded ? null : menu.id)}
                      style={{
                        width: "100%",
                        padding: "1rem 1.25rem",
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      {/* サムネイル */}
                      {menu.imageUrl ? (
                        <img src={menu.imageUrl} alt={menu.name}
                          style={{ width: "56px", height: "56px", objectFit: "cover", borderRadius: "4px", flexShrink: 0 }} />
                      ) : (
                        <div style={{ width: "56px", height: "56px", borderRadius: "4px", background: "oklch(0.95 0.02 75)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: "1.5rem" }}>🌿</span>
                        </div>
                      )}

                      {/* 名前・料金・時間 */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {menu.category && (
                          <span style={{ fontSize: "0.62rem", color: "oklch(0.69 0.060 130)", fontWeight: 600, letterSpacing: "0.05em", background: "oklch(0.96 0.025 75)", padding: "0.1rem 0.5rem", borderRadius: "2px", display: "inline-block", marginBottom: "0.25rem" }}>
                            {menu.category}
                          </span>
                        )}
                        <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "oklch(0.25 0.045 130)", margin: 0, lineHeight: 1.3 }}>
                          {menu.name}
                        </p>
                        <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.3rem", flexWrap: "wrap" }}>
                          {durationText && (
                            <span style={{ fontSize: "0.75rem", color: "oklch(0.5 0.04 75)" }}>
                              ⏱ {durationText}
                            </span>
                          )}
                          <span style={{ fontSize: "0.75rem", color: "oklch(0.42 0.07 140)", fontWeight: 600 }}>
                            {priceText}
                          </span>
                        </div>
                      </div>

                      {/* 展開アイコン */}
                      <span style={{
                        fontSize: "0.75rem",
                        color: "oklch(0.6 0.04 75)",
                        flexShrink: 0,
                        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s",
                        display: "inline-block",
                      }}>▼</span>
                    </button>

                    {/* 詳細（展開時） */}
                    {isExpanded && (
                      <div style={{ padding: "0 1.25rem 1.25rem", borderTop: "1px solid oklch(0.93 0.012 75)" }}>
                        {/* 画像（大） */}
                        {menu.imageUrl && (
                          <img src={menu.imageUrl} alt={menu.name}
                            style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "6px", marginTop: "1rem", marginBottom: "1rem" }} />
                        )}

                        {/* 説明（改行そのまま） */}
                        {menu.description && (
                          <div style={{ marginTop: menu.imageUrl ? 0 : "1rem" }}>
                            <p style={{ fontSize: "0.72rem", fontWeight: 600, color: "oklch(0.69 0.060 130)", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>メニュー説明</p>
                            <p style={{ fontSize: "0.83rem", color: "oklch(0.35 0.04 42)", lineHeight: 1.85, margin: 0, whiteSpace: "pre-wrap" }}>
                              {menu.description}
                            </p>
                          </div>
                        )}

                        {/* 施術内容 */}
                        {menu.treatmentContent && (
                          <div style={{ marginTop: "1rem" }}>
                            <p style={{ fontSize: "0.72rem", fontWeight: 600, color: "oklch(0.69 0.060 130)", letterSpacing: "0.08em", marginBottom: "0.4rem" }}>施術内容</p>
                            <p style={{ fontSize: "0.83rem", color: "oklch(0.35 0.04 42)", lineHeight: 1.85, margin: 0, whiteSpace: "pre-wrap" }}>
                              {menu.treatmentContent}
                            </p>
                          </div>
                        )}

                        {/* 対象者 */}
                        {menu.targetCustomer && (
                          <div style={{ marginTop: "0.75rem", background: "oklch(0.97 0.018 75)", borderRadius: "4px", padding: "0.6rem 0.9rem" }}>
                            <p style={{ fontSize: "0.72rem", fontWeight: 600, color: "oklch(0.69 0.060 130)", marginBottom: "0.25rem" }}>こんな方におすすめ</p>
                            <p style={{ fontSize: "0.8rem", color: "oklch(0.42 0.07 140)", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>
                              {menu.targetCustomer}
                            </p>
                          </div>
                        )}

                        {/* このメニューで予約するボタン */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedMenuId(menu.id);
                            setForm((f) => ({ ...f, plan: menu.id }));
                            setStep("store");
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          style={{
                            marginTop: "1.25rem",
                            width: "100%",
                            padding: "0.85rem",
                            background: "oklch(0.30 0.045 130)",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "0.9rem",
                            fontWeight: 700,
                            letterSpacing: "0.05em",
                            cursor: "pointer",
                            fontFamily: "'Noto Sans JP', sans-serif",
                          }}
                        >
                          このメニューで予約する →
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---- STEP 2: 店舗選択 ---- */}
        {step === "store" && (
          <div>
            {/* 選択中メニュー表示 */}
            {selectedMenu && (
              <div style={{ background: "oklch(0.97 0.025 75)", border: "1px solid oklch(0.85 0.04 70)", borderRadius: "6px", padding: "0.75rem 1rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                {selectedMenu.imageUrl && (
                  <img src={selectedMenu.imageUrl} alt={selectedMenu.name}
                    style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px", flexShrink: 0 }} />
                )}
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "0.7rem", color: "oklch(0.69 0.060 130)", margin: 0 }}>選択中のメニュー</p>
                  <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "oklch(0.30 0.045 130)", margin: 0 }}>{selectedMenu.name}</p>
                </div>
                <button type="button" onClick={() => { setStep("menu"); setSelectedMenuId(""); }}
                  style={{ fontSize: "0.72rem", color: "oklch(0.55 0.06 130)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", flexShrink: 0 }}>
                  変更
                </button>
              </div>
            )}

            <p style={{ fontSize: "0.72rem", letterSpacing: "0.15em", color: "oklch(0.69 0.060 130)", fontWeight: 600, marginBottom: "1rem" }}>
              STEP 2 — 店舗をお選びください
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.5rem" }}>
              {STORES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => {
                    setSelectedStore(s.value);
                    if (s.useSquare) {
                      window.open(SQUARE_BOOKING_URL, "_blank", "noopener,noreferrer");
                    } else {
                      setStep("form");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }
                  }}
                  style={{
                    padding: "1.25rem 1rem",
                    border: selectedStore === s.value
                      ? "2px solid oklch(0.69 0.060 130)"
                      : "1.5px solid oklch(0.88 0.020 130)",
                    borderRadius: "8px",
                    background: selectedStore === s.value ? "oklch(0.97 0.025 75)" : "white",
                    cursor: "pointer",
                    textAlign: "left",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                    transition: "all 0.15s",
                  }}
                >
                  <p style={{ fontWeight: 700, fontSize: "0.88rem", color: "oklch(0.30 0.045 130)", marginBottom: "0.3rem", lineHeight: 1.4 }}>
                    {s.label}
                  </p>
                  <p style={{ fontSize: "0.72rem", color: "oklch(0.55 0.060 130)", lineHeight: 1.5, margin: 0 }}>
                    {s.address}
                  </p>
                  {"hours" in s && s.hours && (
                    <p style={{ fontSize: "0.68rem", color: "oklch(0.42 0.07 140)", marginTop: "0.3rem", lineHeight: 1.5 }}>
                      営業時間：{(s as { hours: string }).hours}
                    </p>
                  )}
                  {s.useSquare && (
                    <p style={{ fontSize: "0.68rem", color: "oklch(0.69 0.060 130)", marginTop: "0.4rem", fontWeight: 600 }}>
                      Square予約システム利用 ↗
                    </p>
                  )}
                </button>
              ))}
            </div>

            <button type="button" onClick={() => setStep("menu")}
              style={{ fontSize: "0.8rem", color: "oklch(0.55 0.06 130)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
              ← メニュー選択に戻る
            </button>
          </div>
        )}

        {/* ---- STEP 3: 情報入力フォーム（神戸阪急店） ---- */}
        {step === "form" && selectedStore === "hankyu" && (
          <form onSubmit={handleSubmit} noValidate>
            {/* 選択中メニュー・店舗表示 */}
            <div style={{ background: "oklch(0.97 0.025 75)", border: "1px solid oklch(0.85 0.04 70)", borderRadius: "6px", padding: "0.75rem 1rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.3rem" }}>
                <p style={{ fontSize: "0.7rem", color: "oklch(0.69 0.060 130)", margin: 0 }}>選択中のメニュー</p>
                <button type="button" onClick={() => setStep("menu")}
                  style={{ fontSize: "0.7rem", color: "oklch(0.55 0.06 130)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>変更</button>
              </div>
              <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "oklch(0.30 0.045 130)", margin: "0 0 0.5rem" }}>{selectedMenu?.name ?? form.plan}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: "0.7rem", color: "oklch(0.69 0.060 130)", margin: 0 }}>店舗</p>
                <button type="button" onClick={() => setStep("store")}
                  style={{ fontSize: "0.7rem", color: "oklch(0.55 0.06 130)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>変更</button>
              </div>
              <p style={{ fontSize: "0.88rem", fontWeight: 700, color: "oklch(0.30 0.045 130)", margin: 0 }}>THE HERBS神戸阪急店</p>
            </div>

            {/* 営業時間インフォ */}
            <div style={{ background: "oklch(0.97 0.02 70)", border: "1px solid oklch(0.85 0.06 70)", borderRadius: "6px", padding: "0.9rem 1.1rem", marginBottom: "1.5rem" }}>
              <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "oklch(0.35 0.06 60)", marginBottom: "0.3rem" }}>THE HERBS神戸阪急店</p>
              <p style={{ fontSize: "0.72rem", color: "oklch(0.4 0.04 42)", lineHeight: 1.6, margin: "0 0 0.2rem" }}>
                営業時間：<strong>10:00 〜 20:00</strong>
              </p>
              <p style={{ fontSize: "0.72rem", color: "oklch(0.4 0.04 42)", lineHeight: 1.6, margin: 0 }}>
                頭皮チェック予約可能時間帯：<strong>12:00 〜 16:00</strong>（それ以外は随時受付となります）
              </p>
            </div>

            <p style={{ fontSize: "0.72rem", letterSpacing: "0.15em", color: "oklch(0.69 0.060 130)", fontWeight: 600, marginBottom: "0.75rem" }}>
              STEP 3 — ご予約内容を入力する
            </p>

            <div style={{ background: "white", borderRadius: "4px", boxShadow: "0 2px 16px rgba(0,0,0,0.05)", padding: "2rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>

              {/* お名前 */}
              <div>
                <label style={labelStyle}>お名前 <span style={requiredStyle}>*</span></label>
                <input type="text" placeholder="山田 花子" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={errors.name ? { ...inputStyle, borderColor: "#ef4444" } : inputStyle} />
                {errors.name && <p style={errorStyle}>{errors.name}</p>}
              </div>

              {/* 電話番号 */}
              <div>
                <label style={labelStyle}>電話番号 <span style={requiredStyle}>*</span></label>
                <input type="tel" placeholder="090-0000-0000" value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  style={errors.phone ? { ...inputStyle, borderColor: "#ef4444" } : inputStyle} />
                {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
              </div>

              {/* メールアドレス */}
              <div>
                <label style={labelStyle}>メールアドレス</label>
                <input type="email" placeholder="example@email.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={errors.email ? { ...inputStyle, borderColor: "#ef4444" } : inputStyle} />
                {errors.email && <p style={errorStyle}>{errors.email}</p>}
                <p style={{ fontSize: "0.72rem", color: "oklch(0.55 0.04 75)", marginTop: "0.3rem" }}>確認メールをお送りする際に使用します（任意）</p>
              </div>

              {/* ご希望日 */}
              <div>
                <label style={labelStyle}>ご希望日 <span style={requiredStyle}>*</span></label>
                <input type="date" min={minDate} value={form.desiredDate}
                  onChange={(e) => setForm({ ...form, desiredDate: e.target.value })}
                  style={errors.desiredDate ? { ...inputStyle, borderColor: "#ef4444" } : inputStyle} />
                {errors.desiredDate && <p style={errorStyle}>{errors.desiredDate}</p>}
                <p style={{ fontSize: "0.72rem", color: "oklch(0.55 0.06 42)", marginTop: "0.35rem", lineHeight: 1.6 }}>
                  ※ 当日予約はお電話にて承ります　<strong>070-2642-7366（直通）</strong>
                </p>
              </div>

              {/* ご希望時間 */}
              <div>
                <label style={labelStyle}>ご希望時間 <span style={requiredStyle}>*</span></label>
                <select value={form.desiredTime}
                  onChange={(e) => setForm({ ...form, desiredTime: e.target.value })}
                  style={errors.desiredTime ? { ...inputStyle, borderColor: "#ef4444" } : inputStyle}>
                  <option value="">時間を選択してください</option>
                  <optgroup label="予約可能時間帯（12:00〜16:00）">
                    {HANKYU_TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
                  </optgroup>
                  <optgroup label="その他">
                    {HANKYU_TIME_SLOTS_OTHER.map((t) => <option key={t} value={t}>{t}</option>)}
                  </optgroup>
                </select>
                {errors.desiredTime && <p style={errorStyle}>{errors.desiredTime}</p>}
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

              {/* キャンセルポリシー */}
              <div style={{ background: "oklch(0.97 0.015 75)", border: "1.5px solid oklch(0.88 0.025 75)", borderRadius: "6px", padding: "1rem 1.1rem" }}>
                <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer" }}>
                  <input type="checkbox" checked={form.agreeCancel}
                    onChange={(e) => setForm({ ...form, agreeCancel: e.target.checked })}
                    style={{ marginTop: "2px", width: "16px", height: "16px", accentColor: "oklch(0.42 0.055 130)", flexShrink: 0 }} />
                  <span style={{ fontSize: "0.82rem", color: "oklch(0.35 0.04 42)", lineHeight: 1.7 }}>
                    <strong>キャンセルポリシーに同意する</strong>（必須）<br />
                    キャンセルをご希望の際は、電話またはメールにて前日までにご連絡をお願いいたします。
                  </span>
                </label>
                {(errors as Record<string, string>).agreeCancel && (
                  <p style={{ ...errorStyle, marginTop: "0.5rem", paddingLeft: "1.75rem" }}>{(errors as Record<string, string>).agreeCancel}</p>
                )}
              </div>

              {errors.submit && (
                <p style={{ fontSize: "0.82rem", color: "#ef4444", textAlign: "center" }}>{errors.submit}</p>
              )}

              {/* 送信ボタン */}
              <button type="submit" disabled={createReservation.isPending}
                style={{
                  width: "100%", padding: "1rem",
                  background: createReservation.isPending ? "oklch(0.75 0.06 75)" : "oklch(0.30 0.045 130)",
                  color: "white", border: "none", borderRadius: "4px",
                  fontSize: "0.95rem", fontWeight: 700, letterSpacing: "0.08em",
                  cursor: createReservation.isPending ? "not-allowed" : "pointer",
                  fontFamily: "'Noto Sans JP', sans-serif",
                }}>
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
          <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/logo-mark-transparent_70663ccb.png"
            alt="SCALP LABO mark"
            style={{ height: "2rem", width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.7 }} />
          <img src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/logo-text-greige-transparent_123f5ff1.png"
            alt="SCALP LABO"
            style={{ height: "1.25rem", width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.7 }} />
        </div>
        <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", fontFamily: "'Noto Sans JP', sans-serif" }}>
          © 2026 SCALP LABO / THE HERBS. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
