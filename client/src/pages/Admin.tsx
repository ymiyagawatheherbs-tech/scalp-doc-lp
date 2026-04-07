/**
 * 管理者向け予約一覧管理画面
 * ログイン必須（Manus OAuth）
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { useState } from "react";

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: "受付中",   color: "#92400e", bg: "#fef3c7" },
  confirmed: { label: "確定",     color: "#065f46", bg: "#d1fae5" },
  cancelled: { label: "キャンセル", color: "#991b1b", bg: "#fee2e2" },
};

const PLAN_LABELS: Record<string, string> = {
  free:     "無料スカルプチェック",
  standard: "定期ケア",
  personal: "パーソナルケア",
  consult:  "相談希望",
};

const GENDER_LABELS: Record<string, string> = {
  women: "レディース",
  men:   "メンズ",
};

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
  const [search, setSearch] = useState("");

  const { data: reservations, isLoading, refetch } = trpc.reservation.adminList.useQuery(undefined, {
    enabled: isAuthenticated,
    refetchOnWindowFocus: false,
  });

  const updateStatus = trpc.reservation.updateStatus.useMutation({
    onSuccess: () => refetch(),
  });

  // ログイン前
  if (loading) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#faf8f5" }}>
        <p style={{ color: "#888", fontFamily: "'Noto Sans JP', sans-serif" }}>読み込み中...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#faf8f5", fontFamily: "'Noto Sans JP', sans-serif", gap: "1.5rem" }}>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet" />
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "1.1rem", fontWeight: 700, color: "#2a1a0a", marginBottom: "0.5rem" }}>管理者ログインが必要です</p>
          <p style={{ fontSize: "0.85rem", color: "#888" }}>この画面はログイン済みの管理者のみ閲覧できます。</p>
        </div>
        <a
          href={getLoginUrl()}
          style={{
            padding: "0.75rem 2rem",
            background: "#2a1a0a",
            color: "#c9a96e",
            borderRadius: "4px",
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: 700,
            letterSpacing: "0.05em",
          }}
        >
          ログインして管理画面を開く
        </a>
      </div>
    );
  }

  const filtered = (reservations ?? []).filter((r) => {
    if (filter !== "all" && r.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        (r.email ?? "").toLowerCase().includes(q)
      );
    }
    return true;
  });

  const counts = {
    all: reservations?.length ?? 0,
    pending: reservations?.filter((r) => r.status === "pending").length ?? 0,
    confirmed: reservations?.filter((r) => r.status === "confirmed").length ?? 0,
    cancelled: reservations?.filter((r) => r.status === "cancelled").length ?? 0,
  };

  return (
    <div style={{ minHeight: "100dvh", background: "#faf8f5", fontFamily: "'Noto Sans JP', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet" />

      {/* ヘッダー */}
      <header style={{ background: "#2a1a0a", padding: "0.9rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/logo-mark-transparent_70663ccb.png"
            alt="SCALP LABO"
            style={{ height: "1.75rem", width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.85 }}
          />
          <span style={{ color: "#c9a96e", fontWeight: 700, fontSize: "0.95rem", letterSpacing: "0.08em" }}>予約管理</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ color: "#c9a96e", fontSize: "0.8rem" }}>{user?.name ?? user?.openId}</span>
          <a href="/" style={{ color: "#888", fontSize: "0.78rem", textDecoration: "none" }}>← サイトへ戻る</a>
        </div>
      </header>

      <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "2rem 1.5rem" }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: 700, color: "#2a1a0a", marginBottom: "0.4rem" }}>予約一覧</h1>
        <p style={{ fontSize: "0.82rem", color: "#888", marginBottom: "1.75rem" }}>
          ステータスを変更すると即座に保存されます。
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
                borderColor: filter === s ? "#c9a96e" : "#e0d8d0",
                background: filter === s ? "#c9a96e" : "white",
                color: filter === s ? "white" : "#555",
                fontSize: "0.82rem",
                fontWeight: filter === s ? 700 : 400,
                cursor: "pointer",
                fontFamily: "'Noto Sans JP', sans-serif",
              }}
            >
              {s === "all" ? "すべて" : STATUS_LABELS[s].label}
              <span style={{ marginLeft: "0.4rem", fontSize: "0.75rem", opacity: 0.85 }}>
                ({counts[s]})
              </span>
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
              border: "1.5px solid #e0d8d0",
              borderRadius: "4px",
              fontSize: "0.82rem",
              color: "#333",
              background: "white",
              outline: "none",
              minWidth: "220px",
              fontFamily: "'Noto Sans JP', sans-serif",
            }}
          />
        </div>

        {/* テーブル */}
        {isLoading ? (
          <p style={{ color: "#aaa", textAlign: "center", padding: "3rem" }}>読み込み中...</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: "#aaa", textAlign: "center", padding: "3rem" }}>該当する予約がありません。</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem", background: "white", borderRadius: "6px", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
              <thead>
                <tr style={{ background: "#f5f0ea", borderBottom: "2px solid #e8ddd0" }}>
                  {["ID", "受付日", "お名前", "電話番号", "メール", "コース", "希望日時", "性別", "ステータス", "操作"].map((h) => (
                    <th key={h} style={{ padding: "0.75rem 0.9rem", textAlign: "left", fontWeight: 700, color: "#5a3e28", whiteSpace: "nowrap", fontSize: "0.78rem", letterSpacing: "0.04em" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const st = STATUS_LABELS[r.status] ?? STATUS_LABELS.pending;
                  return (
                    <tr
                      key={r.id}
                      style={{
                        borderBottom: "1px solid #f0e8e0",
                        background: i % 2 === 0 ? "white" : "#fdfaf7",
                      }}
                    >
                      <td style={{ padding: "0.7rem 0.9rem", color: "#aaa", fontSize: "0.75rem" }}>#{r.id}</td>
                      <td style={{ padding: "0.7rem 0.9rem", whiteSpace: "nowrap", color: "#666", fontSize: "0.78rem" }}>
                        {new Date(r.createdAt).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}
                      </td>
                      <td style={{ padding: "0.7rem 0.9rem", fontWeight: 600, color: "#2a1a0a", whiteSpace: "nowrap" }}>{r.name}</td>
                      <td style={{ padding: "0.7rem 0.9rem", color: "#555", whiteSpace: "nowrap" }}>
                        <a href={`tel:${r.phone}`} style={{ color: "#8b5e3c", textDecoration: "none" }}>{r.phone}</a>
                      </td>
                      <td style={{ padding: "0.7rem 0.9rem", color: "#555", fontSize: "0.78rem" }}>
                        {r.email ? (
                          <a href={`mailto:${r.email}`} style={{ color: "#8b5e3c", textDecoration: "none" }}>{r.email}</a>
                        ) : (
                          <span style={{ color: "#ccc" }}>—</span>
                        )}
                      </td>
                      <td style={{ padding: "0.7rem 0.9rem", whiteSpace: "nowrap", color: "#555" }}>
                        {PLAN_LABELS[r.plan] ?? r.plan}
                      </td>
                      <td style={{ padding: "0.7rem 0.9rem", whiteSpace: "nowrap", color: "#555" }}>
                        {r.desiredDate}<br />
                        <span style={{ fontSize: "0.75rem", color: "#888" }}>{r.desiredTime}</span>
                      </td>
                      <td style={{ padding: "0.7rem 0.9rem", color: "#888", fontSize: "0.78rem" }}>
                        {GENDER_LABELS[r.gender] ?? r.gender}
                      </td>
                      <td style={{ padding: "0.7rem 0.9rem" }}>
                        <span style={{
                          display: "inline-block",
                          padding: "0.25rem 0.65rem",
                          borderRadius: "12px",
                          background: st.bg,
                          color: st.color,
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          whiteSpace: "nowrap",
                        }}>
                          {st.label}
                        </span>
                      </td>
                      <td style={{ padding: "0.7rem 0.9rem" }}>
                        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                          {r.status !== "confirmed" && (
                            <button
                              onClick={() => updateStatus.mutate({ id: r.id, status: "confirmed" })}
                              disabled={updateStatus.isPending}
                              style={{
                                padding: "0.3rem 0.7rem",
                                background: "#d1fae5",
                                color: "#065f46",
                                border: "1px solid #a7f3d0",
                                borderRadius: "4px",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                whiteSpace: "nowrap",
                              }}
                            >
                              確定
                            </button>
                          )}
                          {r.status !== "pending" && (
                            <button
                              onClick={() => updateStatus.mutate({ id: r.id, status: "pending" })}
                              disabled={updateStatus.isPending}
                              style={{
                                padding: "0.3rem 0.7rem",
                                background: "#fef3c7",
                                color: "#92400e",
                                border: "1px solid #fde68a",
                                borderRadius: "4px",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                whiteSpace: "nowrap",
                              }}
                            >
                              受付中に戻す
                            </button>
                          )}
                          {r.status !== "cancelled" && (
                            <button
                              onClick={() => {
                                if (window.confirm(`${r.name}様の予約をキャンセルしますか？`)) {
                                  updateStatus.mutate({ id: r.id, status: "cancelled" });
                                }
                              }}
                              disabled={updateStatus.isPending}
                              style={{
                                padding: "0.3rem 0.7rem",
                                background: "#fee2e2",
                                color: "#991b1b",
                                border: "1px solid #fca5a5",
                                borderRadius: "4px",
                                fontSize: "0.75rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                fontFamily: "'Noto Sans JP', sans-serif",
                                whiteSpace: "nowrap",
                              }}
                            >
                              キャンセル
                            </button>
                          )}
                        </div>
                        {r.message && (
                          <details style={{ marginTop: "0.4rem" }}>
                            <summary style={{ fontSize: "0.72rem", color: "#aaa", cursor: "pointer" }}>メモを見る</summary>
                            <p style={{ fontSize: "0.75rem", color: "#666", margin: "0.3rem 0 0", lineHeight: 1.6, maxWidth: "200px" }}>{r.message}</p>
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
          表示件数: {filtered.length} / {reservations?.length ?? 0} 件
        </p>
      </main>
    </div>
  );
}
