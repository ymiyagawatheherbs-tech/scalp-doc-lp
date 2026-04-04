/**
 * SalonPartner.tsx
 * Design: Clean Professional — ホワイト×ディープグリーン×ゴールド
 * Philosophy: 「頭皮・髪の悩みを持つ方のサポートを一緒に」→ 自然な収益化
 * Layout: 縦スクロール型ストーリーテリング構造
 */

import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";

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
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        backgroundColor: scrolled ? "rgba(248,246,242,0.97)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #e0e0e0" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-7 h-7 flex items-center justify-center" style={{ backgroundColor: "#2d5a27" }}>
              <span className="text-white text-xs font-bold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>S</span>
            </div>
            <div>
              <div className="text-sm font-bold leading-tight tracking-widest" style={{ fontFamily: "'Shippori Mincho', serif", color: scrolled ? "#1a1a1a" : "#ffffff" }}>
                スカルプラボ
              </div>
              <div className="text-[9px] tracking-widest uppercase leading-none" style={{ color: "#2d5a27" }}>
                Salon Partner
              </div>
            </div>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {!scrolled && (
            <div className="hidden md:flex items-center gap-1.5">
              <span className="text-[9px] tracking-[0.2em] uppercase" style={{ color: "rgba(255,255,255,0.5)" }}>presented by</span>
              <img src={HERBS_LOGO} alt="THE HERBS" className="h-3.5 w-auto brightness-0 invert opacity-70" />
            </div>
          )}
          <Link href="/">
            <span className="hidden md:inline text-xs cursor-pointer" style={{ color: scrolled ? "#555" : "rgba(255,255,255,0.7)", fontFamily: "'Noto Sans JP', sans-serif" }}>
              ← 一般向けページへ
            </span>
          </Link>
          <a
            href={LINE_SALON.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold px-4 py-2 transition-all"
            style={{ backgroundColor: "#06C755", color: "#ffffff", fontFamily: "'Noto Sans JP', sans-serif" }}
          >
            LINEで相談
          </a>
        </div>
      </div>
    </nav>
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
          alt="スカルプラボ認定サロン"
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
          <span className="text-xs tracking-[0.4em] uppercase block mb-6 font-medium" style={{ color: "#2d5a27" }}>
            Scalp Labo Partner Program
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight" style={{ fontFamily: "'Shippori Mincho', serif", color: "#1a1a1a" }}>
            髪と頭皮の悩みを、<br />
            <span style={{ color: "#2d5a27" }}>一緒に解決しませんか。</span>
          </h1>
          <p className="text-base leading-relaxed mb-4" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#444", lineHeight: "1.9" }}>
            薄毛・抜け毛・うねり・頭皮トラブル。<br />
            悩みを抱えながらも、どこに相談すればいいかわからない方が大勢います。<br />
            スカルプラボは、そうした方々の「受け皿」をサロンと一緒につくります。
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
              LINEで詳しく聞く
            </a>
            <a
              href="#program"
              className="inline-flex items-center justify-center px-8 py-4 font-bold text-sm tracking-wider transition-all duration-300 border-2"
              style={{ borderColor: "#2d5a27", color: "#2d5a27", fontFamily: "'Noto Sans JP', sans-serif", backgroundColor: "transparent" }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#2d5a27"; e.currentTarget.style.color = "#ffffff"; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#2d5a27"; }}
            >
              プログラムを見る
            </a>
          </div>
          <p className="mt-4 text-xs" style={{ color: "#aaa", fontFamily: "'Noto Sans JP', sans-serif" }}>
            {LINE_SALON.account}
          </p>
        </div>
      </div>
    </section>
  );
}

// ========== MISSION ==========
function Mission() {
  const { ref, inView } = useInView();

  return (
    <section className="py-24" style={{ backgroundColor: "#ffffff" }}>
      <div ref={ref} className="max-w-6xl mx-auto px-6">
        <div
          className="text-center mb-16 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)" }}
        >
          <span className="text-xs tracking-[0.4em] uppercase block mb-4 font-medium" style={{ color: "#2d5a27" }}>
            The Problem We Solve Together
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "'Shippori Mincho', serif", color: "#1a1a1a" }}>
            「相談できる場所がない」という現実
          </h2>
          <p className="text-base max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#555", lineHeight: "1.9" }}>
            薄毛・抜け毛・うねりで悩む方の多くは、皮膚科に行くほどではないと感じ、
            美容室では「スタイリングの話」しかできないと思い込んでいます。
            その「空白地帯」に、スカルプラボは存在します。
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              num: "01",
              title: "悩んでいるが相談できない",
              body: "薄毛・抜け毛・頭皮トラブルを抱えながら、どこに相談すればいいかわからない方が増えています。",
            },
            {
              num: "02",
              title: "原因が見えていない",
              body: "マイクロスコープによる頭皮チェックを受けたことがない方がほとんど。問題の「見える化」が最初の一歩です。",
            },
            {
              num: "03",
              title: "専門家とつながれていない",
              body: "適切なケアを提供できるサロンが近くにあっても、出会う機会がありません。スカルプラボがその橋渡しをします。",
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
              <span className="text-3xl font-bold block mb-4" style={{ fontFamily: "'Cormorant Garamond', serif", color: "#2d5a27" }}>{item.num}</span>
              <h3 className="text-base font-bold mb-3" style={{ fontFamily: "'Shippori Mincho', serif", color: "#1a1a1a" }}>
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#666", lineHeight: "1.8" }}>
                {item.body}
              </p>
            </div>
          ))}
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
          <span className="text-xs tracking-[0.4em] uppercase block mb-4 font-medium" style={{ color: "#2d5a27" }}>
            What We Do Together
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "'Shippori Mincho', serif", color: "#1a1a1a" }}>
            一緒にできること
          </h2>
          <p className="text-base max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#555", lineHeight: "1.9" }}>
            スカルプラボは「技術を売る」のではなく、「悩みを持つ方のサポート体制」をサロンと共に構築します。
            収益は、その結果として自然についてきます。
          </p>
        </div>

        <div className="space-y-20">
          {steps.map((step, i) => (
            <div
              key={i}
              className={`flex flex-col ${i % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12 items-center transition-all duration-700`}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(40px)",
                transitionDelay: `${i * 200}ms`,
              }}
            >
              <div className="w-full lg:w-1/2 flex-shrink-0">
                <div className="relative overflow-hidden">
                  <img
                    src={step.img}
                    alt={step.title}
                    className="w-full object-cover"
                    style={{ height: "360px", objectPosition: "center center" }}
                  />
                  <div
                    className="absolute top-4 left-4 px-4 py-2 text-xs font-bold tracking-widest"
                    style={{ backgroundColor: "#2d5a27", color: "#ffffff", fontFamily: "'Noto Sans JP', sans-serif" }}
                  >
                    {step.step}
                  </div>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-2xl md:text-3xl font-bold mb-4" style={{ fontFamily: "'Shippori Mincho', serif", color: "#1a1a1a" }}>
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed mb-4" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "#555", lineHeight: "1.9" }}>
                  {step.body}
                </p>
                <p className="text-xs px-4 py-2 inline-block" style={{ backgroundColor: "#e8f5e3", color: "#2d5a27", fontFamily: "'Noto Sans JP', sans-serif" }}>
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

// ========== REVENUE MODEL ==========
function Revenue() {
  const { ref, inView } = useInView();

  return (
    <section className="py-24" style={{ backgroundColor: "#1a2e1a" }}>
      <div ref={ref} className="max-w-6xl mx-auto px-6">
        <div
          className="text-center mb-16 transition-all duration-700"
          style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(30px)" }}
        >
          <span className="text-xs tracking-[0.4em] uppercase block mb-4 font-medium" style={{ color: "#a8d5a2" }}>
            Revenue Flow
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "'Shippori Mincho', serif", color: "#ffffff" }}>
            サポートが、収益になる仕組み
          </h2>
          <p className="text-base max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "rgba(255,255,255,0.75)", lineHeight: "1.9" }}>
            「売る」のではなく「寄り添う」ことで、お客様との長期的な関係が生まれます。
            その関係が、安定した収益基盤になります。
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
          {[
            {
              phase: "Phase 1",
              title: "頭皮チェック",
              sub: "初回無料 → 定期有料",
              body: "初回は無料で提供し、まず「見える化」を体験してもらいます。データが蓄積されるほど、定期受診の価値が高まります。",
              revenue: "定期チェック料",
            },
            {
              phase: "Phase 2",
              title: "ケアメニュー",
              sub: "課題に合わせた施術",
              body: "チェックで見つかった課題に対して、ボタニカルミスト・ゴマージュ・頭皮ケアメニューを提案。必要な方に必要なケアを。",
              revenue: "施術料・製品販売",
            },
            {
              phase: "Phase 3",
              title: "定期コース",
              sub: "3ヶ月・6ヶ月プラン",
              body: "定期チェック＋ケアをセットにしたコースで、継続来店を促します。歯医者の定期検診と同じ「習慣化」モデルです。",
              revenue: "コース料金（安定収益）",
            },
            {
              phase: "Phase 4",
              title: "製品販売",
              sub: "THE HERBS製品の卸",
              body: "認定サロンにはTHE HERBS製品の卸販売権が得られます。お客様のホームケアをサポートしながら、物販収益に繋げます。",
              revenue: "製品卸・物販",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-8 transition-all duration-700"
              style={{
                backgroundColor: "#243824",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(30px)",
                transitionDelay: `${i * 150}ms`,
              }}
            >
              <span className="text-xs tracking-widest block mb-2" style={{ color: "#a8d5a2", fontFamily: "'Noto Sans JP', sans-serif" }}>{item.phase}</span>
              <h3 className="text-lg font-bold mb-1" style={{ fontFamily: "'Shippori Mincho', serif", color: "#ffffff" }}>
                {item.title}
              </h3>
              <p className="text-xs mb-4" style={{ color: "#a8d5a2", fontFamily: "'Noto Sans JP', sans-serif" }}>{item.sub}</p>
              <p className="text-xs leading-relaxed mb-6" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "rgba(255,255,255,0.7)", lineHeight: "1.8" }}>
                {item.body}
              </p>
              <div className="pt-4" style={{ borderTop: "1px solid rgba(168,213,162,0.3)" }}>
                <span className="text-xs font-bold" style={{ color: "#a8d5a2", fontFamily: "'Noto Sans JP', sans-serif" }}>収益源：{item.revenue}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 収益シミュレーション */}
        <div
          className="mt-16 p-8 transition-all duration-700"
          style={{
            backgroundColor: "#2d5a27",
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(30px)",
            transitionDelay: "600ms",
          }}
        >
          <h3 className="text-xl font-bold mb-6 text-center" style={{ fontFamily: "'Shippori Mincho', serif", color: "#ffffff" }}>
            収益シミュレーション（月間）
          </h3>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            {[
              { label: "定期チェック", value: "月10名", sub: "¥5,000 × 10 = ¥50,000" },
              { label: "ケアメニュー", value: "月6名", sub: "¥8,000 × 6 = ¥48,000" },
              { label: "製品販売", value: "月4名", sub: "¥6,000 × 4 = ¥24,000" },
            ].map((sim, i) => (
              <div key={i}>
                <p className="text-xs mb-1" style={{ color: "rgba(255,255,255,0.7)", fontFamily: "'Noto Sans JP', sans-serif" }}>{sim.label}</p>
                <p className="text-2xl font-bold mb-1" style={{ fontFamily: "'Shippori Mincho', serif", color: "#ffffff" }}>{sim.value}</p>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Noto Sans JP', sans-serif" }}>{sim.sub}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 text-center" style={{ borderTop: "1px solid rgba(255,255,255,0.2)" }}>
            <p className="text-2xl font-bold" style={{ fontFamily: "'Shippori Mincho', serif", color: "#ffffff" }}>
              合計：月間 <span style={{ color: "#a8d5a2" }}>¥122,000〜</span> の追加収益
            </p>
            <p className="text-xs mt-2" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Noto Sans JP', sans-serif" }}>
              ※あくまでも一例です。実際の収益は施術内容・単価・来店数により異なります。
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
          <span className="text-xs tracking-[0.4em] uppercase block mb-4 font-medium" style={{ color: "#2d5a27" }}>
            Who Can Join
          </span>
          <h2 className="text-3xl md:text-4xl font-bold" style={{ fontFamily: "'Shippori Mincho', serif", color: "#1a1a1a" }}>
            こんな方と一緒に取り組みたい
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
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
              body: "大きな初期投資なしに始められる頭皮ケアメニューとして。スカルプラボの認定を取得することで、専門性を持った差別化が図れます。",
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
                  <span className="text-xs px-2 py-0.5" style={{ backgroundColor: "#e8f5e3", color: "#2d5a27", fontFamily: "'Noto Sans JP', sans-serif" }}>
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
          <span className="text-xs tracking-[0.4em] uppercase block mb-4 font-medium" style={{ color: "#2d5a27" }}>
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
              title: "LINEで無料相談",
              body: "まずはサロン向けLINEから気軽にご連絡ください。現在の状況・ご興味のある内容をお聞きし、最適なプランをご提案します。",
              time: "いつでも",
            },
            {
              num: "02",
              title: "オンライン説明会への参加",
              body: "スカルプラボのコンセプト・認定プログラムの内容・収益モデルについて詳しくご説明します。質問も自由にどうぞ。",
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
              body: "認定後はスカルプラボの公式サロンリストに掲載されます。THE HERBS製品の卸販売権・販促ツールの提供・継続サポートを受けられます。",
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
                style={{ backgroundColor: "#2d5a27", color: "#ffffff", fontFamily: "'Cormorant Garamond', serif" }}
              >
                {step.num}
              </div>
              <div className="flex-1 pb-6" style={{ borderBottom: i < 3 ? "1px solid #e0e0e0" : "none" }}>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-lg" style={{ fontFamily: "'Shippori Mincho', serif", color: "#1a1a1a" }}>
                    {step.title}
                  </h3>
                  <span className="text-xs px-2 py-0.5" style={{ backgroundColor: "#e8f5e3", color: "#2d5a27", fontFamily: "'Noto Sans JP', sans-serif" }}>
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
      a: "はい。スカルプラボのメニューは、既存のカラー・パーマ・フェイシャルなどと組み合わせて提供できます。「カラー後の頭皮ケア」として追加するだけでも十分な価値になります。",
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
          <span className="text-xs tracking-[0.4em] uppercase block mb-4 font-medium" style={{ color: "#2d5a27" }}>
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
                  style={{ transform: open === i ? "rotate(45deg)" : "rotate(0deg)", color: "#2d5a27" }}
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

// ========== CTA ==========
function Cta() {
  const { ref, inView } = useInView();

  return (
    <section className="py-24 text-center" style={{ backgroundColor: "#2d5a27" }} id="contact">
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
          LINEで無料相談する
        </a>
        <p className="mt-4 text-sm" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Noto Sans JP', sans-serif" }}>
          {LINE_SALON.account} ／ 返信まで1〜2営業日
        </p>
      </div>
    </section>
  );
}

// ========== FOOTER ==========
function Footer() {
  return (
    <footer className="py-8 text-center" style={{ backgroundColor: "#1a1a1a" }}>
      <div className="flex justify-center items-center gap-2 mb-3">
        <img src={HERBS_LOGO} alt="THE HERBS" className="h-4 w-auto brightness-0 invert opacity-50" />
      </div>
      <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Noto Sans JP', sans-serif" }}>
        © 2025 スカルプラボ by THE HERBS. All rights reserved.
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
    document.title = "サロンパートナー募集 | スカルプラボ by THE HERBS";
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement("meta"); el.name = name; document.head.appendChild(el); }
      el.content = content;
    };
    setMeta("description", "頭皮・髪の悩みを抱えるお客様のサポートを一緒に。エステサロン・美容師・ヘッドスパ店向けのスカルプラボ認定パートナープログラム。頭皮チェック・ボタニカルミストで新しい収益の柱を。");
    setMeta("keywords", "頭皮ケア 副業,エステサロン 新メニュー,美容師 副業,ヘッドスパ 開業,スカルプラボ 認定サロン");
  }, []);

  return (
    <div style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
      <Nav />
      <Hero />
      <Mission />
      <WhatWeDo />
      <Revenue />
      <WhoCanJoin />
      <ProgramSteps />
      <Faq />
      <Cta />
      <Footer />
    </div>
  );
}
