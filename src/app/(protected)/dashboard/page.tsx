"use client";

import { useSession } from "next-auth/react";
import ManagerDashboard from "../manager/page"; // Ahmet için
import ReportingDashboard from "./ReportingDashboard"; // Ulaş & Kübra için

export default function DashboardPage() {
  const { data: session } = useSession();

  const email = session?.user?.email ?? "";
  const isManager = email.toLowerCase() === "ahmet.koylu@vodafone.com";

  return isManager ? <ManagerDashboard /> : <ReportingDashboard />;
}
