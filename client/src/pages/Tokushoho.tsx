/**
 * * THE HERBS SCALP LABO 特定商取引法に基づく表記
 * Design: モダン・ウェルネス・スタジオ
 */

import { Link } from "wouter";

function LegalLayout({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[oklch(0.977_0.012_85)]">
      <header className="bg-[oklch(0.22_0.045_42)] py-16">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/">
            <span className="font-sans-jp text-[oklch(0.72_0.12_70)] text-xs tracking-widest hover:text-[oklch(0.82_0.10_75)] transition-colors cursor-pointer flex items-center gap-2 mb-8">
              ← トップページへ戻る
            </span>
          </Link>
          <span className="font-cormorant text-[oklch(0.72_0.12_70)] text-sm tracking-[0.3em] uppercase block mb-3">
            {subtitle}
          </span>
          <h1 className="font-mincho text-white text-3xl md:text-4xl font-bold">{title}</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-sm shadow-sm border border-[oklch(0.88_0.025_75)] p-8 md:p-12">
          {children}
        </div>
      </main>

      <footer className="bg-[oklch(0.22_0.045_42)] py-8 text-center">
        <p className="font-sans-jp text-white/30 text-xs">
          © 2026 THE HERBS SCALP LABO. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

const rows: { label: string; value: React.ReactNode }[] = [
  { label: "販売事業者名", value: "THE HERBS SCALP LABO（株式会社THE HERBS）" },
  { label: "代表者名", value: "代表取締役　山田 太郎（※デモ用表記）" },
  {
    label: "所在地",
    value: (
      <>
        〒000-0000<br />
        東京都渋谷区〇〇町0-0-0 〇〇ビル0F（※デモ用住所）<br />
        <span className="text-[oklch(0.72_0.12_70)] text-xs">※ご請求があった場合は遅滞なく開示します。</span>
      </>
    ),
  },
  { label: "電話番号", value: "03-0000-0000（※デモ用番号）" },
  { label: "メールアドレス", value: "info@scalp-labo.jp（※デモ用アドレス）" },
  { label: "営業時間", value: "10:00〜19:00（月曜定休）" },
  {
    label: "サービス内容",
    value: (
      <ul className="list-disc list-inside space-y-1">
        <li>無料スカルプチェック（頭皮撮影・状態確認）</li>
        <li>THE HERBS SCALP LABO（プレミアムスカルプコース）</li>
        <li>パーソナルケアプログラム</li>
        <li>サブスクリプションプラン（月額定額サービス）</li>
      </ul>
    ),
  },
  {
    label: "販売価格",
    value: (
      <>
        各サービスページに記載の価格（税込）<br />
        無料スカルプチェック：無料<br />
        THE HERBS SCALP LABO：3,000〜5,000円（税込）<br />
        サブスクリプション：月額1,980円〜7,980円（税込）
      </>
    ),
  },
  {
    label: "支払方法",
    value: "現金・クレジットカード（VISA / Mastercard / JCB / AMEX）・電子マネー",
  },
  {
    label: "支払時期",
    value: (
      <>
        店頭サービス：サービス提供後にお支払いください。<br />
        サブスクリプション：毎月1日に自動決済
      </>
    ),
  },
  {
    label: "サービス提供時期",
    value: "ご予約確定後、ご来店日にサービスを提供いたします。",
  },
  {
    label: "キャンセル・返金",
    value: (
      <>
        <p>【ご予約のキャンセル】</p>
        <p>ご予約日の前日17:00までにご連絡いただいた場合、キャンセル料は発生しません。</p>
        <p>前日17:00以降または当日のキャンセルは、キャンセル料（施術料金の50%）が発生する場合があります。</p>
        <br />
        <p>【サブスクリプションの解約】</p>
        <p>マイページまたはお問い合わせフォームから、次回更新日の3日前までにお手続きください。</p>
        <br />
        <p>【返金について】</p>
        <p>サービスの性質上、提供済みのサービスに対する返金は原則対応しておりません。ただし、当社の責に帰すべき事由による場合はこの限りではありません。</p>
      </>
    ),
  },
  {
    label: "特記事項",
    value: (
      <>
        <p>本サービスは医療行為ではありません。疾病の診断・治療・予防を目的とするものではなく、頭皮の状態を記録・確認するサービスです。</p>
        <p>医療的な相談・治療が必要な場合は、医師または医療機関にご相談ください。</p>
      </>
    ),
  },
];

export default function Tokushoho() {
  return (
    <LegalLayout title="特定商取引法に基づく表記" subtitle="Specified Commercial Transaction Act">
      <p className="font-sans-jp text-[oklch(0.55_0.04_42)] text-xs mb-10">
        特定商取引に関する法律第11条に基づき、以下の事項を表示します。
      </p>

      <div className="overflow-hidden rounded-sm border border-[oklch(0.88_0.025_75)]">
        {/* デスクトップ表示 */}
        <table className="w-full hidden sm:table">
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={`border-b border-[oklch(0.88_0.025_75)] last:border-0 ${
                  i % 2 === 0 ? "bg-white" : "bg-[oklch(0.977_0.012_85)]"
                }`}
              >
                <th className="font-mincho text-[oklch(0.22_0.045_42)] text-sm font-bold text-left align-top w-40 md:w-52 px-5 py-4 bg-[oklch(0.955_0.018_82)] border-r border-[oklch(0.88_0.025_75)]">
                  {row.label}
                </th>
                <td className="font-sans-jp text-[oklch(0.38_0.055_42)] text-sm leading-relaxed px-5 py-4">
                  {row.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* モバイル表示（縦積み） */}
        <div className="sm:hidden">
          {rows.map((row, i) => (
            <div
              key={i}
              className={`border-b border-[oklch(0.88_0.025_75)] last:border-0 ${
                i % 2 === 0 ? "bg-white" : "bg-[oklch(0.977_0.012_85)]"
              }`}
            >
              <div className="font-mincho text-[oklch(0.22_0.045_42)] text-xs font-bold px-4 pt-3 pb-1 bg-[oklch(0.955_0.018_82)] border-b border-[oklch(0.88_0.025_75)]">
                {row.label}
              </div>
              <div className="font-sans-jp text-[oklch(0.38_0.055_42)] text-sm leading-relaxed px-4 py-3">
                {row.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 pt-8 border-t border-[oklch(0.88_0.025_75)]">
        <Link href="/">
          <span className="font-sans-jp text-[oklch(0.72_0.12_70)] text-sm underline hover:text-[oklch(0.55_0.10_65)] transition-colors cursor-pointer">
            ← トップページへ戻る
          </span>
        </Link>
      </div>
    </LegalLayout>
  );
}
