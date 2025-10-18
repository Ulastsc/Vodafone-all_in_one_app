// src/app/api/auth/[...nextauth]/route.ts

import NextAuth, { type NextAuthOptions, type User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

type AppRole = "manager" | "user";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const ALLOWED_EMAILS = new Set([
  "ahmet.koylu@vodafone.com",
  "kubra.aydin@vodafone.com",
  "ulas.tascioglu@vodafone.com",
]);

const DEFAULT_TEST_PASSWORD = "Vodafone!123";

function defaultRoleFor(email: string): AppRole {
  return email.toLowerCase() === "ahmet.koylu@vodafone.com" ? "manager" : "user";
}

function nameFromEmail(email: string) {
  return (email.split("@")[0] ?? "").replace(/\./g, " ");
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Vodafone Login",
      credentials: { email: {}, password: {} },
      async authorize(creds): Promise<User | null> {
        // 1) form
        const parsed = loginSchema.safeParse(creds);
        if (!parsed.success) throw new Error("Geçersiz form verisi.");

        const email = parsed.data.email.trim().toLowerCase();
        const password = parsed.data.password.trim();

        // 2) parola
        const EXPECTED = process.env.TEST_PASSWORD ?? DEFAULT_TEST_PASSWORD;
        if (password !== EXPECTED) throw new Error("E-posta/şifre hatalı.");

        // 3) izinli email
        if (!ALLOWED_EMAILS.has(email)) throw new Error("Erişim izni yok.");

        // 4) kullanıcıyı getir
        let user = await prisma.user.findUnique({
          where: { email },
          select: { id: true, email: true, name: true, role: true },
        });

        // 4.a yoksa organization’ı hazırla (upsert)
        if (!user) {
          const org = await prisma.organization.upsert({
            where: { slug: "vodafone" },            // <- şemanıza göre unique alan
            update: {},
            create: { name: "Vodafone", slug: "vodafone" },
            select: { id: true },
          });

          user = await prisma.user.create({
            data: {
              email,
              name: nameFromEmail(email),
              role: defaultRoleFor(email),
              organization: { connect: { id: org.id } }, // <<< ZORUNLU İLİŞKİ
            },
            select: { id: true, email: true, name: true, role: true },
          });
        }

        return {
          id: String(user.id),
          email: user.email,
          name: user.name ?? nameFromEmail(user.email),
          image: null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      const email = (user?.email ?? token.email ?? "").toString().toLowerCase();
      if (email) token.role = defaultRoleFor(email);
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.role = (token.role as AppRole) ?? "user";
      return session;
    },
  },
  pages: { signIn: "/login" },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };