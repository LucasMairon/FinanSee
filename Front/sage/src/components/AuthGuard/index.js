"use client";

import { useEffect } from "react";

// Libs
import { useRouter } from "next/navigation";

// Context
import { useAuth } from "@/hooks/context";

// Components
import LoadingView from "@/components/loadingView";

export default function AuthGuard({ children }) {
  const { user, userData, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, userData, loading, router]);

  if (loading || !userData) {
    return <LoadingView />;
  }

  return <>{children}</>;
}
