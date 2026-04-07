/**
 * スタッフログインページ
 * メール + パスワードでログイン → /admin にリダイレクト
 */
import { trpc } from "@/lib/trpc";
import { useState } from "react";

export default function StaffLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = trpc.staff.login.useMutation({
    onSuccess: () => {
      window.location.href = "/admin";
    },
    onError: (err) => {
      setError(err.message || "ログインに失敗しました");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    login.mutate({ email, password });
  };

  return (
    <div
      style={{
        minHeight: "100dvh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#faf8f5",
        fontFamily: "'Noto Sans JP', sans-serif",
        padding: "1.5rem",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap"
        rel="stylesheet"
      />

      {/* ロゴ */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/logo-mark-transparent_70663ccb.png"
          alt="SCALP LABO"
          style={{ height: "3rem", width: "auto", objectFit: "contain", marginBottom: "0.75rem" }}
        />
        <p style={{ fontSize: "0.8rem", color: "#888", letterSpacing: "0.1em" }}>STAFF LOGIN</p>
      </div>

      {/* フォーム */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: "white",
          border: "1px solid #e8ddd0",
          borderRadius: "8px",
          padding: "2rem",
          width: "100%",
          maxWidth: "380px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        }}
      >
        <h1
          style={{
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "#2a1a0a",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          スタッフ管理画面
        </h1>

        <div style={{ marginBottom: "1rem" }}>
          <label
            style={{ display: "block", fontSize: "0.8rem", color: "#666", marginBottom: "0.4rem", fontWeight: 500 }}
          >
            メールアドレス
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            style={{
              width: "100%",
              padding: "0.65rem 0.9rem",
              border: "1.5px solid #e0d8d0",
              borderRadius: "4px",
              fontSize: "0.9rem",
              color: "#333",
              outline: "none",
              boxSizing: "border-box",
              fontFamily: "'Noto Sans JP', sans-serif",
            }}
            placeholder="staff@example.com"
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{ display: "block", fontSize: "0.8rem", color: "#666", marginBottom: "0.4rem", fontWeight: 500 }}
          >
            パスワード
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            style={{
              width: "100%",
              padding: "0.65rem 0.9rem",
              border: "1.5px solid #e0d8d0",
              borderRadius: "4px",
              fontSize: "0.9rem",
              color: "#333",
              outline: "none",
              boxSizing: "border-box",
              fontFamily: "'Noto Sans JP', sans-serif",
            }}
            placeholder="••••••••"
          />
        </div>

        {error && (
          <p
            style={{
              fontSize: "0.82rem",
              color: "#dc2626",
              background: "#fee2e2",
              padding: "0.6rem 0.9rem",
              borderRadius: "4px",
              marginBottom: "1rem",
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={login.isPending}
          style={{
            width: "100%",
            padding: "0.75rem",
            background: login.isPending ? "#c9a96e99" : "#2a1a0a",
            color: "#c9a96e",
            border: "none",
            borderRadius: "4px",
            fontSize: "0.9rem",
            fontWeight: 700,
            cursor: login.isPending ? "not-allowed" : "pointer",
            letterSpacing: "0.05em",
            fontFamily: "'Noto Sans JP', sans-serif",
          }}
        >
          {login.isPending ? "ログイン中..." : "ログイン"}
        </button>
      </form>

      <p style={{ fontSize: "0.75rem", color: "#bbb", marginTop: "1.5rem" }}>
        アカウントをお持ちでない方は管理者にお問い合わせください
      </p>
    </div>
  );
}
