// LINE_KOBE_ADMIN_USER_ID 設定確認スクリプト
const userId = process.env.LINE_KOBE_ADMIN_USER_ID;
if (!userId) {
  console.log("LINE_KOBE_ADMIN_USER_ID: NOT SET");
  process.exit(1);
} else {
  console.log("LINE_KOBE_ADMIN_USER_ID: SET (length=" + userId.length + ", starts with " + userId.substring(0, 2) + ")");
  process.exit(0);
}
