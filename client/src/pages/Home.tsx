/*
 * スカルプ・ドック LP — Home Page
 * Design: モダン・ウェルネス・スタジオ
 * Color: Cream × Deep Brown × Golden Amber
 * Font: Shippori Mincho B1 × Noto Sans JP × Cormorant Garamond
 */

import { useEffect, useRef, useState } from "react";

// 画像URL定数
const IMAGES = {
  hero: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/hero-main-7WiQYuuxpMEgAPgcyJcPik.webp",
  microscope: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/scalp-microscope-iVWgVizXNK9WSGwKAftiPS.webp",
  consultation: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/consultation-oBRbvf7238DM5fVXz4vLdS.webp",
  report: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/report-visual-jwmtgLXxwHGpfod5ntuEan.webp",
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
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[oklch(0.977_0.012_85/0.95)] backdrop-blur-md shadow-sm border-b border-[oklch(0.88_0.025_75)]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[oklch(0.22_0.045_42)] flex items-center justify-center">
            <span className="text-[oklch(0.72_0.12_70)] text-xs font-cormorant font-semibold">S</span>
          </div>
          <div>
            <div className="font-mincho text-[oklch(0.22_0.045_42)] text-sm font-bold leading-tight tracking-widest">
              スカルプ・ドック
            </div>
            <div className="font-cormorant text-[oklch(0.72_0.12_70)] text-[10px] tracking-widest uppercase">
              Scalp Doc
            </div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {["サービス", "料金プラン", "よくある質問"].map((item) => (
            <a
              key={item}
              href={`#${item}`}
              className="font-sans-jp text-sm text-[oklch(0.38_0.055_42)] hover:text-[oklch(0.22_0.045_42)] transition-colors"
            >
              {item}
            </a>
          ))}
          <a
            href="#cta"
            className="btn-gold-shimmer text-[oklch(0.18_0.04_42)] font-sans-jp text-sm font-medium px-5 py-2.5 rounded-sm"
          >
            無料チェックを予約
          </a>
        </div>
      </div>
    </nav>
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
          alt="スカルプ・ドック ウェルネススタジオ"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[oklch(0.18_0.04_42/0.75)] via-[oklch(0.18_0.04_42/0.45)] to-transparent" />
      </div>

      {/* コンテンツ */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32">
        <div className="max-w-2xl">
          <div className="animate-fade-in-up opacity-0-init">
            <span className="font-cormorant text-[oklch(0.72_0.12_70)] text-sm tracking-[0.3em] uppercase block mb-6">
              Scalp Wellness Checkup
            </span>
          </div>
          <h1 className="font-mincho text-white leading-tight mb-6 animate-fade-in-up opacity-0-init delay-100">
            <span className="block text-3xl md:text-5xl lg:text-6xl font-bold mb-2">
              歯医者さんに行くように、
            </span>
            <span className="block text-3xl md:text-5xl lg:text-6xl font-bold text-[oklch(0.88_0.08_75)]">
              頭皮も定期検診を。
            </span>
          </h1>
          <p className="font-sans-jp text-white/80 text-base md:text-lg leading-relaxed mb-10 animate-fade-in-up opacity-0-init delay-200">
            マイクロスコープによる精密診断で、あなたの頭皮の今を可視化。<br className="hidden md:block" />
            薄毛になってから悩むのではなく、健康な頭皮を<strong className="text-[oklch(0.88_0.08_75)]">予防から守る</strong>新習慣。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up opacity-0-init delay-300">
            <a
              href="#cta"
              className="btn-gold-shimmer text-[oklch(0.18_0.04_42)] font-sans-jp font-semibold px-8 py-4 rounded-sm text-center text-base"
            >
              無料スカルプチェックを予約する
            </a>
            <a
              href="#サービス"
              className="border border-white/60 text-white font-sans-jp font-medium px-8 py-4 rounded-sm text-center text-base hover:bg-white/10 transition-colors"
            >
              サービスを見る
            </a>
          </div>
          <div className="mt-12 flex items-center gap-6 animate-fade-in-up opacity-0-init delay-400">
            <div className="flex -space-x-2">
              {["A", "B", "C", "D"].map((l) => (
                <div
                  key={l}
                  className="w-9 h-9 rounded-full bg-[oklch(0.72_0.12_70)] border-2 border-white flex items-center justify-center"
                >
                  <span className="text-[oklch(0.18_0.04_42)] text-xs font-semibold">{l}</span>
                </div>
              ))}
            </div>
            <p className="font-sans-jp text-white/70 text-sm">
              <span className="text-white font-medium">1,200名以上</span>が頭皮検診を体験済み
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
            <span className="text-[oklch(0.88_0.08_75)]">最後にチェックしたのはいつですか？</span>
          </h2>
          <p className="font-sans-jp text-white/70 text-base max-w-2xl mx-auto leading-relaxed">
            多くの人が頭皮トラブルに気づかないまま、ダメージを蓄積させています。
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "💊",
              title: "薬剤ダメージの日常化",
              desc: "ヘアカラー・パーマの普及により、若年層から継続的に頭皮環境が悪化しています。",
              delay: 0,
            },
            {
              icon: "🔍",
              title: "予防意識はあるのに…",
              desc: "「将来のために」と思っていても、定期的に気軽に相談できる場所がありませんでした。",
              delay: 100,
            },
            {
              icon: "🏥",
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
              <p className="font-sans-jp text-white/60 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
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
              「歯科検診」が変えたように、<br />
              <span className="text-[oklch(0.72_0.12_70)]">頭皮ケアの常識</span>を変える。
            </h2>
            <div className="section-divider mb-8" />
            <div className="space-y-6">
              <div className="karte-border">
                <p className="font-sans-jp text-[oklch(0.38_0.055_42)] text-sm leading-relaxed">
                  かつて歯科検診は「虫歯になってから行く場所」でした。今は「予防のために定期的に通う場所」として定着しています。
                </p>
              </div>
              <div className="karte-border">
                <p className="font-sans-jp text-[oklch(0.38_0.055_42)] text-sm leading-relaxed">
                  スカルプ・ドックは、頭皮ケアに同じ変革をもたらします。「薄毛に悩んでから行く場所」ではなく、「健康を維持するために定期的に通う場所」へ。
                </p>
              </div>
            </div>
          </div>
          <div className={`relative transition-all duration-800 delay-200 ${inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
            <div className="relative">
              <img
                src={IMAGES.microscope}
                alt="マイクロスコープによる頭皮診断"
                className="w-full max-w-md mx-auto rounded-full shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-[oklch(0.22_0.045_42)] text-white p-6 rounded-sm shadow-xl max-w-xs">
                <p className="font-cormorant text-[oklch(0.72_0.12_70)] text-xs tracking-widest uppercase mb-2">
                  Microscope Diagnosis
                </p>
                <p className="font-mincho text-white text-sm font-bold">
                  マイクロスコープで<br />毛穴・皮脂・血行を精密診断
                </p>
              </div>
            </div>
          </div>
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
              sub: "若年層の予防意識が高まっています",
            },
            {
              value: count3,
              suffix: "%",
              prefix: "",
              label: "の顧客が継続利用",
              sub: "定期検診モデルの高いリピート率",
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
      time: "5〜10分",
      price: "無料",
      color: "oklch(0.88_0.08_75)",
      items: [
        "マイクロスコープによる頭皮撮影",
        "毛穴の状態・皮脂量・血行の簡易評価",
        "結果をその場で画像つきで説明",
        "LINEでデータ共有",
      ],
      desc: "歯科の「無料検診」と同じ役割。ハードルを極限まで下げ、来店のきっかけを作ります。",
    },
    {
      layer: "Layer 2",
      badge: "定期検診",
      title: "スカルプ・ドック",
      subtitle: "3ヶ月に1回の精密検診コース",
      time: "30〜40分",
      price: "3,000〜5,000円",
      color: "oklch(0.72_0.12_70)",
      items: [
        "マイクロスコープ詳細診断",
        "頭皮温度・皮脂量・髪密度計測",
        "生活習慣・ストレス・使用製品の問診",
        "パーソナルスカルプレポート（過去比較グラフ付き）",
      ],
      desc: "過去データとの時系列比較で「改善/悪化」が一目でわかります。季節変動や施術の影響も可視化。",
      featured: true,
    },
    {
      layer: "Layer 3",
      badge: "ケアプログラム",
      title: "パーソナルケア",
      subtitle: "検診結果に基づく最適なケア提案",
      time: "随時",
      price: "内容により異なる",
      color: "oklch(0.62_0.05_148)",
      items: [
        "ホームケア製品のパーソナルレコメンド",
        "店舗でのスカルプトリートメント",
        "サブスクリプション型の製品定期便",
        "必要時の医療機関連携（AGAクリニック等）",
      ],
      desc: "検診結果に基づいた最適なケアで、あなたの頭皮を長期的にサポートします。",
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
            無料チェックから始めて、定期検診へ。あなたのペースで頭皮ケアの習慣を作ります。
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
                    style={{ color: svc.featured ? "oklch(0.88_0.08_75)" : svc.color }}
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

// 料金プランセクション
function PricingSection() {
  const { ref, inView } = useInView();
  const plans = [
    {
      name: "ライト",
      nameEn: "Light",
      price: "1,980",
      period: "月",
      features: [
        "年2回 スカルプ・ドック",
        "製品10% OFF",
        "LINEデータ共有",
        "リマインド通知",
      ],
      cta: "ライトプランで始める",
      featured: false,
    },
    {
      name: "スタンダード",
      nameEn: "Standard",
      price: "3,980",
      period: "月",
      features: [
        "年4回 スカルプ・ドック",
        "製品15% OFF",
        "ヘッドスパ 年2回",
        "パーソナルレポート",
        "LINEデータ共有",
        "リマインド通知",
      ],
      cta: "スタンダードで始める",
      featured: true,
      badge: "人気No.1",
    },
    {
      name: "プレミアム",
      nameEn: "Premium",
      price: "7,980",
      period: "月",
      features: [
        "年4回 スカルプ・ドック",
        "製品20% OFF",
        "ヘッドスパ 毎月",
        "専属アドバイザー",
        "優先予約",
        "医療機関連携",
      ],
      cta: "プレミアムで始める",
      featured: false,
    },
  ];

  return (
    <section className="py-28 bg-[oklch(0.955_0.018_82)]" id="料金プラン">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-cormorant text-[oklch(0.72_0.12_70)] text-sm tracking-[0.3em] uppercase block mb-4">
            Subscription Plans
          </span>
          <h2 className="font-mincho text-[oklch(0.22_0.045_42)] text-3xl md:text-4xl font-bold mb-4">
            サブスクリプションプラン
          </h2>
          <p className="font-sans-jp text-[oklch(0.55_0.04_42)] text-sm">
            月額定額で、継続的な頭皮ケアを。いつでも解約可能です。
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-sm overflow-hidden transition-all duration-700 ${
                plan.featured
                  ? "bg-[oklch(0.22_0.045_42)] shadow-2xl"
                  : "bg-white border border-[oklch(0.88_0.025_75)]"
              } ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              {plan.badge && (
                <div className="absolute top-4 right-4 bg-[oklch(0.72_0.12_70)] text-[oklch(0.18_0.04_42)] font-sans-jp text-xs font-bold px-3 py-1 rounded-full">
                  {plan.badge}
                </div>
              )}
              <div className="p-8">
                <div className="mb-6">
                  <span className="font-cormorant text-[oklch(0.72_0.12_70)] text-xs tracking-widest uppercase block mb-1">
                    {plan.nameEn}
                  </span>
                  <h3 className={`font-mincho text-xl font-bold ${plan.featured ? "text-white" : "text-[oklch(0.22_0.045_42)]"}`}>
                    {plan.name}プラン
                  </h3>
                </div>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className={`font-cormorant text-4xl font-light ${plan.featured ? "text-[oklch(0.88_0.08_75)]" : "text-[oklch(0.22_0.045_42)]"}`}>
                    ¥{plan.price}
                  </span>
                  <span className={`font-sans-jp text-xs ${plan.featured ? "text-white/50" : "text-[oklch(0.55_0.04_42)]"}`}>
                    /{plan.period}（税込）
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <span className="text-[oklch(0.72_0.12_70)] text-sm">✓</span>
                      <span className={`font-sans-jp text-xs ${plan.featured ? "text-white/80" : "text-[oklch(0.38_0.055_42)]"}`}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#cta"
                  className={`block text-center font-sans-jp text-sm font-medium py-3 rounded-sm transition-all ${
                    plan.featured
                      ? "btn-gold-shimmer text-[oklch(0.18_0.04_42)]"
                      : "border border-[oklch(0.22_0.045_42)] text-[oklch(0.22_0.045_42)] hover:bg-[oklch(0.22_0.045_42)] hover:text-white"
                  }`}
                >
                  {plan.cta}
                </a>
              </div>
            </div>
          ))}
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
      emoji: "👨",
      segment: "予防ケア男性",
      age: "20〜30代",
      message: "まだ大丈夫なうちに、始める安心",
      desc: "「親が薄毛だから」「将来のために」という予防的動機で、早めのケアを始めたい方へ。",
    },
    {
      emoji: "👩",
      segment: "ダメージケア女性",
      age: "20〜30代",
      message: "おしゃれを続けるための、頭皮メンテナンス",
      desc: "カラー・パーマを繰り返す方の頭皮ダメージを可視化し、適切なケアをご提案します。",
    },
    {
      emoji: "💆‍♀️",
      segment: "美容意識層",
      age: "30〜40代女性",
      message: "顔の美容は頭皮から",
      desc: "リフトアップ・エイジングケアに関心がある方へ。頭皮の健康が美しい髪と肌を作ります。",
    },
    {
      emoji: "🌿",
      segment: "育毛ケア層",
      age: "40〜50代男女",
      message: "見える化で不安を安心に変える",
      desc: "薄毛・抜け毛の悩みを数値で把握し、科学的なアプローチでケアをサポートします。",
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
  const { ref, inView } = useInView();
  return (
    <section className="py-28 bg-[oklch(0.22_0.045_42)]">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className={`transition-all duration-700 ${inView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}>
            <img
              src={IMAGES.report}
              alt="スカルプカルテ - デジタル頭皮手帳"
              className="w-full rounded-sm shadow-2xl"
            />
          </div>
          <div className={`transition-all duration-700 delay-200 ${inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"}`}>
            <span className="font-cormorant text-[oklch(0.72_0.12_70)] text-sm tracking-[0.3em] uppercase block mb-4">
              My Scalp Karte
            </span>
            <h2 className="font-mincho text-white text-3xl md:text-4xl font-bold mb-8">
              マイ・スカルプカルテ<br />
              <span className="text-[oklch(0.88_0.08_75)]">デジタル頭皮手帳</span>
            </h2>
            <div className="space-y-6">
              {[
                {
                  icon: "📊",
                  title: "時系列レポート",
                  desc: "頭皮状態の推移をグラフで可視化。改善・悪化が一目でわかります。",
                },
                {
                  icon: "🤖",
                  title: "AI予測スコア",
                  desc: "現在のケア状態を続けた場合の将来予測。ゲーミフィケーション要素で継続をサポート。",
                },
                {
                  icon: "🔔",
                  title: "リマインド通知",
                  desc: "次回検診の案内、季節に応じたケアTipsをLINEでお届け。",
                },
                {
                  icon: "🔗",
                  title: "共有機能",
                  desc: "担当美容師やかかりつけ医への情報共有が可能。チームでケアをサポート。",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="text-2xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <h4 className="font-mincho text-white text-base font-bold mb-1">{item.title}</h4>
                    <p className="font-sans-jp text-white/60 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 検診フローセクション
function FlowSection() {
  const { ref, inView } = useInView();
  const steps = [
    {
      num: "01",
      title: "無料スカルプチェックを予約",
      desc: "LINEまたはウェブサイトから簡単予約。所要時間はわずか5〜10分です。",
    },
    {
      num: "02",
      title: "マイクロスコープで頭皮を撮影",
      desc: "専門スタッフが丁寧に頭皮の状態を撮影・記録します。",
    },
    {
      num: "03",
      title: "その場で結果を説明",
      desc: "毛穴の状態・皮脂量・血行を画像つきでわかりやすく解説します。",
    },
    {
      num: "04",
      title: "パーソナルケアプランを提案",
      desc: "あなたの頭皮状態に合わせた最適なホームケアと検診プランをご提案します。",
    },
  ];

  return (
    <section className="py-28 bg-[oklch(0.955_0.018_82)]">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-cormorant text-[oklch(0.72_0.12_70)] text-sm tracking-[0.3em] uppercase block mb-4">
            How It Works
          </span>
          <h2 className="font-mincho text-[oklch(0.22_0.045_42)] text-3xl md:text-4xl font-bold">
            検診の流れ
          </h2>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-8 left-[calc(12.5%+2rem)] right-[calc(12.5%+2rem)] h-px bg-[oklch(0.88_0.025_75)]" />
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`text-center transition-all duration-700 ${
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                <div className="w-16 h-16 rounded-full bg-[oklch(0.22_0.045_42)] flex items-center justify-center mx-auto mb-6 relative z-10">
                  <span className="font-cormorant text-[oklch(0.72_0.12_70)] text-lg font-semibold">{step.num}</span>
                </div>
                <h3 className="font-mincho text-[oklch(0.22_0.045_42)] text-base font-bold mb-3">{step.title}</h3>
                <p className="font-sans-jp text-[oklch(0.55_0.04_42)] text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
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
      a: "はい、むしろ「まだ大丈夫」な段階からの予防ケアを強くおすすめしています。頭皮の状態を定期的に把握することが、将来の健康につながります。",
    },
    {
      q: "どのくらいの頻度で通えばいいですか？",
      a: "3ヶ月に1回（年4回）を推奨しています。季節の変わり目に頭皮状態が変化しやすいため、この頻度が最適です。",
    },
    {
      q: "男性でも女性でも受けられますか？",
      a: "はい、性別を問わずご利用いただけます。20代〜50代まで幅広い方にご利用いただいています。",
    },
    {
      q: "データはどのように管理されますか？",
      a: "撮影した頭皮画像や診断データはLINEまたは専用アプリで安全に管理されます。ご本人の許可なく第三者に共有されることはありません。",
    },
    {
      q: "医療行為ではないですか？",
      a: "スカルプ・ドックは医療行為ではありません。「診断」ではなく「測定・チェック」として、頭皮の状態を可視化するサービスです。医療的な治療が必要と判断された場合は、提携医療機関をご紹介します。",
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
                <span className="font-mincho text-[oklch(0.22_0.045_42)] text-base font-bold pr-4">
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

// CTAセクション
function CtaSection() {
  const { ref, inView } = useInView();
  return (
    <section className="py-28 bg-[oklch(0.22_0.045_42)] relative overflow-hidden" id="cta">
      <div className="absolute inset-0 opacity-10">
        <img src={IMAGES.consultation} alt="" className="w-full h-full object-cover" />
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
            5〜10分の無料スカルプチェックで、あなたの頭皮状態を可視化します。<br className="hidden md:block" />
            予約はLINEまたはウェブから簡単に。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#"
              className="btn-gold-shimmer text-[oklch(0.18_0.04_42)] font-sans-jp font-semibold px-10 py-5 rounded-sm text-base"
              onClick={(e) => { e.preventDefault(); alert("予約フォームへ遷移します（デモ）"); }}
            >
              無料スカルプチェックを予約する
            </a>
            <a
              href="#"
              className="border border-white/40 text-white font-sans-jp font-medium px-10 py-5 rounded-sm text-base hover:bg-white/10 transition-colors"
              onClick={(e) => { e.preventDefault(); alert("LINEで予約（デモ）"); }}
            >
              LINEで予約する
            </a>
          </div>
          <p className="font-sans-jp text-white/40 text-xs mt-6">
            ※ 無料チェックは所要5〜10分。施術は一切ありません。
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
              <div className="w-8 h-8 rounded-full bg-[oklch(0.22_0.045_42)] border border-[oklch(0.72_0.12_70)/30] flex items-center justify-center">
                <span className="text-[oklch(0.72_0.12_70)] text-xs font-cormorant font-semibold">S</span>
              </div>
              <div>
                <div className="font-mincho text-white text-sm font-bold tracking-widest">スカルプ・ドック</div>
                <div className="font-cormorant text-[oklch(0.72_0.12_70)] text-[10px] tracking-widest uppercase">Scalp Doc</div>
              </div>
            </div>
            <p className="font-sans-jp text-white/40 text-xs leading-relaxed">
              歯科検診モデルの頭皮ケア新習慣。<br />
              定期的な頭皮検診で、健康な髪を守ります。
            </p>
          </div>
          <div>
            <h4 className="font-mincho text-white text-sm font-bold mb-4">サービス</h4>
            <ul className="space-y-2">
              {["無料スカルプチェック", "スカルプ・ドック（定期検診）", "パーソナルケアプログラム", "サブスクリプションプラン"].map((item) => (
                <li key={item}>
                  <a href="#" className="font-sans-jp text-white/40 text-xs hover:text-white/70 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-mincho text-white text-sm font-bold mb-4">お問い合わせ</h4>
            <ul className="space-y-2">
              {["予約・お問い合わせ", "よくある質問", "プライバシーポリシー", "特定商取引法に基づく表記"].map((item) => (
                <li key={item}>
                  <a href="#" className="font-sans-jp text-white/40 text-xs hover:text-white/70 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="font-sans-jp text-white/30 text-xs">
            © 2024 スカルプ・ドック. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

// メインコンポーネント
export default function Home() {
  return (
    <div className="min-h-screen">
      <Nav />
      <HeroSection />
      <ProblemSection />
      <ConceptSection />
      <StatsSection />
      <ServiceSection />
      <PricingSection />
      <TargetSection />
      <DigitalSection />
      <FlowSection />
      <FaqSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
