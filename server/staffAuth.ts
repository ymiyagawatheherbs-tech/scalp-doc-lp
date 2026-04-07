/**
 * スタッフ認証ロジック
 * メール + パスワード（bcrypt）でスタッフアカウントを管理する
 */
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { ENV } from "./_core/env";
import { getDb } from "./db";
import { staffAccounts } from "../drizzle/schema";
import { eq } from "drizzle-orm";

const STAFF_JWT_COOKIE = "staff_session";
const JWT_EXPIRY = "8h";

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
 * メール + パスワードでスタッフ認証を行う
 * 成功時はJWTトークンを返す
 */
export async function authenticateStaff(
  email: string,
  password: string
): Promise<{ token: string; staff: { id: number; name: string; email: string } } | null> {
  const db = await getDb();
  if (!db) return null;

  const [staff] = await db
    .select()
    .from(staffAccounts)
    .where(eq(staffAccounts.email, email.toLowerCase().trim()))
    .limit(1);

  if (!staff || !staff.active) return null;

  const valid = await bcrypt.compare(password, staff.passwordHash);
  if (!valid) return null;

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
