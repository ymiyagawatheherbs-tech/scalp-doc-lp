/*
 * THE HERBS SCALP LABO LP — Home Page (Simplified)
 * Design: ベースフード風 — 1セクション1メッセージ、大きな余白、キャッチコピー主体
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
  scalpCheck: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/scalp_check_dfbc71b8.jpg",
  botanicalMist: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/herb_steamer_8218d07e.jpg",
};

// Intersection Observer フック
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

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
      <div className="h-full bg-gradient-to-r from-[oklch(0.40_0.065_65)] to-[oklch(0.85_0.030_93)] transition-all duration-100" style={{ width: `${progress}%` }} />
    </div>
  );
}

// ナビゲーション
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      <ScrollProgressBar />
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[oklch(0.975_0.018_100/0.97)] backdrop-blur-md shadow-sm border-b border-[oklch(0.88_0.020_93)]" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-4">
          <a href="/" className="flex flex-col items-start leading-none gap-[3px] flex-shrink-0">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/theherbs-logo-white_7a2a3209.webp"
              alt="THE HERBS"
              className="object-contain transition-all block"
              style={{ height: "28px", width: "auto", marginLeft: "-17px", filter: scrolled ? "brightness(0)" : "none" }}
            />
            <span className="font-sans-jp tracking-widest transition-colors block" style={{ fontSize: "0.5rem", letterSpacing: "0.22em", color: scrolled ? "oklch(0.55 0.035 93)" : "rgba(255,255,255,0.65)" }}>
              SCALP LABO
            </span>
          </a>
          {/* デスクトップナビ */}
          <div className="hidden md:flex items-center gap-3 lg:gap-6 flex-shrink-0">
            {[
              { label: "なぜ必要か", href: "#問題" },
              { label: "実績", href: "#ビフォーアフター" },
              { label: "お客様の声", href: "#お客様の声" },
            ].map((item) => (
              <a key={item.label} href={item.href} className={`font-sans-jp text-sm transition-colors hover:text-[oklch(0.45_0.065_65)] ${scrolled ? "text-[oklch(0.35_0.060_65)]" : "text-white/80"}`}>
                {item.label}
              </a>
            ))}
            <a href="/salon" className={`font-sans-jp text-xs font-medium px-3 py-1.5 rounded-full border transition-all hover:scale-105 ${scrolled ? "border-[oklch(0.72_0.12_70)] text-[oklch(0.72_0.12_70)] hover:bg-[oklch(0.72_0.12_70)] hover:text-white" : "border-[oklch(0.72_0.12_70)/70] text-[oklch(0.82_0.10_75)] hover:border-[oklch(0.72_0.12_70)] hover:text-[oklch(0.72_0.12_70)]"}`}>
              サロン向け
            </a>
            <a href="/booking" className="btn-gold-shimmer text-white font-sans-jp text-sm font-bold px-4 py-2 rounded-sm flex items-center gap-1 flex-shrink-0" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)', textDecoration: 'none' }}>
              予約する
            </a>
          </div>
          {/* スマホ */}
          <div className="md:hidden flex items-center gap-2">
            <a href="/booking" className="btn-gold-shimmer text-white font-sans-jp text-xs font-bold px-3 py-1.5 rounded-sm" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)', textDecoration: 'none' }}>
              予約する
            </a>
            <button className="flex flex-col gap-1.5 p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="メニューを開く">
              <span className={`block w-5 h-0.5 transition-all duration-300 ${scrolled ? "bg-[oklch(0.28_0.050_65)]" : "bg-white"} ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-0.5 transition-all duration-300 ${scrolled ? "bg-[oklch(0.28_0.050_65)]" : "bg-white"} ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 transition-all duration-300 ${scrolled ? "bg-[oklch(0.28_0.050_65)]" : "bg-white"} ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>
        {/* モバイルメニュー */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="bg-[oklch(0.975_0.018_100/0.98)] backdrop-blur-md border-t border-[oklch(0.88_0.020_93)] px-6 py-6 space-y-4">
            {[
              { label: "なぜ必要か", href: "#問題" },
              { label: "実績", href: "#ビフォーアフター" },
              { label: "お客様の声", href: "#お客様の声" },
            ].map((item) => (
              <a key={item.label} href={item.href} onClick={() => setMobileOpen(false)} className="block font-sans-jp text-[oklch(0.28_0.050_65)] text-base py-2 border-b border-[oklch(0.88_0.020_93)] hover:text-[oklch(0.45_0.065_65)] transition-colors">
                {item.label}
              </a>
            ))}
            <a href="/salon" onClick={() => setMobileOpen(false)} className="flex items-center justify-center gap-2 border border-[oklch(0.72_0.12_70)] text-[oklch(0.72_0.12_70)] font-sans-jp font-medium text-sm text-center py-3 rounded-sm mt-2 hover:bg-[oklch(0.72_0.12_70)] hover:text-white transition-colors">
              サロン・美容師の方へ
            </a>
            <a href="/booking" onClick={() => setMobileOpen(false)} className="block btn-gold-shimmer text-white font-sans-jp font-bold text-center py-4 rounded-sm mt-2" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>
              無料スカルプチェックを予約する
            </a>
          </div>
        </div>
      </nav>
    </>
  );
}

// ── ヒーロー ──────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={IMAGES.hero} alt="THE HERBS SCALP LABO" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-6 pt-24 pb-16 md:py-32">
        <div className="max-w-2xl">
          <span className="font-cormorant text-xs tracking-[0.4em] uppercase block mb-5 animate-fade-in-up opacity-0-init" style={{ color: '#d4c5a0' }}>
            ✦ &nbsp;Scalp Wellness Checkup&nbsp; ✦
          </span>
          <h1 className="font-mincho leading-tight mb-6 animate-fade-in-up opacity-0-init delay-100" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
            <span className="block text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
              歯の定期検診のように、
            </span>
            <span className="block text-3xl md:text-5xl lg:text-6xl font-bold" style={{ color: '#f0d98a', textShadow: '0 0 40px rgba(240,217,138,0.4), 0 2px 20px rgba(0,0,0,0.5)' }}>
              頭皮も定期チェックを。
            </span>
          </h1>
          <p className="font-sans-jp text-white/85 text-base md:text-lg leading-relaxed mb-10 animate-fade-in-up opacity-0-init delay-200" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.6)' }}>
            植物の力で、10年後も豊かな髪を育む新習慣。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 animate-fade-in-up opacity-0-init delay-300">
            <a
              href="https://line.me/ti/p/%40723lsjqi"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans-jp font-bold px-7 py-3.5 text-center text-sm tracking-wider transition-all duration-300 hover:-translate-y-1 inline-flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #b8956a 0%, #d4aa7d 40%, #c49a6c 70%, #8b6845 100%)', color: '#fff', boxShadow: '0 4px 24px rgba(180,140,90,0.55)', textShadow: '0 1px 3px rgba(0,0,0,0.4)', textDecoration: 'none' }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}><path d="M12 2C6.48 2 2 6.02 2 11c0 3.07 1.58 5.8 4.04 7.54L5.5 22l4.14-2.16C10.39 20.27 11.18 20.4 12 20.4c5.52 0 10-4.02 10-9S17.52 2 12 2z" /></svg>
              LINEで頭皮の悩みを相談する（無料）
            </a>
            <a href="/booking" className="font-sans-jp font-bold px-7 py-3.5 text-center text-sm tracking-wider border border-white/60 text-white hover:bg-white/10 transition-all duration-300 inline-flex items-center justify-center" style={{ textDecoration: 'none' }}>
              無料チェックを予約する
            </a>
          </div>
          <div className="mt-10 flex items-center gap-4 animate-fade-in-up opacity-0-init delay-400">
            <div className="flex -space-x-2">
              {["A", "B", "C", "D"].map((l) => (
                <div key={l} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center" style={{ backgroundColor: 'oklch(0.72 0.038 93)' }}>
                  <span className="text-white text-[10px] font-semibold">{l}</span>
                </div>
              ))}
            </div>
            <p className="font-sans-jp text-white/70 text-sm">
              <span className="text-white font-medium">2,200名以上</span>が体験済み（当社調べ）
            </p>
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-cormorant text-white/50 text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/50 to-transparent" />
      </div>
    </section>
  );
}

// ── セクション1：問題提起 ──────────────────────────────
function ProblemSection() {
  const { ref, inView } = useInView();
  return (
    <section className="py-32 md:py-40 bg-[oklch(0.975_0.012_90)]" id="問題">
      <div ref={ref} className="max-w-5xl mx-auto px-6">
        {/* 比較3カード */}
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-0 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          {[
            { icon: "🦷", label: "歯", text: "毎日磨いても\n歯垢は溜まる。\nだから定期検診。" },
            { icon: "🌿", label: "肌", text: "毎日洗っても\n毛穴の汚れは残る。\nだから定期ケア。" },
            { icon: "💆", label: "頭皮", text: "毎日洗っても\n皮脂・汚れは蓄積。\nなのに、チェックしない？", highlight: true },
          ].map((item, i) => (
            <div
              key={i}
              className={`flex flex-col items-center justify-center py-16 px-8 text-center transition-all duration-700 ${item.highlight ? "bg-[oklch(0.28_0.055_65)]" : "bg-[oklch(0.965_0.010_90)] border-b md:border-b-0 md:border-r border-[oklch(0.88_0.015_90)]"}`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <span className="text-5xl mb-6 block">{item.icon}</span>
              <span className={`font-cormorant text-xs tracking-[0.3em] uppercase mb-4 block ${item.highlight ? "text-[oklch(0.72_0.038_93)]" : "text-[oklch(0.65_0.030_90)]"}`}>{item.label}</span>
              <p className={`font-mincho text-xl md:text-2xl font-bold leading-relaxed whitespace-pre-line ${item.highlight ? "text-white" : "text-[oklch(0.30_0.055_65)]"}`}>{item.text}</p>
            </div>
          ))}
        </div>
        {/* メインコピー */}
        <div className={`text-center mt-24 transition-all duration-700 delay-400 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h2 className="font-mincho text-[oklch(0.28_0.055_65)] text-3xl md:text-5xl font-bold leading-tight mb-6">
            頭皮に意識を向けることが、<br />
            <span style={{ color: 'oklch(0.55 0.10 70)' }}>髪の未来への安心</span>になる。
          </h2>
          <p className="font-sans-jp text-[oklch(0.45_0.050_65)] text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            歯科の定期検診のように、頭皮も「見る習慣」を持つことで<br className="hidden md:block" />
            将来の不安をなくすことができます。
          </p>
        </div>
      </div>
    </section>
  );
}

// ── セクション2：マイクロスコープで「見える化」 ──────────────
function VisualizeSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-[oklch(0.22_0.045_65)]" id="見える化">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
          <div className="relative overflow-hidden min-h-[400px] md:min-h-[600px]">
            <img src={IMAGES.scalpCheck} alt="マイクロスコープによる頭皮チェック" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[oklch(0.22_0.045_65)/60] hidden md:block" />
          </div>
          <div ref={ref} className="flex flex-col justify-center px-10 md:px-16 py-16 md:py-24">
            <div className={`transition-all duration-700 ${inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
              <span className="font-cormorant text-[oklch(0.72_0.038_93)] text-xs tracking-[0.4em] uppercase block mb-6">Microscope Check</span>
              <h2 className="font-mincho text-white text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-8">
                見るだけで、<br /><span style={{ color: '#f0d98a' }}>変わる。</span>
              </h2>
              <p className="font-sans-jp text-white/75 text-base leading-relaxed mb-10">
                マイクロスコープで頭皮を拡大表示。<br />
                自分の頭皮の状態を「目で見る」ことが、<br />
                ケアへの意識を変えます。
              </p>
              <div className="space-y-4">
                {["毛穴の詰まり・皮脂の蓄積を確認", "毛根の状態・細毛・抜け毛の傾向を把握", "データとして記録し、変化を追跡"].map((item, i) => (
                  <div key={i} className={`flex items-start gap-3 transition-all duration-500 ${inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`} style={{ transitionDelay: `${200 + i * 100}ms` }}>
                    <span className="text-[oklch(0.72_0.038_93)] text-lg mt-0.5 flex-shrink-0">✓</span>
                    <span className="font-sans-jp text-white/85 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── セクション3：15年の実績 ──────────────────────────────
function CredentialSection() {
  const { ref, inView } = useInView();
  return (
    <section className="py-32 md:py-40 bg-[oklch(0.975_0.012_90)]" id="実績">
      <div ref={ref} className="max-w-5xl mx-auto px-6 text-center">
        <div className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <span className="font-cormorant text-[oklch(0.72_0.038_93)] text-xs tracking-[0.4em] uppercase block mb-8">15 Years of Expertise</span>
          <h2 className="font-mincho text-[oklch(0.28_0.055_65)] text-4xl md:text-6xl font-bold leading-tight mb-6">
            15年間、<br /><span style={{ color: 'oklch(0.55 0.10 70)' }}>2,200名以上</span>の<br />頭皮と向き合ってきた。
          </h2>
          <p className="font-sans-jp text-[oklch(0.45_0.050_65)] text-base md:text-lg max-w-xl mx-auto leading-relaxed mt-8">
            THE HERBSの植物美容メソッドは、15年の頭皮ケア実績から生まれました。<br />
            蓄積されたデータとノウハウを、惜しみなく提供します。
          </p>
        </div>
        <div className={`grid grid-cols-3 gap-8 mt-20 transition-all duration-700 delay-300 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          {[
            { num: "15", unit: "年", label: "頭皮ケア実績" },
            { num: "2,200", unit: "名+", label: "体験者数（当社調べ）" },
            { num: "86", unit: "%", label: "顧客満足度（当社調べ）" },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="font-cormorant text-[oklch(0.28_0.055_65)] font-bold leading-none mb-2">
                <span className="text-5xl md:text-7xl">{item.num}</span>
                <span className="text-2xl md:text-3xl">{item.unit}</span>
              </div>
              <p className="font-sans-jp text-[oklch(0.55_0.050_65)] text-xs md:text-sm">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── セクション4：ハーブスチーマー ──────────────────────────
function BotanicalSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-[oklch(0.975_0.012_90)]" id="植物の力">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
          <div ref={ref} className="flex flex-col justify-center px-10 md:px-16 py-16 md:py-24 order-2 md:order-1">
            <div className={`transition-all duration-700 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
              <span className="font-cormorant text-[oklch(0.72_0.038_93)] text-xs tracking-[0.4em] uppercase block mb-6">Botanical Power</span>
              <h2 className="font-mincho text-[oklch(0.28_0.055_65)] text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-8">
                洗うだけでは<br />届かない場所へ。
              </h2>
              <p className="font-sans-jp text-[oklch(0.40_0.050_65)] text-base leading-relaxed mb-10">
                ハーブスチーマーの植物ミストが、<br />
                毛穴の奥まで浸透。<br />
                頭皮環境を根本から整えます。
              </p>
              <a href="/booking" className="inline-flex items-center font-sans-jp text-sm font-bold gap-2 transition-all hover:gap-4" style={{ color: 'oklch(0.55 0.10 70)', textDecoration: 'none' }}>
                体験を予約する <span>→</span>
              </a>
            </div>
          </div>
          <div className="relative overflow-hidden min-h-[400px] md:min-h-[600px] order-1 md:order-2">
            <img src={IMAGES.botanicalMist} alt="ハーブスチーマー・ボタニカルミスト" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── セクション5：ビフォーアフター ──────────────────────────
function BeforeAfterSection() {
  const { ref, inView } = useInView();
  const [active, setActive] = useState(0);
  const { data: dbItems } = trpc.beforeAfter.list.useQuery({}, { refetchOnWindowFocus: false });
  const items = dbItems && dbItems.length > 0
    ? dbItems.map(item => ({ id: item.id, src: item.afterImageUrl, label: item.title, period: item.period ?? "", gender: item.gender === 'women' ? '女性' : item.gender === 'men' ? '男性' : '' }))
    : BA_IMAGES;
  const safeActive = Math.min(active, items.length - 1);

  return (
    <section className="py-32 md:py-40 bg-[oklch(0.28_0.055_65)]" id="ビフォーアフター">
      <div ref={ref} className="max-w-5xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <span className="font-cormorant text-[oklch(0.72_0.038_93)] text-xs tracking-[0.4em] uppercase block mb-6">Before &amp; After</span>
          <h2 className="font-mincho text-white text-3xl md:text-5xl font-bold">継続が、答えになる。</h2>
        </div>
        <div className={`transition-all duration-700 delay-200 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="relative max-w-md mx-auto mb-8">
            <div className="relative overflow-hidden shadow-2xl">
              <img src={items[safeActive].src} alt={`${items[safeActive].label} ビフォーアフター`} className="w-full object-cover transition-opacity duration-500" style={{ aspectRatio: "3/4", objectFit: "cover" }} />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-6 py-5">
                <span className="font-cormorant text-[oklch(0.72_0.038_93)] text-xs tracking-widest uppercase block mb-1">{items[safeActive].gender} · {items[safeActive].period}</span>
                <p className="font-mincho text-white text-lg font-bold">{items[safeActive].label}</p>
              </div>
            </div>
            <button onClick={() => setActive((prev) => (prev - 1 + items.length) % items.length)} className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-[oklch(0.30_0.055_65)] hover:bg-[oklch(0.72_0.038_93)] hover:text-white transition-all" aria-label="前の画像">‹</button>
            <button onClick={() => setActive((prev) => (prev + 1) % items.length)} className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-[oklch(0.30_0.055_65)] hover:bg-[oklch(0.72_0.038_93)] hover:text-white transition-all" aria-label="次の画像">›</button>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-7 gap-2 max-w-2xl mx-auto">
            {items.map((img, i) => (
              <button key={img.id} onClick={() => setActive(i)} className={`relative overflow-hidden transition-all duration-300 ${safeActive === i ? "ring-2 ring-[oklch(0.72_0.038_93)] ring-offset-2 opacity-100 scale-105" : "opacity-50 hover:opacity-80"}`} aria-label={img.label}>
                <img src={img.src} alt={img.label} className="w-full object-cover" style={{ aspectRatio: "3/4", objectFit: "cover" }} />
              </button>
            ))}
          </div>
          <p className="text-center font-sans-jp text-white/40 text-[11px] mt-8">
            ※ 個人の体験・感想です。効果には個人差があります。掲載にあたりご本人の同意を得ています。
          </p>
        </div>
      </div>
    </section>
  );
}

// ── セクション6：お客様の声 ──────────────────────────────
const DEFAULT_TESTIMONIALS = [
  { name: "T.M さん", age: "32歳・女性", highlight: "画像で見て、ケアの意識が変わりました" },
  { name: "K.S さん", age: "28歳・男性", highlight: "問題ないと確認できて安心しました" },
  { name: "A.N さん", age: "41歳・女性", highlight: "データで記録してもらえるので比較ができる" },
  { name: "H.Y さん", age: "45歳・男性", highlight: "気軽に相談できる点が良かった" },
  { name: "Y.O さん", age: "25歳・女性", highlight: "早めに知ることができて安心です" },
  { name: "R.T さん", age: "38歳・男性", highlight: "季節ごとの変化がデータでわかる" },
];

function TestimonialsSection() {
  const { ref, inView } = useInView();
  const { data: dbItems } = trpc.testimonial.list.useQuery({}, { refetchOnWindowFocus: false });
  const testimonials = dbItems && dbItems.length > 0
    ? dbItems.map(item => ({ name: item.customerName, age: item.customerAge ?? "", highlight: item.content.slice(0, 30) }))
    : DEFAULT_TESTIMONIALS;

  return (
    <section className="py-32 md:py-40 bg-[oklch(0.975_0.012_90)]" id="お客様の声">
      <div ref={ref} className="max-w-5xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <span className="font-cormorant text-[oklch(0.72_0.038_93)] text-xs tracking-[0.4em] uppercase block mb-6">Voices</span>
          <h2 className="font-mincho text-[oklch(0.28_0.055_65)] text-3xl md:text-5xl font-bold">不安が、安心に変わった。</h2>
        </div>
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[oklch(0.88_0.015_90)] transition-all duration-700 delay-200 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          {testimonials.map((t, i) => (
            <div key={i} className="bg-[oklch(0.975_0.012_90)] p-8 md:p-10">
              <p className="font-mincho text-[oklch(0.28_0.055_65)] text-lg md:text-xl font-bold leading-snug mb-6">「{t.highlight}」</p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[oklch(0.72_0.038_93)/20] flex items-center justify-center flex-shrink-0">
                  <span className="font-cormorant text-[oklch(0.72_0.038_93)] text-sm font-semibold">{t.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-mincho text-[oklch(0.35_0.055_65)] text-sm font-bold">{t.name}</p>
                  <p className="font-sans-jp text-[oklch(0.60_0.040_65)] text-xs">{t.age}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="text-center font-sans-jp text-[oklch(0.65_0.030_65)] text-[11px] mt-8">※ 個人の感想です。効果・体験には個人差があります。</p>
      </div>
    </section>
  );
}

// ── セクション7：店舗情報 ──────────────────────────────
function StoreSection() {
  const { ref, inView } = useInView();
  const stores = [
    {
      id: "hankyu",
      name: "THE HERBS神戸阪急店",
      nameEn: "Kobe Hankyu",
      badge: "百貨店内サロン",
      address: "神戸阪急本館6階 モーニングフロー内",
      address2: "兵庫県神戸市中央区小野柄通８丁目１−8",
      hours: "10:00 ～ 20:00",
      closed: "1月1日～2日",
      line: "https://line.me/ti/p/%40723lsjqi",
      bookingUrl: "/booking",
      mapUrl: "https://maps.google.com/?q=兵庫県神戸市中央区小野柄通8丁目1番8号+神戸阪急本館6階",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3281.0!2d135.19476!3d34.69344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000e6f7b8e5a3a3%3A0x5b1e2c3d4e5f6a7b!2z56aP5oi45YWD5pys5pys6aSo6Ziz5bGxIOOBiOOBj-OBhOOBhOOBhA!5e0!3m2!1sja!2sjp!4v1700000000000!5m2!1sja!2sjp",
    },
    {
      id: "nada",
      name: "THE HERBS植物美容サロン",
      nameEn: "Botanical Beauty Salon",
      badge: "直営ヘッドスパサロン",
      address: "兵庫県神戸市灘区大内通1-7-17 1F",
      address2: "",
      hours: "10:00 ～ 20:00",
      closed: "火曜・日曜・祝日定休",
      line: "https://line.me/ti/p/%40723lsjqi",
      bookingUrl: "https://book.squareup.com/appointments/jsufqo133zf3ec/location/LEWSC49JS30BF/services",
      mapUrl: "https://maps.app.goo.gl/a96J7E9gnPBXi9tA6",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3279.8!2d135.2257085!3d34.7128842!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60008dba49ad1097%3A0x351be9b6133f830b!2sMODE+VERDE+%E3%82%B5%E3%83%AD%E3%83%B3!5e0!3m2!1sja!2sjp!4v1700000000001!5m2!1sja!2sjp",
    },
  ];

  return (
    <section className="py-32 md:py-40 bg-[oklch(0.965_0.010_90)]" id="店舗情報">
      <div ref={ref} className="max-w-5xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <span className="font-cormorant text-[oklch(0.72_0.038_93)] text-xs tracking-[0.4em] uppercase block mb-6">Our Locations</span>
          <h2 className="font-mincho text-[oklch(0.28_0.055_65)] text-3xl md:text-5xl font-bold">神戸市内2拠点</h2>
        </div>
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 transition-all duration-700 delay-200 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          {stores.map((store, i) => (
            <div key={store.id} className="bg-white border border-[oklch(0.88_0.015_90)] overflow-hidden" style={{ transitionDelay: `${i * 150}ms` }}>
              <div className="relative h-48 overflow-hidden">
                <iframe title={store.name} src={store.mapEmbed} className="w-full h-full border-0" style={{ pointerEvents: 'none' }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                <a href={store.mapUrl} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10" aria-label={`${store.name}の地図を開く`} />
                <div className="absolute top-3 left-3 font-sans-jp text-white text-xs font-medium px-3 py-1 rounded-full z-20 bg-[oklch(0.50_0.060_65)/90]">{store.badge}</div>
              </div>
              <div className="p-7">
                <p className="font-cormorant text-[oklch(0.72_0.038_93)] text-xs tracking-widest uppercase mb-1">{store.nameEn}</p>
                <h3 className="font-mincho text-[oklch(0.28_0.055_65)] text-xl font-bold mb-4">{store.name}</h3>
                <div className="space-y-2 mb-6">
                  <p className="font-sans-jp text-[oklch(0.40_0.055_65)] text-sm">{store.address}</p>
                  {store.address2 && <p className="font-sans-jp text-[oklch(0.55_0.040_65)] text-xs">{store.address2}</p>}
                  <p className="font-sans-jp text-[oklch(0.40_0.055_65)] text-sm">{store.hours}</p>
                  <p className="font-sans-jp text-[oklch(0.60_0.035_65)] text-xs">定休日：{store.closed}</p>
                </div>
                <div className="flex gap-3">
                  <a href={store.line} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-2 font-sans-jp text-white text-xs font-semibold py-3 text-center transition-opacity hover:opacity-90" style={{ backgroundColor: "#06C755", textDecoration: 'none' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.02 2 11c0 3.07 1.58 5.8 4.04 7.54L5.5 22l4.14-2.16C10.39 20.27 11.18 20.4 12 20.4c5.52 0 10-4.02 10-9S17.52 2 12 2z" /></svg>
                    LINE相談
                  </a>
                  <a href={store.bookingUrl} target={store.bookingUrl.startsWith('http') ? '_blank' : '_self'} rel={store.bookingUrl.startsWith('http') ? 'noopener noreferrer' : undefined} className="flex-1 flex items-center justify-center font-sans-jp text-xs font-semibold py-3 text-center border border-[oklch(0.72_0.038_93)] text-[oklch(0.35_0.050_65)] hover:bg-[oklch(0.72_0.038_93)] hover:text-white transition-all" style={{ textDecoration: 'none' }}>
                    予約する
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* サロン募集バナー */}
        <div className="mt-16 bg-[oklch(0.22_0.045_42)] p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-cormorant text-[oklch(0.72_0.038_93)] text-xs tracking-[0.3em] uppercase mb-2">For Salon Partners</p>
            <h3 className="font-mincho text-white text-xl md:text-2xl font-bold mb-2">スカルプラボの認定サロンになりませんか？</h3>
            <p className="font-sans-jp text-white/75 text-sm">エステサロン・美容師の方向けに、頭皮チェックの技術講習と認定制度をご用意しています。</p>
          </div>
          <a href="/salon" className="flex-shrink-0 border border-[oklch(0.72_0.038_93)] text-[oklch(0.72_0.038_93)] font-sans-jp font-medium text-sm px-8 py-3.5 hover:bg-[oklch(0.72_0.038_93)] hover:text-[oklch(0.18_0.04_42)] transition-all whitespace-nowrap" style={{ textDecoration: 'none' }}>
            認定サロン募集ページへ →
          </a>
        </div>
      </div>
    </section>
  );
}

// ── 最終CTA ──────────────────────────────────────────
function CtaSection() {
  const { ref, inView } = useInView();
  return (
    <section className="py-40 bg-[oklch(0.25_0.050_65)] relative overflow-hidden" id="cta">
      <div className="absolute inset-0 opacity-10">
        <img src={IMAGES.consultation} alt="" className="w-full h-full object-cover" aria-hidden="true" />
      </div>
      <div ref={ref} className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <div className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <span className="font-cormorant text-[oklch(0.72_0.038_93)] text-xs tracking-[0.4em] uppercase block mb-8">Start Today</span>
          <h2 className="font-mincho text-white text-4xl md:text-6xl font-bold leading-tight mb-8">
            まず、<br /><span style={{ color: '#f0d98a' }}>見ることから</span><br />始めよう。
          </h2>
          <p className="font-sans-jp text-white/70 text-base mb-12">5〜10分の無料スカルプチェックで、今日から始められます。</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/booking" className="btn-gold-shimmer text-white font-sans-jp font-bold px-12 py-5 text-base" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.4)', textDecoration: 'none' }}>
              無料スカルプチェックを予約する
            </a>
            <a href="https://line.me/ti/p/%40723lsjqi" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 font-sans-jp text-white/85 text-sm border border-white/30 px-8 py-5 hover:bg-white/10 transition-all" style={{ textDecoration: 'none' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.02 2 11c0 3.07 1.58 5.8 4.04 7.54L5.5 22l4.14-2.16C10.39 20.27 11.18 20.4 12 20.4c5.52 0 10-4.02 10-9S17.52 2 12 2z" /></svg>
              LINEで相談する（無料）
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── フッター ──────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-[oklch(0.12_0.04_140)] py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/logo_grayge_p_transparent_47bbd755.png"
                alt="SCALP LABO"
                className="w-auto object-contain"
                style={{ height: "64px", filter: "brightness(0) invert(1)", opacity: 0.85 }}
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
                { label: "店舗・アクセス", href: "#店舗情報" },
              ].map((item) => (
                <li key={item.label}><a href={item.href} className="font-sans-jp text-white/60 text-xs hover:text-white/90 transition-colors">{item.label}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-mincho text-white text-sm font-bold mb-4">お問い合わせ</h4>
            <ul className="space-y-2">
              {[
                { label: "予約・お問い合わせ", href: "/booking" },
                { label: "プライバシーポリシー", href: "/privacy" },
                { label: "特定商取引法に基づく表記", href: "/tokushoho" },
              ].map((item) => (
                <li key={item.label}><a href={item.href} className="font-sans-jp text-white/60 text-xs hover:text-white/90 transition-colors">{item.label}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 mb-6">
          <div className="flex flex-wrap gap-x-6 gap-y-1 justify-center mb-2">
            {[
              { label: "株式会社THE HERBS", href: null },
              { label: "代表：宮川由美子", href: null },
              { label: "兵庫県芦屋市南宮町3-10", href: null },
              { label: "TEL: 0797-23-0364", href: "tel:0797230364" },
              { label: "オフィシャルサイト", href: "https://the-herbs.co.jp" },
              { label: "公式オンラインショップ", href: "https://herb-esthe.com" },
              { label: "Instagram", href: "https://www.instagram.com/the_herbs_jp/" },
            ].map((item) =>
              item.href ? (
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" className="font-sans-jp text-white/50 text-[11px] hover:text-white/80 transition-colors underline underline-offset-2">{item.label}</a>
              ) : (
                <span key={item.label} className="font-sans-jp text-white/50 text-[11px]">{item.label}</span>
              )
            )}
          </div>
          <p className="font-sans-jp text-white/35 text-[10px] text-center">設立：昭和61年4月24日｜化粧品製造業・化粧品製造販売業｜直営店：神戸阪急本館６階 / THE HERBS植物美容サロン / 植物美容学校</p>
        </div>
        <div className="border-t border-white/10 pt-8 mb-6">
          <p className="font-sans-jp text-white/55 text-[11px] leading-relaxed max-w-3xl mx-auto text-center">
            【免責事項】本サービスは医療行為ではありません。疾病の診断・治療・予防を目的とするものではなく、頭皮の状態を記録・確認するサービスです。医療的な相談・治療が必要な場合は、医師または医療機関にご相談ください。掲載の数値・実績はすべて当社調べによるものです。個人の体験・効果には差があります。
          </p>
        </div>
        <div className="text-center">
          <p className="font-sans-jp text-white/55 text-xs">© 2026 THE HERBS SCALP LABO. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// フローティングLINEボタン（スマホ）
function FloatingBookingButton() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 300);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);
  return (
    <div className={`fixed bottom-6 right-4 z-50 md:hidden transition-all duration-300 ${scrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
      <a
        href="https://line.me/ti/p/%40723lsjqi"
        target="_blank"
        rel="noopener noreferrer"
        className="font-sans-jp font-bold text-white text-xs px-5 py-3.5 shadow-2xl flex items-center gap-2"
        style={{ background: 'linear-gradient(135deg, #b8956a 0%, #d4aa7d 50%, #8b6845 100%)', borderRadius: '2px', boxShadow: '0 4px 20px rgba(180,140,90,0.6)', textShadow: '0 1px 2px rgba(0,0,0,0.4)', textDecoration: 'none' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}><path d="M12 2C6.48 2 2 6.02 2 11c0 3.07 1.58 5.8 4.04 7.54L5.5 22l4.14-2.16C10.39 20.27 11.18 20.4 12 20.4c5.52 0 10-4.02 10-9S17.52 2 12 2z" /></svg>
        LINEで相談する
      </a>
    </div>
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
      <VisualizeSection />
      <CredentialSection />
      <BotanicalSection />
      <BeforeAfterSection />
      <TestimonialsSection />
      <StoreSection />
      <CtaSection />
      <Footer />
      <FloatingBookingButton />
    </div>
  );
}
