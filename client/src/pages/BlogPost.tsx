/**
 * スカルプラボ ブログ記事詳細ページ
 * /blog/:slug
 */

import { Link, useParams } from "wouter";
import { trpc } from "@/lib/trpc";

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

export default function BlogPost() {
 const { slug } = useParams<{ slug: string }>();
 const { data: post, isLoading, error } = trpc.blog.bySlug.useQuery(
 { slug: slug ?? "" },
 { enabled: !!slug, refetchOnWindowFocus: false }
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

 {/* ローディング */}
 {isLoading && (
 <div className="pt-32 pb-16">
 <div className="max-w-3xl mx-auto px-6">
 <div className="animate-pulse">
 <div className="h-8 bg-[oklch(0.90_0.010_90)] rounded mb-4 w-3/4" />
 <div className="h-4 bg-[oklch(0.90_0.010_90)] rounded mb-8 w-1/3" />
 <div className="h-64 bg-[oklch(0.90_0.010_90)] rounded mb-8" />
 <div className="space-y-3">
 {Array.from({ length: 8 }).map((_, i) => (
 <div key={i} className="h-4 bg-[oklch(0.90_0.010_90)] rounded" />
 ))}
 </div>
 </div>
 </div>
 </div>
 )}

 {/* エラー・記事なし */}
 {!isLoading && (error || !post) && (
 <div className="pt-32 pb-16 text-center">
 <div className="max-w-3xl mx-auto px-6">
 <p className="font-mincho text-[oklch(0.55_0.055_65)] text-xl mb-4">
 記事が見つかりませんでした
 </p>
 <Link href="/blog">
 <button className="font-sans-jp text-sm text-[oklch(0.45_0.055_65)] hover:text-[oklch(0.30_0.055_65)] transition-colors">
 ← ブログ一覧に戻る
 </button>
 </Link>
 </div>
 </div>
 )}

 {/* 記事コンテンツ */}
 {!isLoading && post && (
 <>
 {/* ヒーロー */}
 <section className="pt-24 bg-[oklch(0.22_0.040_65)]">
 {post.thumbnailUrl && (
 <div className="relative h-64 md:h-96 overflow-hidden">
 <img
 src={post.thumbnailUrl}
 alt={post.title}
 className="w-full h-full object-cover opacity-50"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.22_0.040_65)] to-transparent" />
 </div>
 )}
 <div className={`max-w-3xl mx-auto px-6 ${post.thumbnailUrl ? "pb-12 -mt-20 relative z-10" : "pt-12 pb-12"}`}>
 {post.category && (
 <span className="font-sans-jp text-xs bg-[oklch(0.72_0.038_93)] text-[oklch(0.22_0.040_65)] px-3 py-1 rounded-full font-bold inline-block mb-4">
 {post.category}
 </span>
 )}
 <h1 className="font-mincho text-white text-2xl md:text-4xl font-bold leading-snug mb-4">
 {post.title}
 </h1>
 <div className="flex items-center gap-4 text-white/50">
 <span className="font-sans-jp text-xs">{formatDate(post.publishedAt)}</span>
 {post.authorName && (
 <>
 <span>·</span>
 <span className="font-sans-jp text-xs">{post.authorName}</span>
 </>
 )}
 </div>
 </div>
 </section>

 {/* 本文 */}
 <section className="py-12">
 <div className="max-w-3xl mx-auto px-6">
 {/* パンくずリスト */}
 <div className="flex items-center gap-2 mb-8 text-[oklch(0.65_0.030_90)]">
 <Link href="/" className="font-sans-jp text-xs hover:text-[oklch(0.30_0.055_65)] transition-colors">
 ホーム
 </Link>
 <span className="text-xs">›</span>
 <Link href="/blog" className="font-sans-jp text-xs hover:text-[oklch(0.30_0.055_65)] transition-colors">
 ブログ
 </Link>
 <span className="text-xs">›</span>
 <span className="font-sans-jp text-xs text-[oklch(0.45_0.055_65)] line-clamp-1">
 {post.title}
 </span>
 </div>

 {/* 本文コンテンツ */}
 <div
 className="prose prose-lg max-w-none font-sans-jp text-[oklch(0.35_0.040_65)] leading-relaxed"
 style={{
 lineHeight: "2",
 }}
 >
 {post.content.split("\n").map((paragraph: string, i: number) =>
 paragraph.trim() ? (
 <p key={i} className="mb-6 font-sans-jp text-[oklch(0.35_0.040_65)] text-base leading-loose">
 {paragraph}
 </p>
 ) : (
 <br key={i} />
 )
 )}
 </div>

 {/* 区切り線 */}
 <div className="border-t border-[oklch(0.85_0.015_90)] mt-12 pt-8">
 <Link href="/blog">
 <button className="font-sans-jp text-sm text-[oklch(0.45_0.055_65)] hover:text-[oklch(0.30_0.055_65)] transition-colors flex items-center gap-2">
 <span>←</span>
 <span>ブログ一覧に戻る</span>
 </button>
 </Link>
 </div>
 </div>
 </section>
 </>
 )}

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
