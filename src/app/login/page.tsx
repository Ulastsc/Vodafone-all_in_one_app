"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const VODARED = "#E60000";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("ulas.tascioglu@vodafone.com");
  const [password, setPassword] = useState("");
  const [team, setTeam] = useState("Ekip 2");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    // login provider tarafında team değerleri UAM / Audit and Change / Reporting.
    // Bu dropdown UI’de ekip adı geçsin diye map yapıyoruz:
    const teamMap: Record<string, "UAM" | "Audit and Change" | "Reporting"> = {
      "Ekip 2": "Reporting",
      "Ekip 3": "Audit and Change",
      "Ekip 4": "UAM",
    };

    const res = await signIn("credentials", {
      email,
      password,
      team: teamMap[team] ?? "Reporting",
      redirect: false,
    });

    setLoading(false);
    if (res?.ok) {
      router.push("/dashboard");
    } else {
      setMsg("E-posta / şifre ya da takım hatalı.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#23171d] via-[#2c1e25] to-[#1e2027] relative overflow-hidden">
      {/* arka parlama */}
      <div className="absolute -top-40 -left-40 w-[640px] h-[640px] rounded-full blur-3xl opacity-40"
           style={{ background: "radial-gradient(closest-side, #ff4d4d, transparent)" }} />
      <div className="absolute -bottom-56 right-[-120px] w-[720px] h-[720px] rounded-full blur-3xl opacity-30"
           style={{ background: "radial-gradient(closest-side, #a66bff, transparent)" }} />

      <div className="relative mx-auto max-w-[1200px] px-6 py-10 text-white">
        {/* HEADER */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-[rgba(255,0,0,.14)] grid place-items-center shadow-[0_0_60px_rgba(230,0,0,.25)]">
            <span className="text-2xl">🧰</span>
          </div>
          <div>
            <div className="text-[34px] font-bold leading-tight tracking-tight">
              Agent Builder
            </div>
            <div className="text-[12px] mt-0.5">
              <span className="px-2 py-0.5 rounded-md bg-white/10">Vodafone</span>
              <span className="ml-2 text-white/70">INTERNAL PLATFORM</span>
            </div>
          </div>
        </div>

        {/* HEADLINE */}
        <div className="mt-10 grid lg:grid-cols-2 gap-10 items-start">
          {/* Left panel */}
          <div>
            <div className="text-[40px] font-bold leading-tight">
              AI-Powered Agent Development
            </div>
            <div className="text-[28px] font-extrabold mt-1"
                 style={{ color: VODARED }}>
              Enterprise Platform
            </div>

            <p className="mt-4 text-white/80 max-w-[640px]">
              Vodafone ekipleri için tasarlanmış gelişmiş agent geliştirme ve yönetim platformu.
              Sprint bazlı çalışma, team collaboration ve comprehensive analytics.
            </p>

            {/* Feature cards */}
            <div className="mt-8 grid sm:grid-cols-2 gap-5">
              <FeatureCard
                icon="🤖"
                title="Intelligent Agent Builder"
                desc="Next-gen drag & drop AI creation"
              />
              <FeatureCard
                icon="👥"
                title="Advanced Team Management"
                desc="Sprint-based collaboration system"
              />
              <FeatureCard
                icon="📊"
                title="Real-time Analytics"
                desc="Performance insights & predictions"
              />
              <FeatureCard
                icon="🛡️"
                title="Enterprise Security"
                desc="Vodafone-grade protection"
              />
            </div>

            {/* Available Teams + Test credentials */}
            <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Available Teams</div>
                <div className="text-white/60 text-sm">⏺</div>
              </div>
              <div className="mt-3 flex flex-wrap gap-3">
                <TeamChip label="OpEx" active />
                <TeamChip label="Ekip 2" />
                <TeamChip label="Ekip 3" />
                <TeamChip label="Ekip 4" />
              </div>

              <div className="mt-5 rounded-xl bg-blue-400/10 border border-blue-300/20 p-4 text-[13px]">
                <div className="font-medium">🔐 Test Login Credentials</div>
                <div className="mt-2 space-y-1 text-white/80">
                  <div>
                    <span className="font-medium">Manager:</span>{" "}
                    ahmet.koylu@vodafone.com → Her zaman <b>Manager Dashboard</b>
                  </div>
                  <div>
                    <span className="font-medium">Team Member:</span>{" "}
                    ulas.tascioglu@vodafone.com → <b>Team Dashboard</b>
                  </div>
                  <div>
                    <span className="font-medium">Admin:</span>{" "}
                    Diğer kullanıcılar + OpEx team → <b>Admin Dashboard</b>
                  </div>
                </div>
              </div>

              <div className="mt-4 rounded-xl bg-red-400/10 border border-red-300/20 p-3 text-[13px] text-red-200">
                <b>OpEx Team:</b> Ahmet Koylu → Manager, diğerleri → Admin
              </div>
            </div>
          </div>

          {/* Right panel – Secure Access */}
          <div className="lg:sticky lg:top-10">
            <div className="rounded-[24px] border border-white/10 bg-white/5 backdrop-blur p-6 shadow-2xl">
              <div className="mx-auto grid place-items-center">
                <div className="h-16 w-16 rounded-2xl grid place-items-center"
                     style={{ background: "linear-gradient(180deg,#ff2d2d,#9b0000)" }}>
                  <span className="text-2xl">🛡️</span>
                </div>
              </div>
              <div className="text-center mt-4">
                <div className="text-[26px] font-bold">Secure Access</div>
                <div className="text-sm text-white/70">
                  Vodafone Enterprise Platform
                </div>
              </div>

              <form onSubmit={onSubmit} className="mt-6 space-y-3">
                <Field
                  label="Vodafone E-posta"
                  value={email}
                  onChange={setEmail}
                  placeholder="ad.soyad@vodafone.com"
                />
                <Field
                  label="Şifre"
                  type="password"
                  value={password}
                  onChange={setPassword}
                  placeholder="••••••••"
                />
                <div>
                  <div className="text-xs text-white/60 mb-1.5">Takım Seçin</div>
                  <select
                    value={team}
                    onChange={(e) => setTeam(e.target.value)}
                    className="w-full rounded-xl bg-white/10 border border-white/10 px-3 py-2.5 outline-none focus:border-white/30"
                  >
                    <option>Ekip 2</option>
                    <option>Ekip 3</option>
                    <option>Ekip 4</option>
                  </select>
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full mt-2 rounded-xl py-3 font-medium shadow-[0_10px_40px_rgba(230,0,0,.35)] disabled:opacity-60"
                  style={{ background: "linear-gradient(90deg,#e60000,#bb0000)" }}
                >
                  {loading ? "Giriş yapılıyor…" : "Güvenli Giriş"}
                </button>

                {msg && (
                  <div className="text-sm text-red-300 mt-2">{msg}</div>
                )}
              </form>

              <div className="mt-6 text-[12px] text-white/60 text-center">
                Bu platform sadece Vodafone çalışanları tarafından kullanılabilir.
                Giriş yapmakla Vodafone güvenlik politikalarını kabul etmiş olursunuz.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* —— küçük parçalar ———————————————————————————— */

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string; }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/[.07] transition">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 grid place-items-center rounded-xl bg-white/10">{icon}</div>
        <div className="font-semibold">{title}</div>
      </div>
      <div className="text-sm text-white/70 mt-1">{desc}</div>
    </div>
  );
}

function TeamChip({ label, active }: { label: string; active?: boolean }) {
  return (
    <span className={`px-3 py-1.5 rounded-xl text-sm border ${active ? "bg-red-500/15 border-red-500/40 text-red-200" : "bg-white/5 border-white/10 text-white/80"}`}>
      {label}
    </span>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <div className="text-xs text-white/60 mb-1.5">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl bg-white/10 border border-white/10 px-3 py-2.5 outline-none focus:border-white/30"
      />
    </div>
  );
}