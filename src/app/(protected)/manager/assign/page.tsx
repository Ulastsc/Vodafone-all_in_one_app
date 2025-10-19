"use client";

import { useMemo, useState } from "react";

/* =========================================================
   Türler ve sabitler
   ======================================================= */

type Skill =
  | "Risk Mitigation"
  | "SOX Compliance"
  | "SQL"
  | "Security"
  | "Security Governance"
  | "Statistics"
  | "Tableau"
  | "Dashboard"
  | "Defect"
  | "API Development"
  | "Access Control"
  | "Active Directory"
  | "Automation"
  | "Change Management"
  | "Change Planning";

type TeamKey = "reporting" | "audit" | "uam" | "all";

type Member = {
  id: string; // baş harfler
  name: string;
  title: string;
  team: TeamKey;
  score: number; // performans %
  activeTasks: number;
  completed: number;
  etaDays: number; // tahmini tamamlama
  skills: Skill[];
  avatar?: string;
};

/** Yazılım kategorisi sayılacak yetenekler (kural için) */
const SOFTWARE_SKILLS: ReadonlyArray<Skill> = [
  "API Development",
  "Automation",
  "Active Directory",
  "SQL",
];

const ALL_SKILLS: ReadonlyArray<Skill> = [
  "Risk Mitigation",
  "SOX Compliance",
  "SQL",
  "Security",
  "Security Governance",
  "Statistics",
  "Tableau",
  "Defect",
  "Dashboard",
  "API Development",
  "Access Control",
  "Active Directory",
  "Automation",
  "Change Management",
  "Change Planning",
];

const TEAM_OPTIONS: { label: string; value: TeamKey }[] = [
  { label: "Tüm Ekipler", value: "all" },
  { label: "Reporting & Development", value: "reporting" },
  { label: "Audit & Change Management", value: "audit" },
  { label: "UAM (User Access Management)", value: "uam" },
];

/* Demo veri – ekran görüntülerindeki isimler/istatistikler */
const MEMBERS: ReadonlyArray<Member> = [
  {
    id: "KA",
    name: "Kübra Aydın",
    title: "Reporting & Development",
    team: "reporting",
    score: 94,
    activeTasks: 3,
    completed: 28,
    etaDays: 8,
    skills: ["Statistics", "Tableau"],
  },
  {
    id: "UT",
    name: "Ulaş Taşçıoğlu",
    title: "Reporting & Development",
    team: "reporting",
    score: 94,
    activeTasks: 2,
    completed: 26,
    etaDays: 8,
    skills: ["API Development", "Automation", "SQL", "Tableau"],
  },
  {
    id: "SU",
    name: "Sude Uzun",
    title: "Reporting & Development",
    team: "reporting",
    score: 94,
    activeTasks: 2,
    completed: 22,
    etaDays: 7,
    skills: ["Tableau", "Statistics", "SQL","Dashboard"],
  },
  {
    id: "PT",
    name: "Peren Taşkıran",
    title: "Reporting & Development",
    team: "reporting",
    score: 94,
    activeTasks: 2,
    completed: 21,
    etaDays: 8,
    skills: ["Defect"],
  },
  {
    id: "AA",
    name: "Aysel Ataman",
    title: "Audit & Change",
    team: "audit",
    score: 94,
    activeTasks: 3,
    completed: 22,
    etaDays: 8,
    skills: ["Change Management", "Change Planning", "SOX Compliance"],
  },
];

/* =========================================================
   Sayfa
   ======================================================= */

export default function AssignPage() {
  // Sol form
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [complexity, setComplexity] = useState<
    "low" | "mid" | "high" | "critical"
  >("mid");
  const [team, setTeam] = useState<TeamKey>("all");
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>(["Tableau"]);

  // Sağ: Öneriler
  const recommendations = useMemo(() => {
    const pool =
      team === "all" ? MEMBERS.slice() : MEMBERS.filter((m) => m.team === team);

    // 1) Tableau seçilirse özel sıra: Sude → Ulaş → Kübra, sonra kalanlar
    const wantsTableau = selectedSkills.includes("Tableau");

    // 2) Yazılım becerilerinden biri seçilirse Ulaş en üstte
    const wantsSoftware = selectedSkills.some((s) =>
      SOFTWARE_SKILLS.includes(s)
    );

    // Varsayılan: performans desc
    let sorted = pool.sort((a, b) => b.score - a.score);

    if (wantsTableau) {
      const order = ["Sude Uzun", "Ulaş Taşçıoğlu", "Kübra Aydın"];
      sorted = [
        ...order
          .map((n) => sorted.find((m) => m.name === n))
          .filter(Boolean) as Member[],
        ...sorted.filter((m) => !order.includes(m.name)),
      ];
    } else if (wantsSoftware) {
      // Ulaş'ı başa çek
      const ut = sorted.find((m) => m.name === "Ulaş Taşçıoğlu");
      sorted = ut ? [ut, ...sorted.filter((m) => m !== ut)] : sorted;
    }

    // Skor: beceri eşleşmesine + puan
    const scoreOf = (m: Member) => {
      const matches = selectedSkills.filter((s) => m.skills.includes(s)).length;
      return m.score + matches * 2; // küçük bir boost
    };

    // aynı listedeki eşitliklerde scoreOf'a göre kır
    sorted = sorted.sort((a, b) => scoreOf(b) - scoreOf(a));

    return sorted;
  }, [team, selectedSkills]);

  const toggleSkill = (s: Skill) => {
    setSelectedSkills((cur) =>
      cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]
    );
  };

  return (
    <div className="min-h-screen bg-[#0b0d12] text-white">
      {/* Üst sekme ve başlık barı gibi düşünülebilir */}
      <div className="sticky top-0 z-10 bg-[#0b0d12]/80 backdrop-blur border-b border-white/10">
        <div className="mx-auto max-w-[1200px] px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-lg">🧩</span>
            <div className="text-lg font-semibold">İş Ataması</div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-[1200px] px-6 py-7 grid gap-6 lg:grid-cols-2">
        {/* Sol Sütun – Yeni İş Tanımı */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-2 text-white/80">
            <span className="text-lg">👤</span>
            <h2 className="text-[18px] font-semibold">Yeni İş Tanımla</h2>
          </div>
          <p className="text-sm text-white/60 mt-1">
            İş detaylarını girin ve en uygun ekip üyesini bulun
          </p>

          <div className="mt-5 space-y-4">
            <Field
              label="İş Başlığı"
              placeholder="Örn: PowerShell Otomasyon Scripti"
              value={title}
              onChange={setTitle}
            />
            <Textarea
              label="Açıklama"
              placeholder="İşin detaylı açıklaması…"
              value={desc}
              onChange={setDesc}
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <SelectBox
                label="Karmaşıklık"
                value={complexity}
                onChange={(v) =>
                  setComplexity(v as "low" | "mid" | "high" | "critical")
                }
                options={[
                  { label: "Düşük (1–2 gün)", value: "low" },
                  { label: "Orta (3–5 gün)", value: "mid" },
                  { label: "Yüksek (1–2 hafta)", value: "high" },
                  { label: "Kritik (2+ hafta)", value: "critical" },
                ]}
              />

              <SelectBox
                label="Ekip Seçimi"
                value={team}
                onChange={(v) => setTeam(v as TeamKey)}
                options={TEAM_OPTIONS}
              />
            </div>

            <div>
              <Label>Gerekli Yetenekler (Opsiyonel)</Label>
              <MultiSelect
                value={selectedSkills}
                options={ALL_SKILLS}
                onToggle={toggleSkill}
              />

              {/* Seçili etiketler */}
              {selectedSkills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {selectedSkills.map((s) => (
                    <Chip key={s} onClose={() => toggleSkill(s)}>
                      {s}
                    </Chip>
                  ))}
                </div>
              )}
            </div>

            <InfoCard
              title="Akıllı Öneri Sistemi"
              description="Performans skorları, mevcut iş yükü, yetenek eşleştirmesi ve kategori uzmanları ile en uygun ekip üyesi önerilir."
            />
          </div>
        </section>

        {/* Sağ Sütun – Önerilen Ekip Üyeleri */}
        <section className="space-y-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-2 text-white/80">
              <span className="text-lg">📋</span>
              <h2 className="text-[18px] font-semibold">
                Önerilen Ekip Üyeleri
              </h2>
            </div>
            <p className="text-sm text-white/60 mt-1">
              Performans ve uygunluk skoruna göre sıralandı
            </p>
          </div>

          <div className="space-y-4">
            {recommendations.map((m, idx) => (
              <CandidateCard
                key={m.id}
                rank={idx + 1}
                member={m}
                selectedSkills={selectedSkills}
                onAssign={() => {
                  // burada gerçek API çağrısı yapılabilir
                  alert(`${m.name} göreve atandı`);
                }}
              />
            ))}
          </div>

          {/* Ekip performans özeti kartları – alt bölüm */}
          <TeamPerfSummary />
        </section>
      </main>
    </div>
  );
}

/* =========================================================
   UI Parçaları
   ======================================================= */

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-xs text-white/60 mb-1.5">{children}</div>;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl bg-white/10 border border-white/10 px-3 py-2.5 outline-none focus:border-white/30"
      />
    </div>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="w-full rounded-xl bg-white/10 border border-white/10 px-3 py-2.5 outline-none focus:border-white/30"
      />
    </div>
  );
}

function SelectBox<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { label: string; value: T }[];
}) {
  return (
    <div>
      <Label>{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full rounded-xl bg-white/10 border border-white/10 px-3 py-2.5 outline-none focus:border-white/30"
      >
        {options.map((o) => (
          <option key={String(o.value)} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Readonly desteği ile MultiSelect (hata giderildi) */
function MultiSelect({
  value,
  options,
  onToggle,
}: {
  value: ReadonlyArray<Skill>;
  options: ReadonlyArray<Skill>;
  onToggle: (s: Skill) => void;
}) {
  return (
    <div className="rounded-xl bg-white/10 border border-white/10 p-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
      {options.map((s) => {
        const active = value.includes(s);
        return (
          <button
            type="button"
            key={s}
            onClick={() => onToggle(s)}
            className={
              "text-left rounded-lg px-2 py-2 text-sm border transition " +
              (active
                ? "bg-red-500/15 border-red-400/40 text-red-200"
                : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10")
            }
          >
            {s}
          </button>
        );
      })}
    </div>
  );
}

function Chip({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <span className="inline-flex items-center gap-2 rounded-lg bg-white/10 border border-white/10 px-2 py-1 text-sm">
      {children}
      <button
        type="button"
        onClick={onClose}
        className="text-white/60 hover:text-white"
        aria-label="remove"
      >
        ✕
      </button>
    </span>
  );
}

function InfoCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="mt-3 rounded-xl border border-blue-300/20 bg-blue-400/10 p-4">
      <div className="font-medium">💡 {title}</div>
      <div className="text-sm text-white/80 mt-1">{description}</div>
    </div>
  );
}

function Pill({
  children,
  tone = "slate",
}: {
  children: React.ReactNode;
  tone?: "emerald" | "blue" | "slate";
}) {
  const cls =
    tone === "emerald"
      ? "bg-emerald-500/10 text-emerald-200 border-emerald-400/30"
      : tone === "blue"
      ? "bg-blue-500/10 text-blue-200 border-blue-400/30"
      : "bg-white/10 text-white/70 border-white/10";
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[12px] ${cls}`}
    >
      {children}
    </span>
  );
}

function ProgressBar({ value }: { value: number }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
      <div className="h-2 bg-white/40" style={{ width: `${v}%` }} />
    </div>
  );
}

/** Aday kartı – ekran görüntülerindeki şablona benzer */
function CandidateCard({
  rank,
  member,
  selectedSkills,
  onAssign,
}: {
  rank: number;
  member: Member;
  selectedSkills: ReadonlyArray<Skill>;
  onAssign: () => void;
}) {
  const scoreColor = rank === 1 ? "text-emerald-300" : "text-white/80";
  const badge =
    rank === 1
      ? "bg-emerald-500/15 text-emerald-200"
      : rank === 2
      ? "bg-blue-500/15 text-blue-200"
      : "bg-violet-500/15 text-violet-200";

  const matched = selectedSkills.filter((s) => member.skills.includes(s));

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={`grid h-8 w-8 place-items-center rounded-md text-sm font-semibold ${badge}`}
            aria-label={`rank ${rank}`}
          >
            #{rank}
          </span>

          <div className="h-10 w-10 rounded-full bg-white/10 grid place-items-center text-sm font-semibold">
            {member.id}
          </div>

          <div>
            <div className="font-semibold leading-tight">{member.name}</div>
            <div className="text-xs text-white/70">
              {member.team === "reporting"
                ? "Reporting & Development"
                : member.team === "audit"
                ? "Audit & Change Management"
                : "UAM"}{" "}
              · {member.title}
            </div>
          </div>
        </div>

        <div className={`flex items-center gap-2 ${scoreColor}`}>
          <span className="text-[13px]">Uygunluk Skoru</span>
          <span className="text-xl font-bold">{member.score}</span>
        </div>
      </div>

      <div className="mt-3 grid sm:grid-cols-3 gap-2">
        <StatBox label="Performans" value={`${member.score}%`} />
        <StatBox label="Aktif Görev" value={`${member.activeTasks}`} />
        <StatBox label="Tamamlanan" value={`${member.completed}`} />
      </div>

      <div className="mt-3 rounded-xl bg-white/5 border border-white/10 p-3">
        <div className="text-sm text-white/80">Tahmini Tamamlanma Süresi</div>
        <div className="flex items-baseline gap-2">
          <div className="text-lg font-semibold">{member.etaDays} gün</div>
          <div className="text-xs text-white/60">{member.etaDays * 7} saat</div>
        </div>
        <ProgressBar value={Math.min(100, 100 - member.etaDays * 5)} />
      </div>

      {/* Eşleşen yetenekler */}
      {selectedSkills.length > 0 && (
        <div className="mt-3 text-sm">
          <div className="text-white/70">Eşleşen Yetenekler:</div>
          <div className="mt-1 flex flex-wrap gap-2">
            {matched.length > 0 ? (
              matched.map((s) => <Pill key={s}>{s}</Pill>)
            ) : (
              <Pill tone="slate">—</Pill>
            )}
          </div>
        </div>
      )}

      <div className="mt-4">
        <button
          onClick={onAssign}
          className="w-full rounded-xl bg-gradient-to-b from-red-500 to-red-700 py-2 font-medium shadow-[0_10px_30px_rgba(230,0,0,.35)]"
        >
          {member.name}
          {" 'e Ata"}
        </button>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
      <div className="text-xs text-white/70">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

/** Alt taraftaki ekip performans özeti kutuları (görsele uygun) */
function TeamPerfSummary() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="flex items-center gap-2">
        <span>📈</span>
        <div className="font-semibold">Ekip Performans Analizi</div>
      </div>
      <div className="text-sm text-white/60">
        Mevcut iş yükü ve performans skorlarına göre ekip kapasitesi
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <PerfCard
          name="Reporting & Development"
          perf={93}
          avgTasks={3.0}
          itOps={95}
        />
        <PerfCard
          name="Audit & Change Management"
          perf={90}
          avgTasks={3.0}
          itOps={91}
        />
        <PerfCard name="UAM" perf={89} avgTasks={3.0} itOps={89} />
      </div>
    </div>
  );
}

function PerfCard({
  name,
  perf,
  avgTasks,
  itOps,
}: {
  name: string;
  perf: number;
  avgTasks: number;
  itOps: number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between">
        <div className="font-semibold">{name}</div>
        <Pill>Orta Kapasite</Pill>
      </div>

      <div className="mt-2 text-sm text-white/70">Ort. Performans</div>
      <ProgressBar value={perf} />
      <div className="mt-2 grid grid-cols-2 gap-2 text-center">
        <div className="rounded-xl border border-white/10 bg-white/5 py-2">
          <div className="text-lg font-bold">{avgTasks}</div>
          <div className="text-xs text-white/70">Ort. Görev</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 py-2">
          <div className="text-lg font-bold">{itOps}</div>
          <div className="text-xs text-white/70">ITOps</div>
        </div>
      </div>
    </div>
  );
}