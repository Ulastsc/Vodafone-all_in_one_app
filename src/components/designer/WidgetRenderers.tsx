"use client";
import React from "react";
import type { Widget, TextWidget, GaugeWidget, BarWidget, ShapeWidget, TableWidget } from "./types";

const panelCls = "rounded-2xl border border-white/10 backdrop-blur bg-white/5";

export function TextView({ w }: { w: TextWidget }) {
  const s = w.style ?? {};
  return (
    <div className={panelCls} style={{ position: "absolute", left: w.position.x, top: w.position.y, width: w.size.w, height: w.size.h, borderRadius: s.radius ?? 12, background: s.fill }}>
      <div className="h-full w-full flex items-center px-4" style={{ color: s.textColor ?? "#fff", fontSize: s.fontSize ?? 18, justifyContent: (s.align ?? "left") === "center" ? "center" : (s.align === "right" ? "flex-end" : "flex-start") }}>
        {w.text}
      </div>
    </div>
  );
}

export function GaugeView({ w }: { w: GaugeWidget }) {
  const s = w.style ?? {};
  const pct = Math.max(0, Math.min(100, w.value));
  return (
    <div className={panelCls} style={{ position: "absolute", left: w.position.x, top: w.position.y, width: w.size.w, height: w.size.h, borderRadius: s.radius ?? 12, background: s.fill }}>
      <div className="px-4 pt-2 text-xs text-white/70">SLA</div>
      <div className="px-4 pb-3">
        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-emerald-400" style={{ width: `${pct}%` }} />
        </div>
        <div className="text-xs mt-1 text-right text-white/70">{pct}%</div>
      </div>
    </div>
  );
}

export function BarView({ w }: { w: BarWidget }) {
  const s = w.style ?? {};
  const max = Math.max(1, ...w.data);
  return (
    <div className={panelCls} style={{ position: "absolute", left: w.position.x, top: w.position.y, width: w.size.w, height: w.size.h, borderRadius: s.radius ?? 12, background: s.fill, padding: 16 }}>
      <div className="text-xs text-white/60 mb-2">Throughput</div>
      <div className="h-[calc(100%-24px)] w-full flex items-end gap-3">
        {w.data.map((v, i) => (
          <div key={i} className="flex-1 bg-rose-500 rounded" style={{ height: `${(v / max) * 100}%` }} />
        ))}
      </div>
    </div>
  );
}

export function ShapeView({ w }: { w: ShapeWidget }) {
  const s = w.style ?? {};
  const base: React.CSSProperties = {
    position: "absolute",
    left: w.position.x,
    top: w.position.y,
    width: w.size.w,
    height: w.size.h,
    background: s.fill ?? "rgba(255,255,255,0.05)",
  };
  return w.shape === "circle" ? (
    <div style={{ ...base, borderRadius: "9999px" }} />
  ) : (
    <div style={{ ...base, borderRadius: s.radius ?? 8 }} />
  );
}

export function TableView({ w }: { w: TableWidget }) {
  const s = w.style ?? {};
  return (
    <div className={panelCls} style={{ position: "absolute", left: w.position.x, top: w.position.y, width: w.size.w, height: w.size.h, borderRadius: s.radius ?? 12, background: s.fill, overflow: "hidden" }}>
      <table className="w-full text-sm">
        <thead className="bg-white/10 text-white/80">
          <tr>
            {w.columns.map((c) => (
              <th key={c.key} className="px-3 py-2 text-left" style={{ width: c.width }}>{c.title}</th>
            ))}
          </tr>
        </thead>
        <tbody className="text-white/80">
          {w.rows.map((r, i) => (
            <tr key={i} className="odd:bg-white/0 even:bg-white/5">
              {w.columns.map((c) => (
                <td key={c.key} className="px-3 py-2">{String(r[c.key] ?? "")}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function RenderWidget({ w }: { w: Widget }) {
  switch (w.type) {
    case "text": return <TextView w={w} />;
    case "gauge": return <GaugeView w={w} />;
    case "bar": return <BarView w={w} />;
    case "shape": return <ShapeView w={w} />;
    case "table": return <TableView w={w} />;
  }
}