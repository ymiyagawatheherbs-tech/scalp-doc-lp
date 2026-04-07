import { NOT_ADMIN_ERR_MSG, UNAUTHED_ERR_MSG } from '@shared/const';
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";
import { verifyStaffToken, STAFF_JWT_COOKIE } from '../staffAuth';

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const requireUser = t.middleware(async opts => {
  const { ctx, next } = opts;

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(requireUser);

/**
 * スタッフCookie認証またはManus OAuth認証のどちらかを許可するプロシージャ
 * 予約管理画面のステータス更新などに使用する
 */
export const staffOrManusProcedure = t.procedure.use(
  t.middleware(async opts => {
    const { ctx, next } = opts;
    // Manus OAuth認証済みの場合はそのまま通す
    if (ctx.user) {
      return next({ ctx });
    }
    // スタッフCookie認証を確認
    const cookieHeader = (ctx.req as any).headers.cookie ?? "";
    const match = cookieHeader.match(new RegExp(`${STAFF_JWT_COOKIE}=([^;]+)`));
    if (match) {
      const staffInfo = await verifyStaffToken(match[1]);
      if (staffInfo) {
        return next({ ctx });
      }
    }
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }),
);

export const adminProcedure = t.procedure.use(
  t.middleware(async opts => {
    const { ctx, next } = opts;

    if (!ctx.user || ctx.user.role !== 'admin') {
      throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  }),
);
