import { cookies } from "next/headers";
import {
  COOKIE,
  createSession,
  equalSecret,
  SESSION_SECONDS,
} from "@/app/trips/session";
import {
  config,
  failure,
  HttpError,
  readBody,
  requireSameOrigin,
} from "@/app/trips/server";
import { record } from "@/app/trips/packing-validation";

export async function POST(request: Request) {
  try {
    await requireSameOrigin(request);
    const { invite } = config();
    const { token } = record(await readBody(request));
    if (
      typeof token !== "string" ||
      token.length > 256 ||
      !equalSecret(token, invite)
    )
      throw new HttpError(
        403,
        "This invitation is not valid. Ask for the current trip link.",
      );
    (await cookies()).set(COOKIE, createSession(invite), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_SECONDS,
      path: "/",
    });
    return Response.json(
      { joined: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return failure(error);
  }
}
