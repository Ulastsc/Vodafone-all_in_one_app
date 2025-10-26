import React from "react";
import { Widget } from "./store";

type Props = { w: Widget; rows: Array<Record<string, unknown>> };

export default function ChartRenderer({ w }: Props) {
  const style: React.CSSProperties = {
    background: w.style?.fill ?? "#ef4444",
    color: w.style?.textColor ?? "#fff",
    borderRadius: (w.style?.radius ?? 12) + "px",
    fontSize: (w.style?.fontSize ?? 14) + "px",
  };

  if (w.kind === "text") {
    return (
      <div className="h-full w-full" style={style}>
        <div className="h-full grid place-items-center">
          <span>New Text</span>
        </div>
      </div>
    );
  }

  if (w.kind === "shape") {
    return <div className="h-full w-full" style={style} />;
  }

  // bar/gauge/table için yer tutucu
  return (
    <div className="h-full w-full" style={style}>
      <div className="h-full grid place-items-center">Chart</div>
    </div>
  );
}