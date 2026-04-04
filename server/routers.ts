import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { notifyOwner } from "./_core/notification";
import { getDb } from "./db";
import { reservations, scalpImages } from "../drizzle/schema";
import { storagePut } from "./storage";
import { desc } from "drizzle-orm";
import { z } from "zod";
import { nanoid } from "nanoid";

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

        return { success: true };
      }),

    list: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) return [];
      return db.select().from(reservations).orderBy(desc(reservations.createdAt)).limit(100);
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
