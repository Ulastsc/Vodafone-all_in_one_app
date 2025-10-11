"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

/** Vodafone kırmızısı (şu an sadece tab aktif rengi için saklı) */
const VODA_RED = "#E60000";

/* ----------------------------- Türler ----------------------------- */
type TabKey = "tasks" | "requests" | "team" | "performance" | "sprints" | "analytics";

type Tone =
  | "yellow"
  | "rose"
  | "blue"
  | "orange"
  | "indigo"
  | "emerald"
  | "slate";

type TagSpec = { text: string; tone: Tone; icon?: string };

type SlaSpec = {
  value: number; // 0..100
  color: "amber" | "emerald" | "slate";
  textRight?: string;
  stateText?: string;
};

type RequestCardSpec = {
  title: string;
  code: string;
  rightChip?: TagSpec;
  tagsLeft: TagSpec[];
  description: string;
  assignee: string;
  due: string;
  sla: SlaSpec;
};

/* --------------------------- Yardımcı UI --------------------------- */

function Tag({ text, tone, icon }: TagSpec) {
  const map: Record<Tone, string> = {
    yellow: "bg-amber-500/15 text-amber-300 ring-1 ring-amber-400/20",
    rose: "bg-rose-500/15 text-rose-300 ring-1 ring-rose-400/20",
    blue: "bg-blue-500/15 text-blue-300 ring-1 ring-blue-400/20",
    orange: "bg-orange-500/15 text-orange-300 ring-1 ring-orange-400/20",
    indigo: "bg-indigo-500/15 text-indigo-300 ring-1 ring-indigo-400/20",
    emerald: "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/20",
    slate: "bg-white/10 text-white/70 ring-1 ring-white/10",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs ${map[tone]}`}
    >
      {icon && <span className="text-[11px]">{icon}</span>}
      {text}
    </span>
  );
}

function SLAProgress({ value, color, textRight, stateText }: SlaSpec) {
  const clamped = Math.max(0, Math.min(100, value));
  const bar =
    color === "amber"
      ? "bg-amber-400"
      : color === "emerald"
      ? "bg-emerald-400"
      : "bg-white/20";
  const rightColor =
    color === "amber"
      ? "text-amber-300"
      : color === "emerald"
      ? "text-emerald-300"
      : "text-white/60";
  return (
    <>
      <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
        <div className={`h-2 ${bar}`} style={{ width: `${clamped}%` }} />
      </div>
      <div className="mt-2 flex items-center justify-between text-xs">
        <span className="text-white/60">SLA Progress</span>
        <div className="flex items-center gap-3">
          {textRight && <span className={rightColor}>{textRight}</span>}
          {stateText && <span className="text-rose-300 font-medium">{stateText}</span>}
        </div>
      </div>
    </>
  );
}

function RequestCard(spec: RequestCardSpec) {
  const { title, code, rightChip, tagsLeft, description, assignee, due, sla } = spec;
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur shadow-[0_1px_0_0_rgba(255,255,255,0.06)_inset] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold">{title}</div>
          <div className="text-xs text-white/60">{code}</div>
        </div>
        {rightChip && <Tag {...rightChip} />}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {tagsLeft.map((t) => (
          <Tag key={t.text} {...t} />
        ))}
      </div>

      <p className="mt-4 text-sm text-white/80 leading-relaxed">{description}</p>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-white/60">Atanan:</div>
          <div className="font-medium">{assignee}</div>
        </div>
        <div>
          <div className="text-white/60">Son Tarih:</div>
          <div className="font-medium">📅 {due}</div>
        </div>
      </div>

      <SLAProgress {...sla} />
    </article>
  );
}

function FilterChip({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const base =
    "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm border transition";
  const on = "bg-white/10 border-white/15 text-white shadow";
  const off =
    "bg-transparent border-white/10 text-white/80 hover:bg-white/8 hover:text-white";
  return (
    <button className={`${base} ${active ? on : off}`} onClick={onClick}>
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </button>
  );
}

function RightAlert() {
  return (
    <div className="rounded-xl bg-red-500/10 text-red-300 border border-red-400/20 px-4 py-3 flex items-center gap-3">
      <span className="text-lg">📦</span>
      <div className="font-semibold">Predictive AI Alert</div>
      <div className="text-sm opacity-80">2 SR, SLA aşım riskinde</div>
      <span className="ml-2">⚠️</span>
    </div>
  );
}

function KpiCard({
  title,
  value,
  sub,
  tone,
  icon,
}: {
  title: string;
  value: string;
  sub: string;
  tone?: "green" | "blue" | "purple" | "orange";
  icon?: string;
}) {
  const toneBg =
    tone === "green"
      ? "from-emerald-500/15 to-emerald-500/0"
      : tone === "blue"
      ? "from-blue-500/15 to-blue-500/0"
      : tone === "purple"
      ? "from-fuchsia-500/15 to-fuchsia-500/0"
      : "from-orange-500/15 to-orange-500/0";
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-5 relative overflow-hidden">
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${toneBg}`} />
      <div className="relative flex items-center justify-between">
        <div className="text-white/70 text-sm">{title}</div>
        {icon && (
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-white/7 text-white/80">
            {icon}
          </div>
        )}
      </div>
      <div className="relative mt-2 text-3xl font-extrabold tracking-tight">{value}</div>
      <div className="relative text-xs text-white/60">{sub}</div>
    </article>
  );
}

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "px-4 py-2 rounded-lg text-sm font-medium transition " +
        (active ? "bg-[#E60000] text-white shadow" : "hover:bg-white/10 text-white/80")
      }
    >
      {label}
    </button>
  );
}

/* -------------------------- Requests Section -------------------------- */

function RequestsSection() {
  const cards: RequestCardSpec[] = [
    {
      title: "Agent performans optimizasyonu gerekiyor",
      code: "#SR-2024-001",
      rightChip: { text: "Monitoring", tone: "yellow", icon: "🛠" },
      tagsLeft: [
        { text: "In Progress", tone: "yellow", icon: "⚡" },
        { text: "Critical", tone: "rose" },
        { text: "Performance", tone: "blue" },
      ],
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
      assignee: "Ulaş Taşçıoğlu",
      due: "08.12.2024",
      sla: { value: 78, color: "amber", textRight: "38h / 48h", stateText: "Delay" },
    },
    {
      title: "Yeni chatbot entegrasyonu talebi",
      code: "#SR-2024-002",
      tagsLeft: [
        { text: "Open", tone: "blue" },
        { text: "High", tone: "orange" },
        { text: "Integration", tone: "indigo" },
      ],
      description:
        "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Mauris viverra veniam sit amet lacus cursus de turpis egestas.",
      assignee: "Kübra Aydın",
      due: "09.12.2024",
      sla: { value: 65, color: "emerald", textRight: "18h / 96h" },
    },
  ];

  return (
    <section className="space-y-4">
      <div>
        <div className="text-2xl font-semibold">Service Request Tracking</div>
        <div className="text-sm text-white/60">Ekip 2 ekibine açılan servis talepleri</div>
      </div>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="flex items-center gap-2">
          <FilterChip active icon="⚠️" label="Tüm Talepler" />
          <FilterChip icon="🛡️" label="Riskli Talepler (2)" />
          <FilterChip icon="👤" label="Benim Taleplerim" />
        </div>
        <div className="lg:ml-auto">
          <RightAlert />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((c) => (
          <RequestCard key={c.code} {...c} />
        ))}
      </div>

      <div className="grid gap-4">
        <RequestCard
          title="API response time iyileştirmesi"
          code="#SR-2024-003"
          tagsLeft={[
            { text: "Backlog", tone: "slate" },
            { text: "Performance", tone: "blue" },
          ]}
          description="Backlog’daki performans optimizasyonları için izleme ve iyileştirme planı."
          assignee="Ulaş Taşçıoğlu"
          due="15.12.2024"
          sla={{ value: 0, color: "slate" }}
        />
      </div>
    </section>
  );
}

/* ----------------------------- Team Section ----------------------------- */

type Member = {
  initials: string;
  name: string;
  title: string;
  performance: number; // %
  status: "Active" | "Busy";
  isYou?: boolean;
};

const TEAM_MEMBERS: Member[] = [
  {
    initials: "UT",
    name: "Ulaş Taşcıoğlu",
    title: "DevOps Service Engineer",
    performance: 90,
    status: "Busy",
    isYou: true,
  },
  {
    initials: "KA",
    name: "Kübra Aydın",
    title: "DevOps Service Engineer",
    performance: 90,
    status: "Busy",
  },
  {
    initials: "PT",
    name: "Peren Taşkıran",
    title: "DevOps Service Engineer",
    performance: 90,
    status: "Active",
  },
  {
    initials: "SU",
    name: "Sude Uzun",
    title: "DevOps Service Engineer",
    performance: 90,
    status: "Active",
  },
  {
    initials: "YEE",
    name: "Yunus Emre Ekici",
    title: "DevOps Service Engineer",
    performance: 90,
    status: "Active",
  },
];

function TeamView() {
  return (
    <section className="space-y-6">
      {/* Başlık */}
      <div>
        <h2 className="text-[22px] md:text-[24px] font-semibold text-white">
          Reporting and Analytics
        </h2>
        <p className="text-sm text-white/60 mt-1">
          Business intelligence, reporting and data analytics
        </p>
      </div>

      {/* Üyeler kartları */}
      <div className="grid gap-5 md:grid-cols-2">
        {TEAM_MEMBERS.map((m) => (
          <MemberCard key={m.name} {...m} />
        ))}
      </div>

      {/* Team Sprint Overview */}
      <TeamSprintOverview />
    </section>
  );
}

function MemberCard({ initials, name, title, performance, status, isYou }: Member) {
  const statusChip =
    status === "Active"
      ? "bg-emerald-100/10 text-emerald-300 border border-emerald-400/20"
      : "bg-amber-100/10 text-amber-300 border border-amber-400/20";

  return (
    <article className="rounded-2xl border border-white/10 bg-[#111827]/70 backdrop-blur p-5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6)]">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="relative">
          <div className="h-16 w-16 rounded-full grid place-items-center text-white font-semibold bg-gradient-to-br from-emerald-500 to-green-600">
            {initials}
          </div>
          <span
            className={`absolute -right-1 -bottom-1 h-3 w-3 rounded-full ring-2 ring-[#111827] ${
              status === "Active" ? "bg-emerald-400" : "bg-amber-400"
            }`}
          />
        </div>

        {/* İçerik */}
        <div className="flex-1">
          <div className="text-white font-semibold text-[15px]">{name}</div>
          <div className="text-[12px] text-white/60">{title}</div>

          <div className="mt-4 text-sm text-white/70">Performance</div>
          <div className="mt-1 flex items-center gap-3">
            <ProgressBar value={performance} />
            <span className="text-white font-semibold">{performance}%</span>
          </div>

          <div className="mt-3">
            <span className={`text-xs px-3 py-1 rounded-lg ${statusChip}`}>{status}</span>
          </div>

          {isYou && (
            <div className="mt-4">
              <div className="rounded-full bg-emerald-600/20 border border-emerald-400/30 text-emerald-200 text-center text-sm py-2">
                You
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="h-2.5 w-full max-w-[340px] rounded-full bg-white/10 overflow-hidden">
      <div
        className="h-2.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
        style={{ width: `${v}%` }}
      />
    </div>
  );
}

function TeamSprintOverview() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0b1322]/80 backdrop-blur p-5">
      <div className="flex items-center gap-2 text-white/80">
        <span className="text-emerald-400">▦</span>
        <div className="font-medium">Team Sprint Overview</div>
      </div>
      <p className="text-sm text-white/60 mt-1">
        Current sprint progress and statistics
      </p>

      <div className="mt-5 grid gap-4 md:grid-cols-4">
        <StatTile color="from-[#0ea5e9]/20 to-[#38bdf8]/10" number="5" label="Total Tasks" />
        <StatTile color="from-[#10b981]/20 to-[#34d399]/10" number="1" label="Completed" />
        <StatTile color="from-[#f59e0b]/20 to-[#fbbf24]/10" number="4" label="Remaining" />
        <StatTile color="from-[#8b5cf6]/20 to-[#a78bfa]/10" number="68%" label="Progress" />
      </div>
    </div>
  );
}

function StatTile({
  number,
  label,
  color,
}: {
  number: string;
  label: string;
  color: string;
}) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-gradient-to-br ${color} p-6`}>
      <div className="text-4xl font-bold text-white">{number}</div>
      <div className="mt-1 text-sm text-white/70">{label}</div>
    </div>
  );
}

/* -------------------------- Ana Dashboard --------------------------- */

export default function ReportingDashboard() {
  const { data: session } = useSession();
  const name = session?.user?.name ?? "User";

  const [tab, setTab] = useState<TabKey>("tasks");

  useEffect(() => {
    setTab("tasks");
  }, []);

  return (
    <div className="min-h-screen text-white bg-[#0b0d12]">
      {/* HEADER (gradient çubuk) */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[radial-gradient(1200px_600px_at_10%_-20%,rgba(0,200,255,.15),transparent),radial-gradient(1200px_600px_at_90%_-20%,rgba(230,0,0,.18),transparent)]">
        <div className="mx-auto max-w-[1200px] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-green-600 grid place-items-center font-bold">
              {name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
            </div>
            <div>
              <div className="text-xl font-semibold">{name}</div>
              <div className="text-sm text-white/60">
                Team Member – Reporting and Development
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-xs">
              🔗 Sprint RPT-2024.Q1.3
            </span>
            <span className="rounded-full border border-white/15 bg-white/5 px-2 py-1 text-xs">
              📊 Sprint Progress: 68%
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-6 py-8 space-y-8">
        {/* KPI’lar */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard title="Tasks Completed" value="0" sub="This sprint" tone="green" icon="✅" />
          <KpiCard title="In Progress" value="0" sub="Active work" tone="blue" icon="🟢" />
          <KpiCard title="Performance Score" value="93%" sub="↑ +2% this month" tone="purple" icon="📈" />
          <KpiCard title="Sprint Progress" value="68%" sub="Team sprint" tone="orange" icon="🎯" />
        </section>

        {/* Tabs */}
        <div className="flex items-center gap-2 border border-white/10 rounded-xl bg-white/5 p-1 text-sm font-medium">
          <TabButton active={tab === "tasks"} onClick={() => setTab("tasks")} label="Tasks" />
          <TabButton
            active={tab === "requests"}
            onClick={() => setTab("requests")}
            label="Service Requests"
          />
          <TabButton active={tab === "team"} onClick={() => setTab("team")} label="Team" />
          <TabButton
            active={tab === "performance"}
            onClick={() => setTab("performance")}
            label="Performance"
          />
          <TabButton active={tab === "sprints"} onClick={() => setTab("sprints")} label="Sprints" />
          <TabButton
            active={tab === "analytics"}
            onClick={() => setTab("analytics")}
            label="Analytics"
          />
        </div>

        {/* İki kolonlu ana gövde */}
        <section className="grid gap-6 lg:grid-cols-3">
          {/* Sol (2 kolon) */}
          <div className="lg:col-span-2">
            {tab === "requests" ? (
              <RequestsSection />
            ) : tab === "tasks" ? (
              <>
                <div className="text-xl font-semibold mb-2">My Tasks</div>
                <div className="text-sm text-white/60 mb-4">
                  Manage your assigned tasks and track progress
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 text-white/50">
                  No tasks yet.
                </div>
              </>
            ) : tab === "team" ? (
              <TeamView />
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 text-white/70">
                <div className="text-sm">
                  {tab === "performance" && "Performance view (placeholder)"}
                  {tab === "sprints" && "Sprints view (placeholder)"}
                  {tab === "analytics" && "Analytics view (placeholder)"}
                </div>
              </div>
            )}
          </div>

          {/* Sağ (1 kolon) */}
          <div className="space-y-4">
            {/* Task Summary */}
            <article className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
              <div className="font-semibold mb-2">Task Summary</div>
              <ul className="text-sm space-y-1">
                <li className="flex justify-between">
                  <span className="text-white/60">Total Tasks</span>
                  <span>0</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-white/60">Completed</span>
                  <span className="text-emerald-300">0</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-white/60">In Progress</span>
                  <span className="text-blue-300">0</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-white/60">Blocked</span>
                  <span className="text-rose-300">0</span>
                </li>
              </ul>
            </article>

            {/* Current Sprint */}
            <article className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
              <div className="font-semibold mb-1">Current Sprint</div>
              <div className="text-xs text-white/60">Sprint RPT-2024.Q1.3</div>
              <div className="text-xs text-white/60">2024-01-29 – 2024-02-26</div>
              <div className="mt-3">
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-2 bg-white/40" style={{ width: "68%" }} />
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                <div className="rounded-xl border border-emerald-400/20 bg-emerald-500/10 py-2">
                  <div className="text-lg font-bold text-emerald-300">1</div>
                  <div className="text-xs text-white/70">Completed</div>
                </div>
                <div className="rounded-xl border border-blue-400/20 bg-blue-500/10 py-2">
                  <div className="text-lg font-bold text-blue-300">4</div>
                  <div className="text-xs text-white/70">Remaining</div>
                </div>
              </div>
            </article>

            {/* Quick Actions */}
            <article className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
              <div className="font-semibold mb-3">Quick Actions</div>
              <div className="space-y-2">
                <GhostAction>⚡ Create New Task</GhostAction>
                <GhostAction>📄 Generate Report</GhostAction>
                <GhostAction>💬 Team Discussion</GhostAction>
                <GhostAction>⚙️ Settings</GhostAction>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

function GhostAction({ children }: { children: React.ReactNode }) {
  return (
    <button className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-white/80 hover:bg-white/10">
      {children}
    </button>
  );
}