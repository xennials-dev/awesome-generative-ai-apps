"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();

  useEffect(() => {
    // Zero-friction mode: Auto-authenticated guest session is active
    router.replace("/");
  }, [router]);

  return (
    <div className="min-h-dvh flex items-center justify-center bg-bg-page text-primary-text">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-secondary-text">Redirecting to Studio...</p>
      </div>
    </div>
  );
}
