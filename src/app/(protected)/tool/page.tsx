"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { Awareness } from "y-protocols/awareness";

/* ============================== Types ============================== */

type Vec2 = { x: number; y: number };

type PeerState = {
  name: string;
  color: string;
  badge?: string;
  cursor?: Vec2 | null;
};

type Widget = {
  id: string;
  title: string;
  x: number; // % (0..100)
  y: number; // % (0..100)
  w: number; // % (0..100)
  h: number; // % (0..100)
};

/* ============================ Utilities ============================ */

const COLORS = [
  "#ef4444", // red
  "#eab308", // amber
  "#22c55e", // emerald
  "#06b6d4", // cyan
  "#3b82f6", // blue
  "#a855f7", // purple
  "#f97316", // orange
] as const;

function pickColor(seed: number): string {
  return COLORS[seed % COLORS.length];
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

/* ============================== Page =============================== */

export default function ToolPage() {
  const canvasRef = useRef<HTMLDivElement | null>(null);

  // ---- Yjs setup (tek sefer) ----
  const { provider, awareness, ydoc, widgetsY } = useMemo(() => {
    const wsUrl =
      process.env.NEXT_PUBLIC_YWS_URL?.trim() || "ws://localhost:1234";
    const roomName =
      process.env.NEXT_PUBLIC_YWS_ROOM?.trim() || "vodafone-dashboard-tool";

    const doc = new Y.Doc();
    const p = new WebsocketProvider(wsUrl, roomName, doc, { connect: true });
    const aw = new Awareness(doc);
    const widgets = doc.getArray<Widget>("widgets");
    return { provider: p, awareness: aw, ydoc: doc, widgetsY: widgets };
  }, []);

  // Ben (yerel kullanıcı)
  const [me] = useState(() => {
    const raw =
      (typeof window !== "undefined" &&
        window.localStorage.getItem("vf_user_name")) ||
      "Guest User";
    const name = raw || "Guest User";
    const seed =
      typeof window !== "undefined"
        ? window.crypto.getRandomValues(new Uint32Array(1))[0] ?? 0
        : Math.floor(Math.random() * 1_000_000);
    return {
      name,
      color: pickColor(seed),
      badge: initials(name),
    };
  });

  // Peer’lar (awareness’tan okunur)
  const [peers, setPeers] = useState<Map<number, PeerState>>(new Map());

  // Paylaşılan widget’ların yerel UI kopyası
  const [widgets, setWidgets] = useState<Widget[]>([]);

  /* -------------------------- Awareness wiring -------------------------- */

  useEffect(() => {
    // yerel kullanıcı bilgisini publish et
    awareness.setLocalStateField("user", {
      name: me.name,
      color: me.color,
      badge: me.badge,
    });

    const handleUpdate = () => {
      const next = new Map<number, PeerState>();
      awareness.getStates().forEach((state, clientId) => {
        const u = state?.user as Omit<PeerState, "cursor"> | undefined;
        const c = state?.cursor as Vec2 | null | undefined;
        if (!u) return;
        next.set(clientId as number, { ...u, cursor: c ?? null });
      });
      setPeers(next);
    };

    awareness.on("update", handleUpdate);
    handleUpdate();

    return () => {
      awareness.off("update", handleUpdate);
    };
  }, [awareness, me]);

  // İmleci awareness.cursor olarak yayınla
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const onMove = (ev: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ev.clientX - rect.left;
      const y = ev.clientY - rect.top;
      awareness.setLocalStateField("cursor", { x, y } as Vec2);
    };

    const onLeave = () => {
      awareness.setLocalStateField("cursor", null);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [awareness]);

  /* --------------------------- Widgets (Y.Array) -------------------------- */

  // İlk girişte örnek widget’lar
  useEffect(() => {
    if (widgetsY.length === 0) {
      ydoc.transact(() => {
        widgetsY.push([
          {
            id: crypto.randomUUID(),
            title: "KPI – Tasarruf (Saat/Yıl)",
            x: 8,
            y: 10,
            w: 28,
            h: 18,
          },
          {
            id: crypto.randomUUID(),
            title: "Kategori Dağılımı",
            x: 40,
            y: 10,
            w: 24,
            h: 24,
          },
        ]);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Y.Array değişimini UI’a aktar
  useEffect(() => {
    const sync = () => setWidgets(widgetsY.toArray());
    sync();
    widgetsY.observeDeep(sync);
    return () => {
      widgetsY.unobserveDeep(sync);
    };
  }, [widgetsY]);

  /* ------------------------------ Actions ------------------------------ */

  function addWidget() {
    const w: Widget = {
      id: crypto.randomUUID(),
      title: "Yeni Widget",
      x: 14 + Math.random() * 50,
      y: 16 + Math.random() * 40,
      w: 22,
      h: 16,
    };
    ydoc.transact(() => {
      widgetsY.push([w]);
    });
  }

  function moveWidget(id: string, delta: Vec2) {
    const items = widgetsY.toArray();
    const idx = items.findIndex((it) => it.id === id);
    if (idx === -1) return;

    const w = items[idx];
    const next: Widget = {
      ...w,
      x: clampPct(w.x + delta.x, 0, 100 - w.w),
      y: clampPct(w.y + delta.y, 0, 100 - w.h),
    };

    ydoc.transact(() => {
      widgetsY.delete(idx, 1);
      widgetsY.insert(idx, [next]);
    });
  }

  function removeWidget(id: string) {
    const items = widgetsY.toArray();
    const idx = items.findIndex((it) => it.id === id);
    if (idx === -1) return;
    ydoc.transact(() => {
      widgetsY.delete(idx, 1);
    });
  }

  /* ------------------------------- Render ------------------------------- */

  return (
    <div className="min-h-screen bg-[#0b0d12] text-white">
      {/* Toolbar */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto max-w-[1200px] px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl grid place-items-center bg-white/8 border border-white/10">
              <span className="text-xs font-semibold">{me.badge}</span>
            </div>
            <div>
              <div className="text-sm font-semibold">Dashboard Tool</div>
              <div className="text-[11px] text-white/60">eşzamanlı düzenleme</div>
            </div>
          </div>

          <button
            onClick={addWidget}
            className="rounded-lg bg-white/10 border border-white/10 px-3 py-1.5 text-sm hover:bg-white/15"
          >
            + Widget
          </button>
        </div>
      </header>

      {/* Canvas */}
      <main
        ref={canvasRef}
        className="relative mx-auto max-w-[1200px] h-[72vh] my-6 rounded-2xl border border-white/10 bg-[#0e1117] overflow-hidden"
      >
        {/* Widgets */}
        {widgets.map((w) => (
          <WidgetCard key={w.id} data={w} onMove={moveWidget} onRemove={removeWidget} />
        ))}

        {/* Live cursors */}
        {[...peers.entries()].map(([id, p]) => {
          if (!p.cursor) return null;
          return (
            <Cursor key={id} x={p.cursor.x} y={p.cursor.y} name={p.name} color={p.color} badge={p.badge} />
          );
        })}

        {/* Orta mesaj */}
        {widgets.length === 0 && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none text-white/60 text-sm">
            Realtime Dashboard Editing Enabled 🚀
          </div>
        )}
      </main>

      {/* Peer bar */}
      <footer className="mx-auto max-w-[1200px] px-6 pb-8">
        <div className="flex items-center gap-2">
          {[...peers.values()].map((p, i) => (
            <UserPill key={i} name={p.name} color={p.color} badge={p.badge} />
          ))}
        </div>
      </footer>
    </div>
  );
}

/* ============================ UI Components ============================ */

function WidgetCard({
  data,
  onMove,
  onRemove,
}: {
  data: Widget;
  onMove: (id: string, delta: Vec2) => void; // <-- 2 argüman bekliyor
  onRemove: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const dragging = useRef(false);
  const last = useRef<Vec2>({ x: 0, y: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const onDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-drag-handle]")) return; // yalnızca header’dan sürükle
      dragging.current = true;
      last.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    };
    const onMoveWin = (e: MouseEvent) => {
      if (!dragging.current) return;
      const dx = e.clientX - last.current.x;
      const dy = e.clientY - last.current.y;
      last.current = { x: e.clientX, y: e.clientY };
      // piksel → yüzdelik (kabaca, 1200x ~ 800y varsayımı)
      onMove(data.id, { x: dx / 12, y: dy / 8 });
    };
    const onUp = () => {
      dragging.current = false;
    };

    el.addEventListener("mousedown", onDown);
    window.addEventListener("mousemove", onMoveWin);
    window.addEventListener("mouseup", onUp);
    return () => {
      el.removeEventListener("mousedown", onDown);
      window.removeEventListener("mousemove", onMoveWin);
      window.removeEventListener("mouseup", onUp);
    };
  }, [data.id, onMove]);

  return (
    <div
      ref={ref}
      className="absolute rounded-xl border border-white/10 bg-white/5 backdrop-blur shadow-[0_1px_0_0_rgba(255,255,255,.06)_inset]"
      style={{
        left: `${data.x}%`,
        top: `${data.y}%`,
        width: `${data.w}%`,
        height: `${data.h}%`,
      }}
    >
      <div
        data-drag-handle
        className="flex items-center justify-between px-3 py-2 border-b border-white/10 cursor-grab active:cursor-grabbing"
      >
        <div className="text-sm font-medium">{data.title}</div>
        <button
          className="text-white/70 hover:text-white text-xs"
          onClick={() => onRemove(data.id)}
          title="Remove"
        >
          ✕
        </button>
      </div>
      <div className="p-3 text-xs text-white/70">Widget content…</div>
    </div>
  );
}

function Cursor({
  x,
  y,
  name,
  color,
  badge,
}: {
  x: number;
  y: number;
  name: string;
  color: string;
  badge?: string;
}) {
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      style={{ left: x, top: y }}
    >
      <div className="w-3 h-3 rotate-45" style={{ background: color, borderRadius: 2 }} />
      <div className="mt-1 inline-flex items-center gap-2 rounded-md bg-black/60 px-2 py-1 text-[11px] border border-white/10">
        <span className="grid place-items-center h-4 w-4 rounded-sm font-semibold" style={{ background: color }}>
          {(badge ?? "U").slice(0, 2)}
        </span>
        <span className="text-white/80">{name}</span>
      </div>
    </div>
  );
}

function UserPill({ name, color, badge }: { name: string; color: string; badge?: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-xs">
      <span className="grid place-items-center h-4 w-4 rounded-sm font-semibold" style={{ background: color }}>
        {(badge ?? "U").slice(0, 2)}
      </span>
      <span className="text-white/80">{name}</span>
    </div>
  );
}

/* ============================== Helpers ============================== */

function clampPct(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}