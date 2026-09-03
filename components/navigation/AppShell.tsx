"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { BottomTabBar } from "./BottomTabBar";

const publicRoutes = ["/", "/cadastro", "/recuperar-senha", "/verificacao"];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
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
  }}>
    {children}
    {!hideNavigation && !keyboardOpen && <BottomTabBar />}
    {menuOpen && <div className="fixed inset-0 z-[70] bg-klutch-teal/40 backdrop-blur-sm">
      <button type="button" aria-label="Fechar menu" className="absolute inset-0" onClick={() => setMenuOpen(false)} />
      <aside aria-label="Menu lateral" className="relative flex h-full w-[min(86vw,330px)] flex-col bg-background p-5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-klutch-line pb-5"><div><p className="font-display text-xl font-bold text-klutch-teal">Klutch</p><p className="text-xs text-klutch-muted">Sua conta</p></div><button type="button" aria-label="Fechar menu" onClick={() => setMenuOpen(false)} className="rounded-full p-2 text-klutch-teal hover:bg-klutch-teal-soft"><X size={20} /></button></div>
        <nav className="mt-5 grid gap-2">{[["Perfil", "/Perfil"], ["Meus anúncios", "/MeusAnuncios"], ["Meus aluguéis", "/MeusAlugueis"], ["Suporte", "/suporte"]].map(([label, href]) => <Link key={href} href={href} onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 text-sm font-semibold text-klutch-teal hover:bg-klutch-teal-soft">{label}</Link>)}</nav>
      </aside>
    </div>}
  </div>;
}
