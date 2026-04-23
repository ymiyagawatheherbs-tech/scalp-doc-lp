/*
 * スカルプラボ パートナープログラム 詳細資料LP
 * URL: /partner-doc
 * 対象: LINE登録後のパートナー候補者
 * 設計: スマホ最適化・縦スクロール型
 * デザイン: 焦茶 × ゴールド × クリーム
 */

// ── 画像URL（PPTXから抽出した実際の写真）──────────────────
const IMG = {
  // 094A5755: マイクロスコープでチェック中（タブレット持ちスタッフ）→ ヒーロー
  hero: "/manus-storage/hero_main_094A5755_436d825f.jpg",
  // image5: マイクロスコープを頭皮に当てているアップ → 頭皮チェックセクション
  microscopeCheck: "/manus-storage/microscope_check_c8034773.jpeg",
  // image6: ハーブスチーマー施術（蒸気）→ スチーマーセクション
  herbSteamer: "/manus-storage/herb_steamer_72edf538.jpeg",
  // image7: THE HERBSサロン内装 → サロン紹介
  salonInterior: "/manus-storage/salon_interior_921d28d8.jpeg",
  // image4: カウンセリングシーン → ビジネスモデルセクション
  consultation: "/manus-storage/consultation_241b3ba2.png",
  // image8: スカルプゴマージュ施術（男性・ハーブペースト）→ 製品セクション
  scalpGommage: "/manus-storage/pptx_image8_7b00edbd.jpeg",
  // image9: ハーブスチーマー機器とハーブ瓶 → 製品セクション
  steamerMachine: "/manus-storage/pptx_image9_2661a496.jpeg",
  // image10: ドライハーブ6種類 → ハーブ素材セクション
  dryHerbs: "/manus-storage/pptx_image10_101cab8b.jpeg",
  // image11: 頭皮・毛根の顕微鏡写真 → 頭皮データセクション
  scalpMicro: "/manus-storage/pptx_image11_28a4825d.jpeg",
};

// ── カラー定数（焦茶ベース）──────────────────────────────
const C = {
  darkBrown: "#2c1a0e",   // 焦茶（メインダーク）
  midBrown: "#4a2c16",    // 中間茶
  lightBrown: "#6b3f1f",  // 明るい茶
  gold: "#c9a227",        // ゴールド
  goldLight: "#e8c84a",   // ライトゴールド
  cream: "#f5f0e8",       // クリーム
  creamDark: "#ede5d5",   // ダーククリーム
  white: "#ffffff",
  textDark: "#1a1a1a",
  textMid: "#4a3728",     // 茶系テキスト
  accent: "#8b5e3c",      // アクセント茶
};

// ── LINE URL ──────────────────────────────────────────────
const LINE_URL = "https://lin.ee/6GDbcebK";
const SEMINAR_URL = "https://liff.line.me/2009830640-luW0lUXi?liff_id=2009830640-luW0lUXi&is=bcljDz4G8D&option_key=qvh0XGYi1i"; // 説明会申込
const TRIAL_URL = "https://liff.line.me/2009830640-luW0lUXi?liff_id=2009830640-luW0lUXi&is=bcljDz4G8D&option_key=n2yGYzb2NZ"; // 体験会申込

// ── 共通コンポーネント ────────────────────────────────────

function SectionLabel({ text, light = false }: { text: string; light?: boolean }) {
  return (
    <p
      style={{
        fontSize: "10px",
        letterSpacing: "0.2em",
        fontWeight: 600,
        color: light ? C.goldLight : C.gold,
        marginBottom: "8px",
        textTransform: "uppercase",
      }}
    >
      {text}
    </p>
  );
}

function Divider({ light = false }: { light?: boolean }) {
  return (
    <div
      style={{
        width: "40px",
        height: "2px",
        background: light ? C.gold : C.midBrown,
        margin: "12px 0 20px",
      }}
    />
  );
}

// ── CTAボタン（説明会 / 体験会）────────────────────────────
function CTAButtons({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const bg = variant === "dark" ? C.darkBrown : C.cream;
  const textColor = variant === "dark" ? C.cream : C.darkBrown;

  return (
    <div
      style={{
        background: bg,
        padding: "32px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      <p
        style={{
          fontSize: "13px",
          color: variant === "dark" ? "rgba(245,240,232,0.75)" : C.textMid,
          lineHeight: 1.7,
          textAlign: "center",
        }}
      >
        収益の仕組み・卸価格・初期費用・サポート内容は
        <br />
        <strong style={{ color: variant === "dark" ? C.goldLight : C.darkBrown }}>
          オンライン説明会でくわしくご説明します。
        </strong>
      </p>

      <a
        href={SEMINAR_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block",
          background: C.gold,
          color: C.darkBrown,
          textAlign: "center",
          padding: "18px 20px",
          borderRadius: "4px",
          fontWeight: 700,
          fontSize: "16px",
          textDecoration: "none",
          letterSpacing: "0.05em",
        }}
      >
        オンライン説明会に参加する（無料）
      </a>

      <a
        href={TRIAL_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block",
          background: "transparent",
          color: variant === "dark" ? C.goldLight : C.darkBrown,
          textAlign: "center",
          padding: "16px 20px",
          borderRadius: "4px",
          fontWeight: 700,
          fontSize: "15px",
          textDecoration: "none",
          border: `2px solid ${C.gold}`,
          letterSpacing: "0.05em",
        }}
      >
        神戸で体験会に参加する（無料）
      </a>

      <p
        style={{
          fontSize: "11px",
          color: variant === "dark" ? "rgba(245,240,232,0.45)" : C.accent,
          textAlign: "center",
          lineHeight: 1.6,
        }}
      >
        営業は一切ありません。疑問・不安はその場で解消できます。
      </p>
    </div>
  );
}

// ── 01. ヒーロー ──────────────────────────────────────────
function Hero() {
  return (
    <section style={{ position: "relative", background: C.darkBrown }}>
      <img
        src={IMG.hero}
        alt="頭皮チェックの様子"
        style={{
          width: "100%",
          height: "300px",
          objectFit: "cover",
          display: "block",
          opacity: 0.85,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "linear-gradient(transparent, rgba(44,26,14,0.92))",
          padding: "40px 20px 28px",
        }}
      >
        <p
          style={{
            fontSize: "10px",
            letterSpacing: "0.25em",
            color: C.gold,
            marginBottom: "8px",
            fontWeight: 600,
          }}
        >
          SCALP LABO PARTNER PROGRAM
        </p>
        <h1
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: C.white,
            lineHeight: 1.45,
            marginBottom: "10px",
          }}
        >
          頭皮ケアの専門家として、
          <br />
          <span style={{ color: C.goldLight }}>新しい収益の柱を。</span>
        </h1>
        <p
          style={{
            fontSize: "12px",
            color: "rgba(245,240,232,0.8)",
            lineHeight: 1.7,
          }}
        >
          歯科の定期検診と同じモデルで、
          頭皮ケアを「習慣」として提供する。
          競合がほぼいない市場で、
          あなたの専門性を活かす仕組みがあります。
        </p>
      </div>
    </section>
  );
}

// ── 02. この資料でわかること ──────────────────────────────
function TableOfContents() {
  const items = [
    { no: "01", title: "なぜ今、頭皮ケアなのか", sub: "市場の空白地帯とブルーオーシャン" },
    { no: "02", title: "スカルプラボのポジション", sub: "美容でも医療でもない第三の領域" },
    { no: "03", title: "ビジネスモデルの仕組み", sub: "習慣をつくる事業とは" },
    { no: "04", title: "一緒にできること", sub: "3つのSTEPと使用製品" },
    { no: "05", title: "導入後に描ける未来", sub: "美容師・個人事業主が変わること" },
    { no: "06", title: "こんな方と一緒に", sub: "パートナーとして歓迎する方" },
    { no: "07", title: "次のステップ", sub: "説明会・体験会への参加方法" },
  ];

  return (
    <section style={{ background: C.cream, padding: "36px 20px" }}>
      <SectionLabel text="CONTENTS" />
      <h2
        style={{
          fontSize: "20px",
          fontWeight: 700,
          color: C.darkBrown,
          marginBottom: "4px",
        }}
      >
        この資料でわかること
      </h2>
      <Divider />
      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              padding: "14px 0",
              borderBottom: `1px solid ${C.creamDark}`,
            }}
          >
            <span
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: C.gold,
                minWidth: "36px",
                fontFamily: "serif",
              }}
            >
              {item.no}
            </span>
            <div>
              <p style={{ fontSize: "15px", fontWeight: 700, color: C.darkBrown }}>
                {item.title}
              </p>
              <p style={{ fontSize: "12px", color: C.textMid, marginTop: "2px" }}>
                {item.sub}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── 03. 市場分析 ──────────────────────────────────────────
function MarketAnalysis() {
  const stats = [
    {
      label: "予防型ヘルスケア市場",
      value: "年率15.5%成長",
      desc: "世界の予防ヘルスケア市場は2029年に約90兆円規模へ。「病気になってから治す」から「なる前に防ぐ」へのシフトが加速。",
      source: "GIR市場調査レポート2025より",
    },
    {
      label: "頭皮・ヘッドスパ需要",
      value: "急拡大中",
      desc: "リラクゼーション市場は前年比9.6%増の3,674億円（2024年）。ヘッドスパ・頭皮ケアへの需要が特に伸びています。",
      source: "リクルート美容センサス2024より",
    },
    {
      label: "定期チェック提供サロン",
      value: "ほぼゼロ",
      desc: "歯科の定期検診は当たり前になりましたが、頭皮の定期チェックを習慣として提供しているサロンは国内でもほとんど存在しません。",
      source: "THE HERBS調べ",
    },
  ];

  return (
    <section style={{ background: C.darkBrown, padding: "36px 20px", color: C.cream }}>
      <SectionLabel text="MARKET ANALYSIS" light />
      <h2
        style={{
          fontSize: "20px",
          fontWeight: 700,
          color: C.white,
          lineHeight: 1.4,
          marginBottom: "4px",
        }}
      >
        美容業界は飽和。
        <br />
        <span style={{ color: C.gold }}>しかし頭皮ケアは空白地帯。</span>
      </h2>
      <Divider light />

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
        {stats.map((s, i) => (
          <div
            key={i}
            style={{
              background: "rgba(255,255,255,0.07)",
              borderRadius: "6px",
              padding: "18px 16px",
              borderLeft: `3px solid ${C.gold}`,
            }}
          >
            <p style={{ fontSize: "10px", color: C.gold, letterSpacing: "0.1em", marginBottom: "4px" }}>
              {s.label}
            </p>
            <p style={{ fontSize: "22px", fontWeight: 700, color: C.white, marginBottom: "8px" }}>
              {s.value}
            </p>
            <p style={{ fontSize: "12px", color: "rgba(245,240,232,0.8)", lineHeight: 1.7 }}>
              {s.desc}
            </p>
            <p style={{ fontSize: "10px", color: "rgba(245,240,232,0.45)", marginTop: "8px" }}>
              ※{s.source}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          background: C.midBrown,
          borderRadius: "6px",
          padding: "16px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "10px", color: C.gold, letterSpacing: "0.15em", marginBottom: "6px" }}>
          KEY INSIGHT
        </p>
        <p style={{ fontSize: "14px", color: C.white, fontWeight: 600, lineHeight: 1.6 }}>
          「頭皮の定期チェック」を習慣として提供できるのは、
          <br />
          今のところほぼあなただけです。
        </p>
      </div>
    </section>
  );
}

// ── 04. ポジション ────────────────────────────────────────
function Positioning() {
  return (
    <section style={{ background: C.cream, padding: "36px 20px" }}>
      <SectionLabel text="POSITIONING" />
      <h2
        style={{
          fontSize: "20px",
          fontWeight: 700,
          color: C.darkBrown,
          lineHeight: 1.4,
          marginBottom: "4px",
        }}
      >
        美容でも医療でもない、
        <br />
        <span style={{ color: C.gold }}>第三の領域。</span>
      </h2>
      <Divider />

      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {[
          { label: "美容室", desc: "スタイリング\nカラー・パーマ", dim: true },
          {
            label: "THE HERBS\nSCALP LABO",
            desc: "頭皮の定期チェック\n＋ケアの習慣化",
            highlight: true,
          },
          { label: "医療機関", desc: "薬・治療\n皮膚科・病院", dim: true },
        ].map((p, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              background: p.highlight ? C.darkBrown : "rgba(44,26,14,0.08)",
              borderRadius: "6px",
              padding: "14px 10px",
              textAlign: "center",
              border: p.highlight ? `2px solid ${C.gold}` : "none",
            }}
          >
            {p.highlight && (
              <p style={{ fontSize: "9px", color: C.gold, marginBottom: "4px", letterSpacing: "0.1em" }}>
                ここに参入
              </p>
            )}
            <p
              style={{
                fontSize: "12px",
                fontWeight: 700,
                color: p.highlight ? C.white : C.textMid,
                lineHeight: 1.4,
                whiteSpace: "pre-line",
                marginBottom: "8px",
              }}
            >
              {p.label}
            </p>
            <p
              style={{
                fontSize: "10px",
                color: p.highlight ? "rgba(245,240,232,0.8)" : C.textMid,
                lineHeight: 1.5,
                whiteSpace: "pre-line",
              }}
            >
              {p.desc}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          background: C.darkBrown,
          borderRadius: "6px",
          padding: "16px",
          color: C.cream,
        }}
      >
        <p style={{ fontSize: "10px", color: C.gold, letterSpacing: "0.15em", marginBottom: "6px" }}>
          KEY POINT
        </p>
        <p style={{ fontSize: "13px", lineHeight: 1.7 }}>
          「売る事業」ではなく「<strong style={{ color: C.gold }}>習慣をつくる事業</strong>」。
          競合がほぼいないブルーオーシャン市場で、
          歯科の定期検診と同じモデルを頭皮ケアで実現します。
        </p>
      </div>
    </section>
  );
}

// ── 05. ビジネスモデル ────────────────────────────────────
function BusinessModel() {
  const points = [
    {
      no: "01",
      title: "予防型ヘルスケアとして",
      body: "薄毛・抜け毛・頭皮トラブルは、気になり始めたときにはすでに進行していることがほとんど。定期的なチェックで「早期発見・早期対応」の習慣を創ります。",
      tag: "「気づいてから対策」から「予防的に守る」へ",
    },
    {
      no: "02",
      title: "美容サービスとして",
      body: "頭皮は顔や体と同じ「皮膚」。スキンケア以上に過酷な環境にある頭皮を皮膚と同じ感覚で、頭皮ケアを日常に取り入れる文化を育てます。",
      tag: "スキンケアの延長線上にある頭皮ケア",
    },
    {
      no: "03",
      title: "習慣化ビジネスとして",
      body: "施術や商品を「一度売る」のではなく、定期来店・定期チェックの仕組みを設計します。お客様との長期的な関係が、安定した収益基盤になります。",
      tag: "リピートではなく「習慣」が収益を生む",
    },
  ];

  return (
    <section style={{ background: C.midBrown, padding: "36px 20px", color: C.cream }}>
      <SectionLabel text="BUSINESS MODEL" light />
      <h2
        style={{
          fontSize: "20px",
          fontWeight: 700,
          color: C.white,
          lineHeight: 1.4,
          marginBottom: "4px",
        }}
      >
        「売る事業」ではなく、
        <br />
        <span style={{ color: C.gold }}>「習慣をつくる事業」</span>
      </h2>
      <Divider light />

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {points.map((p, i) => (
          <div
            key={i}
            style={{
              background: "rgba(255,255,255,0.08)",
              borderRadius: "6px",
              padding: "18px 16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginBottom: "8px" }}>
              <span style={{ fontSize: "20px", fontWeight: 700, color: C.gold, fontFamily: "serif" }}>
                {p.no}
              </span>
              <span style={{ fontSize: "15px", fontWeight: 700, color: C.white }}>
                {p.title}
              </span>
            </div>
            <p style={{ fontSize: "13px", color: "rgba(245,240,232,0.8)", lineHeight: 1.7, marginBottom: "10px" }}>
              {p.body}
            </p>
            <div
              style={{
                background: "rgba(201,162,39,0.15)",
                borderRadius: "4px",
                padding: "6px 10px",
                fontSize: "11px",
                color: C.goldLight,
              }}
            >
              {p.tag}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── 06. 一緒にできること ──────────────────────────────────
function HowWeWork() {
  const steps = [
    {
      step: "STEP 01",
      title: "頭皮チェックで「見える化」する",
      body: "マイクロスコープで頭皮の状態を記録・分析。お客様が自分の頭皮を初めて「見る」体験が、ケアへの動機づけになります。データは時系列で蓄積され、視覚的に変化を確認できます。",
      note: "所要時間：約5〜10分 / 初回無料で提供可能",
      img: IMG.microscopeCheck,
    },
    {
      step: "STEP 02",
      title: "ボタニカルミストで頭皮を整える",
      body: "THE HERBSが開発したハーブスチーマーで、植物成分そのものを蒸気抄出し、頭皮に届けます。カラー・パーマ後の薬剤除去にも対応。チェックで見つかった課題に合わせたケアが提供できます。",
      note: "既存メニューへの追加・単品提供どちらも可能",
      img: IMG.herbSteamer,
    },
    {
      step: "STEP 03",
      title: "定期来店で習慣化する",
      body: "「歯の定期検診」のように、頭皮チェックを定期的に受ける習慣を育てます。定期来店が定着することで、安定した売上とお客様との深い信頼関係が生まれます。",
      note: "3ヶ月・6ヶ月のフォローアップ設計をサポート",
      img: IMG.consultation,
    },
  ];

  return (
    <section style={{ background: C.cream, padding: "36px 20px" }}>
      <SectionLabel text="HOW WE WORK TOGETHER" />
      <h2
        style={{
          fontSize: "20px",
          fontWeight: 700,
          color: C.darkBrown,
          lineHeight: 1.4,
          marginBottom: "4px",
        }}
      >
        スカルプラボで
        <br />
        できること
      </h2>
      <Divider />

      <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
        {steps.map((s, i) => (
          <div key={i}>
            <img
              src={s.img}
              alt={s.title}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
                borderRadius: "6px",
                marginBottom: "14px",
              }}
            />
            <p
              style={{
                fontSize: "10px",
                letterSpacing: "0.15em",
                color: C.gold,
                fontWeight: 600,
                marginBottom: "4px",
              }}
            >
              {s.step}
            </p>
            <h3
              style={{
                fontSize: "17px",
                fontWeight: 700,
                color: C.darkBrown,
                marginBottom: "8px",
              }}
            >
              {s.title}
            </h3>
            <p
              style={{
                fontSize: "13px",
                color: C.textMid,
                lineHeight: 1.8,
                marginBottom: "10px",
              }}
            >
              {s.body}
            </p>
            <div
              style={{
                background: C.darkBrown,
                color: C.gold,
                padding: "8px 12px",
                borderRadius: "4px",
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              {s.note}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── 07. 使用製品 ──────────────────────────────────────────
function Products() {
  const items = [
    { name: "SHAMPOO LUMIÈRE", desc: "頭皮環境を整えるハーブシャンプー（さらさら仕上げ）" },
    { name: "SHAMPOO LAVER", desc: "皮脂バランスを整えるハーブシャンプー（しっとり仕上げ）" },
    { name: "SCALP ESSENCE LE SÉBUM", desc: "頭皮用スカルプエッセンス。毛穴ケア・皮脂コントロール" },
    { name: "HAIR ESSENCE THÉRAPIE", desc: "毛先・髪全体を整えるヘアエッセンス" },
    { name: "HAIR OIL RICHE", desc: "ツヤと保湿を与えるヘアオイル" },
  ];

  return (
    <section style={{ background: C.darkBrown, padding: "36px 20px", color: C.cream }}>
      <SectionLabel text="THE HERBS PRODUCTS" light />
      <h2
        style={{
          fontSize: "20px",
          fontWeight: 700,
          color: C.white,
          lineHeight: 1.4,
          marginBottom: "4px",
        }}
      >
        施術後のホームケアが
        <br />
        <span style={{ color: C.gold }}>物販売上につながる</span>
      </h2>
      <Divider light />

      {/* 商品画像 */}
      <img
        src="/manus-storage/product_fillis_BF9I3827_9fb31a78.jpg"
        alt="fillis ヘアケアライン 5品目"
        style={{
          width: "100%",
          borderRadius: "8px",
          marginBottom: "20px",
          objectFit: "cover",
        }}
      />

      {/* 顧客満足度バナー */}
      <div
        style={{
          background: "rgba(201,162,39,0.15)",
          border: `1px solid ${C.gold}`,
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "11px", color: C.gold, letterSpacing: "0.1em", marginBottom: "4px" }}>CUSTOMER SATISFACTION</p>
        <p style={{ fontSize: "32px", fontWeight: 800, color: C.gold, lineHeight: 1 }}>86.3<span style={{ fontSize: "18px" }}>%</span></p>
        <p style={{ fontSize: "12px", color: "rgba(245,240,232,0.8)", marginTop: "4px" }}>顧客満足度 — 高いリピート率が期待できます</p>
      </div>

      <p
        style={{
          fontSize: "13px",
          color: "rgba(245,240,232,0.75)",
          lineHeight: 1.8,
          marginBottom: "16px",
        }}
      >
        頭皮チェック後のホームケアとして、fillis ヘアケアライン5品目を提案できます。
        施術で信頼を得たお客様が、そのまま商品を継続購入する流れが自然に生まれます。
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              padding: "12px",
              background: "rgba(255,255,255,0.06)",
              borderRadius: "6px",
              borderLeft: `3px solid ${C.gold}`,
            }}
          >
            <span
              style={{
                minWidth: "20px",
                height: "20px",
                background: C.gold,
                color: C.darkBrown,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "10px",
                fontWeight: 800,
                flexShrink: 0,
                marginTop: "1px",
              }}
            >
              {i + 1}
            </span>
            <div>
              <p style={{ fontSize: "13px", fontWeight: 700, color: C.white, marginBottom: "2px" }}>{item.name}</p>
              <p style={{ fontSize: "11px", color: "rgba(245,240,232,0.7)", lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "14px",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "6px",
          borderTop: `2px solid ${C.gold}`,
        }}
      >
        <p style={{ fontSize: "12px", color: "rgba(245,240,232,0.8)", lineHeight: 1.7 }}>
          施術（サービス売上）＋ ホームケア商品（物販売上）の
          <span style={{ color: C.gold, fontWeight: 700 }}>二軸の収益構造</span>で、
          安定した売上基盤を構築できます。
        </p>
      </div>
    </section>
  );
}

// ── 08. 導入後に描ける未来 ────────────────────────────────
function FutureVision() {
  const visions = [
    {
      persona: "美容師として働いている方",
      before: "スタイリング・カラー・パーマに追われ、頭皮ケアまで手が回らない。お客様の頭皮トラブルに気づいても対処できない。",
      after: [
        "頭皮チェックは5〜10分。既存の施術の前後に組み込める",
        "「頭皮の専門家」として他の美容師との差別化ができる",
        "問題が見つかったお客様への施術も担当できる（歯医者の虫歯治療モデル）",
        "定期来店の仕組みで、安定した顧客基盤が生まれる",
      ],
      img: IMG.microscopeCheck,
    },
    {
      persona: "エステ・ヘッドスパ・自宅サロンの方",
      before: "施術メニューが固定化し、客単価が伸び悩んでいる。新しいメニューを増やしたいが、大きな設備投資はできない。",
      after: [
        "マイクロスコープ1台から始められる。大きな設備投資は不要",
        "頭皮チェックをきっかけに、ホームケア商品の継続販売へ",
        "THE HERBSのブランド・技術・サポートを活用できる",
        "定期チェックの習慣化で、リピート率が自然に上がる",
      ],
      img: IMG.consultation,
    },
    {
      persona: "副業・起業を考えている方",
      before: "美容・ヘルスケア分野で起業したいが、何から始めればいいかわからない。リスクを抑えたスタートをしたい。",
      after: [
        "既存の認定プログラムで技術・知識を体系的に習得できる",
        "「頭皮ケアの専門家」という明確なポジションで起業できる",
        "THE HERBSの認定サロンとして、ブランド力を借りられる",
        "チョコザップ等の施設への出張チェックという展開も視野に",
      ],
      img: IMG.salonInterior,
    },
  ];

  return (
    <section style={{ background: C.cream, padding: "36px 20px" }}>
      <SectionLabel text="YOUR FUTURE" />
      <h2
        style={{
          fontSize: "20px",
          fontWeight: 700,
          color: C.darkBrown,
          lineHeight: 1.4,
          marginBottom: "4px",
        }}
      >
        導入後に
        <br />
        <span style={{ color: C.gold }}>描ける未来</span>
      </h2>
      <p style={{ fontSize: "13px", color: C.textMid, lineHeight: 1.7, marginBottom: "4px" }}>
        スカルプラボを導入した方が、実際にどう変わるか。
      </p>
      <Divider />

      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        {visions.map((v, i) => (
          <div key={i}>
            <img
              src={v.img}
              alt={v.persona}
              style={{
                width: "100%",
                height: "160px",
                objectFit: "cover",
                borderRadius: "6px",
                marginBottom: "16px",
              }}
            />
            <p
              style={{
                fontSize: "15px",
                letterSpacing: "0.15em",
                color: C.gold,
                fontWeight: 600,
                marginBottom: "6px",
              }}
            >
              {v.persona}
            </p>

            {/* Before */}
            <div
              style={{
                background: "rgba(44,26,14,0.06)",
                borderRadius: "6px",
                padding: "14px 16px",
                marginBottom: "10px",
                borderLeft: `3px solid ${C.accent}`,
              }}
            >
              <p style={{ fontSize: "10px", color: C.accent, fontWeight: 600, marginBottom: "6px", letterSpacing: "0.1em" }}>
                BEFORE
              </p>
              <p style={{ fontSize: "12px", color: C.textMid, lineHeight: 1.7 }}>
                {v.before}
              </p>
            </div>

            {/* After */}
            <div
              style={{
                background: C.darkBrown,
                borderRadius: "6px",
                padding: "14px 16px",
                borderLeft: `3px solid ${C.gold}`,
              }}
            >
              <p style={{ fontSize: "10px", color: C.gold, fontWeight: 600, marginBottom: "10px", letterSpacing: "0.1em" }}>
                AFTER
              </p>
              <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                {v.after.map((item, j) => (
                  <li
                    key={j}
                    style={{
                      fontSize: "12px",
                      color: "rgba(245,240,232,0.85)",
                      lineHeight: 1.7,
                      paddingLeft: "16px",
                      position: "relative",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: 0,
                        color: C.gold,
                        fontWeight: 700,
                      }}
                    >
                      +
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── 09. パートナーサポート ────────────────────────────────
function PartnerSupport() {
  const supports = [
    {
      title: "技術・知識サポート",
      items: ["頭皮チェック技術の習得（1〜2日）", "マイクロスコープの使い方", "お客様への説明トーク"],
    },
    {
      title: "データ・ツールサポート",
      items: ["頭皮チェックデータの記録・管理", "経過観察レポートのテンプレート", "お客様向け説明資料"],
    },
    {
      title: "商品・仕入れサポート",
      items: ["THE HERBS製品の認定サロン向け提供", "新商品情報の優先案内", "在庫管理のサポート"],
    },
    {
      title: "集客・マーケティング支援",
      items: ["認定サロンとしてのロゴ使用権", "THE HERBSウェブサイトへの掲載", "SNS・集客コンテンツの提供"],
    },
  ];

  return (
    <section style={{ background: C.midBrown, padding: "36px 20px", color: C.cream }}>
      <SectionLabel text="PARTNER SUPPORT" light />
      <h2
        style={{
          fontSize: "20px",
          fontWeight: 700,
          color: C.white,
          lineHeight: 1.4,
          marginBottom: "4px",
        }}
      >
        認定サロンが受けられる
        <br />
        <span style={{ color: C.gold }}>サポート</span>
      </h2>
      <Divider light />

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {supports.map((s, i) => (
          <div
            key={i}
            style={{
              background: "rgba(255,255,255,0.08)",
              borderRadius: "6px",
              padding: "16px",
            }}
          >
            <p style={{ fontSize: "14px", fontWeight: 700, color: C.white, marginBottom: "10px" }}>
              {s.title}
            </p>
            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {s.items.map((item, j) => (
                <li
                  key={j}
                  style={{
                    fontSize: "12px",
                    color: "rgba(245,240,232,0.8)",
                    padding: "4px 0",
                    borderBottom: j < s.items.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                    paddingLeft: "14px",
                    position: "relative",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: 0,
                      color: C.gold,
                    }}
                  >
                    +
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── 10. こんな方と一緒に ──────────────────────────────────
function WhoWeWelcome() {
  const profiles = [
    {
      title: "エステサロン・ヘッドスパ店",
      body: "すでに頭皮・頭部のケアを提供している方。頭皮チェックを加えることで専門性が高まり、客単価・リピート率の向上が見込めます。",
    },
    {
      title: "美容師（副業・起業を考えている方）",
      body: "スタイリングに集中したい美容師にとって、頭皮ケアは時間的に難しい。でも、頭皮チェックだけなら5〜10分。副業・独立の第一歩として最適です。",
    },
    {
      title: "自宅サロン・個人事業主",
      body: "大きな設備投資なしに始められます。マイクロスコープ1台から。既存のお客様に新しい価値を提供できます。",
    },
    {
      title: "これから起業を考えている方",
      body: "美容・ヘルスケア分野での起業を考えている方。THE HERBSのブランド・技術・サポートを活用して、リスクを抑えたスタートが可能です。",
    },
  ];

  return (
    <section style={{ background: C.cream, padding: "36px 20px" }}>
      <SectionLabel text="WHO WE WELCOME" />
      <h2
        style={{
          fontSize: "20px",
          fontWeight: 700,
          color: C.darkBrown,
          lineHeight: 1.4,
          marginBottom: "4px",
        }}
      >
        こんな方と
        <br />
        一緒に取り組みたい
      </h2>
      <Divider />

      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {profiles.map((p, i) => (
          <div
            key={i}
            style={{
              background: C.white,
              borderRadius: "6px",
              padding: "18px 16px",
              border: `1px solid ${C.creamDark}`,
              borderLeft: `3px solid ${C.gold}`,
            }}
          >
            <p style={{ fontSize: "14px", fontWeight: 700, color: C.darkBrown, marginBottom: "8px" }}>
              {p.title}
            </p>
            <p style={{ fontSize: "12px", color: C.textMid, lineHeight: 1.7 }}>{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── 11. 最終CTA ───────────────────────────────────────────
function FinalCTA() {
  return (
    <section style={{ background: C.darkBrown, color: C.cream }}>
      <div style={{ padding: "36px 20px 24px" }}>
        <SectionLabel text="NEXT ACTION" light />
        <h2
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: C.white,
            lineHeight: 1.4,
            marginBottom: "8px",
          }}
        >
          次のステップ
        </h2>
        <p
          style={{
            fontSize: "13px",
            color: "rgba(245,240,232,0.75)",
            lineHeight: 1.8,
            marginBottom: "24px",
          }}
        >
          収益の仕組み・卸価格・初期費用・認定プログラムの詳細は、
          オンライン説明会でくわしくご説明します。
          まずはお気軽にご参加ください。
        </p>

        {/* 説明会・体験会の違い */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "28px" }}>
          <div
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.07)",
              borderRadius: "6px",
              padding: "14px 12px",
              borderTop: `3px solid ${C.goldLight}`,
            }}
          >
            <p style={{ fontSize: "12px", fontWeight: 700, color: C.white, marginBottom: "6px" }}>
              オンライン説明会
            </p>
            <p style={{ fontSize: "11px", color: "rgba(245,240,232,0.7)", lineHeight: 1.6 }}>
              Zoom（無料）
              <br />
              約60分
              <br />
              プログラム詳細・Q&amp;A
            </p>
          </div>
          <div
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.07)",
              borderRadius: "6px",
              padding: "14px 12px",
              borderTop: `3px solid ${C.gold}`,
            }}
          >
            <p style={{ fontSize: "12px", fontWeight: 700, color: C.white, marginBottom: "6px" }}>
              神戸 体験会
            </p>
            <p style={{ fontSize: "11px", color: "rgba(245,240,232,0.7)", lineHeight: 1.6 }}>
              神戸（対面）
              <br />
              約90分
              <br />
              実際の施術を体験
            </p>
          </div>
        </div>
      </div>

      {/* CTAボタン */}
      <CTAButtons variant="dark" />

      {/* 会社情報 */}
      <div
        style={{
          padding: "24px 20px",
          borderTop: `1px solid rgba(201,162,39,0.2)`,
        }}
      >
        <p style={{ fontSize: "11px", color: "rgba(245,240,232,0.5)", marginBottom: "8px", letterSpacing: "0.1em" }}>
          COMPANY PROFILE
        </p>
        <p style={{ fontSize: "13px", color: C.cream, fontWeight: 600, marginBottom: "4px" }}>
          株式会社 THE HERBS
        </p>
        <p style={{ fontSize: "11px", color: "rgba(245,240,232,0.6)", lineHeight: 1.7 }}>
          創業：1986年
          <br />
          事業：化粧品製造・販売、頭皮ケアサロン運営
          <br />
          所在地：兵庫県神戸市
          <br />
          直営店：神戸阪急店、神戸市灘区サロン
        </p>
        <div style={{ marginTop: "16px", display: "flex", gap: "12px" }}>
          <a
            href={LINE_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "11px",
              color: C.gold,
              textDecoration: "none",
              borderBottom: `1px solid rgba(201,162,39,0.4)`,
              paddingBottom: "1px",
            }}
          >
            LINE公式アカウント
          </a>
          <a
            href="https://scalp-labo.jp"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontSize: "11px",
              color: C.gold,
              textDecoration: "none",
              borderBottom: `1px solid rgba(201,162,39,0.4)`,
              paddingBottom: "1px",
            }}
          >
            オフィシャルサイト
          </a>
        </div>
      </div>
    </section>
  );
}

// ── フローティングCTA ─────────────────────────────────────
function FloatingCTA() {
  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: C.darkBrown,
        borderTop: `2px solid ${C.gold}`,
        padding: "10px 16px",
        display: "flex",
        gap: "8px",
        zIndex: 100,
        boxShadow: "0 -4px 20px rgba(0,0,0,0.3)",
      }}
    >
      <a
        href={SEMINAR_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          flex: 1,
          display: "block",
          background: C.gold,
          color: C.darkBrown,
          textAlign: "center",
          padding: "12px 8px",
          borderRadius: "4px",
          fontWeight: 700,
          fontSize: "13px",
          textDecoration: "none",
        }}
      >
        説明会に参加する
      </a>
      <a
        href={TRIAL_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          flex: 1,
          display: "block",
          background: "transparent",
          color: C.goldLight,
          textAlign: "center",
          padding: "12px 8px",
          borderRadius: "4px",
          fontWeight: 700,
          fontSize: "13px",
          textDecoration: "none",
          border: `1px solid ${C.gold}`,
        }}
      >
        体験会に参加する
      </a>
    </div>
  );
}

// ── メインコンポーネント ───────────────────────────────────
export default function PartnerDoc() {
  return (
    <div
      style={{
        maxWidth: "480px",
        margin: "0 auto",
        fontFamily: "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif",
        paddingBottom: "70px", // フローティングCTA分の余白
      }}
    >
      <Hero />
      <TableOfContents />
      <MarketAnalysis />
      <Positioning />
      <BusinessModel />
      <HowWeWork />
      <Products />
      <FutureVision />
      <PartnerSupport />
      <WhoWeWelcome />
      <FinalCTA />
      <FloatingCTA />
    </div>
  );
}
