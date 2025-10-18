"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const VODARED = "#E60000";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("ulas.tascioglu@vodafone.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    // Artık takım seçimi yok; backend email’e göre tenant/role çıkarıyor.
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);
    if (res?.ok) {
      router.push("/dashboard");
    } else {
      setMsg("E-posta veya şifre hatalı.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#23171d] via-[#2c1e25] to-[#1e2027] relative overflow-hidden">
      {/* arka parlama */}
      <div
        className="absolute -top-40 -left-40 w-[640px] h-[640px] rounded-full blur-3xl opacity-40"
        style={{ background: "radial-gradient(closest-side, #ff4d4d, transparent)" }}
      />
      <div
        className="absolute -bottom-56 right-[-120px] w-[720px] h-[720px] rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(closest-side, #a66bff, transparent)" }}
      />

      <div className="relative mx-auto max-w-[1200px] px-6 py-10 text-white">
        {/* HEADER */}
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-[rgba(255,0,0,.14)] grid place-items-center shadow-[0_0_60px_rgba(230,0,0,.25)]">
            <Image
              src="/vodafone.svg"
              alt="Vodafone Logo"
              width={38}
              height={38}
              className="drop-shadow-[0_0_10px_rgba(230,0,0,.4)]"
              priority
            />
          </div>
          <div>
            <div className="text-[34px] font-bold leading-tight tracking-tight">
              VODAFONE ALL IN ONE APP
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
            <div className="text-[40px] font-bold leading-tight">AI-Powered Platform</div>
            <div className="text-[28px] font-extrabold mt-1" style={{ color: VODARED }}>
              Developed by OpEx
            </div>

            <p className="mt-4 text-white/80 max-w-[640px]">
              Vodafone ekipleri için tasarlanmıştır.
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

            {/* Demo credentials */}
            <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between">
                <div className="font-semibold">Demo Kullanıcı Bilgileri</div>
                <div className="text-white/60 text-sm">⏺</div>
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
                  <div>
                    <span className="font-medium">Şifre:</span>{" "}
                    Tüm test hesapları için → <b>Vodafone!123</b>
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
                <div
                  className="h-16 w-16 rounded-2xl grid place-items-center"
                  style={{ background: "linear-gradient(180deg,#ff2d2d,#9b0000)" }}
                >
                  <span className="text-2xl">🛡️</span>
                </div>
              </div>
              <div className="text-center mt-4">
                <div className="text-[26px] font-bold">Giriş</div>
                <div className="text-sm text-white/70">Vodafone All In One App Platform</div>
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

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full mt-2 rounded-xl py-3 font-medium shadow-[0_10px_40px_rgba(230,0,0,.35)] disabled:opacity-60"
                  style={{ background: "linear-gradient(90deg,#e60000,#bb0000)" }}
                >
                  {loading ? "Giriş yapılıyor…" : "Güvenli Giriş"}
                </button>

                {msg && <div className="text-sm text-red-300 mt-2">{msg}</div>}
              </form>

              <div className="mt-6 text-[12px] text-white/60 text-center">
                Bu platform sadece Vodafone çalışanları tarafından kullanılabilir.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* —— küçük parçalar ———————————————————————————— */

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 hover:bg-white/[.07] transition">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 grid place-items-center rounded-xl bg-white/10">
          {icon}
        </div>
        <div className="font-semibold">{title}</div>
      </div>
      <div className="text-sm text-white/70 mt-1">{desc}</div>
    </div>
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