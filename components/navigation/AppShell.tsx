"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { BottomTabBar } from "./BottomTabBar";
import { SideMenu } from "./SideMenu";

const publicRoutes = ["/", "/cadastro", "/recuperar-senha", "/verificacao"];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const hideNavigation = publicRoutes.includes(pathname) || pathname === "/anunciar" || pathname === "/registroproduto" || pathname.startsWith("/chat/") || pathname.startsWith("/maquina/");

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;
    const updateKeyboardState = () => setKeyboardOpen(window.innerHeight - viewport.height > 160);
    viewport.addEventListener("resize", updateKeyboardState);
    return () => viewport.removeEventListener("resize", updateKeyboardState);
  }, []);

  return <div className="klutch-page-shell min-h-full" onClickCapture={(event) => {
    if (pathname !== "/home" && (event.target as Element).closest('[aria-label="Abrir menu"]')) setMenuOpen(true);
    if ((event.target as Element).closest('[aria-label="Abrir notificações"], [aria-label="Notificações"]')) router.push("/Notificacoes");
  }}>
    {children}
    {!hideNavigation && !keyboardOpen && <BottomTabBar />}
    <SideMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
  </div>;
}
