import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email:    { label: "Email",    type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const sql = neon(process.env.DATABASE_URL!);
        const rows = await sql`
          SELECT id, email, password_hash, name
          FROM users
          WHERE email = ${credentials.email as string}
        `;
        const user = rows[0];
        if (!user) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password_hash as string
        );
        if (!valid) return null;

        return {
          id:    user.id    as string,
          email: user.email as string,
          name:  user.name  as string,
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages:   { signIn: "/login" },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
  },
});
