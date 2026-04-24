/**
 * スカルプラボ ブログ一覧ページ
 * /blog
 */

import { useState } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";

const CATEGORIES = [
  { value: "", label: "すべて" },
  { value: "頭皮ケア", label: "頭皮ケア" },
  { value: "スキンケア", label: "スキンケア" },
  { value: "製品紹介", label: "製品紹介" },
  { value: "ライフスタイル", label: "ライフスタイル" },
];

const IMAGES = {
  logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/the-herbs-logo-white-Wr7fBiDFTzXSr6p7yCsGnE.webp",
};

function formatDate(date: Date | null | undefined): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const { data: posts = [], isLoading } = trpc.blog.list.useQuery(
    { category: selectedCategory || undefined },
    { refetchOnWindowFocus: false }
  );

  return (
    <div className="min-h-screen bg-[oklch(0.978_0.008_90)]">
      {/* ナビゲーション */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[oklch(0.22_0.040_65/95)] backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src={IMAGES.logo} alt="THE HERBS SCALP LABO" className="h-8 object-contain" />
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="font-sans-jp text-white/70 hover:text-white text-sm transition-colors">
              ホーム
            </Link>
            <Link href="/salons" className="font-sans-jp text-white/70 hover:text-white text-sm transition-colors">
              認定サロン
            </Link>
            <Link href="/blog" className="font-sans-jp text-[oklch(0.72_0.038_93)] text-sm font-bold">
              ブログ
            </Link>
          </div>
        </div>
      </nav>

      {/* ヒーロー */}
      <section className="pt-32 pb-16 bg-[oklch(0.22_0.040_65)]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="font-cormorant text-[oklch(0.72_0.038_93)] text-sm tracking-[0.3em] uppercase block mb-4">
            Blog & Column
          </span>
          <h1 className="font-mincho text-white text-4xl md:text-5xl font-bold mb-4">
            頭皮ケアコラム
          </h1>
          <p className="font-sans-jp text-white/60 text-sm max-w-xl mx-auto">
            植物の力と頭皮科学の知見から、あなたの髪と頭皮を守るための情報をお届けします。
          </p>
        </div>
      </section>

      {/* カテゴリフィルター */}
      <section className="py-8 bg-white border-b border-[oklch(0.90_0.010_90)]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`font-sans-jp text-sm px-5 py-2 rounded-full border transition-all duration-200 ${
                  selectedCategory === cat.value
                    ? "bg-[oklch(0.30_0.055_65)] text-white border-[oklch(0.30_0.055_65)]"
                    : "bg-white text-[oklch(0.45_0.055_65)] border-[oklch(0.80_0.020_90)] hover:border-[oklch(0.30_0.055_65)]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 記事一覧 */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-sm overflow-hidden animate-pulse">
                  <div className="h-48 bg-[oklch(0.90_0.010_90)]" />
                  <div className="p-6">
                    <div className="h-3 bg-[oklch(0.90_0.010_90)] rounded mb-3 w-1/3" />
                    <div className="h-5 bg-[oklch(0.90_0.010_90)] rounded mb-2" />
                    <div className="h-4 bg-[oklch(0.90_0.010_90)] rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-mincho text-[oklch(0.55_0.055_65)] text-lg mb-2">
                {selectedCategory ? `「${selectedCategory}」の記事はまだありません` : "記事はまだありません"}
              </p>
              <p className="font-sans-jp text-[oklch(0.70_0.030_90)] text-sm">
                近日公開予定です。しばらくお待ちください。
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <article className="bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group">
                    {/* サムネイル */}
                    <div className="relative overflow-hidden h-48 bg-[oklch(0.90_0.010_90)]">
                      {post.thumbnailUrl ? (
                        <img
                          src={post.thumbnailUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[oklch(0.22_0.040_65)]">
                          <span className="font-cormorant text-[oklch(0.72_0.038_93)] text-2xl tracking-widest">
                            SCALP LABO
                          </span>
                        </div>
                      )}
                      {post.category && (
                        <span className="absolute top-3 left-3 font-sans-jp text-xs bg-[oklch(0.72_0.038_93)] text-[oklch(0.22_0.040_65)] px-3 py-1 rounded-full font-bold">
                          {post.category}
                        </span>
                      )}
                    </div>

                    {/* コンテンツ */}
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-sans-jp text-[oklch(0.65_0.030_90)] text-xs">
                          {formatDate(post.publishedAt)}
                        </span>
                        {post.authorName && (
                          <>
                            <span className="text-[oklch(0.80_0.010_90)]">·</span>
                            <span className="font-sans-jp text-[oklch(0.65_0.030_90)] text-xs">
                              {post.authorName}
                            </span>
                          </>
                        )}
                      </div>
                      <h2 className="font-mincho text-[oklch(0.25_0.055_65)] text-lg font-bold mb-2 leading-snug group-hover:text-[oklch(0.45_0.055_65)] transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="font-sans-jp text-[oklch(0.55_0.030_90)] text-sm leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="mt-4 flex items-center gap-1 text-[oklch(0.45_0.055_65)]">
                        <span className="font-sans-jp text-xs font-bold">続きを読む</span>
                        <span className="text-sm">→</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* フッター */}
      <footer className="bg-[oklch(0.22_0.040_65)] py-12 mt-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <img src={IMAGES.logo} alt="THE HERBS SCALP LABO" className="h-8 object-contain mx-auto mb-4" />
          <p className="font-sans-jp text-white/40 text-xs">
            © 2024 THE HERBS SCALP LABO. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
