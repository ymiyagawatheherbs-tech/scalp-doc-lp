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

## ヘッダーロゴ差替・中央テキスト削除（2026-04-10）
- [x] THE HERBSロゴ（白背景）を透遊PNGに変換してCDNアップロード
- [x] Home.tsx：ヘッダー中央「PRESENTED BY THE HERBS」削除、左上ロゴを正式ロゴ画像に差替
- [x] MenHome.tsx：同様の修正
- [x] SalonPartner.tsx：同様の修正

## ナビロゴ構成修正（2026-04-10）
- [ ] Home.tsx：スカルプラボロゴマーク＋SCALP LABOテキスト＋THE HERBSロゴ画像の3点セットに修正
- [ ] MenHome.tsx：同様の修正
- [ ] SalonPartner.tsx：同様の修正
