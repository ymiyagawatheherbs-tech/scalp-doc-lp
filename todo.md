- [x] /bookingページにLINE予約オプションを追加（フォーム入力とLINEの2択）
- [x] 神戸阪急店の予約時間帯を10:30〜に変更
- [x] 予約注意事項（ご希望に添えない場合あり・返信をもって確定・余裕を持ったご予約）を追加
- [x] THE HERBSサロンをSquare予約システム（https://book.squareup.com/appointments/jsufqo133zf3ec/location/LEWSC49JS30BF/services）へ直接誘導
- [x] Home.tsxの全CTAボタン（今すぐ予約・無料チェックを予約など）を/bookingへ誘導
- [x] 神戸阪急店にも「まずは相談したい」コースを追加（Booking.tsx）
- [x] Booking.tsxの予約フローを再設計：LINEフォロワーが直接フォーム入力できる構造に変更（LINEで予約ボタンを廃止、神戸阪急店はフォーム、THE HERBSサロンはSquare直接誘導）
- [x] Booking.tsxの店舗名を修正：「スカルプラボ 神戸阪急店」→「THE HERBS神戸阪急店」、「スカルプラボ THE HERBSサロン」→「THE HERBSサロン」
- [x] Home.tsxの「認定サロンになりませんか？」セクションを非表示にする（内容確定後に再表示予定）
- [x] サイト全体のブランド名を「THE HERBS SCALP LAB」に変更（タイトル・ナビ・メタタグ・フッター・Home.tsx・Booking.tsx等）
- [ ] LINE Messaging API連携：神戸阪急店フォーム送信時に@theherbs_kobeへ予約通知を送信
- [ ] LINE Messaging API連携：THE HERBSサロン（Square誘導）フォーム送信時に@theherbs39へ通知
- [ ] LINEアクセストークン・シークレットをSecretsに登録- [x] SEO修正：タイトルを 30～60文字に変更（キーワード含む）
- [x] SEO修正：metaキーワード・ description追加- [x] SEO修正：altテキストが未設定の画像を修正
- [x] LINE Messaging API連携：中止（2026-04-06）
- [ ] 神戸阪急店フォーム送信時にcx@the-herbs.co.jpへメール通知を送る機能を実装
- [ ] メール通知先をcx1@the-herbs.co.jpに修正（SMTP_USERとenv.tsのnotifyEmail）
- [x] LPのサロン名を「スカルプラボ神戸阪急店」→「THE HERBS神戸阪急店」に変更
- [x] LPのサロン名を「スカルプラボ植物美容サロン」→「THE HERBS植物美容サロン」に変更
- [x] ファビコンをlogomark_olive.webpに変更
- [x] 申し込みページ（Booking.tsx）のロゴ横ブランド名のサイズを修正

## マーケティング改修（2026-04-10）

### Home.tsx（レディース向けLP）
- [ ] ブランド表記を「THE HERBS SCALP LABO」に統一（ロゴ・タイトル・meta）
- [ ] FVコピーに「植物の力で、10年後も豊かな髪を育む新習慣。」を追加
- [ ] FVのCTAボタンを「まずは無料で頭皮の今を知る（LINE予約）」1つに統合
- [ ] FV直下に「化粧品製造会社 THE HERBS が開発した独自の植物美容メソッド」帯を追加
- [ ] 「なぜTHE HERBSの植物美容なのか」教育コンテンツセクションを新設（OUR CONCEPTとOUR SERVICESの間）
- [ ] スマホ固定フローティング予約ボタン（LINE直結モーダル）を追加
- [ ] ページ下部にBtoB向けバナー（サロン経営者向け）を追加

### SalonPartner.tsx（サロン向けLP）
- [ ] ブランド表記を「THE HERBS SCALP LABO」に統一

## LINE登録→ステップ配信→予約分岐フロー実装（2026-04-10）

- [ ] FV CTAをTHE HERBSメインLINEアカウント登録ボタンに変更（Home.tsx）
- [ ] FV CTAをTHE HERBSメインLINEアカウント登録ボタンに変更（MenHome.tsx）
- [ ] LINE予約モーダルを廃止・フローティングボタンもLINE登録に変更
- [ ] ステップ配信シナリオをNotionに保存

## LINEアカウント構造修正（2026-04-10）

- [ ] Home.tsx・MenHome.tsx：FVボタン・フローティングボタンを一般向けメイン（https://lin.ee/ulWWzab）に変更
- [ ] Home.tsx・MenHome.tsx：神戸阪急店カードのLINEボタンを阪急顧客向け（https://lin.ee/P8Jppiu）に変更
- [ ] Home.tsx・MenHome.tsx：植物美容サロンカードのLINEボタンは一般向けメイン（https://lin.ee/ulWWzab）のまま確認
- [ ] SalonPartner.tsx：LINEボタンをサロンアカウント（https://lin.ee/UF8T8TX）に変更
- [ ] Notionシナリオ設計書の基本方針・アカウント定義を正しく修正

## ナビCTA統一・ステップ配信文案充実（2026-04-10）
- [x] Home.tsx：ナビ右上「無料チェックを予約」→「LINEで無料相談」（lin.ee/ulWWzab）に変更
- [x] MenHome.tsx：ナビ右上CTAを同様にLINE登録ボタンに変更
- [x] Notionステップ配信シナリオ（Day0〜Day21）のメッセージ文案を充実させる（Square URL反映・現在設定欄修正）

## FAQセクションにLINE登録Q&A追加（2026-04-10）
- [x] Home.tsx：FAQセクションにLINE登録関連Q&Aを３件追加（何が届く？・勧誘は？・費用は？）
- [x] MenHome.tsx：同様にLINE登録関連Q&Aを３件追加

## ナビロゴ ブランドヒエラルキー修正（2026-04-10）
- [x] 親ブランド「THE HERBS」ロゴを大きく上位に、子ブランド「SCALP LABO」を小さく下位に配置
- [x] Home.tsx・MenHome.tsx・SalonPartner.tsx 3ページに適用

## ロゴ拡大・サロンバナー非表示・既存顧客案内（2026-04-10）- [x] THE HERBSロゴを（28pxに拡大・左揃え修正（Home.tsx・MenHome.tsx・SalonPartner.tsx）
- [x] サロン向けバナー・リンクを非表示（Home.tsx・MenHome.tsx）
- [x] FAQに既存顧客向け予約案内Q&Aを追記（LINEまたはお電話で）

## ロゴ左端揃え修正（2026-04-10）
- [x] THE HERBSロゴ画像の内部左余白を打ち消し、SCALP LABOと左端を完全に揃える（Home.tsx・MenHome.tsx・SalonPartner.tsx）

## ロゴずれ解消・ヒーローフォント調整（2026-04-10）
- [x] THE HERBSロゴとSCALP LABOの左端ずれを根本的に解消（ロゴ画像左余白を計算しmarginLeft: -17pxで補正、）3ページ）
- [x] ヒーローセクションのフォントサイズを読みやすく縮小（Home.tsx・MenHome.tsx）

## FV LINEリンクをLステップに変更（2026-04-10）
- [x] Home.tsxのFV LINEリンクをhttps://line.me/ti/p/%40492wjowbに変更
- [x] MenHome.tsxのFV LINEリンクをhttps://line.me/ti/p/%40492wjowbに変更

## ファビコン・ページタイトル変更（2026-04-11）
- [x] 新ロゴマーク画像（logomark_olive.webp）をCDNにアップロードしてファビコンに設定
- [x] ページタイトルを「THE HERBS スカルプラボ　頭皮チェック・スカルプケアを始めよう」に変更

## LINEリンク全箇所をLステップに統一（2026-04-11）
- [x] Home.tsxの全LINEリンク（ナビ・フッター・CTA・店舗データ）をhttps://line.me/ti/p/%40492wjowbに変更（6箇所）
- [x] MenHome.tsxの全LINEリンク（ナビ・フッター・CTA・店舗データ）をhttps://line.me/ti/p/%40492wjowbに変更（6箇所）

## OGPタイトル統一（2026-04-11）
- [x] og:titleを「THE HERBS スカルプラボ　頭皮チェック・スカルプケアを始めよう」に変更
- [x] twitter:titleを同タイトルに変更

## ナビLINEボタン削除・右下LINEリンク修正（2026-04-12）
- [x] Home.tsxのナビ右上「LINEで無料相談」ボタンを削除
- [x] Home.tsxの右下固定LINEボタンを常時表示に変更（スクロール不要）
- [x] MenHome.tsxのナビ右上「LINEで無料相談」ボタンを削除
- [x] MenHome.tsxに右下固定LINEボタンを新規追加（グリーンデザイン）

## LINEリンク遷移不具合修正（2026-04-12）
- [ ] LINEリンクをクリックしても遷移しない原因を調査・修正

## 「神戸阪急店」誤字修正（2026-04-13）
- [x] routers.tsの101・121行の「THE HERBS神戸阥急店」（存在しない漢字）を「THE HERBS神戸阪急店」に修正

## ホームケアのご紹介セクション追加（2026-04-15）
- [x] Home.tsxのサービス紹介下・FAQ上に「ホームケアのご紹介」セクションを追加（公式通販: https://herb-esthe.com）
- [x] MenHome.tsxの同位置に同セクションを追加（メンズページのダークテーマに合わせたデザイン）

## フッターオンラインショップリンクテキスト変更（2026-04-15）
- [x] Home.tsxのフッター「オンラインショップ」→「公式オンラインショップ（ボタニカルコスメ・頭皮ケア用品）」
- [x] MenHome.tsxのフッター同様に変更

## ホームケアセクション改修（2026-04-15）
- [x] ホームケアセクションの絵文字（🌿）を削除（Home.tsx・MenHome.tsx）
- [x] herb-esthe.comから商品画像を1〜2点取得してCDNにアップロード
- [x] ホームケアセクションに商品画像を追加（Home.tsx・MenHome.tsx）

## ホームケアセクション商品差し替え（2026-04-15）
- [x] herb-esthe.comでヘアオイルリーシュの商品画像を取得・CDNアップロード
- [x] Home.tsx・MenHome.tsxのホームケアセクション「みなも」→「ヘアオイルリーシュ」に差し替え

## 商品サイズ感の調整（2026-04-15）
- [x] Home.tsx・MenHome.tsxのホームケアセクション商品カードのサイズ感を調整（シャンプーラヴェ250mL vs ヘアオイルリーシュ30mLの容量差を視覚的に表現）

## ホームケアセクション集合写真への差し替え（2026-04-15）
- [x] BF9I3824.jpgをCDNにアップロード
- [x] Home.tsx・MenHome.tsxの個別商品カード2点を削除し、集合写真1枚に差し替え

## ヘッダーボタン変更（2026-04-17）
- [x] Home.tsx・MenHome.tsxのヘッダー右上「LINE登録」→「予約する」に変更

## iPadヘッダー予約ボタン修正（2026-04-17）
- [x] Home.tsx・MenHome.tsxのヘッダー予約ボタンをiPad（768px～1024px）でも表示・タップできるよう修正

## LINE URL変更（2026-04-19）
- [x] Home.tsx（レディース版）のLINE URLを https://lin.ee/wN9kf8T に変更（4箇所）
- [x] MenHome.tsx（メンズ版）のLINE URLを https://lin.ee/9PDAzxc に変更（4箇所）
