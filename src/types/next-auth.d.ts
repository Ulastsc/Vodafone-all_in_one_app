import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

type Team = "UAM" | "Audit and Change" | "Reporting";
type Role = "manager" | "user";

declare module "next-auth" {
  interface User extends DefaultUser {
    role: Role;
    team: Team;
  }

  interface Session extends DefaultSession {
    user: DefaultSession["user"] & {
      role: Role;
      team: Team;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
    team?: Team;
  }
}