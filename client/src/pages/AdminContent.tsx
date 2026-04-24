/**
 * コンテンツ管理ダッシュボード
 * スタッフがビフォーアフター・お客様の声・ブログ・メニュー料金・サロンを管理するハブページ
 */
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Link } from "wouter";

const MENU_ITEMS = [
  {
    href: "/admin/before-after",
    icon: "🔄",
    title: "ビフォーアフター",
    desc: "施術前後の写真を追加・編集・削除",
    color: "#c9a96e",
  },
  {
    href: "/admin/testimonials",
    icon: "💬",
    title: "お客様の声",
    desc: "レビュー・お客様の声を追加・編集・削除",
    color: "#c9a96e",
  },
  {
    href: "/admin/blog",
    icon: "📝",
    title: "ブログ・コラム",
    desc: "記事の作成・編集・公開管理",
    color: "#c9a96e",
  },
  {
    href: "/admin/menus",
    icon: "💰",
    title: "メニュー・料金",
    desc: "サービスメニューと料金の管理",
    color: "#c9a96e",
  },
  {
    href: "/admin/salons",
    icon: "🏪",
    title: "パートナーサロン",
    desc: "認定サロンの追加・更新・削除",
    color: "#c9a96e",
  },
  {
    href: "/admin",
    icon: "📅",
    title: "予約管理",
    desc: "お客様の予約確認・ステータス管理",
    color: "#6b7280",
  },
];

export default function AdminContent() {
  const { isAuthenticated: isManusAuth, loading: manusLoading } = useAuth();
  const { data: staffUser, isLoading: staffLoading } = trpc.staff.me.useQuery(undefined, {
    refetchOnWindowFocus: false,
    retry: false,
  });

  const isAuthenticated = isManusAuth || !!staffUser;
  const loading = manusLoading || staffLoading;

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "#2C1810", fontFamily: "Noto Sans JP, sans-serif" }}>読み込み中...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: "100vh", background: "#F5F0E8", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
        <p style={{ color: "#2C1810", fontFamily: "Noto Sans JP, sans-serif", fontSize: "16px" }}>
          管理画面にアクセスするにはログインが必要です。
        </p>
        <Link href="/staff-login">
          <a style={{ background: "#2C1810", color: "#F5F0E8", padding: "10px 24px", borderRadius: "6px", textDecoration: "none", fontFamily: "Noto Sans JP, sans-serif", fontSize: "14px" }}>
            スタッフログイン
          </a>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F5F0E8", fontFamily: "Noto Sans JP, sans-serif" }}>
      {/* ヘッダー */}
      <div style={{ background: "#2C1810", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link href="/">
            <a style={{ color: "#c9a96e", fontSize: "12px", textDecoration: "none" }}>← サイトへ戻る</a>
          </Link>
          <span style={{ color: "#c9a96e", opacity: 0.4 }}>|</span>
          <h1 style={{ color: "#F5F0E8", fontSize: "16px", fontWeight: "600", margin: 0 }}>
            コンテンツ管理
          </h1>
        </div>
        <span style={{ color: "#c9a96e", fontSize: "12px" }}>
          {staffUser ? `${staffUser.name} さん` : "管理者"}
        </span>
      </div>

      {/* メインコンテンツ */}
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 24px" }}>
        <h2 style={{ color: "#2C1810", fontSize: "22px", fontWeight: "700", marginBottom: "8px" }}>
          管理メニュー
        </h2>
        <p style={{ color: "#6b4c2a", fontSize: "14px", marginBottom: "32px" }}>
          更新したい項目を選択してください
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
          {MENU_ITEMS.map((item) => (
            <Link key={item.href} href={item.href}>
              <a style={{
                display: "block",
                background: "#fff",
                border: "1px solid #e8ddd0",
                borderRadius: "12px",
                padding: "24px",
                textDecoration: "none",
                transition: "box-shadow 0.2s",
                cursor: "pointer",
              }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(44,24,16,0.12)")}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
              >
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>{item.icon}</div>
                <h3 style={{ color: "#2C1810", fontSize: "16px", fontWeight: "700", margin: "0 0 6px" }}>
                  {item.title}
                </h3>
                <p style={{ color: "#6b4c2a", fontSize: "13px", margin: 0, lineHeight: 1.5 }}>
                  {item.desc}
                </p>
              </a>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
