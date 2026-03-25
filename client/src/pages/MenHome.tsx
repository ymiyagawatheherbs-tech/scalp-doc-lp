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
    { label: "料金プラン", href: "#pricing" },
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
        className="fixed top-0 left-0 h-0.5 z-[60] transition-all duration-100"
        style={{ width: `${progress}%`, background: "linear-gradient(90deg, #C9A84C, #E8C97A)" }}
      />
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "py-3 bg-[#0D1B2A]/95 backdrop-blur-md border-b border-[#C9A84C]/20 shadow-lg shadow-black/30" : "py-6 bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/men">
            <div className="flex flex-col cursor-pointer">
              <span className="font-['Cormorant_Garamond'] italic text-[#C9A84C] text-xs tracking-[0.3em] uppercase">Scalp Labo</span>
              <span className="text-white font-['Shippori_Mincho'] text-lg leading-tight tracking-wider">for Men</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
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
          <div className="flex items-center gap-4">
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
            <button
              className="md:hidden text-white"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="メニュー"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
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
            href="/"
            className="mt-6 flex items-center justify-center gap-2 py-3 border border-white/30 text-white/60 text-base tracking-wider hover:border-white/60 hover:text-white/80 transition-all duration-300 font-['Noto_Sans_JP']"
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

      <div className="relative max-w-7xl mx-auto px-6 pt-32 pb-20">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-12 bg-[#C9A84C]" />
            <span className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase font-['Cormorant_Garamond'] italic">
              Men's Scalp Care
            </span>
          </div>

          {/* Main headline */}
          <h1 className="font-['Shippori_Mincho'] text-white leading-tight mb-6">
            <span className="block text-4xl md:text-6xl font-bold mb-2">
              頭皮の状態を、
            </span>
            <span className="block text-4xl md:text-6xl font-bold mb-2">
              データで把握する。
            </span>
            <span className="block text-xl md:text-2xl text-[#C9A84C] font-normal mt-4 tracking-wider">
              それが、男の自己投資。
            </span>
          </h1>

          <p className="text-white/70 text-base md:text-lg leading-relaxed mb-10 font-['Noto_Sans_JP'] font-light max-w-xl">
            スカルプラボ for Men は、マイクロスコープによる詳細な頭皮チェックと
            パーソナルデータの継続記録で、あなたの頭皮状態を科学的にサポートします。
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => document.querySelector("#reservation")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-4 bg-[#C9A84C] text-[#0D1B2A] font-bold tracking-widest text-sm hover:bg-[#E8C97A] transition-all duration-300 flex items-center gap-2 font-['Noto_Sans_JP']"
            >
              無料チェックを予約する
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => document.querySelector("#service")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-4 border border-white/30 text-white/80 text-sm tracking-widest hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-300 font-['Noto_Sans_JP']"
            >
              サービスを見る
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-14 pt-8 border-t border-white/10">
            {[
              { num: "3", unit: "人に1人", label: "30代男性の薄毛悩み（当社調べ）" },
              { num: "93", unit: "%", label: "継続利用率（当社調べ・2024年度）" },
              { num: "1,200", unit: "名以上", label: "男性会員数（2025年3月時点）" },
            ].map((s) => (
              <div key={s.label} className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1">
                  <span className="text-[#C9A84C] font-['Cormorant_Garamond'] text-3xl font-bold">{s.num}</span>
                  <span className="text-[#C9A84C] text-xs">{s.unit}</span>
                </div>
                <p className="text-white/40 text-xs mt-1 leading-snug font-['Noto_Sans_JP']">{s.label}</p>
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
              <p className="text-white/60 text-sm leading-relaxed font-['Noto_Sans_JP'] font-light">{p.body}</p>
            </div>
          ))}
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
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/men-microscope_54d18d0c.jpg"
              alt="高精度マイクロスコープ"
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
              <p className="text-white/40 text-xs font-['Noto_Sans_JP']">{s.note}</p>
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
      img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/men-microscope_54d18d0c.jpg",
    },
    {
      step: "Layer 02",
      title: "スカルプラボ 定期チェック",
      subtitle: "継続的な頭皮モニタリングと記録",
      duration: "所要 30〜40分",
      price: "3,000〜5,000円/回",
      features: [
        "マイクロスコープ詳細チェック",
        "頭皮温度・皮脂量・髪密度計測",
        "問診（生活習慣・使用製品）",
        "パーソナルスカルプレポート（時系列グラフ付き）",
      ],
      img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/men-consultation-v2-Rqc9TnuDgDmaUfY43EYT5t.webp",
    },
    {
      step: "Layer 03",
      title: "パーソナルケアプログラム",
      subtitle: "チェック結果に基づくケアのご提案",
      duration: "継続サポート",
      price: "サブスクプランあり",
      features: [
        "チェック結果に基づくホームケア製品のご提案",
        "スカルプトリートメント・ヘッドスパ施術",
        "サブスクリプション型の製品定期便",
        "深刻な状態が見られた場合の医療機関ご紹介",
      ],
      img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/men-report_22a12908.jpg",
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
        <p className="text-white/60 text-sm font-['Noto_Sans_JP'] font-light mb-16 max-w-xl">
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
                <p className="text-white/60 text-sm mb-1 font-['Noto_Sans_JP']">{s.subtitle}</p>
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

// ========== PRICING ==========
function Pricing() {
  const plans = [
    {
      name: "ライト",
      en: "Light",
      price: "1,980",
      features: [
        "年2回 定期スカルプチェック",
        "製品10%OFF",
        "スカルプレポート提供",
        "LINEデータ共有",
      ],
      highlight: false,
    },
    {
      name: "スタンダード",
      en: "Standard",
      price: "3,980",
      features: [
        "年4回 定期スカルプチェック",
        "製品15%OFF",
        "ヘッドスパ 年2回",
        "スカルプレポート提供",
        "LINEデータ共有",
      ],
      highlight: true,
    },
    {
      name: "プレミアム",
      en: "Premium",
      price: "7,980",
      features: [
        "年4回 定期スカルプチェック",
        "製品20%OFF",
        "ヘッドスパ 毎月",
        "専属アドバイザー",
        "スカルプレポート提供",
        "優先予約・特別ご招待",
      ],
      highlight: false,
    },
  ];

  return (
    <section id="pricing" className="bg-[#0D1B2A] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-px w-12 bg-[#C9A84C]" />
          <span className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase font-['Cormorant_Garamond'] italic">Membership Plans</span>
        </div>
        <h2 className="font-['Shippori_Mincho'] text-white text-3xl md:text-4xl font-bold mb-4">
          月額サブスクリプション
        </h2>
        <p className="text-white/60 text-sm font-['Noto_Sans_JP'] font-light mb-16">
          すべてのプランは月額（税込）。いつでもプラン変更・解約が可能です。
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative p-8 transition-all duration-300 ${
                plan.highlight
                  ? "border-2 border-[#C9A84C] bg-[#1C2B3A]"
                  : "border border-white/10 hover:border-[#C9A84C]/40"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C9A84C] text-[#0D1B2A] text-xs px-4 py-1 font-bold tracking-widest font-['Noto_Sans_JP']">
                  MOST POPULAR
                </div>
              )}
              <div className="mb-6">
                <span className="font-['Cormorant_Garamond'] italic text-[#C9A84C] text-sm tracking-widest block">{plan.en}</span>
                <h3 className="font-['Shippori_Mincho'] text-white text-2xl font-bold">{plan.name}プラン</h3>
              </div>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-white/60 text-sm font-['Noto_Sans_JP']">月額</span>
                <span className="font-['Cormorant_Garamond'] text-[#C9A84C] text-5xl font-bold">¥{plan.price}</span>
                <span className="text-white/60 text-sm font-['Noto_Sans_JP']">（税込）</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check size={14} className="text-[#C9A84C] mt-0.5 shrink-0" />
                    <span className="text-white/70 text-sm font-['Noto_Sans_JP'] font-light">{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => document.querySelector("#reservation")?.scrollIntoView({ behavior: "smooth" })}
                className={`w-full py-3 text-sm tracking-widest transition-all duration-300 font-['Noto_Sans_JP'] ${
                  plan.highlight
                    ? "bg-[#C9A84C] text-[#0D1B2A] font-bold hover:bg-[#E8C97A]"
                    : "border border-[#C9A84C]/40 text-[#C9A84C] hover:bg-[#C9A84C]/10"
                }`}
              >
                このプランで始める
              </button>
            </div>
          ))}
        </div>
        <p className="text-white/30 text-xs text-center mt-8 font-['Noto_Sans_JP']">
          ※ 価格はすべて税込表示です。サブスクリプションはいつでも解約可能です。
        </p>
      </div>
    </section>
  );
}

// ========== TARGET ==========
function Target() {
  const targets = [
    {
      icon: "🧬",
      title: "予防ケア層（20〜30代）",
      message: "「まだ大丈夫なうちに、始める安心」",
      body: "親が薄毛、将来が不安。早めに頭皮の状態を把握しておきたい方に。データを積み重ねることで、変化に気づけます。",
    },
    {
      icon: "💼",
      title: "ビジネスパーソン（30〜40代）",
      message: "「見た目の自信が、仕事の自信になる」",
      body: "第一印象は髪から。定期的な頭皮ケアを習慣にすることで、清潔感と自信を保ち続けられます。",
    },
    {
      icon: "🔬",
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
              <p className="text-white/60 text-sm leading-relaxed font-['Noto_Sans_JP'] font-light">{t.body}</p>
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
    <section className="bg-[#0D1B2A] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-12 bg-[#C9A84C]" />
              <span className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase font-['Cormorant_Garamond'] italic">Digital Feature</span>
            </div>
            <h2 className="font-['Shippori_Mincho'] text-white text-3xl md:text-4xl font-bold mb-6">
              スカルプラボ<br />
              <span className="text-[#C9A84C]">デジタルレポート</span>
            </h2>
            <p className="text-white/70 text-sm leading-relaxed mb-8 font-['Noto_Sans_JP'] font-light">
              チェックのたびにデータが蓄積され、頭皮状態の時系列変化をグラフで確認できます。
              「変化が見える」ことが、継続ケアの動機になります。
            </p>
            <div className="space-y-4">
              {[
                { title: "時系列レポート", desc: "頭皮状態の推移をグラフで記録・確認" },
                { title: "参考スコア表示", desc: "現在のケア状態の継続モチベーション指標" },
                { title: "リマインド通知", desc: "次回チェックの案内・季節別ケアTips" },
                { title: "製品レコメンド", desc: "チェック結果に連動したケア製品のご提案" },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4 p-4 border border-white/5 hover:border-[#C9A84C]/20 transition-colors">
                  <div className="w-1 h-full min-h-[2rem] bg-[#C9A84C] shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-['Shippori_Mincho'] font-bold text-sm mb-1">{item.title}</h4>
                    <p className="text-white/50 text-xs font-['Noto_Sans_JP']">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/men-report_22a12908.jpg"
              alt="スカルプラボ デジタルレポート"
              className="w-full object-cover"
              style={{ aspectRatio: "4/3" }}
            />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 border border-[#C9A84C]/30" />
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
                <p className="text-white/60 text-sm leading-relaxed font-['Noto_Sans_JP'] font-light">{s.desc}</p>
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
        <p className="text-white/40 text-xs font-['Noto_Sans_JP'] mb-16">
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
              <p className="text-white/60 text-sm leading-relaxed font-['Noto_Sans_JP'] font-light mb-6">{t.body}</p>
              <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                <div className="w-8 h-8 rounded-full bg-[#1C2B3A] border border-[#C9A84C]/30 flex items-center justify-center">
                  <span className="text-[#C9A84C] text-xs font-['Cormorant_Garamond']">{t.name[0]}</span>
                </div>
                <div>
                  <p className="text-white text-sm font-['Noto_Sans_JP']">{t.name} 様</p>
                  <p className="text-white/40 text-xs font-['Noto_Sans_JP']">{t.age} · {t.attr}</p>
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
                  <p className="text-white/60 text-sm leading-relaxed font-['Noto_Sans_JP'] font-light pt-4">{faq.a}</p>
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSubmitted(true);
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
          <p className="text-white/60 text-sm font-['Noto_Sans_JP'] font-light leading-relaxed">
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
        <p className="text-white/60 text-sm font-['Noto_Sans_JP'] font-light mb-12">
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
            className="w-full py-4 bg-[#C9A84C] text-[#0D1B2A] font-bold tracking-widest text-sm hover:bg-[#E8C97A] transition-all duration-300 flex items-center justify-center gap-2 font-['Noto_Sans_JP']"
          >
            予約を申し込む
            <ArrowRight size={16} />
          </button>
        </form>
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
        <p className="text-white/60 text-sm font-['Noto_Sans_JP'] font-light mb-10 max-w-xl mx-auto leading-relaxed">
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
            <p className="text-white/40 text-xs leading-relaxed font-['Noto_Sans_JP']">
              男性のための頭皮定期チェックサービス。<br />
              データで頭皮を知り、自信ある毎日をサポートします。
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white/60 text-xs tracking-widest mb-4 font-['Noto_Sans_JP']">MENU</h4>
            <ul className="space-y-2">
              {[
                { label: "サービス", href: "#service" },
                { label: "料金プラン", href: "#pricing" },
                { label: "お客様の声", href: "#testimonials" },
                { label: "よくある質問", href: "#faq" },
                { label: "ご予約", href: "#reservation" },
              ].map((l) => (
                <li key={l.href}>
                  <button
                    onClick={() => document.querySelector(l.href)?.scrollIntoView({ behavior: "smooth" })}
                    className="text-white/40 hover:text-[#C9A84C] text-xs transition-colors font-['Noto_Sans_JP']"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white/60 text-xs tracking-widest mb-4 font-['Noto_Sans_JP']">LEGAL</h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-white/40 hover:text-[#C9A84C] text-xs transition-colors font-['Noto_Sans_JP']">プライバシーポリシー</Link></li>
              <li><Link href="/tokushoho" className="text-white/40 hover:text-[#C9A84C] text-xs transition-colors font-['Noto_Sans_JP']">特定商取引法に基づく表記</Link></li>
            </ul>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="border-t border-white/10 pt-8 mb-6">
          <p className="text-white/30 text-xs leading-relaxed font-['Noto_Sans_JP']">
            【免責事項】本サービスは医療行為ではありません。疾病の診断・治療・予防を目的とするものではありません。
            医療的な相談が必要な場合は医師にご相談ください。掲載の数値・実績はすべて当社調べによるものです。
            個人の体験・効果には差があります。
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/20 text-xs font-['Noto_Sans_JP']">
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
      <Concept />
      <Stats />
      <Service />
      <Pricing />
      <Target />
      <Digital />
      <Flow />
      <Testimonials />
      <FAQ />
      <Reservation />
      <CTA />
      <Footer />
    </div>
  );
}
