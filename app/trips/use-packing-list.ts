"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PackingItem, ItemDraft } from "./packing-data";

const endpoint = "/api/trips/austin-2026";
type State = "loading" | "locked" | "ready" | "unavailable";
class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
async function api(path = "", method = "GET", body?: unknown) {
  const response = await fetch(endpoint + path, {
    method,
    cache: "no-store",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => null);
  if (!response.ok)
    throw new ApiError(
      response.status,
      data?.error || "Could not save or load the list. Try again.",
    );
  if (!data) throw new ApiError(502, "Could not load the list. Try again.");
  return data;
}

export function usePackingList() {
  const [items, setItems] = useState<PackingItem[]>([]);
  const itemsRef = useRef<PackingItem[]>([]);
  itemsRef.current = items;
  const [state, setState] = useState<State>("loading");
  const [connected, setConnected] = useState(false);
  const [online, setOnline] = useState(true);
  const [error, setError] = useState("");
  const [pending, setPending] = useState<Set<string>>(new Set());
  const pendingRef = useRef(new Set<string>());
  const mounted = useRef(true);
  const requestSerial = useRef(0);
  const inviteRef = useRef<string | null>(null);

  const refresh = useCallback(async () => {
    const serial = ++requestSerial.current;
    try {
      const data = await api();
      if (!mounted.current || serial !== requestSerial.current) return;
      setItems((current) =>
        (data.items as PackingItem[]).map((remote) => {
          const local = current.find((i) => i.id === remote.id);
          return local &&
            (pendingRef.current.has(local.id) || local.version > remote.version)
            ? local
            : remote;
        }),
      );
      setState("ready");
    } catch (err) {
      if (!mounted.current || serial !== requestSerial.current) return;
      const problem = err as ApiError;
      setConnected(false);
      if (problem.status === 401) setState("locked");
      else {
        setState((current) => (current === "ready" ? current : "unavailable"));
        setError(problem.message);
      }
    }
  }, []);

  const join = useCallback(
    async (invitation: string) => {
      let token = invitation.trim();
      try {
        if (token.includes("#"))
          token =
            new URLSearchParams(new URL(token).hash.slice(1)).get("invite") ||
            "";
        if (!token) throw new Error("Paste the private trip link.");
        await api("/session", "POST", { token });
        inviteRef.current = null;
        window.history.replaceState(null, "", window.location.pathname);
        setError("");
        await refresh();
      } catch (err) {
        setState("locked");
        setError((err as Error).message);
      }
    },
    [refresh],
  );

  useEffect(() => {
    mounted.current = true;
    const token = new URLSearchParams(window.location.hash.slice(1)).get(
      "invite",
    );
    if (token) {
      inviteRef.current = token;
      // Remove the invitation from the address bar before any navigation.
      window.history.replaceState(null, "", window.location.pathname);
      void join(token);
    } else void refresh();
    return () => {
      mounted.current = false;
    };
  }, [join, refresh]);

  useEffect(() => {
    const update = () => {
      setOnline(navigator.onLine);
      if (navigator.onLine) void refresh();
      else setConnected(false);
    };
    const focus = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    setOnline(navigator.onLine);
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    document.addEventListener("visibilitychange", focus);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
      document.removeEventListener("visibilitychange", focus);
    };
  }, [refresh]);

  useEffect(() => {
    if (state !== "ready" || !online) return;
    const events = new EventSource(endpoint + "/events");
    events.addEventListener("ready", () => {
      setConnected(true);
      void refresh();
    });
    events.addEventListener("change", () => {
      void refresh();
    });
    events.addEventListener("reconnecting", () => setConnected(false));
    events.onerror = () => setConnected(false);
    return () => {
      events.close();
      setConnected(false);
    };
  }, [state, online, refresh]);

  const save = useCallback(
    async (
      payload: unknown,
      ids: string[],
      method = "PATCH",
      optimistic?: (items: PackingItem[]) => PackingItem[],
    ) => {
      if (!navigator.onLine) {
        setError("You are offline. Reconnect before making changes.");
        return null;
      }
      if (ids.some((id) => pendingRef.current.has(id))) return null;
      const before = new Map(
        itemsRef.current
          .filter((item) => ids.includes(item.id))
          .map((item) => [item.id, item]),
      );
      ids.forEach((id) => pendingRef.current.add(id));
      setPending(new Set(pendingRef.current));
      requestSerial.current++;
      setError("");
      if (optimistic) setItems(optimistic);
      try {
        const data = await api("", method, payload);
        const changed: PackingItem[] = data.items || [data.item];
        setItems((current) => {
          const next = new Map(current.map((i) => [i.id, i]));
          changed.forEach((i) => next.set(i.id, i));
          return [...next.values()].sort(
            (a, b) => a.position - b.position || a.id.localeCompare(b.id),
          );
        });
        return changed;
      } catch (err) {
        // Roll back only this request, preserving successful edits to other rows.
        setItems((current) =>
          current.map((item) => {
            const original = before.get(item.id);
            return original && item.version <= original.version
              ? original
              : item;
          }),
        );
        if ((err as ApiError).status === 401) setState("locked");
        setError((err as Error).message);
        return null;
      } finally {
        ids.forEach((id) => pendingRef.current.delete(id));
        setPending(new Set(pendingRef.current));
        await refresh();
      }
    },
    [refresh],
  );

  const update = (
    item: PackingItem,
    changes: Partial<ItemDraft> | { packed: boolean } | { deleted: boolean },
  ) =>
    save(
      { id: item.id, version: item.version, changes },
      [item.id],
      "PATCH",
      (current) =>
        current.map((i) => (i.id === item.id ? { ...i, ...changes } : i)),
    );
  const add = (id: string, item: ItemDraft) => save({ id, item }, [id], "POST");
  const bulk = (list: PackingItem[], packed: boolean) =>
    save(
      {
        action: "bulk",
        items: list.map((i) => ({ id: i.id, version: i.version })),
        packed,
      },
      list.map((i) => i.id),
      "PATCH",
      (current) =>
        current.map((i) =>
          list.some((l) => l.id === i.id) ? { ...i, packed } : i,
        ),
    );
  const retry = () => (inviteRef.current ? join(inviteRef.current) : refresh());
  return {
    items,
    state,
    connected,
    online,
    error,
    setError,
    pending,
    update,
    add,
    bulk,
    join,
    retry,
  };
}
