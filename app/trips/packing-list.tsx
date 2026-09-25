"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import {
  Check,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  MoreHorizontal,
  Plus,
  Search,
  Share2,
  Trash2,
  WifiOff,
  X,
} from "lucide-react";
import {
  categories,
  TRIP_TITLE,
  type CategoryId,
  type PackingItem,
} from "./packing-data";
import { usePackingList } from "./use-packing-list";
import "./trips.css";

function Modal({
  title,
  children,
  close,
  busy = false,
}: {
  title: string;
  children: ReactNode;
  close: () => void;
  busy?: boolean;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const trigger = document.activeElement;
    dialog?.showModal();
    return () => {
      dialog?.close();
      if (trigger instanceof HTMLElement && trigger.isConnected) {
        trigger.focus({ preventScroll: true });
      }
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className="packing-dialog"
      aria-labelledby="packing-dialog-title"
      onCancel={(e) => {
        e.preventDefault();
        if (!busy) close();
      }}
    >
      <div className="packing-dialog-heading">
        <h2 id="packing-dialog-title">{title}</h2>
        <button
          className="icon-button"
          aria-label="Close"
          onClick={close}
          disabled={busy}
        >
          <X size={22} />
        </button>
      </div>
      {children}
    </dialog>
  );
}

export default function PackingList() {
  const list = usePackingList();
  const { items, state, pending } = list;
  const [filter, setFilter] = useState<"all" | "unpacked" | "packed">("all");
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [query, setQuery] = useState("");
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [editor, setEditor] = useState<{
    item?: PackingItem;
    category: CategoryId;
    id: string;
  } | null>(null);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [editCategory, setEditCategory] = useState<CategoryId>("lake");
  const [busy, setBusy] = useState(false);
  const [confirmation, setConfirmation] = useState<
    | { kind: "delete"; item: PackingItem }
    | { kind: "bulk"; category: CategoryId; packed: boolean }
    | null
  >(null);
  const [undo, setUndo] = useState<PackingItem | null>(null);
  const [invitation, setInvitation] = useState("");
  const [share, setShare] = useState(false);
  const [shareText, setShareText] = useState("");
  const [copyStatus, setCopyStatus] = useState("");
  const visible = items.filter((item) => !item.deleted);
  const packedCount = visible.filter((item) => item.packed).length;
  const progress = visible.length
    ? Math.round((packedCount / visible.length) * 100)
    : 0;
  const search = query.trim().toLowerCase();
  const matches = visible.filter(
    (item) =>
      (filter === "all" || item.packed === (filter === "packed")) &&
      (category === "all" || item.category === category) &&
      `${item.name} ${item.quantity ?? ""} ${item.unit}`
        .toLowerCase()
        .includes(search),
  );

  function openEditor(id: CategoryId, item?: PackingItem) {
    setName(item?.name || "");
    setQuantity(item?.quantity == null ? "" : String(item.quantity));
    setUnit(item?.unit || "");
    setEditCategory(id);
    list.setError("");
    setEditor({ item, category: id, id: item?.id || crypto.randomUUID() });
  }
  async function saveItem(event: FormEvent) {
    event.preventDefault();
    if (!editor) return;
    setBusy(true);
    const changes = {
      name,
      quantity: quantity.trim() === "" ? null : Number(quantity),
      unit,
      category: editCategory,
    };
    const saved = editor.item
      ? await list.update(editor.item, changes)
      : await list.add(editor.id, changes);
    setBusy(false);
    if (saved) setEditor(null);
    // A stale editor must be re-opened deliberately, never overwrite another edit.
  }
  async function confirmChange() {
    if (!confirmation) return;
    setBusy(true);
    if (confirmation.kind === "delete") {
      const result = await list.update(confirmation.item, { deleted: true });
      if (result) {
        setUndo(result[0]);
        setConfirmation(null);
        setEditor(null);
      }
    } else {
      const group = visible.filter(
        (i) =>
          i.category === confirmation.category &&
          i.packed !== confirmation.packed,
      );
      const result = group.length
        ? await list.bulk(group, confirmation.packed)
        : [];
      if (result) setConfirmation(null);
    }
    setBusy(false);
  }
  async function join(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    await list.join(invitation);
    setBusy(false);
  }
  async function shareLink() {
    setBusy(true);
    setShareText("");
    setCopyStatus("");
    try {
      const response = await fetch("/api/trips/austin-2026/invitation", {
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      const url = `${window.location.origin}/trips/austin-2026/packing#invite=${encodeURIComponent(data.token)}`;
      if (navigator.share) {
        try {
          await navigator.share({ title: TRIP_TITLE, url });
        } catch (error) {
          if ((error as Error).name !== "AbortError") throw error;
        }
      } else {
        setShareText(url);
        setShare(true);
        try {
          await navigator.clipboard.writeText(url);
          setCopyStatus("Link copied");
        } catch {
          /* The selectable link remains available. */
        }
      }
    } catch (error) {
      list.setError(
        (error as Error).message || "Could not create a sharing link.",
      );
    }
    setBusy(false);
  }
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopyStatus("Link copied");
    } catch {
      setCopyStatus("Select the link above to copy it.");
    }
  }
  const liveEditorItem = editor?.item
    ? items.find((i) => i.id === editor.item!.id)
    : undefined;
  const editorStale =
    !!editor?.item &&
    !!liveEditorItem &&
    liveEditorItem.version !== editor.item.version &&
    !pending.has(editor.item.id);

  return (
    <main className="packing-page" id="trip-content" tabIndex={-1}>
      <header className="packing-heading">
        <div className="packing-topline">
          <Link href="/trips">
            <ChevronLeft size={17} /> Trips
          </Link>
          {state === "ready" && (
            <button
              className="packing-share"
              onClick={shareLink}
              disabled={busy}
            >
              <Share2 size={17} /> Share
            </button>
          )}
        </div>
        <h1>{TRIP_TITLE}</h1>
        <p className="packing-date">
          <CalendarDays size={15} aria-hidden="true" />
          September 26–27, 2026
        </p>
      </header>

      {state === "loading" && (
        <div className="packing-loading" role="status">
          <span className="sr-only">Opening the packing list…</span>
          <div className="packing-skeleton" aria-hidden="true">
            <div className="skeleton-summary" />
            <div className="skeleton-track" />
            <div className="skeleton-controls" />
            <div className="skeleton-category" />
            {[0, 1, 2, 3].map((row) => (
              <div className="skeleton-row" key={row} />
            ))}
          </div>
        </div>
      )}
      {state === "locked" && (
        <section className="packing-access">
          <h2>Join the packing list</h2>
          <p>Open the private link from your group, or paste it below.</p>
          <form onSubmit={join}>
            <label htmlFor="invitation">Private trip link</label>
            <input
              id="invitation"
              value={invitation}
              onChange={(e) => setInvitation(e.target.value)}
              type="text"
              autoComplete="off"
              spellCheck={false}
              required
              placeholder="Paste your invitation"
            />
            {list.error && (
              <p className="packing-error" role="alert">
                {list.error}
              </p>
            )}
            <button className="primary-button" disabled={busy}>
              {busy ? "Joining…" : "Join trip"}
            </button>
          </form>
        </section>
      )}
      {state === "unavailable" && (
        <section className="packing-access">
          <h2>The list is not available yet</h2>
          <p>{list.error || "Try again in a moment."}</p>
          <button className="primary-button" onClick={() => void list.retry()}>
            Try again
          </button>
        </section>
      )}

      {state === "ready" && (
        <>
          <section className="packing-progress" aria-label="Packing progress">
            <div>
              <strong>
                {packedCount} <span>of {visible.length} packed</span>
              </strong>
              <span className="packing-remaining">
                {visible.length > 0 && packedCount === visible.length ? (
                  <><Check size={15} aria-hidden="true" /> All packed</>
                ) : (
                  `${visible.length - packedCount} to go`
                )}
              </span>
            </div>
            <div
              className="packing-progress-track"
              role="progressbar"
              aria-valuenow={packedCount}
              aria-valuemin={0}
              aria-valuemax={visible.length || 1}
              aria-label={`${progress}% packed`}
            >
              <span
                style={{ transform: `scaleX(${visible.length ? packedCount / visible.length : 0})` }}
              />
            </div>
          </section>
          <div className="packing-toolbar">
            <div className="packing-controls">
              <div
                className="packing-filters"
                role="group"
                aria-label="Filter by packing status"
                style={{
                  "--selected": filter === "all" ? 0 : filter === "unpacked" ? 1 : 2,
                } as CSSProperties}
              >
                {(
                  [
                    ["all", "All", visible.length],
                    ["unpacked", "To pack", visible.length - packedCount],
                    ["packed", "Packed", packedCount],
                  ] as const
                ).map(([id, label, count]) => (
                  <button
                    key={id}
                    aria-pressed={filter === id}
                    onClick={() => setFilter(id)}
                  >
                    {label} <span>{count}</span>
                  </button>
                ))}
              </div>
              <div className="packing-search">
                <Search size={18} aria-hidden="true" />
                <label className="sr-only" htmlFor="packing-search">
                  Search items, quantities, or units
                </label>
                <input
                  id="packing-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search the list"
                />
                {query && (
                  <button
                    className="packing-search-clear"
                    aria-label="Clear search"
                    onClick={() => {
                      setQuery("");
                      document.getElementById("packing-search")?.focus();
                    }}
                  >
                    <X size={17} aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
            <nav className="packing-categories" aria-label="Categories">
              <button
                aria-pressed={category === "all"}
                onClick={() => setCategory("all")}
              >
                All categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  aria-pressed={category === cat.id}
                  onClick={() => setCategory(cat.id)}
                  style={{ "--category": cat.color } as CSSProperties}
                >
                  {cat.name}
                </button>
              ))}
            </nav>
          </div>
          <div
            className="packing-connection"
            role="status"
            data-state={!list.online ? "offline" : pending.size ? "saving" : list.connected ? "live" : "connecting"}
          >
            {list.online && <span className="packing-connection-dot" aria-hidden="true" />}
            {!list.online ? (
              <>
                <WifiOff size={14} /> Offline. Reconnect to make changes.
              </>
            ) : pending.size ? (
              "Saving…"
            ) : list.connected ? (
              "Live updates on"
            ) : (
              "Reconnecting to live updates…"
            )}
          </div>
          {list.error && !editor && !confirmation && (
            <div className="packing-error-banner" role="alert">
              <p>{list.error}</p>
              <button
                onClick={() => {
                  list.setError("");
                  void list.retry();
                }}
              >
                Retry
              </button>
            </div>
          )}
          <div className="packing-sections">
            {categories
              .filter((cat) => category === "all" || cat.id === category)
              .map((cat) => {
                const all = visible.filter((i) => i.category === cat.id);
                const rows = matches.filter((i) => i.category === cat.id);
                if (!rows.length && (search || filter !== "all")) return null;
                const count = all.filter((i) => i.packed).length;
                const isCollapsed = collapsed.has(cat.id) && !search;
                return (
                  <section
                    className="packing-category"
                    key={cat.id}
                    style={{ "--category": cat.color } as CSSProperties}
                    aria-labelledby={`title-${cat.id}`}
                  >
                    <div className="packing-category-heading">
                      <button
                        className="packing-collapse"
                        aria-expanded={!isCollapsed}
                        aria-controls={`items-${cat.id}`}
                        onClick={() =>
                          setCollapsed((current) => {
                            const next = new Set(current);
                            if (next.has(cat.id)) next.delete(cat.id);
                            else next.add(cat.id);
                            return next;
                          })
                        }
                      >
                        <ChevronDown
                          className={isCollapsed ? "collapsed" : ""}
                          size={20}
                        />
                        <h2 id={`title-${cat.id}`}>{cat.name}</h2>
                        <span>
                          {count}/{all.length}
                        </span>
                      </button>
                      <button
                        className="category-add"
                        aria-label={`Add item to ${cat.name}`}
                        onClick={() => openEditor(cat.id)}
                      >
                        <Plus size={18} />
                        <span>Add</span>
                      </button>
                    </div>
                    {!isCollapsed && (
                      <div id={`items-${cat.id}`} className="packing-category-content">
                        {cat.notice && (
                          <p className="packing-notice">
                            <strong>Check Airbnb first</strong>
                            {cat.notice}
                          </p>
                        )}
                        <ul className="packing-items">
                          {rows.map((item) => (
                            <li
                              key={item.id}
                              className={`packing-item ${item.packed ? "is-packed" : ""}`}
                            >
                              <button
                                className="packing-check"
                                role="checkbox"
                                aria-checked={item.packed}
                                aria-label={`${item.packed ? "Unpack" : "Pack"} ${item.name}`}
                                aria-busy={pending.has(item.id)}
                                disabled={pending.has(item.id) || !list.online}
                                onClick={() =>
                                  void list.update(item, {
                                    packed: !item.packed,
                                  })
                                }
                              >
                                <span aria-hidden="true">
                                  <Check className="packing-checkmark" size={18} strokeWidth={3} />
                                </span>
                              </button>
                              <button
                                className="packing-item-label"
                                onClick={() => openEditor(cat.id, item)}
                                aria-label={`Edit ${item.name}`}
                              >
                                <span className="packing-item-name">
                                  {item.name}
                                </span>
                                <span className="packing-item-quantity">
                                  {[item.quantity, item.unit]
                                    .filter((v) => v !== null && v !== "")
                                    .join(" ") || "Quantity not set"}
                                </span>
                              </button>
                              <button
                                className="icon-button item-menu"
                                aria-label={`Options for ${item.name}`}
                                onClick={() => openEditor(cat.id, item)}
                              >
                                <MoreHorizontal size={21} />
                              </button>
                            </li>
                          ))}
                        </ul>
                        {!rows.length && (
                          <p className="packing-category-empty">
                            No items yet.
                          </p>
                        )}
                        <div className="packing-category-footer">
                          <button onClick={() => openEditor(cat.id)}>
                            <Plus size={16} /> Add an item
                          </button>
                          <button
                            disabled={
                              !all.length || pending.size > 0 || !list.online
                            }
                            onClick={() =>
                              setConfirmation({
                                kind: "bulk",
                                category: cat.id,
                                packed: count !== all.length,
                              })
                            }
                          >
                            {count === all.length && all.length
                              ? "Unpack all"
                              : "Pack all"}
                          </button>
                        </div>
                      </div>
                    )}
                  </section>
                );
              })}
            {!matches.length && (search || filter !== "all") && (
              <div className="packing-empty">
                <h2>
                  {filter === "unpacked" && !search
                    ? "Everything is packed"
                    : "No matching items"}
                </h2>
                <button
                  className="secondary-button"
                  onClick={() => {
                    setFilter("all");
                    setQuery("");
                    setCategory("all");
                  }}
                >
                  Show all items
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {editor && !confirmation && (
        <Modal
          title={editor.item ? "Edit item" : "Add an item"}
          close={() => setEditor(null)}
          busy={busy}
        >
          <form className="packing-editor" onSubmit={saveItem}>
            <label htmlFor="item-name">Item</label>
            <input
              id="item-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={160}
              required
              autoFocus
            />
            <div className="packing-edit-columns">
              <div>
                <label htmlFor="item-quantity">Quantity</label>
                <input
                  id="item-quantity"
                  type="number"
                  min="0"
                  max="10000"
                  step="any"
                  inputMode="decimal"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="Optional"
                />
              </div>
              <div>
                <label htmlFor="item-unit">Unit</label>
                <input
                  id="item-unit"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  maxLength={80}
                  placeholder="e.g. bags"
                />
              </div>
            </div>
            <label htmlFor="item-category">Category</label>
            <select
              id="item-category"
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value as CategoryId)}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {editorStale && (
              <p className="packing-error" role="alert">
                This item changed on another phone. Close and reopen it to
                review the latest version.
              </p>
            )}
            {list.error && (
              <p className="packing-error" role="alert">
                {list.error}
              </p>
            )}
            <button
              className="primary-button"
              disabled={busy || editorStale || !list.online}
            >
              {busy ? "Saving…" : editor.item ? "Save changes" : "Add item"}
            </button>
            {editor.item && (
              <button
                type="button"
                className="delete-button"
                disabled={busy || editorStale || !list.online}
                onClick={() =>
                  setConfirmation({ kind: "delete", item: editor.item! })
                }
              >
                <Trash2 size={17} /> Delete item
              </button>
            )}
          </form>
        </Modal>
      )}
      {confirmation && (
        <Modal
          title={
            confirmation.kind === "delete"
              ? "Delete this item?"
              : confirmation.packed
                ? "Pack this category?"
                : "Unpack this category?"
          }
          close={() => setConfirmation(null)}
          busy={busy}
        >
          <p className="packing-confirm-copy">
            {confirmation.kind === "delete"
              ? `${confirmation.item.name} will be removed for everyone. You can undo this.`
              : `This changes all ${visible.filter((i) => i.category === confirmation.category).length} items in ${categories.find((c) => c.id === confirmation.category)?.name} for everyone.`}
          </p>
          {list.error && (
            <p className="packing-error" role="alert">
              {list.error}
            </p>
          )}
          <div className="packing-confirm-actions">
            <button
              className="secondary-button"
              onClick={() => setConfirmation(null)}
              disabled={busy}
            >
              Cancel
            </button>
            <button
              className="primary-button"
              onClick={confirmChange}
              disabled={busy}
            >
              {busy
                ? "Saving…"
                : confirmation.kind === "delete"
                  ? "Delete item"
                  : confirmation.packed
                    ? "Pack all"
                    : "Unpack all"}
            </button>
          </div>
        </Modal>
      )}
      {share && (
        <Modal title="Share the packing list" close={() => setShare(false)}>
          <p className="packing-confirm-copy">
            Anyone with this link can edit this trip.
          </p>
          <label className="sr-only" htmlFor="share-link">
            Private invitation link
          </label>
          <input
            id="share-link"
            className="share-link"
            value={shareText}
            readOnly
            onFocus={(e) => e.target.select()}
          />
          <button className="primary-button" onClick={copyLink}>
            Copy link
          </button>
          <p role="status">{copyStatus}</p>
        </Modal>
      )}
      {undo && (
        <div className="packing-toast" role="status">
          <span>Item deleted</span>
          <button
            disabled={pending.has(undo.id)}
            onClick={async () => {
              const result = await list.update(undo, { deleted: false });
              if (result) setUndo(null);
            }}
          >
            Undo
          </button>
          <button
            className="icon-button"
            aria-label="Dismiss undo"
            onClick={() => setUndo(null)}
          >
            <X size={17} />
          </button>
        </div>
      )}
    </main>
  );
}
