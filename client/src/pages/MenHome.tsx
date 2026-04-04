/**
 * スカルプラボ for Men — メンズ向けLP
 *
 * Design Philosophy: Dark Luxury（ダーク・ラグジュアリー）
 * - Color: Deep Navy #0D1B2A × Charcoal #1C2B3A × Gold #C9A84C
 * - Typography: Shippori Mincho (見出し) × Cormorant Garamond (英字装飾) × Noto Sans JP (本文)
 * - Layout: Full-screen dark sections, asymmetric right-text/left-visual
 * - Mood: High-end men's grooming brand (Aesop/Molton Brown level)
 * - Yakki-ho: 「診断」「治療」「改善」「予防」等の逸脱表現を使用しない
 */

import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Menu, X, ChevronDown, ChevronUp, Star, ArrowRight, Check } from "lucide-react";

// ========== NAVIGATION ==========
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      const el = document.documentElement;
      const scrollTop = window.scrollY;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const navLinks = [
    { label: "サービス", href: "#service" },
    { label: "お客様の声", href: "#testimonials" },
    { label: "よくある質問", href: "#faq" },
    { label: "ご予約", href: "#reservation" },
  ];

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Progress bar */}
      <div
        className="fixed top-0 left-0 h-0.5 z-[70] transition-all duration-100"
        style={{ width: `${progress}%`, background: "linear-gradient(90deg, #C9A84C, #E8C97A)" }}
      />
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "py-3 bg-[#0D1B2A]/95 backdrop-blur-md border-b border-[#C9A84C]/20 shadow-lg shadow-black/30" : "py-3 md:py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/men">
            <div className="flex flex-col cursor-pointer">
              <span className="font-['Cormorant_Garamond'] italic text-[#C9A84C] text-[10px] md:text-xs tracking-[0.3em] uppercase">Scalp Labo</span>
              <span className="text-white font-['Shippori_Mincho'] text-base md:text-lg leading-tight tracking-wider">for Men</span>
            </div>
          </Link>

          {/* THE HERBSロゴ — スマホ中央 */}
          <div className={`md:hidden flex items-center gap-1.5 transition-all duration-500 ${
            scrolled ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}>
            <span className="font-['Cormorant_Garamond'] text-white/30 text-[8px] tracking-[0.15em] uppercase">by</span>
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/theherbs_logo_395db853.webp"
              alt="THE HERBS"
              className="h-3 w-auto brightness-0 invert opacity-50"
            />
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {/* THE HERBSロゴ — デスクトップ */}
            <div className={`flex items-center gap-1.5 transition-all duration-500 ${
              scrolled ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}>
              <span className="font-['Cormorant_Garamond'] text-white/30 text-[9px] tracking-[0.2em] uppercase">presented by</span>
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/theherbs_logo_395db853.webp"
                alt="THE HERBS"
                className="h-3.5 w-auto brightness-0 invert opacity-60"
              />
            </div>
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-white/70 hover:text-[#C9A84C] text-sm tracking-wider transition-colors duration-200 font-['Noto_Sans_JP']"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* サロン向けリンク */}
            <Link
              href="/salon"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#C9A84C]/60 text-[#C9A84C]/80 text-xs tracking-wider hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-300 font-['Noto_Sans_JP']"
            >
              サロン向け
            </Link>
            {/* 女性版切り替えリンク */}
            <Link
              href="/"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/30 text-white/60 text-xs tracking-wider hover:border-white/70 hover:text-white/90 transition-all duration-300 font-['Noto_Sans_JP']"
            >
              <span className="text-[10px]">&#9792;</span>
              レディース版
            </Link>
            <button
              onClick={() => scrollTo("#reservation")}
              className="hidden md:block px-5 py-2 border border-[#C9A84C] text-[#C9A84C] text-sm tracking-wider hover:bg-[#C9A84C] hover:text-[#0D1B2A] transition-all duration-300 font-['Noto_Sans_JP']"
            >
              無料チェック予約
            </button>
            {/* スマホ用CTAボタン */}
            <button
              onClick={() => scrollTo("#reservation")}
              className="md:hidden px-3 py-1.5 border border-[#C9A84C] text-[#C9A84C] text-xs tracking-wider hover:bg-[#C9A84C] hover:text-[#0D1B2A] transition-all duration-300 font-['Noto_Sans_JP']"
            >
              今すぐ予約
            </button>
            <button
              className="md:hidden text-white p-1"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="メニュー"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0D1B2A] flex flex-col pt-24 px-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="py-5 text-left text-white/80 hover:text-[#C9A84C] text-xl font-['Shippori_Mincho'] border-b border-white/10 transition-colors"
            >
              {link.label}
            </button>
          ))}
          <Link
            href="/salon"
            className="mt-6 flex items-center justify-center gap-2 py-3 border border-[#C9A84C]/50 text-[#C9A84C] text-base tracking-wider hover:border-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all duration-300 font-['Noto_Sans_JP']"
            onClick={() => setMenuOpen(false)}
          >
            サロン・美容師の方へ
          </Link>
          <Link
            href="/"
            className="mt-3 flex items-center justify-center gap-2 py-3 border border-white/30 text-white/60 text-base tracking-wider hover:border-white/60 hover:text-white/80 transition-all duration-300 font-['Noto_Sans_JP']"
            onClick={() => setMenuOpen(false)}
          >
            <span>&#9792;</span>
            レディース版はこちら
          </Link>
          <button
            onClick={() => scrollTo("#reservation")}
            className="mt-3 py-4 border border-[#C9A84C] text-[#C9A84C] text-lg tracking-wider hover:bg-[#C9A84C] hover:text-[#0D1B2A] transition-all duration-300"
          >
            無料チェックを予約する
          </button>
        </div>
      )}
    </>
  );
}

// ========== COUNTER HOOK ==========
function useCounter(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

// ========== HERO ==========
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0D1B2A]">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/men-hero-main_cae2a01a.jpg"
          alt="スカルプラボ for Men"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D1B2A] via-[#0D1B2A]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A] via-transparent to-transparent" />
      </div>

      {/* Gold line decoration */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[#C9A84C] to-transparent opacity-60" />

      <div className="relative max-w-7xl mx-auto px-5 md:px-6 pt-20 md:pt-32 pb-16 md:pb-20">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="hidden md:flex items-center gap-3 mb-8">
            <div className="h-px w-12 bg-[#C9A84C]" />
            <span className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase font-['Cormorant_Garamond'] italic">
              Men's Scalp Care
            </span>
          </div>

          {/* Main headline */}
          <h1 className="font-['Shippori_Mincho'] text-white leading-tight mb-4 md:mb-6">
            <span className="block text-2xl md:text-6xl font-bold mb-1 md:mb-2">
              頭皮の状態を、
            </span>
            <span className="block text-2xl md:text-6xl font-bold mb-1 md:mb-2">
              データで把握する。
            </span>
            <span className="block text-base md:text-2xl text-[#C9A84C] font-normal mt-2 md:mt-4 tracking-wider">
              抜け毛を未然に防ぎ、不安のない髪へ
            </span>
          </h1>

          <p className="hidden md:block text-white/70 text-base md:text-lg leading-relaxed mb-10 font-['Noto_Sans_JP'] font-light max-w-xl">
            スカルプラボ for Men は、マイクロスコープによる詳細な頭皮チェックと
            パーソナルデータの継続記録で、あなたの頭皮状態を科学的にサポートします。
          </p>
          <p className="md:hidden text-white/65 text-sm leading-relaxed mb-6 font-['Noto_Sans_JP'] font-light">
            マイクロスコープで頭皮状態を記録・科学的にサポート。
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <button
              onClick={() => document.querySelector("#reservation")?.scrollIntoView({ behavior: "smooth" })}
              className="px-6 md:px-8 py-3.5 md:py-4 bg-[#C9A84C] text-white font-bold tracking-widest text-sm hover:bg-[#E8C97A] transition-all duration-300 flex items-center justify-center gap-2 font-['Noto_Sans_JP']" style={{textShadow: '0 1px 3px rgba(0,0,0,0.5)'}}
            >
              無料チェックを予約する
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => document.querySelector("#service")?.scrollIntoView({ behavior: "smooth" })}
              className="hidden sm:flex px-8 py-4 border border-white/30 text-white/80 text-sm tracking-widest hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-300 font-['Noto_Sans_JP'] items-center justify-center"
            >
              サービスを見る
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-4 md:gap-8 mt-8 md:mt-14 pt-6 md:pt-8 border-t border-white/10">
            {[
              { num: "3", unit: "人に1人", label: "30代男性の薄毛悩み" },
              { num: "93", unit: "%", label: "継続利用率" },
              { num: "1,200", unit: "名+", label: "男性会員数" },
            ].map((s) => (
              <div key={s.label} className="flex-1 min-w-0">
                <div className="flex items-baseline gap-0.5 md:gap-1">
                  <span className="text-[#C9A84C] font-['Cormorant_Garamond'] text-2xl md:text-3xl font-bold">{s.num}</span>
                  <span className="text-[#C9A84C] text-[10px] md:text-xs">{s.unit}</span>
                </div>
                <p className="text-white/65 text-[10px] md:text-xs mt-1 leading-snug font-['Noto_Sans_JP']">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-white/30 text-xs tracking-widest font-['Cormorant_Garamond'] italic">Scroll</span>
        <ChevronDown size={16} className="text-[#C9A84C]" />
      </div>
    </section>
  );
}

// ========== PROBLEM ==========
function Problem() {
  const problems = [
    {
      num: "01",
      title: "気づいたときには手遅れ",
      body: "薄毛・抜け毛は、目に見えて気になり始めた頃にはすでに頭皮環境の変化が進行していることがほとんどです。定期的な状態把握が、早期対応への第一歩です。",
    },
    {
      num: "02",
      title: "病院は敷居が高い",
      body: "AGAクリニックや皮膚科は「治療が必要な状態」になってから行く場所。予防や状態確認のために気軽に通える場所が、これまで存在しませんでした。",
    },
    {
      num: "03",
      title: "ケア製品選びに根拠がない",
      body: "市販のシャンプーや育毛剤を「なんとなく」選んでいませんか？自分の頭皮状態を知ることで、本当に必要なケアが見えてきます。",
    },
  ];

  return (
    <section className="bg-[#0D1B2A] py-24 relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 40px, #C9A84C 40px, #C9A84C 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, #C9A84C 40px, #C9A84C 41px)" }}
      />
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px w-12 bg-[#C9A84C]" />
          <span className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase font-['Cormorant_Garamond'] italic">The Problem</span>
        </div>
        <h2 className="font-['Shippori_Mincho'] text-white text-3xl md:text-4xl font-bold mb-16">
          男性の頭皮ケアに<br />
          <span className="text-[#C9A84C]">3つの課題</span>があります
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((p) => (
            <div key={p.num} className="border border-white/10 p-8 hover:border-[#C9A84C]/40 transition-colors duration-300 group">
              <div className="font-['Cormorant_Garamond'] text-[#C9A84C]/30 text-6xl font-bold mb-4 group-hover:text-[#C9A84C]/50 transition-colors">
                {p.num}
              </div>
              <h3 className="font-['Shippori_Mincho'] text-white text-xl font-bold mb-4">{p.title}</h3>
              <p className="text-white/80 text-sm leading-relaxed font-['Noto_Sans_JP'] font-light">{p.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========== SCALP GALLERY ==========
const MEN_SCALP_STATES = [
  {
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/2022-07-0216.27.17-1_35d2e8f2.jpg",
    label: "健やかな頭皮環境",
    status: "良好",
    statusBg: "#2D6A4F",
    statusText: "#fff",
    desc: "毛根がしっかりと育ち、頭皮が清潔に保たれている状態。定期チェックでこの状態を維持することが大切です。",
    detail: "健康・良好",
  },
  {
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/2026-04-04-14-58-15-909_8fa65f43.jpg",
    label: "皮脂過多・毛穴詰まり",
    status: "要注意",
    statusBg: "#C9A84C",
    statusText: "#0D1B2A",
    desc: "毛穴に皮脂が蔓積し、毛根への栄養供給が滞っている状態。放置すると抜け毛の原因になることがあります。",
    detail: "皮脂・毛穴",
  },
  {
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/2025-05-21-15-27-25-532_ec88191c.JPG",
    label: "疲労の蓄積・毛根の退化",
    status: "ケア推奨",
    statusBg: "#8B6914",
    statusText: "#fff",
    desc: "慢性的な疲労から毛根が退化している状態。頭皮の水分量低下と毛量の減少がみられる。",
    detail: "疲労・退化",
  },
  {
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/2025-10-27-10-18-21-496_65c4010d.jpg",
    label: "毛根の細化・弱体化",
    status: "早期ケアを",
    statusBg: "#8B1A1A",
    statusText: "#fff",
    desc: "毛根が細くなり、毛髪が弱くなっている状態。早期に頭皮環境を整えることで、改善が期待できます。",
    detail: "細毛・弱体化",
  },
];

function ScalpGallery() {
  const [active, setActive] = useState(0);
  const s = MEN_SCALP_STATES[active];

  return (
    <section className="bg-[#0D1B2A] py-24" id="scalp-gallery">
      <div className="max-w-7xl mx-auto px-6">
        {/* ヘッダー */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-[#C9A84C]" />
            <span className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase font-['Cormorant_Garamond'] italic">Scalp Microscope Gallery</span>
            <div className="h-px w-12 bg-[#C9A84C]" />
          </div>
          <h2 className="font-['Shippori_Mincho'] text-white text-3xl md:text-4xl font-bold mb-4">
            あなたの頭皮は、<br />
            <span className="text-[#C9A84C]">どの状態に近いですか？</span>
          </h2>
          <p className="text-white/70 text-sm font-['Noto_Sans_JP'] font-light max-w-xl mx-auto leading-relaxed">
            実際のマイクロスコープ映像です。頭皮の状態は人によって大きく異なります。<br />
            自分の頭皮を「見たことがある」男性は、ほとんどいません。
          </p>
        </div>

        {/* メインレイアウト */}
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* 左：画像 */}
          <div className="relative">
            <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
              <img
                key={active}
                src={s.img}
                alt={s.label}
                className="w-full h-full object-cover"
              />
              <div
                className="absolute top-4 left-4 px-3 py-1 text-xs font-['Noto_Sans_JP'] font-bold tracking-wider"
                style={{ backgroundColor: s.statusBg, color: s.statusText }}
              >
                {s.status}
              </div>
              <div className="absolute bottom-4 right-4 w-8 h-8 bg-black/60 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C9A84C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
              </div>
            </div>
            <p className="text-white/30 text-[11px] text-center mt-2 font-['Noto_Sans_JP']">
              ※ スカルプラボ実際のマイクロスコープ撮影画像
            </p>
          </div>

          {/* 右：説明 */}
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-8 bg-[#C9A84C]" />
                <span className="font-['Cormorant_Garamond'] italic text-[#C9A84C] text-sm tracking-widest">{s.detail}</span>
              </div>
              <h3 className="font-['Shippori_Mincho'] text-white text-2xl md:text-3xl font-bold mb-4">{s.label}</h3>
              <p className="text-white/80 text-sm leading-relaxed font-['Noto_Sans_JP'] font-light">{s.desc}</p>
            </div>

            {/* サムネイル */}
            <div className="grid grid-cols-4 gap-2 mb-8">
              {MEN_SCALP_STATES.map((st, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`relative overflow-hidden transition-all duration-300 ${
                    active === i ? "ring-2 ring-[#C9A84C] opacity-100" : "opacity-40 hover:opacity-70"
                  }`}
                  style={{ aspectRatio: "1" }}
                  aria-label={st.label}
                >
                  <img src={st.img} alt={st.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="border border-[#C9A84C]/30 p-5 bg-[#1C2B3A]">
              <p className="text-white/90 text-sm font-['Noto_Sans_JP'] font-light leading-relaxed mb-4">
                <span className="text-[#C9A84C] font-bold">あなたの頭皮は今、どんな状態？</span><br />
                実際にマイクロスコープで確認してみましょう。初回チェックは無料です。
              </p>
              <button
                onClick={() => {
                  const el = document.getElementById("reservation");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full py-3 bg-[#C9A84C] text-white font-['Noto_Sans_JP'] font-bold text-sm tracking-widest hover:bg-[#E8C97A] transition-all duration-300" style={{textShadow: '0 1px 3px rgba(0,0,0,0.5)'}}
              >
                無料スカルプチェックを予約する
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ========== CONCEPT ==========
function Concept() {
  return (
    <section className="bg-[#1C2B3A] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Visual */}
          <div className="relative">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/men-microscope-check_bfd1313a.png"
              alt="マイクロスコープによる頭皮チェック"
              className="w-full object-cover"
              style={{ aspectRatio: "4/3" }}
            />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-[#C9A84C]/40" />
            <div className="absolute -top-4 -left-4 w-24 h-24 border border-[#C9A84C]/20" />
          </div>

          {/* Text */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-12 bg-[#C9A84C]" />
              <span className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase font-['Cormorant_Garamond'] italic">Our Concept</span>
            </div>
            <h2 className="font-['Shippori_Mincho'] text-white text-3xl md:text-4xl font-bold mb-6 leading-tight">
              歯科検診のように、<br />
              <span className="text-[#C9A84C]">頭皮も定期的に</span><br />
              チェックする時代へ。
            </h2>
            <p className="text-white/70 text-sm leading-relaxed mb-6 font-['Noto_Sans_JP'] font-light">
              虫歯になってから歯医者に行くのではなく、定期的に通って予防するように。
              スカルプラボ for Men は、頭皮の状態を定期的に記録・確認する習慣を、
              男性の新しいセルフケアとして提案します。
            </p>
            <p className="text-white/70 text-sm leading-relaxed mb-8 font-['Noto_Sans_JP'] font-light">
              高精度マイクロスコープで毛穴・皮脂・頭皮の状態を詳細に記録し、
              時系列データとして蓄積。「変化が見える」ことが、継続ケアのモチベーションになります。
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                "マイクロスコープ詳細チェック",
                "時系列データの蓄積・比較",
                "パーソナルスカルプレポート",
                "専門スタッフによるアドバイス",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <Check size={14} className="text-[#C9A84C] mt-0.5 shrink-0" />
                  <span className="text-white/70 text-xs font-['Noto_Sans_JP']">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ========== STATS ==========
function Stats() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const c1 = useCounter(30, 1800, visible);
  const c2 = useCounter(93, 2000, visible);
  const c3 = useCounter(1200, 2200, visible);

  return (
    <section ref={ref} className="bg-[#0D1B2A] py-20 border-y border-[#C9A84C]/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-[#C9A84C]/20">
          {[
            { count: c1, suffix: "代", prefix: "", label: "男性の薄毛悩みが急増している年代", note: "（当社調べ・2024年度）" },
            { count: c2, suffix: "%", prefix: "", label: "男性会員の継続利用率", note: "（当社調べ・2024年度・N=320名）" },
            { count: c3, suffix: "名以上", prefix: "", label: "男性会員数", note: "（2025年3月時点）" },
          ].map((s, i) => (
            <div key={i} className="py-12 px-8 text-center">
              <div className="font-['Cormorant_Garamond'] text-[#C9A84C] text-6xl md:text-7xl font-bold mb-2">
                {s.prefix}{s.count}{s.suffix}
              </div>
              <p className="text-white font-['Shippori_Mincho'] text-lg mb-1">{s.label}</p>
              <p className="text-white/65 text-xs font-['Noto_Sans_JP']">{s.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========== SERVICE ==========
function Service() {
  const services = [
    {
      step: "Layer 01",
      title: "無料スカルプチェック",
      subtitle: "まずは気軽に、頭皮の現状を知る",
      duration: "所要 5〜10分",
      price: "無料",
      features: [
        "マイクロスコープによる頭皮撮影",
        "毛穴・皮脂量・頭皮状態の簡易確認",
        "その場で画像つきの説明",
        "LINEでデータ共有",
      ],
      img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/men-scalp-check2_78e68cbf.jpg",
    },
    {
      step: "Layer 02",
      title: "スカルプラボ定期ケア",
      subtitle: "継続的な頭皮モニタリングと記録",
      duration: "所要 30〜40分",
      price: "3,000〜5,000円/回",
      features: [
        "マイクロスコープ詳細チェック",
        "頭皮温度・皮脂量・髪密度計測",
        "問診（生活習慣・使用製品）",
        "パーソナルスカルプレポート（時系列グラフ付き）",
      ],
      img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/men-steamer-check_49af7a59.jpg",
    },
    {
      step: "Layer 03",
      title: "パーソナルスカルプケアプログラム",
      subtitle: "チェック結果に基づくケアのご提案",
      duration: "継続サポート",
      price: "サブスクプランあり",
      features: [
        "チェック結果に基づくホームケア製品のご提案",
        "スカルプトリートメント・ヘッドスパ施術",
        "サブスクリプション型の製品定期便",
        "深刻な状態が見られた場合の医療機関ご紹介",
      ],
      img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/men-personal-care_2c524aa8.jpg",
    },
  ];

  return (
    <section id="service" className="bg-[#1C2B3A] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px w-12 bg-[#C9A84C]" />
          <span className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase font-['Cormorant_Garamond'] italic">Our Service</span>
        </div>
        <h2 className="font-['Shippori_Mincho'] text-white text-3xl md:text-4xl font-bold mb-4">
          3層構造のサービス設計
        </h2>
        <p className="text-white/80 text-sm font-['Noto_Sans_JP'] font-light mb-16 max-w-xl">
          「気軽に始める」から「本格的なデータ管理」まで、あなたのペースに合わせて選べます。
        </p>

        <div className="space-y-16">
          {services.map((s, i) => (
            <div key={s.step} className={`grid md:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? "md:flex-row-reverse" : ""}`}>
              <div className={i % 2 === 1 ? "md:order-2" : ""}>
                <div className="relative overflow-hidden group">
                  <img
                    src={s.img}
                    alt={s.title}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ aspectRatio: "4/3" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="font-['Cormorant_Garamond'] italic text-[#C9A84C] text-sm tracking-widest">{s.step}</span>
                  </div>
                </div>
              </div>
              <div className={i % 2 === 1 ? "md:order-1" : ""}>
                <span className="font-['Cormorant_Garamond'] italic text-[#C9A84C] text-sm tracking-widest block mb-2">{s.step}</span>
                <h3 className="font-['Shippori_Mincho'] text-white text-2xl md:text-3xl font-bold mb-2">{s.title}</h3>
                <p className="text-white/80 text-sm mb-1 font-['Noto_Sans_JP']">{s.subtitle}</p>
                <div className="flex gap-4 mb-6 mt-4">
                  <span className="text-[#C9A84C] text-xs border border-[#C9A84C]/40 px-3 py-1 font-['Noto_Sans_JP']">{s.duration}</span>
                  <span className="text-[#C9A84C] text-xs border border-[#C9A84C]/40 px-3 py-1 font-['Noto_Sans_JP']">{s.price}</span>
                </div>
                <ul className="space-y-3">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <div className="w-1 h-1 rounded-full bg-[#C9A84C] mt-2 shrink-0" />
                      <span className="text-white/70 text-sm font-['Noto_Sans_JP'] font-light">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========== BOTANICAL MIST ==========
function BotanicalMist() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const MIST_IMAGE = "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/herb_steamer_8218d07e.jpg";

  const effects = [
    {
      icon: "",
      title: "植物成分を蒸気で洸透",
      desc: "超微細なミストが頭皮の角質層まで届き、植物由来成分を肌に馴染ませます。液体では届かない層へのアプローチ。",
    },
    {
      icon: "",
      title: "引き算のメソッド",
      desc: "頭皮に残る余分な皮脂・薬剤・化粧品残留物を「取り去る」ケア。素の頭皮本来の力を引き出します。",
    },
    {
      icon: "",
      title: "重さゼロ・水分だけ",
      desc: "水分のみを噴霧するため、髪に余分な重さを与えません。スタイリングの仕上がりに影響なく、頭皮に潤いを届けます。",
    },
    {
      icon: "",
      title: "頭皮を「皮膚」として捉える",
      desc: "THE HERBSが独自開発した植物美容メソッド。頭皮も顔と同じ「皮膚」として扱い、スキンケアと同様のアプローチで根本ケア。",
    },
    {
      icon: "",
      title: "カラー・パーマ後のリセット",
      desc: "薬剤残留を天然ハーブで浄化。頭皮と髪の水分・タンパク質を補い、ダメージを受けた頭皮状態を整えます。",
    },
    {
      icon: "",
      title: "定期チェックとの相乗効果",
      desc: "チェックデータと組み合わせることで、ミストの効果を数値・画像で記録。時系列で頭皮変化を確認できます。",
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden" id="botanical-mist"
      style={{ background: "linear-gradient(160deg, #0D1B2A 0%, #1C2B3A 100%)" }}
    >
      {/* 背景装飾 */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, #C9A84C15 0%, transparent 70%)", transform: "translate(20%, -20%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, #C9A84C10 0%, transparent 70%)", transform: "translate(-20%, 20%)" }}
        />
      </div>

      <div ref={ref} className="max-w-7xl mx-auto px-6 relative">
        {/* ヘッダーブロック */}
        <div className={`flex flex-col lg:flex-row gap-16 items-center mb-20 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {/* 画像（左） */}
          <div className="flex-shrink-0 w-full lg:w-[420px] order-2 lg:order-1">
            <div className="relative overflow-hidden">
              <img
                src={MIST_IMAGE}
                alt="ボタニカルミスト施術"
                className="w-full object-cover"
                style={{ height: "380px", objectPosition: "center 30%" }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ boxShadow: "inset 0 0 0 1px #C9A84C40" }}
              />
              <div className="absolute bottom-4 left-4 font-['Noto_Sans_JP'] text-xs font-bold px-4 py-2" style={{ backgroundColor: "#C9A84C", color: "#0D1B2A" }}>
                THE HERBS ボタニカルミスト
              </div>
            </div>
          </div>

          {/* テキスト（右） */}
          <div className="flex-1 order-1 lg:order-2">
            <span className="font-['Cormorant_Garamond'] italic text-sm tracking-[0.4em] uppercase block mb-4" style={{ color: "#C9A84C" }}>
              Botanical Mist Technology
            </span>
            <h2 className="font-['Shippori_Mincho'] text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight" style={{ color: "#ffffff" }}>
              植物の力を、<br />
              <span style={{ color: "#C9A84C" }}>蒸気で頭皮へ。</span>
            </h2>
            <p className="text-sm font-['Noto_Sans_JP'] font-light leading-relaxed mb-6 max-w-lg" style={{ color: "rgba(255,255,255,0.85)" }}>
              THE HERBSが1986年から研究を重ねてきた「植物美容メソッド」の核心技術。
              ハーブスチーマー（ボタニカルミスト）は、植物由来の美容成分を超微細な蒸気に変換し、
              頭皮の奥まで届けます。
            </p>
            <p className="text-xs font-['Noto_Sans_JP'] leading-relaxed max-w-lg" style={{ color: "rgba(255,255,255,0.65)" }}>
              ※本施術は化粧品の使用感の向上を目的としたものです。効果・効能には個人差があります。
            </p>
          </div>
        </div>

        {/* 効果グリッド */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ backgroundColor: "rgba(201,168,76,0.1)" }}>
          {effects.map((effect, i) => (
            <div
              key={i}
              className={`p-8 transition-all duration-500 group ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ backgroundColor: "#1C2B3A", transitionDelay: `${i * 100}ms` }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#243547")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1C2B3A")}
            >
              <span className="text-3xl block mb-4">{effect.icon}</span>
              <h3 className="font-['Shippori_Mincho'] text-base font-bold mb-3 leading-snug transition-colors" style={{ color: "#ffffff", fontSize: '18px' }}>
                {effect.title}
              </h3>
              <p className="text-xs font-['Noto_Sans_JP'] leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
                {effect.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ボトムCTA */}
        <div className={`mt-16 text-center transition-all duration-700 delay-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-sm font-['Noto_Sans_JP'] mb-6" style={{ color: "rgba(255,255,255,0.75)" }}>
            ボタニカルミストは「スカルプラボ定期ケア」「パーソナルスカルプケアコース」に含まれています
          </p>
          <button
            onClick={() => document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-10 py-4 font-bold tracking-widest text-sm transition-all duration-300 font-['Noto_Sans_JP']"
            style={{ backgroundColor: "#C9A84C", color: "#0D1B2A" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#E8C97A")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#C9A84C")}
          >
            ボタニカルミストを体験する
          </button>
        </div>
      </div>
    </section>
  );
}

// ========== TARGET ==========
function Target() {
  const targets = [
    {
      icon: "",
      title: "予防ケア層（20〜30代）",
      message: "「まだ大丈夫なうちに、始める安心」",
      body: "親が薄毛、将来が不安。早めに頭皮の状態を把握しておきたい方に。データを積み重ねることで、変化に気づけます。",
    },
    {
      icon: "",
      title: "ビジネスパーソン（30〜40代）",
      message: "「見た目の自信が、仕事の自信になる」",
      body: "第一印象は髪から。定期的な頭皮ケアを習慣にすることで、清潔感と自信を保ち続けられます。",
    },
    {
      icon: "",
      title: "育毛ケア層（40〜50代）",
      message: "「見える化で、不安を安心に変える」",
      body: "薄毛・抜け毛が気になり始めた方に。状態を数値で把握し、適切なケアの選択をサポートします。",
    },
  ];

  return (
    <section className="bg-[#1C2B3A] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px w-12 bg-[#C9A84C]" />
          <span className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase font-['Cormorant_Garamond'] italic">For You</span>
        </div>
        <h2 className="font-['Shippori_Mincho'] text-white text-3xl md:text-4xl font-bold mb-16">
          こんな方に選ばれています
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {targets.map((t) => (
            <div key={t.title} className="border-l-2 border-[#C9A84C]/40 pl-6 hover:border-[#C9A84C] transition-colors duration-300">
              <div className="text-3xl mb-4">{t.icon}</div>
              <h3 className="font-['Shippori_Mincho'] text-white text-xl font-bold mb-2">{t.title}</h3>
              <p className="text-[#C9A84C] text-sm italic font-['Cormorant_Garamond'] mb-3">{t.message}</p>
              <p className="text-white/80 text-sm leading-relaxed font-['Noto_Sans_JP'] font-light">{t.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========== DIGITAL ==========
function Digital() {
  return (
    <section className="py-24 border-t border-[#C9A84C]/20" style={{ backgroundColor: "#0D1B2A" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <p className="text-xs tracking-[0.3em] text-[#C9A84C] mb-4 font-['Noto_Sans_JP']" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>SCALP LABO DIGITAL REPORT</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Shippori Mincho', serif", color: "#ffffff" }}>
              スカルプラボ<br />
              <span style={{ color: "#C9A84C" }}>デジタルレポート</span>
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "rgba(255,255,255,0.75)", lineHeight: "1.9" }}>
              定期チェックのたびに頭皮データが蓄積される、<br />
              男性のためのデジタル頭皮記録ツール。<br />
              変化をグラフで可視化し、ケアの効果を実感できます。
            </p>
            <ul className="space-y-3 mb-10">
              {[
                "頭皮画像のアップロード・時系列記録",
                "症状・生活習慣のログ管理",
                "チェック結果のグラフ可視化",
                "サロンとのデータ共有機能",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "rgba(255,255,255,0.85)" }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#C9A84C", fontSize: "10px", color: "#0D1B2A", fontWeight: 700 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            {/* Store Buttons */}
            <div className="flex flex-wrap gap-4">
              <a
                href="#"
                onClick={e => { e.preventDefault(); alert("App Store公開準備中です。しばらくお待ちください。"); }}
                className="flex items-center gap-3 px-5 py-3 rounded-xl border hover:opacity-80 transition-opacity"
                style={{ backgroundColor: "#1C2B3A", borderColor: "rgba(201,168,76,0.3)" }}
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
                className="flex items-center gap-3 px-5 py-3 rounded-xl border hover:opacity-80 transition-opacity"
                style={{ backgroundColor: "#1C2B3A", borderColor: "rgba(201,168,76,0.3)" }}
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
              alt="スカルプラボ デジタルレポート モックアップ"
              className="w-full max-w-lg object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ========== FLOW ==========
function Flow() {
  const steps = [
    { num: "01", title: "ご予約", desc: "WEB・LINEから24時間予約可能。初回は無料チェックからお気軽にどうぞ。" },
    { num: "02", title: "来店・問診", desc: "生活習慣・使用製品・気になる症状などをヒアリングします。" },
    { num: "03", title: "頭皮チェック", desc: "マイクロスコープで頭皮を撮影・記録。その場で状態をご説明します。" },
    { num: "04", title: "レポート・提案", desc: "パーソナルスカルプレポートをお渡し。ケアのご提案をいたします。" },
  ];

  return (
    <section className="bg-[#1C2B3A] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px w-12 bg-[#C9A84C]" />
          <span className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase font-['Cormorant_Garamond'] italic">How It Works</span>
        </div>
        <h2 className="font-['Shippori_Mincho'] text-white text-3xl md:text-4xl font-bold mb-16">
          ご利用の流れ
        </h2>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((s, i) => (
            <div key={s.num} className="relative">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-full w-full h-px bg-[#C9A84C]/20 z-0" />
              )}
              <div className="relative z-10">
                <div className="font-['Cormorant_Garamond'] text-[#C9A84C] text-4xl font-bold mb-4">{s.num}</div>
                <h3 className="font-['Shippori_Mincho'] text-white text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed font-['Noto_Sans_JP'] font-light">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========== TESTIMONIALS ==========
function Testimonials() {
  const testimonials = [
    {
      stars: 5,
      highlight: "「データで見えると、ケアが続く」",
      body: "以前は何となくシャンプーを選んでいましたが、チェックで自分の頭皮状態を知ってから、ケアの選び方が変わりました。毎回レポートで変化が確認できるので、続けるモチベーションになっています。",
      name: "T.K.",
      age: "38歳",
      attr: "会社員",
    },
    {
      stars: 5,
      highlight: "「早めに状態を知れて良かった」",
      body: "父が薄毛なので、30代のうちから頭皮の状態を把握しておきたくて利用し始めました。病院ほど敷居が高くなく、気軽に通えるのがいいです。スタッフの方の説明も丁寧で安心できます。",
      name: "S.M.",
      age: "32歳",
      attr: "エンジニア",
    },
    {
      stars: 4,
      highlight: "「仕事前に立ち寄れる手軽さ」",
      body: "30〜40分で完結するので、仕事の前後に立ち寄れます。レポートをスマホで確認できるのも便利。頭皮のことを専門的に相談できる場所がなかったので、ありがたいサービスです。",
      name: "H.N.",
      age: "45歳",
      attr: "管理職",
    },
    {
      stars: 5,
      highlight: "「薄毛の不安が、安心に変わった」",
      body: "抜け毛が増えて不安でしたが、チェックで現状を数値で把握できて気持ちが楽になりました。AGAクリニックより敷居が低く、まず状態を知るという意味で利用して良かったです。",
      name: "Y.O.",
      age: "42歳",
      attr: "自営業",
    },
    {
      stars: 5,
      highlight: "「継続することで変化がわかる」",
      body: "半年続けて、季節によって頭皮の状態が変わることがわかりました。夏は皮脂が多く、冬は乾燥するなど、自分のパターンを把握できたことでケアの精度が上がった気がします。",
      name: "R.T.",
      age: "29歳",
      attr: "デザイナー",
    },
    {
      stars: 4,
      highlight: "「プレミアムプランで専属対応が◎」",
      body: "プレミアムプランを利用しています。専属アドバイザーがいるので、毎回同じ方に相談できて安心です。ヘッドスパも月1回受けられるので、コスパも悪くないと感じています。",
      name: "K.I.",
      age: "51歳",
      attr: "経営者",
    },
  ];

  return (
    <section id="testimonials" className="bg-[#0D1B2A] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px w-12 bg-[#C9A84C]" />
          <span className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase font-['Cormorant_Garamond'] italic">Testimonials</span>
        </div>
        <h2 className="font-['Shippori_Mincho'] text-white text-3xl md:text-4xl font-bold mb-4">
          お客様の声
        </h2>
        <p className="text-white/65 text-xs font-['Noto_Sans_JP'] mb-16">
          ※ 個人の感想です。効果・体験には個人差があります。
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="border border-white/10 p-6 hover:border-[#C9A84C]/30 transition-colors duration-300">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={12} className={j < t.stars ? "text-[#C9A84C] fill-[#C9A84C]" : "text-white/20"} />
                ))}
              </div>
              <p className="font-['Shippori_Mincho'] text-[#C9A84C] text-sm font-bold mb-3">{t.highlight}</p>
              <p className="text-white/80 text-sm leading-relaxed font-['Noto_Sans_JP'] font-light mb-6">{t.body}</p>
              <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                <div className="w-8 h-8 rounded-full bg-[#1C2B3A] border border-[#C9A84C]/30 flex items-center justify-center">
                  <span className="text-[#C9A84C] text-xs font-['Cormorant_Garamond']">{t.name[0]}</span>
                </div>
                <div>
                  <p className="text-white text-sm font-['Noto_Sans_JP']">{t.name} 様</p>
                  <p className="text-white/65 text-xs font-['Noto_Sans_JP']">{t.age} · {t.attr}</p>
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
function FAQ() {
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    {
      q: "医療行為ではないですか？",
      a: "スカルプラボ for Men は医療行為ではありません。マイクロスコープによる頭皮の撮影・記録・確認を行うサービスです。疾病の診断・治療・予防を目的とするものではありません。頭皮や毛髪に関する医療的なご相談は、皮膚科・AGAクリニック等の医療機関にご相談ください。",
    },
    {
      q: "薄毛が進んでいますが、利用できますか？",
      a: "はい、ご利用いただけます。薄毛・抜け毛が気になる方にこそ、現状の頭皮状態を把握することをおすすめしています。ただし、医療的な治療（薬の処方等）は当サービスでは行っておりません。必要に応じて医療機関をご紹介いたします。",
    },
    {
      q: "どのくらいの頻度で通えばいいですか？",
      a: "3ヶ月に1回（年4回）を目安としています。季節の変わり目に頭皮状態が変化しやすいため、この頻度が時系列変化を把握するのに適しています。スタンダード・プレミアムプランは年4回のチェックが含まれています。",
    },
    {
      q: "初回の無料チェックはどんな内容ですか？",
      a: "マイクロスコープによる頭皮撮影（5〜10分）を行い、毛穴の状態・皮脂量・頭皮の状態を簡易的に確認します。結果はその場で画像つきでご説明し、LINEでデータをお送りします。費用は一切かかりません。",
    },
    {
      q: "サブスクリプションはいつでも解約できますか？",
      a: "はい、いつでも解約可能です。解約手続きはLINEまたはWEBから行えます。解約後は次回の更新日以降の請求は発生しません。詳細はプライバシーポリシーおよび特定商取引法に基づく表記をご確認ください。",
    },
    {
      q: "AGAクリニックとの違いは何ですか？",
      a: "AGAクリニックは医療機関であり、薬の処方・医療的治療を行う場所です。スカルプラボ for Men は医療行為を行わず、頭皮状態の記録・確認とケアのご提案を行うサービスです。「まず状態を知りたい」「予防的に管理したい」という方に適しています。深刻な症状が見られた場合は医療機関をご紹介します。",
    },
  ];

  return (
    <section id="faq" className="bg-[#1C2B3A] py-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px w-12 bg-[#C9A84C]" />
          <span className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase font-['Cormorant_Garamond'] italic">FAQ</span>
        </div>
        <h2 className="font-['Shippori_Mincho'] text-white text-3xl md:text-4xl font-bold mb-16">
          よくあるご質問
        </h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-white/10 hover:border-[#C9A84C]/30 transition-colors">
              <button
                className="w-full flex items-center justify-between p-6 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-white font-['Shippori_Mincho'] font-bold text-sm pr-4">{faq.q}</span>
                {open === i ? (
                  <ChevronUp size={16} className="text-[#C9A84C] shrink-0" />
                ) : (
                  <ChevronDown size={16} className="text-[#C9A84C] shrink-0" />
                )}
              </button>
              {open === i && (
                <div className="px-6 pb-6 border-t border-white/5">
                  <p className="text-white/80 text-sm leading-relaxed font-['Noto_Sans_JP'] font-light pt-4">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ========== RESERVATION ==========
function Reservation() {
  const [form, setForm] = useState({
    name: "", phone: "", email: "", date: "", time: "", course: "", message: "", privacy: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const createReservation = trpc.reservation.create.useMutation();

  const courses = [
    "無料スカルプチェック（初回）",
    "定期スカルプチェック（有料）",
    "ライトプラン（月額1,980円）",
    "スタンダードプラン（月額3,980円）",
    "プレミアムプラン（月額7,980円）",
    "その他・相談したい",
  ];

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "お名前を入力してください";
    if (!form.phone.trim()) e.phone = "電話番号を入力してください";
    if (!form.date) e.date = "希望日を選択してください";
    if (!form.course) e.course = "ご希望のコースを選択してください";
    if (!form.privacy) e.privacy = "プライバシーポリシーへの同意が必要です";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const planMap: Record<string, "free" | "standard" | "personal" | "consult"> = {
        "無料スカルプチェック（初回）": "free",
        "定期スカルプチェック（有料）": "standard",
        "ライトプラン（月額1,980円）": "standard",
        "スタンダードプラン（月額3,980円）": "standard",
        "プレミアムプラン（月額7,980円）": "personal",
        "その他・相談したい": "consult",
      };
      await createReservation.mutateAsync({
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        desiredDate: form.date,
        desiredTime: form.time || "--:--",
        plan: planMap[form.course] ?? "consult",
        message: form.message || undefined,
        gender: "men",
      });
      setSubmitted(true);
    } catch {
      setErrors({ submit: "送信に失敗しました。お電話またはLINEでご予約ください。" });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section id="reservation" className="bg-[#0D1B2A] py-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="w-16 h-16 border-2 border-[#C9A84C] flex items-center justify-center mx-auto mb-8">
            <Check size={28} className="text-[#C9A84C]" />
          </div>
          <h2 className="font-['Shippori_Mincho'] text-white text-3xl font-bold mb-4">
            ご予約を受け付けました
          </h2>
          <p className="text-white/80 text-sm font-['Noto_Sans_JP'] font-light leading-relaxed">
            担当スタッフより2営業日以内にご連絡いたします。<br />
            ご不明な点はお気軽にお問い合わせください。
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="reservation" className="bg-[#0D1B2A] py-24">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px w-12 bg-[#C9A84C]" />
          <span className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase font-['Cormorant_Garamond'] italic">Reservation</span>
        </div>
        <h2 className="font-['Shippori_Mincho'] text-white text-3xl md:text-4xl font-bold mb-4">
          ご予約・お問い合わせ
        </h2>
        <p className="text-white/80 text-sm font-['Noto_Sans_JP'] font-light mb-12">
          まずは無料スカルプチェックからお気軽にどうぞ。<br />
          ご入力いただいた個人情報は予約確認のみに使用します。
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white/70 text-xs mb-2 font-['Noto_Sans_JP'] tracking-wider">
                お名前 <span className="text-[#C9A84C]">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[#1C2B3A] border border-white/10 focus:border-[#C9A84C] text-white px-4 py-3 text-sm outline-none transition-colors font-['Noto_Sans_JP']"
                placeholder="山田 太郎"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1 font-['Noto_Sans_JP']">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-white/70 text-xs mb-2 font-['Noto_Sans_JP'] tracking-wider">
                電話番号 <span className="text-[#C9A84C]">*</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-[#1C2B3A] border border-white/10 focus:border-[#C9A84C] text-white px-4 py-3 text-sm outline-none transition-colors font-['Noto_Sans_JP']"
                placeholder="090-0000-0000"
              />
              {errors.phone && <p className="text-red-400 text-xs mt-1 font-['Noto_Sans_JP']">{errors.phone}</p>}
            </div>
          </div>

          <div>
            <label className="block text-white/70 text-xs mb-2 font-['Noto_Sans_JP'] tracking-wider">
              メールアドレス
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full bg-[#1C2B3A] border border-white/10 focus:border-[#C9A84C] text-white px-4 py-3 text-sm outline-none transition-colors font-['Noto_Sans_JP']"
              placeholder="example@email.com"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white/70 text-xs mb-2 font-['Noto_Sans_JP'] tracking-wider">
                ご希望日 <span className="text-[#C9A84C]">*</span>
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full bg-[#1C2B3A] border border-white/10 focus:border-[#C9A84C] text-white px-4 py-3 text-sm outline-none transition-colors font-['Noto_Sans_JP']"
              />
              {errors.date && <p className="text-red-400 text-xs mt-1 font-['Noto_Sans_JP']">{errors.date}</p>}
            </div>
            <div>
              <label className="block text-white/70 text-xs mb-2 font-['Noto_Sans_JP'] tracking-wider">
                ご希望時間帯
              </label>
              <select
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="w-full bg-[#1C2B3A] border border-white/10 focus:border-[#C9A84C] text-white px-4 py-3 text-sm outline-none transition-colors font-['Noto_Sans_JP']"
              >
                <option value="">選択してください</option>
                <option value="morning">午前（10:00〜12:00）</option>
                <option value="afternoon">午後（13:00〜17:00）</option>
                <option value="evening">夕方（17:00〜20:00）</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-white/70 text-xs mb-2 font-['Noto_Sans_JP'] tracking-wider">
              ご希望のコース <span className="text-[#C9A84C]">*</span>
            </label>
            <select
              value={form.course}
              onChange={(e) => setForm({ ...form, course: e.target.value })}
              className="w-full bg-[#1C2B3A] border border-white/10 focus:border-[#C9A84C] text-white px-4 py-3 text-sm outline-none transition-colors font-['Noto_Sans_JP']"
            >
              <option value="">選択してください</option>
              {courses.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            {errors.course && <p className="text-red-400 text-xs mt-1 font-['Noto_Sans_JP']">{errors.course}</p>}
          </div>

          <div>
            <label className="block text-white/70 text-xs mb-2 font-['Noto_Sans_JP'] tracking-wider">
              ご要望・ご質問（任意）
            </label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              rows={4}
              className="w-full bg-[#1C2B3A] border border-white/10 focus:border-[#C9A84C] text-white px-4 py-3 text-sm outline-none transition-colors resize-none font-['Noto_Sans_JP']"
              placeholder="気になる症状・ご要望などをご記入ください"
            />
          </div>

          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.privacy}
                onChange={(e) => setForm({ ...form, privacy: e.target.checked })}
                className="mt-1 accent-[#C9A84C]"
              />
              <span className="text-white/60 text-xs font-['Noto_Sans_JP'] leading-relaxed">
                <Link href="/privacy" className="text-[#C9A84C] hover:underline">プライバシーポリシー</Link>に同意します。
                ご入力いただいた個人情報は予約確認・サービス提供の目的のみに使用し、第三者への提供は行いません。
              </span>
            </label>
            {errors.privacy && <p className="text-red-400 text-xs mt-1 font-['Noto_Sans_JP']">{errors.privacy}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-[#C9A84C] text-white font-bold tracking-widest text-sm hover:bg-[#E8C97A] transition-all duration-300 flex items-center justify-center gap-2 font-['Noto_Sans_JP'] disabled:opacity-60 disabled:cursor-not-allowed" style={{textShadow: '0 1px 3px rgba(0,0,0,0.5)'}}
          >
            {submitting ? "送信中..." : "予約を申し込む"}
            {!submitting && <ArrowRight size={16} />}
          </button>
          {errors.submit && (
            <p className="text-red-400 text-xs text-center mt-2 font-['Noto_Sans_JP']">{errors.submit}</p>
          )}
        </form>
      </div>
    </section>
  );
}

// ========== STORE SECTION ==========
function StoreSection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const stores = [
    {
      id: "hankyu",
      name: "スカルプラボ 神戸阪急店",
      nameEn: "SCALP LABO Kobe Hankyu",
      badge: "百貨店内サロン",
      address: "〒650-0001 兵庫県神戸市中央区加納町4-4-1 神戸阪急 B1F",
      hours: [
        { day: "月〜金", time: "10:30 〜 20:00" },
        { day: "土・日・祝", time: "10:00 〜 20:00" },
      ],
      closed: "不定休（神戸阪急に準ずる）",
      line: "https://lin.ee/oWeHStW",
      features: ["頭皮マイクロスコープチェック", "ハーブスチーマー", "頭皮データ記録・管理"],
      mapUrl: "https://maps.google.com/?q=神戸阪急+神戸市中央区加納町4-4-1",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3280.5!2d135.1955!3d34.6941!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000e6f7b8e5a3a3%3A0x1!2z56aP5oi45YWD5pys!5e0!3m2!1sja!2sjp!4v1",
    },
    {
      id: "nada",
      name: "スカルプラボ 灘区直営サロン",
      nameEn: "SCALP LABO Nada Salon",
      badge: "直営ヘッドスパサロン",
      address: "〒657-0051 兵庫県神戸市灘区大内通1-7-17 1階",
      hours: [
        { day: "火〜土", time: "10:00 〜 19:00" },
        { day: "日・祝", time: "10:00 〜 18:00" },
      ],
      closed: "月曜定休",
      line: "https://lin.ee/oWeHStW",
      features: ["育毛メニュー", "ディープクレンジング", "ヘアカラー後頭皮ケア", "和漢カラー"],
      mapUrl: "https://maps.google.com/?q=神戸市灘区大内通1-7-17",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3280.5!2d135.2355!3d34.7141!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000e7b8e5a3a3%3A0x1!2z56aP5oi45YWD5pys!5e0!3m2!1sja!2sjp!4v1",
    },
  ];

  return (
    <section className="bg-[#0D1B2A] py-24 border-t border-[#C9A84C]/20" id="store">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        {/* ヘッダー */}
        <div className={`mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-['Cormorant_Garamond'] italic text-[#C9A84C] text-sm tracking-[0.4em] uppercase block mb-4">
            Our Locations
          </span>
          <h2 className="font-['Shippori_Mincho'] text-white text-3xl md:text-4xl font-bold mb-4">
            店舗・アクセス
          </h2>
          <p className="text-white/75 text-sm font-['Noto_Sans_JP'] font-light leading-relaxed">
            神戸市内2拠点で、頭皮の定期チェックをお受けしています。
          </p>
        </div>

        {/* 店舗カード */}
        <div className="grid md:grid-cols-2 gap-6">
          {stores.map((store, i) => (
            <div
              key={store.id}
              className={`border border-[#C9A84C]/20 hover:border-[#C9A84C]/50 transition-all duration-500 overflow-hidden ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {/* マップエリア */}
              <div className="relative h-48 overflow-hidden bg-[#1C2B3A]">
                <iframe
                  title={store.name}
                  src={store.mapEmbed}
                  className="w-full h-full border-0 opacity-80"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute top-3 left-3 font-['Noto_Sans_JP'] text-[#0D1B2A] text-xs font-bold px-3 py-1 bg-[#C9A84C]">
                  {store.badge}
                </div>
              </div>

              {/* 情報エリア */}
              <div className="p-7 bg-[#1C2B3A]">
                <div className="mb-5">
                  <p className="font-['Cormorant_Garamond'] text-[#C9A84C] text-xs tracking-widest uppercase mb-1">
                    {store.nameEn}
                  </p>
                  <h3 className="font-['Shippori_Mincho'] text-white text-xl font-bold">
                    {store.name}
                  </h3>
                </div>

                {/* 住所 */}
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-[#C9A84C] text-sm mt-0.5 flex-shrink-0">📍</span>
                  <p className="text-white/80 text-sm font-['Noto_Sans_JP'] leading-relaxed">{store.address}</p>
                </div>

                {/* 営業時間 */}
                <div className="flex items-start gap-3 mb-5">
                  <span className="text-[#C9A84C] text-sm mt-0.5 flex-shrink-0">🕐</span>
                  <div>
                    {store.hours.map((h) => (
                      <div key={h.day} className="flex gap-3 mb-1">
                        <span className="text-white/55 text-xs font-['Noto_Sans_JP'] w-16 flex-shrink-0">{h.day}</span>
                        <span className="text-white text-xs font-['Noto_Sans_JP'] font-medium">{h.time}</span>
                      </div>
                    ))}
                    <p className="text-white/55 text-xs font-['Noto_Sans_JP'] mt-1">定休日：{store.closed}</p>
                  </div>
                </div>

                {/* 施術メニュー */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {store.features.map((f) => (
                    <span
                      key={f}
                      className="text-[#C9A84C] text-xs border border-[#C9A84C]/30 px-2.5 py-1 font-['Noto_Sans_JP']"
                    >
                      {f}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex gap-3">
                  <a
                    href={store.line}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 text-white text-xs font-bold py-3 font-['Noto_Sans_JP'] transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#06C755" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                    </svg>
                    LINEで予約・問合せ
                    <span className="text-white/70 text-[10px] font-normal ml-1">@theherbs39</span>
                  </a>
                  <a
                    href={store.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 border border-[#C9A84C]/30 text-[#C9A84C] text-xs px-4 py-3 font-['Noto_Sans_JP'] hover:border-[#C9A84C] hover:bg-[#C9A84C]/10 transition-all"
                  >
                    <span>🗺</span>
                    地図
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* サロン募集バナー */}
        <div className={`mt-12 border border-[#C9A84C]/30 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-700 delay-300 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <div>
            <p className="font-['Cormorant_Garamond'] italic text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-2">For Salon Partners</p>
            <h3 className="font-['Shippori_Mincho'] text-white text-xl md:text-2xl font-bold mb-2">
              スカルプラボの認定サロンになりませんか？
            </h3>
            <p className="text-white/75 text-sm font-['Noto_Sans_JP'] font-light leading-relaxed">
              エステサロン・美容師の方向けに、頭皮チェックの技術講習と認定制度をご用意しています。
            </p>
          </div>
          <Link href="/salon">
            <span className="flex-shrink-0 border border-[#C9A84C] text-[#C9A84C] font-['Noto_Sans_JP'] font-medium text-sm px-8 py-3.5 hover:bg-[#C9A84C] hover:text-[#0D1B2A] transition-all duration-300 whitespace-nowrap cursor-pointer">
              認定サロン募集ページへ →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}


// ========== CTA ==========
function CTA() {
  return (
    <section className="relative bg-[#1C2B3A] py-24 overflow-hidden">
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #C9A84C22 0%, transparent 60%)" }}
      />
      <div className="max-w-4xl mx-auto px-6 text-center relative">
        <span className="font-['Cormorant_Garamond'] italic text-[#C9A84C] text-sm tracking-[0.4em] uppercase block mb-6">
          Start Your Journey
        </span>
        <h2 className="font-['Shippori_Mincho'] text-white text-3xl md:text-5xl font-bold mb-6 leading-tight">
          まず、自分の頭皮を<br />
          <span className="text-[#C9A84C]">知ることから始めよう。</span>
        </h2>
        <p className="text-white/80 text-sm font-['Noto_Sans_JP'] font-light mb-10 max-w-xl mx-auto leading-relaxed">
          初回の無料スカルプチェックは5〜10分。費用は一切かかりません。
          まずは現状を把握することが、すべての始まりです。
        </p>
        <button
          onClick={() => document.querySelector("#reservation")?.scrollIntoView({ behavior: "smooth" })}
          className="px-10 py-4 bg-[#C9A84C] text-[#0D1B2A] font-bold tracking-widest text-sm hover:bg-[#E8C97A] transition-all duration-300 inline-flex items-center gap-3 font-['Noto_Sans_JP']"
        >
          無料チェックを予約する
          <ArrowRight size={16} />
        </button>
      </div>
    </section>
  );
}

// ========== FOOTER ==========
function Footer() {
  return (
    <footer className="bg-[#0D1B2A] border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <span className="font-['Cormorant_Garamond'] italic text-[#C9A84C] text-xs tracking-[0.3em] uppercase block">Scalp Labo</span>
              <span className="text-white font-['Shippori_Mincho'] text-2xl">for Men</span>
            </div>
            {/* THE HERBS ブランドリンク */}
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
              <span className="font-['Cormorant_Garamond'] text-white/30 text-[10px] tracking-[0.15em] uppercase">by</span>
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/theherbs_logo_395db853.webp"
                alt="THE HERBS"
                className="h-3.5 w-auto brightness-0 invert opacity-50"
              />
            </div>
            <p className="text-white/65 text-xs leading-relaxed font-['Noto_Sans_JP']">
              男性のための頭皮定期チェックサービス。<br />
              データで頭皮を知り、自信ある毎日をサポートします。
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white/75 text-xs tracking-widest mb-4 font-['Noto_Sans_JP']">MENU</h4>
            <ul className="space-y-2">
              {[
                { label: "サービス", href: "#service" },
                { label: "お客様の声", href: "#testimonials" },
                { label: "よくある質問", href: "#faq" },
                { label: "ご予約", href: "#reservation" },
              ].map((l) => (
                <li key={l.href}>
                  <button
                    onClick={() => document.querySelector(l.href)?.scrollIntoView({ behavior: "smooth" })}
                    className="text-white/65 hover:text-[#C9A84C] text-xs transition-colors font-['Noto_Sans_JP']"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white/75 text-xs tracking-widest mb-4 font-['Noto_Sans_JP']">LEGAL</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-white/65 hover:text-[#C9A84C] text-xs transition-colors font-['Noto_Sans_JP']">プライバシーポリシー</Link></li>
              <li><Link href="/tokushoho" className="text-white/65 hover:text-[#C9A84C] text-xs transition-colors font-['Noto_Sans_JP']">特定商取引法に基づく表記</Link></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-white/10 pt-8 mb-6">
          <p className="text-white/55 text-xs leading-relaxed font-['Noto_Sans_JP']">
            【免責事項】本サービスは医療行為ではありません。疾病の診断・治療・予防を目的とするものではありません。
            医療的な相談が必要な場合は医師にご相談ください。掲載の数値・実績はすべて当社調べによるものです。
            個人の体験・効果には差があります。
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/50 text-xs font-['Noto_Sans_JP']">
            © 2025 スカルプラボ for Men. All rights reserved.
          </p>
          <Link href="/" className="text-[#C9A84C]/50 hover:text-[#C9A84C] text-xs transition-colors font-['Noto_Sans_JP']">
            ← スカルプラボ（女性版）はこちら
          </Link>
        </div>
      </div>
    </footer>
  );
}

// ========== MAIN ==========
export default function MenHome() {
  return (
    <div className="min-h-screen" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>
      <Nav />
      <Hero />
      <Problem />
      <ScalpGallery />
      <Concept />
      <Stats />
      <Service />
      <BotanicalMist />
      <Target />
      <Digital />
      <Flow />
      <Testimonials />
      <FAQ />
      <StoreSection />
      <Reservation />
      <CTA />
      <Footer />
    </div>
  );
}
