import NextAuth, { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const TEAMS = ["UAM","Audit and Change","Reporting"] as const;

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  team: z.enum(TEAMS),
});

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Vodafone Login",
      credentials: { email: {}, password: {}, team: {} },
      async authorize(creds) {
        const parsed = loginSchema.safeParse(creds);
        if (!parsed.success) throw new Error("Geçersiz form verisi.");

        const { email, password, team } = parsed.data;

        // PoC: sabit parola (SSO gelene kadar)
        if (password !== "Vodafone!123") throw new Error("E-posta/şifre hatalı.");

        const user = await prisma.user.findUnique({
          where: { email },
          include: { memberships: { include: { team: true } } },
        });
        if (!user) throw new Error("Kullanıcı bulunamadı.");

        const allowed = [
          "ahmet.koylu@vodafone.com",
          "kubra.aydin@vodafone.com",
          "ulas.tascioglu@vodafone.com",
        ];
        if (!allowed.includes(email)) throw new Error("OpEx dışı erişim yasak.");

        const hasTeam = user.memberships.some(m => m.team.name === team);
        if (!hasTeam) throw new Error("Bu takıma erişim yetkiniz yok.");

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: (user.role as "manager"|"user") ?? "user",
          team,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.team = (user as any).team;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as any;
        session.user.team = token.team as any;
      }
      return session;
    },
  },
  pages: { signIn: "/login" },
};
