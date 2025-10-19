"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

/**
 * Kumbara – İş Yükü Tasarruf Merkezi
 * - Kartlar, özet KPI’lar
 * - Pie (kategori dağılımı) – pure CSS conic-gradient
 * - Bar (ekip bazlı) – basit responsive barlar
 * - Area (trend) – inline SVG alan grafiği
 * - Proje Listesi – etiketler ve istatistikler
 *
 * Not: Harici chart kütüphanesi yok; görseller pure CSS/SVG ile üretildi.
 */

const VODARED = "#E60000";

export default function KumbaraPage() {
  const { data } = useSession();
  const name = data?.user?.name ?? "Kullanıcı";

  return (
    <div className="min-h-screen bg-[#0b0d12] text-white">
      {/* Üst şerit */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-[radial-gradient(1200px_600px_at_10%_-20%,rgba(0,200,255,.12),transparent),radial-gradient(1200px_600px_at_90%_-20%,rgba(230,0,0,.16),transparent)]">
        <div className="mx-auto max-w-[1200px] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-500/15 grid place-items-center">
              <span className="text-xl">🧮</span>
            </div>
            <div className="text-sm">
              <div className="text-white/90">{name}</div>
              <div className="text-white/50 -mt-0.5">Team Member</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-3 text-sm">
            <Link className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10" href="/dashboard">Dashboard</Link>
            <span className="px-3 py-1.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-200">Kumbara</span>
            <Link className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10" href="/tool">Dashboard Tool</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-6 py-6 space-y-6">
        {/* Kırmızı büyük banner */}
        <section className="rounded-3xl bg-gradient-to-br from-[#ef3a3a] to-[#a80000] p-6 md:p-8 shadow-[0_40px_120px_rgba(230,0,0,.25)] border border-white/10">
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-white/10 grid place-items-center">
                <span className="text-2xl">🐷</span>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-extrabold">Kumbara</div>
                <div className="text-white/90 font-medium -mt-1">
                  İş Yükü Tasarruf Merkezi
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-5xl md:text-6xl font-extrabold tracking-tight">48,860</div>
              <div className="text-white/90 font-medium -mt-1">Yıllık Tasarruf (Saat)</div>
            </div>
          </div>

          <p className="mt-5 max-w-4xl text-white/90 leading-relaxed">
            Vodafone içinde geliştirilen projelerin sağladığı iş yükü tasarrufları ve etkilerini
            takip edin. Her saat tasarrufu, ekiplerimizin daha değerli işlere odaklanmasını sağlıyor.
          </p>
        </section>

        {/* Üçlü KPI */}
        <section className="grid gap-4 md:grid-cols-3">
          <SmallKPI
            title="Haftalık Tasarruf"
            value="940 saat"
            sub="~24 kişi eşdeğeri"
            rightIcon="🔁"
            tone="blue"
          />
          <SmallKPI title="Toplam Puan" value="82,100" sub="10 aktif proje" rightIcon="🔐" tone="green" />
          <SmallKPI title="Etkilenen Kullanıcı" value="3760" sub="Tüm Vodafone ekipleri" rightIcon="👥" tone="purple" />
        </section>

        {/* Grafikler */}
        <section className="grid gap-4 md:grid-cols-2">
          {/* Pie */}
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-lg font-semibold">Kategori Bazlı Dağılım</div>
            <div className="text-sm text-white/60 -mt-0.5 mb-4">
              Proje türlerine göre toplam puan dağılımı
            </div>

            <div className="grid gap-6 md:grid-cols-2 items-center">
              <div className="mx-auto">
                {/* conic pie */}
                <div
                  className="h-52 w-52 rounded-full shadow-inner"
                  style={{
                    background:
                      "conic-gradient(#ef4444 0 46%, #f59e0b 46% 66%, #10b981 66% 82%, #3b82f6 82% 100%)",
                  }}
                />
              </div>
              <ul className="space-y-2 text-sm">
                <LegendDot color="#ef4444" label="AI Agent" value="46%" />
                <LegendDot color="#10b981" label="Otomasyon" value="20%" />
                <LegendDot color="#f59e0b" label="Entegrasyon" value="20%" />
                <LegendDot color="#3b82f6" label="Optimizasyon" value="17%" />
              </ul>
            </div>
          </article>

          {/* Bar */}
          <article className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-lg font-semibold">Ekip Bazlı Tasarruf</div>
            <div className="text-sm text-white/60 -mt-0.5 mb-4">
              Yıllık toplam saat tasarrufu (ekip)
            </div>

            <Bars
              items={[
                { label: "OpEx", value: 27000 },
                { label: "Ekip 2", value: 9000 },
                { label: "Ekip 3", value: 12000 },
                { label: "Ekip 4", value: 2500 },
              ]}
              max={28000}
            />
          </article>
        </section>

        {/* Trend (Area) */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="text-lg font-semibold">Tasarruf Trendi</div>
          <div className="text-sm text-white/60 -mt-0.5 mb-4">
            Son 6 aydaki kümülatif iş yükü tasarrufu (saat)
          </div>

          <AreaTrend />
        </section>

        {/* Proje Listesi */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-2 md:p-4">
          <div className="px-2 md:px-1 md:pl-2 py-2 text-[15px] font-semibold">Proje Listesi</div>

          <div className="space-y-4">
            <ProjectRow
              icon="🧱"
              title="AI Chat Asistan"
              desc="Tüm sistemlerde kullanılabilen AI yardım asistanı"
              chips={["AI Agent", "OpEx", "650 kullanıcı", "Aktif"]}
              weekly="140h"
              monthly="605h"
              yearly="7280h"
              score="10,500"
              risk="Yüksek"
            />
            <ProjectRow
              icon="🧱"
              title="Agent Builder Dashboard"
              desc="No-code AI agent geliştirme platformu"
              chips={["AI Agent", "Ekip 3", "580 kullanıcı", "Aktif"]}
              weekly="150h"
              monthly="650h"
              yearly="7800h"
              score="10,200"
              risk="Yüksek"
            />
            <ProjectRow
              icon="📊"
              title="Dashboard Konsolidasyonu"
              desc="Tüm dashboardların tek platform altında birleştirilmesi"
              chips={["Entegrasyon", "OpEx", "520 kullanıcı", "Aktif"]}
              weekly="110h"
              monthly="475h"
              yearly="5720h"
              score="9,280"
              risk="Yüksek"
            />
            <ProjectRow
              icon="🛠️"
              title="Sprint Task Otomasyonu"
              desc="Sprint bazlı task atama ve takip otomasyonu"
              chips={["Otomasyon", "Ekip 2", "320 kullanıcı", "Aktif"]}
              weekly="95h"
              monthly="410h"
              yearly="4920h"
              score="8,620"
              risk="Orta"
            />
          </div>
        </section>
      </main>
    </div>
  );
}

/* ─────────────── Parçalar ─────────────── */

function SmallKPI({
  title,
  value,
  sub,
  rightIcon,
  tone = "blue",
}: {
  title: string;
  value: string;
  sub: string;
  rightIcon?: string;
  tone?: "blue" | "green" | "purple";
}) {
  const grad =
    tone === "green"
      ? "from-emerald-400/15 to-emerald-400/0"
      : tone === "purple"
      ? "from-fuchsia-400/15 to-fuchsia-400/0"
      : "from-sky-400/15 to-sky-400/0";
  return (
    <article className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${grad}`} />
      <div className="relative flex items-start justify-between">
        <div className="text-sm text-white/70">{title}</div>
        {rightIcon && (
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-white/10">
            {rightIcon}
          </div>
        )}
      </div>
      <div className="relative mt-2 text-3xl font-extrabold tracking-tight">{value}</div>
      <div className="relative text-xs text-white/60">{sub}</div>
    </article>
  );
}

function LegendDot({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <li className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="h-3 w-3 rounded-full" style={{ background: color }} />
        <span>{label}</span>
      </div>
      <span className="font-semibold text-white/80">{value}</span>
    </li>
  );
}

function Bars({
  items,
  max,
}: {
  items: { label: string; value: number }[];
  max: number;
}) {
  return (
    <div className="mt-2">
      <div className="h-[260px] grid grid-cols-4 items-end gap-6 px-3">
        {items.map((b) => {
          const h = Math.max(6, Math.round((b.value / max) * 220));
          return (
            <div key={b.label} className="flex flex-col items-center gap-2">
              <div
                className="w-12 rounded-md bg-[#e43a3a]"
                style={{ height: h }}
              />
              <div className="text-sm text-white/80">{b.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AreaTrend() {
  // Basit 6 noktalı alan grafiği (yaklaşık görüntü)
  const points = [
    [0, 180],
    [100, 150],
    [200, 130],
    [300, 110],
    [400, 90],
    [500, 70],
    [600, 50],
  ]; // y küçük -> daha yüksek değer görünümü
  const path = [
    `M ${points[0][0]},${points[0][1]}`,
    ...points.slice(1).map(([x, y]) => `L ${x},${y}`),
    "L 600,220 L 0,220 Z",
  ].join(" ");

  return (
    <div className="relative h-[260px] w-full rounded-xl border border-white/10 bg-white/[.04]">
      <svg viewBox="0 0 600 220" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="a" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ef3a3a" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#ef3a3a" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path d={path} fill="url(#a)" stroke="none" />
        <polyline
          points={points.map(([x, y]) => `${x},${y}`).join(" ")}
          fill="none"
          stroke="#ef3a3a"
          strokeWidth={3}
        />
      </svg>

      {/* alt eksen etiketleri */}
      <div className="absolute bottom-2 left-3 right-3 flex justify-between text-xs text-white/70">
        <span>Eki</span>
        <span>Kas</span>
        <span>Ara</span>
        <span>Oca</span>
        <span>Şub</span>
        <span>Mar</span>
      </div>
    </div>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs">
      {children}
    </span>
  );
}

function ProjectRow(props: {
  icon: string;
  title: string;
  desc: string;
  chips: string[];
  weekly: string;
  monthly: string;
  yearly: string;
  score: string;
  risk: "Yüksek" | "Orta" | "Düşük";
}) {
  const riskColor =
    props.risk === "Yüksek"
      ? "bg-red-500"
      : props.risk === "Orta"
      ? "bg-amber-400"
      : "bg-emerald-400";

  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        {/* sol */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 grid place-items-center rounded-xl bg-white/10 text-lg">
              {props.icon}
            </div>
            <div>
              <div className="text-[15px] font-semibold">{props.title}</div>
              <div className="text-sm text-white/70 -mt-0.5">{props.desc}</div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {props.chips.map((c) => (
              <Chip key={c}>{c}</Chip>
            ))}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3 text-sm">
            <StatBlock label="Haftalık" value={props.weekly} />
            <StatBlock label="Aylık" value={props.monthly} />
            <StatBlock label="Yıllık" value={props.yearly} />
          </div>

          {/* “etki seviyesi” çizgisi */}
          <div className="mt-3">
            <div className="text-xs text-white/60 mb-1">Etki Seviyesi</div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div className="h-2 w-[90%] bg-white/40" />
            </div>
          </div>
        </div>

        {/* sağ skor alanı */}
        <div className="shrink-0 w-full md:w-[220px]">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
            <div className="text-sm text-white/70">Skor</div>
            <div className="text-3xl font-extrabold tracking-tight">{props.score}</div>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs">
              <span className={`h-2 w-2 rounded-full ${props.risk === "Yüksek" ? "bg-red-400" : props.risk === "Orta" ? "bg-amber-300" : "bg-emerald-300"}`} />
              <span className="text-white/80">{props.risk}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function StatBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-center">
      <div className="text-xs text-white/70">{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}