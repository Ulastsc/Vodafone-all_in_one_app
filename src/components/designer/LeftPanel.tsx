"use client";

import React, { useCallback } from "react";
import { useDesignerStore } from "./store";

/* ------------------- BASİT INPUT BİLEŞENLERİ ------------------- */
function ColorInput({
  value,
  onChange,
  className,
}: { value: string; onChange: (hex: string) => void; className?: string }) {
  return (
    <input
      type="color"
      className={className}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function NumberInput({
  value,
  onChange,
  min = 0,
  max = 200,
  className,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  className?: string;
}) {
  return (
    <input
      type="number"
      className={className}
      value={value}
      min={min}
      max={max}
      onChange={(e) => onChange(Number(e.target.value || 0))}
    />
  );
}

/* ------------------- LEFT PANEL ------------------- */
export type LeftPanelProps = {
  dataColumns: string[];
  showDesigner?: boolean;
  showStyle?: boolean;
};

export default function LeftPanel({
  dataColumns,
  showDesigner = true,
  showStyle = true,
}: LeftPanelProps) {
  const {
    gridSnap,
    setGridSnap,
    selectedStyle,
    updateSelectedStyle,
    designMode,
  } = useDesignerStore();

  const onDragStartColumn = useCallback(
    (e: React.DragEvent<HTMLButtonElement>, col: string) => {
      e.dataTransfer.setData(
        "text/plain",
        JSON.stringify({ type: "column", name: col }),
      );
    },
    [],
  );

  const onDragStartTool = useCallback(
    (e: React.DragEvent<HTMLButtonElement>, kind: string) => {
      e.dataTransfer.setData("text/plain", JSON.stringify({ type: "tool", kind }));
    },
    [],
  );

  return (
    <aside className="w-[300px] shrink-0 border-r border-white/10 bg-black/20">
      {/* DATA SOURCE */}
      <section className="p-4 border-b border-white/10">
        <div className="text-xs uppercase tracking-wider text-white/60 mb-2">
          Data Source
        </div>

        {dataColumns.length === 0 ? (
          <div className="text-white/70">
            Kolon yok (
            <code className="font-mono bg-white/5 px-1 rounded">
              {"[\"ticket_id\", \"team\", \"score\"]"}
            </code>
            )
          </div>
        ) : (
          <div className="space-y-2">
            {dataColumns.map((col) => (
              <button
                key={col}
                draggable
                onDragStart={(e) => onDragStartColumn(e, col)}
                className="w-full rounded-md bg-white/5 hover:bg-white/10 px-2 py-2 text-left text-sm"
              >
                {col}
              </button>
            ))}
          </div>
        )}
      </section>

      {/* TOOLS */}
      {showDesigner && (
        <section className="p-4 border-b border-white/10">
          <div className="text-xs uppercase tracking-wider text-white/60 mb-2">
            Tools
          </div>
          <div className="grid grid-cols-2 gap-2">
            {["text", "gauge", "bar", "shape", "table"].map((t) => (
              <button
                key={t}
                draggable
                onDragStart={(e) => onDragStartTool(e, t)}
                className="rounded-md bg-white/5 hover:bg-white/10 px-2 py-2 text-sm"
              >
                + {t}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* CANVAS */}
      <section className="p-4 border-b border-white/10">
        <div className="text-xs uppercase tracking-wider text-white/60 mb-2">
          Canvas
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm">Grid</span>
          <NumberInput
            value={gridSnap}
            onChange={setGridSnap}
            min={2}
            max={80}
            className="w-20 rounded bg-white/5 px-2 py-1"
          />
          <span className="text-xs text-white/60">px</span>
        </div>
        {!designMode && (
          <div className="mt-2 text-xs text-amber-300">
            Görüntüleme modunda düzenleme pasif.
          </div>
        )}
      </section>

      {/* STYLE */}
      {showStyle && (
        <section className="p-4">
          <div className="text-xs uppercase tracking-wider text-white/60 mb-2">
            Style
          </div>

          <div className="mb-3">
            <span className="text-sm text-white/90">Fill</span>
            <div className="mt-1">
              <ColorInput
                value={selectedStyle.fill ?? "#e74c3c"}
                onChange={(hex) => updateSelectedStyle({ fill: hex })}
                className="h-8 w-10 rounded border border-white/10 bg-transparent"
              />
            </div>
          </div>

          <div className="mb-3">
            <span className="text-sm text-white/90">Text</span>
            <div className="mt-1">
              <ColorInput
                value={selectedStyle.textColor ?? "#ffffff"}
                onChange={(hex) => updateSelectedStyle({ textColor: hex })}
                className="h-8 w-10 rounded border border-white/10 bg-transparent"
              />
            </div>
          </div>

          <div className="mb-3">
            <span className="text-sm text-white/90">Font</span>
            <div className="mt-1 flex items-center gap-2">
              <NumberInput
                value={selectedStyle.fontSize ?? 14}
                onChange={(n) => updateSelectedStyle({ fontSize: n })}
                min={8}
                max={72}
                className="w-20 rounded bg-white/5 px-2 py-1"
              />
              <span className="text-xs text-white/60">px</span>
            </div>
          </div>

          <div className="mb-1">
            <span className="text-sm text-white/90">Radius</span>
            <div className="mt-1 flex items-center gap-2">
              <NumberInput
                value={selectedStyle.radius ?? 12}
                onChange={(n) => updateSelectedStyle({ radius: n })}
                min={0}
                max={48}
                className="w-20 rounded bg-white/5 px-2 py-1"
              />
              <span className="text-xs text-white/60">px</span>
            </div>
          </div>
        </section>
      )}
    </aside>
  );
}