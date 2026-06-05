/**
 * 管理者向け予約一覧管理画面
 * スタッフ認証（Cookie JWT）またはManus OAuthでアクセス可能
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";
import { Link } from "wouter";

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  pending:   { label: "受付中",     color: "#92400e", bg: "#fef3c7" },
  confirmed: { label: "確定",       color: "#065f46", bg: "#d1fae5" },
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
  // Manus OAuth認証
  const { isAuthenticated: isManusAuth, loading: manusLoading } = useAuth();
  // スタッフ認証（Cookie JWT）
  const { data: staffUser, isLoading: staffLoading } = trpc.staff.me.useQuery(undefined, {
    refetchOnWindowFocus: false,
    retry: false,
  });

  const isAuthenticated = isManusAuth || !!staffUser;
  const loading = manusLoading || staffLoading;

  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");
  const [search, setSearch] = useState("");

  const { data: reservations, isLoading: listLoading, refetch } = trpc.reservation.adminList.useQuery(undefined, {
    enabled: isAuthenticated, // Manus認証またはスタッフ認証済みの場合に取得
    refetchOnWindowFocus: false,
  });

  const allReservations = reservations ?? [];
  const isLoading = listLoading;

  const utils = trpc.useUtils();
  const updateStatus = trpc.reservation.updateStatus.useMutation({
    onSuccess: () => {
      refetch();
      utils.reservation.list.invalidate();
    },
    onError: (err) => {
      toast.error(err.message || "ステータス更新に失敗しました");
    },
  });

  // パスワード変更フォームの状態
  const [showPwChange, setShowPwChange] = useState(false);
  const [pwEmail, setPwEmail] = useState("");
  const [pwNew, setPwNew] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");

  const changePassword = trpc.staff.changePassword.useMutation({
    onSuccess: () => {
      toast.success("パスワードを変更しました");
      setShowPwChange(false);
      setPwEmail("");
      setPwNew("");
      setPwConfirm("");
    },
    onError: (err) => {
      toast.error(err.message || "パスワード変更に失敗しました");
    },
  });

  const handlePwChange = () => {
    if (!pwEmail || !pwNew || !pwConfirm) { toast.error("すべての項目を入力してください"); return; }
    if (pwNew !== pwConfirm) { toast.error("新しいパスワードが一致しません"); return; }
    if (pwNew.length < 8) { toast.error("パスワードは8文字以上で設定してください"); return; }
    changePassword.mutate({ email: pwEmail, newPassword: pwNew });
  };

  const staffLogout = trpc.staff.logout.useMutation({
    onSuccess: () => {
      window.location.href = "/staff-login";
    },
  });

  // ローディング中
  if (loading) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: "#faf8f5" }}>
        <p style={{ color: "#888", fontFamily: "'Noto Sans JP', sans-serif" }}>読み込み中...</p>
      </div>
    );
  }

  // 未認証
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100dvh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#faf8f5", fontFamily: "'Noto Sans JP', sans-serif", gap: "1rem", padding: "1.5rem" }}>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet" />
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/logo-mark-transparent_70663ccb.png"
          alt="SCALP LABO"
          style={{ height: "2.5rem", width: "auto", objectFit: "contain", marginBottom: "0.5rem" }}
        />
        <p style={{ fontSize: "1rem", fontWeight: 700, color: "#2a1a0a" }}>ログインが必要です</p>
        <p style={{ fontSize: "0.82rem", color: "#888", textAlign: "center" }}>スタッフアカウントでログインしてください。</p>
        <a
          href="/staff-login"
          style={{
            padding: "0.75rem 2.5rem",
            background: "#2a1a0a",
            color: "#c9a96e",
            borderRadius: "4px",
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: 700,
            letterSpacing: "0.05em",
          }}
        >
          スタッフログイン
        </a>
        <p style={{ fontSize: "0.75rem", color: "#bbb", marginTop: "0.5rem" }}>または</p>
        <a
          href={getLoginUrl()}
          style={{
            padding: "0.65rem 2rem",
            background: "transparent",
            color: "#6b4c2a",
            border: "1px solid #d4c5b0",
            borderRadius: "4px",
            textDecoration: "none",
            fontSize: "0.82rem",
            fontWeight: 500,
            letterSpacing: "0.03em",
          }}
        >
          Manusアカウントでログイン（管理者用）
        </a>
      </div>
    );
  }

  const filtered = allReservations.filter((r) => {
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
    all: allReservations.length,
    pending: allReservations.filter((r) => r.status === "pending").length,
    confirmed: allReservations.filter((r) => r.status === "confirmed").length,
    cancelled: allReservations.filter((r) => r.status === "cancelled").length,
  };

  const currentUser = staffUser ? staffUser.name : "管理者";

  return (
    <div style={{ minHeight: "100dvh", background: "#faf8f5", fontFamily: "'Noto Sans JP', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet" />

      {/* ヘッダー */}
      <header style={{ background: "#2a1a0a", padding: "0.9rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/logo-mark-transparent_70663ccb.png"
            alt="SCALP LABO"
            style={{ height: "1.75rem", width: "auto", objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.85 }}
          />
          <span style={{ color: "#c9a96e", fontWeight: 700, fontSize: "0.95rem", letterSpacing: "0.08em" }}>予約管理</span>
          <Link href="/admin/calendar" style={{ color: "#c9a96e", fontSize: "0.78rem", background: "rgba(201,169,110,0.15)", border: "1px solid rgba(201,169,110,0.4)", borderRadius: "6px", padding: "0.25rem 0.75rem", textDecoration: "none", marginLeft: "0.5rem" }}>📅 カレンダー</Link>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span style={{ color: "#c9a96e", fontSize: "0.8rem" }}>{currentUser}</span>
          {staffUser ? (
            <button
              onClick={() => staffLogout.mutate()}
              style={{ color: "#888", fontSize: "0.78rem", background: "none", border: "none", cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              ログアウト
            </button>
          ) : (
            <a href="https://scalp-labo-5tzs3tko.manus.space/reservations" style={{ color: "#888", fontSize: "0.78rem", textDecoration: "none" }}>← サイトへ戻る</a>
          )}
        </div>
      </header>

      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem 1.5rem" }}>
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
              minWidth: "200px",
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
          表示件数: {filtered.length} / {allReservations.length} 件
        </p>

        {/* パスワード変更セクション */}
        <div style={{ marginTop: "3rem", borderTop: "1px solid #e8ddd0", paddingTop: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#2a1a0a", margin: 0 }}>スタッフパスワード変更</h2>
            <button
              onClick={() => setShowPwChange(!showPwChange)}
              style={{ padding: "0.4rem 1rem", background: showPwChange ? "#f5f0ea" : "#2a1a0a", color: showPwChange ? "#555" : "#c9a96e", border: "none", borderRadius: "4px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              {showPwChange ? "閉じる" : "パスワードを変更する"}
            </button>
          </div>
          {showPwChange && (
            <div style={{ background: "white", border: "1px solid #e8ddd0", borderRadius: "6px", padding: "1.5rem", maxWidth: "480px" }}>
              <p style={{ fontSize: "0.8rem", color: "#888", marginBottom: "1.25rem", lineHeight: 1.7 }}>
                変更したいスタッフのメールアドレスと新しいパスワードを入力してください。
              </p>
              {[{ label: "スタッフのメールアドレス", type: "email", value: pwEmail, setter: setPwEmail, placeholder: "cx1@the-herbs.co.jp" }, { label: "新しいパスワード", type: "password", value: pwNew, setter: setPwNew, placeholder: "8文字以上" }, { label: "新しいパスワード（確認）", type: "password", value: pwConfirm, setter: setPwConfirm, placeholder: "再入力" }].map(({ label, type, value, setter, placeholder }) => (
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
                onClick={handlePwChange}
                disabled={changePassword.isPending}
                style={{ width: "100%", padding: "0.65rem", background: "#2a1a0a", color: "#c9a96e", border: "none", borderRadius: "4px", fontSize: "0.88rem", fontWeight: 700, cursor: changePassword.isPending ? "not-allowed" : "pointer", fontFamily: "'Noto Sans JP', sans-serif", letterSpacing: "0.05em", opacity: changePassword.isPending ? 0.7 : 1 }}
              >
                {changePassword.isPending ? "変更中..." : "パスワードを変更する"}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
