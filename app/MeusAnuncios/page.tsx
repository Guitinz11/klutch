"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarRange,
  Check,
  Clock3,
  Edit3,
  Ellipsis,
  Eye,
  Gauge,
  MapPin,
  PauseCircle,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

type AdStatus = "available" | "reserved" | "in_use" | "paused";
type SortOption =
  | "newest"
  | "oldest"
  | "nameAsc"
  | "nameDesc"
  | "priceHigh"
  | "priceLow";

interface MachineryAd {
  id: string;
  title: string;
  category: string;
  brand: string;
  model: string;
  image?: string;
  location: string;
  pricePerHour: number;
  status: AdStatus;
  power?: number;
  year?: number;
  hourMeter?: number;
  updatedAt: string;
}

const mockAds: MachineryAd[] = [
  {
    id: "ad-1",
    title: "Trator John Deere 5075E",
    category: "Trator",
    brand: "John Deere",
    model: "5075E",
    location: "Cooperativa / propriedade cadastrada",
    pricePerHour: 180,
    status: "available",
    power: 75,
    year: 2022,
    hourMeter: 1245,
    updatedAt: "2026-08-27T09:30:00-03:00",
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "ad-2",
    title: "Colheitadeira Case Axial-Flow 2388",
    category: "Colheitadeira",
    brand: "Case",
    model: "Axial-Flow 2388",
    location: "Fazenda Santa Lúcia",
    pricePerHour: 860,
    status: "reserved",
    power: 350,
    year: 2021,
    hourMeter: 2650,
    updatedAt: "2026-08-25T13:15:00-03:00",
    image:
      "https://images.unsplash.com/photo-1581092160607-ee2279d2c3f5?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "ad-3",
    title: "Pulverizador Jacto 2000",
    category: "Pulverizador",
    brand: "Jacto",
    model: "2000",
    location: "Cooperativa / propriedade cadastrada",
    pricePerHour: 240,
    status: "in_use",
    power: 120,
    year: 2023,
    hourMeter: 780,
    updatedAt: "2026-08-24T08:50:00-03:00",
    image:
      "https://images.unsplash.com/photo-1535431952749-835a6defb8ec?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "ad-4",
    title: "Plantadeira Semeato SHM 15",
    category: "Plantadeira",
    brand: "Semeato",
    model: "SHM 15",
    location: "Fazenda Boa Vista",
    pricePerHour: 220,
    status: "paused",
    power: 90,
    year: 2019,
    hourMeter: 4310,
    updatedAt: "2026-08-18T16:42:00-03:00",
    image:
      "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "ad-5",
    title: "Implemento Grade Aradora 18 discos",
    category: "Implemento",
    brand: "Kverneland",
    model: "18 discos",
    location: "Cooperativa / propriedade cadastrada",
    pricePerHour: 150,
    status: "available",
    power: 45,
    year: 2020,
    hourMeter: 2100,
    updatedAt: "2026-08-21T10:15:00-03:00",
    image:
      "https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "ad-6",
    title: "Caminhão Agrícola Volvo FM 420",
    category: "Caminhão",
    brand: "Volvo",
    model: "FM 420",
    location: "Fazenda do Vale",
    pricePerHour: 520,
    status: "available",
    power: 420,
    year: 2018,
    hourMeter: 5980,
    updatedAt: "2026-08-19T07:05:00-03:00",
    image:
      "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
  },
];

const statusFilterOptions = [
  { value: "all", label: "Todos" },
  { value: "available", label: "Disponível" },
  { value: "reserved", label: "Reservado" },
  { value: "in_use", label: "Em uso" },
  { value: "paused", label: "Pausado" },
] as const;

const categoryOptions = [
  "Todos",
  "Trator",
  "Colheitadeira",
  "Plantadeira",
  "Pulverizador",
  "Implemento",
  "Caminhão",
  "Outros",
] as const;

const statusConfig: Record<
  AdStatus,
  { label: string; badgeClass: string; rowClass: string }
> = {
  available: {
    label: "Disponível",
    badgeClass: "bg-klutch-teal-soft text-klutch-teal ring-klutch-teal/20",
    rowClass: "text-klutch-teal",
  },
  reserved: {
    label: "Reservado",
    badgeClass: "bg-klutch-amber-soft text-klutch-amber-dark ring-klutch-amber/20",
    rowClass: "text-klutch-amber-dark",
  },
  in_use: {
    label: "Em uso",
    badgeClass: "bg-klutch-teal-soft text-klutch-teal-light ring-klutch-teal/20",
    rowClass: "text-klutch-teal-light",
  },
  paused: {
    label: "Pausado",
    badgeClass: "bg-klutch-line text-foreground ring-klutch-line",
    rowClass: "text-foreground",
  },
};

const formatCurrency = (price: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(price);

const formatRelativeDate = (value: string) => {
  const diffMs = Date.now() - new Date(value).getTime();
  const diffHours = Math.max(1, Math.round(diffMs / (1000 * 60 * 60)));

  if (diffHours < 24) {
    return `Há ${diffHours}h`;
  }

  const diffDays = Math.max(1, Math.round(diffHours / 24));
  return `Há ${diffDays}d`;
};

export default function MeusAnunciosPage() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<MachineryAd[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<(typeof statusFilterOptions)[number]["value"]>("all");
  const [categoryFilter, setCategoryFilter] = useState<(typeof categoryOptions)[number]>("Todos");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [selectedAd, setSelectedAd] = useState<MachineryAd | null>(null);
  const [editingAd, setEditingAd] = useState<MachineryAd | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const loadAnnouncements = async () => {
    setIsLoading(true);
    setLoadError(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 850));
      setAnnouncements(mockAds);
    } catch {
      setLoadError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadAnnouncements();
  }, []);

  useEffect(() => {
    if (!toast) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => setToast(null), 2200);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const summary = useMemo(() => {
    const total = announcements.length;
    const available = announcements.filter((item) => item.status === "available").length;
    const inUse = announcements.filter((item) => item.status === "in_use" || item.status === "reserved").length;
    const paused = announcements.filter((item) => item.status === "paused").length;

    return { total, available, inUse, paused };
  }, [announcements]);

  const filteredAnnouncements = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    const result = announcements.filter((item) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        `${item.title} ${item.brand} ${item.model} ${item.category}`
          .toLowerCase()
          .includes(normalizedQuery);

      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const matchesCategory =
        categoryFilter === "Todos" || item.category === categoryFilter;

      return matchesQuery && matchesStatus && matchesCategory;
    });

    switch (sortBy) {
      case "newest":
        return [...result].sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );
      case "oldest":
        return [...result].sort(
          (a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime(),
        );
      case "nameAsc":
        return [...result].sort((a, b) => a.title.localeCompare(b.title));
      case "nameDesc":
        return [...result].sort((a, b) => b.title.localeCompare(a.title));
      case "priceHigh":
        return [...result].sort((a, b) => b.pricePerHour - a.pricePerHour);
      case "priceLow":
        return [...result].sort((a, b) => a.pricePerHour - b.pricePerHour);
      default:
        return result;
    }
  }, [announcements, categoryFilter, query, sortBy, statusFilter]);

  const handleTogglePause = (id: string) => {
    setAnnouncements((current) =>
      current.map((announcement) => {
        if (announcement.id !== id) {
          return announcement;
        }

        const nextStatus = announcement.status === "paused" ? "available" : "paused";
        setToast(
          nextStatus === "paused"
            ? "Anúncio pausado com sucesso."
            : "Anúncio reativado com sucesso.",
        );

        return { ...announcement, status: nextStatus };
      }),
    );
  };

  const handleDelete = (id: string) => {
    setAnnouncements((current) => current.filter((announcement) => announcement.id !== id));
    setDeleteTargetId(null);
    setToast("Anúncio excluído.");
  };

  const handleSaveEdit = (updatedAd: MachineryAd) => {
    setAnnouncements((current) =>
      current.map((announcement) =>
        announcement.id === updatedAd.id ? updatedAd : announcement,
      ),
    );
    setEditingAd(null);
    setToast("Anúncio atualizado.");
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <header className="rounded-[28px] border border-klutch-line bg-gradient-to-r from-klutch-teal-soft via-white to-klutch-amber-soft px-4 py-5 shadow-[0_12px_30px_rgba(15,110,86,0.08)] backdrop-blur sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-display text-3xl font-bold tracking-[-0.05em] text-klutch-teal">
                Meus anúncios
              </p>
              <p className="mt-2 max-w-2xl text-sm text-klutch-muted">
                Gerencie as máquinas que você disponibilizou para outros cooperados.
              </p>
            </div>
          </div>
        </header>

        <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            label="Total de anúncios"
            value={summary.total}
            hint="máquinas cadastradas"
            accent="teal"
          />
          <SummaryCard
            label="Disponíveis"
            value={summary.available}
            hint="prontas para reserva"
            accent="teal"
          />
          <SummaryCard
            label="Em uso"
            value={summary.inUse}
            hint="reservadas ou em operação"
            accent="amber"
          />
          <SummaryCard
            label="Pausados"
            value={summary.paused}
            hint="temporariamente indisponíveis"
            accent="neutral"
          />
        </section>

        <section className="mt-6 rounded-[24px] border border-klutch-line bg-white p-4 shadow-[0_12px_30px_rgba(16,24,32,0.04)] sm:p-5">
          <div className="grid gap-3 xl:grid-cols-[minmax(0,1.4fr)_minmax(180px,0.7fr)_minmax(180px,0.7fr)_minmax(200px,0.7fr)]">
            <label className="block">
              <span className="sr-only">Buscar anúncios</span>
              <div className="flex items-center gap-3 rounded-full border border-klutch-line bg-[#f7f7f4] px-4 py-3 text-klutch-muted transition-colors focus-within:border-klutch-teal focus-within:ring-2 focus-within:ring-klutch-teal/10">
                <Search size={18} className="text-klutch-muted" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  aria-label="Buscar por máquina, modelo ou categoria"
                  placeholder="Buscar por máquina, modelo ou categoria..."
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-klutch-muted/75 focus:outline-none"
                />
              </div>
            </label>

            <select
              aria-label="Filtrar por status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value as typeof statusFilter)}
              className="rounded-full border border-klutch-line bg-[#f7f7f4] px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-klutch-teal focus:ring-2 focus:ring-klutch-teal/10"
            >
              {statusFilterOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <select
              aria-label="Filtrar por categoria"
              value={categoryFilter}
              onChange={(event) => setCategoryFilter(event.target.value as (typeof categoryOptions)[number])}
              className="rounded-full border border-klutch-line bg-[#f7f7f4] px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-klutch-teal focus:ring-2 focus:ring-klutch-teal/10"
            >
              {categoryOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <select
              aria-label="Ordenar anúncios"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortOption)}
              className="rounded-full border border-klutch-line bg-[#f7f7f4] px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-klutch-teal focus:ring-2 focus:ring-klutch-teal/10"
            >
              <option value="newest">Mais recentes</option>
              <option value="oldest">Mais antigos</option>
              <option value="nameAsc">Nome A–Z</option>
              <option value="nameDesc">Nome Z–A</option>
              <option value="priceHigh">Maior valor/hora</option>
              <option value="priceLow">Menor valor/hora</option>
            </select>
          </div>
        </section>

        {isLoading ? (
          <LoadingState />
        ) : loadError ? (
          <ErrorState onRetry={() => void loadAnnouncements()} />
        ) : filteredAnnouncements.length === 0 ? (
          <EmptyState />
        ) : (
          <section className="mt-6 grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
            {filteredAnnouncements.map((announcement) => {
              const config = statusConfig[announcement.status];

              return (
                <article
                  key={announcement.id}
                  className="group overflow-hidden rounded-[24px] border border-klutch-line bg-white shadow-[0_12px_24px_rgba(15,23,42,0.04)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_18px_32px_rgba(15,23,42,0.08)]"
                >
                  <div className="relative h-52 overflow-hidden bg-[#edf0ed]">
                    {announcement.image ? (
                      <img
                        src={announcement.image}
                        alt={announcement.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#edf3f2] to-[#eae7e0] text-[#516268]">
                        <span className="text-sm font-medium">Imagem da máquina</span>
                      </div>
                    )}

                    <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/70 bg-white/90 px-2.5 py-1 text-xs font-semibold text-klutch-teal shadow-sm backdrop-blur-sm">
                      <span
                        className={`h-2.5 w-2.5 rounded-full ${
                          announcement.status === "available"
                            ? "bg-klutch-teal"
                            : announcement.status === "reserved"
                              ? "bg-klutch-amber"
                              : announcement.status === "in_use"
                                ? "bg-klutch-teal-light"
                                : "bg-klutch-muted"
                        }`}
                      />
                      {config.label}
                    </div>
                  </div>

                  <div className="space-y-4 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="line-clamp-2 text-lg font-bold tracking-[-0.04em] text-klutch-teal">
                          {announcement.title}
                        </h3>
                        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-klutch-muted">
                          {announcement.category}
                        </p>
                      </div>

                      <AnnouncementMenu
                        onEdit={() => setEditingAd(announcement)}
                        onView={() => setSelectedAd(announcement)}
                        onPause={() => handleTogglePause(announcement.id)}
                        onDelete={() => setDeleteTargetId(announcement.id)}
                        isPaused={announcement.status === "paused"}
                      />
                    </div>

                    <div className="space-y-2 text-sm text-[#58656d]">
                      <div className="flex items-center gap-2">
                        <MapPin size={15} className="text-klutch-teal" />
                        <span>{announcement.location}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs text-[#47545a]">
                        {announcement.power ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-klutch-teal-soft px-2 py-1 text-klutch-teal">
                            <Gauge size={12} className="text-klutch-teal" />
                            {announcement.power} cv
                          </span>
                        ) : null}
                        {announcement.year ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-klutch-amber-soft px-2 py-1 text-klutch-amber-dark">
                            <CalendarRange size={12} className="text-klutch-amber-dark" />
                            {announcement.year}
                          </span>
                        ) : null}
                        {announcement.hourMeter ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-klutch-teal-soft px-2 py-1 text-klutch-teal">
                            <Clock3 size={12} className="text-klutch-teal" />
                            {announcement.hourMeter}h
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="rounded-[18px] bg-gradient-to-r from-klutch-teal-soft to-klutch-amber-soft p-3">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-sm text-klutch-muted">Valor</span>
                        <span className="text-2xl font-bold tracking-[-0.04em] text-klutch-teal">
                          {formatCurrency(announcement.pricePerHour)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-klutch-muted">/ hora</p>
                      <p className="mt-3 text-[11px] text-klutch-muted">
                        Valor calculado com base nos custos da máquina
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-t border-[#ebefea] pt-3">
                      <span className="text-xs text-[#5d676d]">
                        Atualizado {formatRelativeDate(announcement.updatedAt)}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedAd(announcement)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-klutch-line bg-white px-2.5 py-2 text-xs font-medium text-klutch-teal transition-colors hover:border-klutch-teal hover:text-klutch-teal focus:outline-none focus:ring-2 focus:ring-klutch-teal/10"
                        >
                          <Eye size={14} />
                          Visualizar
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingAd(announcement)}
                          className="inline-flex items-center gap-1.5 rounded-full border border-klutch-line bg-white px-2.5 py-2 text-xs font-medium text-klutch-teal transition-colors hover:border-klutch-teal hover:text-klutch-teal focus:outline-none focus:ring-2 focus:ring-klutch-teal/10"
                        >
                          <Edit3 size={14} />
                          Editar
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>

      {selectedAd ? (
        <AnnouncementModal
          announcement={selectedAd}
          onClose={() => setSelectedAd(null)}
        />
      ) : null}

      {editingAd ? (
        <EditAnnouncementModal
          announcement={editingAd}
          onClose={() => setEditingAd(null)}
          onSave={handleSaveEdit}
        />
      ) : null}

      {deleteTargetId ? (
        <DeleteConfirmationModal
          onCancel={() => setDeleteTargetId(null)}
          onConfirm={() => handleDelete(deleteTargetId)}
        />
      ) : null}

      {toast ? (
        <div className="fixed bottom-6 right-6 z-50 rounded-full bg-[#04342C] px-4 py-2 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      ) : null}
    </main>
  );
}

function SummaryCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: number;
  hint: string;
  accent: "teal" | "amber" | "neutral";
}) {
  const accentClasses =
    accent === "teal"
      ? "border-klutch-teal-soft bg-klutch-teal-soft/40"
      : accent === "amber"
        ? "border-klutch-amber-soft bg-klutch-amber-soft/50"
        : "border-klutch-line bg-white";

  return (
    <div className={`rounded-[22px] border p-4 shadow-[0_12px_28px_rgba(15,23,42,0.03)] ${accentClasses}`}>
      <p className="text-sm text-klutch-muted">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-3">
        <span className="font-display text-3xl font-bold tracking-[-0.06em] text-klutch-teal">
          {value}
        </span>
        <span className="text-[11px] uppercase tracking-[0.08em] text-klutch-muted">{hint}</span>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <section className="mt-6 grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-[24px] border border-[#e2e5e1] bg-white shadow-[0_12px_24px_rgba(15,23,42,0.03)]"
        >
          <div className="h-52 animate-pulse bg-[#edf0ee]" />
          <div className="space-y-4 p-4">
            <div className="h-5 w-2/3 animate-pulse rounded-full bg-[#edf0ee]" />
            <div className="h-3 w-1/3 animate-pulse rounded-full bg-[#edf0ee]" />
            <div className="h-16 animate-pulse rounded-[18px] bg-[#f3f5f3]" />
            <div className="h-10 animate-pulse rounded-full bg-[#f3f5f3]" />
          </div>
        </div>
      ))}
    </section>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <section className="mt-6 rounded-[28px] border border-[#efd0c6] bg-[#fffaf8] p-8 text-center shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#ffe4db] text-[#b93d1f]">
        <X size={28} />
      </div>
      <h2 className="mt-5 text-2xl font-bold tracking-[-0.05em] text-[#1c2022]">
        Não foi possível carregar seus anúncios
      </h2>
      <p className="mt-2 text-sm text-[#59656b]">
        Ocorreu um problema ao buscar suas máquinas. Tente novamente.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 rounded-full bg-[#0e4f3d] px-5 py-3 font-semibold text-white transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#0e4f3d]/20"
      >
        Tentar novamente
      </button>
    </section>
  );
}

function EmptyState() {
  return (
    <section className="mt-6 rounded-[28px] border border-dashed border-klutch-line bg-gradient-to-br from-white via-klutch-teal-soft/20 to-klutch-amber-soft/20 p-8 text-center shadow-[0_12px_24px_rgba(4,52,44,0.04)]">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-klutch-teal-soft text-klutch-teal">
        <Plus size={30} />
      </div>
      <h2 className="mt-5 text-2xl font-bold tracking-[-0.05em] text-klutch-teal">
        Você ainda não possui anúncios
      </h2>
      <p className="mx-auto mt-2 max-w-lg text-sm text-klutch-muted">
        Quando houver máquinas publicadas, elas aparecerão aqui para você acompanhar e gerenciar.
      </p>
    </section>
  );
}

function AnnouncementMenu({
  onEdit,
  onView,
  onPause,
  onDelete,
  isPaused,
}: {
  onEdit: () => void;
  onView: () => void;
  onPause: () => void;
  onDelete: () => void;
  isPaused: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Mais opções do anúncio"
        onClick={() => setOpen((current) => !current)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#dfe3dd] bg-white text-[#3b4850] transition-colors hover:border-[#0e4f3d] hover:text-[#0e4f3d] focus:outline-none focus:ring-2 focus:ring-[#0e4f3d]/10"
      >
        <Ellipsis size={18} />
      </button>

      {open ? (
        <div className="absolute right-0 top-12 z-20 w-52 rounded-2xl border border-[#e5e7e3] bg-white p-2 shadow-[0_16px_32px_rgba(15,23,42,0.1)]">
          <button
            type="button"
            onClick={() => {
              onView();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-[#1d2d33] transition-colors hover:bg-[#f4f7f5]"
          >
            <Eye size={15} />
            Visualizar
          </button>
          <button
            type="button"
            onClick={() => {
              onEdit();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-[#1d2d33] transition-colors hover:bg-[#f4f7f5]"
          >
            <Edit3 size={15} />
            Editar
          </button>
          <button
            type="button"
            onClick={() => {
              onPause();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-[#1d2d33] transition-colors hover:bg-[#f4f7f5]"
          >
            <PauseCircle size={15} />
            {isPaused ? "Reativar anúncio" : "Pausar anúncio"}
          </button>
          <button
            type="button"
            onClick={() => {
              onDelete();
              setOpen(false);
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm text-[#b5331b] transition-colors hover:bg-[#fff1ee]"
          >
            <Trash2 size={15} />
            Excluir anúncio
          </button>
        </div>
      ) : null}
    </div>
  );
}

function AnnouncementModal({
  announcement,
  onClose,
}: {
  announcement: MachineryAd;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#0f1720]/45 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-2xl rounded-[30px] bg-white p-5 shadow-[0_20px_40px_rgba(15,23,42,0.18)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-[#5d676d]">
              {announcement.category}
            </p>
            <h3 className="mt-1 text-2xl font-bold tracking-[-0.05em] text-[#172127]">
              {announcement.title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4f6f3] text-[#3e4d52] transition-colors hover:bg-[#ebf1ee]"
            aria-label="Fechar visualização"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 overflow-hidden rounded-[20px] border border-[#e5e7e3] bg-[#f7f7f4]">
          {announcement.image ? (
            <img src={announcement.image} alt={announcement.title} className="h-64 w-full object-cover" />
          ) : (
            <div className="flex h-64 items-center justify-center bg-gradient-to-br from-[#edf3f2] to-[#eae7e0] text-[#516268]">
              Imagem da máquina
            </div>
          )}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[18px] bg-[#f7f7f4] p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-[#68777d]">Status</p>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-[#dde8e4] bg-white px-3 py-1.5 text-sm font-semibold text-[#0f1720]">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  announcement.status === "available"
                    ? "bg-emerald-500"
                    : announcement.status === "reserved"
                      ? "bg-amber-500"
                      : announcement.status === "in_use"
                        ? "bg-sky-500"
                        : "bg-zinc-500"
                }`}
              />
              {statusConfig[announcement.status].label}
            </div>
          </div>

          <div className="rounded-[18px] bg-[#f7f7f4] p-4">
            <p className="text-xs uppercase tracking-[0.12em] text-[#68777d]">Valor</p>
            <p className="mt-2 text-2xl font-bold tracking-[-0.04em] text-[#101a1d]">
              {formatCurrency(announcement.pricePerHour)}
            </p>
            <p className="text-xs text-[#68777d]">/ hora</p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 text-sm text-[#45555d]">
          <div className="rounded-[18px] border border-[#e7e9e6] p-3">
            <p className="text-[#67767d]">Localização</p>
            <p className="mt-1 font-medium text-[#1f2a2d]">{announcement.location}</p>
          </div>
          <div className="rounded-[18px] border border-[#e7e9e6] p-3">
            <p className="text-[#67767d]">Última atualização</p>
            <p className="mt-1 font-medium text-[#1f2a2d]">{formatRelativeDate(announcement.updatedAt)}</p>
          </div>
          <div className="rounded-[18px] border border-[#e7e9e6] p-3">
            <p className="text-[#67767d]">Potência</p>
            <p className="mt-1 font-medium text-[#1f2a2d]">{announcement.power ?? "-"} cv</p>
          </div>
          <div className="rounded-[18px] border border-[#e7e9e6] p-3">
            <p className="text-[#67767d]">Ano</p>
            <p className="mt-1 font-medium text-[#1f2a2d]">{announcement.year ?? "-"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditAnnouncementModal({
  announcement,
  onClose,
  onSave,
}: {
  announcement: MachineryAd;
  onClose: () => void;
  onSave: (updatedAnnouncement: MachineryAd) => void;
}) {
  const [form, setForm] = useState<MachineryAd>(announcement);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#0f1720]/45 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-xl rounded-[28px] bg-white p-5 shadow-[0_20px_40px_rgba(15,23,42,0.18)]">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-2xl font-bold tracking-[-0.05em] text-[#172127]">
            Editar anúncio
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar edição"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4f6f3] text-[#3e4d52]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#45555d]">Título</span>
            <input
              value={form.title}
              onChange={(event) => setForm({ ...form, title: event.target.value })}
              className="w-full rounded-full border border-[#d9dfdc] bg-[#f7f7f4] px-4 py-3 text-sm text-[#172127] outline-none focus:border-[#0e4f3d] focus:ring-2 focus:ring-[#0e4f3d]/10"
            />
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#45555d]">Categoria</span>
              <select
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
                className="w-full rounded-full border border-[#d9dfdc] bg-[#f7f7f4] px-4 py-3 text-sm text-[#172127] outline-none focus:border-[#0e4f3d] focus:ring-2 focus:ring-[#0e4f3d]/10"
              >
                {categoryOptions.slice(1).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#45555d]">Status</span>
              <select
                value={form.status}
                onChange={(event) => setForm({ ...form, status: event.target.value as AdStatus })}
                className="w-full rounded-full border border-[#d9dfdc] bg-[#f7f7f4] px-4 py-3 text-sm text-[#172127] outline-none focus:border-[#0e4f3d] focus:ring-2 focus:ring-[#0e4f3d]/10"
              >
                {statusFilterOptions.slice(1).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#45555d]">Valor por hora</span>
              <input
                type="number"
                min={0}
                value={form.pricePerHour}
                onChange={(event) =>
                  setForm({ ...form, pricePerHour: Number(event.target.value) || 0 })
                }
                className="w-full rounded-full border border-[#d9dfdc] bg-[#f7f7f4] px-4 py-3 text-sm text-[#172127] outline-none focus:border-[#0e4f3d] focus:ring-2 focus:ring-[#0e4f3d]/10"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-[#45555d]">Localização</span>
              <input
                value={form.location}
                onChange={(event) => setForm({ ...form, location: event.target.value })}
                className="w-full rounded-full border border-[#d9dfdc] bg-[#f7f7f4] px-4 py-3 text-sm text-[#172127] outline-none focus:border-[#0e4f3d] focus:ring-2 focus:ring-[#0e4f3d]/10"
              />
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#d6dbd7] bg-white px-4 py-2.5 text-sm font-semibold text-[#203036]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => onSave(form)}
              className="flex items-center gap-2 rounded-full bg-[#0e4f3d] px-4 py-2.5 text-sm font-semibold text-white"
            >
              <Check size={16} />
              Salvar alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirmationModal({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-[#04342C]/35 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-md rounded-[28px] bg-white p-5 shadow-[0_20px_40px_rgba(15,23,42,0.18)]">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FAEEDA] text-[#854F0B]">
          <Trash2 size={28} />
        </div>
        <h3 className="mt-5 text-center text-2xl font-bold tracking-[-0.05em] text-[#2C2C2A]">
          Excluir anúncio?
        </h3>
        <p className="mt-2 text-center text-sm text-[#5F5E5A]">
          Essa ação removerá o anúncio e não poderá ser desfeita.
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-[#D3D1C7] bg-white px-4 py-2.5 text-sm font-semibold text-[#2C2C2A]"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-[#854F0B] px-4 py-2.5 text-sm font-semibold text-white"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
