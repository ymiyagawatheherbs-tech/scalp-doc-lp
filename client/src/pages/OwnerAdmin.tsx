/**
 * オーナー管理画面 (/owner-admin)
 * - Manusアカウント（オーナー）専用
 * - スタッフアカウント作成・一覧
 * - コンテンツ管理ページへのリンク
 */
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";

const OCCUPATION_LABELS: Record<string, string> = {
 hair_salon: "美容室・ヘアサロン",
 head_spa: "ヘッドスパ専門店",
 esthetic: "エステ・フェイシャルサロン",
 nail_lash: "ネイル・まつ毛・リラクゼーション",
 seitai: "整体・针炙・治療院",
 individual: "個人事業（その他）",
 corporate: "法人・複数店舗",
 not_yet: "まだ開業していない・検討中",
 side_job: "副業を考えている",
 other: "その他",
};

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
 new: { label: "新規", color: "#1e40af", bg: "#dbeafe" },
 contacted: { label: "連絡済", color: "#92400e", bg: "#fef3c7" },
 converted: { label: "成約", color: "#065f46", bg: "#d1fae5" },
 archived: { label: "アーカイブ", color: "#6b7280", bg: "#f3f4f6" },
};

export default function OwnerAdmin() {
 const { isAuthenticated, loading } = useAuth();

 // スタッフアカウント作成
 const [showCreateStaff, setShowCreateStaff] = useState(false);
 const [newStaffName, setNewStaffName] = useState("");
 const [newStaffEmail, setNewStaffEmail] = useState("");
 const [newStaffPassword, setNewStaffPassword] = useState("");
 const [newStaffPasswordConfirm, setNewStaffPasswordConfirm] = useState("");

 const { data: staffList, refetch: refetchStaffList } = trpc.staff.list.useQuery(undefined, {
 enabled: isAuthenticated,
 refetchOnWindowFocus: false,
 });

 const createStaffAccount = trpc.staff.createAccount.useMutation({
 onSuccess: () => {
 toast.success("スタッフアカウントを作成しました");
 setShowCreateStaff(false);
 setNewStaffName("");
 setNewStaffEmail("");
 setNewStaffPassword("");
 setNewStaffPasswordConfirm("");
 refetchStaffList();
 },
 onError: (err) => {
 toast.error(err.message || "アカウント作成に失敗しました");
 },
 });

 const handleCreateStaff = () => {
 if (!newStaffName || !newStaffEmail || !newStaffPassword || !newStaffPasswordConfirm) {
 toast.error("すべての項目を入力してください");
 return;
 }
 if (newStaffPassword !== newStaffPasswordConfirm) {
 toast.error("パスワードが一致しません");
 return;
 }
 if (newStaffPassword.length < 8) {
 toast.error("パスワードは8文字以上で設定してください");
 return;
 }
 createStaffAccount.mutate({ name: newStaffName, email: newStaffEmail, password: newStaffPassword });
 };

 const contentLinks = [
 { label: "ビフォーアフター管理", href: "/admin/before-after", icon: "" },
 { label: "お客様の声管理", href: "/admin/testimonials", icon: "" },
 { label: "ブログ管理", href: "/admin/blog", icon: "" },
 { label: "メニュー・料金管理", href: "/admin/menus", icon: "" },
 { label: "パートナーサロン管理", href: "/admin/salons", icon: "" },
 ];

 if (loading) {
 return (
 <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#faf8f5", fontFamily: "'Noto Sans JP', sans-serif" }}>
 <p style={{ color: "#aaa", fontSize: "0.9rem" }}>読み込み中...</p>
 </div>
 );
 }

 if (!isAuthenticated) {
 return (
 <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#faf8f5", fontFamily: "'Noto Sans JP', sans-serif", padding: "2rem" }}>
 <div style={{ textAlign: "center", maxWidth: "400px" }}>
 <p style={{ fontSize: "0.75rem", letterSpacing: "0.15em", color: "#c9a96e", marginBottom: "0.5rem", textTransform: "uppercase" }}>Owner Portal</p>
 <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#2a1a0a", marginBottom: "0.75rem", fontFamily: "'Shippori Mincho B1', serif" }}>オーナー管理画面</h1>
 <p style={{ fontSize: "0.85rem", color: "#888", marginBottom: "2rem", lineHeight: 1.7 }}>
 この画面はオーナー専用です。<br />Manusアカウントでログインしてください。
 </p>
 <a
 href={getLoginUrl()}
 style={{ display: "inline-block", padding: "0.75rem 2rem", background: "#2a1a0a", color: "#c9a96e", textDecoration: "none", borderRadius: "4px", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.08em", fontFamily: "'Noto Sans JP', sans-serif" }}
 >
 Manusアカウントでログイン
 </a>
 </div>
 </div>
 );
 }

 return (
 <div style={{ minHeight: "100vh", background: "#faf8f5", fontFamily: "'Noto Sans JP', sans-serif" }}>
 {/* ヘッダー */}
 <header style={{ background: "#2a1a0a", padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
 <div>
 <p style={{ fontSize: "0.65rem", letterSpacing: "0.2em", color: "#c9a96e", margin: 0, textTransform: "uppercase" }}>THE HERBS / SCALP LABO</p>
 <h1 style={{ fontSize: "1rem", fontWeight: 700, color: "white", margin: "0.15rem 0 0", fontFamily: "'Shippori Mincho B1', serif" }}>オーナー管理画面</h1>
 </div>
 <a href="https://scalp-labo-5tzs3tko.manus.space/reservations" style={{ fontSize: "0.75rem", color: "#c9a96e", textDecoration: "none", opacity: 0.8 }}>← サイトに戻る</a>
 </header>

 <main style={{ maxWidth: "800px", margin: "0 auto", padding: "2.5rem 1.5rem" }}>

 {/* コンテンツ管理リンク */}
 <section style={{ marginBottom: "3rem" }}>
 <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#2a1a0a", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "2px solid #e8ddd0" }}>
 コンテンツ管理
 </h2>
 <p style={{ fontSize: "0.82rem", color: "#888", marginBottom: "1.25rem", lineHeight: 1.7 }}>
 スタッフがログイン後に更新できる各コンテンツの管理ページです。
 </p>
 <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
 {contentLinks.map(({ label, href, icon }) => (
 <a
 key={href}
 href={href}
 style={{ display: "flex", alignItems: "center", gap: "0.6rem", padding: "0.9rem 1.1rem", background: "white", border: "1px solid #e8ddd0", borderRadius: "6px", textDecoration: "none", color: "#2a1a0a", fontSize: "0.85rem", fontWeight: 600, boxShadow: "0 2px 6px rgba(0,0,0,0.04)" }}
 >
 <span style={{ fontSize: "1.1rem" }}>{icon}</span>
 {label}
 </a>
 ))}
 </div>
 </section>

 {/* リード一覧 */}
 <LeadSection isAuthenticated={isAuthenticated} />

 {/* スタッフアカウント管理 */}
 <section>
 <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "2px solid #e8ddd0", flexWrap: "wrap", gap: "0.5rem" }}>
 <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#2a1a0a", margin: 0 }}>スタッフアカウント管理</h2>
 <button
 onClick={() => setShowCreateStaff(!showCreateStaff)}
 style={{ padding: "0.4rem 1rem", background: showCreateStaff ? "#f5f0ea" : "#c9a96e", color: showCreateStaff ? "#555" : "white", border: "none", borderRadius: "4px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif" }}
 >
 {showCreateStaff ? "閉じる" : "+ スタッフを追加"}
 </button>
 </div>

 {/* スタッフ作成フォーム */}
 {showCreateStaff && (
 <div style={{ background: "white", border: "1px solid #e8ddd0", borderRadius: "6px", padding: "1.5rem", maxWidth: "480px", marginBottom: "1.5rem", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
 <p style={{ fontSize: "0.8rem", color: "#888", marginBottom: "1.25rem", lineHeight: 1.7 }}>
 スタッフの名前・メールアドレス・パスワードを入力してアカウントを作成してください。
 </p>
 {[
 { label: "名前", type: "text", value: newStaffName, setter: setNewStaffName, placeholder: "例：田中 花子" },
 { label: "メールアドレス", type: "email", value: newStaffEmail, setter: setNewStaffEmail, placeholder: "staff@the-herbs.co.jp" },
 { label: "パスワード", type: "password", value: newStaffPassword, setter: setNewStaffPassword, placeholder: "8文字以上" },
 { label: "パスワード（確認）", type: "password", value: newStaffPasswordConfirm, setter: setNewStaffPasswordConfirm, placeholder: "再入力" },
 ].map(({ label, type, value, setter, placeholder }) => (
 <div key={label} style={{ marginBottom: "1rem" }}>
 <label style={{ display: "block", fontSize: "0.78rem", color: "#555", marginBottom: "0.3rem", fontWeight: 600 }}>{label}</label>
 <input
 type={type}
 value={value}
 onChange={(e) => setter(e.target.value)}
 placeholder={placeholder}
 style={{ width: "100%", padding: "0.55rem 0.75rem", border: "1.5px solid #e0d8d0", borderRadius: "4px", fontSize: "0.85rem", color: "#333", background: "#fdfaf7", outline: "none", fontFamily: "'Noto Sans JP', sans-serif", boxSizing: "border-box" }}
 />
 </div>
 ))}
 <button
 onClick={handleCreateStaff}
 disabled={createStaffAccount.isPending}
 style={{ width: "100%", padding: "0.65rem", background: "#2a1a0a", color: "#c9a96e", border: "none", borderRadius: "4px", fontSize: "0.88rem", fontWeight: 700, cursor: createStaffAccount.isPending ? "not-allowed" : "pointer", fontFamily: "'Noto Sans JP', sans-serif", letterSpacing: "0.05em", opacity: createStaffAccount.isPending ? 0.7 : 1 }}
 >
 {createStaffAccount.isPending ? "作成中..." : "アカウントを作成する"}
 </button>
 </div>
 )}

 {/* スタッフ一覧 */}
 {staffList && staffList.length > 0 ? (
 <div style={{ overflowX: "auto" }}>
 <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.83rem", background: "white", borderRadius: "6px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
 <thead>
 <tr style={{ background: "#f5f0ea", borderBottom: "2px solid #e8ddd0" }}>
 {["名前", "メールアドレス", "ステータス", "作成日"].map((h) => (
 <th key={h} style={{ padding: "0.65rem 0.9rem", textAlign: "left", fontWeight: 700, color: "#5a3e28", fontSize: "0.78rem", letterSpacing: "0.04em" }}>{h}</th>
 ))}
 </tr>
 </thead>
 <tbody>
 {staffList.map((s, i) => (
 <tr key={s.id} style={{ borderBottom: "1px solid #f0e8e0", background: i % 2 === 0 ? "white" : "#fdfaf7" }}>
 <td style={{ padding: "0.65rem 0.9rem", fontWeight: 600, color: "#2a1a0a" }}>{s.name}</td>
 <td style={{ padding: "0.65rem 0.9rem", color: "#555" }}>{s.email}</td>
 <td style={{ padding: "0.65rem 0.9rem" }}>
 <span style={{ display: "inline-block", padding: "0.2rem 0.6rem", borderRadius: "12px", background: s.active ? "#d1fae5" : "#fee2e2", color: s.active ? "#065f46" : "#991b1b", fontSize: "0.72rem", fontWeight: 700 }}>
 {s.active ? "有効" : "無効"}
 </span>
 </td>
 <td style={{ padding: "0.65rem 0.9rem", color: "#888", fontSize: "0.78rem" }}>
 {new Date(s.createdAt).toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo" })}
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 ) : (
 <p style={{ fontSize: "0.82rem", color: "#aaa", textAlign: "center", padding: "2rem", background: "white", borderRadius: "6px", border: "1px solid #e8ddd0" }}>
 スタッフアカウントがまだ登録されていません。<br />上の「＋スタッフを追加」ボタンから作成してください。
 </p>
 )}
 </section>
 </main>
 </div>
 );
}

// ========== リード一覧セクション ==========
function LeadSection({ isAuthenticated }: { isAuthenticated: boolean }) {
 const utils = trpc.useUtils();
 const { data: leads, isLoading } = trpc.salonLead.list.useQuery(undefined, {
 enabled: isAuthenticated,
 refetchOnWindowFocus: false,
 });

 const reissueToken = trpc.salonLead.reissueToken.useMutation({
 onSuccess: (data, variables) => {
 const url = `${window.location.origin}/partner-doc?token=${data.token}`;
 navigator.clipboard.writeText(url).then(() => {
 toast.success("リンクをクリップボードにコピーしました！72時間有効");
 }).catch(() => {
 toast.success(`新リンク: ${url}`);
 });
 utils.salonLead.list.invalidate();
 },
 onError: (err) => toast.error(err.message || "再発行に失敗しました"),
 });

 const updateStatus = trpc.salonLead.updateStatus.useMutation({
 onSuccess: () => {
 utils.salonLead.list.invalidate();
 },
 onError: (err) => toast.error(err.message || "ステータス更新に失敗しました"),
 });

 const inputStyle: React.CSSProperties = {
 padding: "0.3rem 0.5rem",
 border: "1.5px solid #e0d8d0",
 borderRadius: "4px",
 fontSize: "0.78rem",
 color: "#333",
 background: "#fdfaf7",
 fontFamily: "'Noto Sans JP', sans-serif",
 cursor: "pointer",
 };

 return (
 <section style={{ marginBottom: "3rem" }}>
 <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem", paddingBottom: "0.5rem", borderBottom: "2px solid #e8ddd0", flexWrap: "wrap", gap: "0.5rem" }}>
 <h2 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#2a1a0a", margin: 0 }}>
 資料請求リード一覧
 </h2>
 {leads && (
 <span style={{ fontSize: "0.78rem", color: "#888", background: "#f5f0ea", padding: "0.2rem 0.6rem", borderRadius: "12px" }}>
 {leads.length}件
 </span>
 )}
 </div>

 {isLoading ? (
 <p style={{ fontSize: "0.82rem", color: "#aaa", padding: "1.5rem", textAlign: "center" }}>読み込み中...</p>
 ) : !leads || leads.length === 0 ? (
 <p style={{ fontSize: "0.82rem", color: "#aaa", textAlign: "center", padding: "2rem", background: "white", borderRadius: "6px", border: "1px solid #e8ddd0" }}>
 まだ資料請求がありません。
 </p>
 ) : (
 <div style={{ overflowX: "auto" }}>
 <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem", background: "white", borderRadius: "6px", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
 <thead>
 <tr style={{ background: "#f5f0ea", borderBottom: "2px solid #e8ddd0" }}>
 {["氏名", "職業", "連絡先", "トークン状態", "ステータス", "登録日", "操作"].map((h) => (
 <th key={h} style={{ padding: "0.6rem 0.8rem", textAlign: "left", fontWeight: 700, color: "#5a3e28", fontSize: "0.75rem", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{h}</th>
 ))}
 </tr>
 </thead>
 <tbody>
 {leads.map((lead, i) => {
 const now = Date.now();
 const tokenValid = lead.accessToken && lead.tokenExpiresAt && now < lead.tokenExpiresAt;
 const tokenExpired = lead.accessToken && lead.tokenExpiresAt && now >= lead.tokenExpiresAt;
 const hoursLeft = lead.tokenExpiresAt ? Math.max(0, Math.floor((lead.tokenExpiresAt - now) / 3600000)) : 0;
 const st = STATUS_LABELS[lead.status] ?? STATUS_LABELS.new;

 return (
 <tr key={lead.id} style={{ borderBottom: "1px solid #f0e8e0", background: i % 2 === 0 ? "white" : "#fdfaf7" }}>
 {/* 氏名 */}
 <td style={{ padding: "0.6rem 0.8rem", fontWeight: 600, color: "#2a1a0a", whiteSpace: "nowrap" }}>{lead.name}</td>

 {/* 職業 */}
 <td style={{ padding: "0.6rem 0.8rem", color: "#555", whiteSpace: "nowrap" }}>
 {OCCUPATION_LABELS[lead.occupation] ?? lead.occupation}
 </td>

 {/* 連絡先 */}
 <td style={{ padding: "0.6rem 0.8rem", color: "#555", maxWidth: "180px", wordBreak: "break-all" }}>
 <span style={{ fontSize: "0.72rem", color: "#888", marginRight: "0.3rem" }}>✉</span>
 {lead.email}
 </td>

 {/* トークン状態 */}
 <td style={{ padding: "0.6rem 0.8rem", whiteSpace: "nowrap" }}>
 {tokenValid ? (
 <span style={{ display: "inline-block", padding: "0.2rem 0.5rem", borderRadius: "10px", background: "#d1fae5", color: "#065f46", fontSize: "0.7rem", fontWeight: 700 }}>
 有効（残{hoursLeft}h）
 </span>
 ) : tokenExpired ? (
 <span style={{ display: "inline-block", padding: "0.2rem 0.5rem", borderRadius: "10px", background: "#fee2e2", color: "#991b1b", fontSize: "0.7rem", fontWeight: 700 }}>
 期限切れ
 </span>
 ) : (
 <span style={{ display: "inline-block", padding: "0.2rem 0.5rem", borderRadius: "10px", background: "#f3f4f6", color: "#6b7280", fontSize: "0.7rem" }}>
 未発行
 </span>
 )}
 </td>

 {/* ステータス */}
 <td style={{ padding: "0.6rem 0.8rem" }}>
 <select
 value={lead.status}
 onChange={(e) => updateStatus.mutate({ leadId: lead.id, status: e.target.value as any })}
 style={inputStyle}
 >
 {Object.entries(STATUS_LABELS).map(([val, { label }]) => (
 <option key={val} value={val}>{label}</option>
 ))}
 </select>
 </td>

 {/* 登録日 */}
 <td style={{ padding: "0.6rem 0.8rem", color: "#888", fontSize: "0.75rem", whiteSpace: "nowrap" }}>
 {new Date(lead.createdAt).toLocaleDateString("ja-JP", { timeZone: "Asia/Tokyo", month: "2-digit", day: "2-digit" })}
 <br />
 <span style={{ fontSize: "0.7rem" }}>{new Date(lead.createdAt).toLocaleTimeString("ja-JP", { timeZone: "Asia/Tokyo", hour: "2-digit", minute: "2-digit" })}</span>
 </td>

 {/* 操作 */}
 <td style={{ padding: "0.6rem 0.8rem", whiteSpace: "nowrap" }}>
 <button
 onClick={() => reissueToken.mutate({ leadId: lead.id })}
 disabled={reissueToken.isPending}
 title="トークンを再発行してリンクをコピー"
 style={{ padding: "0.3rem 0.7rem", background: "#2a1a0a", color: "#c9a96e", border: "none", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, cursor: reissueToken.isPending ? "not-allowed" : "pointer", fontFamily: "'Noto Sans JP', sans-serif", opacity: reissueToken.isPending ? 0.6 : 1 }}
 >
 リンク再発行
 </button>
 </td>
 </tr>
 );
 })}
 </tbody>
 </table>
 <p style={{ fontSize: "0.72rem", color: "#aaa", marginTop: "0.5rem" }}>
 ※ 「リンク再発行」をクリックすると新しいリンク（72時間有効）をクリップボードにコピーします。メール・電話・メッセージで相手に送付してください。
 </p>
 </div>
 )}
 </section>
 );
}
