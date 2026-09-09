"use client";

import { CalendarDays, Compass, Heart, Home, Plus } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const formRoutes = new Set(["/anunciar", "/registroproduto", "/verificacao"]);

export function BottomNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const [isCovered, setIsCovered] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      const hasDialog = Boolean(document.querySelector('[role="dialog"], [role="alertdialog"]'));
      const viewport = window.visualViewport;
      const keyboardOpen = viewport ? window.innerHeight - viewport.height > 160 : false;
      setIsCovered(hasDialog || keyboardOpen);
    };
    const observer = new MutationObserver(updateVisibility);
    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["role"] });
    window.visualViewport?.addEventListener("resize", updateVisibility);
    updateVisibility();
    return () => { observer.disconnect(); window.visualViewport?.removeEventListener("resize", updateVisibility); };
  }, []);

  if (formRoutes.has(pathname) || isCovered) return null;
  const items = [{ label: "Início", icon: Home, route: "/home" }, { label: "Explorar", icon: Compass, route: "/home" }, { label: "Nova reserva", icon: Plus, route: "/anunciar", central: true }, { label: "Aluguéis", icon: CalendarDays, route: "/MeusAlugueis" }, { label: "Favoritos", icon: Heart, route: "/Perfil" }];
  return <nav aria-label="Navegação principal" className="fixed inset-x-0 bottom-0 z-20 mx-auto flex h-[78px] max-w-[390px] items-center justify-around rounded-t-[1.6rem] bg-klutch-amber-soft px-2 pb-1 pt-3 shadow-[0_-8px_25px_rgba(44,44,42,0.12)] sm:bottom-5 sm:h-[74px] sm:max-w-3xl sm:rounded-full sm:px-8">{items.map(({ label, icon: Icon, route, central }) => { const active = pathname === route; return central ? <button key={label} type="button" aria-label={label} onClick={() => router.push(route)} className="relative flex h-[62px] w-[62px] -translate-y-5 items-center justify-center rounded-full bg-klutch-amber text-klutch-teal shadow-[0_7px_15px_rgba(133,79,11,0.22)] transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-klutch-teal"><Icon size={29} /></button> : <button key={label} type="button" onClick={() => router.push(route)} className={`flex min-w-12 flex-col items-center gap-1 text-[10px] transition hover:text-klutch-amber-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-klutch-teal ${active ? "font-bold text-klutch-teal" : "text-klutch-amber-dark/75"}`}><Icon size={19} fill={active ? "currentColor" : "none"} /><span>{label}</span></button>; })}</nav>;
}
