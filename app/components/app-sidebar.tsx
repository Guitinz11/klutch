"use client";

import { LifeBuoy, LogOut, Settings, UserCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";

type AppSidebarProps = { open: boolean; onClose: () => void };

export function AppSidebar({ open, onClose }: AppSidebarProps) {
  const router = useRouter();
  if (!open) return null;
  const items = [{ label: "Perfil", icon: UserCircle, route: "/Perfil" }, { label: "Configurações", icon: Settings, route: "/Perfil" }, { label: "Suporte", icon: LifeBuoy, route: "/suporte" }];
  return <div className="fixed inset-0 z-50 bg-klutch-teal/40 backdrop-blur-[2px]"><button className="absolute inset-0 h-full w-full cursor-default" type="button" aria-label="Fechar menu" onClick={onClose} /><aside className="relative z-10 flex h-full w-[min(86vw,330px)] animate-[drawer-in_220ms_ease-out] flex-col rounded-r-[2rem] bg-background px-5 pb-7 pt-6 shadow-[8px_0_25px_rgba(44,44,42,0.16)]" aria-label="Menu lateral"><div className="flex items-center justify-between border-b border-klutch-line/70 pb-5"><div><p className="font-display text-xl font-bold text-klutch-teal">Klutch</p><p className="mt-1 text-xs text-klutch-muted">Sua conta</p></div><button className="flex h-9 w-9 items-center justify-center rounded-full text-klutch-muted transition hover:bg-klutch-teal-soft hover:text-klutch-teal" type="button" aria-label="Fechar menu" onClick={onClose}><X size={21} strokeWidth={2.2} /></button></div><nav className="mt-5 flex flex-col gap-1" aria-label="Navegação principal">{items.map(({ label, icon: Icon, route }) => <button className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-klutch-muted transition hover:bg-klutch-teal-soft hover:text-klutch-teal" key={label} type="button" onClick={() => { onClose(); router.push(route); }}><Icon size={20} strokeWidth={1.9} /><span>{label}</span></button>)}</nav><div className="mt-auto border-t border-klutch-line/70 pt-5"><button className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-[#b33b35] transition hover:bg-[#f8e5e2]" type="button" onClick={onClose}><LogOut size={20} strokeWidth={1.9} /><span>Sair da conta</span></button></div></aside></div>;
}
