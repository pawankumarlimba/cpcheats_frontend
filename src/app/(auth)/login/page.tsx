"use client";

import { LoginForm } from "@/components/auth/login/login-form";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const getCookie = (name: string): string | null => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
        return null;
      };
      const adminToken = getCookie("token1");
      console.log("Admin Token:", adminToken);
      if (adminToken) {
        router.replace("/"); 
      }
    } catch (error) {
      console.error("Error accessing cookies:", error);
    }
  }, [router]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl lg:max-w-5xl pt-[80px]">
        <LoginForm />
      </div>
    </div>
  );
}
