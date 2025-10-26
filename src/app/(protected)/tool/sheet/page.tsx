"use client";

import { useEffect } from "react";
import LeftPanel from "@/components/designer/LeftPanel";
import DesignerCanvas from "@/components/designer/DesignerCanvas";
import { useDesignerStore } from "@/components/designer/store";

export default function DashboardSheetPage() {
  const { setDesignMode } = useDesignerStore();

  useEffect(() => setDesignMode(true), [setDesignMode]);

  // Örnek kolonlar
  const columns = ["ticket_id", "team", "score", "created_at"];

  return (
    <div className="min-h-screen text-white bg-[#0b0d12]">
      <header className="flex items-center justify-between px-5 py-3 border-b border-white/10 sticky top-0 bg-[#0b0d12]/80 backdrop-blur">
        <div className="font-semibold">Dashboard Designer</div>
      </header>
      <div className="flex">
        <LeftPanel dataColumns={columns} />
        <div className="flex-1 p-6">
          <DesignerCanvas />
        </div>
      </div>
    </div>
  );
}