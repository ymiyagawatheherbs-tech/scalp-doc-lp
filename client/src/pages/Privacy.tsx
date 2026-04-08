/**
 * * THE HERBS SCALP LABO プライバシーポリシー
 * Design: モダン・ウェルネス・スタジオ
 */

import { Link } from "wouter";

function LegalLayout({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[oklch(0.977_0.012_85)]">
      {/* ヘッダー */}
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

      {/* 本文 */}
      <main className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white rounded-sm shadow-sm border border-[oklch(0.88_0.025_75)] p-8 md:p-12">
          {children}
        </div>
      </main>

      {/* フッター */}
      <footer className="bg-[oklch(0.22_0.045_42)] py-8 text-center">
        <p className="font-sans-jp text-white/30 text-xs">
          © 2026 THE HERBS SCALP LABO. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h2 className="font-mincho text-[oklch(0.22_0.045_42)] text-lg font-bold mb-4 pb-2 border-b border-[oklch(0.88_0.025_75)]">
        {title}
      </h2>
      <div className="font-sans-jp text-[oklch(0.38_0.055_42)] text-sm leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  );
}

export default function Privacy() {
  return (
    <LegalLayout title="プライバシーポリシー" subtitle="Privacy Policy">
      <p className="font-sans-jp text-[oklch(0.55_0.04_42)] text-xs mb-10">
        制定日：2025年1月1日　最終改定日：2025年3月1日
      </p>

      <p className="font-sans-jp text-[oklch(0.38_0.055_42)] text-sm leading-relaxed mb-10">
        THE HERBS SCALP LABO（以下「当社」）は、お客様の個人情報の保護を重要な責務と認識し、以下のプライバシーポリシーに従って個人情報を適切に取り扱います。
      </p>

      <Section title="第1条　個人情報の定義">
        <p>
          本ポリシーにおける「個人情報」とは、個人情報保護法に定める個人情報、すなわち生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、その他の記述等により特定の個人を識別できるものをいいます。
        </p>
      </Section>

      <Section title="第2条　収集する個人情報">
        <p>当社は、以下の個人情報を収集することがあります。</p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>氏名</li>
          <li>電話番号</li>
          <li>メールアドレス</li>
          <li>ご希望の予約日時・コース</li>
          <li>頭皮の撮影画像および計測データ</li>
          <li>ご相談内容・ご要望</li>
          <li>当社サービスのご利用履歴</li>
        </ul>
      </Section>

      <Section title="第3条　個人情報の利用目的">
        <p>当社は、収集した個人情報を以下の目的のために利用します。</p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>ご予約の受付・確認・管理</li>
          <li>サービスのご提供および品質向上</li>
          <li>頭皮チェック結果の記録・管理・共有（お客様の同意がある場合）</li>
          <li>お客様へのご連絡・ご案内</li>
          <li>サービスに関するお問い合わせへの対応</li>
          <li>統計データの作成（個人を特定できない形式に加工した上で使用）</li>
        </ul>
      </Section>

      <Section title="第4条　個人情報の第三者提供">
        <p>
          当社は、以下の場合を除き、お客様の個人情報を第三者に提供しません。
        </p>
        <ul className="list-disc list-inside space-y-1 pl-2">
          <li>お客様の同意がある場合</li>
          <li>法令に基づく場合</li>
          <li>人の生命・身体・財産の保護のために必要な場合</li>
          <li>提携医療機関への情報共有（お客様の明示的な同意がある場合のみ）</li>
        </ul>
      </Section>

      <Section title="第5条　個人情報の安全管理">
        <p>
          当社は、個人情報の漏洩、滅失、毀損を防止するため、適切な安全管理措置を講じます。また、個人情報を取り扱う従業員に対して、適切な監督を行います。
        </p>
      </Section>

      <Section title="第6条　個人情報の開示・訂正・削除">
        <p>
          お客様は、当社が保有するご自身の個人情報について、開示・訂正・追加・削除・利用停止を請求することができます。ご請求の際は、本人確認のうえ対応いたします。
        </p>
        <p>
          お問い合わせ先：THE HERBS SCALP LABO 個人情報担当窓口<br />
          メール：privacy@scalp-labo.jp（※デモ用アドレスです）
        </p>
      </Section>

      <Section title="第7条　Cookieの使用">
        <p>
          当社ウェブサイトでは、サービス改善およびアクセス解析のためにCookieを使用することがあります。ブラウザの設定によりCookieを無効にすることができますが、一部機能が利用できなくなる場合があります。
        </p>
      </Section>

      <Section title="第8条　プライバシーポリシーの変更">
        <p>
          当社は、法令の変更やサービス内容の変更に応じて、本ポリシーを改定することがあります。改定後のポリシーは、当ウェブサイトに掲載した時点から効力を生じるものとします。
        </p>
      </Section>

      <Section title="第9条　お問い合わせ">
        <p>
          本ポリシーに関するお問い合わせは、以下の窓口までご連絡ください。
        </p>
        <p>
          THE HERBS SCALP LABO 個人情報保護担当<br />
          メール：privacy@scalp-labo.jp（※デモ用アドレスです）
        </p>
      </Section>

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
