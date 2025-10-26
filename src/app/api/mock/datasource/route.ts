import { NextResponse } from "next/server";

export async function GET() {
  // burada gerçek bağlanmış kaynaktan kolonları dönebilirsin
  return NextResponse.json({
    name: "Reporting_DS",
    columns: ["name","team","score","created_at","sla","throughput"]
  });
}