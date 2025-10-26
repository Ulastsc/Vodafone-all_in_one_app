"use client";

import React, { useEffect, useRef } from "react";
import { useDesignerStore, Widget } from "./store";

/* Payload tipi: sürükle bırak için */
type DragPayload =
  | { type: "column"; name: string }
  | { type: "tool"; kind: Widget["kind"] };

export default function DesignerCanvas() {
  const {
    containerRef,
    gridSnap,
    widgets,
    addWidget,
    setSelected,
    selectedId,
    selectedStyle,
    updateWidget,
  } = useDesignerStore();

  /* local ref’i store’daki ref’e bağla */
  const localRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (localRef.current) {
      // store ref’ine atıyoruz
      (containerRef as { current: HTMLDivElement | null }).current =
        localRef.current;
    }
  }, [containerRef]);

  /* Drop alanı */
  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const text = e.dataTransfer.getData("text/plain");
    if (!text) return;

    let parsed: DragPayload;
    try {
      parsed = JSON.parse(text) as DragPayload;
    } catch {
      return;
    }

    const rect = localRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = Math.round((e.clientX - rect.left) / gridSnap) * gridSnap;
    const y = Math.round((e.clientY - rect.top) / gridSnap) * gridSnap;

    const kind: Widget["kind"] =
      parsed.type === "tool" ? parsed.kind : "bar";
    const dataKey = parsed.type === "column" ? parsed.name : undefined;

    addWidget({
      kind,
      x,
      y,
      w: 360,
      h: 200,
      dataKey,
      style: selectedStyle, // o anki stil ile başlat
    });
  }

  return (
    <div
      ref={localRef}
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      className="relative h-[calc(100svh-140px)] rounded-2xl border border-white/10 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%20'20'%20height=%20'20'%20viewBox=%220%200%2020%2020%22><path d=%22M20 0H0v20%22 fill=%22none%22 stroke=%22rgba(255,255,255,.06)%22/></svg>')]"
      style={{
        backgroundSize: `${gridSnap}px ${gridSnap}px`,
      }}
    >
      {/* Render – yalın temsil */}
      {[...widgets.values()].map((w) => (
        <div
          key={w.id}
          onClick={() => setSelected(w.id)}
          className={`absolute rounded-xl border border-white/10 bg-white/10 select-none ${
            selectedId === w.id ? "ring-2 ring-red-400" : ""
          }`}
          style={{
            left: w.x,
            top: w.y,
            width: w.w,
            height: w.h,
            background: w.style?.fill ?? "#e74c3c",
            color: w.style?.textColor ?? "#fff",
            borderRadius: (w.style?.radius ?? 12) + "px",
            fontSize: (w.style?.fontSize ?? 14) + "px",
          }}
        >
          <div className="text-[11px] px-3 py-2 opacity-80">
            {w.kind.toUpperCase()} {w.dataKey ? `• ${w.dataKey}` : ""}
          </div>
          <div className="w-full h-full grid place-items-center">
            {w.kind === "text" ? "Text" : w.kind === "shape" ? "Shape" : "Bar Chart"}
          </div>
        </div>
      ))}
    </div>
  );
}