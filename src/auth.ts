import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

import { prisma } from "@/libs/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const { handlers, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [Google],

  session: {
    strategy: "database",
  },

  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      session.user.role = user.role ?? "CUSTOMER";
      return session;
    },
  },
});
