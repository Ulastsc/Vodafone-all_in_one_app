"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

/* --------- demo veri (Ulaş & Kübra) --------- */
type Member = {
  name: "Ulas Tascioglu" | "Kubra Aydin";
  title: string;
  performance: number;
  status: "Active" | "Busy";
  initials: string;
};

const MEMBERS: Member[] = [
  { name: "Ulas Tascioglu", title: "Senior BI Analyst", performance: 93, status: "Active", initials: "UT" },
  { name: "Kubra Aydin", title: "Data Analyst", performance: 100, status: "Busy", initials: "KA" },
];

type Task = {
  id: string;
  title: string;
  status: "in progress" | "todo";
  priority: "high" | "medium" | "low";
  desc: string;
  tags: string[];
  due: string;
  spent: string;
  estimate: string;
  subtasksDone: number;
  subtasksTotal: number;
};

const MY_TASKS: Task[] = [
  {
    id: "T-1",
    title: "Monthly Revenue Report Automation",
    status: "in progress",
    priority: "high",
    desc: "Automate the monthly revenue reporting process using Power BI",
    tags: ["Power BI", "Automation", "Revenue"],
    due: "2024-02-15",
    spent: "18h",
    estimate: "24h",
    subtasksDone: 3,
    subtasksTotal: 5,
  },
  {
    id: "T-2",
    title: "Data Quality Assessment",
    status: "todo",
    priority: "medium",
    desc: "Assess and improve data quality across reporting systems",
    tags: ["Data Quality", "Assessment", "SQL"],
    due: "2024-02-20",
    spent: "0h",
    estimate: "12h",
    subtasksDone: 0,
    subtasksTotal: 3,
  },
];

export default function ReportingDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [tab, setTab] = useState<"my" | "team" | "performance" | "sprints" | "analytics">("my");

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  if (status !== "authenticated") {
    return <div className="min-h-screen grid place-items-center text-sm text-gray-500">Loading…</div>;
  }

  const name = session?.user?.name ?? "User";

  const KPIS = [
    { label: "Tasks Completed", value: "0", sub: "This sprint", icon: "✅" },
    { label: "In Progress", value: "1", sub: "Active work", icon: "🟢" },
    { label: "Performance Score", value: "93%", sub: "↑ +2% this month", icon: "📈", accent: "text-emerald-600" },
    { label: "Sprint Progress", value: "68%", sub: "Team sprint", icon: "🎯" },
  ];

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-[#111827]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="mx-auto max-w-[1200px] px-6 py-4 flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-gray-100 grid place-items-center text-lg">👤</div>
          <div className="flex-1">
            <div className="text-[18px] font-semibold leading-tight">{name}</div>
            <div className="text-[12.5px] text-gray-600">Developer • Reporting and Development</div>
            <div className="mt-1 text-xs text-gray-500 flex items-center gap-3">
              <span>⭐ Performance: 93%</span>
              <span className="opacity-50">•</span>
              <span>🧩 2 Active Tasks</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-600">
            <span className="rounded-full border px-2 py-1">🔗 Sprint RPT-2024.Q1.3</span>
            <span className="rounded-full border px-2 py-1">📊 Sprint Progress: 68%</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-6 py-8 space-y-8">
        {/* KPI Grid */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {KPIS.map((k) => (
            <article
              key={k.label}
              className="rounded-2xl bg-white p-5 shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div className="text-[13px] text-gray-600">{k.label}</div>
                <div className="grid h-9 w-9 place-items-center rounded-lg bg-gray-50">{k.icon}</div>
              </div>
              <div className={`mt-1 text-[28px] font-bold tracking-tight ${k.accent ?? ""}`}>{k.value}</div>
              <div className="text-[12px] text-gray-500">{k.sub}</div>
            </article>
          ))}
        </section>

        {/* Tabs */}
        <div className="flex items-center gap-2 border rounded-xl bg-white p-1 text-sm font-medium text-gray-600">
          <TabButton active={tab === "my"} onClick={() => setTab("my")} label="My Tasks" />
          <TabButton active={tab === "team"} onClick={() => setTab("team")} label="Team" />
          <TabButton active={tab === "performance"} onClick={() => setTab("performance")} label="Performance" />
          <TabButton active={tab === "sprints"} onClick={() => setTab("sprints")} label="Sprints" />
          <TabButton active={tab === "analytics"} onClick={() => setTab("analytics")} label="Analytics" />
        </div>

        {/* CONTENT */}
        {tab === "my" && <MyTasks />}
        {tab === "team" && <TeamSection />}
        {tab === "performance" && <PerformanceSection />}
        {tab === "sprints" && <SprintsSection />}
        {tab === "analytics" && <AnalyticsSection />}
      </main>
    </div>
  );
}

/* =================== Sections =================== */

function MyTasks() {
  const total = MY_TASKS.length;
  const completed = 0;
  const inProgress = MY_TASKS.filter((t) => t.status === "in progress").length;
  const blocked = 0;

  return (
    <section className="grid gap-6 lg:grid-cols-3">
      {/* Left */}
      <div className="lg:col-span-2 space-y-4">
        <h2 className="font-semibold text-[15px]">My Tasks</h2>
        <p className="text-sm text-gray-500">Manage your assigned tasks and track progress</p>

        {MY_TASKS.map((t) => (
          <TaskCard key={t.id} task={t} />
        ))}
      </div>

      {/* Right */}
      <div className="space-y-4">
        <Card title="Task Summary">
          <SummaryRow label="Total Tasks" value={total} />
          <SummaryRow label="Completed" value={completed} color="green" />
          <SummaryRow label="In Progress" value={inProgress} color="blue" />
          <SummaryRow label="Blocked" value={blocked} color="red" />
          <div className="mt-3 text-xs text-gray-500">Completion Rate</div>
          <Progress value={(completed / Math.max(1, total)) * 100} />
        </Card>

        <Card title="Current Sprint">
          <div className="text-xs text-gray-500">Sprint RPT-2024.Q1.3 (2024-01-29 – 2024-02-26)</div>
          <div className="mt-2 text-xs text-gray-500">Progress</div>
          <Progress value={68} />
          <div className="mt-2 flex justify-between text-xs">
            <span className="text-emerald-600">1 Completed</span>
            <span className="text-blue-600">4 Remaining</span>
          </div>
        </Card>

        <Card title="Quick Actions">
          <GhostBtn>＋ Create New Task</GhostBtn>
          <GhostBtn>📑 Generate Report</GhostBtn>
          <GhostBtn>💬 Team Discussion</GhostBtn>
        </Card>
      </div>
    </section>
  );
}

function TeamSection() {
  return (
    <section className="space-y-5">
      <div>
        <h3 className="text-[18px] font-semibold">Reporting and Analytics</h3>
        <p className="text-sm text-gray-600">Business intelligence, reporting and data analytics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {MEMBERS.map((m, idx) => (
          <article key={m.name} className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gray-100 grid place-items-center font-semibold">{m.initials}</div>
              <div>
                <div className="font-semibold">{m.name}</div>
                <div className="text-xs text-gray-600">{m.title}</div>
              </div>
            </div>

            <div className="mt-4 text-sm">Performance</div>
            <Progress value={m.performance} />
            <div className="mt-1 text-xs text-gray-500">Status</div>
            <span
              className={
                "inline-block text-xs rounded-full px-2 py-0.5 " +
                (m.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700")
              }
            >
              {m.status}
            </span>

            {idx === 0 && (
              <div className="mt-3">
                <div className="rounded-full bg-blue-50 text-blue-700 text-xs text-center py-1">You</div>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

function PerformanceSection() {
  return (
    <section className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Performance Trend" subtitle="Your performance over the last 4 months">
          <Placeholder>(trend line)</Placeholder>
        </Card>
        <Card title="Tasks Completed" subtitle="Monthly task completion and hours worked">
          <Placeholder>(bar chart)</Placeholder>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Badge title="Data Wizard" desc="Achieved excellence in data analysis" />
        <Badge title="Insight Generator" desc="Consistently delivers actionable insights" />
        <Badge title="Goal Achiever" desc="Consistently meets sprint goals" />
      </div>
    </section>
  );
}

function SprintsSection() {
  const sprints = [
    { title: "Sprint RPT-2024.Q1.3", date: "2024-01-29 - 2024-02-26", total: 5, done: 1, remain: 4, progress: 68, badge: "Active" },
    { title: "Sprint RPT-2024.Q1.2", date: "2024-01-01 - 2024-01-28", total: 7, done: 7, remain: 0, progress: 100, badge: "Completed" },
    { title: "Sprint RPT-2024.Q1.4", date: "2024-02-26 - 2024-03-25", total: 0, done: 0, remain: 0, progress: 0, badge: "Planned" },
  ];

  return (
    <section className="space-y-4">
      {sprints.map((s) => (
        <article key={s.title} className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{s.title}</div>
              <div className="text-xs text-gray-500">{s.date}</div>
            </div>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">{s.badge}</span>
          </div>
          <div className="mt-3 grid gap-3 md:grid-cols-4 text-center">
            <MiniKPI label="Total Tasks" value={String(s.total)} />
            <MiniKPI label="Completed" value={String(s.done)} color="green" />
            <MiniKPI label="Remaining" value={String(s.remain)} color="orange" />
            <MiniKPI label="Progress" value={`${s.progress}%`} color="purple" />
          </div>
          <div className="mt-3">
            <Progress value={s.progress} />
          </div>
        </article>
      ))}
    </section>
  );
}

function AnalyticsSection() {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      <Card title="Work Hours Distribution" subtitle="Monthly work hours over the last 4 months">
        <Placeholder>(hours line)</Placeholder>
      </Card>

      <Card title="Task Status Distribution" subtitle="Current status of all your tasks">
        <div className="mt-2 text-sm space-y-2">
          <Legend color="green" label="Completed" value="21" />
          <Legend color="blue" label="In Progress" value="2" />
          <Legend color="gray" label="To Do" value="1" />
          <Legend color="red" label="Blocked" value="0" />
        </div>
      </Card>
    </section>
  );
}

/* =================== UI pieces =================== */

function TabButton({ active, label, onClick }: { active: boolean; label: string; onClick(): void }) {
  // Vodafone kırmızısı
  return (
    <button
      onClick={onClick}
      className={
        "px-4 py-2 rounded-lg transition " +
        (active ? "bg-[#E60000] text-white shadow" : "hover:bg-gray-100 text-gray-700")
      }
    >
      {label}
    </button>
  );
}

function TaskCard({ task }: { task: Task }) {
  const statusChip = task.status === "in progress" ? "bg-blue-50 text-blue-700" : "bg-gray-100 text-gray-700";
  const prioChip =
    task.priority === "high" ? "bg-orange-50 text-orange-700" :
    task.priority === "medium" ? "bg-yellow-50 text-yellow-700" : "bg-emerald-50 text-emerald-700";

  const progress = (task.subtasksDone / Math.max(1, task.subtasksTotal)) * 100;

  return (
    <article className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm hover:shadow-md">
      <div className="flex justify-between gap-4">
        <div>
          <h3 className="font-medium text-[14px]">{task.title}</h3>
          <p className="text-sm text-gray-500">{task.desc}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs rounded-full px-2 py-1 ${statusChip}`}>{task.status}</span>
          <span className={`text-xs rounded-full px-2 py-1 ${prioChip}`}>{task.priority}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        {task.tags.map((tag) => (
          <span key={tag} className="text-xs border rounded-md px-2 py-0.5 bg-gray-50">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-3 h-2 rounded-full bg-gray-100 overflow-hidden">
        <div className="h-2 rounded-full bg-[#111827]" style={{ width: `${progress}%` }} />
      </div>
    </article>
  );
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
      <div className="font-semibold">{title}</div>
      {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Progress({ value }: { value: number }) {
  const v = Math.min(100, Math.max(0, value));
  return (
    <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
      <div className="h-3 rounded-full bg-[#111827]" style={{ width: `${v}%` }} />
    </div>
  );
}

function SummaryRow({ label, value, color }: { label: string; value: number; color?: "green" | "blue" | "red" }) {
  const cls =
    color === "green" ? "text-emerald-600" :
    color === "blue" ? "text-blue-600" :
    color === "red" ? "text-rose-600" : "text-gray-900";
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className="text-gray-600">{label}</span>
      <span className={`font-semibold ${cls}`}>{value}</span>
    </div>
  );
}

function MiniKPI({ label, value, color }: { label: string; value: string; color?: "green" | "orange" | "purple" }) {
  const colorCls =
    color === "green" ? "text-emerald-600" :
    color === "orange" ? "text-orange-600" :
    color === "purple" ? "text-purple-600" : "text-blue-600";
  return (
    <div className="py-2 rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className={`text-2xl font-bold ${colorCls}`}>{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}

function Badge({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2">
        <span>🏅</span>
        <div className="font-medium">{title}</div>
      </div>
      <div className="mt-1 text-sm text-gray-600">{desc}</div>
    </div>
  );
}

function Legend({ color, label, value }: { color: "green" | "blue" | "gray" | "red"; label: string; value: string }) {
  const dot =
    color === "green" ? "bg-emerald-500" :
    color === "blue" ? "bg-blue-500" :
    color === "red" ? "bg-rose-500" : "bg-gray-500";
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-sm">
        <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
        <span>{label}</span>
      </div>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function GhostBtn({ children }: { children: React.ReactNode }) {
  return (
    <button className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50">
      {children}
    </button>
  );
}

function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-48 rounded-xl border border-dashed bg-gradient-to-b from-gray-50 to-white grid place-items-center text-gray-500 text-sm">
      {children}
    </div>
  );
}
