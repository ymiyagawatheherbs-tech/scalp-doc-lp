/*
 * 植物美容サロン 予約一覧管理画面
 * BOTANICAL CHARM カラー: #A9C0A6 / #F5EDE3 / #707862 / #DDD5CC / #C5D3C4
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

const C = {
  bg:        "#F5EDE3",
  bgLight:   "#faf7f3",
  header:    "#707862",
  accent:    "#A9C0A6",
  accentDk:  "#5a6b57",
  muted:     "#DDD5CC",
  mutedDk:   "#C5D3C4",
  text:      "#3a3d30",
  textLight: "#7a7d6a",
};

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: "受付中",     color: "#5a6b57", bg: "#d4e8d1" },
  confirmed: { label: "確定",       color: "#2d5a27", bg: "#b8ddb5" },
  cancelled: { label: "キャンセル", color: "#7a3a3a", bg: "#f0d0d0" },
};

const GENDER_LABELS: Record<string, string> = { women: "レディース", men: "メンズ" };

export default function SalonAdmin() {
  const { isAuthenticated: isManusAuth, loading: manusLoading } = useAuth();
  const { data: staffUser, isLoading: staffLoading } = trpc.staff.me.useQuery(undefined, {
    refetchOnWindowFocus: false,
    retry: false,
  });

  const isAuthenticated = isManusAuth || !!staffUser;
  const loading = manusLoading || staffLoading;

  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
  const [search, setSearch] = useState("");

  const { data: reservations, isLoading: listLoading, refetch } = trpc.reservation.adminList.useQuery(
    { salonId: "salon" },
    { enabled: isAuthenticated, refetchOnWindowFocus: false }
  );

  const allReservations = reservations ?? [];

  const utils = trpc.useUtils();
  const updateStatus = trpc.reservation.updateStatus.useMutation({
    onSuccess: () => {
      refetch();
      utils.reservation.list.invalidate();
    },
    onError: (err) => toast.error(err.message || "ステータス更新に失敗しました"),
  });

  const staffLogout = trpc.staff.logout.useMutation({
    onSuccess: () => { window.location.href = "/staff-login"; },
  });

  if (loading) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg }}>
        <p style={{ color: C.textLight, fontFamily: "'Noto Sans JP', sans-serif" }}>読み込み中...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: C.bg, fontFamily: "'Noto Sans JP', sans-serif", gap: "1rem", padding: "1.5rem" }}>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet" />
        <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }} />
        <p style={{ fontSize: "1rem", fontWeight: 700, color: C.text }}>植物美容サロン 管理画面</p>
        <p style={{ fontSize: "0.82rem", color: C.textLight, textAlign: "center" }}>スタッフアカウントでログインしてください。</p>
        <a href="/staff-login" style={{ padding: "0.75rem 2.5rem", background: C.header, color: "#fff", borderRadius: "6px", textDecoration: "none", fontSize: "0.9rem", fontWeight: 700, letterSpacing: "0.05em" }}>
          スタッフログイン
        </a>
        <a href={getLoginUrl()} style={{ padding: "0.65rem 2rem", background: "transparent", color: C.header, border: `1px solid ${C.muted}`, borderRadius: "6px", textDecoration: "none", fontSize: "0.82rem", fontWeight: 500 }}>
          Manusアカウントでログイン（管理者用）
        </a>
      </div>
    );
  }

  const filtered = allReservations.filter((r) => {
    if (filter !== "all" && r.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return r.name.toLowerCase().includes(q) || r.phone.includes(q) || (r.email ?? "").toLowerCase().includes(q);
    }
    return true;
  });

  const counts = {
    all: allReservations.length,
    pending: allReservations.filter((r) => r.status === "pending").length,
    confirmed: allReservations.filter((r) => r.status === "confirmed").length,
    cancelled: allReservations.filter((r) => r.status === "cancelled").length,
  };

  const currentUser = staffUser ? staffUser.name : "管理者";

  return (
    <div style={{ minHeight: "100dvh", background: C.bg, fontFamily: "'Noto Sans JP', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet" />

      {/* ヘッダー */}
      <header style={{ background: C.header, padding: "0.9rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>

          <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.95rem", letterSpacing: "0.06em" }}>植物美容サロン</span>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginLeft: "0.5rem" }}>
            <span style={{ color: "#fff", background: "rgba(255,255,255,0.25)", border: "1px solid rgba(255,255,255,0.6)", borderRadius: "6px", padding: "0.25rem 0.75rem", fontSize: "0.78rem", fontWeight: 600 }}>一覧</span>
            <Link href="/salon-admin/calendar" style={{ color: "#fff", fontSize: "0.78rem", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "6px", padding: "0.25rem 0.75rem", textDecoration: "none" }}>カレンダー</Link>
            <Link href="/salon-admin/menus" style={{ color: "#fff", fontSize: "0.78rem", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "6px", padding: "0.25rem 0.75rem", textDecoration: "none" }}>メニュー管理</Link>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ color: "#e8f0e7", fontSize: "0.8rem" }}>{currentUser}</span>
          {staffUser ? (
            <button onClick={() => staffLogout.mutate()} style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", background: "none", border: "none", cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif" }}>
              ログアウト
            </button>
          ) : (
            <Link href="/" style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.78rem", textDecoration: "none" }}>← サイトへ戻る</Link>
          )}
        </div>
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: C.text, marginBottom: "0.4rem" }}>予約一覧</h1>
        <p style={{ fontSize: "0.82rem", color: C.textLight, marginBottom: "1.75rem" }}>
          植物美容サロンの予約を管理します。ステータスを変更すると即座に保存されます。
        </p>

        {/* フィルターバー */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem", marginBottom: "1.25rem", alignItems: "center" }}>
          {(["all", "pending", "confirmed", "cancelled"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: "0.4rem 1rem",
                borderRadius: "20px",
                border: "1.5px solid",
                borderColor: filter === s ? C.accentDk : C.muted,
                background: filter === s ? C.accent : "white",
                color: filter === s ? "white" : C.textLight,
                fontSize: "0.82rem",
                fontWeight: filter === s ? 700 : 400,
                cursor: "pointer",
                fontFamily: "'Noto Sans JP', sans-serif",
              }}
            >
              {s === "all" ? "すべて" : STATUS_LABELS[s].label}
              <span style={{ marginLeft: "0.4rem", fontSize: "0.75rem", opacity: 0.85 }}>({counts[s]})</span>
            </button>
          ))}
          <input
            type="text"
            placeholder="名前・電話・メールで検索"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              marginLeft: "auto",
              padding: "0.4rem 0.9rem",
              border: `1.5px solid ${C.muted}`,
              borderRadius: "4px",
              fontSize: "0.82rem",
              color: C.text,
              background: "white",
              outline: "none",
              minWidth: "200px",
              fontFamily: "'Noto Sans JP', sans-serif",
            }}
          />
        </div>

        {/* テーブル */}
        {listLoading ? (
          <p style={{ color: "#aaa", textAlign: "center", padding: "3rem" }}>読み込み中...</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: "#aaa", textAlign: "center", padding: "3rem" }}>該当する予約がありません。</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", background: "white", borderRadius: "6px", overflow: "hidden", boxShadow: "0 2px 12px rgba(112,120,98,0.08)" }}>
              <thead>
                <tr style={{ background: C.mutedDk, borderBottom: `2px solid ${C.muted}` }}>
                  {["ID", "受付日", "お名前", "電話番号", "メール", "コース", "希望日時", "性別", "ステータス", "操作"].map((h) => (
                    <th key={h} style={{ padding: "0.75rem 0.9rem", textAlign: "left", fontWeight: 700, color: C.header, whiteSpace: "nowrap", fontSize: "0.78rem", letterSpacing: "0.04em" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const st = STATUS_LABELS[r.status] ?? STATUS_LABELS.pending;
                  return (
                    <tr key={r.id} style={{ borderBottom: `1px solid ${C.muted}`, background: i % 2 === 0 ? "white" : C.bgLight }}>
                      <td style={{ padding: "0.7rem 0.9rem", color: "#aaa", fontSize: "0.75rem" }}>#{r.id}</td>
                      <td style={{ padding: "0.7rem 0.9rem", whiteSpace: "nowrap", color: C.textLight, fontSize: "0.78rem" }}>
                        {new Date(r.createdAt).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td style={{ padding: "0.7rem 0.9rem", fontWeight: 600, color: C.text, whiteSpace: "nowrap" }}>{r.name}</td>
                      <td style={{ padding: "0.7rem 0.9rem", color: C.text, whiteSpace: "nowrap" }}>
                        <a href={`tel:${r.phone}`} style={{ color: C.accentDk, textDecoration: "none" }}>{r.phone}</a>
                      </td>
                      <td style={{ padding: "0.7rem 0.9rem", color: C.text, fontSize: "0.78rem" }}>
                        {r.email ? (
                          <a href={`mailto:${r.email}`} style={{ color: C.accentDk, textDecoration: "none" }}>{r.email}</a>
                        ) : (
                          <span style={{ color: "#ccc" }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: "0.7rem 0.9rem", whiteSpace: "nowrap", color: C.text }}>{r.plan}</td>
                      <td style={{ padding: "0.7rem 0.9rem", whiteSpace: "nowrap", color: C.text }}>
                        {r.desiredDate}<br />
                        <span style={{ fontSize: "0.75rem", color: C.textLight }}>{r.desiredTime}</span>
                      </td>
                      <td style={{ padding: "0.7rem 0.9rem", color: C.textLight, fontSize: "0.78rem" }}>
                        {GENDER_LABELS[r.gender] ?? r.gender}
                      </td>
                      <td style={{ padding: "0.7rem 0.9rem" }}>
                        <span style={{ display: "inline-block", padding: "0.25rem 0.65rem", borderRadius: "12px", background: st.bg, color: st.color, fontSize: "0.75rem", fontWeight: 700, whiteSpace: "nowrap" }}>
                          {st.label}
                        </span>
                      </td>
                      <td style={{ padding: "0.7rem 0.9rem" }}>
                        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                          {r.status !== "confirmed" && (
                            <button
                              onClick={() => updateStatus.mutate({ id: r.id, status: "confirmed" })}
                              disabled={updateStatus.isPending}
                              style={{ padding: "0.3rem 0.7rem", background: "#b8ddb5", color: "#2d5a27", border: "1px solid #a0c89d", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif", whiteSpace: "nowrap" }}
                            >確定</button>
                          )}
                          {r.status !== "pending" && (
                            <button
                              onClick={() => updateStatus.mutate({ id: r.id, status: "pending" })}
                              disabled={updateStatus.isPending}
                              style={{ padding: "0.3rem 0.7rem", background: "#e8f0e7", color: "#5a6b57", border: `1px solid ${C.accent}`, borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif", whiteSpace: "nowrap" }}
                            >受付中に戻す</button>
                          )}
                          {r.status !== "cancelled" && (
                            <button
                              onClick={() => { if (window.confirm(`${r.name}様の予約をキャンセルしますか？`)) updateStatus.mutate({ id: r.id, status: "cancelled" }); }}
                              disabled={updateStatus.isPending}
                              style={{ padding: "0.3rem 0.7rem", background: "#f0d0d0", color: "#7a3a3a", border: "1px solid #e0b0b0", borderRadius: "4px", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif", whiteSpace: "nowrap" }}
                            >キャンセル</button>
                          )}
                        </div>
                        {r.message && (
                          <details style={{ marginTop: "0.4rem" }}>
                            <summary style={{ fontSize: "0.72rem", color: "#aaa", cursor: "pointer" }}>メモを見る</summary>
                            <p style={{ fontSize: "0.75rem", color: C.textLight, margin: "0.3rem 0 0", lineHeight: 1.6, maxWidth: "200px" }}>{r.message}</p>
                          </details>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <p style={{ fontSize: "0.75rem", color: "#bbb", textAlign: "right", marginTop: "1rem" }}>
          表示件数: {filtered.length} / {allReservations.length} 件
        </p>
      </main>
    </div>
  );
}
