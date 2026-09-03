"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { BottomTabBar } from "./BottomTabBar";

const publicRoutes = ["/", "/cadastro", "/recuperar-senha", "/verificacao"];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const showNavigation = !publicRoutes.includes(pathname);

  return <div className="klutch-page-shell min-h-full">{children}{showNavigation && <BottomTabBar />}</div>;
}
