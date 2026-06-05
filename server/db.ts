import { asc, desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { certifiedSalons, InsertCertifiedSalon, InsertUser, InsertSalonLead, salonLeads, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.

// ===== 認定サロン =====

export async function getCertifiedSalons(prefecture?: string) {
  const db = await getDb();
  if (!db) return [];
  const query = db.select().from(certifiedSalons)
    .where(eq(certifiedSalons.published, 1))
    .orderBy(asc(certifiedSalons.sortOrder), asc(certifiedSalons.createdAt));
  const results = await query;
  if (prefecture) {
    return results.filter(s => s.prefecture === prefecture);
  }
  return results;
}

export async function getAllCertifiedSalonsAdmin() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(certifiedSalons)
    .orderBy(asc(certifiedSalons.sortOrder), asc(certifiedSalons.createdAt));
}

export async function createCertifiedSalon(data: InsertCertifiedSalon) {
  const db = await getDb();
  if (!db) throw new Error('DB not available');
  await db.insert(certifiedSalons).values(data);
}

export async function updateCertifiedSalon(id: number, data: Partial<InsertCertifiedSalon>) {
  const db = await getDb();
  if (!db) throw new Error('DB not available');
  await db.update(certifiedSalons).set(data).where(eq(certifiedSalons.id, id));
}

export async function deleteCertifiedSalon(id: number) {
  const db = await getDb();
  if (!db) throw new Error('DB not available');
  await db.delete(certifiedSalons).where(eq(certifiedSalons.id, id));
}

// ===== ビフォーアフター =====

import { beforeAfters, testimonials, blogPosts, serviceMenus, InsertBeforeAfter, InsertTestimonial, InsertBlogPost, InsertServiceMenu } from "../drizzle/schema";

export async function getBeforeAfters(gender?: string) {
  const db = await getDb();
  if (!db) return [];
  const results = await db.select().from(beforeAfters)
    .where(eq(beforeAfters.published, 1))
    .orderBy(asc(beforeAfters.sortOrder), asc(beforeAfters.createdAt));
  if (gender && gender !== 'both') {
    return results.filter(b => b.gender === gender || b.gender === 'both');
  }
  return results;
}

export async function getAllBeforeAftersAdmin() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(beforeAfters).orderBy(asc(beforeAfters.sortOrder), asc(beforeAfters.createdAt));
}

export async function createBeforeAfter(data: InsertBeforeAfter) {
  const db = await getDb();
  if (!db) throw new Error('DB not available');
  await db.insert(beforeAfters).values(data);
}

export async function updateBeforeAfter(id: number, data: Partial<InsertBeforeAfter>) {
  const db = await getDb();
  if (!db) throw new Error('DB not available');
  await db.update(beforeAfters).set(data).where(eq(beforeAfters.id, id));
}

export async function deleteBeforeAfter(id: number) {
  const db = await getDb();
  if (!db) throw new Error('DB not available');
  await db.delete(beforeAfters).where(eq(beforeAfters.id, id));
}

// ===== お客様の声 =====

export async function getTestimonials(gender?: string) {
  const db = await getDb();
  if (!db) return [];
  const results = await db.select().from(testimonials)
    .where(eq(testimonials.published, 1))
    .orderBy(asc(testimonials.sortOrder), asc(testimonials.createdAt));
  if (gender && gender !== 'both') {
    return results.filter(t => t.gender === gender || t.gender === 'both');
  }
  return results;
}

export async function getAllTestimonialsAdmin() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(testimonials).orderBy(asc(testimonials.sortOrder), asc(testimonials.createdAt));
}

export async function createTestimonial(data: InsertTestimonial) {
  const db = await getDb();
  if (!db) throw new Error('DB not available');
  await db.insert(testimonials).values(data);
}

export async function updateTestimonial(id: number, data: Partial<InsertTestimonial>) {
  const db = await getDb();
  if (!db) throw new Error('DB not available');
  await db.update(testimonials).set(data).where(eq(testimonials.id, id));
}

export async function deleteTestimonial(id: number) {
  const db = await getDb();
  if (!db) throw new Error('DB not available');
  await db.delete(testimonials).where(eq(testimonials.id, id));
}

// ===== ブログ =====

export async function getBlogPosts(category?: string) {
  const db = await getDb();
  if (!db) return [];
  const { desc } = await import("drizzle-orm");
  const results = await db.select().from(blogPosts)
    .where(eq(blogPosts.status, 'published'))
    .orderBy(desc(blogPosts.publishedAt));
  if (category) {
    return results.filter(p => p.category === category);
  }
  return results;
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(blogPosts)
    .where(eq(blogPosts.slug, slug)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllBlogPostsAdmin() {
  const db = await getDb();
  if (!db) return [];
  const { desc } = await import("drizzle-orm");
  return db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
}

export async function createBlogPost(data: InsertBlogPost) {
  const db = await getDb();
  if (!db) throw new Error('DB not available');
  await db.insert(blogPosts).values(data);
}

export async function updateBlogPost(id: number, data: Partial<InsertBlogPost>) {
  const db = await getDb();
  if (!db) throw new Error('DB not available');
  await db.update(blogPosts).set(data).where(eq(blogPosts.id, id));
}

export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error('DB not available');
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
}

// ===== メニュー・料金 =====

export async function getServiceMenus(category?: string, gender?: string, salonId?: string, showInListOnly = false) {
  const db = await getDb();
  if (!db) return [];
  const results = await db.select().from(serviceMenus)
    .where(eq(serviceMenus.published, 1))
    .orderBy(asc(serviceMenus.sortOrder), asc(serviceMenus.createdAt));
  return results.filter(m => {
    if (category && m.category !== category) return false;
    if (gender && gender !== 'both' && m.gender !== gender && m.gender !== 'both') return false;
    // salonIdフィルター: 指定店舗 or both のメニューのみ表示
    if (salonId && salonId !== 'both' && m.salonId !== salonId && m.salonId !== 'both') return false;
    // showInListフィルター: お客様向けリストは表示フラグが1のもののみ
    if (showInListOnly && m.showInList !== 1) return false;
    return true;
  });
}

export async function getAllServiceMenusAdmin() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(serviceMenus).orderBy(asc(serviceMenus.sortOrder), asc(serviceMenus.createdAt));
}

export async function createServiceMenu(data: InsertServiceMenu) {
  const db = await getDb();
  if (!db) throw new Error('DB not available');
  await db.insert(serviceMenus).values(data);
}

export async function updateServiceMenu(id: number, data: Partial<InsertServiceMenu>) {
  const db = await getDb();
  if (!db) throw new Error('DB not available');
  await db.update(serviceMenus).set(data).where(eq(serviceMenus.id, id));
}

export async function deleteServiceMenu(id: number) {
  const db = await getDb();
  if (!db) throw new Error('DB not available');
  await db.delete(serviceMenus).where(eq(serviceMenus.id, id));
}

// ========== salonLeads ==========

export async function createSalonLead(data: InsertSalonLead) {
  const db = await getDb();
  if (!db) throw new Error('DB not available');
  const [result] = await db.insert(salonLeads).values(data);
  return result;
}

/** トークンを発行してリードに保存する（72時間有効） */
export async function issueSalonLeadToken(leadId: number, token: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('DB not available');
  const expiresAt = Date.now() + 72 * 60 * 60 * 1000; // 72時間後
  await db.update(salonLeads)
    .set({ accessToken: token, tokenExpiresAt: expiresAt })
    .where(eq(salonLeads.id, leadId));
}

/** トークンを検証して有効なリードを返す。無効・期限切れの場合はnull */
export async function verifySalonLeadToken(token: string) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(salonLeads).where(eq(salonLeads.accessToken, token));
  if (rows.length === 0) return null;
  const lead = rows[0];
  if (!lead.tokenExpiresAt || Date.now() > lead.tokenExpiresAt) return null;
  return lead;
}

/** 新しいトークンを再発行してリードに保存する（72時間有効） */
export async function reissueSalonLeadToken(leadId: number, token: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('DB not available');
  const expiresAt = Date.now() + 72 * 60 * 60 * 1000;
  await db.update(salonLeads)
    .set({ accessToken: token, tokenExpiresAt: expiresAt })
    .where(eq(salonLeads.id, leadId));
}

/** リードのステータスを更新する */
export async function updateSalonLeadStatus(
  leadId: number,
  status: 'new' | 'contacted' | 'converted' | 'archived'
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('DB not available');
  await db.update(salonLeads)
    .set({ status })
    .where(eq(salonLeads.id, leadId));
}

export async function getAllSalonLeads() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(salonLeads).orderBy(desc(salonLeads.createdAt));
}

// ─── 予約ブロック管理 ───────────────────────────────────────────────────────

/** 指定店舗・日付のブロック一覧を取得する */
export async function getReservationBlocks(salonId?: string, blockDate?: string) {
  const db = await getDb();
  if (!db) return [];
  const { reservationBlocks } = await import("../drizzle/schema");
  const results = await db.select().from(reservationBlocks).orderBy(desc(reservationBlocks.createdAt));
  return results.filter(b => {
    if (salonId && b.salonId !== salonId && b.salonId !== "both") return false;
    if (blockDate && b.blockDate !== blockDate) return false;
    return true;
  });
}

/** 予約ブロックを作成する */
export async function createReservationBlock(data: {
  salonId: "hankyu" | "salon" | "both";
  blockDate: string;
  blockTime?: string | null;
  reason?: string | null;
  createdBy?: string | null;
}) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const { reservationBlocks } = await import("../drizzle/schema");
  await db.insert(reservationBlocks).values({
    salonId: data.salonId,
    blockDate: data.blockDate,
    blockTime: data.blockTime ?? null,
    reason: data.reason ?? null,
    createdBy: data.createdBy ?? null,
  });
}

/** 予約ブロックを削除する */
export async function deleteReservationBlock(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB not available");
  const { reservationBlocks } = await import("../drizzle/schema");
  await db.delete(reservationBlocks).where(eq(reservationBlocks.id, id));
}

/** 指定日・時間がブロックされているか確認する */
export async function isSlotBlocked(salonId: string, date: string, time: string): Promise<boolean> {
  const blocks = await getReservationBlocks(salonId, date);
  return blocks.some(b => b.blockTime === null || b.blockTime === time);
}
