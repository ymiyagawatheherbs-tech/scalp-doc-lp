/**
 * スタッフ認証ロジック
 * メール + パスワード（bcrypt）でスタッフアカウントを管理する
 * ブルートフォース対策: 5回失敗で30分ロック
 */
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { ENV } from "./_core/env";
import { getDb } from "./db";
import { staffAccounts, loginAttempts } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

const STAFF_JWT_COOKIE = "staff_session";
const JWT_EXPIRY = "8h";

/** ロックまでの最大失敗回数 */
const MAX_FAIL_COUNT = 5;
/** ロック時間（30分） */
const LOCK_DURATION_MS = 30 * 60 * 1000;
/** 失敗回数リセットまでの時間（15分） */
const RESET_WINDOW_MS = 15 * 60 * 1000;

function getJwtSecret(): Uint8Array {
  return new TextEncoder().encode(ENV.cookieSecret + "_staff");
}

/**
 * パスワードをハッシュ化する
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

/**
 * ログイン試行状態をチェックする
 * @returns { locked: true, lockedUntil } | { locked: false }
 */
export async function checkLoginAttempts(
  ipAddress: string,
  email: string
): Promise<{ locked: boolean; lockedUntil?: number; failCount?: number }> {
  const db = await getDb();
  if (!db) return { locked: false };

  const normalizedEmail = email.toLowerCase().trim();
  const now = Date.now();

  const [record] = await db
    .select()
    .from(loginAttempts)
    .where(and(eq(loginAttempts.ipAddress, ipAddress), eq(loginAttempts.email, normalizedEmail)))
    .limit(1);

  if (!record) return { locked: false };

  // ロック中の場合
  if (record.lockedUntil && record.lockedUntil > now) {
    return { locked: true, lockedUntil: record.lockedUntil };
  }

  // リセットウィンドウを超えた場合はリセット
  const lastAttemptMs = new Date(record.lastAttemptAt).getTime();
  if (now - lastAttemptMs > RESET_WINDOW_MS) {
    await db
      .update(loginAttempts)
      .set({ failCount: 0, lockedUntil: null, lastAttemptAt: new Date() })
      .where(and(eq(loginAttempts.ipAddress, ipAddress), eq(loginAttempts.email, normalizedEmail)));
    return { locked: false };
  }

  return { locked: false, failCount: record.failCount };
}

/**
 * ログイン失敗を記録する
 * 5回失敗でアカウントを30分ロックする
 */
export async function recordLoginFailure(
  ipAddress: string,
  email: string
): Promise<{ locked: boolean; lockedUntil?: number; failCount: number }> {
  const db = await getDb();
  if (!db) return { locked: false, failCount: 0 };

  const normalizedEmail = email.toLowerCase().trim();
  const now = Date.now();

  const [existing] = await db
    .select()
    .from(loginAttempts)
    .where(and(eq(loginAttempts.ipAddress, ipAddress), eq(loginAttempts.email, normalizedEmail)))
    .limit(1);

  const newFailCount = (existing?.failCount ?? 0) + 1;
  const shouldLock = newFailCount >= MAX_FAIL_COUNT;
  const lockedUntil = shouldLock ? now + LOCK_DURATION_MS : null;

  if (!existing) {
    await db.insert(loginAttempts).values({
      ipAddress,
      email: normalizedEmail,
      failCount: newFailCount,
      lockedUntil,
      lastAttemptAt: new Date(),
    });
  } else {
    await db
      .update(loginAttempts)
      .set({ failCount: newFailCount, lockedUntil, lastAttemptAt: new Date() })
      .where(and(eq(loginAttempts.ipAddress, ipAddress), eq(loginAttempts.email, normalizedEmail)));
  }

  return { locked: shouldLock, lockedUntil: lockedUntil ?? undefined, failCount: newFailCount };
}

/**
 * ログイン成功時に試行記録をリセットする
 */
export async function resetLoginAttempts(ipAddress: string, email: string): Promise<void> {
  const db = await getDb();
  if (!db) return;
  const normalizedEmail = email.toLowerCase().trim();
  await db
    .update(loginAttempts)
    .set({ failCount: 0, lockedUntil: null, lastAttemptAt: new Date() })
    .where(and(eq(loginAttempts.ipAddress, ipAddress), eq(loginAttempts.email, normalizedEmail)));
}

/**
 * メール + パスワードでスタッフ認証を行う
 * 成功時はJWTトークンを返す
 * ブルートフォース対策: 5回失敗で30分ロック
 */
export async function authenticateStaff(
  email: string,
  password: string,
  ipAddress: string = "unknown"
): Promise<
  | { token: string; staff: { id: number; name: string; email: string } }
  | { error: "locked"; lockedUntil: number }
  | null
> {
  // ロック確認
  const lockStatus = await checkLoginAttempts(ipAddress, email);
  if (lockStatus.locked && lockStatus.lockedUntil) {
    return { error: "locked", lockedUntil: lockStatus.lockedUntil };
  }

  const db = await getDb();
  if (!db) return null;

  const [staff] = await db
    .select()
    .from(staffAccounts)
    .where(eq(staffAccounts.email, email.toLowerCase().trim()))
    .limit(1);

  if (!staff || !staff.active) {
    // アカウントが存在しない場合も失敗記録（ユーザー列挙攻撃対策）
    await recordLoginFailure(ipAddress, email);
    return null;
  }

  const valid = await bcrypt.compare(password, staff.passwordHash);
  if (!valid) {
    const result = await recordLoginFailure(ipAddress, email);
    if (result.locked && result.lockedUntil) {
      return { error: "locked", lockedUntil: result.lockedUntil };
    }
    return null;
  }

  // 成功時はリセット
  await resetLoginAttempts(ipAddress, email);

  const token = await new SignJWT({ staffId: staff.id, email: staff.email, name: staff.name })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRY)
    .sign(getJwtSecret());

  return { token, staff: { id: staff.id, name: staff.name, email: staff.email } };
}

/**
 * JWTトークンを検証してスタッフ情報を返す
 */
export async function verifyStaffToken(
  token: string
): Promise<{ staffId: number; email: string; name: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return {
      staffId: payload.staffId as number,
      email: payload.email as string,
      name: payload.name as string,
    };
  } catch {
    return null;
  }
}

export { STAFF_JWT_COOKIE };

/**
 * スタッフアカウントを作成する（初期セットアップ用）
 */
export async function createStaffAccount(
  name: string,
  email: string,
  password: string
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  const passwordHash = await hashPassword(password);
  try {
    await db.insert(staffAccounts).values({
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      active: 1,
    });
    return true;
  } catch {
    return false;
  }
}
