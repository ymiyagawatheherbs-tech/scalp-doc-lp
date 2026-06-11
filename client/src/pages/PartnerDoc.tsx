/*
 * スカルプラボ パートナー資料 — 配布用LP（第2版）
 * URL: /partner-doc
 * カラー: BOTANICAL CHARM（/bookingと同系統の明るいナチュラル系）
 * テーマ: 見ることの必要性 × 15年の実績 × サブスク型ビジネス
 */

import { useState, useEffect, useRef } from "react";

// ── カラー定数（/bookingと同系統・明るいナチュラル） ──────────
const C = {
  bg: "#F5EDE3",          // クリームホワイト（背景）
  bgCard: "#FFFFFF",      // カード背景
  bgSub: "#F0EBE3",       // サブ背景
  bgSelected: "#EAF0E9",  // 選択済み背景
  bgDark: "#4A5240",      // ダークグリーン（アクセントセクション）
  green: "#707862",       // ディープグリーン（メインテキスト・ボタン）
  greenDark: "#4A5240",   // ダークグリーン
  greenLight: "#8A9B7A",  // ミディアムグリーン
  sage: "#A9C0A6",        // セージグリーン（アクセント）
  sageLight: "#C5D3C4",   // ライトグリーン
  border: "#DDD5CC",      // グレージュ（ボーダー）
  text: "#3D3D2E",        // メインテキスト
  textSub: "#6B6B5A",     // サブテキスト
  textMuted: "#9A9A88",   // ミュートテキスト
  gold: "#B8962E",        // ゴールド（強調）
  white: "#FFFFFF",
};

// ── URL定数 ──────────────────────────────────────────────────
const LINE_URL = "https://lin.ee/pDZf3jg";
const SEMINAR_URL = "https://liff.line.me/2010327961-qbWcOTRL?liff_id=2010327961-qbWcOTRL&group_id=176576";
const TRIAL_URL = "https://liff.line.me/2010327961-qbWcOTRL?liff_id=2010327961-qbWcOTRL&group_id=184188";

// ── 画像URL ──────────────────────────────────────────────────
const IMG = {
  hero: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/hero-main-7WiQYuuxpMEgAPgcyJcPik.webp",
  microscopeCheck: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/scalp_microscope_real_722e5749.jpg",
  herbSteamer: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/herb_steamer_8218d07e.jpg",
  consultation: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/consultation-oBRbvf7238DM5fVXz4vLdS.webp",
  scalpMicro: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/scalp_check_real_8dbe88ff.png",
  product: "https://d2xsxph8kpxj0f.cloudfront.net/310519663471357598/VaHDAviEx4gwhk9t9bxo5K/herb_bottles_b7827e42.jpg",
};

// ── スクロールアニメーション ──────────────────────────────────
function useInView(threshold = 0.12) {
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

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

// ── 共通UI ────────────────────────────────────────────────────
function SectionLabel({ text, dark = false }: { text: string; dark?: boolean }) {
  return (
    <p style={{
      fontSize: "9px", letterSpacing: "0.22em", fontWeight: 700,
      color: dark ? C.sage : C.greenLight,
      marginBottom: "8px", textTransform: "uppercase",
    }}>
      {text}
    </p>
  );
}

function GreenLine() {
  return <div style={{ width: "32px", height: "2px", background: C.sage, margin: "10px 0 18px" }} />;
}

function Tag({ text }: { text: string }) {
  return (
    <span style={{
      display: "inline-block", fontSize: "10px", fontWeight: 600,
      color: C.green, background: C.bgSelected, borderRadius: "3px",
      padding: "3px 9px", marginRight: "6px", marginBottom: "4px",
    }}>
      {text}
    </span>
  );
}

// ── フローティングCTA ─────────────────────────────────────────
function FloatingCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0,
      background: C.bgCard, borderTop: `2px solid ${C.sage}`,
      padding: "10px 16px", display: "flex", gap: "8px", zIndex: 100,
      boxShadow: "0 -4px 20px rgba(112,120,98,0.18)",
    }}>
      <a href={SEMINAR_URL} target="_blank" rel="noopener noreferrer" style={{
        flex: 1, display: "block", background: C.green, color: C.white,
        textAlign: "center", padding: "13px 8px", borderRadius: "4px",
        fontWeight: 700, fontSize: "13px", textDecoration: "none", letterSpacing: "0.03em",
      }}>
        説明会に参加する（無料）
      </a>
      <a href={TRIAL_URL} target="_blank" rel="noopener noreferrer" style={{
        flex: 1, display: "block", background: "transparent", color: C.green,
        textAlign: "center", padding: "13px 8px", borderRadius: "4px",
        fontWeight: 700, fontSize: "13px", textDecoration: "none",
        border: `1.5px solid ${C.sage}`, letterSpacing: "0.03em",
      }}>
        神戸で体験する（無料）
      </a>
    </div>
  );
}

// ── 01. ヒーロー ──────────────────────────────────────────────
function Hero() {
  return (
    <section style={{ position: "relative", background: C.bgDark, overflow: "hidden" }}>
      <img
        src={IMG.hero}
        alt="頭皮チェックの様子"
        style={{ width: "100%", height: "320px", objectFit: "cover", display: "block", opacity: 0.55 }}
      />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(74,82,64,0.2) 0%, rgba(74,82,64,0.75) 60%, rgba(74,82,64,1) 100%)",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        padding: "0 20px 28px",
      }}>
        <p style={{ fontSize: "9px", letterSpacing: "0.25em", color: C.sage, fontWeight: 700, marginBottom: "10px" }}>
          SCALP LABO — PARTNER DOCUMENT
        </p>
        <h1 style={{ fontSize: "25px", fontWeight: 800, color: C.white, lineHeight: 1.45, marginBottom: "10px" }}>
          頭皮を「見る」ことが、<br />
          <span style={{ color: C.sageLight }}>髪の未来を変える。</span>
        </h1>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.82)", lineHeight: 1.8 }}>
          毎日洗っていても汚れは溜まる。<br />
          毎日磨いていても歯垢は溜まる。<br />
          頭皮も同じ。定期的に「見る」習慣が、<br />
          10年後の髪を守ります。
        </p>
        <div style={{ marginTop: "20px", display: "flex", gap: "8px" }}>
          <a href={SEMINAR_URL} target="_blank" rel="noopener noreferrer" style={{
            flex: 1, background: C.sage, color: C.white, textAlign: "center",
            padding: "14px 10px", borderRadius: "4px", fontWeight: 700, fontSize: "13px",
            textDecoration: "none", letterSpacing: "0.03em",
          }}>
            説明会に参加する（無料）
          </a>
          <a href={LINE_URL} target="_blank" rel="noopener noreferrer" style={{
            flex: 1, background: "transparent", color: C.sageLight, textAlign: "center",
            padding: "14px 10px", borderRadius: "4px", fontWeight: 700, fontSize: "13px",
            textDecoration: "none", border: `1.5px solid ${C.sage}`, letterSpacing: "0.03em",
          }}>
            LINEで相談する
          </a>
        </div>
      </div>
    </section>
  );
}

// ── 02. 「見ることの必要性」 ──────────────────────────────────
function WhyLook() {
  return (
    <section style={{ background: C.bg, padding: "40px 20px" }}>
      <FadeIn>
        <SectionLabel text="WHY WE NEED TO LOOK" />
        <h2 style={{ fontSize: "21px", fontWeight: 800, color: C.text, lineHeight: 1.45, marginBottom: "4px" }}>
          毎日ケアしていても、<br />
          <span style={{ color: C.green }}>問題は静かに進んでいる。</span>
        </h2>
        <GreenLine />

        {/* 3つの比較 */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
          {[
            {
              icon: "01",
              title: "歯の場合",
              body: "毎日歯磨きしていても、歯垢・歯石は溜まります。だから歯科の定期検診が当たり前になりました。",
              status: "定期検診：当たり前",
              ok: true,
            },
            {
              icon: "02",
              title: "肌の場合",
              body: "毎日洗顔していても、毛穴の汚れや角質は残ります。だからエステの定期ケアが普及しました。",
              status: "定期ケア：普及中",
              ok: true,
            },
            {
              icon: "03",
              title: "頭皮の場合",
              body: "毎日シャンプーしていても、皮脂・角質・汚れは蓄積します。でも頭皮の定期チェックは、まだほとんど普及していません。",
              status: "定期チェック：まだほぼゼロ",
              ok: false,
            },
          ].map((item, i) => (
            <div key={i} style={{
              background: C.bgCard, borderRadius: "8px", padding: "16px",
              border: `1px solid ${C.border}`,
              borderLeft: `3px solid ${item.ok ? C.sage : C.gold}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <span style={{ fontSize: "12px", fontWeight: 800, color: item.ok ? C.sage : C.gold, letterSpacing: "0.05em", minWidth: "24px" }}>{item.icon}</span>
                <p style={{ fontSize: "14px", fontWeight: 700, color: C.text }}>{item.title}</p>
                <span style={{
                  marginLeft: "auto", fontSize: "10px", fontWeight: 700,
                  color: item.ok ? C.green : C.gold,
                  background: item.ok ? C.bgSelected : "#FFF8E6",
                  borderRadius: "3px", padding: "3px 8px", flexShrink: 0,
                }}>
                  {item.status}
                </span>
              </div>
              <p style={{ fontSize: "12px", color: C.textSub, lineHeight: 1.75 }}>{item.body}</p>
            </div>
          ))}
        </div>

        <div style={{
          background: C.bgSelected, borderRadius: "8px", padding: "18px",
          border: `1px solid ${C.sage}`,
        }}>
          <p style={{ fontSize: "14px", color: C.text, fontWeight: 700, lineHeight: 1.7, marginBottom: "6px" }}>
            頭皮チェックの習慣化は、<br />
            <span style={{ color: C.green }}>今がまさに「始まり」のタイミング。</span>
          </p>
          <p style={{ fontSize: "12px", color: C.textSub, lineHeight: 1.75 }}>
            薄毛・抜け毛・頭皮トラブルは、気になり始めたときにはすでに進行しています。
            「なってから対処」ではなく、「なる前に気づく」。
            それが頭皮の定期チェックが持つ本質的な価値です。
          </p>
        </div>
      </FadeIn>
    </section>
  );
}

// ── 03. マイクロスコープで「見える化」 ───────────────────────
function SeeWithMicroscope() {
  return (
    <section style={{ background: C.bgSub, padding: "40px 20px" }}>
      <FadeIn>
        <SectionLabel text="THE POWER OF SEEING" />
        <h2 style={{ fontSize: "21px", fontWeight: 800, color: C.text, lineHeight: 1.45, marginBottom: "4px" }}>
          「見る」だけで、<br />
          <span style={{ color: C.green }}>お客様の意識が変わる。</span>
        </h2>
        <GreenLine />
      </FadeIn>

      <FadeIn delay={0.1}>
        <img
          src={IMG.microscopeCheck}
          alt="マイクロスコープによる頭皮チェック"
          style={{ width: "100%", height: "220px", objectFit: "cover", borderRadius: "8px", marginBottom: "18px" }}
        />
        <p style={{ fontSize: "13px", color: C.textSub, lineHeight: 1.85, marginBottom: "20px" }}>
          マイクロスコープで自分の頭皮を初めて見たとき、多くの方が
          <strong style={{ color: C.text }}>「こんなになってたの！」</strong>と驚きます。
          毎日シャンプーしているのに、毛穴に皮脂が詰まっていたり、
          炎症の跡があったり——目に見えない問題が、見えた瞬間に「ケアしたい」という気持ちが自然に生まれます。
        </p>

        {/* チェックで分かること */}
        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontSize: "11px", color: C.greenLight, letterSpacing: "0.15em", fontWeight: 700, marginBottom: "12px" }}>
            定期チェックで分かること
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              "毛穴の詰まり・皮脂の蓄積状態",
              "頭皮の炎症・乾燥・脂性のバランス",
              "毛根の太さ・健康状態",
              "前回との比較による変化の把握",
              "ケアの効果の可視化（続けるモチベーションに）",
            ].map((item, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: "10px",
                padding: "10px 14px", background: C.bgCard, borderRadius: "6px",
                border: `1px solid ${C.border}`,
              }}>
                <span style={{
                  minWidth: "18px", height: "18px", background: C.sage, color: C.white,
                  borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "9px", fontWeight: 800, flexShrink: 0, marginTop: "1px",
                }}>
                  +
                </span>
                <p style={{ fontSize: "12px", color: C.text, lineHeight: 1.6 }}>{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: C.bgCard, borderRadius: "8px", padding: "16px",
          border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.sage}`,
        }}>
          <p style={{ fontSize: "12px", color: C.text, fontWeight: 700, marginBottom: "4px" }}>
            チェック時間：約5〜10分
          </p>
          <p style={{ fontSize: "12px", color: C.textSub, lineHeight: 1.7 }}>
            痛みも不快感もなし。施術の前後に組み込めるので、
            既存のメニューへの追加もスムーズです。
          </p>
        </div>
      </FadeIn>
    </section>
  );
}

// ── 04. 15年の実績 ────────────────────────────────────────────
function TrackRecord() {
  return (
    <section style={{ background: C.bgDark, padding: "40px 20px", color: C.white }}>
      <FadeIn>
        <SectionLabel text="15 YEARS OF EXPERTISE" dark />
        <h2 style={{ fontSize: "21px", fontWeight: 800, color: C.white, lineHeight: 1.45, marginBottom: "4px" }}>
          15年のノウハウを、<br />
          <span style={{ color: C.sageLight }}>惜しみなく提供します。</span>
        </h2>
        <GreenLine />
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)", lineHeight: 1.85, marginBottom: "24px" }}>
          THE HERBSは2009年より頭皮ケアに特化した研究と施術を続けてきました。
          神戸阪急店・直営サロンでの頭皮チェックデータを蓄積し、
          独自の植物美容メソッドを体系化。そのすべてをパートナーに提供します。
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        {/* 実績数値 */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          {[
            { value: "15年", label: "頭皮ケア専門の実績" },
            { value: "2,200名+", label: "頭皮チェック体験者" },
            { value: "86.3%", label: "顧客満足度（当社調べ）" },
          ].map((stat, i) => (
            <div key={i} style={{
              flex: 1, textAlign: "center", padding: "14px 6px",
              background: "rgba(255,255,255,0.08)", borderRadius: "6px",
              border: `1px solid rgba(169,192,166,0.3)`,
            }}>
              <p style={{ fontSize: "20px", fontWeight: 800, color: C.sageLight, lineHeight: 1.1, marginBottom: "4px" }}>
                {stat.value}
              </p>
              <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.65)", lineHeight: 1.4 }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* 提供するノウハウ */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {[
            {
              title: "頭皮チェックの技術・判定基準",
              body: "マイクロスコープの使い方から、頭皮状態の見方・判定・お客様への説明まで。15年の現場経験から体系化したプロトコルをそのまま提供します。",
            },
            {
              title: "植物美容の知識・成分エビデンス",
              body: "ローズマリー・ヘンプシード・ハーブエキスなど、植物成分の学術的根拠に基づいたケア提案ができるようになります。「なぜこのケアが必要か」を科学的に説明できる力がつきます。",
            },
            {
              title: "お客様への伝え方・コミュニケーション",
              body: "「怖い話」ではなく「安心できる話」として伝えるトーク術。頭皮の状態を正直に伝えながら、お客様が前向きにケアに取り組めるコミュニケーション方法を習得できます。",
            },
          ].map((item, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.07)", borderRadius: "8px",
              padding: "16px", border: `1px solid rgba(169,192,166,0.25)`,
            }}>
              <p style={{ fontSize: "13px", fontWeight: 700, color: C.white, marginBottom: "6px" }}>
                {item.title}
              </p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)", lineHeight: 1.75 }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}

// ── 05. サブスク型ビジネスモデル ─────────────────────────────
function SubscriptionModel() {
  return (
    <section style={{ background: C.bg, padding: "40px 20px" }}>
      <FadeIn>
        <SectionLabel text="SUBSCRIPTION BUSINESS MODEL" />
        <h2 style={{ fontSize: "21px", fontWeight: 800, color: C.text, lineHeight: 1.45, marginBottom: "4px" }}>
          「売る事業」ではなく、<br />
          <span style={{ color: C.green }}>「習慣をつくる事業」</span>
        </h2>
        <GreenLine />
        <p style={{ fontSize: "13px", color: C.textSub, lineHeight: 1.85, marginBottom: "22px" }}>
          歯科の定期検診モデルを、頭皮ケアで実現します。
          お客様が「また来たい」と思う仕組みが、
          安定したサブスク型の収益基盤をつくります。
        </p>
      </FadeIn>

      {/* サブスクの流れ図 */}
      <FadeIn delay={0.1}>
        <div style={{ marginBottom: "24px" }}>
          {[
            {
              step: "1",
              title: "定期チェックで来店（月1〜2回）",
              body: "「また来なきゃ」ではなく「また来たい」という関係性。頭皮の変化を一緒に確認することで、お客様との信頼が深まります。",
              tag: "リピート率 × 安定来店",
              color: C.sage,
            },
            {
              step: "2",
              title: "問題が見つかれば施術へ",
              body: "歯医者の「虫歯治療」と同じ。チェックで問題が見つかった方への施術は、ニーズが明確なので提案がスムーズ。美容師でも対応できます。",
              tag: "高成約率 × 高単価",
              color: C.greenLight,
            },
            {
              step: "3",
              title: "ホームケア商品の継続購入",
              body: "施術で信頼を得たお客様が、そのままホームケア商品を継続購入。「先生に勧められたから」という強い動機で、解約率が低い。",
              tag: "ストック収益 × 低解約率",
              color: C.gold,
            },
          ].map((p, i) => (
            <div key={i} style={{ display: "flex", gap: "0", marginBottom: i < 2 ? "0" : "0" }}>
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                marginRight: "14px", flexShrink: 0,
              }}>
                <div style={{
                  width: "34px", height: "34px", background: p.color, color: C.white,
                  borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "15px", fontWeight: 800, flexShrink: 0,
                }}>
                  {p.step}
                </div>
                {i < 2 && (
                  <div style={{ width: "2px", flex: 1, background: C.border, minHeight: "32px", marginTop: "4px" }} />
                )}
              </div>
              <div style={{ paddingBottom: i < 2 ? "20px" : "0" }}>
                <p style={{ fontSize: "14px", fontWeight: 700, color: C.text, marginBottom: "6px", marginTop: "6px" }}>
                  {p.title}
                </p>
                <p style={{ fontSize: "12px", color: C.textSub, lineHeight: 1.75, marginBottom: "8px" }}>
                  {p.body}
                </p>
                <Tag text={p.tag} />
              </div>
            </div>
          ))}
        </div>

        {/* 収益イメージ */}
        <div style={{
          background: C.bgCard, borderRadius: "10px", padding: "18px 16px",
          border: `1px solid ${C.border}`, borderTop: `3px solid ${C.sage}`,
        }}>
          <p style={{ fontSize: "10px", color: C.greenLight, letterSpacing: "0.15em", marginBottom: "12px", fontWeight: 700 }}>
            REVENUE STRUCTURE
          </p>
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { label: "定期チェック", value: "月4〜8名〜", sub: "安定収益の土台" },
              { label: "施術", value: "都度対応", sub: "高単価メニュー" },
              { label: "物販", value: "継続購入", sub: "ストック収益" },
            ].map((r, i) => (
              <div key={i} style={{
                flex: 1, textAlign: "center", padding: "12px 6px",
                background: C.bgSelected, borderRadius: "6px",
              }}>
                <p style={{ fontSize: "9px", color: C.greenLight, letterSpacing: "0.08em", marginBottom: "4px" }}>
                  {r.label}
                </p>
                <p style={{ fontSize: "12px", fontWeight: 700, color: C.text, marginBottom: "3px" }}>
                  {r.value}
                </p>
                <p style={{ fontSize: "10px", color: C.textMuted, lineHeight: 1.4 }}>
                  {r.sub}
                </p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: "10px", color: C.textMuted, marginTop: "10px", textAlign: "center" }}>
            ※収益は個人の活動状況により異なります
          </p>
        </div>
      </FadeIn>
    </section>
  );
}

// ── 06. 市場の空白地帯 ────────────────────────────────────────
function MarketOpportunity() {
  return (
    <section style={{ background: C.bgSub, padding: "40px 20px" }}>
      <FadeIn>
        <SectionLabel text="BLUE OCEAN MARKET" />
        <h2 style={{ fontSize: "21px", fontWeight: 800, color: C.text, lineHeight: 1.45, marginBottom: "4px" }}>
          美容業界は飽和。<br />
          <span style={{ color: C.green }}>でも頭皮ケアは空白地帯。</span>
        </h2>
        <GreenLine />
      </FadeIn>

      <FadeIn delay={0.1}>
        {/* ポジショニング */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
          {[
            { label: "美容室", desc: "スタイリング\nカラー・パーマ", highlight: false },
            { label: "THE HERBS\nSCALP LABO", desc: "頭皮の定期チェック\n＋ケアの習慣化", highlight: true },
            { label: "医療機関", desc: "薬・治療\n皮膚科・病院", highlight: false },
          ].map((p, i) => (
            <div key={i} style={{
              flex: 1, background: p.highlight ? C.green : C.bgCard,
              borderRadius: "8px", padding: "14px 10px", textAlign: "center",
              border: p.highlight ? `2px solid ${C.sage}` : `1px solid ${C.border}`,
            }}>
              {p.highlight && (
                <p style={{ fontSize: "8px", color: C.sageLight, marginBottom: "4px", letterSpacing: "0.1em", fontWeight: 700 }}>
                  ここに参入
                </p>
              )}
              <p style={{
                fontSize: "11px", fontWeight: 700,
                color: p.highlight ? C.white : C.text,
                lineHeight: 1.4, whiteSpace: "pre-line", marginBottom: "6px",
              }}>
                {p.label}
              </p>
              <p style={{
                fontSize: "10px",
                color: p.highlight ? "rgba(255,255,255,0.8)" : C.textSub,
                lineHeight: 1.5, whiteSpace: "pre-line",
              }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>

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
              background: C.bgCard, borderRadius: "8px", padding: "16px",
              border: `1px solid ${C.border}`, borderLeft: `3px solid ${C.sage}`,
            }}>
              <p style={{ fontSize: "10px", color: C.greenLight, letterSpacing: "0.1em", marginBottom: "4px", fontWeight: 700 }}>
                {s.label}
              </p>
              <p style={{ fontSize: "22px", fontWeight: 800, color: C.text, marginBottom: "6px" }}>
                {s.value}
              </p>
              <p style={{ fontSize: "12px", color: C.textSub, lineHeight: 1.7 }}>{s.desc}</p>
              <p style={{ fontSize: "10px", color: C.textMuted, marginTop: "6px" }}>※{s.source}</p>
            </div>
          ))}
        </div>

        <div style={{
          background: C.green, borderRadius: "8px", padding: "18px",
          textAlign: "center",
        }}>
          <p style={{ fontSize: "13px", color: C.white, fontWeight: 700, lineHeight: 1.7 }}>
            「頭皮の定期チェック」を習慣として<br />
            提供できるのは、<span style={{ color: C.sageLight }}>今のところほぼあなただけです。</span>
          </p>
        </div>
      </FadeIn>
    </section>
  );
}

// ── 07. こんな方に向いている ──────────────────────────────────
function WhoIsItFor() {
  const profiles = [
    {
      title: "エステサロン・ヘッドスパ店",
      body: "すでに頭部のケアを提供している方。頭皮チェックを加えることで専門性が高まり、客単価・リピート率の向上が見込めます。",
      points: ["既存メニューへの自然な追加", "客単価アップ", "リピート率向上"],
    },
    {
      title: "美容師（副業・起業を考えている方）",
      body: "スタイリングに集中したい美容師にとって、頭皮ケアは時間的に難しい。でも頭皮チェックは5〜10分。問題が見つかった方への施術は美容師でも対応できます。",
      points: ["5〜10分で完結するチェック", "差別化・専門性の確立", "副業・独立の第一歩に"],
    },
    {
      title: "自宅サロン・個人事業主",
      body: "マイクロスコープ1台から始められます。THE HERBSのブランド・技術・サポートを活用して、リスクを抑えたスタートが可能です。",
      points: ["小スペース・低投資で開始", "認定サロンとして集客", "THE HERBSブランドを活用"],
    },
    {
      title: "これから起業を考えている方",
      body: "「頭皮ケアの専門家」という明確なポジションで、競合がほぼいない市場に参入できます。チョコザップ等の施設への出張チェックという展開も視野に。",
      points: ["明確なポジション", "ブルーオーシャン市場", "出張チェックにも対応"],
    },
  ];

  return (
    <section style={{ background: C.bg, padding: "40px 20px" }}>
      <FadeIn>
        <SectionLabel text="WHO IS THIS FOR?" />
        <h2 style={{ fontSize: "21px", fontWeight: 800, color: C.text, lineHeight: 1.45, marginBottom: "4px" }}>
          こんな方と<br />
          <span style={{ color: C.green }}>一緒に取り組みたい</span>
        </h2>
        <GreenLine />
      </FadeIn>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {profiles.map((p, i) => (
          <FadeIn key={i} delay={i * 0.07}>
            <div style={{
              background: C.bgCard, borderRadius: "10px", padding: "18px 16px",
              border: `1px solid ${C.border}`, borderTop: `3px solid ${C.sage}`,
            }}>
              <p style={{ fontSize: "14px", fontWeight: 800, color: C.text, marginBottom: "8px" }}>
                {p.title}
              </p>
              <p style={{ fontSize: "12px", color: C.textSub, lineHeight: 1.8, marginBottom: "10px" }}>
                {p.body}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {p.points.map((pt, j) => (
                  <Tag key={j} text={`+ ${pt}`} />
                ))}
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}

// ── 08. パートナーサポート ────────────────────────────────────
function PartnerSupport() {
  return (
    <section style={{ background: C.bgSub, padding: "40px 20px" }}>
      <FadeIn>
        <SectionLabel text="PARTNER SUPPORT" />
        <h2 style={{ fontSize: "21px", fontWeight: 800, color: C.text, lineHeight: 1.45, marginBottom: "4px" }}>
          認定パートナーが受けられる<br />
          <span style={{ color: C.green }}>4つのサポート</span>
        </h2>
        <GreenLine />
      </FadeIn>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {[
          {
            icon: "A",
            title: "技術・知識サポート",
            items: [
              "頭皮チェック技術の習得（1〜2日）",
              "マイクロスコープの使い方",
              "お客様への説明トーク・コミュニケーション",
              "植物美容の基礎知識・成分エビデンス",
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
        ].map((s, i) => (
          <FadeIn key={i} delay={i * 0.07}>
            <div style={{
              background: C.bgCard, borderRadius: "10px", padding: "16px",
              border: `1px solid ${C.border}`,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <span style={{
                  width: "28px", height: "28px", background: C.green, color: C.white,
                  borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "12px", fontWeight: 800, flexShrink: 0,
                }}>
                  {s.icon}
                </span>
                <p style={{ fontSize: "14px", fontWeight: 700, color: C.text }}>{s.title}</p>
              </div>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "5px" }}>
                {s.items.map((item, j) => (
                  <li key={j} style={{
                    fontSize: "12px", color: C.textSub, lineHeight: 1.6,
                    paddingLeft: "14px", position: "relative",
                  }}>
                    <span style={{ position: "absolute", left: 0, color: C.sage, fontWeight: 700 }}>+</span>
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

// ── 09. お客様への伝え方（安心感） ───────────────────────────
function CustomerMessage() {
  return (
    <section style={{ background: C.bgDark, padding: "40px 20px", color: C.white }}>
      <FadeIn>
        <SectionLabel text="WHAT TO TELL YOUR CUSTOMERS" dark />
        <h2 style={{ fontSize: "21px", fontWeight: 800, color: C.white, lineHeight: 1.45, marginBottom: "4px" }}>
          お客様に伝えること：<br />
          <span style={{ color: C.sageLight }}>「不安」ではなく「安心」</span>
        </h2>
        <GreenLine />
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)", lineHeight: 1.85, marginBottom: "22px" }}>
          頭皮チェックは「怖いもの」ではありません。
          「今の状態を知ることで、これからのケアが変わる」という前向きなメッセージが大切です。
        </p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {[
            {
              q: "「見て何かわかるの？」",
              a: "毛穴の詰まり、炎症の有無、毛根の状態が分かります。毎日シャンプーしていても、見えない汚れは溜まっています。まず「今の状態」を知ることが大切です。",
            },
            {
              q: "「何か問題があったら怖い」",
              a: "問題が早期に分かれば、早めに対処できます。薄毛や頭皮トラブルは、気になり始めたときにはすでに進行していることが多い。だからこそ定期的に「見る」ことが安心につながります。",
            },
            {
              q: "「続けないといけないの？」",
              a: "歯科の定期検診と同じです。「来なければいけない」ではなく、「来ることで安心できる」という関係性をつくります。お客様が自分から「また来たい」と思う仕組みです。",
            },
          ].map((item, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.07)", borderRadius: "8px", padding: "16px",
              border: `1px solid rgba(169,192,166,0.25)`,
            }}>
              <p style={{ fontSize: "13px", fontWeight: 700, color: C.sageLight, marginBottom: "8px" }}>
                {item.q}
              </p>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.8)", lineHeight: 1.75 }}>
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}

// ── 10. 最終CTA ───────────────────────────────────────────────
function FinalCTA() {
  return (
    <section style={{ background: C.bg }}>
      <div style={{ padding: "40px 20px 32px" }}>
        <FadeIn>
          <SectionLabel text="NEXT STEP" />
          <h2 style={{ fontSize: "22px", fontWeight: 800, color: C.text, lineHeight: 1.45, marginBottom: "8px" }}>
            まずは、<br />
            <span style={{ color: C.green }}>体験してみてください。</span>
          </h2>
          <p style={{ fontSize: "13px", color: C.textSub, lineHeight: 1.85, marginBottom: "26px" }}>
            収益の仕組み・卸価格・初期費用・認定プログラムの詳細は、
            オンライン説明会でくわしくご説明します。
            営業は一切ありません。まずはお気軽にどうぞ。
          </p>

          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            {[
              {
                label: "オンライン説明会",
                detail: "Zoom（無料）\n約60分\nプログラム詳細・Q&A",
                url: SEMINAR_URL,
                cta: "説明会に参加する",
                primary: true,
              },
              {
                label: "神戸 現地体験会",
                detail: "兵庫県神戸市灘区（対面・無料）\n約90分\n実際の施術を体験",
                url: TRIAL_URL,
                cta: "体験会に参加する",
                primary: false,
              },
            ].map((item, i) => (
              <div key={i} style={{
                flex: 1, background: C.bgCard, borderRadius: "10px",
                padding: "16px 12px", border: `1px solid ${C.border}`,
                borderTop: `3px solid ${item.primary ? C.sage : C.sageLight}`,
              }}>
                <p style={{ fontSize: "12px", fontWeight: 700, color: C.text, marginBottom: "6px" }}>
                  {item.label}
                </p>
                <p style={{ fontSize: "11px", color: C.textSub, lineHeight: 1.7, whiteSpace: "pre-line", marginBottom: "12px" }}>
                  {item.detail}
                </p>
                <a href={item.url} target="_blank" rel="noopener noreferrer" style={{
                  display: "block", background: item.primary ? C.green : "transparent",
                  color: item.primary ? C.white : C.green,
                  textAlign: "center", padding: "10px 8px", borderRadius: "4px",
                  fontWeight: 700, fontSize: "11px", textDecoration: "none",
                  border: item.primary ? "none" : `1.5px solid ${C.sage}`,
                  letterSpacing: "0.03em",
                }}>
                  {item.cta}
                </a>
              </div>
            ))}
          </div>

          <a href={LINE_URL} target="_blank" rel="noopener noreferrer" style={{
            display: "block", background: "#06C755", color: C.white,
            textAlign: "center", padding: "16px 20px", borderRadius: "6px",
            fontWeight: 700, fontSize: "15px", textDecoration: "none",
            letterSpacing: "0.04em", marginBottom: "10px",
          }}>
            LINEで気軽に相談する（無料）
          </a>
          <p style={{ fontSize: "11px", color: C.textMuted, textAlign: "center", lineHeight: 1.6 }}>
            疑問・不安はLINEでもお気軽にどうぞ。
          </p>
        </FadeIn>
      </div>

      <div style={{ padding: "20px 20px 32px", borderTop: `1px solid ${C.border}` }}>
        <p style={{ fontSize: "11px", color: C.textMuted, marginBottom: "6px", letterSpacing: "0.1em" }}>
          ABOUT THE HERBS
        </p>
        <p style={{ fontSize: "13px", color: C.text, fontWeight: 700, marginBottom: "6px" }}>
          株式会社 THE HERBS
        </p>
        <p style={{ fontSize: "11px", color: C.textSub, lineHeight: 1.8 }}>
          植物美容の研究と独自メソッドの開発を続け、
          頭皮ケアサロン「スカルプラボ」を神戸で運営。
          15年の頭皮ケア専門の実績をもとに、認定パートナーへのノウハウ提供を行っています。
        </p>
        <div style={{ marginTop: "14px", display: "flex", gap: "12px" }}>
          <a href={LINE_URL} target="_blank" rel="noopener noreferrer" style={{
            fontSize: "11px", color: C.green, textDecoration: "none",
            borderBottom: `1px solid ${C.sage}`, paddingBottom: "1px",
          }}>
            LINE公式アカウント
          </a>
          <a href="https://scalp-labo.jp" target="_blank" rel="noopener noreferrer" style={{
            fontSize: "11px", color: C.green, textDecoration: "none",
            borderBottom: `1px solid ${C.sage}`, paddingBottom: "1px",
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
      background: C.bg,
    }}>
      <Hero />
      <WhyLook />
      <SeeWithMicroscope />
      <TrackRecord />
      <SubscriptionModel />
      <MarketOpportunity />
      <WhoIsItFor />
      <PartnerSupport />
      <CustomerMessage />
      <FinalCTA />
      <FloatingCTA />
    </div>
  );
}
