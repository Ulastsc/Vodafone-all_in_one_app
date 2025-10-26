"use client";

import React, { createRef } from "react";
import { create } from "zustand";

/* ------------------- TİPLER ------------------- */
export type WidgetType = "text" | "gauge" | "bar" | "shape" | "table";

export type WidgetStyle = {
  fill?: string;
  textColor?: string;
  fontSize?: number;
  radius?: number;
};

export type Widget = {
  id: string;
  kind: WidgetType;
  x: number;
  y: number;
  w: number;
  h: number;
  dataKey?: string;
  style?: WidgetStyle;
};

type Store = {
  /** Tuval referansı (current null olabilir) */
  containerRef: React.RefObject<HTMLDivElement | null>;

  /* Grid ayarları */
  gridSnap: number;
  setGridSnap: (n: number) => void;

  /* Modlar */
  designMode: boolean;
  setDesignMode: (v: boolean) => void;

  /* Seçim / Stil */
  selectedId?: string;
  setSelected: (id?: string) => void;

  selectedStyle: WidgetStyle;
  updateSelectedStyle: (p: Partial<WidgetStyle>) => void;

  /* Widget yönetimi */
  widgets: Map<string, Widget>;
  addWidget: (w: Omit<Widget, "id" | "style"> & { style?: WidgetStyle }) => void;
  updateWidget: (id: string, patch: Partial<Widget>) => void;
  removeWidget: (id: string) => void;
};

/* ------------------- DEFAULT STYLE ------------------- */
const DEFAULT_STYLE: WidgetStyle = {
  fill: "#e74c3c",
  textColor: "#ffffff",
  fontSize: 14,
  radius: 12,
};

/* ------------------- STORE ------------------- */
export const useDesignerStore = create<Store>()((set, get) => ({
  // ⬇︎ burası değişti: HTMLDivElement | null
  containerRef: createRef<HTMLDivElement>(),

  gridSnap: 20,
  setGridSnap: (n) => set({ gridSnap: Math.max(2, Math.floor(n)) }),

  designMode: true,
  setDesignMode: (v) => set({ designMode: !!v }),

  selectedId: undefined,
  setSelected: (id) => set({ selectedId: id }),

  selectedStyle: { ...DEFAULT_STYLE },
  updateSelectedStyle: (patch) =>
    set((s) => ({ selectedStyle: { ...s.selectedStyle, ...patch } })),

  widgets: new Map<string, Widget>(),

  addWidget: (w) =>
    set((s) => {
      const id = crypto.randomUUID();
      const newWidget: Widget = {
        id,
        kind: w.kind,
        x: w.x,
        y: w.y,
        w: w.w,
        h: w.h,
        dataKey: w.dataKey,
        style: w.style ?? { ...DEFAULT_STYLE },
      };

      const widgets = new Map(s.widgets);
      widgets.set(id, newWidget);

      return {
        widgets,
        selectedId: id,
        selectedStyle: { ...newWidget.style! },
      };
    }),

  updateWidget: (id, patch) =>
    set((s) => {
      const widgets = new Map(s.widgets);
      const current = widgets.get(id);
      if (!current) return { widgets }; // tip güvenli: Store | Partial<Store>

      const updated: Widget = {
        ...current,
        ...patch,
        style: { ...(current.style ?? {}), ...(patch.style ?? {}) },
      };

      widgets.set(id, updated);

      const isSelected = s.selectedId === id;
      return {
        widgets,
        ...(isSelected ? { selectedStyle: { ...updated.style! } } : {}),
      };
    }),

  removeWidget: (id) =>
    set((s) => {
      const widgets = new Map(s.widgets);
      widgets.delete(id);

      const reset =
        s.selectedId === id
          ? { selectedId: undefined, selectedStyle: { ...DEFAULT_STYLE } }
          : {};

      return { widgets, ...reset };
    }),
}));