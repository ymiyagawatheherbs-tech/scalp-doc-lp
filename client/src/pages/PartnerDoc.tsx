/*
 * スカルプラボ パートナー資料 — 配布用LP
 * URL: /partner-doc
 * 対象: 配布先全般（認証不要・公開）
 * テーマ: 頭皮ケアを日常に。楽しさ × ビジネス
 */

import { useState, useEffect, useRef } from "react";

// ── 画像URL ──────────────────────────────────────────────────
const IMG = {
  hero: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/hero-main-7WiQYuuxpMEgAPgcyJcPik.webp",
  microscopeCheck: "/manus-storage/microscope_check_c8034773.jpeg",
  herbSteamer: "/manus-storage/herb_steamer_72edf538.jpeg",
  salonInterior: "/manus-storage/salon_interior_921d28d8.jpeg",
  consultation: "/manus-storage/consultation_241b3ba2.png",
  scalpGommage: "/manus-storage/pptx_image8_7b00edbd.jpeg",
  dryHerbs: "/manus-storage/pptx_image10_101cab8b.jpeg",
  scalpMicro: "/manus-storage/pptx_image11_28a4825d.jpeg",
  product: "/manus-storage/product_fillis_BF9I3827_9fb31a78.jpg",
};

// ── カラー定数 ────────────────────────────────────────────────
const C = {
  darkBrown: "#2c1a0e",
  midBrown: "#4a2c16",
  lightBrown: "#6b3f1f",
  gold: "#c9a227",
  goldLight: "#e8c84a",
  cream: "#f5f0e8",
  creamDark: "#ede5d5",
  white: "#ffffff",
  textDark: "#1a1a1a",
  textMid: "#4a3728",
  accent: "#8b5e3c",
  sage: "#707862",
  sageLight: "#A9C0A6",
};

// ── URL定数 ──────────────────────────────────────────────────
const LINE_URL = "https://lin.ee/6GDbcebK";
const SEMINAR_URL = "https://liff.line.me/2009830640-luW0lUXi?liff_id=2009830640-luW0lUXi&is=bcljDz4G8D&option_key=oKCS046HyJ";
const TRIAL_URL = "https://liff.line.me/2009830640-luW0lUXi?liff_id=2009830640-luW0lUXi&is=bcljDz4G8D&option_key=TFpZH45DAg";

// ── スクロールアニメーション ──────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

// ── 共通コンポーネント ────────────────────────────────────────
function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({ text, light = false }: { text: string; light?: boolean }) {
  return (
    <p style={{
      fontSize: "10px",
      letterSpacing: "0.22em",
      fontWeight: 700,
      color: light ? C.goldLight : C.gold,
      marginBottom: "8px",
      textTransform: "uppercase",
    }}>
      {text}
    </p>
  );
}

function GoldLine() {
  return <div style={{ width: "36px", height: "2px", background: C.gold, margin: "12px 0 20px" }} />;
}

// ── フローティングCTA ─────────────────────────────────────────
function FloatingCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: C.darkBrown, borderTop: `2px solid ${C.gold}`,
      padding: "10px 16px", display: "flex", gap: "8px", zIndex: 100,
      boxShadow: "0 -4px 20px rgba(0,0,0,0.35)",
    }}>
      <a href={SEMINAR_URL} target="_blank" rel="noopener noreferrer" style={{
        flex: 1, display: "block", background: C.gold, color: C.darkBrown,
        textAlign: "center", padding: "13px 8px", borderRadius: "4px",
        fontWeight: 700, fontSize: "13px", textDecoration: "none", letterSpacing: "0.03em",
      }}>
        説明会に参加する（無料）
      </a>
      <a href={TRIAL_URL} target="_blank" rel="noopener noreferrer" style={{
        flex: 1, display: "block", background: "transparent", color: C.goldLight,
        textAlign: "center", padding: "13px 8px", borderRadius: "4px",
        fontWeight: 700, fontSize: "13px", textDecoration: "none",
        border: `1.5px solid ${C.gold}`, letterSpacing: "0.03em",
      }}>
        神戸で体験する（無料）
      </a>
    </div>
  );
}

// ── 01. ヒーロー ──────────────────────────────────────────────
function Hero() {
  return (
    <section style={{ position: "relative", background: C.darkBrown, overflow: "hidden" }}>
      <img
        src={IMG.hero}
        alt="頭皮チェックの様子"
        style={{ width: "100%", height: "340px", objectFit: "cover", display: "block", opacity: 0.7 }}
      />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(44,26,14,0.3) 0%, rgba(44,26,14,0.85) 70%, rgba(44,26,14,1) 100%)",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        padding: "0 20px 32px",
      }}>
        <p style={{ fontSize: "9px", letterSpacing: "0.28em", color: C.gold, fontWeight: 700, marginBottom: "10px" }}>
          SCALP LABO — PARTNER DOCUMENT
        </p>
        <h1 style={{ fontSize: "26px", fontWeight: 800, color: C.white, lineHeight: 1.4, marginBottom: "12px" }}>
          頭皮チェックを、<br />
          <span style={{ color: C.goldLight }}>日常の楽しみに。</span>
        </h1>
        <p style={{ fontSize: "13px", color: "rgba(245,240,232,0.85)", lineHeight: 1.8 }}>
          歯の定期検診のように、頭皮も定期的にチェックする文化をつくる。<br />
          植物の力で、10年後も豊かな髪を育てる新習慣。
        </p>
        <div style={{ marginTop: "20px", display: "flex", gap: "8px" }}>
          <a href={SEMINAR_URL} target="_blank" rel="noopener noreferrer" style={{
            flex: 1, background: C.gold, color: C.darkBrown, textAlign: "center",
            padding: "14px 10px", borderRadius: "4px", fontWeight: 700, fontSize: "13px",
            textDecoration: "none", letterSpacing: "0.03em",
          }}>
            説明会に参加する（無料）
          </a>
          <a href={LINE_URL} target="_blank" rel="noopener noreferrer" style={{
            flex: 1, background: "transparent", color: C.goldLight, textAlign: "center",
            padding: "14px 10px", borderRadius: "4px", fontWeight: 700, fontSize: "13px",
            textDecoration: "none", border: `1.5px solid ${C.gold}`, letterSpacing: "0.03em",
          }}>
            LINEで相談する
          </a>
        </div>
      </div>
    </section>
  );
}

// ── 02. 共感キャッチ ──────────────────────────────────────────
function EmpathySection() {
  const questions = [
    "髪のボリュームが気になり始めた",
    "頭皮のかゆみやにおいが気になる",
    "カラーやパーマを繰り返して頭皮が疲れている",
    "薄毛が心配だけど、どこに相談すればいいかわからない",
    "スキンケアはしているのに、頭皮ケアは後回し",
  ];
  return (
    <section style={{ background: C.cream, padding: "40px 20px" }}>
      <FadeIn>
        <SectionLabel text="DOES THIS SOUND FAMILIAR?" />
        <h2 style={{ fontSize: "20px", fontWeight: 800, color: C.darkBrown, lineHeight: 1.45, marginBottom: "4px" }}>
          あなたの頭皮、<br />
          <span style={{ color: C.gold }}>最後にチェックしたのはいつ？</span>
        </h2>
        <GoldLine />
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
          {questions.map((q, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: "10px",
              background: C.white, borderRadius: "6px", padding: "14px 16px",
              border: `1px solid ${C.creamDark}`,
            }}>
              <span style={{
                minWidth: "20px", height: "20px", background: C.darkBrown, color: C.gold,
                borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "10px", fontWeight: 800, flexShrink: 0, marginTop: "1px",
              }}>
                ?
              </span>
              <p style={{ fontSize: "13px", color: C.textMid, lineHeight: 1.6 }}>{q}</p>
            </div>
          ))}
        </div>
        <div style={{
          background: C.darkBrown, borderRadius: "8px", padding: "20px 18px",
          borderLeft: `4px solid ${C.gold}`,
        }}>
          <p style={{ fontSize: "14px", color: C.white, fontWeight: 700, lineHeight: 1.7, marginBottom: "8px" }}>
            頭皮は「第二の顔」。<br />
            スキンケアと同じように、<span style={{ color: C.goldLight }}>定期的なチェックと習慣的なケア</span>が必要です。
          </p>
          <p style={{ fontSize: "12px", color: "rgba(245,240,232,0.75)", lineHeight: 1.7 }}>
            薄毛や頭皮トラブルは、気になり始めたときにはすでに進行していることがほとんど。
            「なってから対処」ではなく、「なる前に守る」。それがスカルプラボのアプローチです。
          </p>
        </div>
      </FadeIn>
    </section>
  );
}

// ── 03. 頭皮チェックの楽しさ ─────────────────────────────────
function ScalpCheckJoy() {
  const steps = [
    {
      step: "01",
      title: "マイクロスコープで「見える化」",
      body: "自分の頭皮を初めてマイクロスコープで見たとき、多くの方が「こんなになってたの！」と驚きます。見えなかったものが見えるようになる体験は、ケアへの意欲を自然に引き出します。",
      note: "約5〜10分。痛みも不快感もなし",
      img: IMG.microscopeCheck,
      highlight: "見ることが、変わるきっかけになる",
    },
    {
      step: "02",
      title: "植物の蒸気で頭皮をリセット",
      body: "THE HERBSが開発したハーブスチーマーで、植物成分そのものを蒸気として頭皮に届けます。カラーやパーマ後の薬剤除去にも対応。「頭皮がスッキリした」「香りが心地よい」と感じる方が多く、施術自体がリラクゼーション体験になります。",
      note: "カラー・パーマ後の頭皮ケアにも対応",
      img: IMG.herbSteamer,
      highlight: "植物の力で、頭皮を本来の状態へ",
    },
    {
      step: "03",
      title: "データで変化を実感する",
      body: "チェックのたびに頭皮の状態を記録・比較。「3ヶ月前より毛根が太くなった」「皮脂バランスが整ってきた」など、数値と画像で変化が見えるから、ケアを続けるモチベーションが続きます。",
      note: "時系列データで変化を可視化",
      img: IMG.consultation,
      highlight: "続けるほど、楽しくなる仕組み",
    },
  ];

  return (
    <section style={{ background: C.darkBrown, padding: "40px 20px", color: C.cream }}>
      <FadeIn>
        <SectionLabel text="THE SCALP CHECK EXPERIENCE" light />
        <h2 style={{ fontSize: "20px", fontWeight: 800, color: C.white, lineHeight: 1.45, marginBottom: "4px" }}>
          頭皮チェックって、<br />
          <span style={{ color: C.goldLight }}>こんなに楽しい。</span>
        </h2>
        <GoldLine />
      </FadeIn>
      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        {steps.map((s, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <img
              src={s.img}
              alt={s.title}
              style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "8px", marginBottom: "16px" }}
            />
            <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "8px" }}>
              <span style={{ fontSize: "28px", fontWeight: 800, color: C.gold, fontFamily: "serif", lineHeight: 1 }}>
                {s.step}
              </span>
              <h3 style={{ fontSize: "17px", fontWeight: 700, color: C.white, lineHeight: 1.4 }}>
                {s.title}
              </h3>
            </div>
            <p style={{ fontSize: "13px", color: "rgba(245,240,232,0.82)", lineHeight: 1.8, marginBottom: "12px" }}>
              {s.body}
            </p>
            <div style={{
              background: "rgba(201,162,39,0.15)", border: `1px solid rgba(201,162,39,0.4)`,
              borderRadius: "6px", padding: "10px 14px", marginBottom: "8px",
            }}>
              <p style={{ fontSize: "12px", color: C.goldLight, fontWeight: 700, lineHeight: 1.6 }}>
                {s.highlight}
              </p>
            </div>
            <p style={{ fontSize: "11px", color: "rgba(245,240,232,0.5)", paddingLeft: "4px" }}>
              {s.note}
            </p>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

// ── 04. 市場の空白地帯 ────────────────────────────────────────
function MarketOpportunity() {
  return (
    <section style={{ background: C.cream, padding: "40px 20px" }}>
      <FadeIn>
        <SectionLabel text="MARKET OPPORTUNITY" />
        <h2 style={{ fontSize: "20px", fontWeight: 800, color: C.darkBrown, lineHeight: 1.45, marginBottom: "4px" }}>
          美容業界は飽和。<br />
          <span style={{ color: C.gold }}>でも頭皮ケアは空白地帯。</span>
        </h2>
        <GoldLine />

        {/* ポジショニング図 */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          {[
            { label: "美容室", desc: "スタイリング\nカラー・パーマ", dim: true },
            { label: "THE HERBS\nSCALP LABO", desc: "頭皮の定期チェック\n＋ケアの習慣化", highlight: true },
            { label: "医療機関", desc: "薬・治療\n皮膚科・病院", dim: true },
          ].map((p, i) => (
            <div key={i} style={{
              flex: 1, background: p.highlight ? C.darkBrown : "rgba(44,26,14,0.07)",
              borderRadius: "8px", padding: "16px 10px", textAlign: "center",
              border: p.highlight ? `2px solid ${C.gold}` : `1px solid ${C.creamDark}`,
            }}>
              {p.highlight && (
                <p style={{ fontSize: "8px", color: C.gold, marginBottom: "4px", letterSpacing: "0.1em", fontWeight: 700 }}>
                  ここに参入
                </p>
              )}
              <p style={{
                fontSize: "12px", fontWeight: 700,
                color: p.highlight ? C.white : C.textMid,
                lineHeight: 1.4, whiteSpace: "pre-line", marginBottom: "8px",
              }}>
                {p.label}
              </p>
              <p style={{
                fontSize: "10px",
                color: p.highlight ? "rgba(245,240,232,0.8)" : C.textMid,
                lineHeight: 1.5, whiteSpace: "pre-line",
              }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        {/* 統計データ */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
          {[
            {
              label: "ヘッドスパ・頭皮ケア需要",
              value: "前年比 9.6%増",
              desc: "リラクゼーション市場は3,674億円（2024年）。頭皮ケアへの需要が特に拡大中。",
              source: "リクルート美容センサス2024",
            },
            {
              label: "頭皮の定期チェックを提供するサロン",
              value: "国内でほぼゼロ",
              desc: "歯科の定期検診は当たり前になりましたが、頭皮の定期チェックを習慣として提供しているサロンはほとんど存在しません。",
              source: "THE HERBS調べ",
            },
          ].map((s, i) => (
            <div key={i} style={{
              background: C.white, borderRadius: "8px", padding: "16px",
              borderLeft: `3px solid ${C.gold}`, border: `1px solid ${C.creamDark}`,
              borderLeftWidth: "3px", borderLeftColor: C.gold,
            }}>
              <p style={{ fontSize: "10px", color: C.gold, letterSpacing: "0.1em", marginBottom: "4px", fontWeight: 700 }}>
                {s.label}
              </p>
              <p style={{ fontSize: "22px", fontWeight: 800, color: C.darkBrown, marginBottom: "6px" }}>
                {s.value}
              </p>
              <p style={{ fontSize: "12px", color: C.textMid, lineHeight: 1.7 }}>{s.desc}</p>
              <p style={{ fontSize: "10px", color: C.accent, marginTop: "6px" }}>※{s.source}</p>
            </div>
          ))}
        </div>

        <div style={{
          background: C.darkBrown, borderRadius: "8px", padding: "18px",
          textAlign: "center",
        }}>
          <p style={{ fontSize: "13px", color: C.white, fontWeight: 700, lineHeight: 1.7 }}>
            「頭皮の定期チェック」を習慣として提供できるのは、<br />
            <span style={{ color: C.goldLight }}>今のところほぼあなただけです。</span>
          </p>
        </div>
      </FadeIn>
    </section>
  );
}

// ── 05. ビジネスモデル ────────────────────────────────────────
function BusinessModel() {
  return (
    <section style={{ background: C.midBrown, padding: "40px 20px", color: C.cream }}>
      <FadeIn>
        <SectionLabel text="BUSINESS MODEL" light />
        <h2 style={{ fontSize: "20px", fontWeight: 800, color: C.white, lineHeight: 1.45, marginBottom: "4px" }}>
          「売る事業」ではなく、<br />
          <span style={{ color: C.goldLight }}>「習慣をつくる事業」</span>
        </h2>
        <GoldLine />
        <p style={{ fontSize: "13px", color: "rgba(245,240,232,0.8)", lineHeight: 1.8, marginBottom: "24px" }}>
          歯科の定期検診と同じモデルを、頭皮ケアで実現します。
          お客様が「また来たい」と思う仕組みが、安定した収益基盤になります。
        </p>
      </FadeIn>

      {/* 収益の流れ */}
      <FadeIn delay={0.1}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {[
            {
              icon: "1",
              title: "頭皮チェックで来店",
              body: "定期チェックを習慣にしてもらうことで、自然なリピートが生まれます。「また来なきゃ」ではなく「また来たい」という関係性。",
              tag: "定期来店 × 信頼関係",
            },
            {
              icon: "2",
              title: "課題に合わせた施術",
              body: "チェックで問題が見つかった方への施術（歯医者でいう虫歯治療）。ニーズが明確なので、提案がスムーズで成約率が高い。",
              tag: "ニーズ顕在化 × 高成約率",
            },
            {
              icon: "3",
              title: "ホームケア商品の継続販売",
              body: "施術で信頼を得たお客様が、そのままホームケア商品を継続購入。施術収益＋物販収益の二軸で安定。",
              tag: "施術売上 × 物販売上",
            },
          ].map((p, i) => (
            <div key={i} style={{
              display: "flex", gap: "14px", padding: "18px 0",
              borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.1)" : "none",
            }}>
              <div style={{
                minWidth: "36px", height: "36px", background: C.gold, color: C.darkBrown,
                borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "16px", fontWeight: 800, flexShrink: 0, marginTop: "2px",
              }}>
                {p.icon}
              </div>
              <div>
                <p style={{ fontSize: "15px", fontWeight: 700, color: C.white, marginBottom: "6px" }}>
                  {p.title}
                </p>
                <p style={{ fontSize: "12px", color: "rgba(245,240,232,0.78)", lineHeight: 1.7, marginBottom: "8px" }}>
                  {p.body}
                </p>
                <div style={{
                  display: "inline-block", background: "rgba(201,162,39,0.2)",
                  borderRadius: "4px", padding: "4px 10px",
                  fontSize: "11px", color: C.goldLight, fontWeight: 600,
                }}>
                  {p.tag}
                </div>
              </div>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* 収益イメージ */}
      <FadeIn delay={0.2}>
        <div style={{
          marginTop: "24px", background: "rgba(255,255,255,0.07)",
          borderRadius: "8px", padding: "20px 16px",
          border: `1px solid rgba(201,162,39,0.3)`,
        }}>
          <p style={{ fontSize: "11px", color: C.gold, letterSpacing: "0.12em", marginBottom: "12px", fontWeight: 700 }}>
            REVENUE IMAGE
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { label: "定期チェック", value: "月4〜8名", sub: "安定収益の土台" },
              { label: "施術", value: "都度対応", sub: "高単価メニュー" },
              { label: "物販", value: "継続購入", sub: "ストック収益" },
            ].map((r, i) => (
              <div key={i} style={{
                flex: 1, textAlign: "center", padding: "12px 6px",
                background: "rgba(255,255,255,0.06)", borderRadius: "6px",
              }}>
                <p style={{ fontSize: "9px", color: C.gold, letterSpacing: "0.08em", marginBottom: "4px" }}>
                  {r.label}
                </p>
                <p style={{ fontSize: "13px", fontWeight: 700, color: C.white, marginBottom: "3px" }}>
                  {r.value}
                </p>
                <p style={{ fontSize: "10px", color: "rgba(245,240,232,0.55)", lineHeight: 1.4 }}>
                  {r.sub}
                </p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "10px", color: "rgba(245,240,232,0.4)", marginTop: "10px", textAlign: "center" }}>
            ※収益は個人の活動状況により異なります
          </p>
        </div>
      </FadeIn>
    </section>
  );
}

// ── 06. こんな方に向いている ──────────────────────────────────
function WhoIsItFor() {
  const profiles = [
    {
      title: "エステサロン・ヘッドスパ店",
      body: "すでに頭部のケアを提供している方。頭皮チェックを加えることで専門性が高まり、客単価・リピート率の向上が見込めます。既存の施術との相性も抜群です。",
      points: ["既存メニューへの自然な追加", "客単価アップ", "リピート率向上"],
    },
    {
      title: "美容師（副業・起業を考えている方）",
      body: "スタイリングに集中したい美容師にとって、頭皮ケアは時間的に難しい。でも頭皮チェックは5〜10分。問題が見つかった方への施術は美容師でも対応できます（歯医者の虫歯治療モデル）。",
      points: ["5〜10分で完結するチェック", "差別化・専門性の確立", "副業・独立の第一歩に"],
    },
    {
      title: "自宅サロン・個人事業主",
      body: "大きな設備投資なしに始められます。マイクロスコープ1台から。THE HERBSのブランド・技術・サポートを活用して、リスクを抑えたスタートが可能です。",
      points: ["マイクロスコープ1台から", "THE HERBSブランドを活用", "認定サロンとして集客"],
    },
    {
      title: "これから起業を考えている方",
      body: "美容・ヘルスケア分野での起業を考えている方。「頭皮ケアの専門家」という明確なポジションで、競合がほぼいない市場に参入できます。チョコザップ等の施設への出張チェックという展開も視野に。",
      points: ["明確なポジション", "ブルーオーシャン市場", "出張チェックにも対応"],
    },
  ];

  return (
    <section style={{ background: C.cream, padding: "40px 20px" }}>
      <FadeIn>
        <SectionLabel text="WHO IS THIS FOR?" />
        <h2 style={{ fontSize: "20px", fontWeight: 800, color: C.darkBrown, lineHeight: 1.45, marginBottom: "4px" }}>
          こんな方と<br />
          <span style={{ color: C.gold }}>一緒に取り組みたい</span>
        </h2>
        <GoldLine />
      </FadeIn>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {profiles.map((p, i) => (
          <FadeIn key={i} delay={i * 0.08}>
            <div style={{
              background: C.white, borderRadius: "10px", padding: "20px 18px",
              border: `1px solid ${C.creamDark}`, borderTop: `3px solid ${C.gold}`,
            }}>
              <p style={{ fontSize: "15px", fontWeight: 800, color: C.darkBrown, marginBottom: "10px" }}>
                {p.title}
              </p>
              <p style={{ fontSize: "12px", color: C.textMid, lineHeight: 1.8, marginBottom: "12px" }}>
                {p.body}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {p.points.map((pt, j) => (
                  <span key={j} style={{
                    fontSize: "11px", fontWeight: 600, color: C.darkBrown,
                    background: C.creamDark, borderRadius: "4px", padding: "4px 10px",
                  }}>
                    + {pt}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

// ── 07. 製品紹介 ──────────────────────────────────────────────
function Products() {
  return (
    <section style={{ background: C.darkBrown, padding: "40px 20px", color: C.cream }}>
      <FadeIn>
        <SectionLabel text="THE HERBS PRODUCTS" light />
        <h2 style={{ fontSize: "20px", fontWeight: 800, color: C.white, lineHeight: 1.45, marginBottom: "4px" }}>
          植物の力を、<br />
          <span style={{ color: C.goldLight }}>そのまま届ける。</span>
        </h2>
        <GoldLine />
        <p style={{ fontSize: "13px", color: "rgba(245,240,232,0.8)", lineHeight: 1.8, marginBottom: "20px" }}>
          THE HERBSは1986年創業の化粧品メーカー。独自の植物美容メソッドをもとに、
          頭皮ケアに特化したプロダクトラインを自社製造しています。
        </p>
      </FadeIn>
      <FadeIn delay={0.1}>
        <img
          src={IMG.product}
          alt="fillis ヘアケアライン"
          style={{ width: "100%", borderRadius: "10px", marginBottom: "20px", objectFit: "cover" }}
        />
        <div style={{
          background: "rgba(201,162,39,0.15)", border: `1px solid rgba(201,162,39,0.4)`,
          borderRadius: "8px", padding: "16px", marginBottom: "20px", textAlign: "center",
        }}>
          <p style={{ fontSize: "11px", color: C.gold, letterSpacing: "0.1em", marginBottom: "4px" }}>
            CUSTOMER SATISFACTION
          </p>
          <p style={{ fontSize: "36px", fontWeight: 900, color: C.gold, lineHeight: 1 }}>
            86.3<span style={{ fontSize: "20px" }}>%</span>
          </p>
          <p style={{ fontSize: "12px", color: "rgba(245,240,232,0.8)", marginTop: "4px" }}>
            顧客満足度（当社調べ）
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            { name: "SHAMPOO LUMIÈRE", desc: "頭皮環境を整えるハーブシャンプー（さらさら仕上げ）" },
            { name: "SHAMPOO LAVER", desc: "皮脂バランスを整えるハーブシャンプー（しっとり仕上げ）" },
            { name: "SCALP ESSENCE LE SÉBUM", desc: "毛穴ケア・皮脂コントロールのスカルプエッセンス" },
            { name: "HAIR ESSENCE THÉRAPIE", desc: "毛先・髪全体を整えるヘアエッセンス" },
            { name: "HAIR OIL RICHE", desc: "ツヤと保湿を与えるヘアオイル" },
          ].map((item, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: "10px",
              padding: "12px 14px", background: "rgba(255,255,255,0.06)",
              borderRadius: "6px", borderLeft: `3px solid ${C.gold}`,
            }}>
              <span style={{
                minWidth: "20px", height: "20px", background: C.gold, color: C.darkBrown,
                borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "10px", fontWeight: 800, flexShrink: 0, marginTop: "1px",
              }}>
                {i + 1}
              </span>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 700, color: C.white, marginBottom: "2px" }}>
                  {item.name}
                </p>
                <p style={{ fontSize: "11px", color: "rgba(245,240,232,0.7)", lineHeight: 1.5 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}

// ── 08. パートナーサポート ────────────────────────────────────
function PartnerSupport() {
  const supports = [
    {
      icon: "A",
      title: "技術・知識サポート",
      items: [
        "頭皮チェック技術の習得（1〜2日）",
        "マイクロスコープの使い方",
        "お客様への説明トーク",
        "植物美容の基礎知識",
      ],
    },
    {
      icon: "B",
      title: "データ・ツールサポート",
      items: [
        "頭皮チェックデータの記録・管理",
        "経過観察レポートのテンプレート",
        "お客様向け説明資料の提供",
      ],
    },
    {
      icon: "C",
      title: "商品・仕入れサポート",
      items: [
        "THE HERBS製品の認定サロン向け提供",
        "新商品情報の優先案内",
        "在庫管理のサポート",
      ],
    },
    {
      icon: "D",
      title: "集客・マーケティング支援",
      items: [
        "認定サロンとしてのロゴ使用権",
        "THE HERBSウェブサイトへの掲載",
        "SNS・集客コンテンツの提供",
      ],
    },
  ];

  return (
    <section style={{ background: C.cream, padding: "40px 20px" }}>
      <FadeIn>
        <SectionLabel text="PARTNER SUPPORT" />
        <h2 style={{ fontSize: "20px", fontWeight: 800, color: C.darkBrown, lineHeight: 1.45, marginBottom: "4px" }}>
          認定パートナーが受けられる<br />
          <span style={{ color: C.gold }}>4つのサポート</span>
        </h2>
        <GoldLine />
      </FadeIn>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {supports.map((s, i) => (
          <FadeIn key={i} delay={i * 0.08}>
            <div style={{
              background: C.white, borderRadius: "10px", padding: "18px 16px",
              border: `1px solid ${C.creamDark}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <span style={{
                  width: "30px", height: "30px", background: C.darkBrown, color: C.gold,
                  borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "13px", fontWeight: 800, flexShrink: 0,
                }}>
                  {s.icon}
                </span>
                <p style={{ fontSize: "15px", fontWeight: 700, color: C.darkBrown }}>
                  {s.title}
                </p>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
                {s.items.map((item, j) => (
                  <li key={j} style={{
                    fontSize: "12px", color: C.textMid, lineHeight: 1.6,
                    paddingLeft: "14px", position: "relative",
                  }}>
                    <span style={{ position: "absolute", left: 0, color: C.gold, fontWeight: 700 }}>+</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

// ── 09. ビフォーアフター（体験談） ────────────────────────────
function Testimonials() {
  const stories = [
    {
      persona: "美容師 / 副業として導入",
      before: "スタイリングに追われ、頭皮ケアまで手が回らない日々。お客様の頭皮トラブルに気づいても対処できなかった。",
      after: "頭皮チェックは5〜10分。既存の施術の前後に組み込めるので、時間の負担がほとんどない。「頭皮の専門家」として他の美容師との差別化もできた。",
    },
    {
      persona: "エステサロン経営者",
      before: "施術メニューが固定化し、客単価が伸び悩んでいた。新しいメニューを増やしたいが、大きな設備投資はできない状況。",
      after: "マイクロスコープ1台から始められた。頭皮チェックをきっかけにホームケア商品の継続販売が生まれ、収益の柱が増えた。",
    },
    {
      persona: "自宅サロン / 起業1年目",
      before: "美容・ヘルスケアで起業したいが、何から始めればいいかわからなかった。リスクを抑えたスタートをしたかった。",
      after: "THE HERBSの認定プログラムで技術と知識を体系的に習得。「頭皮ケアの専門家」という明確なポジションで起業できた。",
    },
  ];

  return (
    <section style={{ background: C.darkBrown, padding: "40px 20px", color: C.cream }}>
      <FadeIn>
        <SectionLabel text="PARTNER STORIES" light />
        <h2 style={{ fontSize: "20px", fontWeight: 800, color: C.white, lineHeight: 1.45, marginBottom: "4px" }}>
          導入後に<br />
          <span style={{ color: C.goldLight }}>変わること</span>
        </h2>
        <GoldLine />
      </FadeIn>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {stories.map((s, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <div>
              <p style={{
                fontSize: "11px", letterSpacing: "0.12em", color: C.gold,
                fontWeight: 700, marginBottom: "10px",
              }}>
                {s.persona}
              </p>
              <div style={{
                background: "rgba(255,255,255,0.06)", borderRadius: "6px",
                padding: "14px 16px", marginBottom: "8px",
                borderLeft: `3px solid ${C.accent}`,
              }}>
                <p style={{ fontSize: "9px", color: C.accent, fontWeight: 700, marginBottom: "6px", letterSpacing: "0.1em" }}>
                  BEFORE
                </p>
                <p style={{ fontSize: "12px", color: "rgba(245,240,232,0.75)", lineHeight: 1.7 }}>
                  {s.before}
                </p>
              </div>
              <div style={{
                background: "rgba(201,162,39,0.1)", borderRadius: "6px",
                padding: "14px 16px", borderLeft: `3px solid ${C.gold}`,
              }}>
                <p style={{ fontSize: "9px", color: C.gold, fontWeight: 700, marginBottom: "6px", letterSpacing: "0.1em" }}>
                  AFTER
                </p>
                <p style={{ fontSize: "12px", color: "rgba(245,240,232,0.9)", lineHeight: 1.7 }}>
                  {s.after}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

// ── 10. 最終CTA ───────────────────────────────────────────────
function FinalCTA() {
  return (
    <section style={{ background: C.cream }}>
      <div style={{ padding: "40px 20px 32px" }}>
        <FadeIn>
          <SectionLabel text="NEXT STEP" />
          <h2 style={{ fontSize: "22px", fontWeight: 800, color: C.darkBrown, lineHeight: 1.45, marginBottom: "8px" }}>
            まずは、<br />
            <span style={{ color: C.gold }}>体験してみてください。</span>
          </h2>
          <p style={{ fontSize: "13px", color: C.textMid, lineHeight: 1.8, marginBottom: "28px" }}>
            収益の仕組み・卸価格・初期費用・認定プログラムの詳細は、
            オンライン説明会でくわしくご説明します。
            まずはお気軽にご参加ください。営業は一切ありません。
          </p>

          {/* 説明会・体験会の違い */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
            {[
              {
                label: "オンライン説明会",
                detail: "Zoom（無料）\n約60分\nプログラム詳細・Q&A",
                color: C.gold,
                url: SEMINAR_URL,
                cta: "説明会に参加する",
              },
              {
                label: "神戸 体験会",
                detail: "神戸（対面・無料）\n約90分\n実際の施術を体験",
                color: C.goldLight,
                url: TRIAL_URL,
                cta: "体験会に参加する",
              },
            ].map((item, i) => (
              <div key={i} style={{
                flex: 1, background: C.white, borderRadius: "10px",
                padding: "18px 14px", border: `1px solid ${C.creamDark}`,
                borderTop: `3px solid ${item.color}`,
              }}>
                <p style={{ fontSize: "13px", fontWeight: 700, color: C.darkBrown, marginBottom: "8px" }}>
                  {item.label}
                </p>
                <p style={{ fontSize: "11px", color: C.textMid, lineHeight: 1.7, whiteSpace: "pre-line", marginBottom: "14px" }}>
                  {item.detail}
                </p>
                <a href={item.url} target="_blank" rel="noopener noreferrer" style={{
                  display: "block", background: C.darkBrown, color: C.gold,
                  textAlign: "center", padding: "11px 8px", borderRadius: "4px",
                  fontWeight: 700, fontSize: "11px", textDecoration: "none",
                  letterSpacing: "0.03em",
                }}>
                  {item.cta}
                </a>
              </div>
            ))}
          </div>

          {/* LINEボタン */}
          <a href={LINE_URL} target="_blank" rel="noopener noreferrer" style={{
            display: "block", background: "#06C755", color: C.white,
            textAlign: "center", padding: "16px 20px", borderRadius: "6px",
            fontWeight: 700, fontSize: "15px", textDecoration: "none",
            letterSpacing: "0.04em", marginBottom: "12px",
          }}>
            LINEで気軽に相談する（無料）
          </a>
          <p style={{ fontSize: "11px", color: C.accent, textAlign: "center", lineHeight: 1.6 }}>
            疑問・不安はLINEでもお気軽にどうぞ。
          </p>
        </FadeIn>
      </div>

      {/* 会社情報 */}
      <div style={{
        padding: "24px 20px 32px",
        borderTop: `1px solid ${C.creamDark}`,
      }}>
        <p style={{ fontSize: "11px", color: C.accent, marginBottom: "8px", letterSpacing: "0.1em" }}>
          ABOUT THE HERBS
        </p>
        <p style={{ fontSize: "13px", color: C.darkBrown, fontWeight: 700, marginBottom: "6px" }}>
          株式会社 THE HERBS
        </p>
        <p style={{ fontSize: "11px", color: C.textMid, lineHeight: 1.8 }}>
          1986年創業の化粧品メーカー。植物美容の研究と独自メソッドの開発を続け、
          頭皮ケアサロン「スカルプラボ」を神戸で運営。
          美容室・エステサロン・代理店向けの卸販売・技術講習も行っています。
        </p>
        <div style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
          <a href={LINE_URL} target="_blank" rel="noopener noreferrer" style={{
            fontSize: "11px", color: C.gold, textDecoration: "none",
            borderBottom: `1px solid rgba(201,162,39,0.4)`, paddingBottom: "1px",
          }}>
            LINE公式アカウント
          </a>
          <a href="https://scalp-labo.jp" target="_blank" rel="noopener noreferrer" style={{
            fontSize: "11px", color: C.gold, textDecoration: "none",
            borderBottom: `1px solid rgba(201,162,39,0.4)`, paddingBottom: "1px",
          }}>
            オフィシャルサイト
          </a>
        </div>
      </div>
    </section>
  );
}

// ── メインコンポーネント ──────────────────────────────────────
export default function PartnerDoc() {
  return (
    <div style={{
      maxWidth: "480px",
      margin: "0 auto",
      fontFamily: "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif",
      paddingBottom: "80px",
    }}>
      <Hero />
      <EmpathySection />
      <ScalpCheckJoy />
      <MarketOpportunity />
      <BusinessModel />
      <WhoIsItFor />
      <Products />
      <PartnerSupport />
      <Testimonials />
      <FinalCTA />
      <FloatingCTA />
    </div>
  );
}
