import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * 予約テーブル — 無料スカルプチェックおよびケアコースの予約情報を管理する
 */
export const reservations = mysqlTable("reservations", {
  id: int("id").autoincrement().primaryKey(),
  /** 予約者氏名 */
  name: varchar("name", { length: 128 }).notNull(),
  /** 電話番号 */
  phone: varchar("phone", { length: 32 }).notNull(),
  /** メールアドレス（任意） */
  email: varchar("email", { length: 320 }),
  /** 希望日（YYYY-MM-DD） */
  desiredDate: varchar("desiredDate", { length: 16 }).notNull(),
  /** 希望時間（HH:MM） */
  desiredTime: varchar("desiredTime", { length: 8 }).notNull(),
  /** コース種別: free / standard / personal / consult */
  plan: varchar("plan", { length: 32 }).notNull(),
  /** ご質問・ご要望（任意） */
  message: text("message"),
  /** 性別区分（LP種別）: women / men */
  gender: mysqlEnum("gender", ["women", "men"]).default("women").notNull(),
  /** ステータス: pending / confirmed / cancelled */
  status: mysqlEnum("status", ["pending", "confirmed", "cancelled"]).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Reservation = typeof reservations.$inferSelect;
export type InsertReservation = typeof reservations.$inferInsert;

/**
 * 頭皮画像ファイルテーブル — S3に保存した頭皮チェック画像のメタデータを管理する
 */
export const scalpImages = mysqlTable("scalp_images", {
  id: int("id").autoincrement().primaryKey(),
  /** ファイルのS3キー */
  fileKey: varchar("fileKey", { length: 512 }).notNull(),
  /** 公開URL */
  url: text("url").notNull(),
  /** MIMEタイプ */
  mimeType: varchar("mimeType", { length: 64 }).notNull(),
  /** ファイルサイズ（バイト） */
  fileSize: int("fileSize"),
  /** オリジナルファイル名 */
  originalName: varchar("originalName", { length: 256 }),
  /** アップロードしたユーザーのopenId（任意） */
  uploaderOpenId: varchar("uploaderOpenId", { length: 64 }),
  /** 関連する予約ID（任意） */
  reservationId: int("reservationId"),
  /** 備考（施術日・部位など） */
  note: text("note"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ScalpImage = typeof scalpImages.$inferSelect;
export type InsertScalpImage = typeof scalpImages.$inferInsert;