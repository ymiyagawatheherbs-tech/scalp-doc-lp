import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, staffOrManusProcedure, router } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import { getDb } from "./db";
import { reservations, scalpImages, staffAccounts } from "../drizzle/schema";
import { authenticateStaff, verifyStaffToken, createStaffAccount, STAFF_JWT_COOKIE } from "./staffAuth";
import { storagePut } from "./storage";
import { desc } from "drizzle-orm";
import { z } from "zod";
import { nanoid } from "nanoid";
import { sendBookingNotification, sendCustomerConfirmation, sendBookingConfirmed } from "./mailer";

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
          desiredDate: z.string().min(1),
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

        // Outlook SMTP経由でcx@the-herbs.co.jpへメール通知
        const courseMap: Record<string, string> = {
          free: "free_check",
          standard: "regular_care",
          personal: "regular_care",
          consult: "consultation",
        };
        const submittedAt = new Date().toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" });
        await sendBookingNotification({
          storeName: "THE HERBS神戸阥急店",
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
            storeName: "THE HERBS神戸阥急店",
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
  }),

  /**
   * スタッフ認証ルーター
   */
  staff: router({
    // ログイン
    login: publicProcedure
      .input(z.object({ email: z.string().email(), password: z.string().min(1) }))
      .mutation(async ({ input, ctx }) => {
        const result = await authenticateStaff(input.email, input.password);
        if (!result) throw new Error("メールアドレスまたはパスワードが正しくありません");
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
  }),
});

export type AppRouter = typeof appRouter;
