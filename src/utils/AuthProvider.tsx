"use client";
import { RootLayoutProps } from "@/types/Base";
import { SessionProvider } from "next-auth/react";

export default function AuthProvider({ children }: RootLayoutProps) {
   return <SessionProvider>{children}</SessionProvider>;
}
