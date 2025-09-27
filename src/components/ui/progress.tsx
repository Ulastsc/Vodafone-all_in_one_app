// src/components/ui/progress.tsx
"use client";

import * as React from "react";

export type ProgressProps = React.HTMLAttributes<HTMLDivElement> & {
  value?: number; // 0..100
};

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value = 0, className = "", ...props }, ref) => {
    const v = Math.max(0, Math.min(100, value));
    return (
      <div
        ref={ref}
        className={`relative h-2 w-full overflow-hidden rounded-full bg-white/10 ${className}`}
        {...props}
      >
        <div
          className="h-2 rounded-full bg-[#E60000] transition-[width] duration-300"
          style={{ width: `${v}%` }}
        />
      </div>
    );
  }
);

Progress.displayName = "Progress";