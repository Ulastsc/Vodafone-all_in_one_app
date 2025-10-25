"use client";
import { useEffect, useState } from "react";
import { useRealtimeDoc } from "@/lib/realtime";

export default function DashboardTool() {
  const { ydoc, provider } = useRealtimeDoc("vodafone_dashboard");
  const [cursors, setCursors] = useState<{ x: number; y: number; color: string; name: string }[]>([]);

  useEffect(() => {
    if (!provider) return;

    const awareness = provider.awareness;

    // Başkalarının imleçlerini dinle
    const handleChange = () => {
      const states = Array.from(awareness.getStates().values());
      const cursorStates = states
        .map((s: any) => s.cursor && { ...s.cursor, color: s.user?.color, name: s.user?.name })
        .filter(Boolean);
      setCursors(cursorStates);
    };

    awareness.on("change", handleChange);

    // Mouse hareketini paylaş
    const handleMouseMove = (e: MouseEvent) => {
      awareness.setLocalStateField("cursor", { x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      awareness.off("change", handleChange);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [provider]);

  return (
    <div className="relative w-full h-[90vh] bg-neutral-950 rounded-xl overflow-hidden">
      {/* Diğer kullanıcıların imleçleri */}
      {cursors.map((c, i) => (
        <div
          key={i}
          className="absolute text-xs font-semibold pointer-events-none select-none"
          style={{
            left: c.x,
            top: c.y,
            color: c.color,
            transform: "translate(-50%, -50%)",
          }}
        >
          ● {c.name}
        </div>
      ))}

      {/* Buraya dashboard düzenleme bileşenlerin gelecek */}
      <div className="absolute inset-0 flex items-center justify-center text-white opacity-40">
        Realtime Dashboard Editing Enabled 🚀
      </div>
    </div>
  );
}