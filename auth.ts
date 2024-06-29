import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  adapter: PrismaAdapter(new PrismaClient()),
  session: {
    strategy: "jwt",
  },
});