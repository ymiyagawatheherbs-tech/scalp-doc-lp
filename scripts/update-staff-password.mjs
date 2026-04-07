import { createConnection } from "mysql2/promise";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

config();

async function main() {
  const email = "cx1@the-herbs.co.jp";
  const newPassword = "x4QvgkpO1)W-sw5";

  const conn = await createConnection(process.env.DATABASE_URL);

  try {
    const passwordHash = await bcrypt.hash(newPassword, 12);

    const [result] = await conn.execute(
      "UPDATE staff_accounts SET passwordHash = ?, updatedAt = NOW() WHERE email = ?",
      [passwordHash, email]
    );

    if (result.affectedRows > 0) {
      console.log(`[SUCCESS] パスワードを更新しました: ${email}`);
    } else {
      console.log(`[WARN] 対象アカウントが見つかりません: ${email}`);
    }
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error("[ERROR]", err.message);
  process.exit(1);
});
