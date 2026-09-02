"use client";

import {
  Award,
  Bell,
  Calendar,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Compass,
  Heart,
  Home,
  Menu,
  MessageSquare,
  Pencil,
  Plus,
  Search,
  Sprout,
  Star,
  Tractor,
  Trash2,
  Truck,
  Wrench,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";

type ReviewStatus = "completed" | "pending";
type Filter = "all" | "five" | "four" | "low" | "recent";

type Review = {
  id: string;
  rentalId: string;
  equipmentName: string;
  equipmentType: string;
  ownerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  status: ReviewStatus;
};

type PendingReview = {
  id: string;
  rentalId: string;
  equipmentName: string;
  equipmentType: string;
  completedAt: string;
};

const initialReviews: Review[] = [
  {
    id: "review-001",
    rentalId: "rental-001",
    equipmentName: "Trator John Deere 5075E",
    equipmentType: "Trator",
    ownerName: "Cooperativa Rural São Paulo",
    rating: 5,
    comment:
      "Equipamento em ótimo estado e muito bem conservado. O processo de retirada foi simples e organizado.",
    createdAt: "28 de Agosto",
    status: "completed",
  },
  {
    id: "review-002",
    rentalId: "rental-002",
    equipmentName: "Implemento Agrícola",
    equipmentType: "Implemento",
    ownerName: "Cooperativa Agro Centro-Oeste",
    rating: 4,
    comment:
      "Funcionou muito bem durante o período de utilização. O agendamento foi simples.",
    createdAt: "20 de Agosto",
    status: "completed",
  },
  {
    id: "review-003",
    rentalId: "rental-003",
    equipmentName: "Caminhonete S10",
    equipmentType: "Transporte",
    ownerName: "Cooperativa Regional",
    rating: 5,
    comment:
      "Veículo em boas condições e muito útil para o transporte da produção.",
    createdAt: "12 de Agosto",
    status: "completed",
  },
];

const initialPending: PendingReview[] = [
  {
    id: "pending-001",
    rentalId: "rental-004",
    equipmentName: "Pulverizador Agrícola Jacto",
    equipmentType: "Pulverizador",
    completedAt: "01 de Setembro",
  },
  {
    id: "pending-002",
    rentalId: "rental-005",
    equipmentName: "Trator Massey Ferguson",
    equipmentType: "Trator",
    completedAt: "29 de Agosto",
  },
];

const filterOptions: { id: Filter; label: string }[] = [
  { id: "all", label: "Todas" },
  { id: "five", label: "5 estrelas" },
  { id: "four", label: "4 estrelas" },
  { id: "low", label: "3 ou menos" },
  { id: "recent", label: "Mais recentes" },
];

function EquipmentIcon({ type, size = 22 }: { type: string; size?: number }) {
  const Icon: LucideIcon =
    type === "Transporte"
      ? Truck
      : type === "Implemento"
        ? Wrench
        : type === "Pulverizador"
          ? Sprout
          : Tractor;
  return <Icon size={size} strokeWidth={1.8} />;
}

function RatingStars({
  rating,
  interactive = false,
  onSelect,
}: {
  rating: number;
  interactive?: boolean;
  onSelect?: (value: number) => void;
}) {
  return (
    <div
      className="flex items-center gap-0.5"
      role={interactive ? "radiogroup" : undefined}
      aria-label={
        interactive
          ? "Escolha uma nota de 1 a 5 estrelas"
          : `${rating} de 5 estrelas`
      }
    >
      {Array.from({ length: 5 }, (_, index) => {
        const value = index + 1;
        const filled = value <= rating;
        return interactive ? (
          <button
            key={value}
            type="button"
            onClick={() => onSelect?.(value)}
            className="rounded-md p-1 text-[#EF9F27] transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F6E56]"
            aria-label={`${value} ${value === 1 ? "estrela" : "estrelas"}`}
            aria-checked={value === rating}
            role="radio"
          >
            <Star
              size={24}
              fill={filled ? "currentColor" : "none"}
              strokeWidth={1.7}
            />
          </button>
        ) : (
          <Star
            key={value}
            size={15}
            fill={filled ? "currentColor" : "none"}
            className={filled ? "text-[#EF9F27]" : "text-[#D3D1C7]"}
            strokeWidth={1.7}
          />
        );
      })}
    </div>
  );
}

function ReviewsHeader() {
  return (
    <header className="flex items-center justify-between px-5 pb-5 pt-7 sm:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Abrir menu"
          className="rounded-xl border border-[#D3D1C7] bg-white p-2.5 text-[#04342C] shadow-sm transition hover:border-[#5DCAA5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F6E56]"
        >
          <Menu size={20} />
        </button>
        <div>
          <p className="font-display text-[11px] font-bold uppercase tracking-[0.16em] text-[#0F6E56]">
            Klutch / Comunidade
          </p>
          <h1 className="font-display text-xl font-extrabold tracking-[-0.03em] text-[#2C2C2A] sm:text-2xl">
            Minhas avaliações
          </h1>
          <p className="text-xs text-[#5F5E5A]">Compartilhe sua experiência.</p>
        </div>
      </div>
      <button
        type="button"
        aria-label="Ver notificações"
        className="relative rounded-xl border border-[#D3D1C7] bg-white p-2.5 text-[#04342C] shadow-sm transition hover:border-[#5DCAA5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F6E56]"
      >
        <Bell size={19} />
        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#EF9F27]" />
      </button>
    </header>
  );
}

function ReviewsSummary({
  reviews,
  pendingCount,
}: {
  reviews: Review[];
  pendingCount: number;
}) {
  const average = reviews.length
    ? reviews.reduce((total, review) => total + review.rating, 0) /
      reviews.length
    : 0;
  return (
    <section className="relative overflow-hidden rounded-3xl bg-[#04342C] p-6 text-white shadow-[0_18px_45px_rgba(4,52,44,0.16)] sm:p-7">
      <div className="absolute -right-12 -top-14 h-40 w-40 rounded-full border-[22px] border-[#0F6E56]/40" />
      <div className="absolute -bottom-20 right-20 h-36 w-36 rounded-full border-[18px] border-[#5DCAA5]/10" />
      <div className="relative">
        <div className="mb-7 flex items-start justify-between">
          <div>
            <p className="mb-1 text-sm text-[#BFE8D7]">
              Sua experiência no Klutch
            </p>
            <h2 className="font-display text-2xl font-extrabold tracking-[-0.03em]">
              Cada avaliação conta.
            </h2>
          </div>
          <Award className="text-[#FAC775]" size={27} />
        </div>
        <div className="grid grid-cols-3 divide-x divide-white/15">
          <div>
            <p className="font-display text-2xl font-extrabold">
              {reviews.length}
            </p>
            <p className="mt-1 text-[11px] text-[#BFE8D7]">Avaliações feitas</p>
          </div>
          <div className="pl-4">
            <p className="font-display text-2xl font-extrabold">
              {average.toFixed(1).replace(".", ",")}
            </p>
            <div className="mt-1 flex items-center gap-1">
              <RatingStars rating={average} />
              <span className="text-[11px] text-[#BFE8D7]">média</span>
            </div>
          </div>
          <div className="pl-4">
            <p className="font-display text-2xl font-extrabold">
              {pendingCount}
            </p>
            <p className="mt-1 text-[11px] text-[#BFE8D7]">Pendentes</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function PendingReviewCard({
  pending,
  onReview,
}: {
  pending: PendingReview;
  onReview: () => void;
}) {
  return (
    <article className="flex items-center gap-3 rounded-2xl border border-[#F3D49D] bg-[#FFF9EC] p-4 shadow-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FAEEDA] text-[#854F0B]">
        <EquipmentIcon type={pending.equipmentType} />
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-sm font-bold text-[#2C2C2A]">
          {pending.equipmentName}
        </h3>
        <p className="mt-0.5 text-xs text-[#5F5E5A]">
          {pending.equipmentType} · Uso concluído em {pending.completedAt}
        </p>
      </div>
      <button
        type="button"
        onClick={onReview}
        className="shrink-0 rounded-xl bg-[#EF9F27] px-3 py-2 text-xs font-bold text-[#573205] transition hover:bg-[#FAC775] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#854F0B]"
      >
        Avaliar
      </button>
    </article>
  );
}

function ReviewTabs({
  active,
  onChange,
}: {
  active: Filter;
  onChange: (filter: Filter) => void;
}) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1"
      aria-label="Filtros de avaliações"
    >
      {filterOptions.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F6E56] ${active === option.id ? "bg-[#0F6E56] text-white shadow-sm" : "bg-white text-[#5F5E5A] hover:bg-[#E1F5EE]"}`}
        >
          {option.label}
          {active === option.id && option.id !== "all" ? (
            <ChevronDown className="ml-1 inline" size={13} />
          ) : null}
        </button>
      ))}
    </div>
  );
}

function ReviewCard({
  review,
  onEdit,
  onDelete,
}: {
  review: Review;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="rounded-2xl border border-[#E2E0D8] bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E1F5EE] text-[#0F6E56]">
          <EquipmentIcon type={review.equipmentType} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-[#2C2C2A]">
                {review.equipmentName}
              </h3>
              <p className="mt-0.5 text-xs text-[#5F5E5A]">
                {review.equipmentType} · {review.ownerName}
              </p>
            </div>
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                onClick={onEdit}
                aria-label={`Editar avaliação de ${review.equipmentName}`}
                className="rounded-lg p-2 text-[#5F5E5A] transition hover:bg-[#E1F5EE] hover:text-[#0F6E56] focus-visible:outline-2 focus-visible:outline-[#0F6E56]"
              >
                <Pencil size={16} />
              </button>
              <button
                type="button"
                onClick={onDelete}
                aria-label={`Excluir avaliação de ${review.equipmentName}`}
                className="rounded-lg p-2 text-[#5F5E5A] transition hover:bg-[#FDE8E5] hover:text-[#B42318] focus-visible:outline-2 focus-visible:outline-[#B42318]"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <RatingStars rating={review.rating} />
            <span className="text-xs font-bold text-[#854F0B]">
              {review.rating.toFixed(1).replace(".", ",")}
            </span>
          </div>
          <p className="mt-3 text-sm leading-6 text-[#5F5E5A]">
            “{review.comment}”
          </p>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-[#8A8984]">
            <Calendar size={14} /> Avaliado em {review.createdAt}
          </div>
        </div>
      </div>
    </article>
  );
}

function ReviewEmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-[#D3D1C7] bg-white/60 px-6 py-12 text-center">
      <MessageSquare className="mx-auto text-[#5DCAA5]" size={34} />
      <h3 className="mt-3 font-display text-base font-extrabold text-[#2C2C2A]">
        Nenhuma avaliação encontrada
      </h3>
      <p className="mx-auto mt-1 max-w-xs text-sm text-[#5F5E5A]">
        Suas avaliações sobre equipamentos aparecerão aqui.
      </p>
    </div>
  );
}

function ModalShell({
  title,
  eyebrow,
  onClose,
  children,
}: {
  title: string;
  eyebrow: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#04342C]/50 p-0 backdrop-blur-sm sm:items-center sm:p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-title"
        className="max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-[#F8F7F1] p-5 shadow-2xl sm:max-w-md sm:rounded-3xl sm:p-6"
      >
        <div className="mb-5 flex items-start justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#0F6E56]">
              {eyebrow}
            </p>
            <h2
              id="review-modal-title"
              className="mt-1 font-display text-xl font-extrabold text-[#2C2C2A]"
            >
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar modal"
            className="rounded-xl p-2 text-[#5F5E5A] hover:bg-[#E1F5EE] focus-visible:outline-2 focus-visible:outline-[#0F6E56]"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ReviewForm({
  review,
  onSubmit,
  submitLabel,
}: {
  review: Review;
  onSubmit: (rating: number, comment: string) => void;
  submitLabel: string;
}) {
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(review.comment);
  const valid = rating > 0 && comment.trim().length > 0;
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (valid) onSubmit(rating, comment.trim());
      }}
    >
      <div className="rounded-2xl bg-[#E1F5EE] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#0F6E56]">
            <EquipmentIcon type={review.equipmentType} size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-[#2C2C2A]">
              {review.equipmentName}
            </p>
            <p className="text-xs text-[#5F5E5A]">{review.ownerName}</p>
          </div>
        </div>
      </div>
      <fieldset className="mt-5">
        <legend className="mb-2 text-sm font-bold text-[#2C2C2A]">
          Como você avalia essa experiência?
        </legend>
        <RatingStars rating={rating} interactive onSelect={setRating} />
      </fieldset>
      <label
        htmlFor="review-comment"
        className="mt-5 block text-sm font-bold text-[#2C2C2A]"
      >
        Conte como foi sua experiência
      </label>
      <textarea
        id="review-comment"
        value={comment}
        onChange={(event) => setComment(event.target.value.slice(0, 500))}
        rows={5}
        maxLength={500}
        placeholder="Compartilhe detalhes sobre o equipamento e sua experiência..."
        className="mt-2 w-full resize-none rounded-2xl border border-[#D3D1C7] bg-white px-4 py-3 text-sm text-[#2C2C2A] outline-none transition placeholder:text-[#8A8984] focus:border-[#0F6E56] focus:ring-2 focus:ring-[#5DCAA5]/30"
      />
      <p className="mt-1 text-right text-xs text-[#8A8984]">
        {comment.length}/500
      </p>
      <button
        type="submit"
        disabled={!valid}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0F6E56] px-4 py-3.5 text-sm font-bold text-white transition hover:bg-[#04342C] disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F6E56]"
      >
        <Check size={17} />
        {submitLabel}
      </button>
    </form>
  );
}

function DeleteReviewModal({
  review,
  onClose,
  onConfirm,
}: {
  review: Review;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <ModalShell title="Excluir avaliação?" eyebrow="Atenção" onClose={onClose}>
      <div className="rounded-2xl bg-[#FDE8E5] p-4 text-sm leading-6 text-[#7A271A]">
        Esta ação removerá sua avaliação sobre{" "}
        <strong>{review.equipmentName}</strong>.
      </div>
      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-2xl border border-[#D3D1C7] bg-white px-4 py-3 text-sm font-bold text-[#5F5E5A] hover:bg-[#F1EFE8]"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex-1 rounded-2xl bg-[#B42318] px-4 py-3 text-sm font-bold text-white hover:bg-[#8E1B12]"
        >
          Excluir avaliação
        </button>
      </div>
    </ModalShell>
  );
}

function BottomNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#D3D1C7]/70 bg-[#F8F7F1]/95 px-5 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-end justify-between">
        <NavItem icon={Home} label="Início" href="/home" />
        <NavItem icon={Compass} label="Explorar" href="#" />
        <button
          type="button"
          aria-label="Novo anúncio"
          className="-mt-8 flex h-14 w-14 items-center justify-center rounded-full border-4 border-[#F8F7F1] bg-[#EF9F27] text-[#573205] shadow-lg transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#854F0B]"
        >
          <Plus size={24} />
        </button>
        <NavItem icon={CalendarDays} label="Aluguéis" href="/MeusAlugueis" />
        <NavItem icon={Heart} label="Favoritos" href="#" />
      </div>
    </nav>
  );
}
function NavItem({
  icon: Icon,
  label,
  href,
}: {
  icon: LucideIcon;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex min-w-14 flex-col items-center gap-1 rounded-xl px-2 py-1 text-[#8A8984] transition hover:text-[#0F6E56] focus-visible:outline-2 focus-visible:outline-[#0F6E56]"
    >
      <Icon size={19} strokeWidth={1.8} />
      <span className="text-[10px] font-semibold">{label}</span>
    </a>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [pending, setPending] = useState<PendingReview[]>(initialPending);
  const [filter, setFilter] = useState<Filter>("all");
  const [newReview, setNewReview] = useState<PendingReview | null>(null);
  const [editing, setEditing] = useState<Review | null>(null);
  const [deleting, setDeleting] = useState<Review | null>(null);
  const [toast, setToast] = useState("");

  const filteredReviews = useMemo(() => {
    const result = reviews.filter(
      (review) =>
        filter === "all" ||
        filter === "recent" ||
        (filter === "five" && review.rating === 5) ||
        (filter === "four" && review.rating === 4) ||
        (filter === "low" && review.rating <= 3),
    );
    return filter === "recent" ? result : result;
  }, [filter, reviews]);
  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };
  const submitNewReview = (rating: number, comment: string) => {
    if (!newReview) return;
    setReviews((current) => [
      {
        id: `review-${Date.now()}`,
        rentalId: newReview.rentalId,
        equipmentName: newReview.equipmentName,
        equipmentType: newReview.equipmentType,
        ownerName: "Cooperado Klutch",
        rating,
        comment,
        createdAt: "02 de Setembro",
        status: "completed",
      },
      ...current,
    ]);
    setPending((current) => current.filter((item) => item.id !== newReview.id));
    setNewReview(null);
    showToast("Avaliação enviada com sucesso!");
  };
  const updateReview = (rating: number, comment: string) => {
    if (!editing) return;
    setReviews((current) =>
      current.map((review) =>
        review.id === editing.id ? { ...review, rating, comment } : review,
      ),
    );
    setEditing(null);
    showToast("Avaliação atualizada com sucesso!");
  };
  const removeReview = () => {
    if (!deleting) return;
    setReviews((current) =>
      current.filter((review) => review.id !== deleting.id),
    );
    setDeleting(null);
    showToast("Avaliação removida com sucesso!");
  };

  return (
    <div className="min-h-screen bg-[#F1EFE8] pb-28 text-[#2C2C2A]">
      <div className="mx-auto max-w-3xl">
        <ReviewsHeader />
        <main className="space-y-7 px-5 sm:px-8">
          <ReviewsSummary reviews={reviews} pendingCount={pending.length} />
          <section>
            <div className="mb-3 flex items-end justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#EF9F27]">
                  Ação necessária
                </p>
                <h2 className="mt-1 font-display text-lg font-extrabold">
                  Avaliações pendentes
                </h2>
              </div>
              {pending.length > 0 && (
                <span className="rounded-full bg-[#FAEEDA] px-2.5 py-1 text-xs font-bold text-[#854F0B]">
                  {pending.length} restantes
                </span>
              )}
            </div>
            {pending.length ? (
              <div className="space-y-3">
                {pending.map((item) => (
                  <PendingReviewCard
                    key={item.id}
                    pending={item}
                    onReview={() => setNewReview(item)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-3 rounded-2xl border border-[#BFE8D7] bg-[#E1F5EE] p-4">
                <CheckCircle2 className="shrink-0 text-[#0F6E56]" size={24} />
                <div>
                  <h3 className="text-sm font-bold text-[#04342C]">
                    Você está em dia!
                  </h3>
                  <p className="text-xs text-[#0F6E56]">
                    Todos os equipamentos utilizados já foram avaliados.
                  </p>
                </div>
              </div>
            )}
          </section>
          <section>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0F6E56]">
                  Seu histórico
                </p>
                <h2 className="mt-1 font-display text-lg font-extrabold">
                  Avaliações realizadas
                </h2>
              </div>
              <button
                type="button"
                aria-label="Pesquisar avaliações"
                className="rounded-xl bg-white p-2.5 text-[#5F5E5A] shadow-sm hover:text-[#0F6E56]"
              >
                <Search size={18} />
              </button>
            </div>
            <ReviewTabs active={filter} onChange={setFilter} />
            <div className="mt-4 space-y-3">
              {filteredReviews.length ? (
                filteredReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onEdit={() => setEditing(review)}
                    onDelete={() => setDeleting(review)}
                  />
                ))
              ) : (
                <ReviewEmptyState />
              )}
            </div>
          </section>
        </main>
      </div>
      <BottomNavigation />
      {newReview && (
        <ModalShell
          title="Avaliar equipamento"
          eyebrow="Sua opinião importa"
          onClose={() => setNewReview(null)}
        >
          <ReviewForm
            review={{
              ...newReview,
              ownerName: "Cooperado Klutch",
              rating: 0,
              comment: "",
              createdAt: "",
              status: "pending",
            }}
            onSubmit={submitNewReview}
            submitLabel="Enviar avaliação"
          />
        </ModalShell>
      )}
      {editing && (
        <ModalShell
          title="Editar avaliação"
          eyebrow="Atualize sua opinião"
          onClose={() => setEditing(null)}
        >
          <ReviewForm
            review={editing}
            onSubmit={updateReview}
            submitLabel="Salvar alterações"
          />
        </ModalShell>
      )}
      {deleting && (
        <DeleteReviewModal
          review={deleting}
          onClose={() => setDeleting(null)}
          onConfirm={removeReview}
        />
      )}
      {toast && (
        <div
          role="status"
          className="fixed bottom-24 left-1/2 z-[60] flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-[#04342C] px-4 py-3 text-sm font-bold text-white shadow-xl"
        >
          <CheckCircle2 size={17} className="text-[#5DCAA5]" />
          {toast}
        </div>
      )}
    </div>
  );
}
