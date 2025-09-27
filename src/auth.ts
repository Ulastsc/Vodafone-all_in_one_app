import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const TEAMS = ["UAM", "Audit and Change", "Reporting"] as const;
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  team: z.enum(TEAMS),
});

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    error: "/login",    // hata yine /login’de görünsün
  },
  debug: process.env.NODE_ENV === "development",
  providers: [
    Credentials({
      name: "Vodafone Login",
      credentials: { email: {}, password: {}, team: {} },
      async authorize(creds) {
        // 1) Form doğrulama
        const parsed = loginSchema.safeParse(creds);
        if (!parsed.success) {
          console.error("AUTHZ Zod error:", parsed.error.flatten());
          return null;
        }
        const { email, password, team } = parsed.data;

        // 2) PoC parola kontrolü (SSO gelene kadar)
        if (password !== "Vodafone!123") {
          console.warn("AUTHZ wrong password", email);
          return null; // CredentialsSignin hatası üretir
        }

        // 3) Kullanıcıyı bul
        const user = await prisma.user.findUnique({
          where: { email },
          include: { memberships: { include: { team: true } } },
        });
        if (!user) {
          console.warn("AUTHZ user not found", email);
          return null;
        }

        // 4) Whitelist
        const allowed = [
          "ahmet.koylu@vodafone.com",
          "kubra.aydin@vodafone.com",
          "ulas.tascioglu@vodafone.com",
        ];
        if (!allowed.includes(email)) {
          console.warn("AUTHZ not in allowed list", email);
          return null;
        }

        // 5) Team membership
        const hasTeam = user.memberships.some((m) => m.team.name === team);
        if (!hasTeam) {
          console.warn("AUTHZ no team membership", { email, team });
          return null;
        }

        // 6) Başarılı
        return {
          id: String(user.id),
          name: user.name ?? email.split("@")[0],
          email: user.email,
          role: (user.role as "manager" | "user") ?? "user",
          team,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.team = user.team;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = (token.role ?? "user") as "manager" | "user";
        session.user.team = (token.team ?? "UAM") as
          | "UAM"
          | "Audit and Change"
          | "Reporting";
      }
      return session;
    },
  },
};