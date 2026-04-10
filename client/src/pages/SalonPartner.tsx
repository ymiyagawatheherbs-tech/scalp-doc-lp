/**
 * SalonPartner.tsx
 * Design: Clean Professional — ホワイト×ディープグリーン×ゴールド
 * Philosophy: 「ブルーオーシャン×予防型ヘルスケア×習慣化事業」の訴求 → LINE登録への誘導
 * 収益の詳細はLINE登録後に配布する資料に掲載
 * Layout: 縦スクロール型ストーリーテリング構造
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Menu, X, MapPin, Phone, Globe, Instagram } from "lucide-react";
import { trpc } from "@/lib/trpc";

const IMAGES = {
  interior: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/salon_interior_c8f3f7a4.jpg",
  steamer: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/salon_steamer_treatment_ae0eacff.jpg",
  scalpCheck: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/salon_scalp_check_ae329437.jpg",
  // 講習会画像
  workshop01: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/workshop_01_681429e8.png",
  workshop02: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/workshop_02_2687668f.webp",
  workshop03: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/workshop_03_a2848978.jpg",
  workshop04: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/workshop_04_1185c7ae.png",
  workshop05: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/concept_salon_img2348_fd51c932.webp",
};

const LINE_SALON = {
  url: "https://lin.ee/UF8T8TX",
  account: "@theherbs_salon",
};

const HERBS_LOGO = "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/theherbs_logo_395db853.webp";

function useInView(threshold = 0.15) {
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

// ========== NAV ==========
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

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          backgroundColor: scrolled ? "rgba(248,246,242,0.97)" : "transparent",
          backdropFilter: scrolled ? "blur(12px)" : "none",
          borderBottom: scrolled ? "1px solid #e0e0e0" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/logo_olive_12a41c11.webp"
              alt="THE HERBS"
              className="object-contain transition-all cursor-pointer"
              style={{
                height: "44px",
                width: "auto",
                filter: scrolled
                  ? "none"
                  : "brightness(0) invert(1)",
              }}
            />
            <div className="flex flex-col leading-none">
              <span
                className="font-bold tracking-widest transition-colors"
                style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.10em", color: scrolled ? "oklch(0.35 0.050 130)" : "rgba(255,255,255,0.95)" }}
              >
                THE HERBS
              </span>
              <span
                className="font-sans-jp transition-colors"
                style={{ fontSize: "0.52rem", letterSpacing: "0.15em", color: scrolled ? "oklch(0.48 0.08 140)" : "rgba(255,255,255,0.45)" }}
              >
                SCALP LABO
              </span>
            </div>
          </Link>

          {/* 中央：presented by THE HERBS（デスクトップのみ） */}
          <div className="hidden md:flex flex-col items-center">
            <span
              className="font-cormorant transition-colors"
              style={{ fontSize: "0.58rem", letterSpacing: "0.22em", color: scrolled ? "oklch(0.48 0.06 140)" : "rgba(255,255,255,0.35)", textTransform: "uppercase" }}
            >
              presented by
            </span>
            <span
              className="font-cormorant font-semibold transition-colors"
              style={{ fontSize: "0.85rem", letterSpacing: "0.25em", color: scrolled ? "oklch(0.35 0.050 130)" : "rgba(255,255,255,0.75)", textTransform: "uppercase" }}
            >
              THE HERBS
            </span>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/">
              <span className="hidden md:inline text-xs cursor-pointer whitespace-nowrap" style={{ color: scrolled ? "#555" : "rgba(255,255,255,0.7)", fontFamily: "'Noto Sans JP', sans-serif" }}>
                ← 一般向けページへ
              </span>
            </Link>
            <a
              href={LINE_SALON.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block text-xs font-bold px-4 py-2 transition-all whitespace-nowrap"
              style={{ backgroundColor: "#06C755", color: "#ffffff", fontFamily: "'Noto Sans JP', sans-serif" }}
            >
              LINEで資料を受け取る
            </a>
            {/* モバイルハンバーガー */}
            <button
              className="sm:hidden p-1.5"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="メニュー"
              style={{ color: scrolled ? "oklch(0.22 0.045 42)" : "white" }}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* モバイルメニュー */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col pt-20 px-8" style={{ backgroundColor: "#f8f6f2" }}>
          <div className="flex flex-col gap-1 mb-8">
            <p className="text-xs tracking-[0.3em] mb-4" style={{ color: "#5a7a52", fontFamily: "'Noto Sans JP', sans-serif" }}>MENU</p>
            {[
              { label: "コンセプト", href: "#concept" },
              { label: "サービス内容", href: "#service" },
              { label: "収益モデル", href: "#revenue" },
              { label: "FAQ", href: "#faq" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="py-4 border-b text-lg font-bold"
                style={{ fontFamily: "'Shippori Mincho', serif", color: "#1a1a1a", borderColor: "#e8e4dc" }}
              >
                {item.label}
              </a>
            ))}
          </div>
          <a
            href={LINE_SALON.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-4 font-bold text-base"
            style={{ backgroundColor: "#06C755", color: "#ffffff", fontFamily: "'Noto Sans JP', sans-serif" }}
            onClick={() => setMenuOpen(false)}
          >
            LINEで資料を受け取る（無料）
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

// ========== HERO ==========
function Hero() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 100); }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ backgroundColor: "#f8f6f2" }}>
      {/* 背景画像（右半分） */}
      <div className="absolute right-0 top-0 w-full lg:w-[55%] h-full">
        <img
          src={IMAGES.interior}
          alt="THE HERBS SCALP LAB認定サロン"
          className="w-full h-full object-cover"
          style={{ objectPosition: "center center" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to right, #f8f6f2 0%, #f8f6f2 5%, rgba(248,246,242,0.7) 35%, transparent 65%)" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-32 w-full">
        <div
          className="max-w-xl transition-all duration-1000"
          style={{ opacity: loaded ? 1 : 0, transform: loaded ? "translateY(0)" : "translateY(30px)" }}
        >
          <span className="text-xs tracking-[0.4em] uppercase block mb-6 font-medium" style={{ color: "#5a7a52" }}>
            THE HERBS SCALP LABO パートナープログラム
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Shippori Mincho', serif", color: "#1a1a1a" }}>
            頭皮ケアの悩みを、<br />
            <span style={{ color: "#5a7a52" }}>一緒に解決しませんか。</span>
          </h1>
          <p className="text-lg font-medium mb-4 leading-snug" style={{ fontFamily: "'Shippori Mincho', serif", color: "#2a3e2a" }}>
            植物の力で、頭皮ケアの新常識を広める事業。
          </p>
          <p className="text-base leading-relaxed mb-4" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#444", lineHeight: "1.9" }}>
            薄毛・抜け毛・うねり・頭皮トラブル。<br />
            悩みを抱えながらも、どこに相談すればいいかわからない方が大勢います。<br />
            THE HERBS SCALP LABOは、そうした方々の「受け皿」となる技術を提供し、一緒にサポートしていきたいサロンを募集しています。
          </p>
          <p className="text-sm leading-relaxed mb-8" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#888" }}>
            エステサロン・美容師・ヘッドスパ店など、業種を問わず参加できます。
          </p>
          {/* 権威性帯 */}
          <div className="mb-8 p-4 border-l-4" style={{ borderColor: '#5a7a52', backgroundColor: 'rgba(90,122,82,0.06)' }}>
            <p className="text-xs leading-relaxed" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: '#2a3e2a' }}>
              <span className="font-bold">化粧品製造会社 THE HERBS（創業1986年）</span>が開発した独自の植物美容メソッド。
              メーカー直営の技術・証拠・商品をそのまま提供。
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href={LINE_SALON.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 font-bold text-sm tracking-wider transition-all duration-300"
              style={{ backgroundColor: "#06C755", color: "#ffffff", fontFamily: "'Noto Sans JP', sans-serif" }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#05a847")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#06C755")}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.02 2 11c0 3.07 1.58 5.8 4.04 7.54L5.5 22l4.14-2.16C10.39 20.27 11.18 20.4 12 20.4c5.52 0 10-4.02 10-9S17.52 2 12 2z"/>
              </svg>
              LINEで資料を受け取る（無料）
            </a>
            <a
              href="#concept"
              className="inline-flex items-center justify-center px-8 py-4 font-bold text-sm tracking-wider transition-all duration-300 border-2"
              style={{ borderColor: "#5a7a52", color: "#5a7a52", fontFamily: "'Noto Sans JP', sans-serif", backgroundColor: "transparent" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#5a7a52"; e.currentTarget.style.color = "#ffffff"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#5a7a52"; }}
            >
              コンセプトを見る
            </a>
          </div>
          <p className="mt-4 text-xs" style={{ color: "#aaa", fontFamily: "'Noto Sans JP', sans-serif" }}>
            {LINE_SALON.account} ／ 登録後すぐに資料をお送りします
          </p>
        </div>
      </div>
    </section>
  );
}

// ========== BLUE OCEAN ==========
function BlueOcean() {
  const { ref, inView } = useInView();

  return (
    <section className="py-24" style={{ backgroundColor: "#2a3e2a" }} id="concept">
      <div ref={ref} className="max-w-6xl mx-auto px-6">
        <div
          className="text-center mb-16 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)" }}
        >
          <span className="text-xs tracking-[0.4em] uppercase block mb-4 font-medium" style={{ color: "#a8d5a2" }}>
            Blue Ocean Market
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "'Shippori Mincho', serif", color: "#ffffff" }}>
            なぜ今、頭皮ケアなのか
          </h2>
          <p className="text-base max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "rgba(255,255,255,0.75)", lineHeight: "1.9" }}>
            美容室は飽和状態。エステも競争が激化しています。<br />
            しかし「頭皮の定期チェック」や「定期ケア」など、専門的に提供するサロンは、まだほとんど存在しません。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px mb-16" style={{ backgroundColor: "rgba(255,255,255,0.08)" }}>
          {[
            {
              label: "予防型ヘルスケア市場",
              value: "年率15.5%成長",
              body: "世界の予防ヘルスケア市場は2029年に約90兆円規模へ。「病気になってから治す」から「なる前に防ぐ」へのシフトが加速しています。",
              src: "※GII市場調査レポート2025より",
            },
            {
              label: "頭皮・ヘッドスパ需要",
              value: "急拡大中",
              body: "リラクゼーション市場は前年比9.6%増の3,674億円（2024年）。その中でもヘッドスパ・頭皮ケアへの需要が特に伸びています。",
              src: "※リクルート美容センサス2024より",
            },
            {
              label: "定期チェック提供サロン",
              value: "ほぼゼロ",
              body: "歯科の定期検診は当たり前になりましたが、頭皮の定期チェックを習慣として提供しているサロンは国内でもほとんど存在しません。",
              src: "※THE HERBS調べ",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-8 transition-all duration-700"
              style={{
                backgroundColor: "#2a3e2a",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(30px)",
                transitionDelay: `${i * 150}ms`,
              }}
            >
              <span className="text-xs tracking-widest block mb-3" style={{ color: "#a8d5a2", fontFamily: "'Noto Sans JP', sans-serif" }}>{item.label}</span>
              <p className="text-3xl font-bold mb-4" style={{ fontFamily: "'Shippori Mincho', serif", color: "#ffffff" }}>{item.value}</p>
              <p className="text-sm leading-relaxed mb-4" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "rgba(255,255,255,0.7)", lineHeight: "1.8" }}>
                {item.body}
              </p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Noto Sans JP', sans-serif" }}>{item.src}</p>
            </div>
          ))}
        </div>

        {/* ポジショニングマップ */}
        <div
          className="p-8 md:p-12 transition-all duration-700"
          style={{
            backgroundColor: "#5a7a52",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(30px)",
            transitionDelay: "500ms",
          }}
        >
          <h3 className="text-xl font-bold mb-2 text-center" style={{ fontFamily: "'Shippori Mincho', serif", color: "#ffffff" }}>
            THE HERBS SCALP LABが目指すポジション
          </h3>
          <p className="text-sm text-center mb-10" style={{ color: "rgba(255,255,255,0.65)", fontFamily: "'Noto Sans JP', sans-serif" }}>
            「美容」でも「医療」でもない、第三の領域
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-center">
            {[
              { area: "美容サービス", desc: "スタイリング・施術の提供", color: "rgba(255,255,255,0.15)", textColor: "rgba(255,255,255,0.5)", note: "商品・施術が主役" },
              { area: "THE HERBS SCALP LABO", desc: "頭皮の定期チェック＋ケアの習慣化", color: "#a8d5a2", textColor: "#2a3e2a", note: "習慣化が主役（ブルーオーシャン）", highlight: true },
              { area: "医療機関", desc: "診断・治療・処方", color: "rgba(255,255,255,0.15)", textColor: "rgba(255,255,255,0.5)", note: "疾患対応が主役" },
            ].map((pos, i) => (
              <div
                key={i}
                className="p-6"
                style={{ backgroundColor: pos.color }}
              >
                <p className="text-xs tracking-widest mb-2" style={{ color: pos.highlight ? "#5a7a52" : "rgba(255,255,255,0.4)", fontFamily: "'Noto Sans JP', sans-serif" }}>
                  {pos.highlight ? "◀ ここに参入 ▶" : "　"}
                </p>
                <h4 className="text-lg font-bold mb-2" style={{ fontFamily: "'Shippori Mincho', serif", color: pos.textColor }}>
                  {pos.area}
                </h4>
                <p className="text-sm mb-3" style={{ color: pos.highlight ? "#2a3e2a" : "rgba(255,255,255,0.6)", fontFamily: "'Noto Sans JP', sans-serif" }}>
                  {pos.desc}
                </p>
                <p className="text-xs" style={{ color: pos.highlight ? "#5a7a52" : "rgba(255,255,255,0.4)", fontFamily: "'Noto Sans JP', sans-serif", fontWeight: pos.highlight ? "bold" : "normal" }}>
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

// ========== CONCEPT ==========
function Concept() {
  const { ref, inView } = useInView();

  return (
    <section className="py-24" style={{ backgroundColor: "#ffffff" }}>
      <div ref={ref} className="max-w-6xl mx-auto px-6">
        <div
          className="text-center mb-16 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)" }}
        >
          <span className="text-xs tracking-[0.4em] uppercase block mb-4 font-medium" style={{ color: "#5a7a52" }}>
            Our Concept
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "'Shippori Mincho', serif", color: "#1a1a1a" }}>
            「売る事業」ではなく、<br />「習慣をつくる事業」
          </h2>
          <p className="text-base max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#555", lineHeight: "1.9" }}>
            歯科の定期検診が当たり前になったように、<br />
            頭皮の定期チェックを「当たり前の習慣」にすることが、THE HERBS SCALP LABのミッションです。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-16">
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
              body: "頭皮は顔や体と同じ「皮膚」。スキンケア以上に過酷な環境である頭皮を皮膚と同じ感覚で、頭皮ケアを日常に取り入れる文化を育てます。",
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
                backgroundColor: "#f8f6f2",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(30px)",
                transitionDelay: `${i * 150}ms`,
              }}
            >
              <span className="text-4xl font-bold block mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#5a7a52" }}>{item.num}</span>
              <h3 className="text-lg font-bold mb-3" style={{ fontFamily: "'Shippori Mincho', serif", color: "#1a1a1a" }}>
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed mb-4" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#666", lineHeight: "1.8" }}>
                {item.body}
              </p>
              <p className="text-xs font-bold px-3 py-2 inline-block" style={{ backgroundColor: "#eef5ea", color: "#5a7a52", fontFamily: "'Noto Sans JP', sans-serif" }}>
                {item.accent}
              </p>
            </div>
          ))}
        </div>

        {/* 講習会イメージ */}
        <div
          className="mb-12 overflow-hidden transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)", transitionDelay: "400ms" }}
        >
          <img
            src={IMAGES.workshop05}
            alt="THE HERBS 技術講習会の様子"
            className="w-full object-cover"
            style={{ height: "360px", objectPosition: "center 40%" }}
          />
          <p className="text-xs text-center mt-3" style={{ color: "#888", fontFamily: "'Noto Sans JP', sans-serif" }}>
            実際の技術講習会の様子 — 少人数制で丁寧に指導します
          </p>
        </div>

        {/* 歯科との比較 */}
        <div
          className="p-8 md:p-12 transition-all duration-700"
          style={{
            border: "2px solid #5a7a52",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(30px)",
            transitionDelay: "500ms",
          }}
        >
          <h3 className="text-xl font-bold mb-8 text-center" style={{ fontFamily: "'Shippori Mincho', serif", color: "#1a1a1a" }}>
            歯科との対比で見るTHE HERBS SCALP LABのモデル
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "歯科の定期検診モデル",
                items: ["虫歯になる前に定期的に通う", "問題が見つかれば治療へ", "データを蓄積して経年変化を追う", "習慣化で患者との長期関係"],
                color: "#f8f6f2",
                label: "確立されたモデル",
              },
              {
                title: "THE HERBS SCALP LABの定期チェックモデル",
                items: ["薄毛になる前に定期的にチェック", "問題が見つかれば施術・ケアへ", "マイクロスコープで経年変化を記録", "習慣化でお客様との長期関係"],
                color: "#eef5ea",
                label: "これから創るモデル",
              },
            ].map((col, i) => (
              <div key={i} className="p-6" style={{ backgroundColor: col.color }}>
                <span className="text-xs tracking-widest block mb-3" style={{ color: "#5a7a52", fontFamily: "'Noto Sans JP', sans-serif" }}>{col.label}</span>
                <h4 className="font-bold mb-4" style={{ fontFamily: "'Shippori Mincho', serif", color: "#1a1a1a" }}>{col.title}</h4>
                <ul className="space-y-2">
                  {col.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#555" }}>
                      <span style={{ color: "#5a7a52", flexShrink: 0 }}>✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ========== WHAT WE DO TOGETHER ==========
function WhatWeDo() {
  const { ref, inView } = useInView();

  const steps = [
    {
      img: IMAGES.workshop02,
      step: "STEP 01",
      title: "頭皮チェックで「見える化」する",
      body: "マイクロスコープで頭皮の状態を記録・分析。お客様が自分の頭皮を初めて「見る」体験が、ケアへの動機づけになります。データは時系列で蓄積され、変化を実感できます。",
      note: "所要時間：約5〜10分 / 初回無料で提供可能",
    },
    {
      img: IMAGES.workshop03,
      step: "STEP 02",
      title: "ボタニカルミストで頭皮を整える",
      body: "THE HERBSが開発したハーブスチーマーで、植物成分そのものを蒸気で頭皮に届けます。カラー・パーマ後の薬剤除去にも対応。チェックで見つかった課題に合わせたケアを提供します。",
      note: "既存メニューへの追加・単品提供どちらも可能",
    },
    {
      img: IMAGES.workshop01,
      step: "STEP 03",
      title: "定期来店の仕組みをつくる",
      body: "「歯の定期検診」のように、頭皮チェックを定期的に受ける習慣を育てます。定期来店が定着することで、安定した売上と顧客との深い信頼関係が生まれます。",
      note: "3ヶ月・6ヶ月のフォローアップ設計をサポート",
    },
  ];

  return (
    <section className="py-24" style={{ backgroundColor: "#f8f6f2" }} id="program">
      <div ref={ref} className="max-w-6xl mx-auto px-6">
        <div
          className="text-center mb-16 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)" }}
        >
          <span className="text-xs tracking-[0.4em] uppercase block mb-4 font-medium" style={{ color: "#5a7a52" }}>
            How We Work Together
          </span>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Shippori Mincho', serif", color: "#1a1a1a" }}>
            一緒にできること
          </h2>
        </div>

        <div className="space-y-16">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`flex flex-col ${i % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} gap-8 md:gap-12 items-center transition-all duration-700`}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(30px)",
                transitionDelay: `${i * 200}ms`,
              }}
            >
              <div className="w-full md:w-1/2">
                <img
                  src={step.img}
                  alt={step.title}
                  className="w-full h-64 md:h-80 object-cover"
                />
              </div>
              <div className="w-full md:w-1/2">
                <span className="text-xs tracking-[0.3em] block mb-3" style={{ color: "#5a7a52", fontFamily: "'Cormorant Garamond', serif" }}>{step.step}</span>
                <h3 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: "'Shippori Mincho', serif", color: "#1a1a1a" }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed mb-4" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#555", lineHeight: "1.9" }}>
                  {step.body}
                </p>
                <p className="text-xs px-4 py-2 inline-block" style={{ backgroundColor: "#eef5ea", color: "#5a7a52", fontFamily: "'Noto Sans JP', sans-serif" }}>
                  {step.note}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========== LINE CTA（収益詳細はLINE登録後） ==========
function LineCtaSection() {
  const { ref, inView } = useInView();

  return (
    <section className="py-24" style={{ backgroundColor: "#5a7a52" }}>
      <div ref={ref} className="max-w-4xl mx-auto px-6">
        <div
          className="transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)" }}
        >
          <div className="text-center mb-12">
            <span className="text-xs tracking-[0.4em] uppercase block mb-6 font-medium" style={{ color: "#a8d5a2" }}>
              Partner Document
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "'Shippori Mincho', serif", color: "#ffffff" }}>
              収益の仕組みは、<br />LINE登録後にお届けします
            </h2>
            <p className="text-base leading-relaxed mb-4" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "rgba(255,255,255,0.8)", lineHeight: "1.9" }}>
              パートナー向け資料には、具体的な収益モデル・導入事例・<br className="hidden md:block" />
              認定プログラムの詳細・初期費用の目安を掲載しています。
            </p>
            <p className="text-sm mb-10" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "rgba(255,255,255,0.6)" }}>
              ※資料は無料でお届けします。勧誘・営業は一切ありません。
            </p>
          </div>

          {/* 資料に含まれる内容 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-12">
            {[
              "収益シミュレーション（月間・年間）",
              "導入サロンの実際の声",
              "初期費用・ランニングコストの目安",
              "認定プログラムの詳細スケジュール",
              "ブルーオーシャン市場の詳細データ",
              "THE HERBS製品の卸価格",
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-5 py-4"
                style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
              >
                <span style={{ color: "#a8d5a2", flexShrink: 0, fontSize: "18px" }}>✓</span>
                <span className="text-sm" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "rgba(255,255,255,0.85)" }}>{item}</span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a
              href={LINE_SALON.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-12 py-5 font-bold text-base tracking-wider transition-all duration-300"
              style={{ backgroundColor: "#06C755", color: "#ffffff", fontFamily: "'Noto Sans JP', sans-serif" }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#05a847")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#06C755")}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.02 2 11c0 3.07 1.58 5.8 4.04 7.54L5.5 22l4.14-2.16C10.39 20.27 11.18 20.4 12 20.4c5.52 0 10-4.02 10-9S17.52 2 12 2z"/>
              </svg>
              LINEで資料を受け取る（無料）
            </a>
            <p className="mt-4 text-sm" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Noto Sans JP', sans-serif" }}>
              {LINE_SALON.account} ／ 登録後すぐに資料をお送りします
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ========== WHO CAN JOIN ==========
function WhoCanJoin() {
  const { ref, inView } = useInView();

  return (
    <section className="py-24" style={{ backgroundColor: "#ffffff" }}>
      <div ref={ref} className="max-w-6xl mx-auto px-6">
        <div
          className="text-center mb-16 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)" }}
        >
          <span className="text-xs tracking-[0.4em] uppercase block mb-4 font-medium" style={{ color: "#5a7a52" }}>
            Who Can Join
          </span>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Shippori Mincho', serif", color: "#1a1a1a" }}>
            こんな方と一緒に取り組みたい
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              title: "エステサロン",
              icon: "✨",
              tags: ["フェイシャル", "ボディケア", "リラクゼーション"],
              body: "お客様の「全身美容」をサポートしているサロンに。頭皮ケアは顔・体と同じ「皮膚ケア」です。既存のお客様に新しい価値を提供できます。",
              fit: "特に相性が良い",
            },
            {
              title: "美容師・ヘアサロン",
              icon: "✂️",
              tags: ["カラー", "パーマ", "ヘッドスパ"],
              body: "スタイリングの合間に頭皮チェックを追加するだけ。カラー・パーマ後の頭皮ケアは、既存メニューとの親和性が高く、お客様の満足度向上にもつながります。",
              fit: "既存メニューと相性抜群",
            },
            {
              title: "副業・起業を考える方",
              icon: "🌱",
              tags: ["美容師免許あり", "エステ経験あり", "自宅サロン"],
              body: "大きな初期投資なしに始められる頭皮ケアメニューとして。THE HERBS SCALP LABの認定を取得することで、専門性を持ったサロン経営が図れます。",
              fit: "低コストで始められる",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-8 transition-all duration-700"
              style={{
                border: "1px solid #e0e0e0",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(30px)",
                transitionDelay: `${i * 150}ms`,
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <h3 className="font-bold text-lg" style={{ fontFamily: "'Shippori Mincho', serif", color: "#1a1a1a" }}>
                    {item.title}
                  </h3>
                  <span className="text-xs px-2 py-0.5" style={{ backgroundColor: "#eef5ea", color: "#5a7a52", fontFamily: "'Noto Sans JP', sans-serif" }}>
                    {item.fit}
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {item.tags.map((tag, j) => (
                  <span key={j} className="text-xs px-3 py-1" style={{ backgroundColor: "#f8f6f2", color: "#666", fontFamily: "'Noto Sans JP', sans-serif" }}>
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

// ========== PROGRAM STEPS ==========
function ProgramSteps() {
  const { ref, inView } = useInView();

  return (
    <section className="py-24" style={{ backgroundColor: "#f8f6f2" }}>
      <div ref={ref} className="max-w-4xl mx-auto px-6">
        <div
          className="text-center mb-16 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)" }}
        >
          <span className="text-xs tracking-[0.4em] uppercase block mb-4 font-medium" style={{ color: "#5a7a52" }}>
            Certification Program
          </span>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Shippori Mincho', serif", color: "#1a1a1a" }}>
            認定までの流れ
          </h2>
        </div>

        <div className="space-y-8">
          {[
            {
              num: "01",
              title: "LINEで資料を受け取る",
              body: "まずはサロン向けLINEに登録。収益モデル・導入事例・認定プログラムの詳細資料を無料でお届けします。勧誘・営業は一切ありません。",
              time: "すぐに受け取れます",
              img: null,
            },
            {
              num: "02",
              title: "オンライン説明会への参加",
              body: "THE HERBS SCALP LABのコンセプト・認定プログラムの内容・収益モデルについて詳しくご説明します。質問も自由にどうぞ。",
              time: "絀60分",
              img: null,
            },
            {
              num: "03",
              title: "技術講習会への参加",
              body: "頭皮チェックの手順・ボタニカルミストの使い方・お客様へのカウンセリング方法を実習形式で学びます。THE HERBSの専門スタッフが直接指導。小人数制のアットホーム形式で丁寧に学べます。",
              time: "1日〜2日",
              img: IMAGES.workshop04,
            },
            {
              num: "04",
              title: "認定サロンとして登録",
              body: "認定後はTHE HERBS SCALP LABの公式サロンリストに掲載されます。THE HERBS製品の卸販売権・販促ツールの提供・継続サポートを受けられます。",
              time: "認定後すぐ",
              img: null,
            },
          ].map((step, i) => (
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
                  style={{ backgroundColor: "#5a7a52", color: "#ffffff", fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {step.num}
                </div>
                <div className="flex-1 pb-6" style={{ borderBottom: i < 3 ? "1px solid #e0e0e0" : "none" }}>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg" style={{ fontFamily: "'Shippori Mincho', serif", color: "#1a1a1a" }}>
                      {step.title}
                    </h3>
                    <span className="text-xs px-2 py-0.5" style={{ backgroundColor: "#eef5ea", color: "#5a7a52", fontFamily: "'Noto Sans JP', sans-serif" }}>
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

// ========== FAQ ==========
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
      a: "機器（マイクロスコープ）のご用意が必要です。詳細はLINEでのご相談の際にお伝えします。ボタニカルミスト機器については、導入サポートプランもご用意しています。",
    },
    {
      q: "自宅サロンでも参加できますか？",
      a: "はい、可能です。プライベートサロンや自宅サロンでも、適切な環境があれば認定を受けることができます。詳しくはご相談ください。",
    },
    {
      q: "既存のメニューと並行して提供できますか？",
      a: "はい。THE HERBS SCALP LABのメニューは、既存のカラー・パーマ・フェイシャルなどと組み合わせて提供できます。「カラー後の頭皮ケア」として追加するだけでも十分な価値になります。",
    },
    {
      q: "認定後のサポートはありますか？",
      a: "はい。認定後も定期的な技術フォロー・新製品情報の提供・お客様対応のサポートを継続して行います。また、認定サロン同士のコミュニティへの参加も可能です。",
    },
  ];

  return (
    <section className="py-24" style={{ backgroundColor: "#ffffff" }}>
      <div ref={ref} className="max-w-3xl mx-auto px-6">
        <div
          className="text-center mb-16 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)" }}
        >
          <span className="text-xs tracking-[0.4em] uppercase block mb-4 font-medium" style={{ color: "#5a7a52" }}>
            FAQ
          </span>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Shippori Mincho', serif", color: "#1a1a1a" }}>
            よくあるご質問
          </h2>
        </div>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="transition-all duration-700"
              style={{
                border: "1px solid #e0e0e0",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(20px)",
                transitionDelay: `${i * 100}ms`,
              }}
            >
              <button
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-bold text-sm" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#1a1a1a" }}>
                  {faq.q}
                </span>
                <span
                  className="flex-shrink-0 w-6 h-6 flex items-center justify-center font-bold transition-transform duration-300 text-lg"
                  style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)", color: "#5a7a52" }}
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

// ========== 認定サロン検索 ==========
function CertifiedSalonSection() {
  const { ref, inView } = useInView();
  const [selectedPref, setSelectedPref] = useState<string>("");
  const prefectures = [
    "北海道", "青森", "岩手", "宮城", "秋田", "山形", "福島",
    "茨城", "栃木", "群馬", "埼玉", "千葉", "東京", "神奈川",
    "新潟", "富山", "石川", "福井", "山梨", "長野", "岐阜",
    "静岡", "愛知", "三重", "滋賀", "京都", "大阪", "兵庫", "奈良", "和歌山",
    "鳥取", "島根", "岡山", "広島", "山口",
    "徳島", "香川", "愛媛", "高知",
    "福岡", "佐賀", "長崎", "熊本", "大分", "宮崎", "鹿児島", "沖縄",
  ];
  const { data: salons = [], isLoading } = trpc.salon.list.useQuery(
    { prefecture: selectedPref || undefined },
    { staleTime: 60_000 }
  );

  const serviceLabels: Record<string, string> = {
    scalp_check: "頭皮チェック",
    scalp_care: "頭皮ケア",
    hair_growth: "育毛ケア",
    herb_steam: "ハーブスチーマー",
    home_care: "ホームケア指導",
  };

  return (
    <section className="py-24" style={{ backgroundColor: "#f8f6f0" }} id="salon-list">
      <div
        ref={ref}
        className="max-w-6xl mx-auto px-6 transition-all duration-700"
        style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)" }}
      >
        <div className="text-center mb-12">
          <span className="text-xs tracking-[0.4em] uppercase block mb-4 font-medium" style={{ color: "#5a7a52" }}>Certified Salon</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: "'Shippori Mincho', serif", color: "#1a1a1a" }}>
            お近くの認定サロンを探す
          </h2>
          <p className="text-sm leading-relaxed max-w-xl mx-auto" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#555", lineHeight: "1.9" }}>
            THE HERBS SCALP LAB認定サロンでは、訓練を受けたスペシャリストが頭皮チェックを担当します。<br />
            都道府県で絞り込んで、お近くのサロンを見つけてください。
          </p>
        </div>

        {/* 都道府県フィルター */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          <button
            onClick={() => setSelectedPref("")}
            className="px-4 py-2 text-sm font-medium transition-all duration-200"
            style={{
              backgroundColor: selectedPref === "" ? "#5a7a52" : "#ffffff",
              color: selectedPref === "" ? "#ffffff" : "#5a7a52",
              border: "1px solid #5a7a52",
              fontFamily: "'Noto Sans JP', sans-serif",
            }}
          >
            全国
          </button>
          {prefectures.map(pref => (
            <button
              key={pref}
              onClick={() => setSelectedPref(pref)}
              className="px-4 py-2 text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: selectedPref === pref ? "#5a7a52" : "#ffffff",
                color: selectedPref === pref ? "#ffffff" : "#5a7a52",
                border: "1px solid #5a7a52",
                fontFamily: "'Noto Sans JP', sans-serif",
              }}
            >
              {pref}
            </button>
          ))}
        </div>

        {/* サロン一覧 */}
        {isLoading ? (
          <div className="text-center py-16" style={{ color: "#888", fontFamily: "'Noto Sans JP', sans-serif" }}>読み込み中...</div>
        ) : salons.length === 0 ? (
          <div className="text-center py-16 border-2 border-dashed" style={{ borderColor: "#5a7a52" }}>
            <p className="text-base mb-2" style={{ color: "#5a7a52", fontFamily: "'Shippori Mincho', serif", fontSize: "1.1rem" }}>
              {selectedPref ? `${selectedPref}の認定サロンは現在募集中です` : "認定サロンは現在募集中です"}
            </p>
            <p className="text-sm" style={{ color: "#888", fontFamily: "'Noto Sans JP', sans-serif" }}>パートナーサロンとして参加を希望の方は、下記のLINEよりお問い合わせください。</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {salons.map(salon => (
              <div
                key={salon.id}
                className="bg-white overflow-hidden"
                style={{ boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}
              >
                {salon.imageUrl ? (
                  <img src={salon.imageUrl} alt={salon.name} className="w-full object-cover" style={{ height: "180px" }} />
                ) : (
                  <div className="w-full flex items-center justify-center" style={{ height: "180px", backgroundColor: "#e8f0e5" }}>
                    <span style={{ color: "#5a7a52", fontSize: "2.5rem" }}>🌿</span>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-0.5 font-medium" style={{ backgroundColor: "#5a7a52", color: "#fff", fontFamily: "'Noto Sans JP', sans-serif", letterSpacing: "0.05em" }}>CERTIFIED</span>
                    <span className="text-xs" style={{ color: "#888", fontFamily: "'Noto Sans JP', sans-serif" }}>{salon.prefecture} {salon.city}</span>
                  </div>
                  <h3 className="text-base font-bold mb-2" style={{ fontFamily: "'Shippori Mincho', serif", color: "#1a1a1a" }}>{salon.name}</h3>
                  {salon.description && (
                    <p className="text-xs leading-relaxed mb-3" style={{ color: "#666", fontFamily: "'Noto Sans JP', sans-serif", lineHeight: "1.8" }}>
                      {salon.description.length > 60 ? salon.description.slice(0, 60) + "..." : salon.description}
                    </p>
                  )}
                  {salon.services && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {salon.services.split(",").map(s => s.trim()).filter(Boolean).map(s => (
                        <span key={s} className="text-xs px-2 py-0.5" style={{ backgroundColor: "#e8f0e5", color: "#5a7a52", fontFamily: "'Noto Sans JP', sans-serif" }}>
                          {serviceLabels[s] ?? s}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-3 mt-3">
                    {salon.phone && (
                      <a href={`tel:${salon.phone}`} className="flex items-center gap-1 text-xs" style={{ color: "#5a7a52", fontFamily: "'Noto Sans JP', sans-serif" }}>
                        <Phone size={12} />{salon.phone}
                      </a>
                    )}
                    {salon.websiteUrl && (
                      <a href={salon.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs" style={{ color: "#5a7a52", fontFamily: "'Noto Sans JP', sans-serif" }}>
                        <Globe size={12} />公式サイト
                      </a>
                    )}
                    {salon.snsUrl && (
                      <a href={salon.snsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs" style={{ color: "#5a7a52", fontFamily: "'Noto Sans JP', sans-serif" }}>
                        <Instagram size={12} />SNS
                      </a>
                    )}
                  </div>
                  {salon.address && (
                    <p className="flex items-start gap-1 text-xs mt-2" style={{ color: "#888", fontFamily: "'Noto Sans JP', sans-serif" }}>
                      <MapPin size={12} className="mt-0.5 flex-shrink-0" />{salon.address}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-sm mb-4" style={{ color: "#666", fontFamily: "'Noto Sans JP', sans-serif" }}>
            お近くに認定サロンがない場合は、認定パートナーとして参加をご検討ください。
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-8 py-3 text-sm font-medium transition-all duration-300"
            style={{ backgroundColor: "#5a7a52", color: "#ffffff", fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            パートナーになる
          </a>
        </div>
      </div>
    </section>
  );
}

// ========== ホームケアアプリ連携 ==========
function HomeCareAppSection() {
  const { ref, inView } = useInView();
  return (
    <section className="py-24" style={{ backgroundColor: "#0d1f0d" }} id="homecare">
      <div
        ref={ref}
        className="max-w-6xl mx-auto px-6 transition-all duration-700"
        style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)" }}
      >
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs tracking-[0.3em] mb-4 block font-medium" style={{ color: "#a8d5a2", fontFamily: "'Noto Sans JP', sans-serif" }}>HOME CARE SUPPORT</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Shippori Mincho', serif", color: "#ffffff" }}>
              サロンだけでなく、<br />
              <span style={{ color: "#a8d5a2" }}>毎日のホームケアも</span><br />
              サポートできる。
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "rgba(255,255,255,0.75)", lineHeight: "1.9" }}>
              頭皮ケアは、サロンでの施術だけでは完結しません。<br />
              毎日のシャンプー・ブラッシング・食事など、生活習慣全体が頭皮の状態に影響します。<br />
              スカルプラボアプリを活用することで、サロンとお客様が一緒にホームケアを継続できます。
            </p>
            <ul className="space-y-4 mb-10">
              {[
                { icon: "📊", title: "頭皮チェックデータの共有", desc: "サロンで撮影した頭皮画像をアプリで共有。お客様が自宅で状態を確認できます。" },
                { icon: "🌿", title: "パーソナライズドホームケア提案", desc: "頭皮の状態に合わせたシャンプー・トリートメントをアプリから提案できます。" },
                { icon: "🔔", title: "定期チェックのリマインド", desc: "次回の頭皮チェック時期を自動通知。定期来店を無理なく継続させます。" },
                { icon: "📝", title: "生活習慣ログの記録", desc: "食事・睡眠・ストレスなど、頭皮に影響する生活習慣を記録。チェック時の小話に活用できます。" },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <p className="text-sm font-bold mb-1" style={{ color: "#ffffff", fontFamily: "'Noto Sans JP', sans-serif" }}>{item.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.65)", fontFamily: "'Noto Sans JP', sans-serif", lineHeight: "1.8" }}>{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="p-5" style={{ backgroundColor: "rgba(90,122,82,0.2)", borderLeft: "3px solid #5a7a52" }}>
              <p className="text-sm font-bold mb-1" style={{ color: "#a8d5a2", fontFamily: "'Noto Sans JP', sans-serif" }}>💡 サロンとお客様の絆が深まる</p>
              <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.75)", fontFamily: "'Noto Sans JP', sans-serif", lineHeight: "1.8" }}>
                ホームケアのサポートができるサロンは、単なる施術提供者ではなく、「頭皮ケアのパートナー」として信頼されます。継続率・定期来店率の向上に直結します。
              </p>
            </div>
          </div>
          {/* アプリスクリーンショット */}
          <div className="flex justify-center items-start gap-5" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
            <div style={{ width: '47%', marginTop: '0' }}>
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/app_screen_log_78a5d0f2.png"
                alt="頭皮チェック記録 アプリ画面"
                className="w-full object-contain rounded-2xl"
                style={{ boxShadow: '0 12px 48px rgba(0,0,0,0.55)' }}
              />
              <p className="text-center text-xs mt-3" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Noto Sans JP', sans-serif", letterSpacing: '0.05em' }}>頭皮チェック記録</p>
            </div>
            <div style={{ width: '47%', marginTop: '60px' }}>
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/app_screen_advice_1bc0e66a.png"
                alt="ホームケアアドバイス アプリ画面"
                className="w-full object-contain rounded-2xl"
                style={{ boxShadow: '0 12px 48px rgba(0,0,0,0.55)' }}
              />
              <p className="text-center text-xs mt-3" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Noto Sans JP', sans-serif", letterSpacing: '0.05em' }}>ホームケアアドバイス</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
// ========== 6つの特徴 ==========
function SixFeatures() {
  const { ref, inView } = useInView();
  const features = [
    {
      number: "01",
      title: "ブルーオーシャン市場",
      subtitle: "Blue Ocean",
      desc: "頭皮の定期チェックを専門に提供するサロンは、まだほとんど存在しません。競合のいない新市場で、先行者優位を確立できます。",
      accent: "#4a7c59",
    },
    {
      number: "02",
      title: "定期チェック習慣化",
      subtitle: "Repeat Business",
      desc: "歯の定期検診と同じように、頭皮チェックを3ヶ月ごとの習慣に。一度定着すれば、安定したリピート収益が生まれます。",
      accent: "#4a7c59",
    },
    {
      number: "03",
      title: "予防型ヘルスケア",
      subtitle: "Preventive Healthcare",
      desc: "薄毛になってから悩むのではなく、なる前に守る。医療でも治療でもない、新しい予防ケアの領域を一緒に切り開きます。",
      accent: "#4a7c59",
    },
    {
      number: "04",
      title: "美容サービスとの融合",
      subtitle: "Beauty Service",
      desc: "エステ・美容室・ヘッドスパなど、既存の美容サービスに頭皮チェックを加えるだけ。大きな設備投資なしに新メニューとして導入できます。",
      accent: "#4a7c59",
    },
    {
      number: "05",
      title: "オーガニックハーブケア",
      subtitle: "Organic Herb Care",
      desc: "植物由来の成分ではなく、植物そのもの。THE HERBSが独自開発したハーブスチーマーによる本物のボタニカルケアを提供します。",
      accent: "#4a7c59",
    },
    {
      number: "06",
      title: "ケミカルフリー",
      subtitle: "Chemical Free",
      desc: "合成界面活性剤・シリコン・パラベン不使用。頭皮に優しい処方で、敏感肌のお客様にも安心して提供できるラインナップです。",
      accent: "#4a7c59",
    },
  ];
  return (
    <section className="py-24" style={{ backgroundColor: "#f8f5f0" }}>
      <div
        ref={ref}
        className="max-w-6xl mx-auto px-6 transition-all duration-700"
        style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)" }}
      >
        {/* ヘッダー */}
        <div className="text-center mb-16">
          <span className="text-xs tracking-[0.3em] mb-4 block font-medium" style={{ color: "#4a7c59", fontFamily: "'Noto Sans JP', sans-serif" }}>6 FEATURES</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight" style={{ fontFamily: "'Shippori Mincho', serif", color: "#1a1a1a" }}>
            髪のプロは美容師、<br />
            <span style={{ color: "#4a7c59" }}>頭皮のプロ</span>を目指しませんか
          </h2>
          <p className="text-sm leading-relaxed max-w-xl mx-auto" style={{ color: "#555", fontFamily: "'Noto Sans JP', sans-serif", lineHeight: "1.9" }}>
            THE HERBS SCALP LABが提案する新しい事業展開。6つの特徴が、あなたのサロンを差別化します。
          </p>
        </div>
        {/* 6つのカード */}
        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.number}
              className="p-8"
              style={{ backgroundColor: "#ffffff", borderTop: `3px solid ${f.accent}` }}
            >
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-4xl font-bold" style={{ color: "rgba(74,124,89,0.15)", fontFamily: "'Cormorant Garamond', serif", lineHeight: 1 }}>{f.number}</span>
                <span className="text-xs tracking-widest font-medium" style={{ color: f.accent, fontFamily: "'Noto Sans JP', sans-serif" }}>{f.subtitle}</span>
              </div>
              <h3 className="text-lg font-bold mb-3" style={{ fontFamily: "'Shippori Mincho', serif", color: "#1a1a1a" }}>{f.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "#666", fontFamily: "'Noto Sans JP', sans-serif", lineHeight: "1.9" }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========== 新規募集告知バナー ==========
function RecruitmentBanner() {
  const { ref, inView } = useInView();
  // カウントダウン
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    const target = new Date("2026-06-12T00:00:00+09:00").getTime();
    const tick = () => {
      const now = Date.now();
      const diff = target - now;
      if (diff <= 0) { setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return; }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <section
      ref={ref}
      className="py-20 transition-all duration-700"
      style={{
        background: "linear-gradient(135deg, #0d2818 0%, #1a4a2e 50%, #0d2818 100%)",
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
      }}
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        <span className="text-xs tracking-[0.3em] mb-4 block font-medium" style={{ color: "#a8d5a2", fontFamily: "'Noto Sans JP', sans-serif" }}>NEW PARTNER RECRUITMENT</span>
        <h2 className="text-3xl md:text-4xl font-bold mb-3 leading-tight" style={{ fontFamily: "'Shippori Mincho', serif", color: "#ffffff" }}>
          新規パートナー募集スタート
        </h2>
        <p className="text-5xl md:text-6xl font-bold mb-8" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#c9a84c", letterSpacing: "0.05em" }}>
          2026.06.12
        </p>
        {/* カウントダウン */}
        <div className="flex justify-center gap-6 mb-10">
          {[
            { value: timeLeft.days, label: "DAYS" },
            { value: timeLeft.hours, label: "HOURS" },
            { value: timeLeft.minutes, label: "MIN" },
            { value: timeLeft.seconds, label: "SEC" },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div
                className="w-16 h-16 md:w-20 md:h-20 flex items-center justify-center mb-2"
                style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(201,168,76,0.3)" }}
              >
                <span className="text-2xl md:text-3xl font-bold" style={{ color: "#ffffff", fontFamily: "'Cormorant Garamond', serif" }}>
                  {String(item.value).padStart(2, "0")}
                </span>
              </div>
              <span className="text-xs tracking-widest" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Noto Sans JP', sans-serif" }}>{item.label}</span>
            </div>
          ))}
        </div>
        <p className="text-sm mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,0.75)", fontFamily: "'Noto Sans JP', sans-serif", lineHeight: "1.9" }}>
          先行登録いただいた方には、認定プログラムの詳細資料・収益シミュレーション・<br className="hidden md:block" />
          初回導入特典を優先的にご案内いたします。
        </p>
        <a
          href={LINE_SALON.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-10 py-4 font-bold text-sm"
          style={{
            backgroundColor: "#06C755",
            color: "#ffffff",
            fontFamily: "'Noto Sans JP', sans-serif",
            letterSpacing: "0.05em",
          }}
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.627-.63.349 0 .631.285.631.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.281.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/></svg>
          LINEで先行登録する（無料）
        </a>
        <p className="text-xs mt-4" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Noto Sans JP', sans-serif" }}>※ 登録後、詳細資料を順次お送りします</p>
      </div>
    </section>
  );
}

// ========== CTA ==========
function Cta() {
  const { ref, inView } = useInView();

  return (
    <section className="py-24 text-center" style={{ backgroundColor: "#5a7a52" }} id="contact">
      <div
        ref={ref}
        className="max-w-3xl mx-auto px-6 transition-all duration-700"
        style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)" }}
      >
        <span className="text-xs tracking-[0.4em] uppercase block mb-6 font-medium" style={{ color: "#a8d5a2" }}>
          Let's Start Together
        </span>
        <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "'Shippori Mincho', serif", color: "#ffffff" }}>
          まずは、お話を聞かせてください。
        </h2>
        <p className="text-base leading-relaxed mb-10" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "rgba(255,255,255,0.8)", lineHeight: "1.9" }}>
          「うちのサロンでできるかな？」「どんな機器が必要？」<br />
          どんな小さな疑問でも、LINEで気軽にご相談ください。<br />
          一緒に、頭皮と髪の悩みを抱える方の力になりましょう。
        </p>
        <a
          href={LINE_SALON.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 px-10 py-5 font-bold text-base tracking-wider transition-all duration-300"
          style={{ backgroundColor: "#06C755", color: "#ffffff", fontFamily: "'Noto Sans JP', sans-serif" }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#05a847")}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#06C755")}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.02 2 11c0 3.07 1.58 5.8 4.04 7.54L5.5 22l4.14-2.16C10.39 20.27 11.18 20.4 12 20.4c5.52 0 10-4.02 10-9S17.52 2 12 2z"/>
          </svg>
          LINEで資料を受け取る（無料）
        </a>
        <p className="mt-4 text-sm" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Noto Sans JP', sans-serif" }}>
          {LINE_SALON.account} ／ 登録後すぐに資料をお送りします
        </p>
      </div>
    </section>
  );
}

// ========== FOOTER ==========
function Footer() {
  return (
    <footer className="py-8 text-center" style={{ backgroundColor: "#1a1a1a" }}>
      <div className="flex items-center justify-center mb-3">
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/logo_olive_12a41c11.webp"
          alt="THE HERBS SCALP LABO"
          className="w-auto object-contain"
          style={{ height: "56px", filter: "brightness(0) invert(1)", opacity: 0.7 }}
        />
      </div>
      {/* 運営会社情報 */}
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
            <span key={item.label} className="text-[11px]" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "'Noto Sans JP', sans-serif" }}>{item.label}</span>
          )
        )}
      </div>
      <p className="text-[10px] mb-3" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Noto Sans JP', sans-serif" }}>設立：昭和61年4月24日｜化粧品製造業・化粧品製造販売業｜直営店：神戸阪急本館６階 / THE HERBS植物美容サロン / 植物美容学校</p>
      <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Noto Sans JP', sans-serif" }}>
        © 2026 THE HERBS SCALP LABO. All rights reserved.
      </p>
      <div className="mt-3 flex justify-center gap-6">
        <a href="/" className="text-xs transition-colors" style={{ color: "rgba(255,255,255,0.4)" }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>
          一般の方はこちら（レディース）
        </a>
        <a href="/men" className="text-xs transition-colors" style={{ color: "rgba(255,255,255,0.4)" }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.8)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}>
          一般の方はこちら（メンズ）
        </a>
      </div>
    </footer>
  );
}

// ========== MAIN ==========
export default function SalonPartner() {
  useEffect(() => {
    document.title = "サロンパートナー募集 | THE HERBS SCALP LABO";
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.name = name; document.head.appendChild(el); }
      el.content = content;
    };
    setMeta("description", "頭皮ケアのブルーオーシャン市場へ。予防型ヘルスケア×習慣化事業として、THE HERBS SCALP LAB認定パートナーを募集。収益の仕組みはLINE登録後に無料でお届けします。");
    setMeta("keywords", "頭皮ケア 副業,エステサロン 新メニュー,美容師 副業,ヘッドスパ 開業,THE HERBS SCALP LABO 認定サロン,ブルーオーシャン 美容");
  }, []);

  return (
    <div style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
      <Nav />
      <Hero />
      <BlueOcean />
      <Concept />
      <WhatWeDo />
      <LineCtaSection />
      <WhoCanJoin />
      <ProgramSteps />
      <Faq />
      <CertifiedSalonSection />
       <SixFeatures />
      <RecruitmentBanner />
      <HomeCareAppSection />
      <Cta />
      <Footer />
    </div>
  );
}
