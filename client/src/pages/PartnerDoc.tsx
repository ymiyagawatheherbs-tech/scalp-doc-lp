/*
 * スカルプラボ パートナープログラム 詳細資料LP
 * URL: /partner-doc
 * 対象: LINE登録後のパートナー候補者
 * 設計: スマホ最適化・縦スクロール型
 * デザイン: ダークグリーン × ゴールド × クリーム（PPTXと統一）
 */

import { useState } from "react";

// ── 画像URL（PPTXから抽出した実際の写真）──────────────────
const IMG = {
  // image2: マイクロスコープでチェック中（タブレット持ちスタッフ）→ ヒーロー
  scalpCheckTablet: "/manus-storage/scalp_check_tablet_147c16f8.jpeg",
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

// ── カラー定数 ────────────────────────────────────────────
const C = {
  darkGreen: "#1a3c2e",
  midGreen: "#2d5a42",
  lightGreen: "#4a7c5e",
  gold: "#c9a227",
  goldLight: "#e8c84a",
  cream: "#f5f0e8",
  creamDark: "#ede5d5",
  orange: "#e07b39",
  white: "#ffffff",
  textDark: "#1a1a1a",
  textMid: "#444444",
};

// ── LINE URL ──────────────────────────────────────────────
const LINE_URL = "https://lin.ee/6GDbcebK";
const SEMINAR_URL = "https://lin.ee/6GDbcebK"; // 説明会申込（同LINEから）
const TRIAL_URL = "https://lin.ee/6GDbcebK";   // 体験会申込（同LINEから）

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
        background: light ? C.gold : C.midGreen,
        margin: "12px 0 20px",
      }}
    />
  );
}

// ── CTAボタン（説明会 / 体験会）────────────────────────────
function CTAButtons({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const bg = variant === "dark" ? C.darkGreen : C.cream;
  const textColor = variant === "dark" ? C.cream : C.darkGreen;

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
          textAlign: "center",
          fontSize: "13px",
          color: variant === "dark" ? C.creamDark : C.textMid,
          marginBottom: "4px",
          letterSpacing: "0.05em",
        }}
      >
        まずは気軽に参加してみてください
      </p>
      <a
        href={SEMINAR_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block",
          background: C.orange,
          color: C.white,
          textAlign: "center",
          padding: "18px 24px",
          borderRadius: "4px",
          fontWeight: 700,
          fontSize: "16px",
          textDecoration: "none",
          letterSpacing: "0.05em",
          boxShadow: "0 4px 12px rgba(224,123,57,0.35)",
        }}
      >
        📅 説明会に参加する（無料）
      </a>
      <a
        href={TRIAL_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block",
          background: C.midGreen,
          color: C.white,
          textAlign: "center",
          padding: "18px 24px",
          borderRadius: "4px",
          fontWeight: 700,
          fontSize: "16px",
          textDecoration: "none",
          letterSpacing: "0.05em",
          border: `1px solid ${C.lightGreen}`,
        }}
      >
        🌿 体験会に参加する（無料）
      </a>
      <p
        style={{
          textAlign: "center",
          fontSize: "11px",
          color: variant === "dark" ? "rgba(245,240,232,0.6)" : C.textMid,
        }}
      >
        LINEで日程をご案内します。営業は一切ありません。
      </p>
    </div>
  );
}

// ── 01. ヒーロー ──────────────────────────────────────────
function Hero() {
  return (
    <section style={{ background: C.darkGreen, color: C.cream }}>
      {/* ヘッダー */}
      <div
        style={{
          padding: "16px 20px",
          borderBottom: `1px solid rgba(201,162,39,0.3)`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <p style={{ fontSize: "11px", letterSpacing: "0.15em", color: C.gold, fontWeight: 600 }}>
            THE HERBS
          </p>
          <p style={{ fontSize: "9px", letterSpacing: "0.1em", color: "rgba(245,240,232,0.6)" }}>
            SCALP LABO
          </p>
        </div>
        <a
          href={LINE_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            background: C.orange,
            color: C.white,
            padding: "8px 16px",
            borderRadius: "4px",
            fontSize: "12px",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          LINEで相談する
        </a>
      </div>

      {/* メインビジュアル */}
      <div style={{ position: "relative" }}>
        <img
          src={IMG.salonInterior}
          alt="スカルプラボ サロン"
          style={{
            width: "100%",
            height: "260px",
            objectFit: "cover",
            objectPosition: "center",
            display: "block",
            filter: "brightness(0.45)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 24px",
          }}
        >
          <p
            style={{
              fontSize: "10px",
              letterSpacing: "0.2em",
              color: C.gold,
              fontWeight: 600,
              marginBottom: "10px",
            }}
          >
            PARTNER PROGRAM
          </p>
          <h1
            style={{
              fontSize: "26px",
              fontWeight: 700,
              color: C.white,
              lineHeight: 1.35,
              marginBottom: "12px",
            }}
          >
            頭皮ケアの専門家を
            <br />
            <span style={{ color: C.gold }}>目指しませんか。</span>
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "rgba(245,240,232,0.85)",
              lineHeight: 1.7,
            }}
          >
            植物の力で、頭皮ケアの新常識を広める。
            <br />
            THE HERBS SCALP LABOのパートナープログラム。
          </p>
        </div>
      </div>

      {/* 資料説明 */}
      <div style={{ padding: "24px 20px" }}>
        <p
          style={{
            fontSize: "13px",
            color: "rgba(245,240,232,0.75)",
            lineHeight: 1.8,
            borderLeft: `3px solid ${C.gold}`,
            paddingLeft: "14px",
          }}
        >
          この資料は、LINE登録いただいた方へお届けする
          パートナープログラムの詳細資料です。
          収益の仕組み・初期費用・サポート内容を
          わかりやすくまとめました。
        </p>
      </div>
    </section>
  );
}

// ── 02. 目次 ─────────────────────────────────────────────
function TableOfContents() {
  const items = [
    { no: "01", title: "市場分析", sub: "なぜ今、頭皮ケアなのか" },
    { no: "02", title: "ポジション", sub: "美容でも医療でもない第三の領域" },
    { no: "03", title: "ビジネスモデル", sub: "習慣をつくる事業" },
    { no: "04", title: "一緒にできること", sub: "3つのSTEP" },
    { no: "05", title: "収益シミュレーション", sub: "月間・年間の試算" },
    { no: "06", title: "初期費用・サポート", sub: "始めるために必要なもの" },
  ];

  return (
    <section style={{ background: C.cream, padding: "32px 20px" }}>
      <SectionLabel text="CONTENTS" />
      <h2
        style={{
          fontSize: "20px",
          fontWeight: 700,
          color: C.darkGreen,
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
              <p style={{ fontSize: "15px", fontWeight: 700, color: C.darkGreen }}>
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
    <section style={{ background: C.darkGreen, padding: "36px 20px", color: C.cream }}>
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

      {/* KEY INSIGHT */}
      <div
        style={{
          background: C.midGreen,
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
          color: C.darkGreen,
          lineHeight: 1.4,
          marginBottom: "4px",
        }}
      >
        美容でも医療でもない、
        <br />
        <span style={{ color: C.gold }}>第三の領域。</span>
      </h2>
      <Divider />

      {/* 3ポジション比較 */}
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
              background: p.highlight ? C.darkGreen : "rgba(26,60,46,0.08)",
              borderRadius: "6px",
              padding: "14px 10px",
              textAlign: "center",
              border: p.highlight ? `2px solid ${C.gold}` : "none",
            }}
          >
            {p.highlight && (
              <p style={{ fontSize: "9px", color: C.gold, marginBottom: "4px", letterSpacing: "0.1em" }}>
                ◀ ここに参入 ▶
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
          background: C.darkGreen,
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
    <section style={{ background: C.midGreen, padding: "36px 20px", color: C.cream }}>
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
              ✓ {p.tag}
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
      title: "リピート実績から定期来店へ",
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
          color: C.darkGreen,
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
                color: C.darkGreen,
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
                background: C.darkGreen,
                color: C.gold,
                padding: "8px 12px",
                borderRadius: "4px",
                fontSize: "11px",
                fontWeight: 600,
              }}
            >
              ✓ {s.note}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── 07. 使用製品 ──────────────────────────────────────────
function Products() {
  const products = [
    {
      name: "スカルプゴマージュ",
      desc: "頭皮専用のスクラブ。毛穴の詰まりを除去し、健康な頭皮環境を整えます。",
      tag: "定期チェックのスタート商品",
    },
    {
      name: "ボタニカルシャンプー",
      desc: "ハーブ成分を高配合。頭皮への刺激を最小限に抑えながら、植物の力でケアします。",
      tag: "ホームケアとして継続販売",
    },
    {
      name: "ハーブスチーマー（ボタニカルミスト）",
      desc: "植物成分を蒸気で直接頭皮に届ける機器。THE HERBSが独自開発。",
      tag: "サロン施術の核となる機器",
    },
    {
      name: "育毛・頭皮ケアライン",
      desc: "薄毛・うねり・頭皮トラブルに対応した専門ラインナップ。卸価格で仕入れ可能。",
      tag: "認定サロン限定の卸価格",
    },
  ];

  return (
    <section style={{ background: C.darkGreen, padding: "36px 20px", color: C.cream }}>
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
        ハーブそのものを使った
        <br />
        <span style={{ color: C.gold }}>ケミカルフリーライン</span>
      </h2>
      <Divider light />

      <p
        style={{
          fontSize: "13px",
          color: "rgba(245,240,232,0.75)",
          lineHeight: 1.8,
          marginBottom: "20px",
        }}
      >
        化粧品製造業として1986年から製品を開発。
        植物の力を最大限に活かした独自処方で、
        エビデンスに基づくケアを提供します。
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {products.map((p, i) => (
          <div
            key={i}
            style={{
              background: "rgba(255,255,255,0.07)",
              borderRadius: "6px",
              padding: "16px",
              borderLeft: `3px solid ${C.gold}`,
            }}
          >
            <p style={{ fontSize: "14px", fontWeight: 700, color: C.white, marginBottom: "6px" }}>
              {p.name}
            </p>
            <p style={{ fontSize: "12px", color: "rgba(245,240,232,0.75)", lineHeight: 1.6, marginBottom: "8px" }}>
              {p.desc}
            </p>
            <span
              style={{
                fontSize: "10px",
                color: C.gold,
                background: "rgba(201,162,39,0.15)",
                padding: "3px 8px",
                borderRadius: "3px",
              }}
            >
              {p.tag}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── 08. 収益モデル4フェーズ ───────────────────────────────
function RevenueFlow() {
  const phases = [
    {
      phase: "Phase 1",
      title: "頭皮チェックで出会う",
      body: "初回無料の頭皮チェックで新規顧客を獲得。マイクロスコープで「見える化」することで、お客様の関心と信頼を得ます。",
      revenue: "初回チェック ¥0〜3,000",
    },
    {
      phase: "Phase 2",
      title: "ケアで解決する",
      body: "チェックで見つかった課題に合わせたボタニカルミスト施術を提供。問題が見つかれば施術（歯医者でいう虫歯治療）も対応可能。",
      revenue: "施術 ¥5,000〜15,000",
    },
    {
      phase: "Phase 3",
      title: "定期来店で習慣化",
      body: "3ヶ月・6ヶ月コースで定期来店を設計。毎回のチェックデータを蓄積し、変化を「見える化」することでリピートが自然に続きます。",
      revenue: "定期コース ¥30,000〜/3ヶ月",
    },
    {
      phase: "Phase 4",
      title: "ホームケアで継続収益",
      body: "サロンでの施術に加え、ホームケア商品（シャンプー・育毛剤等）を継続販売。お客様の日常に入り込む安定収益を実現します。",
      revenue: "商品販売 ¥3,000〜8,000/月",
    },
  ];

  return (
    <section style={{ background: C.cream, padding: "36px 20px" }}>
      <SectionLabel text="REVENUE FLOW" />
      <h2
        style={{
          fontSize: "20px",
          fontWeight: 700,
          color: C.darkGreen,
          lineHeight: 1.4,
          marginBottom: "4px",
        }}
      >
        収益モデルの4フェーズ
      </h2>
      <p style={{ fontSize: "13px", color: C.textMid, marginBottom: "4px" }}>
        「寄り添う」ことで生まれる安定収益
      </p>
      <Divider />

      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {phases.map((p, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: "0",
              position: "relative",
            }}
          >
            {/* 左の縦ライン */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "40px",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  background: C.darkGreen,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: C.gold,
                  fontSize: "11px",
                  fontWeight: 700,
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              >
                {i + 1}
              </div>
              {i < phases.length - 1 && (
                <div
                  style={{
                    width: "2px",
                    flex: 1,
                    background: `linear-gradient(${C.darkGreen}, ${C.lightGreen})`,
                    minHeight: "20px",
                  }}
                />
              )}
            </div>

            {/* コンテンツ */}
            <div style={{ flex: 1, paddingLeft: "12px", paddingBottom: "24px" }}>
              <p
                style={{
                  fontSize: "10px",
                  color: C.gold,
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  marginBottom: "2px",
                }}
              >
                {p.phase}
              </p>
              <h3
                style={{
                  fontSize: "15px",
                  fontWeight: 700,
                  color: C.darkGreen,
                  marginBottom: "6px",
                }}
              >
                {p.title}
              </h3>
              <p
                style={{
                  fontSize: "12px",
                  color: C.textMid,
                  lineHeight: 1.7,
                  marginBottom: "8px",
                }}
              >
                {p.body}
              </p>
              <div
                style={{
                  display: "inline-block",
                  background: C.darkGreen,
                  color: C.gold,
                  padding: "4px 10px",
                  borderRadius: "3px",
                  fontSize: "11px",
                  fontWeight: 600,
                }}
              >
                {p.revenue}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── 09. 収益シミュレーション ──────────────────────────────
function RevenueSimulation() {
  const [activeTab, setActiveTab] = useState<"check" | "full">("full");

  const scenarios = {
    check: {
      label: "頭皮チェック単体",
      price: "¥3,000〜5,000 / 回",
      time: "約10分",
      monthly20: "¥60,000〜100,000",
      annual: "¥720,000〜1,200,000",
    },
    full: {
      label: "チェック＋ボタニカルミスト",
      price: "¥8,000〜12,000 / 回",
      time: "約30〜40分",
      monthly20: "¥160,000〜240,000",
      annual: "¥1,920,000〜2,880,000",
    },
  };

  const active = scenarios[activeTab];

  return (
    <section style={{ background: C.darkGreen, padding: "36px 20px", color: C.cream }}>
      <SectionLabel text="REVENUE SIMULATION" light />
      <h2
        style={{
          fontSize: "20px",
          fontWeight: 700,
          color: C.white,
          lineHeight: 1.4,
          marginBottom: "4px",
        }}
      >
        収益シミュレーション
      </h2>
      <p style={{ fontSize: "12px", color: "rgba(245,240,232,0.65)", marginBottom: "4px" }}>
        月20件提供した場合の試算例
      </p>
      <Divider light />

      {/* タブ切り替え */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "20px",
        }}
      >
        {(["check", "full"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: "10px 8px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 600,
              background: activeTab === tab ? C.gold : "rgba(255,255,255,0.1)",
              color: activeTab === tab ? C.darkGreen : "rgba(245,240,232,0.7)",
              transition: "all 0.2s",
            }}
          >
            {scenarios[tab].label}
          </button>
        ))}
      </div>

      {/* 単価情報 */}
      <div
        style={{
          background: "rgba(255,255,255,0.07)",
          borderRadius: "6px",
          padding: "16px",
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <p style={{ fontSize: "11px", color: "rgba(245,240,232,0.6)", marginBottom: "4px" }}>
            メニュー単価
          </p>
          <p style={{ fontSize: "20px", fontWeight: 700, color: C.gold }}>
            {active.price}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: "11px", color: "rgba(245,240,232,0.6)", marginBottom: "4px" }}>
            所要時間
          </p>
          <p style={{ fontSize: "16px", fontWeight: 600, color: C.white }}>
            {active.time}
          </p>
        </div>
      </div>

      {/* 試算結果 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
        <div
          style={{
            background: C.midGreen,
            borderRadius: "6px",
            padding: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: "12px", color: "rgba(245,240,232,0.75)" }}>
            月間売上（目安）
            <br />
            <span style={{ fontSize: "10px" }}>20件 × 単価</span>
          </p>
          <p style={{ fontSize: "22px", fontWeight: 700, color: C.gold }}>
            {active.monthly20}
          </p>
        </div>
        <div
          style={{
            background: C.midGreen,
            borderRadius: "6px",
            padding: "16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p style={{ fontSize: "12px", color: "rgba(245,240,232,0.75)" }}>
            年間売上（目安）
            <br />
            <span style={{ fontSize: "10px" }}>月間×12ヶ月</span>
          </p>
          <p style={{ fontSize: "22px", fontWeight: 700, color: C.goldLight }}>
            {active.annual}
          </p>
        </div>
      </div>

      {/* 既存メニューとの相乗効果 */}
      <div
        style={{
          background: "rgba(201,162,39,0.12)",
          border: `1px solid rgba(201,162,39,0.3)`,
          borderRadius: "6px",
          padding: "14px",
          marginBottom: "16px",
        }}
      >
        <p style={{ fontSize: "11px", color: C.gold, fontWeight: 600, marginBottom: "6px" }}>
          ＋ 既存メニューとの相乗効果
        </p>
        <p style={{ fontSize: "12px", color: "rgba(245,240,232,0.8)", lineHeight: 1.7 }}>
          頭皮チェックをきっかけに、カラー・トリートメント・
          ホームケア商品の購入につながるケースが多数。
          客単価アップ＋リピート率向上が期待できます。
        </p>
      </div>

      <p
        style={{
          fontSize: "10px",
          color: "rgba(245,240,232,0.45)",
          lineHeight: 1.6,
          textAlign: "center",
        }}
      >
        ※上記はあくまでも参考試算です。実際の収益は提供内容・地域・客数等により異なります。
        詳細はLINEにてご相談ください。
      </p>
    </section>
  );
}

// ── 10. 初期費用と認定プログラム ──────────────────────────
function Investment() {
  const items = [
    {
      required: true,
      name: "マイクロスコープ（頭皮チェック機器）",
      price: "¥30,000〜80,000",
      note: "市販品でも対応可。THE HERBSの推奨機種あり",
    },
    {
      required: true,
      name: "THE HERBS製品（初回仕入れ）",
      price: "¥30,000〜",
      note: "頭皮ケア用シャンプー・トリートメント等。卸価格で仕入れ可",
    },
    {
      required: false,
      name: "ボタニカルミスト機器",
      price: "要相談",
      note: "導入サポートプランあり。まずはチェックのみでもスタート可",
    },
  ];

  return (
    <section style={{ background: C.cream, padding: "36px 20px" }}>
      <SectionLabel text="INVESTMENT & PROGRAM" />
      <h2
        style={{
          fontSize: "20px",
          fontWeight: 700,
          color: C.darkGreen,
          lineHeight: 1.4,
          marginBottom: "4px",
        }}
      >
        初期費用と
        <br />
        認定プログラム
      </h2>
      <Divider />

      <p
        style={{
          fontSize: "13px",
          color: C.textMid,
          lineHeight: 1.8,
          marginBottom: "20px",
        }}
      >
        大きな設備投資なしに始められます。
        必要な機器はマイクロスコープのみ。
      </p>

      <h3
        style={{
          fontSize: "14px",
          fontWeight: 700,
          color: C.darkGreen,
          marginBottom: "12px",
        }}
      >
        必要なもの
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
        {items.map((item, i) => (
          <div
            key={i}
            style={{
              background: C.white,
              borderRadius: "6px",
              padding: "14px 16px",
              border: `1px solid ${C.creamDark}`,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
              <div style={{ flex: 1 }}>
                <span
                  style={{
                    fontSize: "9px",
                    background: item.required ? C.darkGreen : "rgba(26,60,46,0.15)",
                    color: item.required ? C.gold : C.textMid,
                    padding: "2px 6px",
                    borderRadius: "3px",
                    marginRight: "6px",
                    fontWeight: 600,
                  }}
                >
                  {item.required ? "必須" : "任意"}
                </span>
                <span style={{ fontSize: "13px", fontWeight: 600, color: C.darkGreen }}>
                  {item.name}
                </span>
              </div>
            </div>
            <p style={{ fontSize: "18px", fontWeight: 700, color: C.darkGreen, marginBottom: "4px" }}>
              {item.price}
            </p>
            <p style={{ fontSize: "11px", color: C.textMid }}>{item.note}</p>
          </div>
        ))}
      </div>

      {/* 初期費用目安 */}
      <div
        style={{
          background: C.darkGreen,
          borderRadius: "6px",
          padding: "16px",
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <p style={{ fontSize: "11px", color: "rgba(245,240,232,0.6)", marginBottom: "4px" }}>
            初期費用の目安（最低限）
          </p>
          <p style={{ fontSize: "24px", fontWeight: 700, color: C.gold }}>¥60,000〜</p>
          <p style={{ fontSize: "10px", color: "rgba(245,240,232,0.5)" }}>
            マイクロスコープ＋初回仕入れの合計目安
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: "11px", color: "rgba(245,240,232,0.6)", marginBottom: "4px" }}>
            月5件で初期費用を回収
          </p>
          <p style={{ fontSize: "13px", color: C.goldLight, fontWeight: 600 }}>
            ¥8,000 × 5件
            <br />= ¥40,000 / 月
          </p>
        </div>
      </div>

      {/* 認定プログラム */}
      <div
        style={{
          background: "rgba(26,60,46,0.08)",
          borderRadius: "6px",
          padding: "16px",
          borderLeft: `3px solid ${C.gold}`,
        }}
      >
        <p style={{ fontSize: "12px", fontWeight: 700, color: C.darkGreen, marginBottom: "8px" }}>
          📋 認定プログラム受講費用
        </p>
        <p style={{ fontSize: "12px", color: C.textMid, lineHeight: 1.7 }}>
          技術講習会（1〜2日）の受講費用が別途必要です。
          詳細はLINEでのご相談時にお伝えします。
          <br />
          <strong style={{ color: C.darkGreen }}>
            先行登録者には受講費用の優待を予定しています。
          </strong>
        </p>
      </div>
    </section>
  );
}

// ── 11. パートナーサポート ────────────────────────────────
function PartnerSupport() {
  const supports = [
    {
      icon: "🎓",
      title: "技術・知識サポート",
      items: ["頭皮チェック技術の習得（1〜2日）", "マイクロスコープの使い方", "お客様への説明トーク"],
    },
    {
      icon: "📊",
      title: "データ・ツールサポート",
      items: ["頭皮チェックデータの記録・管理", "経過観察レポートのテンプレート", "お客様向け説明資料"],
    },
    {
      icon: "🛍️",
      title: "商品・仕入れサポート",
      items: ["THE HERBS製品の卸価格提供", "新商品情報の優先案内", "在庫管理のサポート"],
    },
    {
      icon: "📣",
      title: "集客・マーケティング支援",
      items: ["認定サロンとしてのロゴ使用権", "THE HERBSウェブサイトへの掲載", "SNS・集客コンテンツの提供"],
    },
  ];

  return (
    <section style={{ background: C.midGreen, padding: "36px 20px", color: C.cream }}>
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
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
              <span style={{ fontSize: "22px" }}>{s.icon}</span>
              <p style={{ fontSize: "14px", fontWeight: 700, color: C.white }}>{s.title}</p>
            </div>
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
                    ✓
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

// ── 12. こんな方と一緒に ──────────────────────────────────
function WhoWeWelcome() {
  const profiles = [
    {
      icon: "💆‍♀️",
      title: "エステサロン・ヘッドスパ店",
      body: "すでに頭皮・頭部のケアを提供している方。頭皮チェックを加えることで専門性が高まり、客単価・リピート率の向上が見込めます。",
    },
    {
      icon: "✂️",
      title: "美容師（副業・起業を考えている方）",
      body: "スタイリングに集中したい美容師にとって、頭皮ケアは時間的に難しい。でも、頭皮チェックだけなら5〜10分。副業・独立の第一歩として最適です。",
    },
    {
      icon: "🏠",
      title: "自宅サロン・個人事業主",
      body: "大きな設備投資なしに始められます。マイクロスコープ1台から。既存のお客様に新しい価値を提供できます。",
    },
    {
      icon: "🌱",
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
          color: C.darkGreen,
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
              padding: "16px",
              border: `1px solid ${C.creamDark}`,
              display: "flex",
              gap: "12px",
              alignItems: "flex-start",
            }}
          >
            <span style={{ fontSize: "28px", flexShrink: 0 }}>{p.icon}</span>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 700, color: C.darkGreen, marginBottom: "6px" }}>
                {p.title}
              </p>
              <p style={{ fontSize: "12px", color: C.textMid, lineHeight: 1.7 }}>{p.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── 13. 最終CTA ───────────────────────────────────────────
function FinalCTA() {
  return (
    <section style={{ background: C.darkGreen, color: C.cream }}>
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
          まずは説明会・体験会にご参加ください。
          営業は一切ありません。疑問・不安はすべてその場で解消できます。
        </p>

        {/* 説明会・体験会の違い */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "28px" }}>
          <div
            style={{
              flex: 1,
              background: "rgba(255,255,255,0.07)",
              borderRadius: "6px",
              padding: "14px 12px",
              borderTop: `3px solid ${C.orange}`,
            }}
          >
            <p style={{ fontSize: "12px", fontWeight: 700, color: C.white, marginBottom: "6px" }}>
              📅 説明会
            </p>
            <p style={{ fontSize: "11px", color: "rgba(245,240,232,0.7)", lineHeight: 1.6 }}>
              オンライン（Zoom）
              <br />
              約60分
              <br />
              プログラム詳細・Q&A
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
              🌿 体験会
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
            href="https://lin.ee/6GDbcebK"
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
        background: C.darkGreen,
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
          background: C.orange,
          color: C.white,
          textAlign: "center",
          padding: "12px 8px",
          borderRadius: "4px",
          fontWeight: 700,
          fontSize: "13px",
          textDecoration: "none",
        }}
      >
        📅 説明会
      </a>
      <a
        href={TRIAL_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          flex: 1,
          display: "block",
          background: C.midGreen,
          color: C.white,
          textAlign: "center",
          padding: "12px 8px",
          borderRadius: "4px",
          fontWeight: 700,
          fontSize: "13px",
          textDecoration: "none",
          border: `1px solid ${C.lightGreen}`,
        }}
      >
        🌿 体験会
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
      <RevenueFlow />
      <RevenueSimulation />
      <Investment />
      <PartnerSupport />
      <WhoWeWelcome />
      <FinalCTA />
      <FloatingCTA />
    </div>
  );
}
