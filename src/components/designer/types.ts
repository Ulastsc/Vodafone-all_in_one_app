export type WidgetType = "text" | "gauge" | "bar" | "shape" | "table";

export type Align = "left" | "center" | "right";

export type XY = { x: number; y: number };
export type WH = { w: number; h: number };

export type WidgetStyle = {
  fill?: string;
  textColor?: string;
  fontSize?: number;
  radius?: number;
  align?: Align;
};

export type BaseWidget = {
  id: string;
  type: WidgetType;
  position: XY;
  size: WH;
  z: number;
  label?: string;
  style?: WidgetStyle;
};

export type TextWidget = BaseWidget & {
  type: "text";
  text: string;
};

export type GaugeWidget = BaseWidget & {
  type: "gauge";
  value: number; // 0..100
};

export type BarWidget = BaseWidget & {
  type: "bar";
  data: number[];
};

export type ShapeWidget = BaseWidget & {
  type: "shape";
  shape: "rect" | "circle";
};

export type TableColumn = { key: string; title: string; width?: number };
export type TableRow = Record<string, string | number>;

export type TableWidget = BaseWidget & {
  type: "table";
  columns: TableColumn[];
  rows: TableRow[];
};

export type Widget =
  | TextWidget
  | GaugeWidget
  | BarWidget
  | ShapeWidget
  | TableWidget;