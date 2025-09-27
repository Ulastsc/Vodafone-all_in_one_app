"use client";

import { useSession } from "next-auth/react";
import ManagerDashboard from "../manager/page";
import ReportingDashboard from "./ReportingDashboard";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen grid place-items-center text-white/70">
        Yükleniyor…
      </div>
    );
  }

  const email = (session?.user?.email ?? "").toLowerCase();
  const isManager = email === "ahmet.koylu@vodafone.com";

  return isManager ? <ManagerDashboard /> : <ReportingDashboard />;
}