import { createConnection } from "mysql2/promise";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

config();

async function main() {
  const email = "cx1@the-herbs.co.jp";
  const password = "herbs0024";
  const name = "THE HERBS スタッフ";

  const conn = await createConnection(process.env.DATABASE_URL);

  try {
    // 既存レコードを削除して再登録（ハッシュ方式を修正するため）
    await conn.execute("DELETE FROM staff_accounts WHERE email = ?", [email]);

    const passwordHash = await bcrypt.hash(password, 12);

    await conn.execute(
      "INSERT INTO staff_accounts (email, passwordHash, name, active, createdAt) VALUES (?, ?, ?, 1, NOW())",
      [email, passwordHash, name]
    );

    console.log(`[SUCCESS] スタッフアカウントを登録しました: ${email}`);
    console.log(`[INFO] パスワードハッシュ方式: bcrypt (rounds=12)`);
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error("[ERROR]", err.message);
  process.exit(1);
});
