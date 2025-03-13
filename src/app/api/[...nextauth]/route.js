import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "your@email.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials.email });

        if (!user) throw new Error("User not found");
        const isValidPassword = await bcrypt.compare(credentials.password, user.password);
        if (!isValidPassword) throw new Error("Invalid password");

        return { id: user._id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" }, // Custom login page
};

const handler = NextAuth(authOptions);
export { handler as POST };
