import { db } from "@/db";
import { accountsTable } from "@/schemas/accounts";
import { usersTable } from "@/schemas/users";
import { verificationTokensTable } from "@/schemas/verificationTokens";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable,
    accountsTable,
    verificationTokensTable,
  }),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  // ✅ Use JWT strategy instead of DB sessions
  session: { strategy: "jwt" },
  jwt: {
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
  callbacks: {
    signIn: async ({ user }) => {
      const email = user.email;
      const whiteList = process.env.EMAIL_WHITELIST?.split("|") ?? [];
      if (!email || whiteList.length === 0) {
        return false;
      }
      return whiteList.includes(email);
    },
  },
});
