import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, staffOrManusProcedure, router } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import { getDb, getCertifiedSalons, getAllCertifiedSalonsAdmin, createCertifiedSalon, updateCertifiedSalon, deleteCertifiedSalon, getBeforeAfters, getAllBeforeAftersAdmin, createBeforeAfter, updateBeforeAfter, deleteBeforeAfter, getTestimonials, getAllTestimonialsAdmin, createTestimonial, updateTestimonial, deleteTestimonial, getBlogPosts, getBlogPostBySlug, getAllBlogPostsAdmin, createBlogPost, updateBlogPost, deleteBlogPost, getServiceMenus, getAllServiceMenusAdmin, createServiceMenu, updateServiceMenu, deleteServiceMenu, createSalonLead, getAllSalonLeads, issueSalonLeadToken, verifySalonLeadToken, reissueSalonLeadToken, updateSalonLeadStatus } from "./db";
import { reservations, scalpImages, staffAccounts } from "../drizzle/schema";
import { authenticateStaff, verifyStaffToken, createStaffAccount, STAFF_JWT_COOKIE } from "./staffAuth";
import { storagePut } from "./storage";
import { desc } from "drizzle-orm";
import { z } from "zod";
import { nanoid } from "nanoid";
import { sendBookingNotification, sendCustomerConfirmation, sendBookingConfirmed, sendSalonLeadNotification } from "./mailer";
import { notifyReservationViaLine, notifyConfirmedViaLine, notifyCancelledViaLine } from "./lineNotify";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  /**
   * 予約ルーター
   */
  reservation: router({
    create: publicProcedure
      .input(
        z.object({
          name: z.string().min(1),
          phone: z.string().min(1),
          email: z.string().optional(),
          desiredDate: z.string().min(1).refine((val) => {
            // 当日予約不可：翌日以降のみ許可（ローカル日付基準）
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const y = tomorrow.getFullYear();
            const m = String(tomorrow.getMonth() + 1).padStart(2, "0");
            const d = String(tomorrow.getDate()).padStart(2, "0");
            const minDate = `${y}-${m}-${d}`;
            return val >= minDate;
          }, { message: "当日予約はお電話にて承ります。070-2642-7366までお問い合わせください。" }),
          desiredTime: z.string().min(1),
          plan: z.enum(["free", "standard", "personal", "consult"]),
          message: z.string().optional(),
          gender: z.enum(["women", "men"]).default("women"),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("DB unavailable");

        await db.insert(reservations).values({
          name: input.name,
          phone: input.phone,
          email: input.email || null,
          desiredDate: input.desiredDate,
          desiredTime: input.desiredTime,
          plan: input.plan,
          message: input.message || null,
          gender: input.gender,
          status: "pending",
        });

        const planLabel: Record<string, string> = {
          free: "無料スカルプチェック",
          standard: "スカルプラボ定期ケア",
          personal: "パーソナルスカルプケア",
          consult: "相談希望",
        };
        await notifyOwner({
          title: `【新規予約】${input.name}様 — ${planLabel[input.plan] ?? input.plan}`,
          content: `日時: ${input.desiredDate} ${input.desiredTime}\n電話: ${input.phone}\nメール: ${input.email || "未記入"}\nメッセージ: ${input.message || "なし"}`,
        }).catch(() => {});

        // LINE公式アカウントへ管理者向けプッシュ通知（フォロワーへの配信は行わない）
        await notifyReservationViaLine({
          store: "kobe",
          name: input.name,
          phone: input.phone,
          email: input.email,
          desiredDate: input.desiredDate,
          desiredTime: input.desiredTime,
          plan: input.plan,
          message: input.message,
        }).catch((err) => console.error("[reservation] LINE push notification failed:", err));

        // Outlook SMTP経由でcx@the-herbs.co.jpへメール通知
        const courseMap: Record<string, string> = {
          free: "free_check",
          standard: "regular_care",
          personal: "regular_care",
          consult: "consultation",
        };
        const submittedAt = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
        await sendBookingNotification({
          storeName: "THE HERBS神戸阪急店",
          name: input.name,
          phone: input.phone,
          email: input.email || "未記入",
          course: courseMap[input.plan] ?? input.plan,
          preferredDate: input.desiredDate,
          preferredTime: input.desiredTime,
          message: input.message,
          submittedAt,
        }).catch((err) => console.error("[reservation] email notification failed:", err));

        // メールアドレスを入力した場合のみ、お客様向け確認メールを送信
        if (input.email) {
          await sendCustomerConfirmation({
            name: input.name,
            phone: input.phone,
            email: input.email,
            course: courseMap[input.plan] ?? input.plan,
            preferredDate: input.desiredDate,
            preferredTime: input.desiredTime,
            storeName: "THE HERBS神戸阪急店",
            message: input.message,
            submittedAt,
          }).catch((err) => console.error("[reservation] customer confirmation failed:", err));
        }

        return { success: true };
      }),

    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(reservations).orderBy(desc(reservations.createdAt)).limit(100);
    }),

    // 管理者・スタッフ向け：ステータス更新（スタッフまたはManus認証必須）
    updateStatus: staffOrManusProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["pending", "confirmed", "cancelled"]),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("DB unavailable");
        const { eq } = await import("drizzle-orm");

        // 確定に変更する場合、お客様にメール通知
        if (input.status === "confirmed") {
          const [reservation] = await db
            .select()
            .from(reservations)
            .where(eq(reservations.id, input.id))
            .limit(1);
          if (reservation?.email) {
            const courseMap: Record<string, string> = {
              free: "free_check",
              standard: "regular_care",
              personal: "regular_care",
              consult: "consultation",
            };
            await sendBookingConfirmed({
              name: reservation.name,
              email: reservation.email,
              course: courseMap[reservation.plan] ?? reservation.plan,
              preferredDate: reservation.desiredDate,
              preferredTime: reservation.desiredTime,
              storeName: "THE HERBS神戸阪急店",
              phone: reservation.phone,
            }).catch((err) => console.error("[reservation] booking confirmed mail failed:", err));
          }
          // 確定時：スタッフのLINEへ通知
          if (reservation) {
            await notifyConfirmedViaLine({
              store: "kobe",
              name: reservation.name,
              phone: reservation.phone,
              email: reservation.email ?? undefined,
              desiredDate: reservation.desiredDate,
              desiredTime: reservation.desiredTime,
              plan: reservation.plan,
            }).catch((err) => console.error("[reservation] LINE confirmed notify failed:", err));
          }
        }
        // キャンセル時：スタッフのLINEへ通知
        if (input.status === "cancelled") {
          const [reservation] = await db
            .select()
            .from(reservations)
            .where(eq(reservations.id, input.id))
            .limit(1);
          if (reservation) {
            await notifyCancelledViaLine({
              store: "kobe",
              name: reservation.name,
              phone: reservation.phone,
              email: reservation.email ?? undefined,
              desiredDate: reservation.desiredDate,
              desiredTime: reservation.desiredTime,
              plan: reservation.plan,
            }).catch((err) => console.error("[reservation] LINE cancelled notify failed:", err));
          }
        }
        await db
          .update(reservations)
          .set({ status: input.status })
          .where(eq(reservations.id, input.id));
        return { success: true };
      }),

    // 管理者向け：全件取得（スタッフまたはManus認証必須）
    adminList: staffOrManusProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(reservations).orderBy(desc(reservations.createdAt)).limit(500);
    }),

    // 管理者向け：月別取得（カレンダー用）
    adminListByMonth: staffOrManusProcedure
      .input(z.object({ year: z.number(), month: z.number() }))
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];
        const { and, gte, lte } = await import("drizzle-orm");
        const y = input.year;
        const m = String(input.month).padStart(2, "0");
        const start = `${y}-${m}-01`;
        const lastDay = new Date(y, input.month, 0).getDate();
        const end = `${y}-${m}-${String(lastDay).padStart(2, "0")}`;
        return db
          .select()
          .from(reservations)
          .where(and(gte(reservations.desiredDate, start), lte(reservations.desiredDate, end)))
          .orderBy(reservations.desiredDate, reservations.desiredTime);
      }),

    // スタッフ向け：手動予約登録（電話・来店予約）
    adminCreate: staffOrManusProcedure
      .input(
        z.object({
          name: z.string().min(1),
          phone: z.string().min(1),
          email: z.string().optional(),
          desiredDate: z.string().min(1),
          desiredTime: z.string().min(1),
          plan: z.enum(["free", "standard", "personal", "consult"]),
          message: z.string().optional(),
          gender: z.enum(["women", "men"]).default("women"),
          source: z.enum(["web", "phone", "walkin"]).default("phone"),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("DB unavailable");
        await db.insert(reservations).values({
          name: input.name,
          phone: input.phone,
          email: input.email || null,
          desiredDate: input.desiredDate,
          desiredTime: input.desiredTime,
          plan: input.plan,
          message: input.message || null,
          gender: input.gender,
          source: input.source,
          status: "confirmed",
        });
        return { success: true };
      }),

    // 管理者向け：予約削除
    adminDelete: staffOrManusProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("DB unavailable");
        const { eq } = await import("drizzle-orm");
        await db.delete(reservations).where(eq(reservations.id, input.id));
        return { success: true };
      }),
  }),

  /**
   * スタッフ認証ルーター
   */
  staff: router({
    // ログイン
    login: publicProcedure
      .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
      .mutation(async ({ input, ctx }) => {
        // IPアドレス取得（プロキシ経由の場合はx-forwarded-forを使用）
        const req = ctx.req as any;
        const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0]?.trim()
          ?? req.socket?.remoteAddress
          ?? "unknown";

        const result = await authenticateStaff(input.email, input.password, ip);
        if (!result) throw new Error("メールアドレスまたはパスワードが正しくありません");

        // ロックエラーの場合
        if ("error" in result) {
          const unlockTime = new Date(result.lockedUntil).toLocaleTimeString("ja-JP", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Tokyo",
          });
          throw new Error(`ログイン試行回数が上限に達しました。${unlockTime}までアカウントがロックされています。`);
        }

        // Cookieにセット
        (ctx.res as any).setHeader(
          "Set-Cookie",
          `${STAFF_JWT_COOKIE}=${result.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=28800`
        );
        return { success: true, staff: result.staff };
      }),

    // ログアウト
    logout: publicProcedure.mutation(async ({ ctx }) => {
      (ctx.res as any).setHeader(
        "Set-Cookie",
        `${STAFF_JWT_COOKIE}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
      );
      return { success: true };
    }),

    // 現在のセッション確認
    me: publicProcedure.query(async ({ ctx }) => {
      const cookieHeader = (ctx.req as any).headers.cookie ?? "";
      const match = cookieHeader.match(new RegExp(`${STAFF_JWT_COOKIE}=([^;]+)`));
      if (!match) return null;
      return verifyStaffToken(match[1]);
    }),

    // スタッフアカウント作成（管理者のみ：Manus OAuth認証済みユーザー）
    createAccount: protectedProcedure
      .input(z.object({ name: z.string().min(1), email: z.string().email(), password: z.string().min(8) }))
      .mutation(async ({ input }) => {
        const ok = await createStaffAccount(input.name, input.email, input.password);
        if (!ok) throw new Error("アカウント作成に失敗しました（メールアドレスが重複している可能性があります）");
        return { success: true };
      }),

    // パスワード変更（スタッフ本人またはManus管理者）
    changePassword: staffOrManusProcedure
      .input(z.object({ email: z.string().email(), newPassword: z.string().min(8) }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("DB unavailable");
        const { eq } = await import("drizzle-orm");
        const { hashPassword } = await import("./staffAuth");
        const passwordHash = await hashPassword(input.newPassword);
        const result = await db
          .update(staffAccounts)
          .set({ passwordHash })
          .where(eq(staffAccounts.email, input.email.toLowerCase().trim()));
        return { success: true };
      }),

    // スタッフ一覧（管理者のみ）
    list: protectedProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db
        .select({ id: staffAccounts.id, name: staffAccounts.name, email: staffAccounts.email, active: staffAccounts.active, createdAt: staffAccounts.createdAt })
        .from(staffAccounts)
        .orderBy(desc(staffAccounts.createdAt));
    }),
  }),

  /**
   * ファイルストレージルーター
   */
  storage: router({
    uploadScalpImage: publicProcedure
      .input(
        z.object({
          dataUrl: z.string(),
          originalName: z.string().optional(),
          reservationId: z.number().optional(),
          note: z.string().optional(),
          uploaderOpenId: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("DB unavailable");

        const matches = input.dataUrl.match(/^data:([^;]+);base64,(.+)$/);
        if (!matches) throw new Error("Invalid image data");
        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2], "base64");

        const extMap: Record<string, string> = {
          "image/jpeg": "jpg",
          "image/png": "png",
          "image/webp": "webp",
          "image/gif": "gif",
        };
        const ext = extMap[mimeType] ?? "jpg";
        const fileKey = `scalp-images/${nanoid(8)}.${ext}`;

        const { url } = await storagePut(fileKey, buffer, mimeType);

        await db.insert(scalpImages).values({
          fileKey,
          url,
          mimeType,
          fileSize: buffer.byteLength,
          originalName: input.originalName ?? null,
          uploaderOpenId: input.uploaderOpenId ?? null,
          reservationId: input.reservationId ?? null,
          note: input.note ?? null,
        });

        return { success: true, url, fileKey };
      }),

    listScalpImages: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(scalpImages).orderBy(desc(scalpImages.createdAt)).limit(50);
    }),

    // コンテンツ管理用汎用画像アップロード（スタッフまたはManus認証必須）
    uploadContentImage: staffOrManusProcedure
      .input(
        z.object({
          dataUrl: z.string(),
          originalName: z.string().optional(),
          folder: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const matches = input.dataUrl.match(/^data:([^;]+);base64,(.+)$/);
        if (!matches) throw new Error("Invalid image data");
        const mimeType = matches[1];
        const buffer = Buffer.from(matches[2], "base64");
        const extMap: Record<string, string> = {
          "image/jpeg": "jpg",
          "image/png": "png",
          "image/webp": "webp",
          "image/gif": "gif",
          "image/heic": "heic",
        };
        const ext = extMap[mimeType] ?? "jpg";
        const folderName = input.folder ?? "content";
        const fileKey = `${folderName}/${nanoid(12)}.${ext}`;
        const { url } = await storagePut(fileKey, buffer, mimeType);
        return { success: true, url, fileKey };
      }),
  }),

  /**
   * ビフォーアフタールーター
   */
  beforeAfter: router({
    list: publicProcedure
      .input(z.object({ gender: z.string().optional() }))
      .query(async ({ input }) => getBeforeAfters(input.gender)),

    listAdmin: staffOrManusProcedure.query(() => getAllBeforeAftersAdmin()),

    create: staffOrManusProcedure
      .input(z.object({
        title: z.string().min(1),
        beforeImageUrl: z.string().min(1),
        afterImageUrl: z.string().min(1),
        period: z.string().optional(),
        gender: z.enum(['women', 'men', 'both']).default('both'),
        description: z.string().optional(),
        sortOrder: z.number().optional(),
        published: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await createBeforeAfter({
          title: input.title,
          beforeImageUrl: input.beforeImageUrl,
          afterImageUrl: input.afterImageUrl,
          period: input.period ?? null,
          gender: input.gender,
          description: input.description ?? null,
          sortOrder: input.sortOrder ?? 0,
          published: input.published ?? 1,
        });
        return { success: true };
      }),

    update: staffOrManusProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        beforeImageUrl: z.string().optional(),
        afterImageUrl: z.string().optional(),
        period: z.string().optional(),
        gender: z.enum(['women', 'men', 'both']).optional(),
        description: z.string().optional(),
        sortOrder: z.number().optional(),
        published: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateBeforeAfter(id, data);
        return { success: true };
      }),

    delete: staffOrManusProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteBeforeAfter(input.id);
        return { success: true };
      }),
  }),

  /**
   * お客様の声ルーター
   */
  testimonial: router({
    list: publicProcedure
      .input(z.object({ gender: z.string().optional() }))
      .query(async ({ input }) => getTestimonials(input.gender)),

    listAdmin: staffOrManusProcedure.query(() => getAllTestimonialsAdmin()),

    create: staffOrManusProcedure
      .input(z.object({
        customerName: z.string().min(1),
        customerAge: z.string().optional(),
        concern: z.string().optional(),
        rating: z.number().min(1).max(5).default(5),
        content: z.string().min(1),
        imageUrl: z.string().optional(),
        gender: z.enum(['women', 'men', 'both']).default('both'),
        sortOrder: z.number().optional(),
        published: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await createTestimonial({
          customerName: input.customerName,
          customerAge: input.customerAge ?? null,
          concern: input.concern ?? null,
          rating: input.rating,
          content: input.content,
          imageUrl: input.imageUrl ?? null,
          gender: input.gender,
          sortOrder: input.sortOrder ?? 0,
          published: input.published ?? 1,
        });
        return { success: true };
      }),

    update: staffOrManusProcedure
      .input(z.object({
        id: z.number(),
        customerName: z.string().optional(),
        customerAge: z.string().optional(),
        concern: z.string().optional(),
        rating: z.number().min(1).max(5).optional(),
        content: z.string().optional(),
        imageUrl: z.string().optional(),
        gender: z.enum(['women', 'men', 'both']).optional(),
        sortOrder: z.number().optional(),
        published: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateTestimonial(id, data);
        return { success: true };
      }),

    delete: staffOrManusProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteTestimonial(input.id);
        return { success: true };
      }),
  }),

  /**
   * ブログルーター
   */
  blog: router({
    list: publicProcedure
      .input(z.object({ category: z.string().optional() }))
      .query(async ({ input }) => getBlogPosts(input.category)),

    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => getBlogPostBySlug(input.slug)),

    listAdmin: staffOrManusProcedure.query(() => getAllBlogPostsAdmin()),

    create: staffOrManusProcedure
      .input(z.object({
        title: z.string().min(1),
        slug: z.string().min(1),
        thumbnailUrl: z.string().optional(),
        excerpt: z.string().optional(),
        content: z.string().min(1),
        category: z.string().optional(),
        tags: z.string().optional(),
        authorName: z.string().optional(),
        status: z.enum(['draft', 'published']).default('draft'),
        publishedAt: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        await createBlogPost({
          title: input.title,
          slug: input.slug,
          thumbnailUrl: input.thumbnailUrl ?? null,
          excerpt: input.excerpt ?? null,
          content: input.content,
          category: input.category ?? null,
          tags: input.tags ?? null,
          authorName: input.authorName ?? null,
          status: input.status,
          publishedAt: input.status === 'published' ? (input.publishedAt ?? new Date()) : null,
        });
        return { success: true };
      }),

    update: staffOrManusProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        slug: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        excerpt: z.string().optional(),
        content: z.string().optional(),
        category: z.string().optional(),
        tags: z.string().optional(),
        authorName: z.string().optional(),
        status: z.enum(['draft', 'published']).optional(),
        publishedAt: z.date().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        if (data.status === 'published' && !data.publishedAt) {
          (data as any).publishedAt = new Date();
        }
        await updateBlogPost(id, data);
        return { success: true };
      }),

    delete: staffOrManusProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteBlogPost(input.id);
        return { success: true };
      }),
  }),

  /**
   * メニュー・料金ルーター
   */
  menu: router({
    list: publicProcedure
      .input(z.object({ category: z.string().optional(), gender: z.string().optional() }))
      .query(async ({ input }) => getServiceMenus(input.category, input.gender)),

    listAdmin: staffOrManusProcedure.query(() => getAllServiceMenusAdmin()),

    create: staffOrManusProcedure
      .input(z.object({
        name: z.string().min(1),
        nameKana: z.string().optional(),
        category: z.string().min(1),
        durationMin: z.number().optional(),
        price: z.number(),
        priceLabel: z.string().optional(),
        description: z.string().optional(),
        treatmentContent: z.string().optional(),
        targetCustomer: z.string().optional(),
        imageUrl: z.string().optional(),
        gender: z.enum(['women', 'men', 'both']).default('both'),
        sortOrder: z.number().optional(),
        published: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await createServiceMenu({
          name: input.name,
          nameKana: input.nameKana ?? null,
          category: input.category,
          durationMin: input.durationMin ?? null,
          price: input.price,
          priceLabel: input.priceLabel ?? null,
          description: input.description ?? null,
          treatmentContent: input.treatmentContent ?? null,
          targetCustomer: input.targetCustomer ?? null,
          imageUrl: input.imageUrl ?? null,
          gender: input.gender,
          sortOrder: input.sortOrder ?? 0,
          published: input.published ?? 1,
        });
        return { success: true };
      }),

    update: staffOrManusProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        nameKana: z.string().optional(),
        category: z.string().optional(),
        durationMin: z.number().optional(),
        price: z.number().optional(),
        priceLabel: z.string().optional(),
        description: z.string().optional(),
        treatmentContent: z.string().optional(),
        targetCustomer: z.string().optional(),
        imageUrl: z.string().optional(),
        gender: z.enum(['women', 'men', 'both']).optional(),
        sortOrder: z.number().optional(),
        published: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateServiceMenu(id, data);
        return { success: true };
      }),

    delete: staffOrManusProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteServiceMenu(input.id);
        return { success: true };
      }),
  }),

  /**
   * 認定サロンルーター
   */
  salon: router({
    /** 公開中の認定サロン一覧（都道府県フィルター対応） */
    list: publicProcedure
      .input(z.object({ prefecture: z.string().optional() }))
      .query(async ({ input }) => {
        return getCertifiedSalons(input.prefecture);
      }),

    /** 管理者用：全サロン一覧（非公開含む） */
    listAdmin: staffOrManusProcedure.query(async () => {
      return getAllCertifiedSalonsAdmin();
    }),

    /** 管理者用：サロン登録 */
    create: staffOrManusProcedure
      .input(z.object({
        name: z.string().min(1),
        prefecture: z.string().min(1),
        city: z.string().min(1),
        address: z.string().optional(),
        phone: z.string().optional(),
        websiteUrl: z.string().optional(),
        snsUrl: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        services: z.string().optional(),
        sortOrder: z.number().optional(),
        published: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await createCertifiedSalon({
          name: input.name,
          prefecture: input.prefecture,
          city: input.city,
          address: input.address ?? null,
          phone: input.phone ?? null,
          websiteUrl: input.websiteUrl ?? null,
          snsUrl: input.snsUrl ?? null,
          description: input.description ?? null,
          imageUrl: input.imageUrl ?? null,
          services: input.services ?? null,
          sortOrder: input.sortOrder ?? 0,
          published: input.published ?? 1,
        });
        return { success: true };
      }),

    /** 管理者用：サロン更新 */
    update: staffOrManusProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        prefecture: z.string().optional(),
        city: z.string().optional(),
        address: z.string().optional(),
        phone: z.string().optional(),
        websiteUrl: z.string().optional(),
        snsUrl: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string().optional(),
        services: z.string().optional(),
        sortOrder: z.number().optional(),
        published: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        await updateCertifiedSalon(id, data);
        return { success: true };
      }),

    /** 管理者用：サロン削除 */
    delete: staffOrManusProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deleteCertifiedSalon(input.id);
        return { success: true };
      }),
  }),

  /**
   * サロンパートナー資料請求リードルーター
   */
  salonLead: router({
    /** 公開：資料請求フォーム送信 → DB保存 + メール通知 */
    create: publicProcedure
      .input(
        z.object({
          name: z.string().min(1, "お名前を入力してください"),
          email: z.string().email("正しいメールアドレスを入力してください"),
          occupation: z.string().min(1, "業種を選択してください"),
          occupationOther: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        // DB保存
        const result = await createSalonLead({
          name: input.name,
          email: input.email,
          occupation: input.occupation,
          occupationOther: input.occupationOther,
        });

        // 有効期限付きトークン発行（72時間）
        const token = nanoid(32);
        const leadId = (result as { insertId: number }).insertId;
        await issueSalonLeadToken(leadId, token);

        // メール通知（非同期・失敗してもエラーにしない）
        const now = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
        sendSalonLeadNotification({
          name: input.name,
          email: input.email,
          occupation: input.occupation,
          occupationOther: input.occupationOther,
          submittedAt: now,
        }).catch(err => console.error("[salonLead] mail error:", err));

        return { success: true, token };
      }),

    /** 公開：トークン検証 → 有効なら ok: true を返す */
    verifyToken: publicProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ input }) => {
        const lead = await verifySalonLeadToken(input.token);
        if (!lead) return { ok: false };
        return { ok: true };
      }),

    /** 管理者用：リード一覧 */
    list: staffOrManusProcedure.query(async () => {
      return getAllSalonLeads();
    }),

    /** 管理者用：トークン再発行 */
    reissueToken: staffOrManusProcedure
      .input(z.object({ leadId: z.number() }))
      .mutation(async ({ input }) => {
        const token = nanoid(32);
        await reissueSalonLeadToken(input.leadId, token);
        const expiresAt = Date.now() + 72 * 60 * 60 * 1000;
        return { token, expiresAt };
      }),

    /** 管理者用：ステータス更新 */
    updateStatus: staffOrManusProcedure
      .input(z.object({
        leadId: z.number(),
        status: z.enum(['new', 'contacted', 'converted', 'archived']),
      }))
      .mutation(async ({ input }) => {
        await updateSalonLeadStatus(input.leadId, input.status);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
