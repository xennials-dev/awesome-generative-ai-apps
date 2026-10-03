"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";
import config from "@/lib/config";

const DEFAULT_SESSION = {
  user: {
    id: "dev-user",
    name: "Guest Creator",
    email: "guest@localhost",
    credits: 999999,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
  },
  expires: "2099-01-01T00:00:00.000Z"
};

export function Providers({ children }) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const theme = config?.theme || "slate-indigo";
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, []);

  return (
    <SessionProvider session={DEFAULT_SESSION}>
      {children}
    </SessionProvider>
  );
}
