import { db } from "@/db";
import { accountsTable } from "@/schemas/accounts";
import { usersTable } from "@/schemas/users";
import { verificationTokensTable } from "@/schemas/verificationTokens";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable,
    accountsTable,
    verificationTokensTable,
  }),
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.EMAIL_FROM,
    }),
  ],
  // ✅ Use JWT strategy instead of DB sessions
  session: { strategy: "jwt" },
  jwt: {
    maxAge: 60 * 60 * 24 * 30, // 30 days
  },
});
