# スカルプ・ドック LP デザインアイデア

## コンセプト整理
サービス：頭皮の定期検診「スカルプ・ドック」
ターゲット：20〜50代の男女（予防ケア層、ダメージケア層、美容意識層、育毛ケア層）
メッセージ：「歯医者さんに行くように、頭皮も定期的にチェックする」

---

<response>
<text>

## アイデア A：「クリニカル・ナチュラル」

**Design Movement**: Japanese Minimalist Medical × Organic Wellness

**Core Principles**:
1. 清潔感と信頼感を両立させる「医療的ミニマリズム」
2. 白と深緑を基調にした自然由来の安心感
3. 余白を贅沢に使い、情報の優先順位を明確化
4. 左寄せのタイポグラフィで読みやすさを最優先

**Color Philosophy**:
- ベース：オフホワイト (#F8F6F1) — 清潔だが冷たくない温かみ
- プライマリ：深緑 (#2D5016) — 自然・健康・信頼
- アクセント：テラコッタ (#C4622D) — CTA・強調
- テキスト：チャコール (#1A1A1A)

**Layout Paradigm**:
非対称2カラムレイアウト。左側にテキスト、右側に大きなビジュアル。スクロールに連れてセクションが交互に入れ替わる。

**Signature Elements**:
1. 顕微鏡の円形フレームを模したビジュアル要素
2. 細い横線（ルール）で区切られた診断カルテ風のデータ表示
3. 歯科検診との対比を示すアイコンペア

**Interaction Philosophy**:
ゆっくりとしたフェードイン。スクロール連動のプログレスバー。ホバー時に微細な拡大。

**Animation**:
- スクロール時：translateY(20px) → translateY(0) + opacity 0→1、duration 0.6s ease-out
- カードホバー：scale(1.02) + shadow強化、duration 0.2s
- CTAボタン：背景色のゆっくりした移行

**Typography System**:
- 見出し：Noto Serif JP（重厚感と信頼性）
- 本文：Noto Sans JP（読みやすさ）
- 数字：Playfair Display（洗練されたアクセント）

</text>
<probability>0.07</probability>
</response>

<response>
<text>

## アイデア B：「モダン・ウェルネス・スタジオ」（採用）

**Design Movement**: Contemporary Japanese Wellness × Premium Studio

**Core Principles**:
1. 「検診」の専門性と「ライフスタイル」の親しみやすさの融合
2. 縦長のフルスクリーンセクションで没入感を演出
3. 温かみのあるベージュ×ダークブラウンのアースカラー
4. 大胆なタイポグラフィで視覚的インパクトを創出

**Color Philosophy**:
- ベース：クリーム (#FAF7F2) — 温かく清潔な印象
- プライマリ：ディープブラウン (#2C1810) — 高級感・信頼
- アクセント：ゴールデンアンバー (#C8902A) — 特別感・プレミアム
- サブ：セージグリーン (#7A9E7E) — 健康・自然
- テキスト：ダークブラウン (#1C1008)

**Layout Paradigm**:
フルスクリーンセクション積み重ね型。各セクションが独立したシーンとして機能。ヒーローは大胆な文字とビジュアルの重なり。

**Signature Elements**:
1. 円形のマイクロスコープ画像フレーム（頭皮の可視化を象徴）
2. 数字を大きく表示するデータビジュアライゼーション
3. 歯科検診との対比を示すアナロジービジュアル

**Interaction Philosophy**:
スムーズなスクロールアニメーション。数字のカウントアップ演出。セクション切り替え時のスライドイン。

**Animation**:
- ヒーロー：テキストが上からフェードイン、stagger 0.1s
- 統計数字：カウントアップアニメーション（Intersection Observer）
- カード：左右交互にスライドイン
- CTAボタン：ゴールドのシマーエフェクト

**Typography System**:
- 大見出し：Shippori Mincho B1（日本語の格調）
- 英語アクセント：Cormorant Garamond（エレガンス）
- 本文：Noto Sans JP（読みやすさ）
- 数字：Cormorant Garamond（洗練）

</text>
<probability>0.09</probability>
</response>

<response>
<text>

## アイデア C：「テック・ウェルネス」

**Design Movement**: Health-Tech × Data Visualization

**Core Principles**:
1. データと科学的根拠を前面に出したテクノロジー感
2. ダークモードベースで先進性を演出
3. グラフ・チャートを積極的に活用
4. グリッドラインとモノスペースフォントでデータ感を強調

**Color Philosophy**:
- ベース：ダークネイビー (#0A0E1A)
- プライマリ：エレクトリックティール (#00D4AA)
- アクセント：ビビッドコーラル (#FF6B6B)
- テキスト：ライトグレー (#E8EAF0)

**Layout Paradigm**:
ダッシュボード風のグリッドレイアウト。データカードが並ぶ情報密度の高いデザイン。

**Signature Elements**:
1. リアルタイム風の頭皮スコアメーター
2. 時系列グラフ（改善の可視化）
3. AIスコアの数値表示

**Interaction Philosophy**:
インタラクティブなデータ表示。ホバーでデータポイントが展開。

**Animation**:
- グラフの描画アニメーション
- 数値のカウントアップ
- グロー効果のパルスアニメーション

**Typography System**:
- 見出し：Space Grotesk
- 本文：DM Sans
- データ：JetBrains Mono

</text>
<probability>0.06</probability>
</response>

---

## 採用：アイデア B「モダン・ウェルネス・スタジオ」

温かみのあるアースカラーと大胆なタイポグラフィで、専門性と親しみやすさを両立。
一般消費者が「行ってみたい」と感じる高級ウェルネスサロンの雰囲気を演出する。
