import { initialItems } from "../supabase/packing-seed-data";
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import {
  createSession,
  validSession,
  SESSION_SECONDS,
  equalSecret,
} from "../app/trips/session";
import {
  draft,
  itemChanges,
  uuid,
  version,
} from "../app/trips/packing-validation";
import { TRIP_ID } from "../app/trips/packing-data";

test("invitations expire, reject tampering, and revoke sessions when rotated", () => {
  const secret = "test-secret-that-is-at-least-32-characters";
  const now = Date.UTC(2026, 8, 25);
  const session = createSession(secret, now);
  assert.ok(validSession(session, secret, now));
  assert.ok(validSession(session, secret, now + 1000));
  assert.equal(
    validSession(session, secret, now + SESSION_SECONDS * 1000),
    false,
  );
  assert.equal(validSession(session, secret + "rotated", now), false);
  assert.equal(validSession(session + "x", secret, now), false);
  assert.equal(validSession(session.replace(/^\d/, "9"), secret, now), false);
  assert.equal(validSession(undefined, secret, now), false);
  assert.equal(equalSecret("a", "aa"), false);
});

test("edits accept blank quantities and decimals but reject malformed or privileged fields", () => {
  const input = {
    name: "  Rice  ",
    category: "ssam",
    quantity: 2.5,
    unit: " cups dry ",
  };
  assert.deepEqual(draft(input), { ...input, name: "Rice", unit: "cups dry" });
  assert.equal(draft({ ...input, quantity: null }).quantity, null);
  assert.equal(draft({ ...input, quantity: 0 }).quantity, 0);
  for (const quantity of [NaN, Infinity, -1, 10001, "2"])
    assert.throws(() => draft({ ...input, quantity }));
  assert.throws(() => draft({ ...input, name: "  " }));
  assert.throws(() => draft({ ...input, category: "other" }));
  assert.throws(() => itemChanges({ packed: true, version: 999 }));
  assert.throws(() => itemChanges({ packed: "true" }));
  assert.throws(() => itemChanges({ ...input, trip_id: TRIP_ID }));
  assert.throws(() => version(0));
  assert.throws(() => version(1.5));
  assert.throws(() => uuid("not-an-id"));
});

test("database permissions, seed preservation, concurrent edits, bulk atomicity, and reversible deletion", async (t) => {
  const db = new PGlite();
  await db.exec(
    "create role anon; create role authenticated; create role service_role bypassrls; create publication supabase_realtime;",
  );
  const migration = readFileSync(
    new URL(
      "../supabase/migrations/20260925202552_trip_packing.sql",
      import.meta.url,
    ),
    "utf8",
  );
  const seed = readFileSync(
    new URL("../supabase/seed.sql", import.meta.url),
    "utf8",
  );
  await db.exec(migration);
  await db.exec(seed);
  const [first, second] = initialItems;
  const row = async (id: string) =>
    (
      await db.query<{
        version: number;
        packed: boolean;
        deleted: boolean;
        name: string;
      }>("select * from trip_packing_items where id=$1", [id])
    ).rows[0];
  try {
    await t.test(
      "matches all 36 Canvas rows and five packed items",
      async () => {
        const count = await db.query<{ total: number; packed: number }>(
          "select count(*)::int total, count(*) filter (where packed)::int packed from trip_packing_items",
        );
        assert.deepEqual(count.rows[0], { total: 36, packed: 5 });
        const rows = await db.query(
          "select category, count(*)::int n from trip_packing_items group by category order by category",
        );
        assert.deepEqual(rows.rows, [
          { category: "cooking", n: 6 },
          { category: "food", n: 3 },
          { category: "games", n: 3 },
          { category: "lake", n: 10 },
          { category: "ssam", n: 14 },
        ]);
        assert.equal(
          (await row(initialItems[33].id)).name,
          "Rice cooker or lidded pot (unless we're doing instant rice)",
        );
      },
    );
    await t.test(
      "anonymous and ordinary authenticated roles cannot read, write, or invoke mutations",
      async () => {
        for (const role of ["anon", "authenticated"]) {
          await db.exec(`set role ${role}`);
          await assert.rejects(
            db.query("select * from trip_packing_items"),
            /permission denied/,
          );
          await assert.rejects(
            db.query("update trip_packing_items set packed=true"),
            /permission denied/,
          );
          await assert.rejects(
            db.query("select add_trip_packing_item($1,$2,$3,$4,$5,$6)", [
              TRIP_ID,
              crypto.randomUUID(),
              "lake",
              "Denied",
              1,
              "",
            ]),
            /permission denied/,
          );
          await assert.rejects(
            db.query("select set_trip_packing_items($1,$2,true)", [
              TRIP_ID,
              JSON.stringify([{ id: first.id, version: 1 }]),
            ]),
            /permission denied/,
          );
          await db.exec("reset role");
        }
        const rls = await db.query<{ relrowsecurity: boolean }>(
          "select relrowsecurity from pg_class where relname in ('trip_packing_trips','trip_packing_items')",
        );
        assert.ok(rls.rows.every((r) => r.relrowsecurity));
      },
    );
    await db.exec("set role service_role");
    await t.test(
      "unrelated edits coexist and an outdated version cannot overwrite an item",
      async () => {
        const a = await db.query(
          "update trip_packing_items set packed=false where id=$1 and version=1 returning version",
          [first.id],
        );
        const b = await db.query(
          "update trip_packing_items set name=$2 where id=$1 and version=1 returning version",
          [second.id, "Ice and frozen packs"],
        );
        assert.deepEqual(a.rows, [{ version: 2 }]);
        assert.deepEqual(b.rows, [{ version: 2 }]);
        const stale = await db.query(
          "update trip_packing_items set name=$2 where id=$1 and version=1 returning id",
          [second.id, "Stale overwrite"],
        );
        assert.equal(stale.rows.length, 0);
        assert.equal((await row(second.id)).name, "Ice and frozen packs");
        assert.equal((await row(first.id)).packed, false);
      },
    );
    await t.test(
      "re-running the seed never resets someone’s progress",
      async () => {
        await db.exec(seed);
        assert.equal((await row(first.id)).version, 2);
        assert.equal((await row(first.id)).packed, false);
        assert.equal((await row(second.id)).name, "Ice and frozen packs");
      },
    );
    await t.test(
      "a stale bulk edit changes none of the selected rows",
      async () => {
        const selected = JSON.stringify([
          { id: first.id, version: 2 },
          { id: second.id, version: 1 },
        ]);
        await assert.rejects(
          db.query("select * from set_trip_packing_items($1,$2,true)", [
            TRIP_ID,
            selected,
          ]),
          /List changed/,
        );
        assert.equal((await row(first.id)).version, 2);
        assert.equal((await row(first.id)).packed, false);
        const valid = JSON.stringify([
          { id: first.id, version: 2 },
          { id: second.id, version: 2 },
        ]);
        const result = await db.query(
          "select * from set_trip_packing_items($1,$2,true)",
          [TRIP_ID, valid],
        );
        assert.equal(result.rows.length, 2);
        assert.equal((await row(first.id)).version, 3);
        assert.equal((await row(second.id)).packed, true);
        await assert.rejects(
          db.query("select * from set_trip_packing_items($1,$2,false)", [
            TRIP_ID,
            JSON.stringify([
              { id: first.id, version: 3 },
              { id: first.id, version: 3 },
            ]),
          ]),
          /List changed/,
        );
      },
    );
    await t.test(
      "retrying an add does not duplicate it; delete and undo increment the version",
      async () => {
        const id = crypto.randomUUID();
        const args = [TRIP_ID, id, "lake", "Test item", 2, "bags"];
        await db.query("select add_trip_packing_item($1,$2,$3,$4,$5,$6)", args);
        await db.query("select add_trip_packing_item($1,$2,$3,$4,$5,$6)", args);
        assert.equal(
          (
            await db.query<{ n: number }>(
              "select count(*)::int n from trip_packing_items where id=$1",
              [id],
            )
          ).rows[0].n,
          1,
        );
        await db.query(
          "update trip_packing_items set deleted=true where id=$1 and version=1",
          [id],
        );
        assert.equal((await row(id)).deleted, true);
        await db.query(
          "update trip_packing_items set deleted=false where id=$1 and version=2",
          [id],
        );
        assert.deepEqual(
          {
            version: (await row(id)).version,
            deleted: (await row(id)).deleted,
          },
          { version: 3, deleted: false },
        );
      },
    );
  } finally {
    await db.close();
  }
});
