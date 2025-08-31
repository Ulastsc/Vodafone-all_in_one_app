"use client";

import { useState } from "react";

/** Vodafone kırmızısı */
const VODARED = "#E60000";

/** =========================
 *  Manager Dashboard (Ahmet)
 *  ========================= */
export default function ManagerDashboard() {
  const [tab, setTab] = useState<
    "overview" | "teams" | "performance" | "savings" | "risk" | "analytics"
  >("overview");

  const KPIS = [
    { label: "Team Performance", value: "88%", sub: "↑ +3.2% from last month", icon: "📈", accent: "text-emerald-600" },
    { label: "Tasks Completed", value: "127", sub: "26 in progress, 16 blocked", icon: "✅", accent: "text-blue-600" },
    { label: "Risks Prevented", value: "53", sub: "🔴 High-impact risks", icon: "🛡️", accent: "text-rose-600" },
  ];

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-[#111827]">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200">
        <div className="mx-auto max-w-[1200px] px-6 py-4 flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-violet-100 grid place-items-center"></div>
          <div className="flex-1">
            <div className="text-[18px] font-semibold leading-tight">Manager Dashboard</div>
            <div className="text-[12.5px] text-gray-600">
              Welcome back, Ahmet Koylu – Operations Manager
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-gray-600">
            <span className="rounded-full border px-2 py-1">👥 12 Team Members</span>
            <span className="rounded-full border px-2 py-1">📌 169 Active Tasks</span>
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
              <div className={`mt-1 text-[26px] font-bold ${k.accent}`}>{k.value}</div>
              <div className="text-[12px] text-gray-500">{k.sub}</div>
            </article>
          ))}
        </section>

        {/* Tabs */}
        <div className="flex items-center gap-2 border rounded-xl bg-white p-1 text-sm font-medium text-gray-600">
          <TabButton active={tab === "overview"} onClick={() => setTab("overview")} label="Overview" />
          <TabButton active={tab === "teams"} onClick={() => setTab("teams")} label="Teams" />
          <TabButton active={tab === "performance"} onClick={() => setTab("performance")} label="Performance" />
          <TabButton active={tab === "savings"} onClick={() => setTab("savings")} label="Savings" />
          <TabButton active={tab === "risk"} onClick={() => setTab("risk")} label="Risk Management" />
          <TabButton active={tab === "analytics"} onClick={() => setTab("analytics")} label="Analytics" />
        </div>

        {/* CONTENT */}
        {tab === "overview" && <OverviewSection />}
        {tab === "teams" && <TeamsSection />}
        {tab === "performance" && <PerformanceSection />}
        {tab === "savings" && <SavingsSection />}
        {tab === "risk" && <RiskSection />}
        {tab === "analytics" && <AnalyticsSection />}
      </main>
    </div>
  );
}

/* =================== Sections =================== */

/** Overview */
function OverviewSection() {
  return (
    <section className="space-y-5">
      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card title="Team Performance Trends" subtitle="Monthly performance scores by team">
          <ChartLegend legends={["Audit", "Change", "Reporting", "UAM"]} />
          <Placeholder>(line chart)</Placeholder>
        </Card>

        <Card title="Task Progress Overview" subtitle="Monthly task completion and progress">
          <Legend color="red" label="Blocked" value="" />
          <Legend color="green" label="Completed" value="" />
          <Legend color="orange" label="In Progress" value="" />
          <Placeholder>(stacked bars)</Placeholder>
        </Card>
      </div>

      {/* Teams row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <TeamCard
          name="UAM (User Access Management)"
          members={3}
          perf={87}
          sprint={76}
          done={32}
          inprog={8}
          blocked={5}
          color="indigo"
        />
        <TeamCard
          name="Audit and Change"
          members={3}
          perf={91}
          sprint={82}
          done={28}
          inprog={6}
          blocked={4}
          color="rose"
        />
        
        <TeamCard
          name="Reporting and Analytics"
          members={3}
          perf={88}
          sprint={88}
          done={26}
          inprog={5}
          blocked={3}
          color="emerald"
        />
      </div>
    </section>
  );
}

/** ================= Teams (solda liste + sağda combined stats) ================ */

function TeamsSection() {
  const teams = [
    { key: "all",  name: "All Teams", color: "black" as const },
    { key: "uam",  name: "UAM (User Access Management)", color: "blue"  as const },
    { key: "audit",name: "Audit and Compliance",          color: "rose"  as const },
    { key: "change",name: "Change Management",            color: "purple"as const },
    { key: "report",name:"Reporting and Analytics",       color: "green" as const },
  ];
  const [selected, setSelected] = useState("all");

  const cards: Array<{
    name: string;
    members: number;
    avg: string;      // "%91 avg"
    avgTone: "good" | "ok"; // sağ üst mini rozet tonu
    completed: number;
    inProgress: number;
    blocked: number;
    savings: string;  // "€145K"
  }> = [
    { name: "UAM (User Access Management)", members: 3, avg: "87% avg",  avgTone: "ok",  completed: 32, inProgress: 8, blocked: 5, savings: "€145K" },
    { name: "Audit and Compliance",         members: 3, avg: "91% avg",  avgTone: "good",completed: 28, inProgress: 6, blocked: 4, savings: "€89K"  },
    { name: "Change Management",            members: 3, avg: "85% avg",  avgTone: "ok",  completed: 41, inProgress: 7, blocked: 4, savings: "€203K" },
    { name: "Reporting and Analytics",      members: 3, avg: "88% avg",  avgTone: "ok",  completed: 26, inProgress: 5, blocked: 3, savings: "€78K"  },
  ];

  const filtered = selected === "all"
    ? cards
    : cards.filter(c =>
        (selected === "uam" && c.name.startsWith("UAM")) ||
        (selected === "audit" && c.name.startsWith("Audit")) ||
        (selected === "change" && c.name.startsWith("Change")) ||
        (selected === "report" && c.name.startsWith("Reporting"))
      );

  return (
    <section className="grid gap-5 md:grid-cols-3">
      {/* Sol menu */}
      <div className="md:col-span-1 rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
        <div className="font-semibold">Teams</div>
        <div className="text-xs text-gray-500">Select a team to view details</div>

        <div className="mt-3 space-y-2">
          {teams.map(t => (
            <button
              key={t.key}
              onClick={() => setSelected(t.key)}
              className={
                "w-full flex items-center gap-3 rounded-lg px-3 py-2 border " +
                (selected === t.key
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50")
              }
            >
              <span
                className={
                  "inline-block h-2.5 w-2.5 rounded-full " +
                  (t.color === "blue"   ? "bg-blue-500"   :
                   t.color === "rose"   ? "bg-rose-500"   :
                   t.color === "purple" ? "bg-violet-500" :
                   t.color === "green"  ? "bg-emerald-500": "bg-gray-500")
                }
              />
              <span className="text-sm">{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sağ içerik */}
      <div className="md:col-span-2 rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
        <div className="font-semibold">All Teams Overview</div>
        <div className="text-xs text-gray-500">Combined team statistics</div>

        <div className="mt-3 space-y-3">
          {filtered.map((c) => (
            <TeamStatCard key={c.name} {...c} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamStatCard(props: {
  name: string;
  members: number;
  avg: string;
  avgTone: "good" | "ok";
  completed: number;
  inProgress: number;
  blocked: number;
  savings: string;
}) {
  const badgeColor =
    props.avgTone === "good"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-gray-100 text-gray-700";

  return (
    <article className="rounded-xl border border-gray-100 p-4 hover:shadow-sm transition">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">{props.name}</div>
          <div className="text-xs text-gray-500">{props.members} members</div>
        </div>
        <span className={`text-[11px] rounded-md px-2 py-1 ${badgeColor}`}>
          {props.avg}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-3 text-center">
        <MiniKPI label="Completed"  value={String(props.completed)} color="green" />
        <MiniKPI label="In Progress" value={String(props.inProgress)} color="blue" />
        <MiniKPI label="Blocked"    value={String(props.blocked)} color="red" />
        <MiniKPI label="Savings"    value={props.savings}         color="purple" />
      </div>
    </article>
  );
}

/** ================= Performance (görseldeki gibi) ================ */

function PerformanceSection() {
  // Sol listede görünecek bireysel skorlar
  const people = [
    
    { id: "KA", name: "Kübra Aydın", team: "Reporting",      score: 96, avatar: "" },
    { id: "UT", name: "Ulaş Taşçıoğlu", team: "Reporting",     score: 88, avatar: "" },
  ];

  // Sağdaki pasta grafiği için dağılım
  const distribution = [
    { label: "90–100%", value: 4, color: "#10B981" }, // emerald
    { label: "80–89%",  value: 6, color: "#3B82F6" }, // blue
    { label: "70–79%",  value: 2, color: "#F59E0B" }, // amber
    { label: "Below 70%", value: 0, color: "#EF4444" } // red
  ];

  return (
    <section className="grid gap-5 md:grid-cols-2">
      {/* Sol: Bireysel skor listesi */}
      <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
        <div className="font-semibold">Individual Performance Scores</div>
        <div className="text-xs text-gray-500">Current performance ratings by team member</div>

        <div className="mt-3 space-y-3">
          {people.map((p) => (
            <IndividualRow
              key={p.id}
              id={p.id}
              name={p.name}
              team={p.team}
              score={p.score}
              avatar={p.avatar}
            />
          ))}
        </div>
      </div>

      {/* Sağ: Dağılım (Pasta) */}
      <div className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
        <div className="font-semibold">Performance Distribution</div>
        <div className="text-xs text-gray-500">Team performance score ranges</div>

        <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
          <PieChart data={distribution} />

          <div className="space-y-2 text-sm">
            {distribution.map((d) => (
              <div key={d.label} className="flex items-center gap-2">
                <span className="inline-block h-3 w-3 rounded-sm" style={{ background: d.color }} />
                <span className={d.label === "Below 70%" ? "text-rose-600" : ""}>
                  {d.label}: <strong>{d.value}</strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Savings (placeholder) */
function SavingsSection() {
  return (
    <Card title="Cost Savings" subtitle="Quarterly savings and impact by initiatives">
      <Placeholder>(waterfall / area + breakdown)</Placeholder>
    </Card>
  );
}

/** Risk (placeholder) */
function RiskSection() {
  return (
    <Card title="Risk Management" subtitle="Open risks, mitigations and SLA">
      <Placeholder>(risk matrix + trend + SLA widgets)</Placeholder>
    </Card>
  );
}

/** Analytics (placeholder) */
function AnalyticsSection() {
  return (
    <Card title="Analytics" subtitle="Insights and automation suggestions">
      <Placeholder>(insight cards + anomalies)</Placeholder>
    </Card>
  );
}

/* =================== UI Pieces =================== */

function TabButton({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick(): void;
}) {
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

function TeamCard({
  name,
  members,
  perf,
  sprint,
  done,
  inprog,
  blocked,
  color,
}: {
  name: string;
  members: number;
  perf: number;
  sprint: number;
  done: number;
  inprog: number;
  blocked: number;
  color: "indigo" | "rose" | "violet" | "emerald";
}) {
  const colorCls =
    color === "indigo" ? "text-indigo-600" :
    color === "rose" ? "text-rose-600" :
    color === "violet" ? "text-violet-600" : "text-emerald-600";

  return (
    <article className="rounded-2xl bg-white p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2">
        <span className={`text-xl ${colorCls}`}>⬤</span>
        <div className="font-semibold text-[13.5px] leading-tight">{name}</div>
      </div>
      <div className="text-[11px] text-gray-500 mt-1">{members} members</div>

      <div className="mt-3 text-sm">Performance</div>
      <Progress value={perf} />
      <div className="mt-3 text-sm">Sprint Progress</div>
      <Progress value={sprint} />

      <div className="mt-3 grid grid-cols-3 text-center text-[11px]">
        <div>
          <div className="text-emerald-600 font-semibold">{done}</div>
          <div className="text-gray-500">Done</div>
        </div>
        <div>
          <div className="text-blue-600 font-semibold">{inprog}</div>
          <div className="text-gray-500">In Progress</div>
        </div>
        <div>
          <div className="text-rose-600 font-semibold">{blocked}</div>
          <div className="text-gray-500">Blocked</div>
        </div>
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
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="h-3 rounded-full bg-gray-200 overflow-hidden">
      <div className="h-3 rounded-full bg-[#111827]" style={{ width: `${v}%` }} />
    </div>
  );
}

function Legend({
  color,
  label,
  value,
}: {
  color: "green" | "blue" | "gray" | "red" | "orange";
  label: string;
  value: string;
}) {
  const dot =
    color === "green" ? "bg-emerald-500" :
    color === "blue" ? "bg-blue-500" :
    color === "red" ? "bg-rose-500" :
    color === "orange" ? "bg-orange-500" : "bg-gray-500";
  return (
    <div className="flex items-center justify-between text-[13px]">
      <div className="flex items-center gap-2">
        <span className={`h-2.5 w-2.5 rounded-full ${dot}`} />
        <span>{label}</span>
      </div>
      {value && <span className="font-medium">{value}</span>}
    </div>
  );
}

function ChartLegend({ legends }: { legends: string[] }) {
  return (
    <div className="flex flex-wrap gap-3 text-[12px] text-gray-600 mb-2">
      {legends.map((l) => (
        <span key={l} className="inline-flex items-center gap-2">
          <span className="h-2.5 w-4 rounded bg-gray-300" />
          {l}
        </span>
      ))}
    </div>
  );
}

function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-56 rounded-xl border border-dashed bg-gradient-to-b from-gray-50 to-white grid place-items-center text-gray-500 text-sm">
      {children}
    </div>
  );
}

/* ============ Performance helper components ============ */

function IndividualRow({
  id,
  name,
  team,
  score,
  avatar,
}: {
  id: string;
  name: string;
  team: string;
  score: number;
  avatar?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-gray-100 px-3 py-3">
      <div className="h-10 w-10 rounded-full bg-gray-100 grid place-items-center overflow-hidden">
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt={name} className="h-full w-full object-cover" />
        ) : (
          <span className="text-[12px] font-semibold text-gray-700">{id}</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium truncate">{name}</div>
        <div className="text-[11.5px] text-gray-500 truncate">{team}</div>
      </div>

      <div className="w-40 flex items-center gap-3">
        <Bar value={score} />
        <span className="text-[13px] font-semibold">{score}%</span>
      </div>
    </div>
  );
}

function Bar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="h-2.5 w-full rounded-full bg-gray-200 overflow-hidden">
      <div className="h-full rounded-full bg-[#111827]" style={{ width: `${v}%` }} />
    </div>
  );
}

/** Basit pasta grafik (SVG) – dış kütüphane yok */
function PieChart({ data }: { data: { label: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;

  // SVG ayarları
  const size = 220;
  const r = size / 2 - 8;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  // segmentler
  let offset = 0;
  const segments = data.map((d, idx) => {
    const pct = d.value / total;
    const len = pct * circumference;
    const seg = (
      <circle
        key={idx}
        r={r}
        cx={cx}
        cy={cy}
        fill="transparent"
        stroke={d.color}
        strokeWidth={18}
        strokeDasharray={`${len} ${circumference - len}`}
        strokeDashoffset={-offset}
      />
    );
    offset += len;
    return seg;
  });

  return (
    <div className="flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Gri taban halkası */}
        <circle r={r} cx={cx} cy={cy} fill="transparent" stroke="#e5e7eb" strokeWidth={18} />
        {segments}
      </svg>
    </div>
  );
}

function MiniKPI({ label, value, color }: { label: string; value: string; color?: "green" | "blue" | "red" | "purple" }) {
  const colorCls =
    color === "green"  ? "text-emerald-600" :
    color === "blue"   ? "text-blue-600"    :
    color === "red"    ? "text-rose-600"    :
    color === "purple" ? "text-purple-600"  : "text-gray-900";
  return (
    <div className="py-2 rounded-xl border border-gray-100 bg-white shadow-sm">
      <div className={`text-xl font-bold ${colorCls}`}>{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}
