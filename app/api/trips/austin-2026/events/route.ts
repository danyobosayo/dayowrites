import { TRIP_ID } from "@/app/trips/packing-data";
import { database, failure, requireSession } from "@/app/trips/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  try {
    await requireSession();
    const db = database();
    const encoder = new TextEncoder();
    let cleanup = () => {};
    const stream = new ReadableStream({
      start(controller) {
        let closed = false;
        const send = (event: string) => {
          if (!closed)
            controller.enqueue(encoder.encode(`event: ${event}\ndata: {}\n\n`));
        };
        const channel = db
          .channel(`packing-server-${crypto.randomUUID()}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "trip_packing_items",
              filter: `trip_id=eq.${TRIP_ID}`,
            },
            () => send("change"),
          );
        const heartbeat = setInterval(() => {
          if (!closed) controller.enqueue(encoder.encode(": heartbeat\n\n"));
        }, 15000);
        const end = setTimeout(() => cleanup(), 55000);
        cleanup = () => {
          if (closed) return;
          closed = true;
          clearInterval(heartbeat);
          clearTimeout(end);
          request.signal.removeEventListener("abort", cleanup);
          void db.removeChannel(channel);
          try {
            controller.close();
          } catch {
            /* The browser already disconnected. */
          }
        };
        request.signal.addEventListener("abort", cleanup, { once: true });
        controller.enqueue(encoder.encode("retry: 2000\n\n"));
        channel.subscribe((status) => {
          if (status === "SUBSCRIBED") send("ready");
          if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
            send("reconnecting");
            cleanup();
          }
        });
        if (request.signal.aborted) cleanup();
      },
      cancel() {
        cleanup();
      },
    });
    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "private, no-cache, no-transform",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    return failure(error);
  }
}
