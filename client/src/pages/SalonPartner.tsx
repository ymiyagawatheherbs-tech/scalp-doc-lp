/**
 * SalonPartner.tsx — /salon
 * Design: Clean Professional — ホワイト x ディープグリーン x ゴールド
 * Philosophy: 「必要性を訴える」シンプル7セクション構成
 * 収益の詳細はフォーム送信後に配布する資料に掲載
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Menu, X, MapPin, Phone, Globe, Instagram } from "lucide-react";
import { trpc } from "@/lib/trpc";

// ── 定数 ──────────────────────────────────────────────
const IMAGES = {
  interior: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/salon_interior_c8f3f7a4.jpg",
  scalpCheck: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/salon_scalp_check_ae329437.jpg",
  workshop01: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/workshop_01_681429e8.png",
  workshop02: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/workshop_02_2687668f.webp",
  workshop04: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/workshop_04_1185c7ae.png",
  scalpCheckTablet: "/manus-storage/scalp_check_tablet_b9a101f1.jpeg",
};

const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdti0E_BtIzLULMfeU-e0z6p9SvOEWGdBBpD8ZfuMTeIINqIw/viewform";
const HERBS_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/theherbs_logo_395db853.webp";

// カラーパレット
const C = {
  green: "#5a7a52",
  greenDark: "#2a3e2a",
  greenLight: "#eef5ea",
  cream: "#f8f6f2",
  gold: "#c9a84c",
  text: "#1a1a1a",
  muted: "#666",
  border: "#e0e0e0",
};

// ── useInView ──────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ── NAV ───────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const navLinks = [
    { label: "なぜ今か", href: "#why" },
    { label: "事業の仕組み", href: "#model" },
    { label: "対象者", href: "#who" },
    { label: "認定の流れ", href: "#steps" },
    { label: "FAQ", href: "#faq" },
  ];

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: scrolled ? "rgba(248,246,242,0.97)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? `1px solid ${C.border}` : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex flex-col items-start leading-none gap-[3px] flex-shrink-0">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/theherbs-logo-white_7a2a3209.webp"
              alt="THE HERBS"
              className="object-contain transition-all cursor-pointer block"
              style={{ height: "28px", width: "auto", marginLeft: "-17px", filter: scrolled ? "brightness(0)" : "none" }}
            />
            <span
              className="font-sans-jp tracking-widest transition-colors block"
              style={{ fontSize: "0.5rem", letterSpacing: "0.22em", color: scrolled ? C.green : "rgba(255,255,255,0.6)" }}
            >
              SCALP LABO
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-sm tracking-wider transition-colors duration-200 whitespace-nowrap"
                style={{
                  fontFamily: "'Noto Sans JP', sans-serif",
                  color: scrolled ? C.muted : "rgba(255,255,255,0.75)",
                }}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/">
              <span
                className="hidden md:inline text-xs cursor-pointer whitespace-nowrap"
                style={{ color: scrolled ? "#555" : "rgba(255,255,255,0.7)", fontFamily: "'Noto Sans JP', sans-serif" }}
              >
                ← 一般向けページへ
              </span>
            </Link>
            <a
              href="#contact"
              className="hidden sm:block text-xs font-bold px-4 py-2 transition-all whitespace-nowrap"
              style={{ backgroundColor: C.gold, color: "#1a1a1a", fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              資料を受け取る（無料）
            </a>
            <button
              className="sm:hidden p-1.5"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="メニュー"
              style={{ color: scrolled ? C.greenDark : "white" }}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col pt-20 px-8" style={{ backgroundColor: C.cream }}>
          <div className="flex flex-col gap-1 mb-8">
            <p className="text-xs tracking-[0.3em] mb-4" style={{ color: C.green, fontFamily: "'Noto Sans JP', sans-serif" }}>MENU</p>
            {navLinks.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className="py-4 border-b text-left text-lg font-bold"
                style={{ fontFamily: "'Shippori Mincho', serif", color: C.text, borderColor: "#e8e4dc" }}
              >
                {item.label}
              </button>
            ))}
          </div>
          <a
            href="#contact"
            className="flex items-center justify-center gap-2 py-4 font-bold text-base"
            style={{ backgroundColor: C.gold, color: "#1a1a1a", fontFamily: "'Noto Sans JP', sans-serif", textDecoration: "none" }}
            onClick={() => setMenuOpen(false)}
          >
            資料を受け取る（無料）
          </a>
          <Link
            href="/"
            className="mt-3 flex items-center justify-center py-3 text-sm border"
            style={{ color: "#555", borderColor: "#ccc", fontFamily: "'Noto Sans JP', sans-serif" }}
            onClick={() => setMenuOpen(false)}
          >
            ← 一般向けページへ
          </Link>
        </div>
      )}
    </>
  );
}

// ── HERO ──────────────────────────────────────────────
function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ backgroundColor: C.cream }}>
      {/* 背景画像 */}
      <div className="absolute right-0 top-0 w-full lg:w-[55%] h-full">
        <img
          src={IMAGES.interior}
          alt="THE HERBS SCALP LABO"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to right, ${C.cream} 0%, ${C.cream} 5%, rgba(248,246,242,0.7) 35%, transparent 65%)` }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-32 w-full">
        <div
          className="max-w-xl transition-all duration-1000"
          style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)" }}
        >
          {/* タグライン */}
          <span className="text-xs tracking-[0.4em] uppercase block mb-6 font-medium" style={{ color: C.green }}>
            THE HERBS SCALP LABO パートナープログラム
          </span>

          {/* メインキャッチ */}
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
            style={{ fontFamily: "'Shippori Mincho', serif", color: C.text }}
          >
            髪の土台をつくる、<br />
            <span style={{ color: C.green }}>不安を安心に変える。</span>
          </h1>

          {/* サブキャッチ */}
          <p className="text-xl md:text-2xl font-bold mb-6 leading-snug" style={{ fontFamily: "'Shippori Mincho', serif", color: C.greenDark }}>
            誰よりも先に始める、第三の美容。
          </p>
          <p className="text-base leading-relaxed mb-8" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#444", lineHeight: "1.9" }}>
            スキンケアが当たり前になったように、頭皮ケアも日常になる時代が来ています。<br />
            THE HERBS SCALP LABOは、エステ・美容室・起業希望者とともに
            「頭皮の定期チェック」という新しい事業領域を切り開いています。
          </p>

          {/* 権威性 */}
          <div className="mb-8 p-4 border-l-4" style={{ borderColor: C.green, backgroundColor: "rgba(90,122,82,0.06)" }}>
            <p className="text-xs leading-relaxed" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: C.greenDark }}>
              <span className="font-bold">化粧品製造会社 THE HERBS（創業1986年）</span>が開発した独自の植物美容メソッド。
              メーカー直営の技術・データ・製品をそのまま提供します。
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-sm tracking-wider transition-all duration-300"
              style={{ backgroundColor: C.gold, color: "#1a1a1a", fontFamily: "'Noto Sans JP', sans-serif", textDecoration: "none" }}
            >
              無料で資料を受け取る
            </a>
            <button
              onClick={() => document.querySelector("#why")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-flex items-center justify-center px-8 py-4 font-bold text-sm tracking-wider transition-all duration-300 border-2"
              style={{ borderColor: C.green, color: C.green, fontFamily: "'Noto Sans JP', sans-serif", backgroundColor: "transparent" }}
            >
              なぜ今なのかを見る
            </button>
          </div>
          <p className="mt-4 text-xs" style={{ color: "#aaa", fontFamily: "'Noto Sans JP', sans-serif" }}>
            フォーム送信後すぐに資料ページへご案内します
          </p>
        </div>
      </div>
    </section>
  );
}

// ── なぜ今か（市場背景）──────────────────────────────
function WhyNow() {
  const { ref, inView } = useInView();

  const stats = [
    {
      value: "年率15.5%",
      label: "予防型ヘルスケア市場の成長率",
      body: "「病気になってから治す」から「なる前に防ぐ」へ。世界市場は2029年に約90兆円規模へ拡大が続いています。",
      src: "GII市場調査レポート2025",
    },
    {
      value: "前年比+9.6%",
      label: "ヘッドスパ・頭皮ケア需要",
      body: "リラクゼーション市場全体が拡大する中、頭皮ケアへの需要が特に伸びています。",
      src: "リクルート美容センサス2024",
    },
    {
      value: "ほぼゼロ",
      label: "頭皮の定期チェックを提供するサロン",
      body: "歯科の定期検診は当たり前になりましたが、頭皮の定期チェックを習慣として提供するサロンは国内にほとんど存在しません。",
      src: "THE HERBS調べ",
    },
  ];

  return (
    <section className="py-24" style={{ backgroundColor: C.greenDark }} id="why">
      <div ref={ref} className="max-w-6xl mx-auto px-6">
        {/* ヘッダー */}
        <div
          className="text-center mb-16 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)" }}
        >
          <span className="text-xs tracking-[0.4em] uppercase block mb-4 font-medium" style={{ color: "#a8d5a2" }}>
            Why Now
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "'Shippori Mincho', serif", color: "#ffffff" }}>
            なぜ今、頭皮ケアなのか
          </h2>
          <p className="text-base max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "rgba(255,255,255,0.75)", lineHeight: "1.9" }}>
            美容室は飽和状態。エステも競争が激化しています。<br />
            しかし「頭皮の定期チェック」を専門に提供するサロンは、これからの分野です。
          </p>
        </div>

        {/* 3つの数字 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px mb-16" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
          {stats.map((item, i) => (
            <div
              key={i}
              className="p-8 transition-all duration-700"
              style={{
                backgroundColor: C.greenDark,
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(30px)",
                transitionDelay: `${i * 150}ms`,
              }}
            >
              <p className="text-3xl font-bold mb-2" style={{ fontFamily: "'Shippori Mincho', serif", color: "#ffffff" }}>
                {item.value}
              </p>
              <span className="text-xs tracking-widest block mb-4" style={{ color: "#a8d5a2", fontFamily: "'Noto Sans JP', sans-serif" }}>
                {item.label}
              </span>
              <p className="text-sm leading-relaxed mb-4" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "rgba(255,255,255,0.7)", lineHeight: "1.8" }}>
                {item.body}
              </p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Noto Sans JP', sans-serif" }}>
                ※{item.src}
              </p>
            </div>
          ))}
        </div>

        {/* ポジショニング */}
        <div
          className="p-8 md:p-12 transition-all duration-700"
          style={{
            backgroundColor: C.green,
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(30px)",
            transitionDelay: "500ms",
          }}
        >
          <h3 className="text-xl font-bold mb-2 text-center" style={{ fontFamily: "'Shippori Mincho', serif", color: "#ffffff" }}>
            「美容」でも「医療」でもない、第三の領域
          </h3>
          <p className="text-sm text-center mb-10" style={{ color: "rgba(255,255,255,0.65)", fontFamily: "'Noto Sans JP', sans-serif" }}>
            THE HERBS SCALP LABOが目指すポジション
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            {[
              { area: "美容サービス", desc: "スタイリング・施術の提供", note: "商品・施術が主役", highlight: false },
              { area: "SCALP LABO", desc: "頭皮の定期チェック＋ケアの習慣化", note: "習慣化が主役（ブルーオーシャン）", highlight: true },
              { area: "医療機関", desc: "診断・治療・処方", note: "疾患対応が主役", highlight: false },
            ].map((pos, i) => (
              <div
                key={i}
                className="p-6"
                style={{ backgroundColor: pos.highlight ? "#c2432e" : "rgba(255,255,255,0.15)" }}
              >
                {pos.highlight && (
                  <p className="text-xs tracking-widest mb-2" style={{ color: "#ffffff", fontFamily: "'Noto Sans JP', sans-serif" }}>
                    ここに参入
                  </p>
                )}
                <h4 className="text-lg font-bold mb-2" style={{ fontFamily: "'Shippori Mincho', serif", color: "#ffffff" }}>
                  {pos.area}
                </h4>
                <p className="text-sm mb-3" style={{ color: "rgba(255,255,255,0.85)", fontFamily: "'Noto Sans JP', sans-serif" }}>
                  {pos.desc}
                </p>
                <p className="text-xs" style={{ color: pos.highlight ? "#ffffff" : "rgba(255,255,255,0.5)", fontFamily: "'Noto Sans JP', sans-serif", fontWeight: pos.highlight ? "bold" : "normal" }}>
                  {pos.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 事業の仕組み ──────────────────────────────────────
function BusinessModel() {
  const { ref, inView } = useInView();

  return (
    <section className="py-24" style={{ backgroundColor: "#ffffff" }} id="model">
      <div ref={ref} className="max-w-6xl mx-auto px-6">
        {/* ヘッダー */}
        <div
          className="text-center mb-16 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)" }}
        >
          <span className="text-xs tracking-[0.4em] uppercase block mb-4 font-medium" style={{ color: C.green }}>
            Business Model
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "'Shippori Mincho', serif", color: C.text }}>
            「売る事業」ではなく、<br />「習慣をつくる事業」
          </h2>
          <p className="text-base max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#555", lineHeight: "1.9" }}>
            歯科の定期検診が当たり前になったように、<br />
            頭皮の定期チェックを「当たり前の習慣」にすることがTHE HERBS SCALP LABOのミッションです。
          </p>
        </div>

        {/* 歯科との対比 */}
        <div
          className="mb-16 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)", transitionDelay: "150ms" }}
        >
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "歯科の定期検診モデル",
                items: ["虫歯になる前に定期的に通う", "問題が見つかれば治療へ", "データを蓄積して経年変化を追う", "習慣化で患者との長期関係"],
                color: C.cream,
                label: "確立されたモデル",
              },
              {
                title: "THE HERBS SCALP LABOの定期チェックモデル",
                items: ["薄毛になる前に定期的にチェック", "問題が見つかれば施術・ケアへ", "マイクロスコープで経年変化を記録", "習慣化でお客様との長期関係"],
                color: C.greenLight,
                label: "これから創るモデル",
              },
            ].map((col, i) => (
              <div key={i} className="p-8" style={{ backgroundColor: col.color }}>
                <span className="text-xs tracking-widest block mb-3" style={{ color: C.green, fontFamily: "'Noto Sans JP', sans-serif" }}>
                  {col.label}
                </span>
                <h4 className="font-bold mb-5" style={{ fontFamily: "'Shippori Mincho', serif", color: C.text }}>
                  {col.title}
                </h4>
                <ul className="space-y-3">
                  {col.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#444" }}>
                      <span style={{ color: C.green, flexShrink: 0, fontWeight: 700 }}>+</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* 3つの柱 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              num: "01",
              title: "予防型ヘルスケアとして",
              body: "薄毛・抜け毛・頭皮トラブルは、気になり始めたときにはすでに進行していることがほとんど。定期的なチェックで「早期発見・早期対応」の習慣を創ります。",
              accent: "「気づいてから対策」から「予防的に守る」へ",
            },
            {
              num: "02",
              title: "美容サービスとして",
              body: "頭皮は顔や体と同じ「皮膚」。スキンケアの延長として頭皮ケアを日常に取り入れる文化を育てます。既存の美容メニューとの相乗効果も高い。",
              accent: "スキンケアの延長線上にある頭皮ケア",
            },
            {
              num: "03",
              title: "習慣化ビジネスとして",
              body: "施術や商品を「一度売る」のではなく、定期来店・定期チェックの仕組みを設計します。お客様との長期的な関係が、安定した収益基盤になります。",
              accent: "リピートではなく「習慣」が収益を生む",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-8 transition-all duration-700"
              style={{
                backgroundColor: C.cream,
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(30px)",
                transitionDelay: `${200 + i * 150}ms`,
              }}
            >
              <span className="text-4xl font-bold block mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: C.green }}>
                {item.num}
              </span>
              <h3 className="text-lg font-bold mb-3" style={{ fontFamily: "'Shippori Mincho', serif", color: C.text }}>
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed mb-4" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#666", lineHeight: "1.8" }}>
                {item.body}
              </p>
              <p className="text-xs font-bold px-3 py-2 inline-block" style={{ backgroundColor: C.greenLight, color: C.green, fontFamily: "'Noto Sans JP', sans-serif" }}>
                {item.accent}
              </p>
            </div>
          ))}
        </div>

        {/* 美容師向け補足 */}
        <div
          className="mt-12 p-8 md:p-10 transition-all duration-700"
          style={{
            backgroundColor: C.greenDark,
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(30px)",
            transitionDelay: "650ms",
          }}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs tracking-widest block mb-3" style={{ color: "#a8d5a2", fontFamily: "'Noto Sans JP', sans-serif" }}>
                美容師の方へ
              </span>
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Shippori Mincho', serif", color: "#ffffff" }}>
                スタイリングに集中しながら、<br />頭皮ケアも提供できる
              </h3>
              <p className="text-sm leading-relaxed" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "rgba(255,255,255,0.75)", lineHeight: "1.9" }}>
                美容師の本業はスタイリング。頭皮チェックは施術の合間に5〜10分で完了します。
                問題が見つかった場合の施術（歯医者でいう虫歯治療に相当）も、認定を受けた美容師がそのまま担当できます。
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { role: "歯科衛生士", task: "定期検診・クリーニング", equiv: "頭皮チェック担当" },
                { role: "歯科医師", task: "虫歯治療・処置", equiv: "頭皮ケア施術担当" },
              ].map((item, i) => (
                <div key={i} className="p-4" style={{ backgroundColor: "rgba(255,255,255,0.06)" }}>
                  <p className="text-xs mb-1" style={{ color: "#a8d5a2", fontFamily: "'Noto Sans JP', sans-serif" }}>{item.role}</p>
                  <p className="text-sm font-bold mb-2" style={{ color: "#ffffff", fontFamily: "'Noto Sans JP', sans-serif" }}>{item.task}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Noto Sans JP', sans-serif" }}>→ {item.equiv}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── 対象者 ────────────────────────────────────────────
function WhoCanJoin() {
  const { ref, inView } = useInView();

  return (
    <section className="py-24" style={{ backgroundColor: C.cream }} id="who">
      <div ref={ref} className="max-w-6xl mx-auto px-6">
        <div
          className="text-center mb-16 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)" }}
        >
          <span className="text-xs tracking-[0.4em] uppercase block mb-4 font-medium" style={{ color: C.green }}>
            Who Can Join
          </span>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Shippori Mincho', serif", color: C.text }}>
            こんな方と一緒に取り組みたい
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              num: "A",
              title: "エステサロン・ヘッドスパ店",
              fit: "特に相性が良い",
              body: "お客様の「全身美容」をサポートしているサロンに。頭皮ケアは顔・体と同じ「皮膚ケア」です。既存のお客様に新しい価値を提供できます。",
              tags: ["フェイシャル", "ボディケア", "リラクゼーション"],
            },
            {
              num: "B",
              title: "美容師・ヘアサロン",
              fit: "既存メニューと相性抜群",
              body: "スタイリングの合間に頭皮チェックを追加するだけ。カラー・パーマ後の頭皮ケアは既存メニューとの親和性が高く、お客様の満足度向上にもつながります。",
              tags: ["カラー", "パーマ", "ヘッドスパ"],
            },
            {
              num: "C",
              title: "副業・起業を考える方",
              fit: "低コストで始められる",
              body: "大きな初期投資なしに始められる頭皮ケアメニューとして。THE HERBS SCALP LABOの認定を取得することで、専門性を持ったサロン経営が図れます。",
              tags: ["美容師免許あり", "エステ経験あり", "自宅サロン"],
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-8 transition-all duration-700"
              style={{
                backgroundColor: "#ffffff",
                border: `1px solid ${C.border}`,
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(30px)",
                transitionDelay: `${i * 150}ms`,
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="w-10 h-10 flex items-center justify-center font-bold text-lg flex-shrink-0"
                  style={{ backgroundColor: C.green, color: "#ffffff", fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {item.num}
                </span>
                <div>
                  <h3 className="font-bold text-base" style={{ fontFamily: "'Shippori Mincho', serif", color: C.text }}>
                    {item.title}
                  </h3>
                  <span className="text-xs px-2 py-0.5" style={{ backgroundColor: C.greenLight, color: C.green, fontFamily: "'Noto Sans JP', sans-serif" }}>
                    {item.fit}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.map((tag, j) => (
                  <span key={j} className="text-xs px-3 py-1" style={{ backgroundColor: C.cream, color: "#666", fontFamily: "'Noto Sans JP', sans-serif" }}>
                    {tag}
                  </span>
                ))}
              </div>
              <p className="text-sm leading-relaxed" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#555", lineHeight: "1.8" }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 認定までの流れ ────────────────────────────────────
function ProgramSteps() {
  const { ref, inView } = useInView();

  const steps = [
    {
      num: "01",
      title: "資料を受け取る",
      body: "フォームにお名前・連絡先を入力するだけ。収益モデル・導入事例・認定プログラムの詳細資料を無料でお届けします。勧誘・営業は一切ありません。",
      time: "すぐに受け取れます",
      img: null,
    },
    {
      num: "02",
      title: "オンライン説明会への参加",
      body: "コンセプト・認定プログラムの内容・収益モデルについて詳しくご説明します。質問も自由にどうぞ。",
      time: "約60分",
      img: null,
    },
    {
      num: "03",
      title: "技術講習会への参加",
      body: "頭皮チェックの手順・ボタニカルミストの使い方・カウンセリング方法を実習形式で学びます。THE HERBSの専門スタッフが直接指導。少人数制で丁寧に学べます。",
      time: "1〜2日",
      img: IMAGES.workshop04,
    },
    {
      num: "04",
      title: "認定サロンとして登録",
      body: "認定後はTHE HERBS SCALP LABOの公式サロンリストに掲載されます。製品の卸販売権・販促ツールの提供・継続サポートを受けられます。",
      time: "認定後すぐ",
      img: null,
    },
  ];

  return (
    <section className="py-24" style={{ backgroundColor: "#ffffff" }} id="steps">
      <div ref={ref} className="max-w-4xl mx-auto px-6">
        <div
          className="text-center mb-16 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)" }}
        >
          <span className="text-xs tracking-[0.4em] uppercase block mb-4 font-medium" style={{ color: C.green }}>
            Certification Program
          </span>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Shippori Mincho', serif", color: C.text }}>
            認定までの流れ
          </h2>
        </div>

        <div className="space-y-8">
          {steps.map((step, i) => (
            <div
              key={i}
              className="transition-all duration-700"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateX(0)" : "translateX(-30px)",
                transitionDelay: `${i * 150}ms`,
              }}
            >
              <div className="flex gap-6 items-start">
                <div
                  className="flex-shrink-0 w-14 h-14 flex items-center justify-center font-bold text-lg"
                  style={{ backgroundColor: C.green, color: "#ffffff", fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {step.num}
                </div>
                <div className="flex-1 pb-6" style={{ borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg" style={{ fontFamily: "'Shippori Mincho', serif", color: C.text }}>
                      {step.title}
                    </h3>
                    <span className="text-xs px-2 py-0.5" style={{ backgroundColor: C.greenLight, color: C.green, fontFamily: "'Noto Sans JP', sans-serif" }}>
                      {step.time}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed mb-4" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#555", lineHeight: "1.8" }}>
                    {step.body}
                  </p>
                  {step.img && (
                    <img
                      src={step.img}
                      alt={step.title}
                      className="w-full max-w-2xl object-cover"
                      style={{ height: "280px", objectPosition: "center 30%" }}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────
function Faq() {
  const { ref, inView } = useInView();
  const [open, setOpen] = useState<number | null>(null);

  const faqs = [
    {
      q: "美容師免許がなくても参加できますか？",
      a: "はい。エステサロン・ヘッドスパ店・リラクゼーションサロンなど、美容師免許がなくても参加できます。頭皮チェック自体は医療行為ではなく、化粧品を用いたケアのため、業種を問わず提供可能です。",
    },
    {
      q: "初期費用はどのくらいかかりますか？",
      a: "マイクロスコープ（¥30,000〜80,000）と初回仕入れ（¥30,000〜）が主な費用です。合計¥60,000〜が目安で、月5件の提供で回収できる計算です。詳細は資料または説明会でご確認ください。",
    },
    {
      q: "自宅サロンでも参加できますか？",
      a: "はい、可能です。プライベートサロンや自宅サロンでも、適切な環境があれば認定を受けることができます。詳しくはご相談ください。",
    },
    {
      q: "既存のメニューと並行して提供できますか？",
      a: "はい。THE HERBS SCALP LABOのメニューは、既存のカラー・パーマ・フェイシャルなどと組み合わせて提供できます。「カラー後の頭皮ケア」として追加するだけでも十分な価値になります。",
    },
    {
      q: "認定後のサポートはありますか？",
      a: "はい。認定後も定期的な技術フォロー・新製品情報の提供・お客様対応のサポートを継続して行います。また、認定サロン同士のコミュニティへの参加も可能です。",
    },
  ];

  return (
    <section className="py-24" style={{ backgroundColor: C.cream }} id="faq">
      <div ref={ref} className="max-w-3xl mx-auto px-6">
        <div
          className="text-center mb-16 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)" }}
        >
          <span className="text-xs tracking-[0.4em] uppercase block mb-4 font-medium" style={{ color: C.green }}>
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Shippori Mincho', serif", color: C.text }}>
            よくあるご質問
          </h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="transition-all duration-700"
              style={{
                border: `1px solid ${C.border}`,
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(20px)",
                transitionDelay: `${i * 100}ms`,
              }}
            >
              <button
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-bold text-sm" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: C.text }}>
                  {faq.q}
                </span>
                <span
                  className="flex-shrink-0 w-6 h-6 flex items-center justify-center font-bold transition-transform duration-300 text-lg"
                  style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)", color: C.green }}
                >
                  +
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm leading-relaxed" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#555", lineHeight: "1.8" }}>
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── 資料請求フォーム ──────────────────────────────────
const OCCUPATION_OPTIONS = [
  { value: "hair_salon", label: "美容室・ヘアサロン" },
  { value: "head_spa", label: "ヘッドスパ専門店" },
  { value: "esthetic", label: "エステ・フェイシャルサロン" },
  { value: "nail_lash", label: "ネイル・まつ毛・リラクゼーション" },
  { value: "seitai", label: "整体・鍼灸・治療院" },
  { value: "individual", label: "個人事業（その他）" },
  { value: "corporate", label: "法人・複数店舗" },
  { value: "not_yet", label: "まだ開業していない・検討中" },
  { value: "side_job", label: "副業を考えている" },
  { value: "other", label: "その他" },
];

function LeadForm() {
  const { ref, inView } = useInView();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [occupation, setOccupation] = useState("");
  const [occupationOther, setOccupationOther] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const createLead = trpc.salonLead.create.useMutation({
    onSuccess: (data) => {
      setSubmitted(true);
      setTimeout(() => {
        window.location.href = `/partner-doc?token=${data.token}`;
      }, 1200);
    },
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "お名前を入力してください";
    if (!email.trim()) e.email = "メールアドレスを入力してください";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "正しいメールアドレスを入力してください";
    if (!occupation) e.occupation = "業種・活動内容を選択してください";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    createLead.mutate({ name, email, occupation, occupationOther: occupation === "other" ? occupationOther : undefined });
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "0.85rem 1rem",
    backgroundColor: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.25)",
    borderRadius: "4px",
    color: "#ffffff",
    fontFamily: "'Noto Sans JP', sans-serif",
    fontSize: "0.9rem",
    outline: "none",
    boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "0.8rem",
    color: "rgba(255,255,255,0.7)",
    marginBottom: "0.4rem",
    fontFamily: "'Noto Sans JP', sans-serif",
  };
  const errStyle: React.CSSProperties = {
    color: "#fca5a5",
    fontSize: "0.75rem",
    marginTop: "0.3rem",
    fontFamily: "'Noto Sans JP', sans-serif",
  };

  return (
    <section className="py-24" style={{ backgroundColor: C.green }} id="contact">
      <div ref={ref} className="max-w-2xl mx-auto px-6">
        <div
          className="transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)" }}
        >
          <div className="text-center mb-10">
            <span className="text-xs tracking-[0.4em] uppercase block mb-6 font-medium" style={{ color: "#a8d5a2" }}>
              Partner Document
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Shippori Mincho', serif", color: "#ffffff" }}>
              資料を無料で受け取る
            </h2>
            <p className="text-sm" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "rgba(255,255,255,0.7)", lineHeight: "1.9" }}>
              下記を入力して送信すると、パートナー向け資料を無料でご覧いただけます。
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-12">
              <div style={{ fontSize: "2.5rem", marginBottom: "1rem", color: "#a8d5a2", fontWeight: 700 }}>OK</div>
              <p style={{ color: "#ffffff", fontFamily: "'Noto Sans JP', sans-serif", fontSize: "1.1rem", fontWeight: 700 }}>ご登録ありがとうございます</p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Noto Sans JP', sans-serif", fontSize: "0.85rem", marginTop: "0.5rem" }}>資料ページへ移動します…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              {/* 資料に含まれる内容 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-10">
                {[
                  "新しいビジネスでできること",
                  "導入サロンの実際の声",
                  "初期費用・ランニングコストの目安",
                  "認定プログラムの詳細スケジュール",
                  "ブルーオーシャン市場の詳細データ",
                  "サポート体制について",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
                    <span style={{ color: "#a8d5a2", flexShrink: 0, fontWeight: 700, fontSize: "12px" }}>+</span>
                    <span className="text-sm" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "rgba(255,255,255,0.85)" }}>{item}</span>
                  </div>
                ))}
              </div>

              {/* お名前 */}
              <div style={{ marginBottom: "1.2rem" }}>
                <label style={labelStyle}>お名前 <span style={{ color: "#fca5a5" }}>*</span></label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="山田 花子"
                  style={inputStyle}
                />
                {errors.name && <p style={errStyle}>{errors.name}</p>}
              </div>

              {/* メールアドレス */}
              <div style={{ marginBottom: "1.2rem" }}>
                <label style={labelStyle}>メールアドレス <span style={{ color: "#fca5a5" }}>*</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="example@salon.jp"
                  style={inputStyle}
                />
                {errors.email && <p style={errStyle}>{errors.email}</p>}
              </div>

              {/* 業種・活動内容 */}
              <div style={{ marginBottom: occupation === "other" ? "0.6rem" : "1.8rem" }}>
                <label style={labelStyle}>業種・活動内容 <span style={{ color: "#fca5a5" }}>*</span></label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                  {OCCUPATION_OPTIONS.map(opt => (
                    <label
                      key={opt.value}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        padding: "0.65rem 0.8rem",
                        backgroundColor: occupation === opt.value ? "rgba(169,213,162,0.25)" : "rgba(255,255,255,0.07)",
                        border: occupation === opt.value ? "1px solid #a8d5a2" : "1px solid rgba(255,255,255,0.15)",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontFamily: "'Noto Sans JP', sans-serif",
                        fontSize: "0.8rem",
                        color: "rgba(255,255,255,0.85)",
                      }}
                    >
                      <input
                        type="radio"
                        name="occupation"
                        value={opt.value}
                        checked={occupation === opt.value}
                        onChange={() => setOccupation(opt.value)}
                        style={{ accentColor: "#a8d5a2" }}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
                {errors.occupation && <p style={errStyle}>{errors.occupation}</p>}
              </div>

              {occupation === "other" && (
                <div style={{ marginBottom: "1.8rem" }}>
                  <label style={labelStyle}>その他（具体的にお教えください）</label>
                  <input
                    type="text"
                    value={occupationOther}
                    onChange={e => setOccupationOther(e.target.value)}
                    placeholder="例：フリーランスアドバイザー、起業準備中など"
                    style={inputStyle}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={createLead.isPending}
                className="w-full py-5 font-bold text-base tracking-wider transition-all duration-300"
                style={{
                  backgroundColor: createLead.isPending ? "#a08030" : C.gold,
                  color: "#1a1a1a",
                  fontFamily: "'Noto Sans JP', sans-serif",
                  border: "none",
                  cursor: createLead.isPending ? "not-allowed" : "pointer",
                }}
              >
                {createLead.isPending ? "送信中…" : "無料資料を受け取る"}
              </button>

              {createLead.isError && (
                <p style={{ ...errStyle, textAlign: "center", marginTop: "0.8rem" }}>
                  送信に失敗しました。時間をおいて再度お試しください。
                </p>
              )}

              <p className="text-center text-xs mt-4" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Noto Sans JP', sans-serif" }}>
                ※ 勧誘・営業は一切ありません。資料の閲覧のみも歓迎です。
              </p>
            </form>
          )}

          {/* LINE・説明会ボタン */}
          <div style={{ marginTop: "2rem", borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "1.5rem" }}>
            <p className="text-center text-xs mb-3" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Noto Sans JP', sans-serif" }}>
              または、LINEでお気軽にご相談ください
            </p>
            <a
              href="https://lin.ee/UF8T8TX"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-4 font-bold text-sm tracking-wider"
              style={{ backgroundColor: "#06C755", color: "#ffffff", fontFamily: "'Noto Sans JP', sans-serif", textDecoration: "none", borderRadius: "4px", marginBottom: "10px" }}
            >
              LINEで相談する（無料）
            </a>
            <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
              <a
                href="https://liff.line.me/2010327961-qbWcOTRL?liff_id=2010327961-qbWcOTRL&group_id=176576"
                target="_blank"
                rel="noopener noreferrer"
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 8px", fontSize: "12px", fontWeight: 700, backgroundColor: "rgba(255,255,255,0.12)", color: "#ffffff", fontFamily: "'Noto Sans JP', sans-serif", textDecoration: "none", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.25)", textAlign: "center" }}
              >
                オンライン説明会に参加する
              </a>
              <a
                href="https://liff.line.me/2010327961-qbWcOTRL?liff_id=2010327961-qbWcOTRL&group_id=184188"
                target="_blank"
                rel="noopener noreferrer"
                style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "12px 8px", fontSize: "12px", fontWeight: 700, backgroundColor: "rgba(255,255,255,0.12)", color: "#ffffff", fontFamily: "'Noto Sans JP', sans-serif", textDecoration: "none", borderRadius: "4px", border: "1px solid rgba(255,255,255,0.25)", textAlign: "center" }}
              >
                神戸で体験する
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── FOOTER ────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-8 text-center" style={{ backgroundColor: "#1a1a1a" }}>
      <div className="flex items-center justify-center mb-3">
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/logo_olive_12a41c11.webp"
          alt="THE HERBS SCALP LABO"
          className="w-auto object-contain"
          style={{ height: "56px", objectFit: "contain" }}
        />
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1 justify-center mb-2 px-4">
        {[
          { label: "株式会社THE HERBS", href: null },
          { label: "代表：宮川由美子", href: null },
          { label: "兵庫県芦屋市南宮町3-10", href: null },
          { label: "TEL: 0797-23-0364", href: "tel:0797230364" },
          { label: "オフィシャルサイト", href: "https://the-herbs.co.jp" },
          { label: "オンラインショップ", href: "https://herb-esthe.com" },
          { label: "Instagram", href: "https://www.instagram.com/the_herbs_jp/" },
        ].map((item) =>
          item.href ? (
            <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
              className="text-[11px] underline underline-offset-2 transition-colors"
              style={{ color: "rgba(255,255,255,0.45)", fontFamily: "'Noto Sans JP', sans-serif" }}>
              {item.label}
            </a>
          ) : (
            <span key={item.label} className="text-[11px]" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "'Noto Sans JP', sans-serif" }}>
              {item.label}
            </span>
          )
        )}
      </div>
      <p className="text-[10px] mb-3" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Noto Sans JP', sans-serif" }}>
        設立：昭和61年4月24日｜化粧品製造業・化粧品製造販売業
      </p>
      <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Noto Sans JP', sans-serif" }}>
        © 2026 THE HERBS SCALP LABO. All rights reserved.
      </p>
      <div className="mt-3 flex justify-center gap-6">
        <a href="/" className="text-xs transition-colors" style={{ color: "rgba(255,255,255,0.4)" }}>
          一般の方はこちら（レディース）
        </a>
        <a href="/men" className="text-xs transition-colors" style={{ color: "rgba(255,255,255,0.4)" }}>
          一般の方はこちら（メンズ）
        </a>
      </div>
    </footer>
  );
}

// ── MAIN ──────────────────────────────────────────────
export default function SalonPartner() {
  useEffect(() => {
    document.title = "サロンパートナー募集 | THE HERBS SCALP LABO";
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.name = name; document.head.appendChild(el); }
      el.content = content;
    };
    setMeta("description", "頭皮ケアのブルーオーシャン市場へ。予防型ヘルスケア×習慣化事業として、THE HERBS SCALP LABO認定パートナーを募集。資料請求フォームから無料でお届けします。");
    setMeta("keywords", "頭皮ケア 副業,エステサロン 新メニュー,美容師 副業,ヘッドスパ 開業,THE HERBS SCALP LABO 認定サロン");
  }, []);

  return (
    <div style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
      <Nav />
      <Hero />
      <WhyNow />
      <BusinessModel />
      <WhoCanJoin />
      <ProgramSteps />
      <Faq />
      <LeadForm />
      <Footer />
    </div>
  );
}
