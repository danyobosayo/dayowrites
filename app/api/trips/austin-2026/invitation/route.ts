import { config, failure, requireSession } from "@/app/trips/server";

export async function GET() {
  try {
    await requireSession();
    return Response.json(
      { token: config().invite },
      {
        headers: {
          "Cache-Control": "private, no-store",
          "Referrer-Policy": "no-referrer",
        },
      },
    );
  } catch (error) {
    return failure(error);
  }
}
