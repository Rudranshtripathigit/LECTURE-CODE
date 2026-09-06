import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";

// ----------------------------------------------------------------------
// Authentication for LectureCode Pro.
//
// Primary flow: plain email + password (Credentials provider below) —
// the simplest possible sign-up for a learning app, no external OAuth
// app registration required.
//
// GitHub/Google sign-in are additive and only activate automatically if
// you later add their client ID/secret to .env — nothing breaks if you
// never touch them.
// ----------------------------------------------------------------------

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    id: "credentials",
    name: "Email and Password",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = credentials?.email?.trim().toLowerCase();
      const password = credentials?.password;

      if (!email || !password) {
        throw new Error("Email and password are required.");
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.password) {
        throw new Error("No account found with that email.");
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new Error("Incorrect password.");
      }

      return { id: user.id, name: user.name, email: user.email, image: user.image };
    },
  }),
];

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    })
  );
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // Only fires for adapter-created users (i.e. OAuth sign-in) —
      // credentials sign-up creates its own Profile in the register route.
      await prisma.profile.upsert({
        where: { userId: user.id },
        create: { userId: user.id },
        update: {},
      });
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
