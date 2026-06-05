/*
 * THE HERBS SCALP LABO 専用予約フォームページ
 * URL: /booking
 *
 * フロー:
 * 1. 店舗選択（神戸阪急店 / 植物美容サロン）
 * 2. メニュー選択（選択した店舗のメニューのみ表示）
 * - クリックで詳細展開（画像・説明・施術内容・対象者）
 * 3. 情報入力 → 申し込み
 *
 * カラーパレット: BOTANICAL CHARM
 * #A9C0A6 セージグリーン（アクセント）
 * #F5EDE3 クリームホワイト（背景）
 * #707862 ディープグリーン（テキスト・ボタン）
 * #DDD5CC グレージュ（ボーダー・サブ背景）
 * #C5D3C4 ライトグリーン（ホバー・選択）
 */

import { useState, useMemo } from "react";
import { trpc } from "@/lib/trpc";

// ---- カラー定数 ----
const C = {
 bg: "#F5EDE3", // クリームホワイト
 bgCard: "#FFFFFF",
 bgSub: "#F0EBE3", // サブ背景
 bgSelected: "#EAF0E9", // 選択済み背景
 green: "#707862", // ディープグリーン（メインテキスト・ボタン）
 greenDark: "#4A5240", // ダークグリーン
 sage: "#A9C0A6", // セージグリーン（アクセント）
 light: "#C5D3C4", // ライトグリーン
 border: "#DDD5CC", // グレージュ（ボーダー）
 borderSelected: "#A9C0A6",
 text: "#3D3D2E", // メインテキスト
 textSub: "#6B6B5A", // サブテキスト
 textMuted: "#9A9A88", // ミュートテキスト
 error: "#C0392B",
};

const STORES = [
 {
 value: "hankyu",
 label: "THE HERBS神戸阪急店",
 address: "神戸阪急本館6階 モーニングフロー内",
 hours: "10:00 〜 20:00",
 checkHours: "頭皮チェック受付：12:00 〜 16:00（随時受付も可）",
 phone: "070-2642-7366",
 icon: "",
 },
 {
 value: "salon",
 label: "THE HERBS植物美容サロン",
 address: "兵庫県神戸市灘区大内通1-7-17 1F",
 hours: "水・金・土曜日 10:00～20:00（不定期で月曜日）",
 checkHours: "完全予約制／クレジットカード決済のみ",
 notes: [
 "初回はカウンセリングに絀10分程度お時間をいただきます。",
 "現金はご利用いただけません。クレジットカード決済のみとなります。",
 "完全予約制です。お気軽にお問い合わせください。",
 ],
 phone: "070-2642-7366",
 icon: "",
 },
];

const HANKYU_TIME_SLOTS = [
 "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00",
];
const HANKYU_TIME_SLOTS_OTHER = ["随時受付（時間帯ご相談）"];

const SALON_TIME_SLOTS = [
 "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
 "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
 "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
 "19:00", "19:30",
];

type FormState = {
 name: string;
 phone: string;
 email: string;
 desiredDate: string;
 desiredTime: string;
 message: string;
 agreeCancel: boolean;
};
type Errors = Partial<Record<keyof FormState | "submit", string>>;

// ---- スタイル定数 ----
const labelStyle: React.CSSProperties = {
 display: "block",
 fontSize: "0.82rem",
 fontWeight: 600,
 color: C.green,
 marginBottom: "0.45rem",
 letterSpacing: "0.03em",
};
const requiredStyle: React.CSSProperties = { color: C.error, marginLeft: "2px" };
const inputStyle: React.CSSProperties = {
 width: "100%",
 padding: "0.7rem 0.9rem",
 border: `1.5px solid ${C.border}`,
 borderRadius: "6px",
 fontSize: "0.9rem",
 color: C.text,
 background: "#FAFAF7",
 outline: "none",
 boxSizing: "border-box",
 fontFamily: "'Noto Sans JP', sans-serif",
};
const errorStyle: React.CSSProperties = {
 fontSize: "0.75rem",
 color: C.error,
 marginTop: "0.3rem",
};

// ステップ管理
type Step = "store" | "menu" | "form";

export default function Booking() {
 const [step, setStep] = useState<Step>("store");
 const [selectedStore, setSelectedStore] = useState<string>("");
 const [expandedMenuId, setExpandedMenuId] = useState<string | null>(null);
 const [selectedMenuId, setSelectedMenuId] = useState<string>("");
 const [selectedMenuName, setSelectedMenuName] = useState<string>("");
 const [form, setForm] = useState<FormState>({
 name: "", phone: "", email: "", desiredDate: "",
 desiredTime: "", message: "", agreeCancel: false,
 });
 const [errors, setErrors] = useState<Errors>({});
 const [submitted, setSubmitted] = useState(false);

 // 選択店舗のメニューをDBから取得
 const { data: dbMenus, isLoading: menusLoading } = trpc.menu.list.useQuery(
 { salonId: selectedStore || undefined },
 {
 enabled: !!selectedStore,
 staleTime: 60_000,
 }
 );

 // カテゴリー表示順
 const CATEGORY_ORDER = ["スカルプラボ", "ベーシックケア", "プレミアムパーソナルケア", "セルフケア"];

 const menus = useMemo(() => {
 if (!dbMenus || dbMenus.length === 0) return [];
 const mapped = dbMenus.map((m: any) => ({
 id: String(m.id),
 name: m.name,
 kana: m.nameKana ?? null,
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
 // カテゴリー順 → sortOrder順 でソート
 mapped.sort((a: any, b: any) => {
 const ai = CATEGORY_ORDER.indexOf(a.category ?? "");
 const bi = CATEGORY_ORDER.indexOf(b.category ?? "");
 const catA = ai === -1 ? CATEGORY_ORDER.length : ai;
 const catB = bi === -1 ? CATEGORY_ORDER.length : bi;
 if (catA !== catB) return catA - catB;
 return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
 });
 return mapped;
 }, [dbMenus]);

 const selectedMenu = menus.find((m) => m.id === selectedMenuId);
 const storeInfo = STORES.find((s) => s.value === selectedStore);

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
 if (!form.agreeCancel) e.agreeCancel = "キャンセルポリシーへの同意が必要です";
 setErrors(e);
 return Object.keys(e).length === 0;
 }

 function handleSubmit(e: React.FormEvent) {
 e.preventDefault();
 if (!validate()) return;
 createReservation.mutate({
 name: form.name.trim(),
 phone: form.phone.trim(),
 email: form.email.trim() || undefined,
 desiredDate: form.desiredDate,
 desiredTime: form.desiredTime,
 plan: selectedMenuName || selectedMenuId,
 message: form.message.trim() || undefined,
 gender: "women",
 salonId: (selectedStore as "hankyu" | "salon") || "hankyu",
 });
 }

 // ---- 送信完了画面 ----
 if (submitted) {
 return (
 <div style={{ minHeight: "100dvh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem 1rem", fontFamily: "'Noto Sans JP', sans-serif" }}>
 <link href="https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@400;600;700&family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet" />
 <div style={{ maxWidth: "480px", width: "100%", textAlign: "center", padding: "3rem 2rem", background: C.bgCard, borderRadius: "12px", boxShadow: "0 4px 32px rgba(0,0,0,0.06)", border: `1px solid ${C.border}` }}>
 <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: C.sage, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem" }}>
 <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
 <polyline points="20 6 9 17 4 12" />
 </svg>
 </div>
 <p style={{ fontFamily: "'Shippori Mincho B1', serif", fontSize: "1.5rem", fontWeight: 700, color: C.green, marginBottom: "1rem" }}>
 ご予約を受け付けました
 </p>
 <p style={{ fontSize: "0.9rem", color: C.textSub, lineHeight: 1.8, marginBottom: "2rem" }}>
 ご予約内容を確認後、担当者よりメールまたはお電話にてご連絡いたします。<br />
 しばらくお待ちください。
 </p>
 <a href="/" style={{ display: "inline-block", padding: "0.75rem 2rem", background: C.green, color: "white", fontSize: "0.875rem", fontWeight: 500, textDecoration: "none", borderRadius: "6px" }}>
 トップページへ戻る
 </a>
 </div>
 </div>
 );
 }

 return (
 <div style={{ minHeight: "100dvh", background: C.bg, fontFamily: "'Noto Sans JP', sans-serif" }}>
 <link href="https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@400;600;700&family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet" />

 {/* ヘッダー */}
 <header style={{ background: C.green, padding: "0.75rem 1rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
 <a href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.6rem", flexShrink: 0 }}>
 <img src="/favicon.webp" alt="THE HERBSロゴマーク" style={{ height: "44px", width: "44px", objectFit: "contain" }} />
 <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2 }}>
 <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.55rem", letterSpacing: "0.25em", color: C.light, textTransform: "uppercase" }}>botanical beauty</span>
 <span style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: "1.15rem", letterSpacing: "0.18em", color: "#FFFFFF", textTransform: "uppercase" }}>THE HERBS</span>
 </div>
 </a>
 <span style={{ fontSize: "0.72rem", color: C.light, letterSpacing: "0.05em", flexShrink: 0 }}>ご予約フォーム</span>
 </header>

 <main style={{ maxWidth: "640px", margin: "0 auto", padding: "2.5rem 1rem 5rem" }}>

 {/* タイトル */}
 <div style={{ textAlign: "center", marginBottom: "2rem" }}>
 <p style={{ fontSize: "0.7rem", letterSpacing: "0.2em", color: C.sage, marginBottom: "0.5rem", fontWeight: 600 }}>RESERVATION</p>
 <h1 style={{ fontFamily: "'Shippori Mincho B1', serif", fontSize: "1.6rem", fontWeight: 700, color: C.green, lineHeight: 1.4, marginBottom: "0.75rem" }}>
 ご予約・お申し込み
 </h1>
 </div>

 {/* ステップインジケーター */}
 <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "2rem" }}>
 {[
 { key: "store", label: "店舗選択" },
 { key: "menu", label: "メニュー選択" },
 { key: "form", label: "情報入力" },
 ].map((s, i) => {
 const isDone = (s.key === "store" && (step === "menu" || step === "form")) ||
 (s.key === "menu" && step === "form");
 const isActive = step === s.key;
 return (
 <div key={s.key} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
 <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
 <div style={{
 width: "26px", height: "26px", borderRadius: "50%",
 background: isDone ? C.sage : isActive ? C.green : C.border,
 color: (isDone || isActive) ? "white" : C.textMuted,
 display: "flex", alignItems: "center", justifyContent: "center",
 fontSize: "0.7rem", fontWeight: 700, flexShrink: 0,
 border: isActive ? `2px solid ${C.greenDark}` : "none",
 }}>
 {isDone ? "✓" : i + 1}
 </div>
 <span style={{ fontSize: "0.72rem", color: isActive ? C.green : isDone ? C.sage : C.textMuted, fontWeight: isActive ? 700 : 400 }}>
 {s.label}
 </span>
 </div>
 {i < 2 && <span style={{ color: C.border, fontSize: "0.9rem" }}>›</span>}
 </div>
 );
 })}
 </div>

 {/* ---- STEP 1: 店舗選択 ---- */}
 {step === "store" && (
 <div>
 <p style={{ fontSize: "0.72rem", letterSpacing: "0.15em", color: C.sage, fontWeight: 600, marginBottom: "1rem" }}>
 STEP 1 — ご来店の店舗をお選びください
 </p>

 <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
 {STORES.map((s) => (
 <button
 key={s.value}
 type="button"
 onClick={() => {
 setSelectedStore(s.value);
 setSelectedMenuId("");
 setSelectedMenuName("");
 setExpandedMenuId(null);
 setStep("menu");
 window.scrollTo({ top: 0, behavior: "smooth" });
 }}
 style={{
 padding: "1.25rem 1.5rem",
 border: `2px solid ${C.border}`,
 borderRadius: "10px",
 background: C.bgCard,
 cursor: "pointer",
 textAlign: "left",
 boxShadow: "0 2px 12px rgba(112,120,98,0.08)",
 display: "flex",
 alignItems: "center",
 justifyContent: "space-between",
 gap: "1rem",
 }}
 >
 <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
 <span style={{ fontSize: "1.8rem", flexShrink: 0, lineHeight: 1 }}>{s.icon}</span>
 <div>
 <p style={{ fontWeight: 700, fontSize: "1rem", color: C.green, marginBottom: "0.3rem", lineHeight: 1.4 }}>
 {s.label}
 </p>
 <p style={{ fontSize: "0.78rem", color: C.textSub, lineHeight: 1.5, margin: "0 0 0.2rem" }}>
 {s.address}
 </p>
 <p style={{ fontSize: "0.72rem", color: C.textMuted, lineHeight: 1.5, margin: 0 }}>
 営業時間：{s.hours}
 </p>
 {s.checkHours && (
 <p style={{ fontSize: "0.68rem", color: C.sage, marginTop: "0.2rem", lineHeight: 1.5, fontWeight: 600 }}>
 {s.checkHours}
 </p>
 )}
 {(s as any).notes && (
 <ul style={{ margin: "0.4rem 0 0", padding: 0, listStyle: "none" }}>
 {(s as any).notes.map((note: string, i: number) => (
 <li key={i} style={{ fontSize: "0.65rem", color: C.textMuted, lineHeight: 1.6 }}>
 ※ {note}
 </li>
 ))}
 </ul>
 )}
 </div>
 </div>
 <span style={{ color: C.sage, fontSize: "1.2rem", flexShrink: 0 }}>›</span>
 </button>
 ))}
 </div>
 </div>
 )}

 {/* ---- STEP 2: メニュー選択 ---- */}
 {step === "menu" && (
 <div>
 {/* 選択中店舗表示 */}
 {storeInfo && (
 <div style={{ background: C.bgSelected, border: `1.5px solid ${C.sage}`, borderRadius: "8px", padding: "0.75rem 1rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
 <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
 <span style={{ fontSize: "1.2rem" }}>{storeInfo.icon}</span>
 <div>
 <p style={{ fontSize: "0.7rem", color: C.sage, margin: "0 0 0.2rem", fontWeight: 600 }}>選択中の店舗</p>
 <p style={{ fontSize: "0.88rem", fontWeight: 700, color: C.green, margin: 0 }}>{storeInfo.label}</p>
 </div>
 </div>
 <button type="button" onClick={() => { setStep("store"); setSelectedStore(""); }}
 style={{ fontSize: "0.72rem", color: C.sage, background: "none", border: `1px solid ${C.sage}`, borderRadius: "4px", cursor: "pointer", padding: "0.25rem 0.6rem", flexShrink: 0 }}>
 変更
 </button>
 </div>
 )}

 <p style={{ fontSize: "0.72rem", letterSpacing: "0.15em", color: C.sage, fontWeight: 600, marginBottom: "1rem" }}>
 STEP 2 — ご希望のメニューをお選びください
 </p>

 {menusLoading && (
 <div style={{ textAlign: "center", padding: "3rem", color: C.textMuted, fontSize: "0.85rem" }}>
 メニューを読み込んでいます...
 </div>
 )}

 {!menusLoading && menus.length === 0 && (
 <div style={{ textAlign: "center", padding: "2rem", color: C.textSub, fontSize: "0.85rem", background: C.bgCard, borderRadius: "10px", border: `1px solid ${C.border}` }}>
 現在この店舗のメニューは準備中です。<br />
 お電話にてお問い合わせください。<br />
 <strong style={{ color: C.green }}>{storeInfo?.phone}</strong>
 </div>
 )}

 <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
 {menus.map((menu) => {
 const isExpanded = expandedMenuId === menu.id;
 const isSelected = selectedMenuId === menu.id;
 const priceText = menu.price === 0
 ? (menu.priceLabel === "無料" ? "無料" : menu.priceLabel)
 : `¥${menu.price.toLocaleString()}（${menu.priceLabel}）`;
 const durationText = menu.durationMin ? `${menu.durationMin}分` : null;

 return (
 <div key={menu.id} style={{
 background: isSelected ? C.bgSelected : C.bgCard,
 borderRadius: "10px",
 border: isSelected
 ? `2.5px solid ${C.sage}`
 : `1.5px solid ${C.border}`,
 boxShadow: isSelected
 ? `0 4px 16px rgba(169,192,166,0.25)`
 : "0 2px 8px rgba(0,0,0,0.04)",
 overflow: "hidden",
 transition: "all 0.2s ease",
 }}>
 {/* 選択済みバナー */}
 {isSelected && (
 <div style={{
 background: C.sage,
 color: "white",
 fontSize: "0.7rem",
 fontWeight: 700,
 letterSpacing: "0.08em",
 padding: "0.3rem 1.25rem",
 display: "flex",
 alignItems: "center",
 gap: "0.4rem",
 }}>
 <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
 <polyline points="20 6 9 17 4 12" />
 </svg>
 選択中のメニュー
 </div>
 )}

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
 style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px", flexShrink: 0, border: isSelected ? `2px solid ${C.sage}` : "none" }} />
 ) : (
 <div style={{ width: "60px", height: "60px", borderRadius: "6px", background: C.bgSub, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", border: isSelected ? `2px solid ${C.sage}` : `1px solid ${C.border}` }}>
 <span style={{ fontSize: "1.6rem" }}></span>
 </div>
 )}

 {/* 名前・料金・時間 */}
 <div style={{ flex: 1, minWidth: 0 }}>
 {menu.category && (
 <span style={{ fontSize: "0.62rem", color: C.sage, fontWeight: 600, letterSpacing: "0.05em", background: "#EAF2EA", padding: "0.1rem 0.5rem", borderRadius: "3px", display: "inline-block", marginBottom: "0.25rem" }}>
 {menu.category}
 </span>
 )}
 <p style={{ fontWeight: 700, fontSize: "0.95rem", color: isSelected ? C.greenDark : C.text, margin: 0, lineHeight: 1.3 }}>
 {menu.name}
 </p>
 <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.3rem", flexWrap: "wrap" }}>
 {durationText && (
 <span style={{ fontSize: "0.75rem", color: C.textMuted }}>
 ⏱ {durationText}
 </span>
 )}
 <span style={{ fontSize: "0.75rem", color: C.green, fontWeight: 700 }}>
 {priceText}
 </span>
 </div>
 </div>

 {/* 展開アイコン */}
 <span style={{
 fontSize: "0.75rem",
 color: C.sage,
 flexShrink: 0,
 transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
 transition: "transform 0.2s",
 display: "inline-block",
 }}>▼</span>
 </button>

 {/* 詳細（展開時） */}
 {isExpanded && (
 <div style={{ padding: "0 1.25rem 1.25rem", borderTop: `1px solid ${C.border}` }}>
 {/* 画像（大） */}
 {menu.imageUrl && (
 <img src={menu.imageUrl} alt={menu.name}
 style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "8px", marginTop: "1rem", marginBottom: "1rem" }} />
 )}

 {/* 説明 */}
 {menu.description && (
 <div style={{ marginTop: menu.imageUrl ? 0 : "1rem" }}>
 <p style={{ fontSize: "0.72rem", fontWeight: 600, color: C.sage, letterSpacing: "0.08em", marginBottom: "0.4rem" }}>メニュー説明</p>
 <p style={{ fontSize: "0.83rem", color: C.textSub, lineHeight: 1.85, margin: 0, whiteSpace: "pre-wrap" }}>
 {menu.description}
 </p>
 </div>
 )}

 {/* 施術内容 */}
 {menu.treatmentContent && (
 <div style={{ marginTop: "1rem" }}>
 <p style={{ fontSize: "0.72rem", fontWeight: 600, color: C.sage, letterSpacing: "0.08em", marginBottom: "0.4rem" }}>施術内容</p>
 <p style={{ fontSize: "0.83rem", color: C.textSub, lineHeight: 1.85, margin: 0, whiteSpace: "pre-wrap" }}>
 {menu.treatmentContent}
 </p>
 </div>
 )}

 {/* 対象者 */}
 {menu.targetCustomer && (
 <div style={{ marginTop: "0.75rem", background: "#EAF2EA", borderRadius: "6px", padding: "0.6rem 0.9rem", border: `1px solid ${C.light}` }}>
 <p style={{ fontSize: "0.72rem", fontWeight: 600, color: C.sage, marginBottom: "0.25rem" }}>こんな方におすすめ</p>
 <p style={{ fontSize: "0.8rem", color: C.green, lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>
 {menu.targetCustomer}
 </p>
 </div>
 )}

 {/* このメニューで予約するボタン */}
 <button
 type="button"
 onClick={() => {
 setSelectedMenuId(menu.id);
 setSelectedMenuName(menu.name);
 setStep("form");
 window.scrollTo({ top: 0, behavior: "smooth" });
 }}
 style={{
 marginTop: "1.25rem",
 width: "100%",
 padding: "0.9rem",
 background: isSelected ? C.sage : C.green,
 color: "white",
 border: "none",
 borderRadius: "6px",
 fontSize: "0.9rem",
 fontWeight: 700,
 letterSpacing: "0.05em",
 cursor: "pointer",
 fontFamily: "'Noto Sans JP', sans-serif",
 display: "flex",
 alignItems: "center",
 justifyContent: "center",
 gap: "0.5rem",
 }}
 >
 {isSelected ? (
 <>
 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
 <polyline points="20 6 9 17 4 12" />
 </svg>
 このメニューで予約する
 </>
 ) : (
 "このメニューで予約する →"
 )}
 </button>
 </div>
 )}
 </div>
 );
 })}
 </div>

 <button type="button" onClick={() => { setStep("store"); setSelectedStore(""); }}
 style={{ marginTop: "1.5rem", fontSize: "0.8rem", color: C.sage, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
 ← 店舗選択に戻る
 </button>
 </div>
 )}

 {/* ---- STEP 3: 情報入力フォーム ---- */}
 {step === "form" && (
 <form onSubmit={handleSubmit} noValidate>
 {/* 選択中メニュー・店舗 — 強調サマリーカード */}
 <div style={{
 background: C.bgSelected,
 border: `2px solid ${C.sage}`,
 borderRadius: "10px",
 padding: "1rem 1.25rem",
 marginBottom: "1.5rem",
 boxShadow: `0 4px 16px rgba(169,192,166,0.2)`,
 }}>
 <p style={{ fontSize: "0.65rem", fontWeight: 700, color: C.sage, letterSpacing: "0.12em", marginBottom: "0.75rem" }}>
 ✓ ご予約内容の確認
 </p>
 <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: "0.5rem 0.75rem", alignItems: "start" }}>
 <span style={{ fontSize: "0.72rem", color: C.textMuted, paddingTop: "2px" }}>店舗</span>
 <span style={{ fontSize: "0.9rem", fontWeight: 700, color: C.green }}>{storeInfo?.label}</span>
 <button type="button" onClick={() => { setStep("store"); setSelectedStore(""); setSelectedMenuId(""); setSelectedMenuName(""); }}
 style={{ fontSize: "0.68rem", color: C.sage, background: "none", border: `1px solid ${C.sage}`, borderRadius: "4px", cursor: "pointer", padding: "0.2rem 0.5rem", whiteSpace: "nowrap" }}>変更</button>

 <span style={{ fontSize: "0.72rem", color: C.textMuted, paddingTop: "2px" }}>メニュー</span>
 <span style={{ fontSize: "0.9rem", fontWeight: 700, color: C.green }}>{selectedMenuName || selectedMenuId}</span>
 <button type="button" onClick={() => { setStep("menu"); setSelectedMenuId(""); setSelectedMenuName(""); }}
 style={{ fontSize: "0.68rem", color: C.sage, background: "none", border: `1px solid ${C.sage}`, borderRadius: "4px", cursor: "pointer", padding: "0.2rem 0.5rem", whiteSpace: "nowrap" }}>変更</button>
 </div>
 {selectedMenu && (
 <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: `1px solid ${C.light}`, display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
 {selectedMenu.durationMin && (
 <span style={{ fontSize: "0.75rem", color: C.textSub, background: C.bgCard, padding: "0.2rem 0.6rem", borderRadius: "4px", border: `1px solid ${C.border}` }}>
 ⏱ {selectedMenu.durationMin}分
 </span>
 )}
 {selectedMenu.price > 0 && (
 <span style={{ fontSize: "0.75rem", color: C.green, fontWeight: 700, background: C.bgCard, padding: "0.2rem 0.6rem", borderRadius: "4px", border: `1px solid ${C.border}` }}>
 ¥{selectedMenu.price.toLocaleString()}（{selectedMenu.priceLabel}）
 </span>
 )}
 </div>
 )}
 </div>

 {/* 営業時間インフォ */}
 {storeInfo && (
 <div style={{ background: "#EAF2EA", border: `1px solid ${C.light}`, borderRadius: "8px", padding: "0.9rem 1.1rem", marginBottom: "1.5rem" }}>
 <p style={{ fontSize: "0.75rem", fontWeight: 700, color: C.green, marginBottom: "0.3rem" }}>{storeInfo.label}</p>
 <p style={{ fontSize: "0.72rem", color: C.textSub, lineHeight: 1.6, margin: "0 0 0.2rem" }}>
 営業時間：<strong>{storeInfo.hours}</strong>
 </p>
 {storeInfo.checkHours && (
 <p style={{ fontSize: "0.72rem", color: C.textSub, lineHeight: 1.6, margin: 0 }}>
 {storeInfo.checkHours}
 </p>
 )}
 </div>
 )}

 <p style={{ fontSize: "0.72rem", letterSpacing: "0.15em", color: C.sage, fontWeight: 600, marginBottom: "0.75rem" }}>
 STEP 3 — ご予約内容を入力する
 </p>

 <div style={{ background: C.bgCard, borderRadius: "10px", boxShadow: "0 2px 16px rgba(112,120,98,0.08)", padding: "2rem 1.5rem", display: "flex", flexDirection: "column", gap: "1.5rem", border: `1px solid ${C.border}` }}>

 {/* お名前 */}
 <div>
 <label style={labelStyle}>お名前 <span style={requiredStyle}>*</span></label>
 <input type="text" placeholder="山田 花子" value={form.name}
 onChange={(e) => setForm({ ...form, name: e.target.value })}
 style={errors.name ? { ...inputStyle, borderColor: C.error } : inputStyle} />
 {errors.name && <p style={errorStyle}>{errors.name}</p>}
 </div>

 {/* 電話番号 */}
 <div>
 <label style={labelStyle}>電話番号 <span style={requiredStyle}>*</span></label>
 <input type="tel" placeholder="090-0000-0000" value={form.phone}
 onChange={(e) => setForm({ ...form, phone: e.target.value })}
 style={errors.phone ? { ...inputStyle, borderColor: C.error } : inputStyle} />
 {errors.phone && <p style={errorStyle}>{errors.phone}</p>}
 </div>

 {/* メールアドレス */}
 <div>
 <label style={labelStyle}>メールアドレス</label>
 <input type="email" placeholder="example@email.com" value={form.email}
 onChange={(e) => setForm({ ...form, email: e.target.value })}
 style={errors.email ? { ...inputStyle, borderColor: C.error } : inputStyle} />
 {errors.email && <p style={errorStyle}>{errors.email}</p>}
 <p style={{ fontSize: "0.72rem", color: C.textMuted, marginTop: "0.3rem" }}>確認メールをお送りする際に使用します（任意）</p>
 </div>

 {/* ご希望日 */}
 <div>
 <label style={labelStyle}>ご希望日 <span style={requiredStyle}>*</span></label>
 <input type="date" min={minDate} value={form.desiredDate}
 onChange={(e) => setForm({ ...form, desiredDate: e.target.value })}
 style={errors.desiredDate ? { ...inputStyle, borderColor: C.error } : inputStyle} />
 {errors.desiredDate && <p style={errorStyle}>{errors.desiredDate}</p>}
 <p style={{ fontSize: "0.72rem", color: C.textSub, marginTop: "0.35rem", lineHeight: 1.6 }}>
 ※ 当日予約はお電話にて承ります　<strong>{storeInfo?.phone ?? "070-2642-7366"}（直通）</strong>
 </p>
 </div>

 {/* ご希望時間 */}
 <div>
 <label style={labelStyle}>ご希望時間 <span style={requiredStyle}>*</span></label>
 <select value={form.desiredTime}
 onChange={(e) => setForm({ ...form, desiredTime: e.target.value })}
 style={errors.desiredTime ? { ...inputStyle, borderColor: C.error } : inputStyle}>
 <option value="">時間を選択してください</option>
 {selectedStore === "hankyu" ? (
 <>
 <optgroup label="予約可能時間帯（12:00〜16:00）">
 {HANKYU_TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
 </optgroup>
 <optgroup label="その他">
 {HANKYU_TIME_SLOTS_OTHER.map((t) => <option key={t} value={t}>{t}</option>)}
 </optgroup>
 </>
 ) : (
 <optgroup label="ご希望時間帯">
 {SALON_TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
 </optgroup>
 )}
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
 <div style={{ background: "#EAF2EA", border: `1.5px solid ${C.light}`, borderRadius: "8px", padding: "1rem 1.1rem" }}>
 <label style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", cursor: "pointer" }}>
 <input type="checkbox" checked={form.agreeCancel}
 onChange={(e) => setForm({ ...form, agreeCancel: e.target.checked })}
 style={{ marginTop: "2px", width: "16px", height: "16px", accentColor: C.sage, flexShrink: 0 }} />
 <span style={{ fontSize: "0.82rem", color: C.textSub, lineHeight: 1.7 }}>
 <strong style={{ color: C.green }}>キャンセルポリシーに同意する</strong>（必須）<br />
 キャンセルをご希望の際は、電話またはメールにて前日までにご連絡をお願いいたします。
 </span>
 </label>
 {(errors as Record<string, string>).agreeCancel && (
 <p style={{ ...errorStyle, marginTop: "0.5rem", paddingLeft: "1.75rem" }}>{(errors as Record<string, string>).agreeCancel}</p>
 )}
 </div>

 {errors.submit && (
 <p style={{ fontSize: "0.82rem", color: C.error, textAlign: "center" }}>{errors.submit}</p>
 )}

 {/* 送信ボタン */}
 <button type="submit" disabled={createReservation.isPending}
 style={{
 width: "100%", padding: "1rem",
 background: createReservation.isPending ? C.light : C.green,
 color: "white", border: "none", borderRadius: "6px",
 fontSize: "0.95rem", fontWeight: 700, letterSpacing: "0.08em",
 cursor: createReservation.isPending ? "not-allowed" : "pointer",
 fontFamily: "'Noto Sans JP', sans-serif",
 }}>
 {createReservation.isPending ? "送信中..." : "予約を申し込む"}
 </button>

 <p style={{ fontSize: "0.75rem", color: C.textMuted, textAlign: "center", lineHeight: 1.7 }}>
 ※ 担当者よりメールまたはお電話にてご連絡いたします。<br />
 個人情報は予約確認の目的のみに使用し、第三者に提供しません。
 </p>
 </div>
 </form>
 )}

 </main>

 {/* フッター */}
 <footer style={{ backgroundColor: C.greenDark, padding: "2rem 1.5rem", textAlign: "center" }}>
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
