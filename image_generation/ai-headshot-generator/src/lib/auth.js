import { prisma } from "./prisma";

export const DEFAULT_USER = {
  id: "dev-user",
  name: "Guest Creator",
  email: "guest@localhost",
  credits: 999999,
  image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
};

export const DEFAULT_SESSION = {
  user: DEFAULT_USER,
  expires: "2099-01-01T00:00:00.000Z"
};

export const authOptions = {
  providers: [],
  callbacks: {
    async session({ session }) {
      session.user = DEFAULT_USER;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "awesome_ai_apps_default_secret_key_12345",
  pages: {
    signIn: "/",
  },
};
