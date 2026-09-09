"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  ChevronDown,
  Heart,
  Home,
  LifeBuoy,
  List,
  LogOut,
  MapPin,
  Menu,
  Plus,
  Search,
  Settings,
  SlidersHorizontal,
  Tractor,
  Truck,
  UserCircle,
  Wheat,
  X,
} from "lucide-react";

type Machine = {
  id: string;
  name: string;
  category: string;
  oldPrice?: string;
  price: string;
  location: string;
  time: string;
  image: string;
};

const categories = [
  { label: "Tratores", symbol: Tractor, tone: "bg-[#3a9e94]" },
  { label: "Colheita", symbol: Wheat, tone: "bg-klutch-amber-soft" },
  { label: "Implementos", symbol: Tractor, tone: "bg-[#3a9e94]" },
  { label: "Transporte", symbol: Truck, tone: "bg-klutch-amber-soft" },
];

const machines: Machine[] = [
  {
    id: "mf65x",
    name: "Trator MF65X ano 1974",
    category: "Tratores",
    oldPrice: "R$ 42.000",
    price: "R$ 39.800",
    location: "José Bonifácio",
    time: "Ontem, 06:52",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Massey%20Ferguson%20tractor.jpg",
  },
  {
    id: "mf4292",
    name: "Trator Massey Ferguson Modelo 4292 4x4 Ano 2015",
    category: "Tratores",
    oldPrice: "R$ 230.000",
    price: "R$ 220.000",
    location: "Lins, Centro",
    time: "Ontem, 15:54",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Tractor%20Massey%20Ferguson.jpg",
  },
  {
    id: "bh180",
    name: "Trator BH 180 _ Vende, se ou troca por menor porte",
    category: "Tratores",
    price: "R$ 230.000",
    location: "Itatinga, Área Rural de Itatinga",
    time: "Hoje, 14:03",
    image:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Tractor%20in%20a%20field.jpg",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const viewport = window.visualViewport;
    if (!viewport) return;

    const updateKeyboardState = () => {
      setIsKeyboardOpen(window.innerHeight - viewport.height > 160);
    };

    viewport.addEventListener("resize", updateKeyboardState);
    updateKeyboardState();
    return () => viewport.removeEventListener("resize", updateKeyboardState);
  }, []);
  const filteredMachines = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return machines.filter((machine) => {
      const matchesCategory =
        activeCategory === "Todos" || machine.category === activeCategory;
      const matchesQuery =
        !normalizedQuery ||
        `${machine.name} ${machine.category}`
          .toLowerCase()
          .includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  return (
    <main className="min-h-screen bg-background pb-28">
      <div className="mx-auto w-full max-w-[390px] px-0 pt-0 sm:max-w-6xl sm:px-8 sm:pt-5 lg:px-10">
        <header className="rounded-b-[1.5rem] bg-[#e7e7e7] px-4 pb-4 pt-4 shadow-[0_8px_25px_rgba(44,44,42,0.07)] sm:rounded-[2rem] sm:px-7 sm:pb-5">
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="flex h-8 w-8 shrink-0 items-center justify-center text-black"
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Abrir menu"
            >
              <Menu className="block" size={24} strokeWidth={2.2} />
            </button>
            <div className="flex h-[52px] min-w-0 flex-1 items-center gap-2 rounded-full bg-[#d9d9d9] px-4 text-[#5d5d5d] sm:gap-3 sm:px-5">
              <Search
                aria-hidden="true"
                className="block shrink-0 text-[#bdbdbd]"
                size={21}
                strokeWidth={2.2}
              />
              <input
                className="min-w-0 flex-1 bg-transparent text-sm italic outline-none placeholder:text-[#5d5d5d] sm:text-base"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Pesquise por uma máquina"
                aria-label="Pesquisar máquinas"
              />
              <button
                className="shrink-0 text-black"
                type="button"
                aria-label="Filtrar máquinas"
              >
                <SlidersHorizontal
                  className="block"
                  size={21}
                  strokeWidth={2.2}
                />
              </button>
            </div>
            <button
              className="flex h-8 w-8 shrink-0 items-center justify-center text-black"
              type="button"
              aria-label="Notificações"
            >
              <Bell className="block" size={24} strokeWidth={2.2} />
            </button>
          </div>

          <button
            className="mt-3 flex items-center gap-2 px-2 text-xs text-[#5d5d5d]"
            type="button"
            aria-label="Selecionar localização"
          >
            <MapPin className="block" size={15} strokeWidth={2.2} />
            <span>Sao Paulo, SP</span>
            <ChevronDown className="ml-1 block" size={15} strokeWidth={2.2} />
          </button>
        </header>

        <section className="relative mx-4 mt-4 min-h-[126px] overflow-hidden rounded-[1.7rem] bg-[#087b61] px-4 py-5 text-klutch-teal-soft shadow-[0_10px_24px_rgba(4,52,44,0.14)] sm:mx-0 sm:flex sm:items-center sm:justify-between sm:px-7">
          <div className="relative z-[1]">
            <p className="text-sm italic">oferta da semana</p>
            <h2 className="mt-1 font-display text-base font-bold">
              20% off no 1º aluguel
            </h2>
            <p className="text-sm italic">válido para novos usuários</p>
          </div>
          <div className="absolute -right-8 -top-10 h-48 w-48 rounded-full bg-klutch-teal" />
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-3">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
            <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
          </div>
        </section>

        <section className="mt-7">
          <div className="mb-4 flex items-end justify-between px-4 sm:px-0">
            <h1 className="font-display text-xl font-bold tracking-[-0.04em] text-klutch-muted sm:text-3xl">
              Categoria
            </h1>
            <span className="hidden text-sm text-klutch-muted sm:block">
              Acesso compartilhado, simples
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2 px-4 sm:gap-3 sm:px-0">
            {categories.map((category) => {
              const CategoryIcon = category.symbol;
              return (
                <button
                  className="flex h-24 min-w-0 w-full flex-col items-center justify-center gap-2 text-center text-klutch-teal transition-transform hover:-translate-y-1"
                  key={category.label}
                  onClick={() => setActiveCategory(category.label)}
                  type="button"
                >
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[12px] ${category.tone}`}
                  >
                    <CategoryIcon
                      className="block"
                      size={23}
                      strokeWidth={2.1}
                    />
                  </span>
                  <span className="w-full truncate text-[10px] font-medium text-klutch-muted sm:text-xs">
                    {category.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-7 px-4 sm:px-0">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-normal tracking-[-0.03em] text-klutch-muted">
                Em destaque perto de você
              </h2>
            </div>
            <button
              className="text-sm font-bold text-klutch-teal-light"
              onClick={() => setActiveCategory("Todos")}
              type="button"
            >
              Ver todos
            </button>
          </div>
          <div className="space-y-0">
            {filteredMachines.length > 0 ? (
              filteredMachines.map((machine) => (
                <article
                  className="grid cursor-pointer grid-cols-[minmax(130px,42%)_1fr] gap-3 border-b border-[#c9cdd2] py-4 first:pt-0 sm:grid-cols-[300px_1fr] sm:gap-5"
                  key={machine.name}
                  onClick={() => router.push(`/maquina/${machine.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ")
                      router.push(`/maquina/${machine.id}`);
                  }}
                  role="link"
                  tabIndex={0}
                >
                  <div
                    className="relative h-[145px] overflow-hidden rounded-[0.7rem] bg-klutch-teal-soft bg-cover bg-center sm:h-[190px]"
                    style={{ backgroundImage: `url("${machine.image}")` }}
                  >
                    <button
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#59636f] shadow-sm"
                      type="button"
                      aria-label={`Favoritar ${machine.name}`}
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Heart size={16} />
                    </button>
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
                      <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                      <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                      <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
                    </div>
                  </div>
                  <div className="min-w-0 pt-1">
                    <h3 className="line-clamp-2 font-display text-base font-bold leading-5 text-[#101820] sm:text-lg">
                      {machine.name}
                    </h3>
                    <div className="mt-5 space-y-0.5">
                      <p className="text-xs text-[#77808b] line-through">
                        {machine.oldPrice}
                      </p>
                      <p className="font-display text-lg font-bold text-[#101820]">
                        {machine.price}
                      </p>
                    </div>
                    <p className="mt-5 flex items-start gap-1 text-[10px] leading-4 text-[#64748b] sm:text-xs">
                      <MapPin className="mt-0.5 shrink-0" size={14} />
                      {machine.location}{" "}
                      <span className="text-[#a2a8b0]">|</span> {machine.time}
                    </p>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[1.25rem] border border-dashed border-klutch-line px-5 py-10 text-center text-sm text-klutch-muted">
                Nenhuma maquina encontrada.
              </div>
            )}
          </div>
        </section>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-klutch-teal/40 backdrop-blur-[2px]">
          <button
            className="absolute inset-0 h-full w-full cursor-default"
            type="button"
            aria-label="Fechar menu"
            onClick={() => setIsMenuOpen(false)}
          />
          <aside
            className="relative z-10 flex h-full w-[min(86vw,330px)] animate-[drawer-in_220ms_ease-out] flex-col bg-background px-5 pb-7 pt-6 shadow-[8px_0_25px_rgba(44,44,42,0.16)]"
            aria-label="Menu lateral"
          >
            <div className="flex items-center justify-between border-b border-klutch-line/70 pb-5">
              <div>
                <p className="font-display text-xl font-bold text-klutch-teal">
                  Klutch
                </p>
                <p className="mt-1 text-xs text-klutch-muted">Sua conta</p>
              </div>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-full text-klutch-muted transition hover:bg-klutch-teal-soft hover:text-klutch-teal"
                type="button"
                aria-label="Fechar menu"
                onClick={() => setIsMenuOpen(false)}
              >
                <X size={21} strokeWidth={2.2} />
              </button>
            </div>

            <nav
              className="mt-5 flex flex-col gap-1"
              aria-label="Navegação principal"
            >
              {[
                { label: "Perfil", icon: UserCircle },
                { label: "Configurações", icon: Settings },
                { label: "Suporte", icon: LifeBuoy },
              ].map(({ label, icon: Icon }) => (
                <button
                  className="flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-klutch-muted transition hover:bg-klutch-teal-soft hover:text-klutch-teal"
                  key={label}
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Icon size={20} strokeWidth={1.9} />
                  <span>{label}</span>
                </button>
              ))}
            </nav>

            <div className="mt-auto border-t border-klutch-line/70 pt-5">
              <button
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold text-[#b33b35] transition hover:bg-[#f8e5e2]"
                type="button"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogOut size={20} strokeWidth={1.9} />
                <span>Sair da conta</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      <nav
        className={`fixed inset-x-0 bottom-0 z-10 mx-auto flex h-[78px] max-w-[390px] items-center justify-around rounded-t-[1.6rem] bg-klutch-amber-soft px-4 pb-1 pt-3 shadow-[0_-8px_25px_rgba(44,44,42,0.12)] sm:bottom-5 sm:h-[74px] sm:max-w-6xl sm:rounded-full sm:px-8 ${isKeyboardOpen || isMenuOpen ? "hidden" : ""}`}
      >
        <button
          className="flex min-w-12 flex-col items-center gap-1 text-[10px] font-bold text-klutch-amber-dark"
          type="button"
        >
          <Home size={19} fill="currentColor" strokeWidth={1.8} />
          <span>Inicio</span>
        </button>
        <button
          className="flex min-w-12 flex-col items-center gap-1 text-[10px] text-klutch-amber-dark/70"
          type="button"
        >
          <Search size={19} strokeWidth={1.8} />
          <span>Explore</span>
        </button>
        <button
          className="relative z-10 flex h-[62px] w-[62px] -translate-y-5 items-center justify-center rounded-full bg-klutch-amber shadow-[0_7px_15px_rgba(133,79,11,0.22)]"
          type="button"
          aria-label="Nova reserva"
        >
          <span className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-klutch-teal text-klutch-teal-soft">
            <Plus size={30} strokeWidth={1.6} />
          </span>
        </button>
        <button
          className="flex min-w-12 flex-col items-center gap-1 text-[10px] text-klutch-amber-dark/70"
          type="button"
        >
          <List size={19} strokeWidth={1.8} />
          <span>Conversas</span>
        </button>
        <button
          className="flex min-w-12 flex-col items-center gap-1 text-[10px] text-klutch-amber-dark/70"
          type="button"
        >
          <Heart size={19} strokeWidth={1.8} />
          <span>Favoritos</span>
        </button>
      </nav>
    </main>
  );
}
