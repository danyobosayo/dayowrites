import { createClient } from "@supabase/supabase-js";
import { cookies, headers } from "next/headers";
import { COOKIE, validSession } from "./session";
import { InputError } from "./packing-validation";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export function config() {
  const url = process.env.TRIPS_SUPABASE_URL;
  const key = process.env.TRIPS_SUPABASE_SECRET_KEY;
  const invite = process.env.TRIPS_INVITE_TOKEN;
  if (!url || !key || !invite || invite.length < 32)
    throw new HttpError(
      503,
      "The packing list is not available yet. Try again shortly.",
    );
  return { url, key, invite };
}
export function database() {
  const { url, key } = config();
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
export async function requireSession() {
  const { invite } = config();
  if (!validSession((await cookies()).get(COOKIE)?.value, invite))
    throw new HttpError(401, "Open the private trip link to join this list.");
}
export async function requireSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host = (await headers()).get("host");
  if (
    !origin ||
    new URL(origin).host !== host ||
    request.headers.get("sec-fetch-site") === "cross-site"
  )
    throw new HttpError(403, "Open this page directly to make changes.");
}
export async function readBody(request: Request) {
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw new HttpError(415, "Expected JSON.");
  const reader = request.body?.getReader();
  if (!reader) throw new HttpError(400, "Invalid request.");
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 24000) {
        await reader.cancel();
        throw new HttpError(413, "Request is too large.");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const text = Buffer.concat(chunks).toString("utf8");
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new HttpError(400, "Invalid request.");
  }
}
export function failure(error: unknown): Response {
  if (error instanceof HttpError)
    return Response.json(
      { error: error.message },
      { status: error.status, headers: { "Cache-Control": "no-store" } },
    );
  if (error instanceof InputError)
    return Response.json({ error: error.message }, { status: 400 });
  // Never return database errors, credentials, or invite tokens to the browser.
  console.error(
    "Packing request failed",
    error instanceof Error ? error.name : "database",
  );
  return Response.json(
    { error: "Could not save or load the list. Try again." },
    { status: 503 },
  );
}
