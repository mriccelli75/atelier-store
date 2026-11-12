import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { BAG_COOKIE, bagCookieOptions, isBagId } from "./bag-cookie";
import { mergeBagIntoUser } from "./cart";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  emailAndPassword: {
    enabled: true,
  },
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      // Signing in or up: merge the guest bag into the account's bag.
      const newSession = ctx.context.newSession;
      if (newSession && ctx.path.startsWith("/sign-")) {
        const guestBagId = ctx.getCookie(BAG_COOKIE);
        const bagId = await mergeBagIntoUser(
          isBagId(guestBagId) ? guestBagId : null,
          newSession.user.id,
        );
        if (bagId) ctx.setCookie(BAG_COOKIE, bagId, bagCookieOptions);
        return;
      }
      // Signing out: forget the account's bag on this device.
      if (ctx.path === "/sign-out") {
        ctx.setCookie(BAG_COOKIE, "", { ...bagCookieOptions, maxAge: 0 });
      }
    }),
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
