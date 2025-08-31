import "./globals.css";
import Providers from "./providers";

export const metadata = { title: "Agent Builder", description: "Vodafone" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
