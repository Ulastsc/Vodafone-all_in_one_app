// next.config.ts
import type { NextConfig } from "next";

/**
 * Prod build sırasında ESLint hataları (ör. no-explicit-any) yüzünden
 * derlemenin fail olmasını engeller. Local’de uyarıları görmeye devam edersin.
 */
const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },

  // İSTEĞE BAĞLI: Tip hataları da prod’da bloklamasın istiyorsan aç.
  // (Hızlı yayın için kullanışlı; uzun vadede önerim kapalı tutup kodu düzeltmek.)
  // typescript: { ignoreBuildErrors: true },
};

export default nextConfig;