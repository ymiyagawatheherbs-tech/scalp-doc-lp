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
    { label: "ビフォーアフター管理", href: "/admin/before-after", icon: "🖼" },
    { label: "お客様の声管理", href: "/admin/testimonials", icon: "💬" },
    { label: "ブログ管理", href: "/admin/blog", icon: "📝" },
    { label: "メニュー・料金管理", href: "/admin/menus", icon: "📋" },
    { label: "パートナーサロン管理", href: "/admin/salons", icon: "🏪" },
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
        <a href="/" style={{ fontSize: "0.75rem", color: "#c9a96e", textDecoration: "none", opacity: 0.8 }}>← サイトに戻る</a>
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
