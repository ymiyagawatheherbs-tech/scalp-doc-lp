/**
 * スカルプラボ 認定サロン募集ページ (/salon)
 *
 * Design Philosophy: B2B Premium — Dark Luxury × Professional
 * - ターゲット: エステサロン経営者・休眠美容師・副業希望者
 * - Color: Deep Brown × Gold × Cream
 * - Typography: Shippori Mincho B1 × Cormorant Garamond × Noto Sans JP
 * - Tone: 信頼・収益・成長の3軸で訴求
 */

import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";

// Intersection Observer フック
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setInView(true); observer.disconnect(); }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ナビゲーション
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? "bg-[oklch(0.977_0.012_85/0.97)] backdrop-blur-md shadow-sm border-b border-[oklch(0.88_0.025_75)]"
        : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
        {/* ロゴ */}
        <Link href="/">
          <div className="flex items-center gap-2.5 cursor-pointer">
            <div className="w-7 h-7 rounded-full bg-[oklch(0.22_0.045_42)] flex items-center justify-center shrink-0">
              <span className="text-[oklch(0.72_0.12_70)] text-xs font-['Cormorant_Garamond'] font-semibold">S</span>
            </div>
            <div>
              <div className={`font-['Shippori_Mincho'] text-xs md:text-sm font-bold leading-tight tracking-widest transition-colors ${
                scrolled ? "text-[oklch(0.22_0.045_42)]" : "text-white"
              }`}>スカルプラボ</div>
              <div className="font-['Cormorant_Garamond'] text-[oklch(0.72_0.12_70)] text-[9px] tracking-widest uppercase leading-none">
                Salon Partner
              </div>
            </div>
          </div>
        </Link>

        {/* THE HERBS ロゴ */}
        <div className={`hidden md:flex items-center gap-1.5 transition-all duration-500 ${scrolled ? "opacity-0 pointer-events-none" : "opacity-100"}`}>
          <span className="font-['Cormorant_Garamond'] text-white/40 text-[9px] tracking-[0.2em] uppercase">presented by</span>
          <img
            src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/theherbs_logo_395db853.webp"
            alt="THE HERBS"
            className="h-3.5 w-auto brightness-0 invert opacity-70"
          />
        </div>

        <div className="flex items-center gap-3">
          <Link href="/">
            <span className={`hidden md:inline font-['Noto_Sans_JP'] text-xs transition-colors cursor-pointer ${
              scrolled ? "text-[oklch(0.38_0.055_42)] hover:text-[oklch(0.22_0.045_42)]" : "text-white/70 hover:text-white"
            }`}>
              ← 一般向けページへ
            </span>
          </Link>
          <a
            href="#contact"
            className="font-['Noto_Sans_JP'] text-xs font-semibold px-4 py-2 rounded-sm"
            style={{ background: "oklch(0.72_0.12_70)", color: "oklch(0.18_0.04_42)" }}
          >
            説明会に申し込む
          </a>
        </div>
      </div>
    </nav>
  );
}

// ヒーローセクション
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[oklch(0.18_0.04_42)]">
      {/* 背景グラデーション */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.18_0.04_42)] via-[oklch(0.22_0.045_42)] to-[oklch(0.15_0.035_42)]" />
        {/* ゴールドラインアクセント */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.72_0.12_70)] to-transparent opacity-40" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[oklch(0.72_0.12_70)] to-transparent opacity-20" />
        {/* 右側装飾 */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[oklch(0.72_0.12_70)/30] to-transparent" />
        {/* テクスチャ */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "radial-gradient(circle, oklch(0.72_0.12_70) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-6 pt-24 pb-16 md:py-32">
        <div className="max-w-3xl">
          {/* バッジ */}
          <div className="inline-flex items-center gap-2 border border-[oklch(0.72_0.12_70)/40] px-4 py-2 mb-8 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[oklch(0.72_0.12_70)] animate-pulse" />
            <span className="font-['Noto_Sans_JP'] text-[oklch(0.72_0.12_70)] text-xs tracking-wider">
              認定サロンパートナー募集中
            </span>
          </div>

          <h1 className="font-['Shippori_Mincho'] text-white leading-tight mb-6">
            <span className="block text-2xl md:text-5xl lg:text-6xl font-bold mb-2">
              頭皮ケアを、
            </span>
            <span className="block text-2xl md:text-5xl lg:text-6xl font-bold text-[oklch(0.88_0.08_75)] mb-2">
              あなたのサロンの
            </span>
            <span className="block text-2xl md:text-5xl lg:text-6xl font-bold">
              新収益に。
            </span>
          </h1>

          <p className="font-['Noto_Sans_JP'] text-white/80 text-base md:text-lg leading-relaxed mb-10 max-w-2xl">
            スカルプラボの認定サロンになることで、頭皮チェックの技術と顧客基盤を手に入れ、
            既存サロンの売上アップ・新規集客を実現できます。
            エステサロン・休眠美容師の方にも最適なプログラムです。
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#contact"
              className="font-['Noto_Sans_JP'] font-bold text-sm px-8 py-4 text-center rounded-sm transition-all duration-300 hover:opacity-90"
              style={{ background: "linear-gradient(135deg, oklch(0.72_0.12_70), oklch(0.82_0.14_75))", color: "oklch(0.18_0.04_42)" }}
            >
              無料説明会に申し込む
            </a>
            <a
              href="#program"
              className="border border-white/40 text-white font-['Noto_Sans_JP'] font-medium px-8 py-4 text-center rounded-sm hover:bg-white/10 transition-colors text-sm"
            >
              プログラム詳細を見る
            </a>
          </div>

          {/* 実績バー */}
          <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-3 gap-6">
            {[
              { num: "30+", label: "提携サロン数", sub: "2025年3月時点" },
              { num: "93%", label: "継続率", sub: "認定サロン（当社調べ）" },
              { num: "2.4x", label: "平均売上増加", sub: "導入6ヶ月後（当社調べ）" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-['Cormorant_Garamond'] text-[oklch(0.72_0.12_70)] text-2xl md:text-3xl font-bold">{s.num}</div>
                <div className="font-['Shippori_Mincho'] text-white text-xs md:text-sm mt-1">{s.label}</div>
                <div className="font-['Noto_Sans_JP'] text-white/50 text-[10px] mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
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
      icon: "✦",
      title: "エステサロン経営者",
      desc: "フェイシャル・ボディケアに加えて頭皮ケアを追加メニュー化。単価アップと新規顧客獲得を同時に実現できます。",
      points: ["既存設備を活用", "追加スペース不要", "リピート率向上"],
    },
    {
      icon: "✦",
      title: "休眠美容師・副業希望者",
      desc: "美容師免許を活かしながら、スタイリング以外の収益源を確立。週1〜2日から始められる柔軟なスタイルで稼げます。",
      points: ["週1日〜スタート可", "自宅サロン対応", "美容師免許活用"],
    },
    {
      icon: "✦",
      title: "ヘッドスパ・リラクゼーション店",
      desc: "既存の頭皮・頭部ケアメニューに科学的根拠を加え、差別化と高単価化を実現。データ管理で顧客ロイヤルティを高めます。",
      points: ["差別化メニュー追加", "高単価化", "顧客データ管理"],
    },
  ];

  return (
    <section className="py-24 bg-[oklch(0.97_0.012_82)]" id="target">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-['Cormorant_Garamond'] text-[oklch(0.72_0.12_70)] text-sm tracking-[0.3em] uppercase block mb-4">
            Who Is This For
          </span>
          <h2 className="font-['Shippori_Mincho'] text-[oklch(0.22_0.045_42)] text-3xl md:text-4xl font-bold mb-4">
            こんな方に最適です
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {targets.map((t, i) => (
            <div
              key={t.title}
              className={`bg-white border border-[oklch(0.88_0.025_75)] p-8 rounded-sm hover:shadow-lg hover:border-[oklch(0.72_0.12_70)/40] transition-all duration-500 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <div className="text-[oklch(0.72_0.12_70)] text-xl mb-4">{t.icon}</div>
              <h3 className="font-['Shippori_Mincho'] text-[oklch(0.22_0.045_42)] text-xl font-bold mb-3">{t.title}</h3>
              <p className="font-['Noto_Sans_JP'] text-[oklch(0.45_0.04_42)] text-sm leading-relaxed mb-5">{t.desc}</p>
              <ul className="space-y-2">
                {t.points.map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <span className="text-[oklch(0.72_0.12_70)] text-xs">✓</span>
                    <span className="font-['Noto_Sans_JP'] text-[oklch(0.38_0.055_42)] text-xs">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// プログラム詳細セクション
function ProgramSection() {
  const { ref, inView } = useInView();

  const steps = [
    {
      num: "01",
      title: "無料説明会への参加",
      desc: "オンライン・対面どちらでも対応。スカルプラボの理念・技術・収益モデルをご説明します。質疑応答の時間も十分に設けています。",
      time: "約60分",
    },
    {
      num: "02",
      title: "技術講習会（認定研修）",
      desc: "マイクロスコープの使い方から頭皮チェックの手順、カウンセリングスクリプトまで。実技を含む充実した研修プログラムです。",
      time: "1〜2日間",
    },
    {
      num: "03",
      title: "認定証の取得・サロンリスト掲載",
      desc: "研修修了後、スカルプラボ認定証を発行。スカルプラボ公式サイトのサロンリストに掲載され、新規顧客の流入が期待できます。",
      time: "研修修了後",
    },
    {
      num: "04",
      title: "継続サポート・フォローアップ",
      desc: "定期的な技術アップデート研修、製品供給、マーケティング素材の提供など、認定後も継続的にサポートします。",
      time: "継続的",
    },
  ];

  return (
    <section className="py-28 bg-[oklch(0.22_0.045_42)]" id="program">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <div className={`mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-['Cormorant_Garamond'] text-[oklch(0.72_0.12_70)] text-sm tracking-[0.3em] uppercase block mb-4">
            Certification Program
          </span>
          <h2 className="font-['Shippori_Mincho'] text-white text-3xl md:text-4xl font-bold mb-4">
            認定プログラムの流れ
          </h2>
          <p className="font-['Noto_Sans_JP'] text-white/75 text-sm leading-relaxed max-w-2xl">
            説明会への参加から認定取得まで、最短2週間。既存サロン業務を続けながら無理なく進められます。
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-0 border border-white/10">
          {steps.map((s, i) => (
            <div
              key={s.num}
              className={`p-8 border-r border-white/10 last:border-r-0 hover:bg-white/5 transition-all duration-500 ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="font-['Cormorant_Garamond'] text-[oklch(0.72_0.12_70)/40] text-5xl font-bold mb-6">{s.num}</div>
              <div className="inline-block font-['Noto_Sans_JP'] text-[oklch(0.72_0.12_70)] text-[10px] border border-[oklch(0.72_0.12_70)/40] px-2 py-0.5 mb-4 tracking-wider">
                {s.time}
              </div>
              <h3 className="font-['Shippori_Mincho'] text-white text-lg font-bold mb-3 leading-snug">{s.title}</h3>
              <p className="font-['Noto_Sans_JP'] text-white/75 text-xs leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* 費用・条件 */}
        <div className={`mt-16 grid md:grid-cols-2 gap-8 transition-all duration-700 delay-400 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="border border-[oklch(0.72_0.12_70)/30] p-8 rounded-sm">
            <h3 className="font-['Shippori_Mincho'] text-[oklch(0.88_0.08_75)] text-xl font-bold mb-6">参加条件</h3>
            <ul className="space-y-3">
              {[
                "美容師免許またはエステ資格（いずれかひとつ）",
                "施術スペースがあること（自宅サロン可）",
                "月4回以上の施術が可能なこと",
                "スカルプラボの理念に共感できること",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-[oklch(0.72_0.12_70)] text-sm mt-0.5 flex-shrink-0">✓</span>
                  <span className="font-['Noto_Sans_JP'] text-white/80 text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-white/10 p-8 rounded-sm">
            <h3 className="font-['Shippori_Mincho'] text-white text-xl font-bold mb-6">認定サロンの特典</h3>
            <ul className="space-y-3">
              {[
                "スカルプラボ公式サロンリストへの掲載",
                "マイクロスコープ機器の優待購入",
                "THE HERBS製品の卸価格での仕入れ",
                "集客用マーケティング素材の提供",
                "定期的な技術アップデート研修（無料）",
                "専任担当者によるサポート",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="text-[oklch(0.72_0.12_70)] text-sm mt-0.5 flex-shrink-0">✦</span>
                  <span className="font-['Noto_Sans_JP'] text-white/80 text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

// 収益モデルセクション
function RevenueSection() {
  const { ref, inView } = useInView();

  return (
    <section className="py-28 bg-[oklch(0.97_0.012_82)]" id="revenue">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        <div className={`text-center mb-16 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-['Cormorant_Garamond'] text-[oklch(0.72_0.12_70)] text-sm tracking-[0.3em] uppercase block mb-4">
            Revenue Model
          </span>
          <h2 className="font-['Shippori_Mincho'] text-[oklch(0.22_0.045_42)] text-3xl md:text-4xl font-bold mb-4">
            収益シミュレーション
          </h2>
          <p className="font-['Noto_Sans_JP'] text-[oklch(0.45_0.04_42)] text-sm max-w-xl mx-auto leading-relaxed">
            ※ 以下はモデルケースです。実際の収益は施術数・単価・地域等により異なります。
          </p>
        </div>

        <div className={`grid md:grid-cols-3 gap-6 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {[
            {
              plan: "スタートプラン",
              sub: "週1〜2日・副業スタイル",
              sessions: "月8回",
              price: "¥5,500",
              monthly: "約 44,000円",
              color: "oklch(0.72_0.12_70)",
              highlight: false,
            },
            {
              plan: "スタンダードプラン",
              sub: "週3〜4日・メイン収益化",
              sessions: "月20回",
              price: "¥5,500〜8,800",
              monthly: "約 110,000〜176,000円",
              color: "oklch(0.72_0.12_70)",
              highlight: true,
            },
            {
              plan: "フルタイムプラン",
              sub: "専業・サロン展開",
              sessions: "月40回以上",
              price: "¥5,500〜12,000",
              monthly: "約 220,000円以上",
              color: "oklch(0.72_0.12_70)",
              highlight: false,
            },
          ].map((p, i) => (
            <div
              key={p.plan}
              className={`rounded-sm p-8 border transition-all duration-500 ${
                p.highlight
                  ? "bg-[oklch(0.22_0.045_42)] border-[oklch(0.72_0.12_70)/50] shadow-xl"
                  : "bg-white border-[oklch(0.88_0.025_75)]"
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              {p.highlight && (
                <div className="font-['Noto_Sans_JP'] text-[oklch(0.18_0.04_42)] text-[10px] font-bold px-3 py-1 rounded-full mb-4 inline-block"
                  style={{ background: "oklch(0.72_0.12_70)" }}>
                  人気プラン
                </div>
              )}
              <h3 className={`font-['Shippori_Mincho'] text-xl font-bold mb-1 ${p.highlight ? "text-white" : "text-[oklch(0.22_0.045_42)]"}`}>
                {p.plan}
              </h3>
              <p className={`font-['Noto_Sans_JP'] text-xs mb-6 ${p.highlight ? "text-white/65" : "text-[oklch(0.55_0.04_42)]"}`}>
                {p.sub}
              </p>
              <div className="mb-2">
                <span className={`font-['Noto_Sans_JP'] text-xs ${p.highlight ? "text-white/65" : "text-[oklch(0.55_0.04_42)]"}`}>月間施術数</span>
                <div className={`font-['Shippori_Mincho'] text-2xl font-bold mt-1 ${p.highlight ? "text-[oklch(0.88_0.08_75)]" : "text-[oklch(0.22_0.045_42)]"}`}>
                  {p.sessions}
                </div>
              </div>
              <div className={`border-t pt-4 mt-4 ${p.highlight ? "border-white/10" : "border-[oklch(0.88_0.025_75)]"}`}>
                <span className={`font-['Noto_Sans_JP'] text-xs ${p.highlight ? "text-white/65" : "text-[oklch(0.55_0.04_42)]"}`}>想定月収</span>
                <div className="font-['Shippori_Mincho'] text-xl font-bold mt-1" style={{ color: "oklch(0.72_0.12_70)" }}>
                  {p.monthly}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="font-['Noto_Sans_JP'] text-[oklch(0.55_0.04_42)] text-xs text-center mt-6">
          ※ 上記は参考値です。実際の収益を保証するものではありません。
        </p>
      </div>
    </section>
  );
}

// よくある質問
function FaqSection() {
  const { ref, inView } = useInView();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "美容師免許がなくてもできますか？",
      a: "エステ資格（国家資格・民間資格問わず）をお持ちの方も対象です。頭皮チェックは医療行為ではないため、美容師免許がなくても施術可能です。詳しくは説明会でご確認ください。",
    },
    {
      q: "自宅サロンでも認定を受けられますか？",
      a: "はい、自宅サロンでも認定を受けることができます。施術スペースと必要な衛生環境が整っていれば問題ありません。",
    },
    {
      q: "初期費用はどのくらいかかりますか？",
      a: "研修費用と機器の導入費用が主な初期投資となります。詳細は説明会でご案内しますが、既存設備を活用できるケースも多く、比較的低コストでスタートできます。",
    },
    {
      q: "サロンリストへの掲載はいつから？",
      a: "認定研修修了後、審査を経て掲載となります。通常、研修修了から2〜4週間程度でサイトへの掲載が完了します。",
    },
    {
      q: "既存の美容室でも導入できますか？",
      a: "はい、美容室での導入も歓迎しています。スタイリングの合間や待ち時間を活用した頭皮チェックメニューとして展開している認定サロンも多数あります。",
    },
  ];

  return (
    <section className="py-24 bg-[oklch(0.22_0.045_42)]" id="faq">
      <div ref={ref} className="max-w-3xl mx-auto px-6">
        <div className={`text-center mb-12 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-['Cormorant_Garamond'] text-[oklch(0.72_0.12_70)] text-sm tracking-[0.3em] uppercase block mb-4">FAQ</span>
          <h2 className="font-['Shippori_Mincho'] text-white text-3xl font-bold">よくある質問</h2>
        </div>

        <div className={`space-y-3 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {faqs.map((faq, i) => (
            <div key={i} className="border border-white/10 rounded-sm overflow-hidden">
              <button
                className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/5 transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-['Shippori_Mincho'] text-white text-sm font-bold pr-4">{faq.q}</span>
                <span className="text-[oklch(0.72_0.12_70)] flex-shrink-0 text-lg">{openIndex === i ? "−" : "+"}</span>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5 border-t border-white/10">
                  <p className="font-['Noto_Sans_JP'] text-white/80 text-sm leading-relaxed pt-4">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// お問い合わせ・説明会申し込みセクション
function ContactSection() {
  const { ref, inView } = useInView();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "", salon: "", tel: "", email: "", type: "", message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section className="py-28 bg-[oklch(0.15_0.035_42)]" id="contact">
      <div ref={ref} className="max-w-2xl mx-auto px-6">
        <div className={`text-center mb-12 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <span className="font-['Cormorant_Garamond'] text-[oklch(0.72_0.12_70)] text-sm tracking-[0.3em] uppercase block mb-4">
            Apply Now
          </span>
          <h2 className="font-['Shippori_Mincho'] text-white text-3xl md:text-4xl font-bold mb-4">
            無料説明会に申し込む
          </h2>
          <p className="font-['Noto_Sans_JP'] text-white/75 text-sm leading-relaxed">
            オンライン・対面どちらでも対応。まずはお気軽にご相談ください。
          </p>
          {/* LINEで問い合わせ */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://lin.ee/oVzqlI7"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-8 py-4 font-['Noto_Sans_JP'] font-bold text-sm text-white transition-opacity hover:opacity-90 w-full sm:w-auto justify-center"
              style={{ backgroundColor: "#06C755" }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
              </svg>
              LINEで気軽に問い合わせる
              <span className="text-white/75 text-xs font-normal">@723lsjqi</span>
            </a>
            <span className="font-['Noto_Sans_JP'] text-white/40 text-xs hidden sm:block">または</span>
            <span className="font-['Noto_Sans_JP'] text-white/40 text-xs sm:hidden">または下記フォームから</span>
          </div>
          <div className="mt-6 border-t border-white/10 pt-6">
            <p className="font-['Noto_Sans_JP'] text-white/50 text-xs text-center mb-6">フォームからのお申し込みも受け付けています</p>
          </div>
        </div>

        {submitted ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-full border border-[oklch(0.72_0.12_70)/40] flex items-center justify-center mx-auto mb-6">
              <span className="text-[oklch(0.72_0.12_70)] text-3xl">✓</span>
            </div>
            <h3 className="font-['Shippori_Mincho'] text-white text-2xl font-bold mb-4">お申し込みを受け付けました</h3>
            <p className="font-['Noto_Sans_JP'] text-white/75 text-sm leading-relaxed">
              担当者より2営業日以内にご連絡いたします。<br />
              しばらくお待ちください。
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="font-['Noto_Sans_JP'] text-white/70 text-xs block mb-2 tracking-wider">
                  お名前 <span className="text-[oklch(0.72_0.12_70)]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/15 text-white font-['Noto_Sans_JP'] text-sm px-4 py-3 rounded-sm focus:outline-none focus:border-[oklch(0.72_0.12_70)/60] transition-colors"
                  placeholder="山田 花子"
                />
              </div>
              <div>
                <label className="font-['Noto_Sans_JP'] text-white/70 text-xs block mb-2 tracking-wider">
                  サロン名・屋号
                </label>
                <input
                  type="text"
                  value={form.salon}
                  onChange={(e) => setForm({ ...form, salon: e.target.value })}
                  className="w-full bg-white/5 border border-white/15 text-white font-['Noto_Sans_JP'] text-sm px-4 py-3 rounded-sm focus:outline-none focus:border-[oklch(0.72_0.12_70)/60] transition-colors"
                  placeholder="○○サロン"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="font-['Noto_Sans_JP'] text-white/70 text-xs block mb-2 tracking-wider">
                  電話番号 <span className="text-[oklch(0.72_0.12_70)]">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={form.tel}
                  onChange={(e) => setForm({ ...form, tel: e.target.value })}
                  className="w-full bg-white/5 border border-white/15 text-white font-['Noto_Sans_JP'] text-sm px-4 py-3 rounded-sm focus:outline-none focus:border-[oklch(0.72_0.12_70)/60] transition-colors"
                  placeholder="090-XXXX-XXXX"
                />
              </div>
              <div>
                <label className="font-['Noto_Sans_JP'] text-white/70 text-xs block mb-2 tracking-wider">
                  メールアドレス <span className="text-[oklch(0.72_0.12_70)]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/15 text-white font-['Noto_Sans_JP'] text-sm px-4 py-3 rounded-sm focus:outline-none focus:border-[oklch(0.72_0.12_70)/60] transition-colors"
                  placeholder="example@email.com"
                />
              </div>
            </div>

            <div>
              <label className="font-['Noto_Sans_JP'] text-white/70 text-xs block mb-2 tracking-wider">
                現在のお仕事・資格 <span className="text-[oklch(0.72_0.12_70)]">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {["エステサロン", "美容師", "ヘッドスパ", "その他"].map((opt) => (
                  <label
                    key={opt}
                    className={`flex items-center justify-center gap-2 border text-xs font-['Noto_Sans_JP'] py-2.5 px-3 rounded-sm cursor-pointer transition-all ${
                      form.type === opt
                        ? "border-[oklch(0.72_0.12_70)] text-[oklch(0.72_0.12_70)] bg-[oklch(0.72_0.12_70)/10]"
                        : "border-white/15 text-white/60 hover:border-white/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="type"
                      value={opt}
                      className="sr-only"
                      onChange={() => setForm({ ...form, type: opt })}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="font-['Noto_Sans_JP'] text-white/70 text-xs block mb-2 tracking-wider">
                ご質問・ご要望
              </label>
              <textarea
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full bg-white/5 border border-white/15 text-white font-['Noto_Sans_JP'] text-sm px-4 py-3 rounded-sm focus:outline-none focus:border-[oklch(0.72_0.12_70)/60] transition-colors resize-none"
                placeholder="ご質問や気になる点があればお気軽にどうぞ。"
              />
            </div>

            <button
              type="submit"
              className="w-full font-['Noto_Sans_JP'] font-bold text-sm py-4 rounded-sm transition-all duration-300 hover:opacity-90"
              style={{ background: "linear-gradient(135deg, oklch(0.72_0.12_70), oklch(0.82_0.14_75))", color: "oklch(0.18_0.04_42)" }}
            >
              無料説明会に申し込む
            </button>

            <p className="font-['Noto_Sans_JP'] text-white/50 text-[11px] text-center leading-relaxed">
              ※ このフォームはデモ用です。送信後、担当者よりご連絡いたします。<br />
              個人情報は<Link href="/privacy"><span className="underline cursor-pointer">プライバシーポリシー</span></Link>に基づき適切に管理します。
            </p>
          </form>
        )}
      </div>
    </section>
  );
}

// フッター
function Footer() {
  return (
    <footer className="bg-[oklch(0.12_0.03_42)] py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 pb-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[oklch(0.22_0.045_42)] border border-[oklch(0.72_0.12_70)/30] flex items-center justify-center">
              <span className="text-[oklch(0.72_0.12_70)] text-xs font-['Cormorant_Garamond'] font-semibold">S</span>
            </div>
            <div>
              <div className="font-['Shippori_Mincho'] text-white text-sm font-bold tracking-widest">スカルプラボ</div>
              <div className="font-['Cormorant_Garamond'] text-[oklch(0.72_0.12_70)] text-[10px] tracking-widest uppercase">Salon Partner Program</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-['Cormorant_Garamond'] text-white/30 text-[10px] tracking-[0.15em] uppercase">by</span>
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/theherbs_logo_395db853.webp"
              alt="THE HERBS"
              className="h-3.5 w-auto brightness-0 invert opacity-50"
            />
          </div>
          <div className="flex gap-6">
            <Link href="/"><span className="font-['Noto_Sans_JP'] text-white/55 text-xs hover:text-white/80 transition-colors cursor-pointer">一般向けLP</span></Link>
            <Link href="/privacy"><span className="font-['Noto_Sans_JP'] text-white/55 text-xs hover:text-white/80 transition-colors cursor-pointer">プライバシーポリシー</span></Link>
            <Link href="/tokushoho"><span className="font-['Noto_Sans_JP'] text-white/55 text-xs hover:text-white/80 transition-colors cursor-pointer">特定商取引法</span></Link>
          </div>
        </div>
        <p className="font-['Noto_Sans_JP'] text-white/55 text-xs text-center">
          © 2025 スカルプラボ / THE HERBS. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// メインコンポーネント
export default function SalonPartner() {
  return (
    <div className="min-h-screen">
      <Nav />
      <Hero />
      <TargetSection />
      <ProgramSection />
      <RevenueSection />
      <FaqSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
