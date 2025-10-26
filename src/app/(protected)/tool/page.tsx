"use client";

import LeftPanel from "@/components/designer/LeftPanel";
import DesignerCanvas from "@/components/designer/DesignerCanvas";

export default function SheetPage() {
  const columns = ["ticket_id", "team", "score", "created_at"];
  return (
    <div className="min-h-screen bg-[#0b0d12] text-white">
      <header className="px-5 py-3 border-b border-white/10">Dashboard Designer</header>
      <div className="flex gap-0">
        <LeftPanel dataColumns={columns} />
        <div className="flex-1 p-6">
          <DesignerCanvas />
        </div>
      </div>
    </div>
  );
}