"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  ChevronLeft,
  Heart,
  History,
  Search,
  Tractor,
  Truck,
  Wheat,
} from "lucide-react";

type FavoriteMachine = {
  id: string;
  name: string;
  category: string;
  location: string;
  distance: string;
  availability: string;
  price: string;
  rentalCount: number;
  tone: string;
  icon: typeof Tractor;
};

const categoryFilters = ["Todos", "Tratores", "Colheita", "Implementos", "Transporte"];

const initialFavorites: FavoriteMachine[] = [
  {
    id: "mf4292",
    name: "Trator Massey Ferguson 4292",
    category: "Tratores",
    location: "Lins, Centro",
    distance: "3 km de você",
    availability: "Disponível hoje",
    price: "R$ 220 / diária",
    rentalCount: 3,
    tone: "bg-[#3a9e94]",
    icon: Tractor,
  },
  {
    id: "colheitadeira-s770",
    name: "Colheitadeira S770",
    category: "Colheita",
    location: "Bauru, Zona Rural",
    distance: "12 km de você",
    availability: "Disponível amanhã",
    price: "R$ 480 / diária",
    rentalCount: 2,
    tone: "bg-klutch-amber-soft",
    icon: Wheat,
  },
  {
    id: "implemento-plantio",
    name: "Plantadeira 11 linhas",
    category: "Implementos",
    location: "Agudos, Centro",
    distance: "18 km de você",
    availability: "Disponível hoje",
    price: "R$ 160 / diária",
    rentalCount: 1,
    tone: "bg-[#3a9e94]",
    icon: Tractor,
  },
  {
    id: "caminhao-s10",
    name: "Caminhão S10 agrícola",
    category: "Transporte",
    location: "Marília, SP",
    distance: "24 km de você",
    availability: "Disponível em 2 dias",
    price: "R$ 250 / diária",
    rentalCount: 0,
    tone: "bg-klutch-amber-soft",
    icon: Truck,
  },
];

function MachineIcon({ machine, small = false }: { machine: FavoriteMachine; small?: boolean }) {
  const Icon = machine.icon;
  return (
    <span className={`flex shrink-0 items-center justify-center rounded-[0.85rem] text-klutch-teal ${machine.tone} ${small ? "h-16 w-16" : "h-24 w-24"}`}>
      <Icon size={small ? 28 : 38} strokeWidth={2.1} />
    </span>
  );
}

export default function FavoritesPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState(initialFavorites);
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [removingId, setRemovingId] = useState<string | null>(null);

  const filteredFavorites = useMemo(
    () => favorites.filter((machine) => activeCategory === "Todos" || machine.category === activeCategory),
    [activeCategory, favorites],
  );
  const frequentFavorites = filteredFavorites.filter((machine) => machine.rentalCount >= 2);

  function removeFavorite(id: string) {
    setRemovingId(id);
    window.setTimeout(() => {
      setFavorites((current) => current.filter((machine) => machine.id !== id));
      setRemovingId(null);
    }, 180);
  }

  return (
    <main className="min-h-screen bg-background pb-28 text-foreground">
      <div className="mx-auto w-full max-w-[390px] sm:max-w-3xl sm:px-6 sm:py-5">
        <header className="sticky top-0 z-20 flex items-center gap-3 rounded-b-[1.25rem] bg-white px-4 py-3 shadow-[0_8px_25px_rgba(44,44,42,0.07)] sm:rounded-[1.25rem]">
          <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-klutch-teal hover:bg-klutch-teal-soft focus:outline-none focus:ring-2 focus:ring-klutch-teal-accent" type="button" onClick={() => router.back()} aria-label="Voltar"><ChevronLeft size={23} /></button>
          <div className="min-w-0 flex-1"><h1 className="font-display text-xl font-bold tracking-[-0.04em] text-klutch-teal">Favoritos</h1><p className="mt-0.5 text-xs text-klutch-muted">Suas máquinas preferidas em um só lugar.</p></div>
          <button className="flex h-10 w-10 items-center justify-center rounded-full text-klutch-teal hover:bg-klutch-teal-soft focus:outline-none focus:ring-2 focus:ring-klutch-teal-accent" type="button" aria-label="Pesquisar favoritos"><Search size={20} /></button>
        </header>

        <div className="flex gap-2 overflow-x-auto px-4 py-4 sm:px-0" role="tablist" aria-label="Filtrar favoritos por categoria">
          {categoryFilters.map((category) => <button className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-klutch-teal-accent ${activeCategory === category ? "bg-klutch-teal text-white" : "bg-white text-klutch-muted hover:bg-klutch-teal-soft"}`} key={category} type="button" role="tab" aria-selected={activeCategory === category} onClick={() => setActiveCategory(category)}>{category}</button>)}
        </div>

        {frequentFavorites.length > 0 && (
          <section className="mt-2">
            <div className="mb-3 flex items-end justify-between px-4 sm:px-0"><div><h2 className="font-display text-xl font-bold text-klutch-foreground">Você aluga sempre</h2><p className="mt-1 text-xs text-klutch-muted">Máquinas que já fazem parte da sua rotina.</p></div><History className="text-klutch-teal-light" size={21} /></div>
            <div className="flex gap-3 overflow-x-auto px-4 pb-2 sm:px-0">
              {frequentFavorites.map((machine) => <article className="w-[188px] shrink-0 rounded-[1.15rem] bg-white p-3 shadow-[0_6px_20px_rgba(44,44,42,0.07)]" key={machine.id}><div className="flex items-start justify-between gap-2"><MachineIcon machine={machine} small /><span className="rounded-full bg-klutch-amber px-2 py-1 text-[9px] font-bold text-white">Alugado {machine.rentalCount}x</span></div><h3 className="mt-3 truncate font-display text-sm font-bold text-klutch-foreground">{machine.name}</h3><p className="mt-1 flex items-center gap-1 text-[10px] text-klutch-muted"><History size={12} />Uso recorrente</p><button className="mt-3 h-9 w-full rounded-full bg-klutch-amber text-xs font-bold text-klutch-amber-dark hover:bg-[#f6b64e] focus:outline-none focus:ring-2 focus:ring-klutch-amber-dark" type="button" onClick={() => router.push(`/alugar/${machine.id}`)}>Alugar novamente</button></article>)}
            </div>
          </section>
        )}

        <section className="mt-7 px-4 sm:px-0">
          <div className="mb-3 flex items-center justify-between"><h2 className="font-display text-xl font-bold text-klutch-foreground">Favoritados</h2><span className="text-xs text-klutch-muted">{filteredFavorites.length} {filteredFavorites.length === 1 ? "máquina" : "máquinas"}</span></div>
          {filteredFavorites.length > 0 ? <div className="space-y-3">{filteredFavorites.map((machine) => <article className={`relative flex items-center gap-3 rounded-[1.15rem] bg-white p-3 shadow-[0_6px_20px_rgba(44,44,42,0.07)] transition-all duration-200 ${removingId === machine.id ? "scale-95 opacity-0" : "scale-100 opacity-100"}`} key={machine.id}><MachineIcon machine={machine} /><div className="min-w-0 flex-1 self-stretch py-1"><h3 className="line-clamp-2 pr-7 font-display text-sm font-bold leading-5 text-klutch-foreground">{machine.name}</h3><p className="mt-2 text-[10px] text-klutch-muted">{machine.availability} · {machine.distance}</p><p className="mt-2 font-display text-sm font-bold text-klutch-teal">{machine.price}</p></div><button className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-klutch-teal transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-klutch-teal-accent" type="button" onClick={() => removeFavorite(machine.id)} aria-label={`Remover ${machine.name} dos favoritos`}><Heart size={19} fill="currentColor" /></button><button className="shrink-0 self-end rounded-full bg-klutch-amber px-3 py-2 text-[10px] font-bold text-klutch-amber-dark hover:bg-[#f6b64e] focus:outline-none focus:ring-2 focus:ring-klutch-amber-dark" type="button" onClick={() => router.push(`/alugar/${machine.id}`)}>Reservar</button></article>)}</div> : <div className="rounded-[1.35rem] border border-dashed border-klutch-teal/30 bg-white/50 px-5 py-12 text-center"><Heart className="mx-auto text-klutch-teal" size={46} strokeWidth={1.4} /><h2 className="mt-4 font-display text-lg font-bold text-klutch-foreground">Você ainda não tem máquinas favoritas.</h2><p className="mt-2 text-sm leading-5 text-klutch-muted">Toque no coração de um anúncio para salvá-lo aqui.</p><button className="mt-6 h-11 rounded-full border border-klutch-teal px-5 text-sm font-bold text-klutch-teal hover:bg-klutch-teal-soft focus:outline-none focus:ring-2 focus:ring-klutch-teal-accent" type="button" onClick={() => router.push("/home")}>Explorar máquinas</button></div>}
        </section>
      </div>

      <nav aria-label="Navegação principal" className="fixed inset-x-0 bottom-0 z-20 mx-auto flex h-[78px] max-w-[390px] items-center justify-around rounded-t-[1.6rem] bg-klutch-amber-soft px-4 pb-1 pt-3 shadow-[0_-8px_25px_rgba(44,44,42,0.12)] sm:bottom-5 sm:h-[74px] sm:max-w-3xl sm:rounded-full sm:px-8">
        <button className="flex min-w-12 flex-col items-center gap-1 text-[10px] text-klutch-amber-dark/70" type="button" onClick={() => router.push("/home")}><span aria-hidden="true">⌂</span><span>Início</span></button>
        <button className="flex min-w-12 flex-col items-center gap-1 text-[10px] text-klutch-amber-dark/70" type="button"><Search size={19} /><span>Explore</span></button>
        <button className="relative flex h-[62px] w-[62px] -translate-y-5 items-center justify-center rounded-full bg-klutch-amber shadow-[0_7px_15px_rgba(133,79,11,0.22)]" type="button" aria-label="Novo anúncio" onClick={() => router.push("/anunciar")}><span className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-klutch-teal text-klutch-teal-soft text-3xl">+</span></button>
        <button className="flex min-w-12 flex-col items-center gap-1 text-[10px] text-klutch-amber-dark/70" type="button"><CalendarClock size={19} /><span>Conversas</span></button>
        <button className="flex min-w-12 flex-col items-center gap-1 text-[10px] font-bold text-klutch-teal" type="button" aria-current="page"><Heart size={19} fill="currentColor" /><span>Favoritos</span></button>
      </nav>
    </main>
  );
}
