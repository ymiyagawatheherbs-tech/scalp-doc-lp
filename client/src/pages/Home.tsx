/*
 * THE HERBS SCALP LABO LP — Home Page
 * Design: モダン・ウェルネス・スタジオ
 * Color: Cream × Deep Brown × Golden Amber
 * Font: Shippori Mincho B1 × Noto Sans JP × Cormorant Garamond
 */

import { useEffect, useRef, useState } from "react";
import { trpc } from "@/lib/trpc";

// ビフォーアフター画像URL
const BA_IMAGES = [
  {
    id: 1,
    src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/ba_01_495f4616.jpg",
    label: "うねり・広がりケア",
    period: "施術後",
    gender: "女性",
  },
  {
    id: 2,
    src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/ba_02_da861a2d.jpg",
    label: "くせ毛・まとまりケア",
    period: "7ヶ月後",
    gender: "女性",
  },
  {
    id: 3,
    src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/ba_03_2e97f8a1.jpg",
    label: "薄毛・発毛ケア",
    period: "継続ケア後",
    gender: "男性",
  },
  {
    id: 4,
    src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/ba_04_4d6059d4.jpg",
    label: "頭頂部・薄毛ケア",
    period: "継続ケア後",
    gender: "男性",
  },
  {
    id: 5,
    src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/ba_05_7dc53269.jpg",
    label: "頭頂部・育毛ケア",
    period: "継続ケア後",
    gender: "男性",
  },
  {
    id: 6,
    src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/ba_06_5af26017.jpg",
    label: "ボリュームアップケア",
    period: "6ヶ月後",
    gender: "男性",
  },
  {
    id: 7,
    src: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/ba_07_7a4e0e75.jpg",
    label: "ダメージ・うねりケア",
    period: "施術後",
    gender: "女性",
  },
];

// 画像URL定数
const IMAGES = {
  hero: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/hero-main-7WiQYuuxpMEgAPgcyJcPik.webp",
  microscope: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/scalp-microscope-iVWgVizXNK9WSGwKAftiPS.webp",
  consultation: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/consultation-oBRbvf7238DM5fVXz4vLdS.webp",
  report: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/report-visual-jwmtgLXxwHGpfod5ntuEan.webp",
  scalpCheck: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/scalp_check_dfbc71b8.jpg",
  botanicalMist: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/herb_steamer_8218d07e.jpg",
  herbGommage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/herb_gommage_65dd1849.jpg",
  scalpCheckReal: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/scalp_check_real_8dbe88ff.png",
  conceptCheck: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/concept_check_d8584f3a.jpg",
  herbBottles: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/herb_bottles_b7827e42.jpg",
  scalpMicroscopeReal: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/scalp_microscope_real_722e5749.jpg",
};

// Intersection Observer フック
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// カウントアップフック
function useCountUp(target: number, inView: boolean, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return count;
}

// ナビゲーション
// スクロール進捗バー
function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const handler = () => {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight - el.clientHeight;
      setProgress(scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0);
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-0.5 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-[oklch(0.72_0.12_70)] to-[oklch(0.82_0.14_75)] transition-all duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // モバイルメニュー開放時にボディスクロールを無効化
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navLinks = [
    { label: "サービス", href: "#サービス" },
    { label: "お客様の声", href: "#お客様の声" },
    { label: "よくある質問", href: "#よくある質問" },
  ];

  return (
    <>
      <ScrollProgressBar />
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[oklch(0.977_0.012_85/0.97)] backdrop-blur-md shadow-sm border-b border-[oklch(0.88_0.025_75)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          {/* ロゴ：SCALP LABOロゴ + THE HERBS商標 */}
          <a href="/" className="flex items-center gap-2 md:gap-3">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/scalp-labo-logo-transparent_e6faa3cd.png"
              alt="SCALP LABO"
              className="h-9 md:h-11 w-auto object-contain"
            />
            <div className="flex flex-col justify-center gap-0.5">
              <div className={`font-cormorant text-[8px] md:text-[9px] tracking-[0.2em] uppercase leading-none transition-colors ${
                scrolled ? "text-[oklch(0.55_0.08_42)]" : "text-white/60"
              }`}>
                presented by
              </div>
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/theherbs_logo_395db853.webp"
                alt="THE HERBS"
                className={`h-3 md:h-3.5 w-auto transition-all ${
                  scrolled ? "brightness-0" : "brightness-0 invert opacity-80"
                }`}
              />
            </div>
          </a>

          {/* デスクトップナビ */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`font-sans-jp text-sm transition-colors hover:text-[oklch(0.72_0.12_70)] ${
                  scrolled ? "text-[oklch(0.38_0.055_42)]" : "text-white/80"
                }`}
              >
                {item.label}
              </a>
            ))}
            {/* サロン向け・メンズ版：準備中のため非表示 */}
            <a
              href="/booking"
              className="btn-gold-shimmer text-white font-sans-jp text-sm font-bold px-5 py-2.5 rounded-sm" style={{textShadow: '0 1px 2px rgba(0,0,0,0.4)'}}
            >
              無料チェックを予約
            </a>
          </div>

          {/* スマホ右側：CTAボタン＋ハンバーガー */}
          <div className="md:hidden flex items-center gap-2">
            <a
              href="/booking"
              className="btn-gold-shimmer text-white font-sans-jp text-xs font-bold px-3 py-1.5 rounded-sm" style={{textShadow: '0 1px 2px rgba(0,0,0,0.4)'}}
            >
              今すぐ予約
            </a>
            <button
              className="flex flex-col gap-1.5 p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="メニューを開く"
            >
              <span className={`block w-5 h-0.5 transition-all duration-300 ${
                scrolled ? "bg-[oklch(0.22_0.045_42)]" : "bg-white"
              } ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-0.5 transition-all duration-300 ${
                scrolled ? "bg-[oklch(0.22_0.045_42)]" : "bg-white"
              } ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 transition-all duration-300 ${
                scrolled ? "bg-[oklch(0.22_0.045_42)]" : "bg-white"
              } ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>

        {/* モバイルメニュー */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}>
          <div className="bg-[oklch(0.977_0.012_85/0.98)] backdrop-blur-md border-t border-[oklch(0.88_0.025_75)] px-6 py-6 space-y-4">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block font-sans-jp text-[oklch(0.22_0.045_42)] text-base py-2 border-b border-[oklch(0.88_0.025_75)] hover:text-[oklch(0.72_0.12_70)] transition-colors"
              >
                {item.label}
              </a>
            ))}
            {/* サロン向け・メンズ版：準備中のため非表示 */}
            <a
              href="/booking"
              onClick={() => setMobileOpen(false)}
              className="block btn-gold-shimmer text-white font-sans-jp font-bold text-center py-4 rounded-sm mt-2" style={{textShadow: '0 1px 2px rgba(0,0,0,0.4)'}}
            >
              無料スカルプチェックを予約する
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}

// ヒーローセクション
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* 背景画像 */}
      <div className="absolute inset-0">
        <img
          src={IMAGES.hero}
          alt="THE HERBS SCALP LABO ウェルネススタジオ"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.18_0.04_42/0.75)] via-[oklch(0.18_0.04_42/0.45)] to-transparent" />
      </div>

      {/* コンテンツ */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-6 pt-24 pb-16 md:py-32">
        <div className="max-w-2xl">
          <div className="hidden md:block animate-fade-in-up opacity-0-init">
            <span className="font-cormorant text-[oklch(0.72_0.12_70)] text-sm tracking-[0.3em] uppercase block mb-6">
              Scalp Wellness Checkup
            </span>
          </div>
          <h1 className="font-mincho text-white leading-tight mb-4 md:mb-6 animate-fade-in-up opacity-0-init delay-100">
            <span className="block text-2xl md:text-5xl lg:text-6xl font-bold mb-1 md:mb-2">
              歯の定期検診のように、
            </span>
            <span className="block text-2xl md:text-5xl lg:text-6xl font-bold text-[oklch(0.88_0.08_75)]">
              頭皮も定期チェックを。
            </span>
          </h1>
          <p className="hidden md:block font-sans-jp text-white/80 text-base md:text-lg leading-relaxed mb-10 animate-fade-in-up opacity-0-init delay-200">
            マイクロスコープによる頭皮チェックで、あなたの頭皮の今を記録・確認。<br />
            薄毛になってから悩むのではなく、健康な頭皮を<strong className="text-[oklch(0.88_0.08_75)]">意識的にケアする</strong>新習慣。
          </p>
          <p className="md:hidden font-sans-jp text-white/75 text-sm leading-relaxed mb-7 animate-fade-in-up opacity-0-init delay-200">
            マイクロスコープで頭皮の今を記録。<br />
            <strong className="text-[oklch(0.88_0.08_75)]">意識的にケアする</strong>新習慣。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 animate-fade-in-up opacity-0-init delay-300">
            <a
              href="/booking"
              className="btn-gold-shimmer text-white font-sans-jp font-bold px-6 md:px-8 py-3.5 md:py-4 rounded-sm text-center text-sm md:text-base" style={{textShadow: '0 1px 2px rgba(0,0,0,0.4)'}}
            >
              無料スカルプチェックを予約する
            </a>
            <a
              href="#サービス"
              className="hidden sm:block border border-white/60 text-white font-sans-jp font-medium px-8 py-4 rounded-sm text-center text-base hover:bg-white/10 transition-colors"
            >
              サービスを見る
            </a>
          </div>
          <div className="mt-8 md:mt-12 flex items-center gap-4 md:gap-6 animate-fade-in-up opacity-0-init delay-400">
            <div className="flex -space-x-2">
              {["A", "B", "C", "D"].map((l) => (
                <div
                  key={l}
                  className="w-7 h-7 md:w-9 md:h-9 rounded-full bg-[oklch(0.72_0.12_70)] border-2 border-white flex items-center justify-center"
                >
                  <span className="text-[oklch(0.18_0.04_42)] text-[10px] md:text-xs font-semibold">{l}</span>
                </div>
              ))}
            </div>
            <p className="font-sans-jp text-white/70 text-xs md:text-sm">
              <span className="text-white font-medium">2,200名以上</span>が体験済み（当社調べ）
            </p>
          </div>
        </div>
      </div>

      {/* スクロール誘導 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-fade-in opacity-0-init delay-600">
        <span className="font-cormorant text-white/50 text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
      </div>
    </section>
  );
}

// 課題提起セクション
function ProblemSection() {
  const { ref, inView } = useInView();
  return (
    <section className="py-24 bg-[oklch(0.22_0.045_42)]" id="問題">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-cormorant text-[oklch(0.72_0.12_70)] text-sm tracking-[0.3em] uppercase block mb-4">
            The Problem
          </span>
          <h2 className="font-mincho text-white text-3xl md:text-4xl font-bold mb-6">
            あなたの頭皮、<br className="md:hidden" />
            <span className="text-[oklch(0.88_0.08_75)]">最後のチェックはいつですか？</span>
          </h2>
          <p className="font-sans-jp text-white/85 text-base max-w-2xl mx-auto leading-relaxed">
            多くの人が頭皮の変化に気づかないまま、ケアが後回しになっています。
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "",
              title: "薬剤による頭皮への影響",
              desc: "ヘアカラー・パーマの普及により、若年層から継続的に頭皮環境への負担が増えています。",
              delay: 0,
            },
            {
              icon: "",
              title: "予防意識はあるのに…",
              desc: "「将来のために」と思っていても、定期的に気軽に相談できる場所がありませんでした。",
              delay: 100,
            },
            {
              icon: "",
              title: "受け皿の不在",
              desc: "病院は敷居が高く、サロンはスポット利用中心。継続的にモニタリングできる場所がない。",
              delay: 200,
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`border border-white/10 rounded-sm p-8 transition-all duration-700 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${item.delay + 200}ms` }}
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="font-mincho text-white text-lg font-bold mb-3">{item.title}</h3>
              <p className="font-sans-jp text-white/80 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 頭皮状態ギャラリーセクション
const SCALP_STATES = [
  {
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/2022-07-0216.27.17-1_35d2e8f2.jpg",
    label: "健やかな頭皮環境",
    status: "良好",
    statusColor: "oklch(0.65_0.15_145)",
    desc: "毛根がしっかりと育ち、頭皮が清潔に保たれている状態。定期チェックでこの状態を維持することが大切です。",
    detail: "健康・良好",
  },
  {
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/2026-04-04-14-58-15-909_8fa65f43.jpg",
    label: "皮脂過多・毛穴詰まり",
    status: "要注意",
    statusColor: "oklch(0.65_0.18_30)",
    desc: "毛穴に皮脂が蔓積し、毛根への栄養供給が滞っている状態。放置すると抜け毛の原因になることがあります。",
    detail: "皮脂・毛穴",
  },
  {
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/2025-05-21-15-27-25-532_ec88191c.JPG",
    label: "疲労の蓄積・毛根の退化",
    status: "ケア推奨",
    statusColor: "oklch(0.72_0.15_55)",
    desc: "慢性的な疲労から毛根が退化している状態。頭皮の水分量低下と毛量の減少がみられる。",
    detail: "疲労・退化",
  },
  {
    img: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/2025-10-27-10-18-21-496_65c4010d.jpg",
    label: "皮脂過多・水分量低下",
    status: "早期ケアを",
    statusColor: "oklch(0.60_0.20_20)",
    desc: "毛穴に油分が蔓積し始めている状態。過酸化脂質に変化し、汚れの蔓積、頭皮の炎症が起こり始める状態。",
    detail: "皮脂・水分",
  },
];

function ScalpGallerySection() {
  const { ref, inView } = useInView();
  const [active, setActive] = useState(0);

  return (
    <section className="py-24 bg-[oklch(0.14_0.03_42)]" id="scalp-gallery">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        {/* ヘッダー */}
        <div className={`text-center mb-14 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-cormorant text-[oklch(0.72_0.12_70)] text-sm tracking-[0.3em] uppercase block mb-4">
            Scalp Microscope Gallery
          </span>
          <h2 className="font-mincho text-white text-3xl md:text-4xl font-bold mb-4">
            あなたの頭皮は、<br />
            <span className="text-[oklch(0.88_0.08_75)]">どの状態に近いですか？</span>
          </h2>
          <p className="font-sans-jp text-white/75 text-sm max-w-xl mx-auto leading-relaxed">
            実際のマイクロスコープ映像です。頭皮の状態は人によって大きく異なります。<br />
            自分の頭皮を「見たことがある」人は、ほとんどいません。
          </p>
        </div>

        {/* メインレイアウト */}
        <div className={`grid md:grid-cols-2 gap-10 items-center transition-all duration-700 delay-200 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {/* 左：画像 */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-sm" style={{ aspectRatio: "4/3" }}>
              <img
                key={active}
                src={SCALP_STATES[active].img}
                alt={SCALP_STATES[active].label}
                className="w-full h-full object-cover transition-opacity duration-500"
              />
              {/* ステータスバッジ */}
              <div
                className="absolute top-4 left-4 px-3 py-1 text-xs font-sans-jp font-bold tracking-wider rounded-sm"
                style={{ backgroundColor: SCALP_STATES[active].statusColor, color: "#fff" }}
              >
                {SCALP_STATES[active].status}
              </div>
              {/* 拡大鏡アイコン */}
              <div className="absolute bottom-4 right-4 w-8 h-8 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
                </svg>
              </div>
            </div>
            {/* 凡例 */}
            <p className="font-sans-jp text-white/40 text-[11px] text-center mt-2 tracking-wide">
              ※ THE HERBS SCALP LAB実際のマイクロスコープ撑影画像
            </p>
          </div>

          {/* 右：説明 */}
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-8" style={{ backgroundColor: SCALP_STATES[active].statusColor }} />
                <span className="font-cormorant italic text-[oklch(0.72_0.12_70)] text-sm tracking-widest">
                  {SCALP_STATES[active].detail}
                </span>
              </div>
              <h3 className="font-mincho text-white text-2xl md:text-3xl font-bold mb-4">
                {SCALP_STATES[active].label}
              </h3>
              <p className="font-sans-jp text-white/80 text-sm leading-relaxed">
                {SCALP_STATES[active].desc}
              </p>
            </div>

            {/* サムネイル選択 */}
            <div className="grid grid-cols-4 gap-2 mb-8">
              {SCALP_STATES.map((s, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`relative overflow-hidden rounded-sm transition-all duration-300 ${
                    active === i ? "ring-2 ring-[oklch(0.72_0.12_70)] opacity-100" : "opacity-50 hover:opacity-80"
                  }`}
                  style={{ aspectRatio: "1" }}
                  aria-label={s.label}
                >
                  <img src={s.img} alt={s.label} className="w-full h-full object-cover" />
                  {active === i && (
                    <div className="absolute inset-0 bg-[oklch(0.72_0.12_70)]/10" />
                  )}
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="border border-white/10 rounded-sm p-5 bg-white/5">
              <p className="font-sans-jp text-white/90 text-sm leading-relaxed mb-4">
                <span className="text-[oklch(0.88_0.08_75)] font-bold">あなたの頭皮は今、どんな状態？</span><br />
                実際にマイクロスコープで確認してみましょう。初回チェックは無料です。
              </p>
              <button
                onClick={() => window.location.href = '/booking'}
                className="w-full py-3 font-sans-jp text-sm font-semibold tracking-wider transition-all duration-300"
                style={{ backgroundColor: "oklch(0.72_0.12_70)", color: "oklch(0.18_0.04_42)" }}
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

// コンセプトセクション
function ConceptSection() {
  const { ref, inView } = useInView();
  return (
    <section className="py-28 bg-[oklch(0.977_0.012_85)]" id="コンセプト">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className={`transition-all duration-800 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
              <span className="font-cormorant text-[oklch(0.72_0.12_70)] text-sm tracking-[0.3em] uppercase block mb-4">
              Our Concept
            </span>
            <h2 className="font-mincho text-[oklch(0.22_0.045_42)] text-3xl md:text-4xl font-bold leading-tight mb-8">
              「歯科の定期検診」のように、<br />
              <span className="text-[oklch(0.72_0.12_70)]">頭皮ケアの新習慣</span>を広めたい。
            </h2>
            <div className="section-divider mb-8" />
            <div className="space-y-6">
              <div className="karte-border">
                <p className="font-sans-jp text-[oklch(0.38_0.055_42)] text-sm leading-relaxed">
                  かつて歯科検診は「虫歯になってから行く場所」でした。今は「予防のために定期的に通う場所」として定着しています。
                </p>
              </div>
              <div className="karte-border">
                <p className="font-sans-jp text-[oklch(0.38_0.055_42)] text-sm leading-relaxed font-semibold">
                  THE HERBS SCALP LABは、頭皮ケアに同じ変化を目指します。「薄毛が気になってから行く場所」ではなく、「定期的に頭皮の状態を確認する場所」へ。
                </p>
              </div>
            </div>
          </div>
          <div className={`relative transition-all duration-800 delay-200 ${inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
            <div className="relative">
              <img
                src={IMAGES.conceptCheck}
                alt="マイクロスコープによる頭皮チェック実施中"
                className="w-full max-w-md mx-auto rounded-sm shadow-2xl object-cover"
                style={{ aspectRatio: '4/3' }}
              />
              <div className="absolute -bottom-6 -right-6 bg-[oklch(0.22_0.045_42)] text-white p-6 rounded-sm shadow-xl max-w-xs">
                <p className="font-cormorant text-[oklch(0.72_0.12_70)] text-xs tracking-widest uppercase mb-2">
                  Microscope Diagnosis
                </p>
                <p className="font-mincho text-white text-sm font-bold">
                  マイクロスコープで<br />頭皮の色・毛穴・皮脂・毛量を記録・確認
                </p>
              </div>
              {/* 頭皮マイクロスコープ画像（右下サムネイル） */}
              <div className="absolute -top-6 -left-6 w-28 h-28 overflow-hidden rounded-sm shadow-xl border-2 border-[oklch(0.72_0.12_70)]">
                <img src={IMAGES.scalpMicroscopeReal} alt="頭皮マイクロスコープ画像" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 頭皮チェック習慣の価値討求セクション
function HabitValueSection() {
  const { ref, inView } = useInView();

  const values = [
    {
      number: "01",
      title: "変化に気づく",
      subtitle: "Notice the Change",
      desc: "頭皮の変化はゆっくり起きます。季節・ストレス・ホームケアの変化をデータで記録することで、「気のせいかな？」を「見える事実」に変えます。",
    },
    {
      number: "02",
      title: "先手を打つ",
      subtitle: "Act Before It's Too Late",
      desc: "薄毛・抜け毛・つむじ割れ・うねり・広がりは、気になり始めたときにはすでに進行していることがほとんど。定期チェックで早期発見することが、最大のケアです。",
    },
    {
      number: "03",
      title: "記録が安心に変わる",
      subtitle: "History Becomes Confidence",
      desc: "「昨年より良くなった」「変化がなかった」——その一言が、将来への不安を安心に変えます。継続記録が、あなた自身の「頭皮カルテ」になります。",
    },
    {
      number: "04",
      title: "小さな習慣が大きな差を生む",
      subtitle: "Small Habit, Big Difference",
      desc: "歯科検診と同じように、定期的なチェックは「当たり前」になります。年に一度から始める、その小さな一歩が、将来の髮と頭皮を守ります。",
    },
  ];

  return (
    <section className="py-28 bg-[oklch(0.22_0.045_42)]" id="習慣の意義">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        {/* ヘッダー */}
        <div className={`mb-20 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-cormorant text-[oklch(0.72_0.12_70)] text-sm tracking-[0.3em] uppercase block mb-6">
            Why Scalp Check Matters
          </span>
          <div className="grid lg:grid-cols-2 gap-8 items-end">
            <div>
              <h2 className="font-mincho text-white text-3xl md:text-5xl font-bold leading-tight">
                髮のお悩みは、<br />
                <span className="text-[oklch(0.88_0.08_75)]">頭皮チェックから。</span>
              </h2>
            </div>
            <div>
              <p className="font-sans-jp text-white/80 text-sm leading-relaxed">
                将来の不安を安心に変える「頭皮チェック習慣」。歯医者さんの定期検診と同じように、定期的に頭皮の状態を確認することで、問題が小さなうちに気づき、適切なケアを選ぶことができます。
              </p>
            </div>
          </div>
          {/* ハーブビン画像 — セクションの雰囲気を高める横長バナー */}
          <div className="mt-10 overflow-hidden rounded-sm" style={{ height: '220px' }}>
            <img
              src={IMAGES.herbBottles}
              alt="施術に使用するハーブ"
              className="w-full h-full object-cover object-center"
              style={{ objectPosition: 'center 40%' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.22_0.045_42)/80] to-transparent pointer-events-none" />
          </div>
        </div>

        {/* 4つの価値 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-0 border border-white/10">
          {values.map((v, i) => (
            <div
              key={i}
              className={`p-8 border-r border-white/10 last:border-r-0 transition-all duration-700 group hover:bg-white/5 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <span className="font-cormorant text-white/60 text-5xl font-light block mb-6 group-hover:text-white/90 transition-colors">
                {v.number}
              </span>
              <h3 className="font-mincho text-white text-lg font-bold mb-1 leading-snug">
                {v.title}
              </h3>
              <p className="font-cormorant text-[oklch(0.72_0.12_70)] text-xs tracking-wider mb-4">
                {v.subtitle}
              </p>
              <div className="w-8 h-px bg-[oklch(0.72_0.12_70)/40] mb-4 group-hover:w-16 transition-all duration-500" />
              <p className="font-sans-jp text-white/75 text-xs leading-relaxed">
                {v.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ボトムCTA */}
        <div className={`mt-16 text-center transition-all duration-700 delay-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="font-mincho text-white/80 text-xl md:text-2xl font-bold mb-2">
            小さな一歩から、将来の髮を守る。
          </p>
          <p className="font-sans-jp text-white/70 text-sm mb-8">
            まずは無料の頭皮チェックから。
          </p>
          <a
            href="/booking"
            className="inline-block btn-gold-shimmer font-sans-jp text-[oklch(0.18_0.04_42)] text-sm font-bold px-10 py-4 rounded-sm tracking-wider"
          >
            無料スカルプチェックを予約する
          </a>
        </div>
      </div>
    </section>
  );
}

// 統計セクション
function StatsSection() {
  const { ref, inView } = useInView();
  const count1 = useCountUp(58, inView, 2000);
  const count2 = useCountUp(20, inView, 1200);
  const count3 = useCountUp(93, inView, 2200);
  // 数値が0の場合は目標値を直接表示（初期レンダリング対策）

  return (
    <section className="py-20 bg-[oklch(0.955_0.018_82)]">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
            {
              value: count1,
              suffix: "倍",
              prefix: "",
              label: "頭皮ケアの口コミ数増加",
              sub: "10年前比（@cosme調べ）",
            },
            {
              value: count2,
              suffix: "代",
              prefix: "",
              label: "から始める予防ケアが急増",
              sub: "スカルプチェック利用者層の年代別内訳（当社調べ）",
            },
            {
              value: count3,
              suffix: "%",
              prefix: "",
              label: "の顧客が継続利用",
              sub: "当社サブスクリプション会員の継続率（当社調べ・2024年度）",
            },
          ].map((stat, i) => (
            <div
              key={i}
              className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="font-cormorant text-[oklch(0.22_0.045_42)] text-6xl md:text-7xl font-light mb-2">
                {stat.prefix}{stat.value}
                <span className="text-[oklch(0.72_0.12_70)] text-4xl">{stat.suffix}</span>
              </div>
              <p className="font-mincho text-[oklch(0.22_0.045_42)] text-base font-bold mb-1">{stat.label}</p>
              <p className="font-sans-jp text-[oklch(0.55_0.04_42)] text-xs">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// サービス3層セクション
function ServiceSection() {
  const { ref, inView } = useInView();
  const services = [
    {
    layer: "Layer 1",
      badge: "無料",
      title: "スカルプチェック",
      subtitle: "まずは気軽に、頭皮の今を知る",
      time: "5～10分",
      price: "無料",
      color: "oklch(0.88_0.08_75)",
      image: IMAGES.scalpCheck,
      items: [
        "マイクロスコープによる頭皮撮影",
        "頭皮の色・毛穴の状態・皮脂量・毛量の簡易確認",
        "結果をその場で画像つきでご説明",
        "LINEでデータ共有",
      ],
      desc: "歯科の定期チェックと同じ感覚で。気軽に頭皮の状態が確認できます。",
    },
    {
    layer: "Layer 2",
      badge: "定期チェック＆ケア",
      title: "定期スカルプチェック",
      subtitle: "1ヶ月に1回のボタニカルスカルプケア",
      time: "45分",
      price: "3,800～5,000円",
      color: "oklch(0.72_0.12_70)",
      image: IMAGES.botanicalMist,
      items: [
        "① 頭皮チェック（状態確認・重点箇所の把握）",
        "② ボタニカルミスト（気になる箇所から全体リセット）",
        "③ 頭皮チェック（リセットを目視で確認・次回予約）",
        "過去データとの時系列比較で頭皮変化を記録",
      ],
      desc: "チェック→リセット→チェックの3ステップで、頭皮の本当の変化を正確に把握。季節変動や施術の影響も時系列で記録できます。",
      featured: true,
    },
    {
      layer: "Layer 3",
      badge: "ケアプログラム",
      title: "パーソナルスカルプケア",
      subtitle: "チェック結果に基づくケアのご提案",
      time: "50分～",
      price: "6,000円～",
      color: "oklch(0.62_0.05_148)",
      image: IMAGES.herbGommage,
      items: [
        "スカルプ　ボタニカルミスト",
        "スカルプハーブゴマージュまたはハーブエキス",
        "季節や状態に合わせたホームケアカウンセリング",
        "頭皮や髪の状態に合わせたケア",
      ],
      desc: "チェック結果をもとにしたケアのご提案で、あなたの頭皮を長期的にサポートします。",
    },
  ];

  return (
    <section className="py-28 bg-[oklch(0.977_0.012_85)]" id="サービス">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-cormorant text-[oklch(0.72_0.12_70)] text-sm tracking-[0.3em] uppercase block mb-4">
            Our Services
          </span>
          <h2 className="font-mincho text-[oklch(0.22_0.045_42)] text-3xl md:text-4xl font-bold mb-4">
            3つのステップで、<br className="md:hidden" />頭皮の健康を守る
          </h2>
          <p className="font-sans-jp text-[oklch(0.55_0.04_42)] text-sm max-w-xl mx-auto">
            無料チェックから始めて、定期ケアへ。あなたのペースで頭皮ケアの習慣を作ります。
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {services.map((svc, i) => (
            <div
              key={i}
              className={`relative rounded-sm overflow-hidden transition-all duration-700 ${
                svc.featured
                  ? "bg-[oklch(0.22_0.045_42)] shadow-2xl scale-105 z-10"
                  : "bg-white border border-[oklch(0.88_0.025_75)] hover:shadow-lg"
              } ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {svc.featured && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[oklch(0.72_0.12_70)] to-[oklch(0.82_0.14_75)]" />
              )}
              {svc.image && (
                <div className="relative overflow-hidden" style={{ height: '180px' }}>
                  <img
                    src={svc.image}
                    alt={svc.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
                </div>
              )}
              <div className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="font-cormorant text-xs tracking-widest uppercase"
                    style={{ color: svc.color }}
                  >
                    {svc.layer}
                  </span>
                  <span
                    className="font-sans-jp text-xs px-3 py-1 rounded-full font-medium"
                    style={{
                      backgroundColor: `${svc.color}20`,
                      color: svc.featured ? "oklch(0.88_0.08_75)" : svc.color,
                    }}
                  >
                    {svc.badge}
                  </span>
                </div>
                <h3
                  className={`font-mincho text-xl font-bold mb-1 ${
                    svc.featured ? "text-white" : "text-[oklch(0.22_0.045_42)]"
                  }`}
                >
                  {svc.title}
                </h3>
                <p
                  className={`font-sans-jp text-xs mb-6 ${
                    svc.featured ? "text-white/60" : "text-[oklch(0.55_0.04_42)]"
                  }`}
                >
                  {svc.subtitle}
                </p>
                <div className="flex items-baseline gap-2 mb-6">
                  <span
                    className="font-mincho text-2xl font-bold"
                    style={{ color: svc.featured ? "#FFFFFF" : svc.color }}
                  >
                    {svc.price}
                  </span>
                  <span
                    className={`font-sans-jp text-xs ${
                      svc.featured ? "text-white/50" : "text-[oklch(0.55_0.04_42)]"
                    }`}
                  >
                    / {svc.time}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {svc.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <span style={{ color: svc.color }} className="text-sm mt-0.5 flex-shrink-0">✓</span>
                      <span
                        className={`font-sans-jp text-xs leading-relaxed ${
                          svc.featured ? "text-white/80" : "text-[oklch(0.38_0.055_42)]"
                        }`}
                      >
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
                <p
                  className={`font-sans-jp text-xs leading-relaxed border-t pt-6 ${
                    svc.featured
                      ? "text-white/50 border-white/10"
                      : "text-[oklch(0.55_0.04_42)] border-[oklch(0.88_0.025_75)]"
                  }`}
                >
                  {svc.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


// ボタニカルミスト専用セクション
function BotanicalMistSection() {
  const { ref, inView } = useInView();

  const effects = [
    {
      icon: "",
      title: "オーガニックハーブのミスト抽出",
      desc: "ハーブスチーマーにより植物から薒気抽出した成分を頭皮に届けます。化学合成ではなく、天然ハーブの持つ浄化・保湿・整肌作用をそのまま頭皮に届けます。",
    },
    {
      icon: "",
      title: "超微細ミストが毛孔の清浄に働く",
      desc: "液体では届かない頭皮の角質層まで、超微細なミスト粒子が浸透します。毛穴に蓄積した皮脂・薬剤・汚れを浄化し、頭皮本来の吸収力を高めます。",
    },
    {
      icon: "",
      title: "引き算のリセットケア",
      desc: "トリートメントのように「足す」のではなく、余分な皮脂・薬剤残留物を「取り去る」リセットケア。素の頭皮本来の力を引き出します。",
    },
    {
      icon: "",
      title: "保湿・整肌ケア",
      desc: "ストレスの多い環境、季節の変わり目では、頭皮の状態が悪化しやすくなります。乾燥した頭皮に潤いを与え、皮脂分泌のバランスを整えることで、健康な頭皮環境をサポートします。",
    },
    {
      icon: "",
      title: "カラー・パーマ後の薬剤浄化",
      desc: "アルカリカラーやパーマ後に残留する薬剤をミスト抽出した植物成分によりクレンジング。頭皮への薬剤ダメージを軽減し、ケア後の頭皮環境を整えます。",
    },
    {
      icon: "",
      title: "季節変化に対応したハーブ配合",
      desc: "季節や頭皮状態に応じてハーブ配合を調整。季節の変わり目に大きく変化する頭皮状態に対応したリセットケアを提供します。",
    },
  ];

  return (
    <section
      className="py-28 relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #3a2a1a 0%, #2a1e12 100%)" }}
      id="botanical-mist"
    >
      {/* 背景装飾 */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, oklch(0.72_0.12_70) 0%, transparent 70%)", transform: "translate(30%, -30%)" }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-8"
          style={{ background: "radial-gradient(circle, oklch(0.62_0.14_160) 0%, transparent 70%)", transform: "translate(-30%, 30%)" }}
        />
      </div>

      <div ref={ref} className="max-w-7xl mx-auto px-6 relative">
        {/* ヘッダー */}
        <div className={`flex flex-col lg:flex-row gap-16 items-center mb-20 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {/* テキスト */}
          <div className="flex-1">
            <span className="font-cormorant text-sm tracking-[0.4em] uppercase block mb-4" style={{ color: "#C9A84C" }}>
              Botanical Mist Technology
            </span>
            <h2 className="font-mincho text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight" style={{ color: "#ffffff" }}>
              定期スカルプチェックは、<br />
              <span style={{ color: "#C9A84C" }}>頭皮リセットから始まる。</span>
            </h2>
            <p className="font-sans-jp text-sm leading-relaxed mb-6 max-w-lg" style={{ color: "rgba(255,255,255,0.85)" }}>
              ボタニカルミスト（ハーブスチーマー）は、定期チェックで行う「頭皮リセット」プログラムです。
              毛穴に蓄積した皮脂・薬剤・汚れを蒸気抽出した植物成分で浄化、保湿ケアを行います。施術後の頭皮チェックで、
              頭皮の変化を確認できます。
            </p>
            {/* ボタニカルミストの特徴バッジ */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-sm" style={{ backgroundColor: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.4)" }}>
                <span className="font-sans-jp text-xs" style={{ color: "rgba(255,255,255,0.85)" }}>オーガニックハーブを使用</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-sm" style={{ backgroundColor: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.4)" }}>
                <span className="font-sans-jp text-xs" style={{ color: "rgba(255,255,255,0.85)" }}>超微細ミストで毛孔清浄</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-sm" style={{ backgroundColor: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.4)" }}>
                <span className="font-sans-jp text-xs" style={{ color: "rgba(255,255,255,0.85)" }}>頭皮クレンジング＋保湿ケア</span>
              </div>
            </div>
            <p className="font-sans-jp text-xs leading-relaxed max-w-lg" style={{ color: "rgba(255,255,255,0.65)" }}>
              ※本施術は化粧品の使用感の向上を目的としたものです。効果・効能には個人差があります。
            </p>
          </div>

          {/* 画像 */}
          <div className="flex-shrink-0 w-full lg:w-[420px]">
            <div className="relative overflow-hidden" style={{ borderRadius: "2px" }}>
              <img
                src={IMAGES.botanicalMist}
                alt="ボタニカルミスト施術"
                className="w-full object-cover"
                style={{ height: "360px", objectPosition: "center 30%" }}
              />
              {/* ゴールドフレーム装飾 */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ boxShadow: "inset 0 0 0 1px oklch(0.72_0.12_70 / 0.3)" }}
              />
              {/* ラベル */}
              <div
                className="absolute bottom-4 left-4 font-sans-jp text-xs font-bold px-4 py-2"
                style={{ backgroundColor: "#C9A84C", color: "#2a1e12" }}
              >
                THE HERBS ボタニカルミスト
              </div>
            </div>
          </div>
        </div>

        {/* 効果グリッド */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ backgroundColor: "rgba(255,255,255,0.1)" }}>
          {effects.map((effect, i) => (
            <div
              key={i}
              className={`p-8 transition-all duration-500 group ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ backgroundColor: "#3a2a1a", transitionDelay: `${i * 100}ms` }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#4a3828")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#3a2a1a")}
            >
              <h3 className="font-mincho font-bold mb-3 leading-snug transition-colors" style={{ color: "#ffffff", fontSize: '18px' }}>
                {effect.title}
              </h3>
              <p className="font-sans-jp text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
                {effect.desc}
              </p>
            </div>
          ))}
        </div>

        {/* ボトムCTA */}
        <div className={`mt-16 text-center transition-all duration-700 delay-500 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="font-sans-jp text-sm mb-6" style={{ color: "rgba(255,255,255,0.75)" }}>
            ボタニカルミストは定期チェックのすべてのコースに含まれています
          </p>
          <button
            onClick={() => window.location.href = '/booking'}
            className="btn-gold-shimmer text-white font-sans-jp font-bold px-10 py-4 text-sm tracking-wider"
            style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}
          >
            頭皮リセット＋チェックを予約する
          </button>
        </div>
      </div>
    </section>
  );
}

// ターゲットセクション
function TargetSection() {
  const { ref, inView } = useInView();
  const targets = [
    {
      emoji: "",
      segment: "予防ケア男性",
      age: "20〜30代",
      message: "まだ大丈夫なうちに、始める安心",
      desc: "「将来のために」という意識で、早めに頭皮の状態を把握しておきたい方へ。",
    },
    {
      emoji: "",
      segment: "ダメージケア女性",
      age: "20〜30代",
      message: "おしゃれを続けるための、頭皮メンテナンス",
      desc: "カラー・パーマを繰り返す方の頭皮状態を記録・確認し、適切なケアをご提案します。",
    },
    {
      emoji: "",
      segment: "美容意識層",
      age: "30〜40代女性",
      message: "美容習慣に、頭皮ケアをプラス",
      desc: "エイジングケアに関心がある方へ。頭皮の状態を定期的に把握することが、美しい髪づくりをサポートします。",
    },
    {
      emoji: "",
      segment: "育毛ケア層",
      age: "40〜50代男女",
      message: "見える化で不安を安心に変える",
      desc: "薄毛・抜け毛が気になる方の頭皮状態を数値で記録し、継続的なケアをサポートします。",
    },
  ];

  return (
    <section className="py-28 bg-[oklch(0.977_0.012_85)]">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-cormorant text-[oklch(0.72_0.12_70)] text-sm tracking-[0.3em] uppercase block mb-4">
            For You
          </span>
          <h2 className="font-mincho text-[oklch(0.22_0.045_42)] text-3xl md:text-4xl font-bold">
            こんな方におすすめです
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {targets.map((t, i) => (
            <div
              key={i}
              className={`bg-white border border-[oklch(0.88_0.025_75)] rounded-sm p-8 hover:shadow-lg transition-all duration-500 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start gap-6">
                <div className="text-4xl flex-shrink-0">{t.emoji}</div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-sans-jp text-xs text-[oklch(0.55_0.04_42)] bg-[oklch(0.955_0.018_82)] px-2 py-0.5 rounded-full">
                      {t.age}
                    </span>
                    <span className="font-sans-jp text-xs text-[oklch(0.72_0.12_70)] font-medium">{t.segment}</span>
                  </div>
                  <h3 className="font-mincho text-[oklch(0.22_0.045_42)] text-lg font-bold mb-3">
                    「{t.message}」
                  </h3>
                  <p className="font-sans-jp text-[oklch(0.55_0.04_42)] text-sm leading-relaxed">{t.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// デジタル機能セクション
function DigitalSection() {
  return (
    <section className="py-24 border-t border-[#C9A84C]/20" style={{ backgroundColor: "#1a1208" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <p className="text-xs tracking-[0.3em] mb-4" style={{ color: "#C9A84C", fontFamily: "'Noto Sans JP', sans-serif" }}>MY SCALP KARTE</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Shippori Mincho', serif", color: "#ffffff" }}>
              マイスカルプ<br />
              <span style={{ color: "#C9A84C" }}>カルテ</span>
            </h2>
            <p className="text-sm leading-relaxed mb-8" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "rgba(255,255,255,0.75)", lineHeight: "1.9" }}>
              定期チェックのたびに頭皮の記録が蓄積される、<br />
              女性のためのヘアケアカルテアプリ。<br />
              自分の頭皮状態を知り、継続的なケアをサポートします。
            </p>
            <ul className="space-y-3 mb-10">
              {[
                "頭皮画像のアップロード・時系列記録",
                "症状・生活習慣のログ管理",
                "スカルプフォト・状態ガイド",
                "サロンとのデータ共有機能",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm" style={{ fontFamily: "'Noto Sans JP', sans-serif", color: "rgba(255,255,255,0.85)" }}>
                  <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#C9A84C", fontSize: "10px", color: "#ffffff", fontWeight: 700 }}>✓</span>
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
                style={{ backgroundColor: "#1a1208", borderColor: "rgba(201,168,76,0.4)" }}
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
                style={{ backgroundColor: "#1a1208", borderColor: "rgba(201,168,76,0.4)" }}
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
              alt="マイスカルプカルテ モックアップ"
              className="w-full max-w-lg object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// FAQセクション
function FaqSection() {
  const { ref, inView } = useInView();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = [
    {
      q: "痛みはありますか？",
      a: "まったくありません。マイクロスコープを頭皮に軽く当てて撮影するだけです。施術は一切行いません。",
    },
    {
      q: "薄毛でなくても受けられますか？",
      a: "はい、むしろ「まだ大丈夫」な段階からの定期チェックをおすすめしています。頭皮の状態を定期的に把握することが、日頃のケアに役立ちます。",
    },
    {
      q: "ボタニカルミスト（ハーブスチーマー）とは何ですか？",
      a: "ハーブや植物エキスを配合したミストを頭皮に当てるケアです。ミストの薇気が頭皮の毛穴をソフトに開き、皮脂・汚れ・老廃角質をやわらかくウォームアップします。季節に合わせて配合ハーブを変えることで、定期チェックの前に頭皮を整える効果があります。",
    },
    {
      q: "スカルプハーブゴマージュとは何ですか？",
      a: "頭皮用に開発したゴマージュ（スクラブ）です。ハーブエキスを配合した細かな粒子が、頭皮の毛穴に詰まった皮脂・汚れ・老廃角質を优しくでもしっかり除去します。シャンプーだけでは落としきれない汚れや皮脂のクレンジングに特に効果的です。定期チェック時に并用することで、チェック精度が向上します。",
    },
    {
      q: "ハーブエキスはどのような効果がありますか？",
      a: "頭皮の状態に合わせて選定した植物エキスを頭皮に直接尊入します。皮脂バランスの調整、頭皮環境の整備、髪のハリ・コシの改善などをサポートします。季節や頭皮の状態に応じて配合を変えるため、定期チェックの結果をもとにパーソナライズした提案が可能です。",
    },
    {
      q: "どのくらいの頻度で通えばいいですか？",
      a: "1ヶ月に1回のボタニカルスカルプケアを推奨しています。季節の変わり目に頭皮状態が変化しやすいため、定期的な記録で変化を追うことが大切です。まずは無料スカルプチェックからお気軽にお試しください。",
    },
    {
      q: "男性でも女性でも受けられますか？",
      a: "はい、性別を問わずご利用いただけます。２０代〜５０代まで幅広い方にご利用いただいています。",
    },
    {
      q: "データはどのように管理されますか？",
      a: "撮影した頭皮画像や診断データはLINEまたは専用アプリで安全に管理されます。ご本人の許可なく第三者に共有されることはありません。",
    },
    {
      q: "医療行為ではないですか？",
      a: "THE HERBS SCALP LABは医療行為ではありません。マイクロスコープによる頭皮の撮影・記録・確認を行うサービスです。医療機関への受診が適切と思われる場合は、提携医療機関をご案内することがあります。",
    },
  ];

  return (
    <section className="py-28 bg-[oklch(0.977_0.012_85)]" id="よくある質問">
      <div ref={ref} className="max-w-3xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-cormorant text-[oklch(0.72_0.12_70)] text-sm tracking-[0.3em] uppercase block mb-4">
            FAQ
          </span>
          <h2 className="font-mincho text-[oklch(0.22_0.045_42)] text-3xl md:text-4xl font-bold">
            よくあるご質問
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`border border-[oklch(0.88_0.025_75)] rounded-sm overflow-hidden transition-all duration-700 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <button
                className="w-full text-left p-6 flex items-center justify-between bg-white hover:bg-[oklch(0.977_0.012_85)] transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
              <span className="font-mincho text-[oklch(0.22_0.045_42)] text-lg font-bold">
                {faq.q}
                </span>
                <span
                  className={`text-[oklch(0.72_0.12_70)] text-xl flex-shrink-0 transition-transform duration-300 ${
                    openIndex === i ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-6 bg-white border-t border-[oklch(0.88_0.025_75)]">
                  <p className="font-sans-jp text-[oklch(0.55_0.04_42)] text-sm leading-relaxed pt-4">
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

// お客様の声セクション
function TestimonialsSection() {
  const { ref, inView } = useInView();
  const testimonials = [
    {
      name: "T.M さん",
      age: "32歳・女性",
      segment: "ヘアカラー愛用者",
      rating: 5,
      text: "カラーを繰り返していて頭皮が気になっていました。スカルプチェックで自分の頭皮の状態を画像で見て、ケアの意識が変わりました。スタッフの方が丁寧に説明してくれて安心できました。",
      highlight: "画像で見て、ケアの意識が変わりました",
    },
    {
      name: "K.S さん",
      age: "28歳・男性",
      segment: "予防ケア目的",
      rating: 5,
      text: "父が薄毛なので将来が不安で利用しました。まだ問題ないと確認できて安心しましたし、今後のホームケアの参考になりました。定期的に通って記録を続けようと思います。",
      highlight: "今後のホームケアの参考になりました",
    },
    {
      name: "A.N さん",
      age: "41歳・女性",
      segment: "エイジングケア層",
      rating: 5,
      text: "産後から髪のハリがなくなった気がしていて相談しました。頭皮の状態をデータで記録してもらえるので、次回との比較ができるのがとても良いです。スタッフの方も知識が豊富で信頼できます。",
      highlight: "データで記録してもらえるので比較ができる",
    },
    {
      name: "H.Y さん",
      age: "45歳・男性",
      segment: "薄毛が気になり始めた層",
      rating: 4,
      text: "薄毛が気になり始めて、まず状態を把握したくて来店しました。医療機関ではないので気軽に相談できる点が良かったです。ケア製品の提案も押しつけがましくなく好印象でした。",
      highlight: "気軽に相談できる点が良かった",
    },
    {
      name: "Y.O さん",
      age: "25歳・女性",
      segment: "美容意識層",
      rating: 5,
      text: "美容院でたまたまスカルプチェックを勧められて受けました。自分の頭皮がこんな状態だったとは知らなくて驚きました。サブスクプランに入って毎回記録を続けています。",
      highlight: "自分の頭皮がこんな状態だったとは",
    },
    {
      name: "R.T さん",
      age: "38歳・男性",
      segment: "継続利用者",
      rating: 5,
      text: "1年以上継続しています。季節ごとに頭皮の状態が変わることがデータでわかるので面白いです。ホームケアのアドバイスも毎回参考になっています。",
      highlight: "季節ごとの変化がデータでわかる",
    },
  ];

  return (
    <section className="py-28 bg-[oklch(0.22_0.045_42)]" id="お客様の声">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-cormorant text-[oklch(0.72_0.12_70)] text-sm tracking-[0.3em] uppercase block mb-4">
            Testimonials
          </span>
          <h2 className="font-mincho text-white text-3xl md:text-4xl font-bold mb-4">
            ご利用者の声
          </h2>
          <p className="font-sans-jp text-white/50 text-xs">
            ※ 個人の感想です。効果・体験には個人差があります。
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`bg-[oklch(0.28_0.05_42)] border border-white/10 rounded-sm p-7 transition-all duration-700 hover:border-[oklch(0.72_0.12_70)/40] hover:shadow-xl ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              {/* 星評価 */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, j) => (
                  <span
                    key={j}
                    className={`text-sm ${
                      j < t.rating ? "text-[oklch(0.72_0.12_70)]" : "text-white/20"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              {/* ハイライト */}
              <p className="font-mincho text-[oklch(0.88_0.08_75)] text-sm font-bold mb-3 leading-snug">
                「{t.highlight}」
              </p>
              {/* 本文 */}
              <p className="font-sans-jp text-white/80 text-xs leading-relaxed mb-5">
                {t.text}
              </p>
              {/* プロフィール */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="w-9 h-9 rounded-full bg-[oklch(0.72_0.12_70)/20] flex items-center justify-center flex-shrink-0">
                  <span className="font-cormorant text-[oklch(0.72_0.12_70)] text-sm font-semibold">
                    {t.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-mincho text-white text-sm font-bold">{t.name}</p>
                  <p className="font-sans-jp text-white/65 text-[10px]">{t.age}・{t.segment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ビフォーアフターセクション
function BeforeAfterSection() {
  const { ref, inView } = useInView();
  const [active, setActive] = useState(0);

  return (
    <section className="py-28 bg-[oklch(0.97_0.012_82)]" id="ビフォーアフター">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        {/* ヘッダー */}
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-cormorant text-[oklch(0.72_0.12_70)] text-sm tracking-[0.3em] uppercase block mb-4">
            Before &amp; After
          </span>
          <h2 className="font-mincho text-[oklch(0.22_0.045_42)] text-3xl md:text-4xl font-bold mb-4">
            お客様のビフォーアフター
          </h2>
          <p className="font-sans-jp text-[oklch(0.55_0.04_42)] text-sm">
            継続的な頭皮ケアで変わった、実際のお客様の記録です。
          </p>
        </div>

        {/* メイン表示 */}
        <div className={`transition-all duration-700 delay-200 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {/* 大きい画像 */}
          <div className="relative max-w-lg mx-auto mb-8">
            <div className="relative overflow-hidden rounded-sm shadow-2xl bg-[oklch(0.22_0.045_42)]">
              <img
                src={BA_IMAGES[active].src}
                alt={`${BA_IMAGES[active].label} ビフォーアフター`}
                className="w-full object-cover transition-opacity duration-500"
                style={{ aspectRatio: "3/4", objectFit: "cover" }}
              />
              {/* ラベル */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[oklch(0.12_0.04_42)/90] to-transparent px-6 py-5">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="font-cormorant text-[oklch(0.72_0.12_70)] text-xs tracking-widest uppercase block mb-1">
                      {BA_IMAGES[active].gender} · {BA_IMAGES[active].period}
                    </span>
                    <p className="font-mincho text-white text-lg font-bold">
                      {BA_IMAGES[active].label}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-sans-jp text-[oklch(0.88_0.08_75)] text-xs bg-[oklch(0.72_0.12_70)/20] border border-[oklch(0.72_0.12_70)/40] px-3 py-1 rounded-full">
                      Before → After
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* ナビゲーション矢印 */}
            <button
              onClick={() => setActive((prev) => (prev - 1 + BA_IMAGES.length) % BA_IMAGES.length)}
              className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-[oklch(0.22_0.045_42)] hover:bg-[oklch(0.72_0.12_70)] hover:text-white transition-all"
              aria-label="前の画像"
            >
              ‹
            </button>
            <button
              onClick={() => setActive((prev) => (prev + 1) % BA_IMAGES.length)}
              className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-[oklch(0.22_0.045_42)] hover:bg-[oklch(0.72_0.12_70)] hover:text-white transition-all"
              aria-label="次の画像"
            >
              ›
            </button>
          </div>

          {/* サムネイルグリッド */}
          <div className="grid grid-cols-4 md:grid-cols-7 gap-2 max-w-2xl mx-auto">
            {BA_IMAGES.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActive(i)}
                className={`relative overflow-hidden rounded-sm transition-all duration-300 ${
                  active === i
                    ? "ring-2 ring-[oklch(0.72_0.12_70)] ring-offset-2 opacity-100 scale-105"
                    : "opacity-60 hover:opacity-90"
                }`}
                aria-label={img.label}
              >
                <img
                  src={img.src}
                  alt={img.label}
                  className="w-full object-cover"
                  style={{ aspectRatio: "3/4", objectFit: "cover" }}
                />
              </button>
            ))}
          </div>

          {/* ドットインジケーター */}
          <div className="flex justify-center gap-2 mt-6">
            {BA_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  active === i ? "bg-[oklch(0.72_0.12_70)] w-6" : "bg-[oklch(0.72_0.12_70)/30]"
                }`}
                aria-label={`画像${i + 1}`}
              />
            ))}
          </div>

          {/* 注意書き */}
          <p className="text-center font-sans-jp text-[oklch(0.65_0.04_42)] text-[11px] mt-6">
            ※ 個人の体験・感想です。効果には個人差があります。掲載にあたりご本人の同意を得ています。
          </p>
        </div>
      </div>
    </section>
  );
}

// // 予約フォームセクション
function ReservationSection() {
  const { ref, inView } = useInView();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    plan: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const createReservation = trpc.reservation.create.useMutation();
  const timeSlots = [
    "10:00", "10:30", "11:00", "11:30",
    "13:00", "13:30", "14:00", "14:30",
    "15:00", "15:30", "16:00", "16:30",
    "17:00", "17:30", "18:00",
  ];
  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "お名前を入力してください";
    if (!form.phone.trim()) e.phone = "電話番号を入力してください";
    else if (!/^[0-9\-+()\s]{10,15}$/.test(form.phone.replace(/\s/g, ""))) e.phone = "正しい電話番号を入力してください";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "正しいメールアドレスを入力してください";
    if (!form.date) e.date = "ご希望日を選択してください";
    if (!form.time) e.time = "ご希望時間を選択してください";
    if (!form.plan) e.plan = "コースを選択してください";
    return e;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setSubmitting(true);
    try {
      await createReservation.mutateAsync({
        name: form.name,
        phone: form.phone,
        email: form.email || undefined,
        desiredDate: form.date,
        desiredTime: form.time,
        plan: form.plan as "free" | "standard" | "personal" | "consult",
        message: form.message || undefined,
        gender: "women",
      });
      setSubmitted(true);
    } catch {
      setErrors({ submit: "送信に失敗しました。お電話またはLINEでご予約ください。" });
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full font-sans-jp text-sm bg-[oklch(0.28_0.05_42)] border ${
      errors[field]
        ? "border-red-400"
        : "border-white/15 focus:border-[oklch(0.72_0.12_70)]"
    } text-white placeholder-white/30 rounded-sm px-4 py-3 outline-none transition-colors`;

  return (
    <section className="py-28 bg-[oklch(0.18_0.04_42)]" id="予約">
      <div ref={ref} className="max-w-3xl mx-auto px-6">
        <div className={`text-center mb-14 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-cormorant text-[oklch(0.72_0.12_70)] text-sm tracking-[0.3em] uppercase block mb-4">
            Reservation
          </span>
          <h2 className="font-mincho text-white text-3xl md:text-4xl font-bold mb-4">
            無料スカルプチェックを予約する
          </h2>
          <p className="font-sans-jp text-white/75 text-sm">
            所要時間は5〜10分。お気軽にお申し込みください。
          </p>
        </div>

        {submitted ? (
          <div className={`text-center py-16 transition-all duration-700 ${inView ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
            <div className="w-20 h-20 rounded-full bg-[oklch(0.72_0.12_70)/20] flex items-center justify-center mx-auto mb-6">
              <span className="text-[oklch(0.72_0.12_70)] text-3xl">✓</span>
            </div>
            <h3 className="font-mincho text-white text-2xl font-bold mb-4">ご予約を受け付けました</h3>
            <p className="font-sans-jp text-white/80 text-sm leading-relaxed mb-2">
              ご登録の連絡先に確認のご連絡をさしあげます。<br />
              しばらくお待ちください。
            </p>
            <p className="font-sans-jp text-white/55 text-xs mt-6">
              ※ このフォームはデモ用です。実際の予約は担当スタッフがご確認します。
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className={`space-y-6 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {/* お名前 */}
            <div>
              <label className="font-sans-jp text-white/70 text-xs block mb-2">
                お名前 <span className="text-[oklch(0.72_0.12_70)]">*</span>
              </label>
              <input
                type="text"
                placeholder="山田 太郎"
                value={form.name}
                onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: "" }); }}
                className={inputClass("name")}
              />
              {errors.name && <p className="font-sans-jp text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* 電話番号・メール */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="font-sans-jp text-white/70 text-xs block mb-2">
                  電話番号 <span className="text-[oklch(0.72_0.12_70)]">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="090-0000-0000"
                  value={form.phone}
                  onChange={(e) => { setForm({ ...form, phone: e.target.value }); setErrors({ ...errors, phone: "" }); }}
                  className={inputClass("phone")}
                />
                {errors.phone && <p className="font-sans-jp text-red-400 text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="font-sans-jp text-white/70 text-xs block mb-2">
                  メールアドレス <span className="text-white/30 text-[10px]">（任意）</span>
                </label>
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={form.email}
                  onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: "" }); }}
                  className={inputClass("email")}
                />
                {errors.email && <p className="font-sans-jp text-red-400 text-xs mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* 希望日・時間 */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="font-sans-jp text-white/70 text-xs block mb-2">
                  ご希望日 <span className="text-[oklch(0.72_0.12_70)]">*</span>
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={form.date}
                  onChange={(e) => { setForm({ ...form, date: e.target.value }); setErrors({ ...errors, date: "" }); }}
                  className={inputClass("date") + " [color-scheme:dark]"}
                />
                {errors.date && <p className="font-sans-jp text-red-400 text-xs mt-1">{errors.date}</p>}
              </div>
              <div>
                <label className="font-sans-jp text-white/70 text-xs block mb-2">
                  ご希望時間 <span className="text-[oklch(0.72_0.12_70)]">*</span>
                </label>
                <select
                  value={form.time}
                  onChange={(e) => { setForm({ ...form, time: e.target.value }); setErrors({ ...errors, time: "" }); }}
                  className={inputClass("time")}
                >
                  <option value="" disabled>時間を選択</option>
                  {timeSlots.map((t) => (
                    <option key={t} value={t} className="bg-[oklch(0.22_0.045_42)]">{t}</option>
                  ))}
                </select>
                {errors.time && <p className="font-sans-jp text-red-400 text-xs mt-1">{errors.time}</p>}
              </div>
            </div>

            {/* コース選択 */}
            <div>
              <label className="font-sans-jp text-white/70 text-xs block mb-3">
                ご希望コース <span className="text-[oklch(0.72_0.12_70)]">*</span>
              </label>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { value: "free", label: "無料スカルプチェック", sub: "5〜10分・無料" },
                  { value: "standard", label: "THE HERBS SCALP LAB定期ケア", sub: "30～40分・3,000～5,000円" },
                  { value: "consult", label: "まずは相談したい", sub: "内容を相談" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => { setForm({ ...form, plan: opt.value }); setErrors({ ...errors, plan: "" }); }}
                    className={`text-left p-4 rounded-sm border transition-all ${
                      form.plan === opt.value
                        ? "border-[oklch(0.72_0.12_70)] bg-[oklch(0.72_0.12_70)/15]"
                        : "border-white/15 bg-[oklch(0.28_0.05_42)] hover:border-white/30"
                    }`}
                  >
                    <p className={`font-mincho text-xs font-bold mb-1 ${
                      form.plan === opt.value ? "text-[oklch(0.88_0.08_75)]" : "text-white"
                    }`}>{opt.label}</p>
                    <p className="font-sans-jp text-white/40 text-[10px]">{opt.sub}</p>
                  </button>
                ))}
              </div>
              {errors.plan && <p className="font-sans-jp text-red-400 text-xs mt-2">{errors.plan}</p>}
            </div>

            {/* メッセージ */}
            <div>
              <label className="font-sans-jp text-white/70 text-xs block mb-2">
                ご質問・ご要望 <span className="text-white/30 text-[10px]">（任意）</span>
              </label>
              <textarea
                rows={3}
                placeholder="気になること、ご要望などがあればお気軽にどうぞ。"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className={inputClass("message") + " resize-none"}
              />
            </div>

            {/* 同意チェック */}
            <div className="flex items-start gap-3">
              <input type="checkbox" id="privacy" required className="mt-1 accent-[oklch(0.72_0.12_70)]" />
              <label htmlFor="privacy" className="font-sans-jp text-white/50 text-xs leading-relaxed">
                <a href="/privacy" target="_blank" className="text-[oklch(0.72_0.12_70)] underline hover:text-[oklch(0.82_0.10_75)]">プライバシーポリシー</a>に同意の上、送信します。
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full btn-gold-shimmer text-white font-sans-jp font-bold py-4 rounded-sm text-base transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed" style={{textShadow: '0 1px 2px rgba(0,0,0,0.4)'}}
            >
              {submitting ? "送信中..." : "予約を申し込む"}
            </button>
            {errors.submit && (
              <p className="font-sans-jp text-red-400 text-xs text-center mt-2">{errors.submit}</p>
            )}

            <p className="font-sans-jp text-white/25 text-[11px] text-center leading-relaxed">
              ※ ご予約後、担当スタッフよりご連絡いたします。
              個人情報は予約確認の目的のみに使用し、第三者に提供しません。
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

// 店舗情報・アクセスセクション
function StoreSection() {
  const { ref, inView } = useInView();

  const stores = [
    {
      id: "hankyu",
      name: "THE HERBS SCALP LABO 神戸阪急店",
      nameEn: "SCALP LABO THE HERBS Kobe Hankyu",
      badge: "百貨店内サロン",
      address: "兵庫県神戸市中央区小野柄通８丁目１−8",
      address2: "神戸阪急本館6階 モーニングフロー内",
      hours: [
        { day: "営業時間", time: "10:00 ～ 20:00" },
      ],
      closed: "1月1日～2日",
      line: "https://lin.ee/RhtIZDl",
      lineId: "@theherbs_kobe",
      features: ["頭皮チェック", "ハーブスチーマー（ボタニカルミスト）", "頭皮データの記録・管理"],
      mapUrl: "https://maps.google.com/?q=兵庫県神戸市中央区小野柄通8丁目1番8号+神戸阪急本館6階",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3281.0!2d135.19476!3d34.69344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000e6f7b8e5a3a3%3A0x5b1e2c3d4e5f6a7b!2z56aP5oi45YWD5pys5pys6aSo6Ziz5bGxIOOBiOOBj-OBhOOBhOOBhA!5e0!3m2!1sja!2sjp!4v1700000000000!5m2!1sja!2sjp",
      color: "oklch(0.72_0.12_70)",
    },
    {
      id: "nada",
      name: "THE HERBS SCALP LABO サロン",
      nameEn: "SCALP LABO THE HERBS Salon",
      badge: "直営ヘッドスパサロン",
      address: "兵庫県神戸市灘区大内通1-7-17 1F",
      address2: "",
      hours: [
        { day: "水・金", time: "10:00 ～ 18:00" },
        { day: "土", time: "13:00 ～ 20:00" },
      ],
      closed: "火曜・日曜・祝日定休",
      line: "https://lin.ee/oWeHStW",
      lineId: "@theherbs39",
      features: ["育毛メニュー", "ディープクレンジング", "うねりケア", "ヘアカラー後の頭皮ケア", "和漢カラー"],
      mapUrl: "https://maps.app.goo.gl/a96J7E9gnPBXi9tA6",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3279.8!2d135.2257085!3d34.7128842!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60008dba49ad1097%3A0x351be9b6133f830b!2sMODE+VERDE+%E3%82%B5%E3%83%AD%E3%83%B3!5e0!3m2!1sja!2sjp!4v1700000000001!5m2!1sja!2sjp",
      color: "oklch(0.62_0.14_160)",
    },
  ];

  return (
    <section className="py-28 bg-[oklch(0.97_0.012_82)]" id="店舗情報">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        {/* ヘッダー */}
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-cormorant text-[oklch(0.72_0.12_70)] text-sm tracking-[0.3em] uppercase block mb-4">
            Our Locations
          </span>
          <h2 className="font-mincho text-[oklch(0.22_0.045_42)] text-3xl md:text-4xl font-bold mb-4">
            店舗・アクセス
          </h2>
          <p className="font-sans-jp text-[oklch(0.45_0.04_42)] text-sm max-w-xl mx-auto leading-relaxed">
            神戸市内2拠点で、頭皮の定期チェックをお受けしています。
          </p>
        </div>

        {/* 店舗カード */}
        <div className="grid md:grid-cols-2 gap-8">
          {stores.map((store, i) => (
            <div
              key={store.id}
              className={`bg-white border border-[oklch(0.88_0.025_75)] rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {/* マップエリア */}
                <div className="relative h-52 bg-[oklch(0.92_0.015_75)] overflow-hidden">
                <iframe
                  title={store.name}
                  src={store.mapEmbed}
                  className="w-full h-full border-0"
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
                {/* バッジ */}
                <div
                  className="absolute top-3 left-3 font-sans-jp text-white text-xs font-medium px-3 py-1 rounded-full z-20"
                  style={{ backgroundColor: `oklch(${store.color.slice(7, -1)} / 0.9)` }}
                >
                  {store.badge}
                </div>
              </div>

              {/* 情報エリア */}
              <div className="p-7">
                <div className="mb-5">
                  <p className="font-cormorant text-[oklch(0.72_0.12_70)] text-xs tracking-widest uppercase mb-1">
                    {store.nameEn}
                  </p>
                  <h3 className="font-mincho text-[oklch(0.22_0.045_42)] text-xl font-bold">
                    {store.name}
                  </h3>
                </div>

                {/* 住所 */}
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-[oklch(0.72_0.12_70)] text-base mt-0.5 flex-shrink-0"></span>
                  <div className="font-sans-jp text-[oklch(0.38_0.055_42)] text-sm leading-relaxed">
                    <p>{store.address}</p>
                    {store.address2 && <p>{store.address2}</p>}
                  </div>
                </div>

                {/* 営業時間 */}
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-[oklch(0.72_0.12_70)] text-base mt-0.5 flex-shrink-0"></span>
                  <div>
                    {store.hours.map((h) => (
                      <div key={h.day} className="flex gap-3 mb-1">
                        <span className="font-sans-jp text-[oklch(0.55_0.04_42)] text-xs w-20 flex-shrink-0">{h.day}</span>
                        <span className="font-sans-jp text-[oklch(0.22_0.045_42)] text-xs font-medium">{h.time}</span>
                      </div>
                    ))}
                    <p className="font-sans-jp text-[oklch(0.65_0.04_42)] text-xs mt-1">定休日：{store.closed}</p>
                  </div>
                </div>

                {/* 施術メニュー */}
                <div className="mb-6">
                  <p className="font-sans-jp text-[oklch(0.55_0.04_42)] text-xs mb-2 tracking-wider">主な施術メニュー</p>
                  <div className="flex flex-wrap gap-2">
                    {store.features.map((f) => (
                      <span
                        key={f}
                        className="font-sans-jp text-xs px-2.5 py-1 rounded-full border"
                        style={{
                          borderColor: `oklch(${store.color.slice(7, -1)} / 0.4)`,
                          color: `oklch(${store.color.slice(7, -1)})`,
                          backgroundColor: `oklch(${store.color.slice(7, -1)} / 0.06)`,
                        }}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTAボタン */}
                <div className="flex gap-3">
                  <a
                    href={store.line}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 font-sans-jp text-white text-xs font-semibold py-3 rounded-sm text-center transition-opacity hover:opacity-90"
                    style={{ backgroundColor: "#06C755" }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                    </svg>
                    LINEで予約・問合せ
                    <span className="text-white/70 text-[10px] font-normal ml-1">{store.lineId}</span>
                  </a>

                </div>
              </div>
            </div>
          ))}
        </div>

        {/* サロン募集バナー — 内容確定まで一時非表示 */}
        {false && <div className={`mt-16 bg-[oklch(0.22_0.045_42)] rounded-sm p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 transition-all duration-700 delay-300 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}>
          <div>
            <p className="font-cormorant text-[oklch(0.72_0.12_70)] text-xs tracking-[0.3em] uppercase mb-2">For Salon Partners</p>
            <h3 className="font-mincho text-white text-xl md:text-2xl font-bold mb-2">
              THE HERBS SCALP LABの認定サロンになりませんか？
            </h3>
            <p className="font-sans-jp text-white/75 text-sm leading-relaxed">
              エステサロン・美容師の方向けに、頭皮チェックの技術講習と認定制度をご用意しています。
            </p>
          </div>
          <a
            href="/salon"
            className="flex-shrink-0 border border-[oklch(0.72_0.12_70)] text-[oklch(0.72_0.12_70)] font-sans-jp font-medium text-sm px-8 py-3.5 rounded-sm hover:bg-[oklch(0.72_0.12_70)] hover:text-[oklch(0.18_0.04_42)] transition-all duration-300 whitespace-nowrap"
          >
            認定サロン募集ページへ →
          </a>
        </div>}
      </div>
    </section>
  );
}
// CTAセクション
function CtaSection() {
  const { ref, inView } = useInView();
  return (
    <section className="py-28 bg-[oklch(0.22_0.045_42)] relative overflow-hidden" id="cta">
      <div className="absolute inset-0 opacity-10">
        <img src={IMAGES.consultation} alt="頭皮ケアコンサルテーションの様子" className="w-full h-full object-cover" aria-hidden="true" />
      </div>
      <div ref={ref} className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <div className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-cormorant text-[oklch(0.72_0.12_70)] text-sm tracking-[0.3em] uppercase block mb-6">
            Start Your Journey
          </span>
          <h2 className="font-mincho text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            まずは<span className="text-[oklch(0.88_0.08_75)]">無料</span>で<br />
            頭皮の今を知ることから。
          </h2>
          <p className="font-sans-jp text-white/70 text-base mb-10 leading-relaxed">
            5〜10分の無料スカルプチェックで、あなたの頭皮の状態を記録・確認します。<br className="hidden md:block" />
            予約はLINEまたはウェブから簡単に。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/booking"
              className="btn-gold-shimmer text-white font-sans-jp font-bold px-10 py-5 rounded-sm text-base" style={{textShadow: '0 1px 2px rgba(0,0,0,0.4)'}}
            >
              無料スカルプチェックを予約する
            </a>
            <a
              href="https://lin.ee/oWeHStW"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-white/40 text-white font-sans-jp font-medium px-10 py-5 rounded-sm text-base hover:bg-white/10 transition-colors"
            >
              LINEで予約する
            </a>
          </div>
          <p className="font-sans-jp text-white/65 text-xs mt-6">
            ※ 無料チェックは所要5〜10分です。お気軽にお問い合わせください。
          </p>
        </div>
      </div>
    </section>
  );
}

// フッター
function Footer() {
  return (
    <footer className="bg-[oklch(0.15_0.035_42)] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/scalp-labo-logo-transparent_e6faa3cd.png"
                alt="SCALP LABO"
                className="h-10 w-auto object-contain"
              />
            </div>
            {/* THE HERBS ブランドリンク */}
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/10">
              <span className="font-cormorant text-white/30 text-[10px] tracking-[0.15em] uppercase">by</span>
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/theherbs_logo_395db853.webp"
                alt="THE HERBS"
                className="h-3.5 w-auto brightness-0 invert opacity-50"
              />
            </div>
            <p className="font-sans-jp text-white/65 text-xs leading-relaxed">
              歯科ケアのように定期的に頭皮をケアする新習慣。<br />
              マイクロスコープによる頭皮チェックで、健康な髪をサポート。
            </p>
          </div>
          <div>
            <h4 className="font-mincho text-white text-sm font-bold mb-4">サービス</h4>
            <ul className="space-y-2">
              {[
                { label: "無料スカルプチェック", href: "/booking" },
                { label: "THE HERBS SCALP LAB定期ケア", href: "#サービス" },
                { label: "店舗・アクセス", href: "#店舗情報" },
                { label: "認定サロン募集", href: "/salon" },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="font-sans-jp text-white/60 text-xs hover:text-white/90 transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-mincho text-white text-sm font-bold mb-4">お問い合わせ</h4>
            <ul className="space-y-2">
              {[
                { label: "予約・お問い合わせ", href: "/booking" },
                { label: "よくある質問", href: "#よくある質問" },
                { label: "プライバシーポリシー", href: "/privacy" },
                { label: "特定商取引法に基づく表記", href: "/tokushoho" },
              ].map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="font-sans-jp text-white/60 text-xs hover:text-white/90 transition-colors">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* 免責事項 */}
        <div className="border-t border-white/10 pt-8 mb-6">
          <p className="font-sans-jp text-white/55 text-[11px] leading-relaxed max-w-3xl mx-auto text-center">
            【免責事項】本サービスは医療行為ではありません。疾病の診断・治療・予防を目的とするものではなく、頭皮の状態を記録・確認するサービスです。医療的な相談・治療が必要な場合は、医師または医療機関にご相談ください。掲載の数値・実績はすべて当社調べによるものです。個人の体験・効果には差があります。
          </p>
        </div>
        <div className="text-center">
          <p className="font-sans-jp text-white/55 text-xs">
            © 2025 SCALP LABO / THE HERBS. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// メインコンポーネント
export default function Home() {
  useEffect(() => {
    document.title = "THE HERBS SCALP LABO | 頭皮の定期チェック・スカルプケア専門サロン 神戸";
  }, []);

  return (
    <div className="min-h-screen">
      <Nav />
      <HeroSection />
      <ProblemSection />
      <ScalpGallerySection />
      <ConceptSection />
      <HabitValueSection />
      <StatsSection />
      <ServiceSection />
      <BotanicalMistSection />
      <TargetSection />
      <DigitalSection />
      <BeforeAfterSection />
      <TestimonialsSection />
      <FaqSection />
      <StoreSection />
      <ReservationSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
