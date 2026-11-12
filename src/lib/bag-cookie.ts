// Shared by the bag (Next.js cookies) and the auth hooks (Better Auth context).
export const BAG_COOKIE = "bag";

export const bagCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 60, // 60 days
};

/** Most of one piece a customer can add in a single bag line. */
export const MAX_LINE_QUANTITY = 10;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const isBagId = (value: string | null | undefined): value is string =>
  !!value && UUID.test(value);
