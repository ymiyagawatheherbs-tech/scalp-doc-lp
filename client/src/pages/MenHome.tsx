/**
 * THE HERBS SCALP LABO for Men — メンズ向けLP
 *
 * Design Philosophy: Dark Luxury（ダーク・ラグジュアリー）
 * - Color: Deep Navy oklch(0.14 0.04 140) × Charcoal oklch(0.20 0.06 140) × Gold oklch(0.69 0.060 130)
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
    { label: "植物の力", href: "#botanical-science" },
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
        style={{ width: `${progress}%`, background: "linear-gradient(90deg, oklch(0.69 0.060 130), oklch(0.72 0.1 130))" }}
      />
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "py-3 bg-[oklch(0.14 0.04 140)]/95 backdrop-blur-md border-b border-[oklch(0.69 0.060 130)]/20 shadow-lg shadow-black/30" : "py-3 md:py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between gap-4">
          {/* Logo: THE HERBSロゴマーク＋テキスト */}
          <Link href="/men" className="flex items-center gap-2.5 flex-shrink-0">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/logo_olive_12a41c11.webp"
              alt="THE HERBS"
              className="object-contain transition-all cursor-pointer"
              style={{
                height: "44px",
                width: "auto",
                filter: "brightness(0) invert(1)",
              }}
            />
            <div className="flex flex-col leading-none">
              {/* THE HERBS正式ロゴ画像（白ヌキ） */}
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/theherbs-logo-white_7a2a3209.webp"
                alt="THE HERBS"
                className="object-contain"
                style={{
                  height: "13px",
                  width: "auto",
                  marginBottom: "3px",
                }}
              />
              <span
                className="font-['Noto_Sans_JP']"
                style={{ fontSize: "0.55rem", letterSpacing: "0.15em", color: "rgba(201,168,76,0.7)" }}
              >
                SCALP LABO for Men
              </span>
            </div>
          </Link>

          {/* Desktop nav（中央配置） */}
          <div className="hidden lg:flex items-center gap-6 flex-1 justify-center">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className="text-white/70 hover:text-[oklch(0.69 0.060 130)] text-sm tracking-wider transition-colors duration-200 font-['Noto_Sans_JP'] whitespace-nowrap"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* サロン向けリンク */}
            <Link
              href="/salon"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[oklch(0.69 0.060 130)]/60 text-[oklch(0.69 0.060 130)]/80 text-xs tracking-wider hover:border-[oklch(0.69 0.060 130)] hover:text-[oklch(0.69 0.060 130)] transition-all duration-300 font-['Noto_Sans_JP'] whitespace-nowrap"
            >
              サロン向け
            </Link>
            {/* 女性版切り替えリンク */}
            <Link
              href="/"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-white/30 text-white/60 text-xs tracking-wider hover:border-white/70 hover:text-white/90 transition-all duration-300 font-['Noto_Sans_JP'] whitespace-nowrap"
            >
              <span className="text-[10px]">&#9792;</span>
              レディース版
            </Link>
            <a
              href="https://lin.ee/ulWWzab"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:flex items-center gap-1.5 px-4 py-2 border border-[oklch(0.69 0.060 130)] text-[oklch(0.69 0.060 130)] text-xs tracking-wider hover:bg-[oklch(0.69 0.060 130)] hover:text-[oklch(0.14 0.04 140)] transition-all duration-300 font-['Noto_Sans_JP'] whitespace-nowrap"
              style={{textDecoration: 'none'}}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" style={{flexShrink: 0}}><path d="M12 2C6.48 2 2 6.02 2 11c0 3.07 1.58 5.8 4.04 7.54L5.5 22l4.14-2.16C10.39 20.27 11.18 20.4 12 20.4c5.52 0 10-4.02 10-9S17.52 2 12 2z"/></svg>
              LINEで無料相談
            </a>
            {/* スマホ用CTAボタン */}
            <a
              href="https://lin.ee/ulWWzab"
              target="_blank"
              rel="noopener noreferrer"
              className="md:hidden px-3 py-1.5 border border-[oklch(0.69 0.060 130)] text-[oklch(0.69 0.060 130)] text-xs tracking-wider hover:bg-[oklch(0.69 0.060 130)] hover:text-[oklch(0.14 0.04 140)] transition-all duration-300 font-['Noto_Sans_JP']"
              style={{textDecoration: 'none'}}
            >
              LINE登録
            </a>
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
        <div className="fixed inset-0 z-40 bg-[oklch(0.14 0.04 140)] flex flex-col pt-24 px-8">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="py-5 text-left text-white/80 hover:text-[oklch(0.69 0.060 130)] text-xl font-['Shippori_Mincho'] border-b border-white/10 transition-colors"
            >
              {link.label}
            </button>
          ))}
          <Link
            href="/salon"
            className="mt-6 flex items-center justify-center gap-2 py-3 border border-[oklch(0.69 0.060 130)]/50 text-[oklch(0.69 0.060 130)] text-base tracking-wider hover:border-[oklch(0.69 0.060 130)] hover:bg-[oklch(0.69 0.060 130)]/10 transition-all duration-300 font-['Noto_Sans_JP']"
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
          <a
            href="https://lin.ee/ulWWzab"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 py-4 flex items-center justify-center gap-2 border border-[oklch(0.69 0.060 130)] text-[oklch(0.69 0.060 130)] text-lg tracking-wider hover:bg-[oklch(0.69 0.060 130)] hover:text-[oklch(0.14 0.04 140)] transition-all duration-300"
            style={{textDecoration: 'none'}}
            onClick={() => setMenuOpen(false)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{flexShrink: 0}}><path d="M12 2C6.48 2 2 6.02 2 11c0 3.07 1.58 5.8 4.04 7.54L5.5 22l4.14-2.16C10.39 20.27 11.18 20.4 12 20.4c5.52 0 10-4.02 10-9S17.52 2 12 2z"/></svg>
            LINEで無料相談（登録無料）
          </a>
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
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[oklch(0.14 0.04 140)]">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/men-hero-main_cae2a01a.jpg"
          alt="THE HERBS SCALP LABO for Men"
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.10 0.04 140)] via-[oklch(0.12 0.04 140)]/90 to-[oklch(0.14 0.04 140)]/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.10 0.04 140)] via-[oklch(0.12 0.04 140)]/40 to-transparent" />
      </div>

      {/* Gold line decoration */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-[oklch(0.69 0.060 130)] to-transparent opacity-60" />

      <div className="relative max-w-7xl mx-auto px-5 md:px-6 pt-20 md:pt-32 pb-16 md:pb-20">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="hidden md:flex items-center gap-3 mb-8">
            <div className="h-px w-12 bg-[oklch(0.69 0.060 130)]" />
            <span className="text-[oklch(0.69 0.060 130)] text-xs tracking-[0.4em] uppercase font-['Cormorant_Garamond'] italic">
              Men's Scalp Care
            </span>
          </div>

          {/* Main headline */}
          <h1 className="font-['Shippori_Mincho'] text-white leading-tight mb-4 md:mb-6" style={{ textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
            <span className="block text-2xl md:text-6xl font-bold mb-1 md:mb-2">
              頭皮の状態を、
            </span>
            <span className="block text-2xl md:text-6xl font-bold mb-1 md:mb-2">
              データで把握する。
            </span>
            <span className="block text-base md:text-2xl text-[oklch(0.85 0.12 90)] font-normal mt-2 md:mt-4 tracking-wider" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.9)' }}>
              抜け毛を未然に防ぎ、不安のない髪へ
            </span>
          </h1>

          <p className="hidden md:block text-white/95 text-base md:text-lg leading-relaxed mb-10 font-['Noto_Sans_JP'] font-light max-w-xl" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.7)' }}>
            THE HERBS SCALP LABO for Men は、マイクロスコープによる詳細な頭皮チェックと
            パーソナルデータの継続記録で、あなたの頭皮状態を科学的にサポートします。
          </p>
          <p className="md:hidden text-white/95 text-sm leading-relaxed mb-6 font-['Noto_Sans_JP'] font-light" style={{ textShadow: '0 1px 6px rgba(0,0,0,0.7)' }}>
            マイクロスコープで頭皮状態を記録・科学的にサポート。
          </p>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            <a
              href="https://lin.ee/ulWWzab"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 md:px-8 py-3.5 md:py-4 bg-[oklch(0.69 0.060 130)] text-white font-bold tracking-widest text-sm hover:bg-[oklch(0.72 0.1 130)] transition-all duration-300 flex items-center justify-center gap-2 font-['Noto_Sans_JP']"
              style={{textShadow: '0 1px 3px rgba(0,0,0,0.5)', textDecoration: 'none'}}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{flexShrink: 0}}>
                <path d="M12 2C6.48 2 2 6.02 2 11c0 3.07 1.58 5.8 4.04 7.54L5.5 22l4.14-2.16C10.39 20.27 11.18 20.4 12 20.4c5.52 0 10-4.02 10-9S17.52 2 12 2z"/>
              </svg>
              LINEで頭皮の悩みを相談する（無料）
            </a>
            <button
              onClick={() => document.querySelector("#service")?.scrollIntoView({ behavior: "smooth" })}
              className="hidden sm:flex px-8 py-4 border border-white/30 text-white/80 text-sm tracking-widest hover:border-[oklch(0.69 0.060 130)] hover:text-[oklch(0.69 0.060 130)] transition-all duration-300 font-['Noto_Sans_JP'] items-center justify-center"
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
                  <span className="text-[oklch(0.69 0.060 130)] font-['Cormorant_Garamond'] text-2xl md:text-3xl font-bold">{s.num}</span>
                  <span className="text-[oklch(0.69 0.060 130)] text-[10px] md:text-xs">{s.unit}</span>
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
        <ChevronDown size={16} className="text-[oklch(0.69 0.060 130)]" />
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
    <section className="bg-[oklch(0.14 0.04 140)] py-24 relative overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 40px, oklch(0.69 0.060 130) 40px, oklch(0.69 0.060 130) 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, oklch(0.69 0.060 130) 40px, oklch(0.69 0.060 130) 41px)" }}
      />
      <div className="max-w-7xl mx-auto px-6 relative">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px w-12 bg-[oklch(0.69 0.060 130)]" />
          <span className="text-[oklch(0.69 0.060 130)] text-xs tracking-[0.4em] uppercase font-['Cormorant_Garamond'] italic">The Problem</span>
        </div>
        <h2 className="font-['Shippori_Mincho'] text-white text-3xl md:text-4xl font-bold mb-16">
          男性の頭皮ケアに<br />
          <span className="text-[oklch(0.69 0.060 130)]">3つの課題</span>があります
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {problems.map((p) => (
            <div key={p.num} className="border border-white/10 p-6 md:p-8 hover:border-[oklch(0.69 0.060 130)]/40 transition-colors duration-300 group">
              <div className="font-['Cormorant_Garamond'] text-[oklch(0.69 0.060 130)]/30 text-6xl font-bold mb-4 group-hover:text-[oklch(0.69 0.060 130)]/50 transition-colors">
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
    statusBg: "oklch(0.69 0.060 130)",
    statusText: "oklch(0.14 0.04 140)",
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
    <section className="bg-[oklch(0.14 0.04 140)] py-24" id="scalp-gallery">
      <div className="max-w-7xl mx-auto px-6">
        {/* ヘッダー */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-[oklch(0.69 0.060 130)]" />
            <span className="text-[oklch(0.69 0.060 130)] text-xs tracking-[0.4em] uppercase font-['Cormorant_Garamond'] italic">Scalp Microscope Gallery</span>
            <div className="h-px w-12 bg-[oklch(0.69 0.060 130)]" />
          </div>
          <h2 className="font-['Shippori_Mincho'] text-white text-3xl md:text-4xl font-bold mb-4">
            あなたの頭皮は、<br />
            <span className="text-[oklch(0.69 0.060 130)]">どの状態に近いですか？</span>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="oklch(0.69 0.060 130)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
              </div>
            </div>
            <p className="text-white/30 text-[11px] text-center mt-2 font-['Noto_Sans_JP']">
              ※ THE HERBS SCALP LAB実際のマイクロスコープ撮影画像
            </p>
          </div>

          {/* 右：説明 */}
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-8 bg-[oklch(0.69 0.060 130)]" />
                <span className="font-['Cormorant_Garamond'] italic text-[oklch(0.69 0.060 130)] text-sm tracking-widest">{s.detail}</span>
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
                    active === i ? "ring-2 ring-[oklch(0.69 0.060 130)] opacity-100" : "opacity-40 hover:opacity-70"
                  }`}
                  style={{ aspectRatio: "1" }}
                  aria-label={st.label}
                >
                  <img src={st.img} alt={st.label} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="border border-[oklch(0.69 0.060 130)]/30 p-5 bg-[oklch(0.20 0.06 140)]">
              <p className="text-white/90 text-sm font-['Noto_Sans_JP'] font-light leading-relaxed mb-4">
                <span className="text-[oklch(0.69 0.060 130)] font-bold">あなたの頭皮は今、どんな状態？</span><br />
                実際にマイクロスコープで確認してみましょう。初回チェックは無料です。
              </p>
              <button
                onClick={() => {
                  const el = document.getElementById("reservation");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full py-3 bg-[oklch(0.69 0.060 130)] text-white font-['Noto_Sans_JP'] font-bold text-sm tracking-widest hover:bg-[oklch(0.72 0.1 130)] transition-all duration-300" style={{textShadow: '0 1px 3px rgba(0,0,0,0.5)'}}
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
    <section className="relative py-24 overflow-hidden" style={{ background: 'linear-gradient(135deg, oklch(0.16 0.06 140) 0%, oklch(0.22 0.08 140) 50%, oklch(0.16 0.06 140) 100%)' }}>
      {/* Decorative background accent */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, oklch(0.69 0.060 130), transparent)', transform: 'translate(30%, -30%)' }} />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-8" style={{ background: 'radial-gradient(circle, oklch(0.69 0.060 130), transparent)', transform: 'translate(-30%, 30%)' }} />
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-16 bg-[oklch(0.69 0.060 130)]" />
            <span className="text-[oklch(0.69 0.060 130)] text-xs tracking-[0.5em] uppercase font-['Cormorant_Garamond'] italic">Our Positioning</span>
            <div className="h-px w-16 bg-[oklch(0.69 0.060 130)]" />
          </div>
          <h2 className="font-['Shippori_Mincho'] text-white text-3xl md:text-5xl font-bold leading-tight mb-4">
            私たちが目指す<br />
            <span style={{ color: 'oklch(0.85 0.12 90)', textShadow: '0 0 40px oklch(0.69 0.060 130 / 0.5)' }}>ポジション</span>
          </h2>
          <p className="text-white/65 text-sm font-['Noto_Sans_JP'] max-w-xl mx-auto leading-relaxed">
            頭皮ケアの「定期検診」という新しい市場を、男性向けに開拓します。
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Visual */}
          <div className="relative">
            <div className="absolute inset-0 border border-[oklch(0.69 0.060 130)]/30 -m-3" />
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/men-microscope-check_bfd1313a.png"
              alt="マイクロスコープによる頭皮チェック"
              className="w-full object-cover relative"
              style={{ aspectRatio: "4/3" }}
            />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border border-[oklch(0.69 0.060 130)]/60" />
            <div className="absolute -top-4 -left-4 w-24 h-24 border border-[oklch(0.69 0.060 130)]/30" />
          </div>

          {/* Text */}
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-12 bg-[oklch(0.69 0.060 130)]" />
              <span className="text-[oklch(0.69 0.060 130)] text-xs tracking-[0.4em] uppercase font-['Cormorant_Garamond'] italic">Our Concept</span>
            </div>
            <h2 className="font-['Shippori_Mincho'] text-white text-3xl md:text-4xl font-bold mb-6 leading-tight">
              歯科検診のように、<br />
              <span className="text-[oklch(0.85 0.12 90)]">頭皮も定期的に</span><br />
              チェックする時代へ。
            </h2>
            <p className="text-white/80 text-sm leading-relaxed mb-6 font-['Noto_Sans_JP'] font-light">
              虫歯になってから歯医者に行くのではなく、定期的に通って予防するように。
              THE HERBS SCALP LABO for Men は、頭皮の状態を定期的に記録・確認する習慣を、
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
                  <Check size={14} className="text-[oklch(0.69 0.060 130)] mt-0.5 shrink-0" />
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
    <section ref={ref} className="bg-[oklch(0.14 0.04 140)] py-20 border-y border-[oklch(0.69 0.060 130)]/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-[oklch(0.69 0.060 130)]/20">
          {[
            { count: c1, suffix: "代", prefix: "", label: "男性の薄毛悩みが急増している年代", note: "（当社調べ・2024年度）" },
            { count: c2, suffix: "%", prefix: "", label: "男性会員の継続利用率", note: "（当社調べ・2024年度・N=320名）" },
            { count: c3, suffix: "名以上", prefix: "", label: "男性会員数", note: "（2025年3月時点）" },
          ].map((s, i) => (
            <div key={i} className="py-12 px-8 text-center">
              <div className="font-['Cormorant_Garamond'] text-[oklch(0.69 0.060 130)] text-6xl md:text-7xl font-bold mb-2">
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
      title: "THE HERBS SCALP LAB定期ケア",
      subtitle: "継続的な頭皮モニタリングと記録",
      duration: "所要 30〜40分",
      price: "3,000。5,000円/回",
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
    <section id="service" className="bg-[oklch(0.20 0.06 140)] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px w-12 bg-[oklch(0.69 0.060 130)]" />
          <span className="text-[oklch(0.69 0.060 130)] text-xs tracking-[0.4em] uppercase font-['Cormorant_Garamond'] italic">Our Service</span>
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.14 0.04 140)]/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="font-['Cormorant_Garamond'] italic text-[oklch(0.69 0.060 130)] text-sm tracking-widest">{s.step}</span>
                  </div>
                </div>
              </div>
              <div className={i % 2 === 1 ? "md:order-1" : ""}>
                <span className="font-['Cormorant_Garamond'] italic text-[oklch(0.69 0.060 130)] text-sm tracking-widest block mb-2">{s.step}</span>
                <h3 className="font-['Shippori_Mincho'] text-white text-2xl md:text-3xl font-bold mb-2">{s.title}</h3>
                <p className="text-white/80 text-sm mb-1 font-['Noto_Sans_JP']">{s.subtitle}</p>
                <div className="flex gap-4 mb-6 mt-4">
                  <span className="text-[oklch(0.69 0.060 130)] text-xs border border-[oklch(0.69 0.060 130)]/40 px-3 py-1 font-['Noto_Sans_JP']">{s.duration}</span>
                  <span className="text-[oklch(0.69 0.060 130)] text-xs border border-[oklch(0.69 0.060 130)]/40 px-3 py-1 font-['Noto_Sans_JP']">
                    {s.price}
                    {s.price !== "無料" && s.price !== "相談" && <span style={{ fontSize: "0.55rem", opacity: 0.7 }}>（税別）</span>}
                  </span>
                </div>
                <ul className="space-y-3">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <div className="w-1 h-1 rounded-full bg-[oklch(0.69 0.060 130)] mt-2 shrink-0" />
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

// ========== BOTANICAL SCIENCE ==========
function BotanicalScience() {
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

  // 男性に多い悩みに対応する3ブレンドを中心に紹介
  const menBlends = [
    {
      code: "FEU",
      kana: "フー",
      theme: "エイジングケア",
      concerns: ["加齢によるうねり・ボリューム低下", "皮脂の酸化・頭皮のニオイ", "ハリ・コシの低下"],
      effect: "抗酸化・血行促進・引き締め作用が特性とされる植物のブレンド。加齢による頭皮の変化にアプローチし、ハリのある頭皮環境をサポートするとされています。",
      accent: "oklch(0.70 0.050 55)",
      accentHex: "#c9a84c",
    },
    {
      code: "GRISE",
      kana: "グリーゼ",
      theme: "頭皮環境改善",
      concerns: ["弱った頭皮・細くなった髪", "薬剤使用後の頭皮ケア", "うねり・頭皮の炎症"],
      effect: "抗菌・抗炎症・鎮静作用が特性とされる植物のブレンド。頭皮の常在菌バランスを整え、すこやかな頭皮環境をサポートするとされています。",
      accent: "oklch(0.60 0.030 155)",
      accentHex: "#6aad8a",
    },
    {
      code: "TILLEUL",
      kana: "ティユール",
      theme: "皮脂バランス",
      concerns: ["皮脂過多・フケ", "細くなった髪・パーマが当たりにくい", "頭皮のべたつき"],
      effect: "収れん作用・抗菌作用が特性とされる植物のブレンド。過剰な皮脂分泌を穏やかに整え、頭皮環境のバランスをサポートするとされています。",
      accent: "oklch(0.68 0.055 105)",
      accentHex: "#a8c060",
    },
  ];

  return (
    <section
      className="relative py-24 overflow-hidden"
      id="botanical-science"
      style={{ background: "linear-gradient(160deg, oklch(0.12 0.04 140) 0%, oklch(0.18 0.05 145) 100%)" }}
    >
      {/* 背景装飾 */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(100,160,80,0.06) 0%, transparent 70%)", transform: "translate(30%, -30%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(201,168,76,0.04) 0%, transparent 70%)", transform: "translate(-20%, 20%)" }}
        />
      </div>

      <div ref={ref} className="max-w-7xl mx-auto px-6 relative">
        {/* ヘッダー */}
        <div className={`mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span
            className="font-['Cormorant_Garamond'] block mb-4 tracking-[0.3em] uppercase text-sm"
            style={{ color: "oklch(0.69 0.060 130)" }}
          >
            Botanical Science
          </span>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2
                className="font-['Shippori_Mincho_B1'] text-3xl md:text-4xl font-bold leading-tight mb-6"
                style={{ color: "rgba(255,255,255,0.95)" }}
              >
                頭皮の悩みに、<br />
                <span style={{ color: "oklch(0.69 0.060 130)" }}>植物の力で応える。</span>
              </h2>
              <div className="h-px w-16 mb-6" style={{ backgroundColor: "oklch(0.69 0.060 130)" }} />
              <p
                className="font-['Noto_Sans_JP'] text-sm leading-relaxed mb-4"
                style={{ color: "rgba(255,255,255,0.70)" }}
              >
                男性の頭皮は、皮脂分泌量が女性の約2倍とされています。過剰な皮脂は毛穴を詰まらせ、頭皮環境の乱れを引き起こす原因のひとつとされています。THE HERBSでは、頭皮チェックの結果をもとに、男性の頭皮状態に合ったハーブブレンドをセレクトしてケアを行います。
              </p>
              <p
                className="font-['Noto_Sans_JP'] text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                各ブレンドは4種のハーブで構成されており、頭皮の状態（皮脂量・水分量・毛穴の詰まり・炎症の有無）に応じて最適なものをご提案します。
              </p>
            </div>
            <div className="relative overflow-hidden" style={{ height: "280px", borderRadius: "2px" }}>
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/herbs_bowl_094A5982_939efeed.jpg"
                alt="頭皮状態に合わせてブレンドするハーブ"
                className="w-full h-full object-cover"
                style={{ objectPosition: "center 40%", filter: "brightness(0.85) saturate(0.9)" }}
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to right, rgba(18,28,20,0.5) 0%, transparent 60%)" }}
              />
            </div>
          </div>
        </div>

        {/* 3ブレンドグリッド */}
        <div className={`grid md:grid-cols-3 gap-6 mb-12 transition-all duration-700 delay-200 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {menBlends.map((blend, i) => (
            <div
              key={i}
              className="p-6"
              style={{
                background: "oklch(0.18 0.05 140)",
                borderTop: `3px solid ${blend.accentHex}`,
                transitionDelay: `${i * 100}ms`,
              }}
            >
              {/* ブレンド名 */}
              <div className="mb-4">
                <div className="flex items-baseline gap-2 mb-2">
                  <span
                    className="font-['Cormorant_Garamond'] text-2xl font-bold tracking-wider"
                    style={{ color: blend.accentHex }}
                  >
                    {blend.code}
                  </span>
                  <span
                    className="font-['Noto_Sans_JP'] text-xs"
                    style={{ color: "rgba(255,255,255,0.50)" }}
                  >
                    {blend.kana}
                  </span>
                </div>
                <span
                  className="font-['Noto_Sans_JP'] text-xs font-bold tracking-wider px-2 py-0.5 inline-block"
                  style={{ backgroundColor: `${blend.accentHex}22`, color: blend.accentHex }}
                >
                  {blend.theme}
                </span>
              </div>
              {/* 対応する悩み */}
              <ul className="space-y-1.5 mb-4">
                {blend.concerns.map((c, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <span className="text-xs mt-0.5 flex-shrink-0" style={{ color: blend.accentHex }}>—</span>
                    <span
                      className="font-['Noto_Sans_JP'] text-xs leading-relaxed"
                      style={{ color: "rgba(255,255,255,0.70)" }}
                    >
                      {c}
                    </span>
                  </li>
                ))}
              </ul>
              {/* 植物科学的特性 */}
              <div className="pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.10)" }}>
                <p
                  className="font-['Noto_Sans_JP'] text-[10px] leading-relaxed italic"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  {blend.effect}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ハーブジャー画像 */}
        <div
          className={`overflow-hidden mb-12 transition-all duration-700 delay-300 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ height: "220px" }}
        >
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/094A5819_cb840e92.jpg"
            alt="THE HERBSのハーブジャーコレクション"
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 60%", filter: "brightness(0.75) saturate(0.8)" }}
          />
        </div>

        {/* カスタムブレンドの説明 */}
        <div
          className={`p-8 md:p-10 transition-all duration-700 delay-400 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ background: "oklch(0.22 0.06 140)", borderLeft: "4px solid oklch(0.69 0.060 130)" }}
        >
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <span
                className="font-['Cormorant_Garamond'] text-xs tracking-[0.3em] uppercase block mb-3"
                style={{ color: "oklch(0.69 0.060 130)" }}
              >
                Custom Herb Blend
              </span>
              <h3
                className="font-['Shippori_Mincho_B1'] text-2xl font-bold mb-4"
                style={{ color: "rgba(255,255,255,0.95)" }}
              >
                頭皮の状態に合わせた、<br />オーダーメイドのハーブケア
              </h3>
              <p
                className="font-['Noto_Sans_JP'] text-sm leading-relaxed"
                style={{ color: "rgba(255,255,255,0.70)" }}
              >
                頭皮チェックで皮脂量・水分量・毛穴の詰まり・炎症の有無を確認した後、その結果に基づいて最適なブレンドをセレクトします。同じ「抜け毛」の悩みでも、原因が皮脂過多なのか、乾燥なのか、加齢なのかによって、最適なブレンドは異なります。
              </p>
            </div>
            <div className="text-center">
              <div
                className="font-['Cormorant_Garamond'] text-6xl font-light mb-2"
                style={{ color: "oklch(0.69 0.060 130)" }}
              >
                6
              </div>
              <p
                className="font-['Noto_Sans_JP'] text-xs tracking-wider"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                種類のハーブブレンド<br />各4種のハーブで構成
              </p>
            </div>
          </div>
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
      icon: "🌿",
      title: "植物由来の蕲気抽出成分",
      desc: "ハーブスチーマーにより植物から蕲気抽出した成分を頭皮に届けます。化学合成ではなく、天然ハーブの持つ浄化・保湿・整肌作用をそのまま頭皮に届けます。",
    },
    {
      icon: "💧",
      title: "超微細蕲気が毛穴の奥まで浸透",
      desc: "液体では届かない頭皮の角質層まで、超微細な蕲気粒子が浸透します。毛穴に蓄積した皮脂・薬剤・汚れを浄化し、頭皮本来の吸収力を高めます。",
    },
    {
      icon: "✨",
      title: "引き算のリセットケア",
      desc: "トリートメントのように「足す」のではなく、余分な皮脂・薬剤残留物を「取り去る」リセットケア。素の頭皮本来の力を引き出します。",
    },
    {
      icon: "💚",
      title: "保湿・整肌ケア",
      desc: "浄化後は植物成分の保湿ケアを行います。乾燥した頭皮に潤いを与え、皮脂分泌のバランスを整えることで、健康な頭皮環境をサポートします。",
    },
    {
      icon: "🌸",
      title: "カラー・パーマ後の薬剤浄化",
      desc: "アルカリカラーやパーマ後に残留する薬剤を天然ハーブの蕲気成分で浄化。頭皮への負担を軽減し、ケア後の頭皮環境を整えます。",
    },
    {
      icon: "🌼",
      title: "季節変化に対応したハーブ配合",
      desc: "季節や頭皮状態に応じてハーブ配合を調整。季節の変わり目に大きく変化する頭皮状態に対応したリセットケアを提供します。",
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden" id="botanical-mist"
      style={{ background: "linear-gradient(160deg, oklch(0.14 0.04 140) 0%, oklch(0.20 0.06 140) 100%)" }}
    >
      {/* 背景装飾 */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(80,120,60,0.08) 0%, transparent 70%)", transform: "translate(20%, -20%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(80,120,60,0.06) 0%, transparent 70%)", transform: "translate(-20%, 20%)" }}
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
                style={{ boxShadow: "inset 0 0 0 1px oklch(0.69 0.060 130)40" }}
              />
              <div className="absolute bottom-4 left-4 font-['Noto_Sans_JP'] text-xs font-bold px-4 py-2" style={{ backgroundColor: "oklch(0.69 0.060 130)", color: "oklch(0.14 0.04 140)" }}>
                THE HERBS ボタニカルミスト
              </div>
            </div>
          </div>

          {/* テキスト（右） */}
          <div className="flex-1 order-1 lg:order-2">
            <span className="font-['Cormorant_Garamond'] italic text-sm tracking-[0.4em] uppercase block mb-4" style={{ color: "oklch(0.69 0.060 130)" }}>
              Botanical Mist Technology
            </span>
            <h2 className="font-['Shippori_Mincho'] text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight" style={{ color: "#ffffff" }}>
              定期チェックは、<br />
              <span style={{ color: "oklch(0.69 0.060 130)" }}>頭皮リセットから始まる。</span>
            </h2>
            <p className="text-sm font-['Noto_Sans_JP'] font-light leading-relaxed mb-6 max-w-lg" style={{ color: "rgba(255,255,255,0.85)" }}>
              ボタニカルミスト（ハーブスチーマー）は、定期チェックの最初に行う「頭皮リセット」プログラムです。
              毛穴に蓄積した皮脂・薬剤・汚れを蕲気抽出した植物成分で浄化、保湿ケアを行います。
              頭皮本来の吸収力を高め、素の頭皮の力を引き出します。
            </p>
            {/* ボタニカルミストの特徴バッジ */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-2 px-4 py-2" style={{ backgroundColor: "rgba(80,120,60,0.2)", border: "1px solid rgba(100,150,80,0.4)" }}>
                <span className="text-xs font-['Noto_Sans_JP']" style={{ color: "rgba(255,255,255,0.85)" }}>🌿 植物由来の天然成分</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2" style={{ backgroundColor: "rgba(80,120,60,0.2)", border: "1px solid rgba(100,150,80,0.4)" }}>
                <span className="text-xs font-['Noto_Sans_JP']" style={{ color: "rgba(255,255,255,0.85)" }}>💧 超微細蕲気で毛穴浸透</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2" style={{ backgroundColor: "rgba(80,120,60,0.2)", border: "1px solid rgba(100,150,80,0.4)" }}>
                <span className="text-xs font-['Noto_Sans_JP']" style={{ color: "rgba(255,255,255,0.85)" }}>✨ 浄化＋保湿ケア</span>
              </div>
            </div>
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
              style={{ backgroundColor: "oklch(0.20 0.06 140)", transitionDelay: `${i * 100}ms` }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "oklch(0.25 0.040 130)")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "oklch(0.20 0.06 140)")}
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
            ボタニカルミストは定期チェックのすべてのコースに含まれています
          </p>
          <button
            onClick={() => document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-10 py-4 font-bold tracking-widest text-sm transition-all duration-300 font-['Noto_Sans_JP'] text-white"
            style={{ backgroundColor: "oklch(0.69 0.060 130)", textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "oklch(0.72 0.1 130)")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "oklch(0.69 0.060 130)")}
          >
            頭皮リセット＋チェックを予約する
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
    <section className="bg-[oklch(0.20 0.06 140)] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px w-12 bg-[oklch(0.69 0.060 130)]" />
          <span className="text-[oklch(0.69 0.060 130)] text-xs tracking-[0.4em] uppercase font-['Cormorant_Garamond'] italic">For You</span>
        </div>
        <h2 className="font-['Shippori_Mincho'] text-white text-3xl md:text-4xl font-bold mb-16">
          こんな方に選ばれています
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {targets.map((t) => (
            <div key={t.title} className="border-l-2 border-[oklch(0.69 0.060 130)]/40 pl-5 md:pl-6 hover:border-[oklch(0.69 0.060 130)] transition-colors duration-300">
              <div className="text-3xl mb-4">{t.icon}</div>
              <h3 className="font-['Shippori_Mincho'] text-white text-xl font-bold mb-2">{t.title}</h3>
              <p className="text-[oklch(0.69 0.060 130)] text-sm italic font-['Cormorant_Garamond'] mb-3">{t.message}</p>
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
    <section className="py-24 border-t border-[oklch(0.69 0.060 130)]/20" style={{ backgroundColor: "oklch(0.14 0.04 140)" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <p className="text-xs tracking-[0.3em] text-[oklch(0.69 0.060 130)] mb-4 font-['Noto_Sans_JP']" style={{ fontFamily: "'Noto Sans JP', sans-serif" }}>SCALP LABO DIGITAL REPORT</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Shippori Mincho', serif", color: "#ffffff" }}>
              THE HERBS SCALP LABO<br />
              <span style={{ color: "oklch(0.69 0.060 130)" }}>デジタルレポート</span>
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
                  <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "oklch(0.69 0.060 130)", fontSize: "10px", color: "oklch(0.14 0.04 140)", fontWeight: 700 }}>✓</span>
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
                style={{ backgroundColor: "oklch(0.20 0.06 140)", borderColor: "rgba(201,168,76,0.3)" }}
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
                style={{ backgroundColor: "oklch(0.20 0.06 140)", borderColor: "rgba(201,168,76,0.3)" }}
              >
                <svg viewBox="0 0 24 24" className="w-7 h-7" fill="white"><path d="M3.18 23.76c.3.17.64.24.99.2l12.6-7.27-2.72-2.72-10.87 9.79zm-1.7-20.4C1.18 3.7 1 4.08 1 4.56v14.88c0 .48.18.86.48 1.2l.07.06 8.34-8.34v-.2L1.55 3.82l-.07.06-.07.06zM20.49 10.7l-2.81-1.62-3.06 3.06 3.06 3.06 2.83-1.63c.81-.46.81-1.22-.02-1.87zm-18.3 12.3l.07-.06 9.4-9.4-2.72-2.72-6.75 12.18z"/></svg>
                <div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Noto Sans JP', sans-serif" }}>GET IT ON</div>
                  <div className="text-sm font-semibold" style={{ color: "#ffffff", fontFamily: "'Noto Sans JP', sans-serif" }}>Google Play</div>
                </div>
              </a>
            </div>
          </div>
          {/* App Screenshots — staggered layout (same as ladies' site) */}
          <div className="flex justify-center items-start gap-5" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
            {/* Left: top-aligned */}
            <div style={{ width: '47%', marginTop: '0' }}>
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/app_screen_log_78a5d0f2.png"
                alt="スカルププログ アプリ画面"
                className="w-full object-contain rounded-2xl"
                style={{ boxShadow: '0 12px 48px rgba(0,0,0,0.55)' }}
              />
              <p className="text-center text-xs mt-3" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Noto Sans JP', sans-serif", letterSpacing: '0.05em' }}>スカルププログ</p>
            </div>
            {/* Right: staggered 60px down */}
            <div style={{ width: '47%', marginTop: '60px' }}>
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/app_screen_advice_1bc0e66a.png"
                alt="スカルプアドバイス アプリ画面"
                className="w-full object-contain rounded-2xl"
                style={{ boxShadow: '0 12px 48px rgba(0,0,0,0.55)' }}
              />
              <p className="text-center text-xs mt-3" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Noto Sans JP', sans-serif", letterSpacing: '0.05em' }}>スカルプアドバイス</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ========== FLOW ==========
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
    <section id="testimonials" className="bg-[oklch(0.14 0.04 140)] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px w-12 bg-[oklch(0.69 0.060 130)]" />
          <span className="text-[oklch(0.69 0.060 130)] text-xs tracking-[0.4em] uppercase font-['Cormorant_Garamond'] italic">Testimonials</span>
        </div>
        <h2 className="font-['Shippori_Mincho'] text-white text-3xl md:text-4xl font-bold mb-4">
          お客様の声
        </h2>
        <p className="text-white/65 text-xs font-['Noto_Sans_JP'] mb-16">
          ※ 個人の感想です。効果・体験には個人差があります。
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="border border-white/10 p-5 md:p-6 hover:border-[oklch(0.69 0.060 130)]/30 transition-colors duration-300">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} size={12} className={j < t.stars ? "text-[oklch(0.69 0.060 130)] fill-[oklch(0.69 0.060 130)]" : "text-white/20"} />
                ))}
              </div>
              <p className="font-['Shippori_Mincho'] text-[oklch(0.69 0.060 130)] text-sm font-bold mb-3">{t.highlight}</p>
              <p className="text-white/80 text-sm leading-relaxed font-['Noto_Sans_JP'] font-light mb-6">{t.body}</p>
              <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                <div className="w-8 h-8 rounded-full bg-[oklch(0.20 0.06 140)] border border-[oklch(0.69 0.060 130)]/30 flex items-center justify-center">
                  <span className="text-[oklch(0.69 0.060 130)] text-xs font-['Cormorant_Garamond']">{t.name[0]}</span>
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
      a: "THE HERBS SCALP LABO for Men は医療行為ではありません。マイクロスコープによる頭皮の撮影・記録・確認を行うサービスです。疾病の診断・治療・予防を目的とするものではありません。頭皮や毛髪に関する医療的なご相談は、皮膚科・AGAクリニック等の医療機関にご相談ください。",
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
      a: "AGAクリニックは医療機関であり、薬の処方・医療的治療を行う場所です。THE HERBS SCALP LABO for Men は医療行為を行わず、頭皮状態の記録・確認とケアのご提案を行うサービスです。「まず状態を知りたい」「予防的に管理したい」という方に適しています。深刻な症状が見られた場合は医療機関をご紹介します。",
    },
    {
      q: "LINEに登録すると何が届きますか？",
      a: "登録直後に「頭皮チェックとは？」の教育コンテンツをお届けします。その後、頭皮タイプ診断のご案内（3日後）、無料スカルプチェックの予約案内（7日後）、ビフォーアフター事例（14日後）、期間限定の特典情報（21日後）を順番にお送りします。一斉配信（スパム）は行いません。",
    },
    {
      q: "勧誘や営業メッセージは届きますか？",
      a: "しつこい勧誘や営業メッセージはお送りしません。THE HERBSからのお知らせは、頭皮ケアに役立つ情報・予約案内・ケアアドバイスが中心です。不要と感じた場合は、いつでもLINEのブロック機能でメッセージを止めることができます。",
    },
    {
      q: "LINE登録は無料ですか？費用はかかりますか？",
      a: "LINE登録は完全無料です。登録後のステップ配信（自動メッセージ）も費用はかかりません。実際のサロン施術については、各メニューの料金が発生します。初回の無料スカルプチェックは、予約後にサロンにてご体験いただけます。",
    },
  ];

  return (
    <section id="faq" className="bg-[oklch(0.20 0.06 140)] py-24">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px w-12 bg-[oklch(0.69 0.060 130)]" />
          <span className="text-[oklch(0.69 0.060 130)] text-xs tracking-[0.4em] uppercase font-['Cormorant_Garamond'] italic">FAQ</span>
        </div>
        <h2 className="font-['Shippori_Mincho'] text-white text-3xl md:text-4xl font-bold mb-16">
          よくあるご質問
        </h2>
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-white/10 hover:border-[oklch(0.69 0.060 130)]/30 transition-colors">
              <button
                className="w-full flex items-center justify-between p-6 text-left"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="text-white font-['Shippori_Mincho'] font-bold text-sm pr-4">{faq.q}</span>
                {open === i ? (
                  <ChevronUp size={16} className="text-[oklch(0.69 0.060 130)] shrink-0" />
                ) : (
                  <ChevronDown size={16} className="text-[oklch(0.69 0.060 130)] shrink-0" />
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
      <section id="reservation" className="bg-[oklch(0.14 0.04 140)] py-24">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="w-16 h-16 border-2 border-[oklch(0.69 0.060 130)] flex items-center justify-center mx-auto mb-8">
            <Check size={28} className="text-[oklch(0.69 0.060 130)]" />
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
    <section id="reservation" className="bg-[oklch(0.14 0.04 140)] py-24">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px w-12 bg-[oklch(0.69 0.060 130)]" />
          <span className="text-[oklch(0.69 0.060 130)] text-xs tracking-[0.4em] uppercase font-['Cormorant_Garamond'] italic">Reservation</span>
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
                お名前 <span className="text-[oklch(0.69 0.060 130)]">*</span>
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[oklch(0.20 0.06 140)] border border-white/10 focus:border-[oklch(0.69 0.060 130)] text-white px-4 py-3 text-sm outline-none transition-colors font-['Noto_Sans_JP']"
                placeholder="山田 太郎"
              />
              {errors.name && <p className="text-red-400 text-xs mt-1 font-['Noto_Sans_JP']">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-white/70 text-xs mb-2 font-['Noto_Sans_JP'] tracking-wider">
                電話番号 <span className="text-[oklch(0.69 0.060 130)]">*</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full bg-[oklch(0.20 0.06 140)] border border-white/10 focus:border-[oklch(0.69 0.060 130)] text-white px-4 py-3 text-sm outline-none transition-colors font-['Noto_Sans_JP']"
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
              className="w-full bg-[oklch(0.20 0.06 140)] border border-white/10 focus:border-[oklch(0.69 0.060 130)] text-white px-4 py-3 text-sm outline-none transition-colors font-['Noto_Sans_JP']"
              placeholder="example@email.com"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white/70 text-xs mb-2 font-['Noto_Sans_JP'] tracking-wider">
                ご希望日 <span className="text-[oklch(0.69 0.060 130)]">*</span>
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full bg-[oklch(0.20 0.06 140)] border border-white/10 focus:border-[oklch(0.69 0.060 130)] text-white px-4 py-3 text-sm outline-none transition-colors font-['Noto_Sans_JP']"
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
                className="w-full bg-[oklch(0.20 0.06 140)] border border-white/10 focus:border-[oklch(0.69 0.060 130)] text-white px-4 py-3 text-sm outline-none transition-colors font-['Noto_Sans_JP']"
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
              ご希望のコース <span className="text-[oklch(0.69 0.060 130)]">*</span>
            </label>
            <select
              value={form.course}
              onChange={(e) => setForm({ ...form, course: e.target.value })}
              className="w-full bg-[oklch(0.20 0.06 140)] border border-white/10 focus:border-[oklch(0.69 0.060 130)] text-white px-4 py-3 text-sm outline-none transition-colors font-['Noto_Sans_JP']"
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
              className="w-full bg-[oklch(0.20 0.06 140)] border border-white/10 focus:border-[oklch(0.69 0.060 130)] text-white px-4 py-3 text-sm outline-none transition-colors resize-none font-['Noto_Sans_JP']"
              placeholder="気になる症状・ご要望などをご記入ください"
            />
          </div>

          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.privacy}
                onChange={(e) => setForm({ ...form, privacy: e.target.checked })}
                className="mt-1 accent-[oklch(0.69 0.060 130)]"
              />
              <span className="text-white/60 text-xs font-['Noto_Sans_JP'] leading-relaxed">
                <Link href="/privacy" className="text-[oklch(0.69 0.060 130)] hover:underline">プライバシーポリシー</Link>に同意します。
                ご入力いただいた個人情報は予約確認・サービス提供の目的のみに使用し、第三者への提供は行いません。
              </span>
            </label>
            {errors.privacy && <p className="text-red-400 text-xs mt-1 font-['Noto_Sans_JP']">{errors.privacy}</p>}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-[oklch(0.69 0.060 130)] text-white font-bold tracking-widest text-sm hover:bg-[oklch(0.72 0.1 130)] transition-all duration-300 flex items-center justify-center gap-2 font-['Noto_Sans_JP'] disabled:opacity-60 disabled:cursor-not-allowed" style={{textShadow: '0 1px 3px rgba(0,0,0,0.5)'}}
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
      name: "THE HERBS神戸阪急店",
      nameEn: "THE HERBS Kobe Hankyu",
      badge: "百貨店内サロン",
      address: "兵庫県神戸市中央区小野柄通8丁目1番8号",
      address2: "神戸阪急本館6階 モーニングフロー内",
      hours: [
        { day: "営業時間", time: "10:00 ～ 20:00" },
      ],
      closed: "1月1日～2日",
      line: "https://lin.ee/P8Jppiu",
      lineId: "@theherbs_kobe",
      bookingUrl: "/booking",
      features: ["頭皮チェック", "ハーブスチーマー（ボタニカルミスト）", "頭皮データの記録・管理"],
      mapUrl: "https://maps.google.com/?q=兵庫県神戸市中央区小野柄通8丁目1番8号+神戸阪急本館6階",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3281.0!2d135.19476!3d34.69344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000e6f7b8e5a3a3%3A0x5b1e2c3d4e5f6a7b!2z56aP5oi45YWD5pys5pys6aSo6Ziz5bGxIOOBiOOBj-OBhOOBhOOBhA!5e0!3m2!1sja!2sjp!4v1700000000000!5m2!1sja!2sjp",
    },
    {
      id: "nada",
      name: "THE HERBS植物美容サロン",
      nameEn: "THE HERBS Botanical Beauty Salon",
      badge: "直営ヘッドスパサロン",
      address: "兵庫県神戸市灘区大内通1-7-17 1F",
      address2: "",
      hours: [
        { day: "営業時間", time: "10:00 ～ 20:00" },
      ],
      closed: "火曜・日曜・祝日定休",
      line: "https://lin.ee/ulWWzab",
      lineId: "@theherbs39",
      bookingUrl: "https://book.squareup.com/appointments/jsufqo133zf3ec/location/LEWSC49JS30BF/services",
      features: ["育毛メニュー", "ディープクレンジング", "ヘアカラー後頭皮ケア", "和漢カラー"],
      mapUrl: "https://maps.app.goo.gl/a96J7E9gnPBXi9tA6",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3279.8!2d135.2257085!3d34.7128842!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60008dba49ad1097%3A0x351be9b6133f830b!2sMODE+VERDE+%E3%82%B5%E3%83%AD%E3%83%B3!5e0!3m2!1sja!2sjp!4v1700000000001!5m2!1sja!2sjp",
    },
  ];

  return (
    <section className="bg-[oklch(0.14 0.04 140)] py-24 border-t border-[oklch(0.69 0.060 130)]/20" id="store">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        {/* ヘッダー */}
        <div className={`mb-16 transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-['Cormorant_Garamond'] italic text-[oklch(0.69 0.060 130)] text-sm tracking-[0.4em] uppercase block mb-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stores.map((store, i) => (
            <div
              key={store.id}
              className={`border border-[oklch(0.69 0.060 130)]/20 hover:border-[oklch(0.69 0.060 130)]/50 transition-all duration-500 overflow-hidden ${
                visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {/* マップエリア */}
              <div className="relative h-48 overflow-hidden bg-[oklch(0.20 0.06 140)]">
                <iframe
                  title={store.name}
                  src={store.mapEmbed}
                  className="w-full h-full border-0 opacity-80"
                  style={{ pointerEvents: 'none' }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                {/* iframe全体を覆うクリック可能な透明オーバーレイ（マップで開く） */}
                <a
                  href={store.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-10"
                  aria-label={`${store.name}の地図を開く`}
                />
                <div className="absolute top-3 left-3 font-['Noto_Sans_JP'] text-[oklch(0.14 0.04 140)] text-xs font-bold px-3 py-1 bg-[oklch(0.69 0.060 130)] z-20">
                  {store.badge}
                </div>
              </div>

              {/* 情報エリア */}
              <div className="p-7 bg-[oklch(0.20 0.06 140)]">
                <div className="mb-5">
                  <p className="font-['Cormorant_Garamond'] text-[oklch(0.69 0.060 130)] text-xs tracking-widest uppercase mb-1">
                    {store.nameEn}
                  </p>
                  <h3 className="font-['Shippori_Mincho'] text-white text-xl font-bold">
                    {store.name}
                  </h3>
                </div>

                {/* 住所 */}
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-[oklch(0.69 0.060 130)] text-sm mt-0.5 flex-shrink-0">📍</span>
                  <div className="text-white/80 text-sm font-['Noto_Sans_JP'] leading-relaxed">
                    <p>{store.address}</p>
                    {store.address2 && <p>{store.address2}</p>}
                  </div>
                </div>

                {/* 営業時間 */}
                <div className="flex items-start gap-3 mb-5">
                  <span className="text-[oklch(0.69 0.060 130)] text-sm mt-0.5 flex-shrink-0">🕐</span>
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
                      className="text-[oklch(0.69 0.060 130)] text-xs border border-[oklch(0.69 0.060 130)]/30 px-2.5 py-1 font-['Noto_Sans_JP']"
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
                      <path d="M12 2C6.48 2 2 6.02 2 11c0 3.07 1.58 5.8 4.04 7.54L5.5 22l4.14-2.16C10.39 20.27 11.18 20.4 12 20.4c5.52 0 10-4.02 10-9S17.52 2 12 2z"/>
                    </svg>
                    LINEで相談・登録（無料）
                  </a>
                  <a
                    href={(store as any).bookingUrl || '/booking'}
                    target={(store as any).bookingUrl?.startsWith('http') ? '_blank' : '_self'}
                    rel={(store as any).bookingUrl?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex-1 flex items-center justify-center gap-2 text-xs font-bold py-3 font-['Noto_Sans_JP'] transition-all border border-[oklch(0.69_0.060_130)] text-[oklch(0.69_0.060_130)] hover:bg-[oklch(0.69_0.060_130)] hover:text-white"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    予約ページへ
                  </a>

                </div>
              </div>
            </div>
          ))}
        </div>

        {/* サロン募集バナー */}
        <div className={`mt-12 border border-[oklch(0.69 0.060 130)]/30 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-700 delay-300 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <div>
            <p className="font-['Cormorant_Garamond'] italic text-[oklch(0.69 0.060 130)] text-xs tracking-[0.3em] uppercase mb-2">For Salon Partners</p>
            <h3 className="font-['Shippori_Mincho'] text-white text-xl md:text-2xl font-bold mb-2">
              THE HERBS SCALP LABOの認定サロンになりませんか？
            </h3>
            <p className="text-white/75 text-sm font-['Noto_Sans_JP'] font-light leading-relaxed">
              エステサロン・美容師の方向けに、頭皮チェックの技術講習と認定制度をご用意しています。
            </p>
          </div>
          <Link href="/salon">
            <span className="flex-shrink-0 border border-[oklch(0.69 0.060 130)] text-[oklch(0.69 0.060 130)] font-['Noto_Sans_JP'] font-medium text-sm px-8 py-3.5 hover:bg-[oklch(0.69 0.060 130)] hover:text-[oklch(0.14 0.04 140)] transition-all duration-300 whitespace-nowrap cursor-pointer">
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
    <section className="relative bg-[oklch(0.20 0.06 140)] py-24 overflow-hidden">
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: "radial-gradient(circle at 30% 50%, rgba(80,120,60,0.13) 0%, transparent 60%)" }}
      />
      <div className="max-w-4xl mx-auto px-6 text-center relative">
        <span className="font-['Cormorant_Garamond'] italic text-[oklch(0.69 0.060 130)] text-sm tracking-[0.4em] uppercase block mb-6">
          Start Your Journey
        </span>
        <h2 className="font-['Shippori_Mincho'] text-white text-3xl md:text-5xl font-bold mb-6 leading-tight">
          まず、自分の頭皮を<br />
          <span className="text-[oklch(0.69 0.060 130)]">知ることから始めよう。</span>
        </h2>
        <p className="text-white/80 text-sm font-['Noto_Sans_JP'] font-light mb-10 max-w-xl mx-auto leading-relaxed">
          初回の無料スカルプチェックは5〜10分。費用は一切かかりません。
          まずは現状を把握することが、すべての始まりです。
        </p>
        <button
          onClick={() => document.querySelector("#reservation")?.scrollIntoView({ behavior: "smooth" })}
          className="px-10 py-4 bg-[oklch(0.69 0.060 130)] text-[oklch(0.14 0.04 140)] font-bold tracking-widest text-sm hover:bg-[oklch(0.72 0.1 130)] transition-all duration-300 inline-flex items-center gap-3 font-['Noto_Sans_JP']"
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
    <footer className="bg-[oklch(0.14 0.04 140)] border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center mb-4">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/logo_grayge_p_transparent_47bbd755.png"
                alt="SCALP LABO"
                className="w-auto object-contain"
                style={{ height: "64px", filter: "brightness(0) invert(1)", opacity: 0.85 }}
              />
            </div>
            <div className="mb-4 pb-4 border-b border-white/10"></div>
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
                    className="text-white/65 hover:text-[oklch(0.69 0.060 130)] text-xs transition-colors font-['Noto_Sans_JP']"
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
              <li><Link href="/privacy" className="text-white/65 hover:text-[oklch(0.69 0.060 130)] text-xs transition-colors font-['Noto_Sans_JP']">プライバシーポリシー</Link></li>
              <li><Link href="/tokushoho" className="text-white/65 hover:text-[oklch(0.69 0.060 130)] text-xs transition-colors font-['Noto_Sans_JP']">特定商取引法に基づく表記</Link></li>
            </ul>
          </div>
        </div>

        {/* 運営会社情報 */}
        <div className="border-t border-white/10 pt-8 mb-6">
          <div className="flex flex-wrap gap-x-6 gap-y-1 justify-center mb-2">
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
                  className="text-white/50 text-[11px] hover:text-white/80 transition-colors underline underline-offset-2 font-['Noto_Sans_JP']">
                  {item.label}
                </a>
              ) : (
                <span key={item.label} className="text-white/50 text-[11px] font-['Noto_Sans_JP']">{item.label}</span>
              )
            )}
          </div>
          <p className="text-white/35 text-[10px] text-center font-['Noto_Sans_JP']">設立：昭和61年4月24日｜化粧品製造業・化粧品製造販売業｜直営店：神戸阪急本館６階 / THE HERBS植物美容サロン / 植物美容学校</p>
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
            © 2026 SCALP LABO / THE HERBS. All rights reserved.
          </p>
          <Link href="/" className="text-[oklch(0.69 0.060 130)]/50 hover:text-[oklch(0.69 0.060 130)] text-xs transition-colors font-['Noto_Sans_JP']">
            ← THE HERBS SCALP LABO（女性版）はこちら
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
      <BotanicalScience />
      <BotanicalMist />
      <Target />
      <Digital />
      <Testimonials />
      <FAQ />
      <StoreSection />
      <Reservation />
      <CTA />
      <Footer />
    </div>
  );
}
