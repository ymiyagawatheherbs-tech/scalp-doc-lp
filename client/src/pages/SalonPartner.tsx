/**
 * SalonPartner.tsx
 * Design: Clean Professional — ホワイト×ディープグリーン×ゴールド
 * Philosophy: 「ブルーオーシャン×予防型ヘルスケア×習慣化事業」の訴求 → LINE登録への誘導
 * 収益の詳細はLINE登録後に配布する資料に掲載
 * Layout: 縦スクロール型ストーリーテリング構造
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Menu, X } from "lucide-react";

const IMAGES = {
  interior: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/salon_interior_c8f3f7a4.jpg",
  steamer: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/salon_steamer_treatment_ae0eacff.jpg",
  scalpCheck: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/salon_scalp_check_ae329437.jpg",
};

const LINE_SALON = {
  url: "https://lin.ee/oVzqlI7",
  account: "@723lsjqi",
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
              alt="SCALP LABO"
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
                className="font-sans-jp font-bold tracking-widest transition-colors"
                style={{ fontSize: "0.75rem", letterSpacing: "0.18em", color: scrolled ? "oklch(0.35 0.050 130)" : "rgba(255,255,255,0.95)" }}
              >
                スカルプラボ
              </span>
              <span
                className="font-cormorant transition-colors"
                style={{ fontSize: "0.6rem", letterSpacing: "0.2em", color: scrolled ? "oklch(0.48 0.08 140)" : "rgba(255,255,255,0.45)" }}
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
            Scalp Labo Partner Program
          </span>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight" style={{ fontFamily: "'Shippori Mincho', serif", color: "#1a1a1a" }}>
            髪と頭皮の悩みを、<br />
            <span style={{ color: "#5a7a52" }}>一緒に解決しませんか。</span>
          </h1>
          <p className="text-base leading-relaxed mb-4" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#444", lineHeight: "1.9" }}>
            薄毛・抜け毛・うねり・頭皮トラブル。<br />
            悩みを抱えながらも、どこに相談すればいいかわからない方が大勢います。<br />
            THE HERBS SCALP LABは、そうした方々の「受け皿」をサロンと一緒につくります。
          </p>
          <p className="text-sm leading-relaxed mb-10" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#888" }}>
            エステサロン・美容師・ヘッドスパ店など、業種を問わず参加できます。
          </p>
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
            しかし「頭皮の定期チェック」を専門に提供するサロンは、まだほとんど存在しません。
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
              accent: "「なってから治す」から「なる前に守る」へ",
            },
            {
              num: "02",
              title: "美容サービスとして",
              body: "頭皮は顔や体と同じ「皮膚」です。スキンケアと同じ感覚で、植物由来のボタニカルミストによる頭皮ケアを日常に取り入れる文化を育てます。",
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
      img: IMAGES.scalpCheck,
      step: "STEP 01",
      title: "頭皮チェックで「見える化」する",
      body: "マイクロスコープで頭皮の状態を記録・分析。お客様が自分の頭皮を初めて「見る」体験が、ケアへの動機づけになります。データは時系列で蓄積され、変化を実感できます。",
      note: "所要時間：約5〜10分 / 初回無料で提供可能",
    },
    {
      img: IMAGES.steamer,
      step: "STEP 02",
      title: "ボタニカルミストで頭皮を整える",
      body: "THE HERBSが開発したハーブスチーマーで、植物成分そのものを蒸気で頭皮に届けます。カラー・パーマ後の薬剤除去にも対応。チェックで見つかった課題に合わせたケアを提供します。",
      note: "既存メニューへの追加・単品提供どちらも可能",
    },
    {
      img: IMAGES.interior,
      step: "STEP 03",
      title: "定期来店の仕組みをつくる",
      body: "「歯の定期検診」のように、頭皮チェックを定期的に受ける習慣を一緒に育てます。定期来店が定着することで、安定した売上と深い信頼関係が生まれます。",
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
              "THE HERBS製品の卸価格・マージン",
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
              body: "大きな初期投資なしに始められる頭皮ケアメニューとして。THE HERBS SCALP LABの認定を取得することで、専門性を持った差別化が図れます。",
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

        <div className="space-y-6">
          {[
            {
              num: "01",
              title: "LINEで資料を受け取る",
              body: "まずはサロン向けLINEに登録。収益モデル・導入事例・認定プログラムの詳細資料を無料でお届けします。勧誘・営業は一切ありません。",
              time: "すぐに受け取れます",
            },
            {
              num: "02",
              title: "オンライン説明会への参加",
              body: "THE HERBS SCALP LABのコンセプト・認定プログラムの内容・収益モデルについて詳しくご説明します。質問も自由にどうぞ。",
              time: "約60分",
            },
            {
              num: "03",
              title: "技術講習会への参加",
              body: "頭皮チェックの手順・ボタニカルミストの使い方・お客様へのカウンセリング方法を実習形式で学びます。THE HERBSの専門スタッフが直接指導します。",
              time: "1日〜2日",
            },
            {
              num: "04",
              title: "認定サロンとして登録",
              body: "認定後はTHE HERBS SCALP LABの公式サロンリストに掲載されます。THE HERBS製品の卸販売権・販促ツールの提供・継続サポートを受けられます。",
              time: "認定後すぐ",
            },
          ].map((step, i) => (
            <div
              key={i}
              className="flex gap-6 items-start transition-all duration-700"
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateX(0)" : "translateX(-30px)",
                transitionDelay: `${i * 150}ms`,
              }}
            >
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
                <p className="text-sm leading-relaxed" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#555", lineHeight: "1.8" }}>
                  {step.body}
                </p>
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

// ========== APP SECTION ==========
function AppSection() {
  return (
    <section className="py-24 border-t border-[#5a7a52]/20" style={{ backgroundColor: "#0a1628" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <p className="text-xs tracking-[0.3em] mb-4" style={{ color: "#a8d5a2", fontFamily: "'Noto Sans JP', sans-serif" }}>SCALP LABO APP</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Shippori Mincho', serif", color: "#ffffff" }}>
              チェックデータを、<br />
              <span style={{ color: "#a8d5a2" }}>アプリで管理・共有。</span>
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "rgba(255,255,255,0.75)", lineHeight: "1.9" }}>
              THE HERBS SCALP LABアプリでクライアントの頭皮画像・症状・生活習慣を記録・管理。<br />
              定期チェックのデータを共有し、<br />
              パーソナルケアの提案と定期来店を促進します。
            </p>
            <ul className="space-y-3 mb-10">
              {[
                "クライアントの頭皮画像・データ管理",
                "症状・生活習慣のログ記録",
                "サロンとのデータ共有機能",
                "定期チェックのリマインド機能",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "rgba(255,255,255,0.85)" }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#5a7a52", fontSize: "10px", color: "#ffffff", fontWeight: 700 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            {/* Store Buttons */}
            <div className="flex flex-wrap gap-4">
              <a
                href="#"
                onClick={e => { e.preventDefault(); alert("App Store公開準備中です。しばらくお待ちください。"); }}
                className="flex items-center gap-3 px-5 py-3 rounded-xl border border-white/20 hover:border-[#a8d5a2]/60 transition-colors"
                style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              >
                <svg viewBox="0 0 24 24" className="w-7 h-7" fill="white"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                <div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Noto Sans JP', sans-serif" }}>Download on the</div>
                  <div className="text-sm font-semibold" style={{ color: "#ffffff", fontFamily: "'Noto Sans JP', sans-serif" }}>App Store</div>
                </div>
              </a>
              <a
                href="#"
                onClick={e => { e.preventDefault(); alert("Google Play公開準備中です。しばらくお待ちください。"); }}
                className="flex items-center gap-3 px-5 py-3 rounded-xl border border-white/20 hover:border-[#a8d5a2]/60 transition-colors"
                style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
              >
                <svg viewBox="0 0 24 24" className="w-7 h-7" fill="white"><path d="M3.18 23.76c.3.17.64.24.99.2l12.6-7.27-2.72-2.72-10.87 9.79zm-1.7-20.4C1.18 3.7 1 4.08 1 4.56v14.88c0 .48.18.86.48 1.2l.07.06 8.34-8.34v-.2L1.55 3.82l-.07.06-.07.06zM20.49 10.7l-2.81-1.62-3.06 3.06 3.06 3.06 2.83-1.63c.81-.46.81-1.22-.02-1.87zm-18.3 12.3l.07-.06 9.4-9.4-2.72-2.72-6.75 12.18z"/></svg>
                <div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Noto Sans JP', sans-serif" }}>GET IT ON</div>
                  <div className="text-sm font-semibold" style={{ color: "#ffffff", fontFamily: "'Noto Sans JP', sans-serif" }}>Google Play</div>
                </div>
              </a>
            </div>
          </div>
          {/* Mockup Image */}
          <div className="flex justify-center">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/app-mockup-hero-aPvm7rmSN3wqZSXwseC4wS.png"
              alt="THE HERBS SCALP LABアプリ モックアップ"
              className="w-full max-w-lg object-contain"
            />
          </div>
        </div>
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
          alt="SCALP LABO"
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
        © 2025 SCALP LABO / THE HERBS. All rights reserved.
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
      <AppSection />
      <Cta />
      <Footer />
    </div>
  );
}
