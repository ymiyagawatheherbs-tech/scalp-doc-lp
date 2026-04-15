/*
 * THE HERBS SCALP LABO LP — Home Page
 * Design: モダン・ウェルネス・スタジオ
 * Color: Cream × Olive Green × Deep Brown
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
  hero: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/094A5755_9b12c6b5.jpg",
  microscope: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/scalp-microscope-iVWgVizXNK9WSGwKAftiPS.webp",
  consultation: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/consultation-oBRbvf7238DM5fVXz4vLdS.webp",
  report: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/report-visual-jwmtgLXxwHGpfod5ntuEan.webp",
  scalpCheck: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/scalp_check_dfbc71b8.jpg",
  botanicalMist: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/herb_steamer_8218d07e.jpg",
  herbGommage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/herb_gommage_65dd1849.jpg",
  scalpCheckReal: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/scalp_check_real_8dbe88ff.png",
  conceptCheck: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/concept_microscope_094A5758_13cf6989.jpg",
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
        className="h-full bg-gradient-to-r from-[oklch(0.40_0.065_65)] to-[oklch(0.85_0.030_93)] transition-all duration-100"
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
            ? "bg-[oklch(0.975_0.018_100/0.97)] backdrop-blur-md shadow-sm border-b border-[oklch(0.88_0.020_93)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-4">
          {/* ロゴ：THE HERBS（親ブランド・大）→ SCALP LABO（子ブランド・小）縦積み・左揃え */}
          <a href="/" className="flex flex-col items-start leading-none gap-[3px] flex-shrink-0">
            {/* 親ブランド：THE HERBSロゴ画像（28px・目立つ） */}
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/theherbs-logo-white_7a2a3209.webp"
              alt="THE HERBS"
              className="object-contain transition-all block"
              style={{
                height: "28px",
                width: "auto",
                marginLeft: "-17px",
                filter: scrolled ? "brightness(0)" : "none",
              }}
            />
            {/* 子ブランド：SCALP LABO（小さく下位に・左揃え） */}
            <span
              className="font-sans-jp tracking-widest transition-colors block"
              style={{
                fontSize: "0.5rem",
                letterSpacing: "0.22em",
                paddingLeft: "0px",
                color: scrolled ? "oklch(0.55 0.035 93)" : "rgba(255,255,255,0.65)",
              }}
            >
              SCALP LABO
            </span>
          </a>



          {/* デスクトップナビ */}
          <div className="hidden md:flex items-center gap-6 flex-shrink-0">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`font-sans-jp text-sm transition-colors hover:text-[oklch(0.45_0.065_65)] ${
                  scrolled ? "text-[oklch(0.35_0.060_65)]" : "text-white/80"
                }`}
              >
                {item.label}
              </a>
            ))}
            {/* ナビ右上LINEボタン：右下固定ボタンと重複するため削除 */}
          </div>

          {/* スマホ右側：CTAボタン＋ハンバーガー */}
          <div className="md:hidden flex items-center gap-2">
            <a
              href="https://line.me/ti/p/%40492wjowb"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold-shimmer text-white font-sans-jp text-xs font-bold px-3 py-1.5 rounded-sm flex items-center gap-1" style={{textShadow: '0 1px 2px rgba(0,0,0,0.4)', textDecoration: 'none'}}
            >
              LINE登録
            </a>
            <button
              className="flex flex-col gap-1.5 p-2"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="メニューを開く"
            >
              <span className={`block w-5 h-0.5 transition-all duration-300 ${
                scrolled ? "bg-[oklch(0.28_0.050_65)]" : "bg-white"
              } ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-5 h-0.5 transition-all duration-300 ${
                scrolled ? "bg-[oklch(0.28_0.050_65)]" : "bg-white"
              } ${mobileOpen ? "opacity-0" : ""}`} />
              <span className={`block w-5 h-0.5 transition-all duration-300 ${
                scrolled ? "bg-[oklch(0.28_0.050_65)]" : "bg-white"
              } ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>

        {/* モバイルメニュー */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          mobileOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}>
          <div className="bg-[oklch(0.975_0.018_100/0.98)] backdrop-blur-md border-t border-[oklch(0.88_0.020_93)] px-6 py-6 space-y-4">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block font-sans-jp text-[oklch(0.28_0.050_65)] text-base py-2 border-b border-[oklch(0.88_0.020_93)] hover:text-[oklch(0.45_0.065_65)] transition-colors"
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
        {/* 全体暗化レイヤー（少し薄めに） */}
        <div className="absolute inset-0 bg-black/30" />
        {/* 左側強調グラデーション */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
        {/* 右側明るいクリームグラデーション */}
        <div className="absolute inset-0 bg-gradient-to-l from-[#f5ede0]/30 via-transparent to-transparent" />
        {/* 下部フェード */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* コンテンツ */}
      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-6 pt-24 pb-16 md:py-32">
        <div className="max-w-2xl">
          <div className="animate-fade-in-up opacity-0-init">
            <span className="font-cormorant text-xs tracking-[0.4em] uppercase block mb-4 md:mb-5" style={{color: '#d4c5a0', letterSpacing: '0.35em'}}>
              ✦ &nbsp;Scalp Wellness Checkup&nbsp; ✦
            </span>
          </div>
          <h1 className="relative font-mincho leading-tight mb-4 md:mb-6 animate-fade-in-up opacity-0-init delay-100" style={{textShadow: '0 2px 20px rgba(0,0,0,0.5)'}}>
            <span className="block text-2xl md:text-4xl lg:text-5xl font-bold mb-1 md:mb-2 text-white">
               歯の定期検診のように、
            </span>
            <span className="block text-2xl md:text-4xl lg:text-5xl font-bold" style={{color: '#f0d98a', textShadow: '0 0 40px rgba(240,217,138,0.4), 0 2px 20px rgba(0,0,0,0.5)'}}>
               頭皮も定期チェックを。
            </span>
            <span className="block text-base md:text-xl font-medium mt-3" style={{color: 'rgba(255,255,255,0.85)', textShadow: '0 1px 8px rgba(0,0,0,0.5)', fontFamily: "'Noto Sans JP', sans-serif", letterSpacing: '0.04em'}}>
               植物の力で、10年後も豊かな髪を育む新習慣。
            </span>
          </h1>
          <p className="hidden md:block font-sans-jp text-white/90 text-base md:text-lg leading-relaxed mb-10 animate-fade-in-up opacity-0-init delay-200" style={{textShadow: '0 1px 8px rgba(0,0,0,0.6)'}}>
            マイクロスコープによる頭皮チェックで、あなたの頭皮の今を記録・確認。<br />
            薄毛になってから悩むのではなく、健康な頭皮を<strong style={{color: '#f0d98a'}}>意識的にケアする</strong>新習慣。
          </p>
          <p className="md:hidden font-sans-jp text-white/90 text-sm leading-relaxed mb-7 animate-fade-in-up opacity-0-init delay-200" style={{textShadow: '0 1px 8px rgba(0,0,0,0.6)'}}>
            マイクロスコープで頭皮の今を記録。<br />
            <strong style={{color: '#f0d98a'}}>意識的にケアする</strong>新習慣。
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 animate-fade-in-up opacity-0-init delay-300">
            <a
              href="https://line.me/ti/p/%40492wjowb"
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans-jp font-bold px-5 md:px-7 py-2.5 md:py-3 text-center text-xs md:text-sm tracking-wider transition-all duration-300 hover:-translate-y-1 inline-flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #b8956a 0%, #d4aa7d 40%, #c49a6c 70%, #8b6845 100%)',
                color: '#fff',
                boxShadow: '0 4px 24px rgba(180,140,90,0.55), 0 1px 0 rgba(255,255,255,0.15) inset',
                textShadow: '0 1px 3px rgba(0,0,0,0.4)',
                letterSpacing: '0.08em',
                textDecoration: 'none',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{flexShrink: 0}}>
                <path d="M12 2C6.48 2 2 6.02 2 11c0 3.07 1.58 5.8 4.04 7.54L5.5 22l4.14-2.16C10.39 20.27 11.18 20.4 12 20.4c5.52 0 10-4.02 10-9S17.52 2 12 2z"/>
              </svg>
              LINEで頭皮の悩みを相談する（無料）
            </a>
          </div>
          <div className="mt-8 md:mt-12 flex items-center gap-4 md:gap-6 animate-fade-in-up opacity-0-init delay-400">
            <div className="flex -space-x-2">
              {["A", "B", "C", "D"].map((l) => (
                <div
                  key={l}
                  className="w-7 h-7 md:w-9 md:h-9 rounded-full border-2 border-white flex items-center justify-center" style={{backgroundColor: 'oklch(0.72 0.038 93)'}}
                >
                  <span className="text-white text-[10px] md:text-xs font-semibold">{l}</span>
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

// 権威性帯（FV直下）
function AuthorityBand() {
  return (
    <div
      className="w-full py-4 px-6"
      style={{ background: 'linear-gradient(90deg, oklch(0.28 0.050 65) 0%, oklch(0.35 0.060 65) 100%)' }}
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <span className="font-cormorant text-[oklch(0.78_0.038_93)] text-xs tracking-[0.3em] uppercase">Since 1986</span>
          <span className="hidden sm:block w-px h-4 bg-white/20" />
        </div>
        <p className="font-sans-jp text-white/90 text-xs md:text-sm leading-relaxed">
          <span className="text-[oklch(0.85_0.030_93)] font-bold">化粧品製造会社 THE HERBS</span>が開発した独自の植物美容メソッド。
          メーカー直営の研究・実践機関として、頭皮ケアの新常識を広めます。
        </p>
        <div className="hidden sm:flex items-center gap-3">
          <span className="w-px h-4 bg-white/20" />
          <span className="font-cormorant text-[oklch(0.78_0.038_93)] text-xs tracking-[0.2em] uppercase">Botanical Beauty Method</span>
        </div>
      </div>
    </div>
  );
}

// 課題提起セクション
function ProblemSection() {
  const { ref, inView } = useInView();
  return (
    <section className="py-24 bg-[oklch(0.25_0.050_65)]" id="問題">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-cormorant text-[oklch(0.72_0.038_93)] text-sm tracking-[0.3em] uppercase block mb-4">
            The Problem
          </span>
          <h2 className="font-mincho text-white text-3xl md:text-4xl font-bold mb-6">
            あなたの頭皮、<br className="md:hidden" />
            <span className="text-[oklch(0.78_0.038_93)]">最後のチェックはいつですか？</span>
          </h2>
          <p className="font-sans-jp text-white/85 text-base max-w-2xl mx-auto leading-relaxed">
            多くの人が頭皮の変化に気づかないまま、ケアが後回しになっています。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
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
              className={`border border-white/10 rounded-sm p-5 md:p-8 transition-all duration-700 ${
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
    statusColor: "oklch(0.65_0.060_65)",
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
    <section className="py-24 bg-[oklch(0.16_0.04_140)]" id="scalp-gallery">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        {/* ヘッダー */}
        <div className={`text-center mb-14 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-cormorant text-[oklch(0.72_0.038_93)] text-sm tracking-[0.3em] uppercase block mb-4">
            Scalp Microscope Gallery
          </span>
          <h2 className="font-mincho text-white text-3xl md:text-4xl font-bold mb-4">
            あなたの頭皮は、<br />
            <span className="text-[oklch(0.78_0.038_93)]">どの状態に近いですか？</span>
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
                <span className="font-cormorant italic text-[oklch(0.72_0.038_93)] text-sm tracking-widest">
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
                    active === i ? "ring-2 ring-[oklch(0.72_0.038_93)] opacity-100" : "opacity-50 hover:opacity-80"
                  }`}
                  style={{ aspectRatio: "1" }}
                  aria-label={s.label}
                >
                  <img src={s.img} alt={s.label} className="w-full h-full object-cover" />
                  {active === i && (
                    <div className="absolute inset-0 bg-[oklch(0.72_0.038_93)]/10" />
                  )}
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="border border-white/10 rounded-sm p-5 bg-white/5">
              <p className="font-sans-jp text-white/90 text-sm leading-relaxed mb-4">
                <span className="text-[oklch(0.78_0.038_93)] font-bold">あなたの頭皮は今、どんな状態？</span><br />
                実際にマイクロスコープで確認してみましょう。初回チェックは無料です。
              </p>
              <button
                onClick={() => window.location.href = '/booking'}
                className="w-full py-3 font-sans-jp text-sm font-semibold tracking-wider transition-all duration-300"
                style={{ backgroundColor: "oklch(0.40 0.065 65)", color: "#fff" }}
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
    <section className="py-28 bg-[oklch(0.978_0.008_90)]" id="コンセプト">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className={`transition-all duration-800 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
              <span className="font-cormorant text-[oklch(0.48_0.060_65)] text-sm tracking-[0.3em] uppercase block mb-4">
              Our Concept
            </span>
            <h2 className="font-mincho text-[oklch(0.30_0.055_65)] text-3xl md:text-4xl font-bold leading-tight mb-8">
              「歯科の定期検診」のように、<br />
              <span className="text-[oklch(0.40_0.065_65)]">頭皮チェックの新習慣</span>を広めたい。
            </h2>
            <div className="section-divider mb-8" />
            <div className="space-y-6">
              <div className="karte-border">
                <p className="font-sans-jp text-[oklch(0.35_0.060_65)] text-sm leading-relaxed">
                  かつて歯科検診は「虫歯になってから行く場所」でした。今は「予防のために定期的に通う場所」として定着しています。
                </p>
              </div>
              <div className="karte-border">
                <p className="font-sans-jp text-[oklch(0.35_0.060_65)] text-sm leading-relaxed font-semibold">
                  SCALP LABOは、頭皮ケアに同じ変化を目指します。「薄毛が気になってから行く場所」ではなく、「定期的に頭皮の状態を確認する場所」へ。
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
              <div className="absolute -bottom-6 -right-6 bg-[oklch(0.25_0.050_65)] text-white p-6 rounded-sm shadow-xl max-w-xs">
                <p className="font-cormorant text-[oklch(0.72_0.038_93)] text-xs tracking-widest uppercase mb-2">
                  Microscope Diagnosis
                </p>
                <p className="font-mincho text-white text-sm font-bold">
                  マイクロスコープで<br />頭皮の色・毛穴・皮脂・毛量を記録・確認
                </p>
              </div>
              {/* 頭皮マイクロスコープ画像（右下サムネイル） */}
              <div className="absolute -top-6 -left-6 w-28 h-28 overflow-hidden rounded-sm shadow-xl border-2 border-[oklch(0.72_0.038_93)]">
                <img src={IMAGES.scalpMicroscopeReal} alt="頭皮マイクロスコープ画像" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// なぜTHE HERBSの植物美容なのか教育コンテンツセクション
function WhyBotanicalSection() {
  const { ref, inView } = useInView();
  return (
    <section
      className="py-28 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #f7f3ed 0%, #ede8df 100%)' }}
      id="why-botanical"
    >
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        {/* ヘッダー */}
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <span className="font-cormorant text-[oklch(0.48_0.060_65)] text-sm tracking-[0.3em] uppercase block mb-4">
            Why THE HERBS Botanical Method
          </span>
          <h2 className="font-mincho text-[oklch(0.28_0.050_65)] text-3xl md:text-4xl font-bold mb-4 leading-tight">
            なぜTHE HERBSの植物美容でなければならないのか
          </h2>
          <p className="font-sans-jp text-[oklch(0.45_0.055_65)] text-sm max-w-2xl mx-auto leading-relaxed">
            一般的なヘッドスパやシャンプーと何が違うのか。その理由をお伝えします。
          </p>
        </div>

        {/* 問題提起→解決策 */}
        <div className="grid lg:grid-cols-2 gap-10 mb-16">
          {/* 左：問題 */}
          <div
            className={`rounded-sm p-8 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ background: 'oklch(0.25 0.050 65)', transitionDelay: '100ms' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'oklch(0.60 0.20 20)' }}>
                <span className="text-white text-sm font-bold">!</span>
              </div>
              <h3 className="font-mincho text-white text-lg font-bold">ケミカルケアの限界</h3>
            </div>
            <div className="space-y-4">
              <p className="font-sans-jp text-white/85 text-sm leading-relaxed">
                頭皮を洗浄するだけの洗浄剤、ダメージ保護に大量に塗布するヘアトリートメント、髪に色をつけるためのヘアカラーなどが、頭皮や髪に負荷をかけている現実があります。皮膚や髪を元気にするために必要な成分は、化学合成では作ることができません。
              </p>
              <p className="font-sans-jp text-white/85 text-sm leading-relaxed">
                アルカリカラー・パーマの残留薬剤、合成界面活性剤の蓄積は、毛穴の機能を低下させ、毛根への栄養供給を妨げることにもなります。
              </p>
              <div className="border-l-2 border-[oklch(0.72_0.038_93)] pl-4 mt-4">
                <p className="font-sans-jp text-[oklch(0.85_0.030_93)] text-sm font-semibold leading-relaxed">
                  「対処療法」ではなく、頭皮が本来持つ『育む力』を復活させることが重要。
                </p>
              </div>
            </div>
          </div>

          {/* 右：解決策 */}
          <div
            className={`rounded-sm p-8 transition-all duration-700 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ background: 'linear-gradient(135deg, #1e2d1a 0%, #2a3d22 100%)', transitionDelay: '200ms' }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'oklch(0.52 0.10 140)' }}>
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <h3 className="font-mincho text-white text-lg font-bold">THE HERBS植物美容のアプローチ</h3>
            </div>
            <div className="space-y-4">
              <p className="font-sans-jp text-white/85 text-sm leading-relaxed">
                ポリフェノール・フラボノイド・ビタミン・ミネラル・アミノ酸、そして精油成分などを含むハーブの力で、頭皮が本来持つ『育む力』を復活させます。
              </p>
              <p className="font-sans-jp text-white/85 text-sm leading-relaxed">
                実は足すトリートメントではなく、余分な皮脂・薬剤残留物を『取り去る』リセットケアから始まります。頭皮本来の環境に戻してあげることで、健康な毛髪を取り戻します。
              </p>
              <div className="border-l-2 border-[oklch(0.62_0.14_160)] pl-4 mt-4">
                <p className="font-sans-jp text-[oklch(0.78_0.038_93)] text-sm font-semibold leading-relaxed">
                  サロン運営と店舗で得た経験を化粧品の研究開発に生かし、サロンケアとホームケアで皆様の健やかな髪をサポートします。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ハーブ成分の機能性 */}
        <div className={`transition-all duration-700 delay-300 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h3 className="font-mincho text-[oklch(0.28_0.050_65)] text-xl font-bold mb-8 text-center">
            植物成分に期待される皮膚への働き
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                compound: 'ポリフェノール',
                role: '抗酸化・抗炎症',
                detail: '頭皮の酸化ストレスを軽減し、毛根環境を整える作用。',
                color: 'oklch(0.48 0.060 65)',
              },
              {
                compound: 'フラボノイド',
                role: '血行促進・毛孔洄浄',
                detail: '頭皮への血流を促進し、毛根への栄養供給をサポート。',
                color: 'oklch(0.52 0.10 140)',
              },
              {
                compound: '精油成分',
                role: '毛穴清浄・整肌',
                detail: '毛穴に蓄積した皮脂・薬剤を浄化し、頭皮の吸収力を高める。',
                color: 'oklch(0.60 0.14 200)',
              },
              {
                compound: '有機酸',
                role: '保湿・バリア機能',
                detail: '頭皮の水分バランスを整え、乾燥・皮脂過多の両方に対応。',
                color: 'oklch(0.55 0.12 60)',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 border border-[oklch(0.85_0.020_93)] bg-white rounded-sm"
              >
                <div
                  className="inline-block font-cormorant text-xs tracking-wider uppercase px-3 py-1 mb-4 rounded-sm"
                  style={{ backgroundColor: `${item.color}15`, color: item.color, border: `1px solid ${item.color}40` }}
                >
                  {item.compound}
                </div>
                <h4 className="font-mincho text-[oklch(0.28_0.050_65)] text-base font-bold mb-2">{item.role}</h4>
                <p className="font-sans-jp text-[oklch(0.50_0.055_65)] text-xs leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
          <p className="font-sans-jp text-[oklch(0.60_0.055_65)] text-[11px] text-center mt-6">
            ※本サービスは化粧品の使用感の向上を目的としたものです。効果・効能には個人差があります。
          </p>
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
    <section className="py-28 bg-[oklch(0.25_0.050_65)]" id="習慣の意義">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        {/* ヘッダー */}
        <div className={`mb-20 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-cormorant text-[oklch(0.72_0.038_93)] text-sm tracking-[0.3em] uppercase block mb-6">
            Why Scalp Check Matters
          </span>
          <div className="mb-10">
            <h2 className="font-mincho text-white text-3xl md:text-5xl font-bold leading-tight mb-8">
              髮のお悩みは、<br />
              <span className="text-[oklch(0.78_0.038_93)]">頭皮チェックから。</span>
            </h2>
            {/* 主要メッセージ — 年齢とともに現れる悩みの列挙 */}
            <div className="border-l-2 border-[oklch(0.72_0.038_93)] pl-6 mb-8">
              <p className="font-mincho text-white text-lg md:text-xl leading-relaxed mb-3">
                年齢とともに現れる、
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {["抜け毛", "うねり", "髪の広がり", "つむじ割れ", "ボリュームダウン", "ヘアダメージ", "頭皮のニオイ", "かゆみ"].map((item, i) => (
                  <span
                    key={i}
                    className="font-sans-jp text-sm px-3 py-1 border border-[oklch(0.72_0.038_93)]/50 text-[oklch(0.85_0.030_90)]"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <p className="font-mincho text-[oklch(0.78_0.038_93)] text-lg md:text-xl font-bold">
                すべてのお困りごとの解決は、頭皮チェックから。
              </p>
            </div>
            <p className="font-sans-jp text-white/80 text-sm leading-relaxed max-w-2xl">
              将来の不安を安心に変える「頭皮チェック習慣」。歯医者さんの定期検診と同じように、定期的に頭皮の状態を確認することで、問題が小さなうちに気づき、適切なケアを選ぶことができます。
            </p>
          </div>
          {/* コンサルテーション画像 — セクションの雰囲気を高める横長バナー */}
          <div className="mt-10 overflow-hidden rounded-sm relative" style={{ height: '220px' }}>
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/crop_A_y600_b01ff694.jpg"
              alt="頭皮チェックコンサルテーションの様子"
              className="w-full h-full object-cover"
              style={{ objectPosition: 'center top' }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.25_0.050_65)]/70 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* 4つの価値 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border border-white/10">
          {values.map((v, i) => (
            <div
              key={i}
              className={`p-5 md:p-8 border-r border-b border-white/10 last:border-r-0 lg:border-b-0 transition-all duration-700 group hover:bg-white/5 ${
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
              <p className="font-cormorant text-[oklch(0.72_0.038_93)] text-xs tracking-wider mb-4">
                {v.subtitle}
              </p>
              <div className="w-8 h-px bg-[oklch(0.72_0.038_93)/40] mb-4 group-hover:w-16 transition-all duration-500" />
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
            className="inline-block btn-gold-shimmer font-sans-jp text-[oklch(0.25_0.050_65)] text-sm font-bold px-10 py-4 rounded-sm tracking-wider" style={{color: '#f7f3f3'}}
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
              <div className="font-cormorant text-[oklch(0.30_0.055_65)] text-6xl md:text-7xl font-light mb-2">
                {stat.prefix}{stat.value}
                <span className="text-[oklch(0.72_0.038_93)] text-4xl">{stat.suffix}</span>
              </div>
              <p className="font-mincho text-[oklch(0.30_0.055_65)] text-base font-bold mb-1">{stat.label}</p>
              <p className="font-sans-jp text-[oklch(0.55_0.055_65)] text-xs">{stat.sub}</p>
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
    layer: "Step 1",
      badge: "無料",
      title: "スカルプチェック",
      subtitle: "まずは気軽に、頭皮の今を知る",
      time: "5～10分",
      price: "無料",
      color: "oklch(0.78 0.038 93)",
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
    layer: "Step 2",
      badge: "定期チェック＆ケア",
      title: "定期チェック&スカルプケア",
      subtitle: "1ヶ月に1回のボタニカルミストケア",
      time: "45分",
      price: "3,850～5,500円（税込）",
      color: "oklch(0.72 0.038 93)",
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
      layer: "Step 3",
      badge: "ケアプログラム",
      title: "パーソナルスカルプケア",
      subtitle: "チェック結果に基づくケアのご提案",
      time: "50分～",
      price: "6,600円～（税込）",
      color: "oklch(0.40 0.065 65)",
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
    <section className="py-28 bg-[oklch(0.978_0.008_90)]" id="サービス">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-cormorant text-[oklch(0.72_0.038_93)] text-sm tracking-[0.3em] uppercase block mb-4">
            Our Services
          </span>
          <h2 className="font-mincho text-[oklch(0.30_0.055_65)] text-3xl md:text-4xl font-bold mb-4">
            3つのステップで、<br className="md:hidden" />頭皮の健康を守る
          </h2>
          <p className="font-sans-jp text-[oklch(0.55_0.055_65)] text-sm max-w-xl mx-auto">
            無料チェックから始めて、定期ケアへ。あなたのペースで頭皮ケアの習慣を作ります。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((svc, i) => (
            <div
              key={i}
              className={`relative rounded-sm overflow-hidden transition-all duration-700 ${
                svc.featured
                  ? "bg-[oklch(0.30_0.055_65)] shadow-2xl scale-105 z-10"
                  : "bg-white border border-[oklch(0.88_0.020_93)] hover:shadow-lg"
              } ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {svc.featured && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[oklch(0.40_0.065_65)] to-[oklch(0.85_0.030_93)]" />
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
                      color: svc.featured ? '#fbf9f9' : svc.color,
                    }}
                  >
                    {svc.badge}
                  </span>
                </div>
                <h3
                  className={`font-mincho text-xl font-bold mb-1 ${
                    svc.featured ? "text-white" : "text-[oklch(0.30_0.055_65)]"
                  }`}
                >
                  {svc.title}
                </h3>
                <p
                  className={`font-sans-jp text-xs mb-6 ${
                    svc.featured ? "text-white/60" : "text-[oklch(0.55_0.055_65)]"
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
                      svc.featured ? "text-white/50" : "text-[oklch(0.55_0.055_65)]"
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
                          svc.featured ? "text-white/80" : "text-[oklch(0.40_0.065_65)]"
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
                      : "text-[oklch(0.55_0.055_65)] border-[oklch(0.88_0.020_93)]"
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
      style={{ background: "linear-gradient(160deg, #1e2d1a 0%, #162212 100%)" }}
      id="botanical-mist"
    >
      {/* 背景装飾 */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, oklch(0.72_0.038_93) 0%, transparent 70%)", transform: "translate(30%, -30%)" }}
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
            <span className="font-cormorant text-sm tracking-[0.4em] uppercase block mb-4" style={{ color: "oklch(0.72 0.038 93)" }}>
              Botanical Mist Technology
            </span>
            <h2 className="font-mincho text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight" style={{ color: "#ffffff" }}>
              定期スカルプチェックは、<br />
              <span style={{ color: "oklch(0.72 0.038 93)" }}>頭皮リセットから始まる。</span>
            </h2>
            <p className="font-sans-jp text-sm leading-relaxed mb-6 max-w-lg" style={{ color: "rgba(255,255,255,0.85)" }}>
              ボタニカルミスト（ハーブスチーマー）は、定期チェックで行う「頭皮リセット」プログラムです。
              毛穴に蓄積した皮脂・薬剤・汚れを蒸気抽出した植物成分で浄化、保湿ケアを行います。施術後の頭皮チェックで、
              頭皮の変化を確認できます。
            </p>
            {/* ボタニカルミストの特徴バッジ */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-sm" style={{ backgroundColor: "rgba(80,120,60,0.2)", border: "1px solid rgba(100,150,80,0.4)" }}>
                <span className="font-sans-jp text-xs" style={{ color: "rgba(255,255,255,0.85)" }}>オーガニックハーブを使用</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-sm" style={{ backgroundColor: "rgba(80,120,60,0.2)", border: "1px solid rgba(100,150,80,0.4)" }}>
                <span className="font-sans-jp text-xs" style={{ color: "rgba(255,255,255,0.85)" }}>超微細ミストで毛孔清浄</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-sm" style={{ backgroundColor: "rgba(80,120,60,0.2)", border: "1px solid rgba(100,150,80,0.4)" }}>
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
                style={{ boxShadow: "inset 0 0 0 1px oklch(0.52 0.1 140 / 0.3)" }}
              />
              {/* ラベル */}
              <div
                className="absolute bottom-4 left-4 font-sans-jp text-xs font-bold px-4 py-2"
                style={{ backgroundColor: "oklch(0.40 0.065 65)", color: "#fff" }}
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
              style={{ backgroundColor: "#1e2d1a", transitionDelay: `${i * 100}ms` }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#2a3d22")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1e2d1a")}
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
// ============================================================
// Botanical Power Section — 植物の機能性紹介
// ============================================================
function BotanicalPowerSection() {
  const { ref, inView } = useInView();

  // 6種のハーブブレンド（各ブレンドは4種のハーブで構成）
  const blends = [
    {
      code: "VERT",
      kana: "ヴェール",
      theme: "くせ毛",
      concerns: ["うねり", "湿度で広がる", "乾燥しやすい硬毛", "毛量多い"],
      effect: "ケイ素・ミネラル・フラボノイドを豊富に含む植物のブレンド。頭皮の水分バランスを整え、髪のうるおいをサポートするとされています。",
      accent: "oklch(0.60 0.080 145)",
    },
    {
      code: "TILLEUL",
      kana: "ティユール",
      theme: "皮脂バランス",
      concerns: ["直毛 / 皮脂過多", "フケ / 細くなった髪", "パーマが当たりにくい"],
      effect: "収れん作用・抗菌作用が特性とされる植物のブレンド。過剰な皮脂分泌を穏やかに整え、頭皮環境のバランスをサポートするとされています。",
      accent: "oklch(0.68 0.055 105)",
    },
    {
      code: "RUNON",
      kana: "ルノン",
      theme: "内部ダメージ",
      concerns: ["髪の内部ダメージ", "乾燥しやすい柔らかい髪", "細い髪質 / 乾燥期のケア", "薬剤によるダメージ"],
      effect: "抗炎症・皮膚修復作用が特性とされる植物のブレンド。頭皮の炎症を穏やかにおさえ、ダメージを受けた頭皮環境のケアをサポートするとされています。",
      accent: "oklch(0.72 0.070 75)",
    },
    {
      code: "LILAS",
      kana: "リラ",
      theme: "ダメージ保護",
      concerns: ["髪のダメージ保護", "紫外線ケア", "赤くなりやすい肌", "頭皮トラブル"],
      effect: "抗酸化・保湿・血行促進作用が特性とされる植物のブレンド。外的刺激から頭皮を守り、うるおいを保つことをサポートするとされています。",
      accent: "oklch(0.62 0.060 295)",
    },
    {
      code: "FEU",
      kana: "フー",
      theme: "エイジング",
      concerns: ["加齢によるうねり", "ボリューム", "皮脂・ニオイ"],
      effect: "抗酸化・血行促進・引き締め作用が特性とされる植物のブレンド。加齢による頭皮の変化にアプローチし、ハリのある頭皮環境をサポートするとされています。",
      accent: "oklch(0.70 0.050 55)",
    },
    {
      code: "GRISE",
      kana: "グリーゼ",
      theme: "頭皮改善",
      concerns: ["弱った頭皮と髪", "細くなった髪", "うねり", "薬剤使用後の頭皮ケア"],
      effect: "抗菌・抗炎症・鎮静作用が特性とされる植物のブレンド。頭皮の常在菌バランスを整え、すこやかな頭皮環境をサポートするとされています。",
      accent: "oklch(0.60 0.030 155)",
    },
  ];

  return (
    <section className="py-28 bg-[oklch(0.97_0.010_90)]" id="植物の力">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        {/* ヘッダー */}
        <div className={`mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-cormorant text-[oklch(0.55_0.060_130)] text-sm tracking-[0.3em] uppercase block mb-4">
            Botanical Science
          </span>
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="font-mincho text-[oklch(0.25_0.050_65)] text-3xl md:text-4xl font-bold leading-tight mb-6">
                野菜を食べるように、<br />
                <span className="text-[oklch(0.45_0.060_130)]">頭皮にも植物の力を。</span>
              </h2>
              <div className="section-divider mb-6" />
              <p className="font-sans-jp text-[oklch(0.35_0.040_65)] text-sm leading-relaxed mb-4">
                健康のために野菜や果物を摂るように、頭皮や皮膚にも植物由来の成分が深く作用します。植物が持つポリフェノール・フラボノイド・精油成分は、頭皮の炎症を抑え、血行を促し、毛根に必要な栄養を届けます。
              </p>
              <p className="font-sans-jp text-[oklch(0.35_0.040_65)] text-sm leading-relaxed">
                SCALP LABOでは、頭皮チェックの結果をもとに、あなたの頭皮状態に合ったハーブをブレンドしてケアを行います。それぞれのブレンドは4種のハーブで構成され、頭皮の悩みに合わせてセレクトされます。
              </p>
            </div>
            <div className="relative overflow-hidden rounded-sm" style={{ height: '320px' }}>
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/herbs_bowl_094A5982_939efeed.jpg"
                alt="頭皮状態に合わせてブレンドするハーブ"
                className="w-full h-full object-cover"
                style={{ objectPosition: 'center 40%' }}
              />

            </div>
          </div>
        </div>

        {/* 6種ブレンドグリッド */}
        <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 transition-all duration-700 delay-200 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {blends.map((blend, i) => (
            <div
              key={i}
              className="bg-white border border-[oklch(0.90_0.015_90)] p-5 hover:shadow-md transition-all duration-300"
              style={{ transitionDelay: `${i * 80}ms`, borderTopWidth: '3px', borderTopColor: blend.accent }}
            >
              {/* ブレンド名 */}
              <div className="mb-3">
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-cormorant text-[oklch(0.25_0.050_65)] text-xl font-bold tracking-wider">{blend.code}</span>
                  <span className="font-sans-jp text-[oklch(0.55_0.040_65)] text-xs">{blend.kana}</span>
                </div>
                <span
                  className="font-sans-jp text-xs font-bold tracking-wider px-2 py-0.5 inline-block"
                  style={{ backgroundColor: `${blend.accent}22`, color: blend.accent }}
                >
                  {blend.theme}
                </span>
              </div>
              {/* 対応する愉み */}
              <ul className="space-y-1 mb-3">
                {blend.concerns.map((c, j) => (
                  <li key={j} className="flex items-start gap-1.5">
                    <span className="text-[oklch(0.70_0.040_93)] text-xs mt-0.5 flex-shrink-0">—</span>
                    <span className="font-sans-jp text-[oklch(0.40_0.035_65)] text-xs leading-relaxed">{c}</span>
                  </li>
                ))}
              </ul>
              {/* 推測効果 */}
              <div className="border-t border-[oklch(0.92_0.010_90)] pt-3">
                <p className="font-sans-jp text-[oklch(0.50_0.030_65)] text-[10px] leading-relaxed italic">{blend.effect}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ハーブジャー画像 */}
        <div className={`mt-6 overflow-hidden transition-all duration-700 delay-300 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ height: '260px' }}>
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/094A5819_cb840e92.jpg"
            alt="THE HERBSのハーブジャーコレクション"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 60%' }}
          />
        </div>

        {/* ブレンドケアの説明 */}
        <div className={`mt-12 bg-[oklch(0.25_0.050_65)] p-8 md:p-10 transition-all duration-700 delay-400 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="grid md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-2">
              <span className="font-cormorant text-[oklch(0.72_0.038_93)] text-xs tracking-[0.3em] uppercase block mb-3">Custom Herb Blend</span>
              <h3 className="font-mincho text-white text-2xl font-bold mb-4">頭皮の状態に合わせた、<br />オーダーメイドのハーブケア</h3>
              <p className="font-sans-jp text-white/80 text-sm leading-relaxed">
                スカルプチェックで頭皮の状態（皮脂量・水分量・毛穴の詰まり・炎症の有無）を確認した後、その結果に基づいて最適なブレンドをセレクトします。同じ「抜け毛」の悩みでも、原因が皮脂過多なのか、乾燥なのか、加齢なのかによって、最適なブレンドは異なります。
              </p>
            </div>
            <div className="text-center">
              <div className="font-cormorant text-[oklch(0.72_0.038_93)] text-6xl font-light mb-2">6</div>
              <p className="font-sans-jp text-white/70 text-xs tracking-wider">種類のハーブブレンド<br />各4種のハーブで構成</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

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
    <section className="py-28 bg-[oklch(0.978_0.008_90)]">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-cormorant text-[oklch(0.72_0.038_93)] text-sm tracking-[0.3em] uppercase block mb-4">
            For You
          </span>
          <h2 className="font-mincho text-[oklch(0.30_0.055_65)] text-3xl md:text-4xl font-bold">
            こんな方におすすめです
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {targets.map((t, i) => (
            <div
              key={i}
              className={`bg-white border border-[oklch(0.88_0.020_93)] rounded-sm p-5 md:p-8 hover:shadow-lg transition-all duration-500 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start gap-6">
                <div className="text-4xl flex-shrink-0">{t.emoji}</div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-sans-jp text-xs text-[oklch(0.55_0.055_65)] bg-[oklch(0.955_0.018_82)] px-2 py-0.5 rounded-full">
                      {t.age}
                    </span>
                    <span className="font-sans-jp text-xs text-[oklch(0.72_0.038_93)] font-medium">{t.segment}</span>
                  </div>
                  <h3 className="font-mincho text-[oklch(0.30_0.055_65)] text-lg font-bold mb-3">
                    「{t.message}」
                  </h3>
                  <p className="font-sans-jp text-[oklch(0.55_0.055_65)] text-sm leading-relaxed">{t.desc}</p>
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
    <section className="py-24 border-t border-[oklch(0.40_0.065_65)]/20" style={{ backgroundColor: "#162212" }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <p className="text-xs tracking-[0.3em] mb-4" style={{ color: "oklch(0.72 0.038 93)", fontFamily: "'Noto Sans JP', sans-serif" }}>MY SCALP KARTE</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight" style={{ fontFamily: "'Shippori Mincho', serif", color: "#ffffff" }}>
              マイスカルプ<br />
              <span style={{ color: '#d7be42' }}>カルテアプリ</span>
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
                  <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "oklch(0.40 0.065 65)", fontSize: "10px", color: "#ffffff", fontWeight: 700 }}>✓</span>
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
                style={{ backgroundColor: "#162212", borderColor: "rgba(80,140,60,0.4)" }}
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
                style={{ backgroundColor: "#162212", borderColor: "rgba(80,140,60,0.4)" }}
              >
                <svg viewBox="0 0 24 24" className="w-7 h-7" fill="white"><path d="M3.18 23.76c.3.17.64.24.99.2l12.6-7.27-2.72-2.72-10.87 9.79zm-1.7-20.4C1.18 3.7 1 4.08 1 4.56v14.88c0 .48.18.86.48 1.2l.07.06 8.34-8.34v-.2L1.55 3.82l-.07.06-.07.06zM20.49 10.7l-2.81-1.62-3.06 3.06 3.06 3.06 2.83-1.63c.81-.46.81-1.22-.02-1.87zm-18.3 12.3l.07-.06 9.4-9.4-2.72-2.72-6.75 12.18z"/></svg>
                <div>
                  <div className="text-xs" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Noto Sans JP', sans-serif" }}>GET IT ON</div>
                  <div className="text-sm font-semibold" style={{ color: "#ffffff", fontFamily: "'Noto Sans JP', sans-serif" }}>Google Play</div>
                </div>
              </a>
            </div>
          </div>
          {/* App Screenshots — staggered layout */}
          <div className="flex justify-center items-start gap-5" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
            {/* 左：上対齐 */}
            <div style={{ width: '47%', marginTop: '0' }}>
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/app_screen_log_78a5d0f2.png"
                alt="スカルププログ アプリ画面"
                className="w-full object-contain rounded-2xl"
                style={{ boxShadow: '0 12px 48px rgba(0,0,0,0.55)' }}
              />
              <p className="text-center text-xs mt-3" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Noto Sans JP', sans-serif", letterSpacing: '0.05em' }}>スカルププログ</p>
            </div>
            {/* 右：60px下にスタガー */}
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

// ホームケアのご紹介セクション
function HomeCareSection() {
  const { ref, inView } = useInView();
  return (
    <section className="py-20 bg-[oklch(0.97_0.012_100)]">
      <div
        ref={ref}
        className={`max-w-3xl mx-auto px-6 transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div
          className="border border-[oklch(0.75_0.06_100)] rounded-sm px-10 py-12"
          style={{ background: 'oklch(0.99 0.008 90)' }}
        >
          <div className="text-center mb-8">
            <span
              className="font-cormorant text-[oklch(0.72_0.038_93)] text-sm tracking-[0.3em] uppercase block mb-5"
            >
              Home Care
            </span>
            <h2
              className="font-mincho text-[oklch(0.30_0.055_65)] text-2xl md:text-3xl font-bold mb-6 leading-relaxed"
            >
              サロンケアを、自宅でも続けるために
            </h2>
            <p
              className="font-sans-jp text-[oklch(0.40_0.030_65)] text-sm md:text-base leading-loose mb-8 max-w-lg mx-auto"
            >
              当サロンで使用している植物由来の頭皮ケアアイテムを<br />
              公式通販サイトでお求めいただけます。<br />
              <span className="text-xs text-[oklch(0.55_0.025_65)] mt-2 block">サロンと同じケアを、毎日のホームルーティンに。</span>
            </p>
          </div>
          {/* 商品集合写真 */}
          <div className="flex justify-center mb-10">
            <a
              href="https://herb-esthe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full max-w-lg"
            >
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/fillis_lineup_BF9I3824_476a04c8.jpg"
                alt="fillis ヘアケアラインナップ"
                className="w-full h-auto object-contain"
              />
            </a>
          </div>
          <div className="text-center">
            <a
              href="https://herb-esthe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-3.5 font-sans-jp text-sm tracking-wider transition-all duration-300"
              style={{
                background: 'oklch(0.30 0.055 65)',
                color: 'oklch(0.97 0.012 100)',
                textDecoration: 'none',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'oklch(0.40 0.055 65)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'oklch(0.30 0.055 65)';
              }}
            >
              公式オンラインショップを見る
              <span className="text-base">→</span>
            </a>
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
      q: "頭皮チェックは痛みはありますか？",
      a: "まったくありません。マイクロスコープを頭皮に軽く当てて撮影するだけです。",
    },
    {
      q: "薄毛以外のお悩みでも受けられますか？",
      a: "はい、お一人お一人お悩みは異なりますので、何でもご相談ください。むしろ「まだ大丈夫」な段階からの定期チェックをおすすめしています。頭皮の状態を定期的に把握することが、日頃のケアに役立ちます。",
    },
    {
      q: "ボタニカルミスト（ハーブスチーマー）とは何ですか？",
      a: "ハーブそのものを水蒸気で蒸しあげることで植物成分を多く配合したミストが出てきます。スキンケアや頭皮ケアに使用することで化粧品とは異なるケアが可能になります。頭皮の皮脂・汚れ・老廃角質を清浄し、うるおいを与えてハリのある髪を保ちます。季節に合わせて配合ハーブを変えることで、定期チェックでの頭皮リセットが可能になります。",
    },
    {
      q: "スカルプハーブゴマージュとは何ですか？",
      a: "頭皮用に開発したゴマージュ（スクラブ）です。ハーブエキスを配合した細かな粒子が、頭皮の毛穴に詰まった皮脂・汚れ・老廃角質を优しくでもしっかり除去します。シャンプーだけでは落としきれない汚れや皮脂のクレンジングに特に効果的です。定期チェック時に并用することで、チェック精度が向上します。",
    },
    {
      q: "ハーブエキスはどのような効果がありますか？",
      a: "頭皮の状態に合わせて選んだハーブのブレンドを抽出し、直接頭皮に浸透させます。皮脂バランスの調整、頭皮環境の清浄、髪のハリ・コシ改善などをサポートします。季節や頭皮の状態に応じて配合を変えるため、定期チェックの結果をもとにパーソナライズした提案が可能です。※サロンでのパーソナルケアのみで使用されます。",
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
      q: "医療行為とは異なりますか？",
      a: "THE HERBS SCALP LABは医療行為ではありません。マイクロスコープによる頭皮の撮影・記録・確認を行うサービスです。医療機関への受診が適切と思われる場合は、提携医療機関をご案内することがあります。",
    },
    {
      q: "LINEに登録すると何が届きますか？",
      a: "登録直後に「頭皮チェックとは？」の教育コンテンツをお届けします。その後、頭皮タイプ診断のご案内（3日後）、無料スカルプチェックの予約案内（7日後）、ビフォーアフター事例（14日後）、期間限定の特典情報（21日後）を順番にお送りします。一斉配信（スパム）は行いません。",
    },
    {
      q: "勧誘や営業メッセージは届きますか？",
      a: "しつこい勧誘や営業メッセージはお送りしません。THE HERBSからのお知らせは、頭皮ケアに役立つ情報・予約案内・季節のケアアドバイスが中心です。不要と感じた場合は、いつでもLINEのブロック機能でメッセージを止めることができます。",
    },
    {
      q: "LINE登録は無料ですか？費用はかかりますか？",
      a: "LINE登録は完全無料です。登録後のステップ配信（自動メッセージ）も費用はかかりません。実際のサロン施術（頭皮チェック・ケアメニュー）については、各メニューの料金が発生します。初回の無料スカルプチェックは、予約後にサロンにてご体験いただけます。",
    },
    {
      q: "すでに通っている方の次回予約はどうすればいいですか？",
      a: "ご利用中のお客様は、LINEまたはお電話にて直接ご予約ください。サロンスタッフがご希望の日程を調整いたします。ご不明な点はお気軽にお問い合わせください。",
    },
  ];

  return (
    <section className="py-28 bg-[oklch(0.978_0.008_90)]" id="よくある質問">
      <div ref={ref} className="max-w-3xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-cormorant text-[oklch(0.72_0.038_93)] text-sm tracking-[0.3em] uppercase block mb-4">
            FAQ
          </span>
          <h2 className="font-mincho text-[oklch(0.30_0.055_65)] text-3xl md:text-4xl font-bold">
            よくあるご質問
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`border border-[oklch(0.88_0.020_93)] rounded-sm overflow-hidden transition-all duration-700 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <button
                className="w-full text-left p-6 flex items-center justify-between bg-white hover:bg-[oklch(0.978_0.008_90)] transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
              <span className="font-sans-jp text-[oklch(0.30_0.055_65)] font-bold" style={{fontSize: '17px'}}>
                {faq.q}
                </span>
                <span
                  className={`text-[oklch(0.72_0.038_93)] text-xl flex-shrink-0 transition-transform duration-300 ${
                    openIndex === i ? "rotate-45" : ""
                  }`}
                >
                  +
                </span>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-6 bg-white border-t border-[oklch(0.88_0.020_93)]">
                  <p className="font-sans-jp text-[oklch(0.55_0.055_65)] text-sm leading-relaxed pt-4">
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
      text: "美容院でたまたまスカルプチェックを勧められて受けました。自分の頭皮がこんな状態だったとは知らなくて驚きました。早めに知ることができて安心です。",
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
    <section className="py-28 bg-[oklch(0.30_0.055_65)]" id="お客様の声">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-cormorant text-[oklch(0.72_0.038_93)] text-sm tracking-[0.3em] uppercase block mb-4">
            Testimonials
          </span>
          <h2 className="font-mincho text-white text-3xl md:text-4xl font-bold mb-4">
            ご利用者の声
          </h2>
          <p className="font-sans-jp text-white/50 text-xs">
            ※ 個人の感想です。効果・体験には個人差があります。
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={`bg-[oklch(0.30_0.055_65)] border border-white/10 rounded-sm p-5 md:p-7 transition-all duration-700 hover:border-[oklch(0.72_0.038_93)/40] hover:shadow-xl ${
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
                      j < t.rating ? "text-[oklch(0.72_0.038_93)]" : "text-white/20"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              {/* ハイライト */}
              <p className="font-mincho text-[oklch(0.85_0.030_93)] text-sm font-bold mb-3 leading-snug">
                「{t.highlight}」
              </p>
              {/* 本文 */}
              <p className="font-sans-jp text-white/80 text-xs leading-relaxed mb-5">
                {t.text}
              </p>
              {/* プロフィール */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <div className="w-9 h-9 rounded-full bg-[oklch(0.72_0.038_93)/20] flex items-center justify-center flex-shrink-0">
                  <span className="font-cormorant text-[oklch(0.72_0.038_93)] text-sm font-semibold">
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
    <section className="py-28 bg-[oklch(0.978_0.008_90)]" id="ビフォーアフター">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        {/* ヘッダー */}
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-cormorant text-[oklch(0.72_0.038_93)] text-sm tracking-[0.3em] uppercase block mb-4">
            Before &amp; After
          </span>
          <h2 className="font-mincho text-[oklch(0.30_0.055_65)] text-3xl md:text-4xl font-bold mb-4">
            お客様のビフォーアフター
          </h2>
          <p className="font-sans-jp text-[oklch(0.55_0.055_65)] text-sm">
            継続的な頭皮ケアで変わった、実際のお客様の記録です。
          </p>
        </div>

        {/* メイン表示 */}
        <div className={`transition-all duration-700 delay-200 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {/* 大きい画像 */}
          <div className="relative max-w-lg mx-auto mb-8">
            <div className="relative overflow-hidden rounded-sm shadow-2xl bg-[oklch(0.30_0.055_65)]">
              <img
                src={BA_IMAGES[active].src}
                alt={`${BA_IMAGES[active].label} ビフォーアフター`}
                className="w-full object-cover transition-opacity duration-500"
                style={{ aspectRatio: "3/4", objectFit: "cover" }}
              />
              {/* ラベル */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[oklch(0.22_0.040_65/90)] to-transparent px-6 py-5">
                <div className="flex items-end justify-between">
                  <div>
                    <span className="font-cormorant text-[oklch(0.72_0.038_93)] text-xs tracking-widest uppercase block mb-1">
                      {BA_IMAGES[active].gender} · {BA_IMAGES[active].period}
                    </span>
                    <p className="font-mincho text-white text-lg font-bold">
                      {BA_IMAGES[active].label}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-sans-jp text-[oklch(0.85_0.030_93)] text-xs bg-[oklch(0.72_0.038_93)/20] border border-[oklch(0.72_0.038_93)/40] px-3 py-1 rounded-full">
                      Before → After
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* ナビゲーション矢印 */}
            <button
              onClick={() => setActive((prev) => (prev - 1 + BA_IMAGES.length) % BA_IMAGES.length)}
              className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-[oklch(0.30_0.055_65)] hover:bg-[oklch(0.72_0.038_93)] hover:text-white transition-all"
              aria-label="前の画像"
            >
              ‹
            </button>
            <button
              onClick={() => setActive((prev) => (prev + 1) % BA_IMAGES.length)}
              className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-[oklch(0.30_0.055_65)] hover:bg-[oklch(0.72_0.038_93)] hover:text-white transition-all"
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
                    ? "ring-2 ring-[oklch(0.72_0.038_93)] ring-offset-2 opacity-100 scale-105"
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
                  active === i ? "bg-[oklch(0.72_0.038_93)] w-6" : "bg-[oklch(0.72_0.038_93)/30]"
                }`}
                aria-label={`画像${i + 1}`}
              />
            ))}
          </div>

          {/* 注意書き */}
          <p className="text-center font-sans-jp text-[oklch(0.55_0.055_65)] text-[11px] mt-6">
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

  // 当日予約不可：翌日以降のみ選択可
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    // YYYY-MM-DD形式をローカル日付で生成（toISOStringはUTCなので使わない）
    const y = tomorrow.getFullYear();
    const m = String(tomorrow.getMonth() + 1).padStart(2, "0");
    const d = String(tomorrow.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };
  const minDate = getMinDate();

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
    `w-full font-sans-jp text-sm bg-[oklch(0.30_0.055_65)] border ${
      errors[field]
        ? "border-red-400"
        : "border-white/15 focus:border-[oklch(0.72_0.038_93)]"
    } text-white placeholder-white/30 rounded-sm px-4 py-3 outline-none transition-colors`;

  return (
    <section className="py-28 bg-[oklch(0.25_0.050_65)]" id="予約">
      <div ref={ref} className="max-w-3xl mx-auto px-6">
        <div className={`text-center mb-14 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-cormorant text-[oklch(0.72_0.038_93)] text-sm tracking-[0.3em] uppercase block mb-4">
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
            <div className="w-20 h-20 rounded-full bg-[oklch(0.72_0.038_93)/20] flex items-center justify-center mx-auto mb-6">
              <span className="text-[oklch(0.72_0.038_93)] text-3xl">✓</span>
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
                お名前 <span className="text-[oklch(0.72_0.038_93)]">*</span>
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
                  電話番号 <span className="text-[oklch(0.72_0.038_93)]">*</span>
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
                  ご希望日 <span className="text-[oklch(0.72_0.038_93)]">*</span>
                </label>
                <input
                  type="date"
                  min={minDate}
                  value={form.date}
                  onChange={(e) => { setForm({ ...form, date: e.target.value }); setErrors({ ...errors, date: "" }); }}
                  className={inputClass("date") + " [color-scheme:dark]"}
                />
                {errors.date && <p className="font-sans-jp text-red-400 text-xs mt-1">{errors.date}</p>}
              </div>
              <div>
                <label className="font-sans-jp text-white/70 text-xs block mb-2">
                  ご希望時間 <span className="text-[oklch(0.72_0.038_93)]">*</span>
                </label>
                <select
                  value={form.time}
                  onChange={(e) => { setForm({ ...form, time: e.target.value }); setErrors({ ...errors, time: "" }); }}
                  className={inputClass("time")}
                >
                  <option value="" disabled>時間を選択</option>
                  {timeSlots.map((t) => (
                    <option key={t} value={t} className="bg-[oklch(0.30_0.055_65)]">{t}</option>
                  ))}
                </select>
                {errors.time && <p className="font-sans-jp text-red-400 text-xs mt-1">{errors.time}</p>}
              </div>
            </div>

            {/* コース選択 */}
            <div>
              <label className="font-sans-jp text-white/70 text-xs block mb-3">
                ご希望コース <span className="text-[oklch(0.72_0.038_93)]">*</span>
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
                        ? "border-[oklch(0.72_0.038_93)] bg-[oklch(0.72_0.038_93)/15]"
                        : "border-white/15 bg-[oklch(0.30_0.055_65)] hover:border-white/30"
                    }`}
                  >
                    <p className={`font-mincho text-xs font-bold mb-1 ${
                      form.plan === opt.value ? "text-[oklch(0.85_0.030_93)]" : "text-white"
                    }`}>{opt.label}</p>
                    <p className="font-sans-jp text-white/40 text-[10px]">
                      {opt.sub}
                      {opt.value === "standard" && <span style={{ fontSize: "0.55rem", opacity: 0.7 }}>（税別）</span>}
                    </p>
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
              <input type="checkbox" id="privacy" required className="mt-1 accent-[oklch(0.72_0.038_93)]" />
              <label htmlFor="privacy" className="font-sans-jp text-white/50 text-xs leading-relaxed">
                <a href="/privacy" target="_blank" className="text-[oklch(0.72_0.038_93)] underline hover:text-[oklch(0.82_0.10_75)]">プライバシーポリシー</a>に同意の上、送信します。
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
      name: "THE HERBS神戸阪急店",
      nameEn: "THE HERBS Kobe Hankyu",
      badge: "百貨店内サロン",
      address: "兵庫県神戸市中央区小野柄通８丁目１−8",
      address2: "神戸阪急本館6階 モーニングフロー内",
      hours: [
        { day: "営業時間", time: "10:00 ～ 20:00" },
      ],
      closed: "1月1日～2日",
      line: "https://line.me/ti/p/%40492wjowb",
      lineId: "@theherbs_kobe",
      bookingUrl: "/booking",
      features: ["頭皮チェック", "ハーブスチーマー（ボタニカルミスト）", "頭皮データの記録・管理"],
      mapUrl: "https://maps.google.com/?q=兵庫県神戸市中央区小野柄通8丁目1番8号+神戸阪急本館6階",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3281.0!2d135.19476!3d34.69344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000e6f7b8e5a3a3%3A0x5b1e2c3d4e5f6a7b!2z56aP5oi45YWD5pys5pys6aSo6Ziz5bGxIOOBiOOBj-OBhOOBhOOBhA!5e0!3m2!1sja!2sjp!4v1700000000000!5m2!1sja!2sjp",
      color: "oklch(0.72_0.038_93)",
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
      line: "https://line.me/ti/p/%40492wjowb",
      lineId: "@theherbs39",
      bookingUrl: "https://book.squareup.com/appointments/jsufqo133zf3ec/location/LEWSC49JS30BF/services",
      features: ["育毛メニュー", "ディープクレンジング", "うねりケア", "ヘアカラー後の頭皮ケア", "和漢カラー"],
      mapUrl: "https://maps.app.goo.gl/a96J7E9gnPBXi9tA6",
      mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3279.8!2d135.2257085!3d34.7128842!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x60008dba49ad1097%3A0x351be9b6133f830b!2sMODE+VERDE+%E3%82%B5%E3%83%AD%E3%83%B3!5e0!3m2!1sja!2sjp!4v1700000000001!5m2!1sja!2sjp",
      color: "oklch(0.62_0.14_160)",
    },
  ];

  return (
    <section className="py-28 bg-[oklch(0.978_0.008_90)]" id="店舗情報">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        {/* ヘッダー */}
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-cormorant text-[oklch(0.72_0.038_93)] text-sm tracking-[0.3em] uppercase block mb-4">
            Our Locations
          </span>
          <h2 className="font-mincho text-[oklch(0.30_0.055_65)] text-3xl md:text-4xl font-bold mb-4">
            店舗・アクセス
          </h2>
          <p className="font-sans-jp text-[oklch(0.40_0.065_65)] text-sm max-w-xl mx-auto leading-relaxed">
            神戸市内2拠点で、頭皮の定期チェックをお受けしています。
          </p>
        </div>

        {/* 店舗カード */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {stores.map((store, i) => (
            <div
              key={store.id}
              className={`bg-white border border-[oklch(0.88_0.020_93)] rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 ${
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
                  <p className="font-cormorant text-[oklch(0.72_0.038_93)] text-xs tracking-widest uppercase mb-1">
                    {store.nameEn}
                  </p>
                  <h3 className="font-mincho text-[oklch(0.30_0.055_65)] text-xl font-bold">
                    {store.name}
                  </h3>
                </div>

                {/* 住所 */}
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-[oklch(0.72_0.038_93)] text-base mt-0.5 flex-shrink-0"></span>
                  <div className="font-sans-jp text-[oklch(0.40_0.065_65)] text-sm leading-relaxed">
                    <p>{store.address}</p>
                    {store.address2 && <p>{store.address2}</p>}
                  </div>
                </div>

                {/* 営業時間 */}
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-[oklch(0.72_0.038_93)] text-base mt-0.5 flex-shrink-0"></span>
                  <div>
                    {store.hours.map((h) => (
                      <div key={h.day} className="flex gap-3 mb-1">
                        <span className="font-sans-jp text-[oklch(0.55_0.055_65)] text-xs w-20 flex-shrink-0">{h.day}</span>
                        <span className="font-sans-jp text-[oklch(0.30_0.055_65)] text-xs font-medium">{h.time}</span>
                      </div>
                    ))}
                    <p className="font-sans-jp text-[oklch(0.55_0.055_65)] text-xs mt-1">定休日：{store.closed}</p>
                  </div>
                </div>

                {/* 施術メニュー */}
                <div className="mb-6">
                  <p className="font-sans-jp text-[oklch(0.55_0.055_65)] text-xs mb-2 tracking-wider">主な施術メニュー</p>
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
                      <path d="M12 2C6.48 2 2 6.02 2 11c0 3.07 1.58 5.8 4.04 7.54L5.5 22l4.14-2.16C10.39 20.27 11.18 20.4 12 20.4c5.52 0 10-4.02 10-9S17.52 2 12 2z"/>
                    </svg>
                    LINEで相談・登録（無料）
                  </a>
                  <a
                    href={(store as any).bookingUrl || '/booking'}
                    target={(store as any).bookingUrl?.startsWith('http') ? '_blank' : '_self'}
                    rel={(store as any).bookingUrl?.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="flex-1 flex items-center justify-center gap-2 font-sans-jp text-xs font-semibold py-3 rounded-sm text-center transition-all border"
                    style={{ borderColor: 'oklch(0.72 0.038 93)', color: 'oklch(0.35 0.050 65)', backgroundColor: 'transparent' }}
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'oklch(0.72 0.038 93)'; e.currentTarget.style.color = '#fff'; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'oklch(0.35 0.050 65)'; }}
                  >
                    予約ページへ
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* サロン募集バナー：一般向けサロンに注力のため一時非表示 */}
      </div>
    </section>
  );
}
// CTAセクション
function CtaSection() {
  const { ref, inView } = useInView();
  return (
    <section className="py-28 bg-[oklch(0.25_0.050_65)] relative overflow-hidden" id="cta">
      <div className="absolute inset-0 opacity-10">
        <img src={IMAGES.consultation} alt="頭皮ケアコンサルテーションの様子" className="w-full h-full object-cover" aria-hidden="true" />
      </div>
      <div ref={ref} className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <div className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-cormorant text-[oklch(0.72_0.038_93)] text-sm tracking-[0.3em] uppercase block mb-6">
            Start Your Journey
          </span>
          <h2 className="font-mincho text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            まずは<span className="text-[oklch(0.85_0.030_93)]">無料</span>で<br />
            頭皮の今を知ることから。
          </h2>
          <p className="font-sans-jp text-white/70 text-base mb-10 leading-relaxed">
            5〜10分の無料スカルプチェックで、あなたの頭皮の状態を記録・確認します。
          </p>
          <div className="flex justify-center">
            <a
              href="/booking"
              className="btn-gold-shimmer text-white font-sans-jp font-bold px-12 py-5 rounded-sm text-base" style={{textShadow: '0 1px 2px rgba(0,0,0,0.4)'}}
            >
              無料スカルプチェックを予約する
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
            <div className="mb-4 pb-4 border-b border-white/10"></div>
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
        {/* 運営会社情報 */}
        <div className="border-t border-white/10 pt-8 mb-6">
          <div className="flex flex-wrap gap-x-6 gap-y-1 justify-center mb-2">
            {[
              { label: "株式会社THE HERBS", href: null },
              { label: "代表：宮川由美子", href: null },
              { label: "兵庫県芦屋市南宮町3-10", href: null },
              { label: "TEL: 0797-23-0364", href: "tel:0797230364" },
              { label: "オフィシャルサイト", href: "https://the-herbs.co.jp" },
              { label: "公式オンラインショップ（ボタニカルコスメ・頭皮ケア用品）", href: "https://herb-esthe.com" },
              { label: "Instagram", href: "https://www.instagram.com/the_herbs_jp/" },
            ].map((item) =>
              item.href ? (
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                  className="font-sans-jp text-white/50 text-[11px] hover:text-white/80 transition-colors underline underline-offset-2">
                  {item.label}
                </a>
              ) : (
                <span key={item.label} className="font-sans-jp text-white/50 text-[11px]">{item.label}</span>
              )
            )}
          </div>
          <p className="font-sans-jp text-white/35 text-[10px] text-center">設立：昭和61年4月24日｜化粧品製造業・化粧品製造販売業｜直営店：神戸阪急本館６階 / THE HERBS植物美容サロン / 植物美容学校</p>
        </div>
        {/* 免責事項 */}
        <div className="border-t border-white/10 pt-8 mb-6">
          <p className="font-sans-jp text-white/55 text-[11px] leading-relaxed max-w-3xl mx-auto text-center">
            【免責事項】本サービスは医療行為ではありません。疾病の診断・治療・予防を目的とするものではなく、頭皮の状態を記録・確認するサービスです。医療的な相談・治療が必要な場合は、医師または医療機関にご相談ください。掲載の数値・実績はすべて当社調べによるものです。個人の体験・効果には差があります。
          </p>
        </div>
        <div className="text-center">
          <p className="font-sans-jp text-white/55 text-xs">
            © 2026 THE HERBS SCALP LABO. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// LINE登録誘導モーダル（店舗選択廃止）
function LineBookingModal() {
  // モーダルは废止：FVボタンはLINE直接リンクに変更済み
  return null;
}

// フローティングLINE登録ボタン
function FloatingBookingButton() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 300);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div
      className="fixed bottom-6 right-4 z-50 md:hidden"
    >
      <a
        href="https://line.me/ti/p/%40492wjowb"
        target="_blank"
        rel="noopener noreferrer"
        className="font-sans-jp font-bold text-white text-xs px-5 py-3.5 shadow-2xl flex items-center gap-2"
        style={{
          background: 'linear-gradient(135deg, #b8956a 0%, #d4aa7d 50%, #8b6845 100%)',
          borderRadius: '2px',
          boxShadow: '0 4px 20px rgba(180,140,90,0.6)',
          textShadow: '0 1px 2px rgba(0,0,0,0.4)',
          textDecoration: 'none',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{flexShrink: 0}}>
          <path d="M12 2C6.48 2 2 6.02 2 11c0 3.07 1.58 5.8 4.04 7.54L5.5 22l4.14-2.16C10.39 20.27 11.18 20.4 12 20.4c5.52 0 10-4.02 10-9S17.52 2 12 2z"/>
        </svg>
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
      <AuthorityBand />
      <ProblemSection />
      <ScalpGallerySection />
      <ConceptSection />
      <WhyBotanicalSection />
      <HabitValueSection />
      <StatsSection />
      <ServiceSection />
      <BotanicalMistSection />
      <BotanicalPowerSection />
      <TargetSection />
      <DigitalSection />
      <BeforeAfterSection />
      <TestimonialsSection />
      <HomeCareSection />
      <FaqSection />
      <StoreSection />
      <CtaSection />
      <Footer />
      <LineBookingModal />
      <FloatingBookingButton />
    </div>
  );
}
