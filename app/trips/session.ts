import { createHmac, timingSafeEqual } from "node:crypto";

export const COOKIE = "austin-packing";
export const SESSION_SECONDS = 60 * 60 * 24 * 30;

export function equalSecret(a: string, b: string): boolean {
  const digest = (s: string) =>
    createHmac("sha256", "trip-access-comparison").update(s).digest();
  return timingSafeEqual(digest(a), digest(b));
}
export function createSession(secret: string, now = Date.now()): string {
  const expires = String(Math.floor(now / 1000) + SESSION_SECONDS);
  return `${expires}.${createHmac("sha256", secret).update(`austin-2026:${expires}`).digest("base64url")}`;
}
export function validSession(
  token: string | undefined,
  secret: string,
  now = Date.now(),
): boolean {
  if (!token || token.length > 128 || secret.length < 32) return false;
  const parts = token.split(".");
  if (parts.length !== 2 || !/^\d{10}$/.test(parts[0])) return false;
  const expires = Number(parts[0]);
  const current = Math.floor(now / 1000);
  if (expires <= current || expires > current + SESSION_SECONDS) return false;
  const signature = createHmac("sha256", secret)
    .update(`austin-2026:${parts[0]}`)
    .digest("base64url");
  return equalSecret(signature, parts[1]);
}
