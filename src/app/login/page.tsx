"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

/** Sol karttaki madde listeleri */
const FEATURES = [
  {
    title: "Agent Builder",
    desc: "Drag & drop AI agent create",
  },
  {
    title: "Team Management",
    desc: "Sprint-based collaboration",
  },
  {
    title: "Real-time Analytics",
    desc: "Performance tracking & insights",
  },
  {
    title: "Enterprise Security",
    desc: "Vodafone-grade security standards",
  },
];

const TEAMS = [
  { key: "UAM", label: "UAM", name: "UAM" },
  { key: "AUDIT_CHANGE", label: "Audit and Change", name: "Audit and Change" },
  { key: "REPORTING", label: "Reporting", name: "Reporting" }
] as const;

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [teamKey, setTeamKey] =
    useState<(typeof TEAMS)[number]["key"]>("REPORTING");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setLoading(true);

    const teamName = TEAMS.find(t => t.key === teamKey)!.name;

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      team: teamName, // backend name ile kontrol ediyor
    });

    setLoading(false);
    if (res?.error) setErr(res.error);
    else window.location.href = "/dashboard";
  }

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(1200px_500px_at_10%_-10%,#ffeaea,transparent),radial-gradient(1200px_500px_at_90%_-10%,#fff2f2,transparent)]">
      <div className="mx-auto w-full max-w-[1160px] px-6 py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          {/* SOL TANITIM KARTI */}
          <section className="rounded-[14px] border border-white/70 bg-white/70 p-8 shadow-[0_30px_70px_rgba(0,0,0,.06)] backdrop-blur">
            {/* Üst rozet + başlık */}
            <div className="mb-4 flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-[12px] bg-red-600 text-white">
                {/* bag/agent icon yerine sade rozet */}
                <span className="text-[18px] font-semibold">◎</span>
              </div>
              <div>
                <div className="text-[15px] font-semibold">Agent Builder</div>
                <div className="text-[12px] text-gray-500">
                  Vodafone Internal Platform
                </div>
              </div>
            </div>

            {/* Büyük başlık */}
            <h2 className="text-[28px] font-extrabold leading-[1.15] tracking-[-0.02em] text-gray-800">
              AI-Powered Agent Development Platform
            </h2>
            <p className="mt-2 text-[13.5px] leading-6 text-gray-600">
              Vodafone ekipleri için tasarlanmış gelişmiş agent geliştirme ve
              yönetim platformu. Sprint bazlı çalışma, team collaboration ve
              comprehensive analytics.
            </p>

            {/* 2x2 özellik kutuları */}
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {FEATURES.map((f, i) => (
                <div
                  key={f.title}
                  className={[
                    "flex items-start gap-3 rounded-[12px] border bg-white p-3 shadow-[0_8px_24px_rgba(0,0,0,.04)]",
                    // soldaki görselde 1 ve 3 aktif, 2 ve 4 daha soluk görünüm
                    i % 2 === 1 ? "border-gray-100 opacity-60" : "border-gray-100",
                  ].join(" ")}
                >
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-red-50 text-[15px]">
                    <span>▣</span>
                  </div>
                  <div>
                    <div className="text-[13.5px] font-medium">{f.title}</div>
                    <div className="text-[12px] text-gray-500">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Available Teams kutusu */}
            <div className="mt-6 rounded-[12px] border border-gray-100 bg-white p-4">
              <div className="mb-2 text-[13px] font-medium">Available Teams</div>
              <div className="flex flex-wrap gap-2">
                <Badge>Customer Service</Badge>
                <Badge>Sales</Badge>
                <Badge>Technical Support</Badge>
                <Badge>Business Solutions</Badge>
                <Badge variant="danger">Ops</Badge>
              </div>

              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12px] text-red-700">
                <b>OpEx Teams:</b> Administrative access with system-wide monitoring
              </div>
            </div>
          </section>

          {/* SAĞ LOGIN KARTI */}
          <section className="rounded-[14px] border border-white bg-white p-8 shadow-[0_30px_70px_rgba(0,0,0,.08)]">
            {/* Vodafone rozet */}
            <div className="mx-auto mb-6 grid place-items-center">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-red-600 text-[16px] font-bold text-white">
                v
              </div>
            </div>

            <h3 className="text-center text-[22px] font-extrabold text-gray-800">
              Vodafone Login
            </h3>
            <p className="mt-1 text-center text-[13px] text-gray-500">
              Vodafone uygulamaları için güvenli giriş
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-[13px] font-medium">
                  Vodafone E-posta
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ad soyad@vodafone.com"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-[14px] outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-[13px] font-medium">Şifre</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-[14px] outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-[13px] font-medium">
                  Takım Seçin
                </label>
                <select
                  value={teamKey}
                  onChange={(e) =>
                    setTeamKey(e.target.value as (typeof TEAMS)[number]["key"])
                  }
                  className="w-full appearance-none rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-[14px] outline-none focus:ring-2 focus:ring-red-500"
                >
                  {TEAMS.map((t) => (
                    <option key={t.key} value={t.key}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              {err && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[12.5px] text-red-700">
                  {err}
                </div>
              )}

              <button
                disabled={loading}
                className="w-full rounded-lg bg-red-600 py-2.5 text-[14.5px] font-medium text-white shadow-[0_10px_28px_rgba(220,38,38,.35)] transition hover:bg-red-700 disabled:opacity-60"
              >
                {loading ? "Giriş yapılıyor…" : "Güvenli Giriş"}
              </button>

              <p className="text-center text-[11.5px] text-gray-500">
                Bu platform sadece Vodafone geliştirme takımlarınadır.
                Giriş sonrası yetkilere göre özelliklere erişim sağlanır.
              </p>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}

/* Küçük rozet bileşeni (soldaki “Available Teams” için) */
function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "danger";
}) {
  const isDanger = variant === "danger";
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-[12px]",
        isDanger
          ? "border-red-200 bg-red-50 text-red-700"
          : "border-gray-200 bg-white text-gray-700",
      ].join(" ")}
    >
      {children}
    </span>
  );
}
