"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Home, MessageCircle, PlusCircle, User } from "lucide-react";

const items = [
  { href: "/home", label: "Início", icon: Home },
  { href: "/MeusAlugueis", label: "Meus aluguéis", icon: CalendarDays },
  { href: "/anunciar", label: "Anunciar", icon: PlusCircle, featured: true },
  { href: "/chat", label: "Mensagens", icon: MessageCircle },
  { href: "/Perfil", label: "Perfil", icon: User },
];

function isActive(pathname: string, href: string) {
  return href === "/home" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export function BottomTabBar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegação principal Klutch" className="fixed inset-x-0 bottom-0 z-50 mx-auto flex h-[76px] max-w-xl items-center justify-around border-t border-gray-100 bg-gray-50/95 px-2 pb-[max(0.25rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_24px_rgba(44,44,42,0.10)] backdrop-blur sm:bottom-4 sm:rounded-full sm:border">
      {items.map(({ href, label, icon: Icon, featured }) => {
        const active = isActive(pathname, href);
        if (featured) {
          return (
            <Link key={href} href={href} aria-label={label} aria-current={active ? "page" : undefined} className="-translate-y-5 rounded-full border-4 border-gray-50 bg-amber-200 p-3 text-teal-900 shadow-lg transition-transform hover:-translate-y-6 focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2">
              <Icon aria-hidden="true" size={27} strokeWidth={2.2} />
            </Link>
          );
        }
        return (
          <Link key={href} href={href} aria-label={label} aria-current={active ? "page" : undefined} className={`flex min-w-12 flex-col items-center gap-1 rounded-lg px-1 py-1 text-[10px] font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 ${active ? "text-teal-600" : "text-gray-600 hover:text-teal-600"}`}>
            <Icon aria-hidden="true" size={19} strokeWidth={1.9} />
            <span>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
