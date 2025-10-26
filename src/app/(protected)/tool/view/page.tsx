"use client";

import { useEffect } from "react";
import Link from "next/link";
import DesignerCanvas from "@/components/designer/DesignerCanvas";
import { useDesignerStore } from "@/components/designer/store";

export default function DashboardViewPage() {
  const { setDesignMode } = useDesignerStore();
  useEffect(() => setDesignMode(false), [setDesignMode]);

  return (
    <div className="min-h-screen bg-[#0b0d12] text-white">
      <header className="flex items-center justify-between px-5 py-3 border-b border-white/10 sticky top-0 bg-[#0b0d12]/80 backdrop-blur">
        <div className="font-semibold">Published Dashboard</div>
        <Link
          href="/dashboard/tool/sheet"
          className="text-sm px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/10"
        >
          Edit (Sheet)
        </Link>
      </header>
      {/* Görüntüleme modunda sol panel yok, sadece tuval */}
      <div className="p-6">
        <DesignerCanvas />
      </div>
    </div>
  );
}