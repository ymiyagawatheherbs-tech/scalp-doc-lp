import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, bigint } from "drizzle-orm/mysql-core";

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
  /** 予約経路: web / phone / walkin */
  source: mysqlEnum("source", ["web", "phone", "walkin"]).default("web").notNull(),
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

/**
 * スタッフテーブル — メール+パスワード認証で管理画面にログインするスタッフアカウント
 */
export const staffAccounts = mysqlTable("staff_accounts", {
  id: int("id").autoincrement().primaryKey(),
  /** スタッフ名 */
  name: varchar("name", { length: 64 }).notNull(),
  /** ログイン用メールアドレス */
  email: varchar("email", { length: 320 }).notNull().unique(),
  /** bcryptハッシュ化されたパスワード */
  passwordHash: varchar("passwordHash", { length: 256 }).notNull(),
  /** 有効フラグ */
  active: int("active").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type StaffAccount = typeof staffAccounts.$inferSelect;
export type InsertStaffAccount = typeof staffAccounts.$inferInsert;

/**
 * 認定サロンテーブル — THE HERBS SCALP LAB認定パートナーサロンの一覧を管理する
 */
export const certifiedSalons = mysqlTable("certified_salons", {
  id: int("id").autoincrement().primaryKey(),
  /** サロン名 */
  name: varchar("name", { length: 128 }).notNull(),
  /** 都道府県 */
  prefecture: varchar("prefecture", { length: 16 }).notNull(),
  /** 市区町村・エリア */
  city: varchar("city", { length: 64 }).notNull(),
  /** 住所（番地まで） */
  address: text("address"),
  /** 電話番号 */
  phone: varchar("phone", { length: 32 }),
  /** 公式サイトURL */
  websiteUrl: text("websiteUrl"),
  /** InstagramなどSNSのURL */
  snsUrl: text("snsUrl"),
  /** サロンの紹介文 */
  description: text("description"),
  /** サロン画像URL（S3） */
  imageUrl: text("imageUrl"),
  /** 対応メニュー（カンマ区切り）: scalp_check, scalp_care, hair_growth, etc. */
  services: text("services"),
  /** 表示順（小さいほど上位） */
  sortOrder: int("sortOrder").default(0).notNull(),
  /** 公開フラグ: 1=公開, 0=非公開 */
  published: int("published").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CertifiedSalon = typeof certifiedSalons.$inferSelect;
export type InsertCertifiedSalon = typeof certifiedSalons.$inferInsert;

/**
 * ビフォーアフターテーブル — 施術前後の写真と説明を管理する
 */
export const beforeAfters = mysqlTable("before_afters", {
  id: int("id").autoincrement().primaryKey(),
  /** タイトル（例：うねり・広がりケア） */
  title: varchar("title", { length: 128 }).notNull(),
  /** ビフォー画像URL（S3） */
  beforeImageUrl: text("beforeImageUrl").notNull(),
  /** アフター画像URL（S3） */
  afterImageUrl: text("afterImageUrl").notNull(),
  /** 施術期間（例：7ヶ月後） */
  period: varchar("period", { length: 64 }),
  /** 対象性別: women / men / both */
  gender: mysqlEnum("gender", ["women", "men", "both"]).default("both").notNull(),
  /** 施術内容の説明 */
  description: text("description"),
  /** 表示順（小さいほど上位） */
  sortOrder: int("sortOrder").default(0).notNull(),
  /** 公開フラグ: 1=公開, 0=非公開 */
  published: int("published").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BeforeAfter = typeof beforeAfters.$inferSelect;
export type InsertBeforeAfter = typeof beforeAfters.$inferInsert;

/**
 * お客様の声テーブル — レビュー・お客様の声を管理する
 */
export const testimonials = mysqlTable("testimonials", {
  id: int("id").autoincrement().primaryKey(),
  /** お客様のお名前（例：A様、田中様） */
  customerName: varchar("customerName", { length: 64 }).notNull(),
  /** 年代（例：40代女性） */
  customerAge: varchar("customerAge", { length: 32 }),
  /** お悩みタグ（例：うねり・薄毛） */
  concern: varchar("concern", { length: 128 }),
  /** 評価（1〜5） */
  rating: int("rating").default(5).notNull(),
  /** お客様の声テキスト */
  content: text("content").notNull(),
  /** お客様の写真URL（任意・S3） */
  imageUrl: text("imageUrl"),
  /** 対象性別: women / men / both */
  gender: mysqlEnum("gender", ["women", "men", "both"]).default("both").notNull(),
  /** 表示順（小さいほど上位） */
  sortOrder: int("sortOrder").default(0).notNull(),
  /** 公開フラグ: 1=公開, 0=非公開 */
  published: int("published").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

/**
 * ブログ記事テーブル — スタッフが投稿するブログ・コラムを管理する
 */
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  /** 記事タイトル */
  title: varchar("title", { length: 256 }).notNull(),
  /** URLスラッグ（英数字・ハイフン） */
  slug: varchar("slug", { length: 256 }).notNull().unique(),
  /** サムネイル画像URL（S3） */
  thumbnailUrl: text("thumbnailUrl"),
  /** 記事の概要（一覧表示用） */
  excerpt: text("excerpt"),
  /** 記事本文（Markdown形式） */
  content: text("content").notNull(),
  /** カテゴリ（例：頭皮ケア, 植物美容, スタッフコラム） */
  category: varchar("category", { length: 64 }),
  /** タグ（カンマ区切り） */
  tags: text("tags"),
  /** 投稿者名 */
  authorName: varchar("authorName", { length: 64 }),
  /** ステータス: draft=下書き, published=公開 */
  status: mysqlEnum("status", ["draft", "published"]).default("draft").notNull(),
  /** 公開日時 */
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * メニュー・料金テーブル — サービスメニューと料金を管理する
 */
export const serviceMenus = mysqlTable("service_menus", {
  id: int("id").autoincrement().primaryKey(),
  /** メニュー名 */
  name: varchar("name", { length: 128 }).notNull(),
  /** カテゴリ（例：スカルプケア, 育毛, ヘッドスパ） */
  category: varchar("category", { length: 64 }).notNull(),
  /** 所要時間（分） */
  durationMin: int("durationMin"),
  /** 料金（円） */
  price: int("price").notNull(),
  /** 料金表示テキスト（例：「税込」「〜より」） */
  priceLabel: varchar("priceLabel", { length: 64 }),
  /** メニューの説明 */
  description: text("description"),
  /** 対象性別: women / men / both */
  gender: mysqlEnum("gender", ["women", "men", "both"]).default("both").notNull(),
  /** 表示順（小さいほど上位） */
  sortOrder: int("sortOrder").default(0).notNull(),
  /** 公開フラグ: 1=公開, 0=非公開 */
  published: int("published").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ServiceMenu = typeof serviceMenus.$inferSelect;
export type InsertServiceMenu = typeof serviceMenus.$inferInsert;

/**
 * サロンパートナー資料請求リードテーブル — /salonページのフォームから送信された問い合わせ情報を管理する
 */
export const salonLeads = mysqlTable("salon_leads", {
  id: int("id").autoincrement().primaryKey(),
  /** お名前 */
  name: varchar("name", { length: 128 }).notNull(),
  /** メールアドレス */
  email: varchar("email", { length: 320 }).notNull(),
  /** 業種・活動内容: hair_salon / head_spa / esthetic / nail_lash / seitai / individual / corporate / not_yet / side_job / other */
  occupation: varchar("occupation", { length: 64 }).notNull(),
  /** 業種「その他」の場合の自由記述 */
  occupationOther: varchar("occupationOther", { length: 256 }),
  /** ステータス: new / contacted / converted / archived */
  status: mysqlEnum("status", ["new", "contacted", "converted", "archived"]).default("new").notNull(),
  /** 備考・メモ */
  note: text("note"),
  /** 資料ページアクセス用ワンタイムトークン（nanoid 32文字） */
  accessToken: varchar("accessToken", { length: 64 }).unique(),
  /** トークン有効期限（Unixミリ秒） */
  tokenExpiresAt: bigint("tokenExpiresAt", { mode: "number" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SalonLead = typeof salonLeads.$inferSelect;
export type InsertSalonLead = typeof salonLeads.$inferInsert;

/**
 * ログイン試行記録テーブル — ブルートフォース攻撃対策のためのログイン失敗記録
 * IPアドレスまたはメールアドレス単位で試行回数を管理する
 */
export const loginAttempts = mysqlTable("login_attempts", {
  id: int("id").autoincrement().primaryKey(),
  /** 試行元IPアドレス */
  ipAddress: varchar("ipAddress", { length: 64 }).notNull(),
  /** 試行されたメールアドレス */
  email: varchar("email", { length: 320 }).notNull(),
  /** 失敗回数 */
  failCount: int("failCount").default(0).notNull(),
  /** ロック解除時刻（Unixミリ秒）。nullの場合はロックなし */
  lockedUntil: bigint("lockedUntil", { mode: "number" }),
  /** 最終試行時刻 */
  lastAttemptAt: timestamp("lastAttemptAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LoginAttempt = typeof loginAttempts.$inferSelect;
export type InsertLoginAttempt = typeof loginAttempts.$inferInsert;
