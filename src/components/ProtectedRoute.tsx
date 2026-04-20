"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Props = {
  children: React.ReactNode;
  allowedRoles: string[];
};

import ChatWidget from "./ChatWidget";

export default function ProtectedRoute({ children, allowedRoles }: Props) {
  const router = useRouter();
  const { user, token, isLoading } = useAuth();

  const rolesRef = React.useRef(allowedRoles);
  useEffect(() => {
    rolesRef.current = allowedRoles;
  }, [allowedRoles]);

  useEffect(() => {
    if (isLoading) return;

    if (!token) {
      router.replace("/login");
      return;
    }

    if (user && !rolesRef.current.includes(user.role)) {
      router.replace("/login");
    }
  }, [token, user, isLoading, router]);

  if (isLoading || !token || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      {children}
      <ChatWidget />
    </>
  );
}