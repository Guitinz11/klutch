"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
	ArrowLeft,
	Bell,
	BellOff,
	CalendarCheck,
	CheckCheck,
	ChevronRight,
	CircleDollarSign,
	Compass,
	Heart,
	Home,
	MessageSquare,
	Plus,
	Tractor,
	TriangleAlert,
} from "lucide-react";

type NotificationType = "reservation" | "payment" | "machine" | "warning" | "system";
type NotificationStatus = "read" | "unread";
type NotificationFilter = "all" | "unread" | NotificationType;

interface NotificationItem {
	id: string;
	title: string;
	description: string;
	type: NotificationType;
	status: NotificationStatus;
	createdAt: string;
	group: "today" | "earlier";
	actionLabel?: string;
	actionRoute?: string;
}

const initialNotifications: NotificationItem[] = [
	{ id: "reservation-confirmed", title: "Reserva confirmada", description: "Sua reserva do Trator 5075E foi confirmada para amanhã às 08:00.", type: "reservation", status: "unread", createdAt: "Agora", group: "today", actionLabel: "Ver reserva" },
	{ id: "payment-pending", title: "Pagamento pendente", description: "Você possui um pagamento de R$ 350,00 referente ao uso do Trator 5075E.", type: "payment", status: "unread", createdAt: "Há 2 horas", group: "today", actionLabel: "Pagar agora", actionRoute: "/Pagamento-e-Dinheiro" },
	{ id: "machine-available", title: "Máquina disponível", description: "A Caminhonete S10 está disponível para reserva na sua região.", type: "machine", status: "unread", createdAt: "Há 5 horas", group: "today", actionLabel: "Ver equipamento" },
	{ id: "reservation-near", title: "Reserva próxima", description: "Sua reserva do Implemento Agrícola começa amanhã às 07:30.", type: "warning", status: "read", createdAt: "Ontem", group: "earlier" },
	{ id: "reservation-changed", title: "Alteração na reserva", description: "O horário da sua reserva foi atualizado para 14:00.", type: "reservation", status: "read", createdAt: "Ontem", group: "earlier" },
	{ id: "payment-confirmed", title: "Pagamento confirmado", description: "Seu pagamento de R$ 420,00 foi confirmado com sucesso.", type: "payment", status: "read", createdAt: "25 de Agosto", group: "earlier" },
];

const filters: { value: NotificationFilter; label: string }[] = [
	{ value: "all", label: "Todas" },
	{ value: "unread", label: "Não lidas" },
	{ value: "reservation", label: "Reservas" },
	{ value: "payment", label: "Pagamentos" },
	{ value: "machine", label: "Máquinas" },
];

const typeConfig: Record<NotificationType, { icon: typeof Bell; iconClass: string; backgroundClass: string }> = {
	reservation: { icon: CalendarCheck, iconClass: "text-klutch-teal", backgroundClass: "bg-klutch-teal-soft" },
	payment: { icon: CircleDollarSign, iconClass: "text-klutch-amber-dark", backgroundClass: "bg-klutch-amber-soft/70" },
	machine: { icon: Tractor, iconClass: "text-klutch-teal-light", backgroundClass: "bg-[#d9f0df]" },
	warning: { icon: TriangleAlert, iconClass: "text-klutch-amber-dark", backgroundClass: "bg-[#fff1d3]" },
	system: { icon: Bell, iconClass: "text-klutch-muted", backgroundClass: "bg-[#e8e7e0]" },
};

function NotificationHeader({ unreadCount, onMarkAll }: { unreadCount: number; onMarkAll: () => void }) {
	const router = useRouter();

	return (
		<header className="flex items-center gap-3 px-5 pb-2 pt-6 sm:px-0">
			<button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-klutch-teal shadow-sm transition hover:-translate-x-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-klutch-teal" type="button" onClick={() => router.back()} aria-label="Voltar">
				<ArrowLeft size={20} />
			</button>
			<div className="min-w-0 flex-1">
				<p className="text-xs font-semibold uppercase tracking-[0.14em] text-klutch-teal-light">Central Klutch</p>
				<h1 className="font-display text-2xl font-bold tracking-[-0.04em] text-foreground">Notificações</h1>
				<p className="mt-0.5 text-sm text-klutch-muted">Acompanhe as novidades da sua conta.</p>
			</div>
			<button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-klutch-teal shadow-sm transition hover:bg-klutch-teal-soft disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-klutch-teal" type="button" onClick={onMarkAll} disabled={unreadCount === 0} aria-label="Marcar todas como lidas" title="Marcar todas como lidas">
				<CheckCheck size={21} />
			</button>
		</header>
	);
}

function NotificationTabs({ activeFilter, onChange }: { activeFilter: NotificationFilter; onChange: (filter: NotificationFilter) => void }) {
	return (
		<div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 scrollbar-none sm:mx-0 sm:px-0" role="tablist" aria-label="Filtrar notificações">
			{filters.map((filter) => (
				<button key={filter.value} className={`whitespace-nowrap rounded-full px-4 py-2.5 text-xs font-bold transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-klutch-teal ${activeFilter === filter.value ? "bg-klutch-teal-light text-white shadow-sm" : "bg-white text-klutch-muted hover:bg-klutch-teal-soft"}`} type="button" role="tab" aria-selected={activeFilter === filter.value} onClick={() => onChange(filter.value)}>
					{filter.label}
				</button>
			))}
		</div>
	);
}

function NotificationCard({ notification, onRead, onAction }: { notification: NotificationItem; onRead: (id: string) => void; onAction: (notification: NotificationItem) => void }) {
	const config = typeConfig[notification.type];
	const Icon = config.icon;
	const isUnread = notification.status === "unread";

	return (
		<article className={`group rounded-[1.35rem] border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${isUnread ? "border-klutch-teal-accent/30 bg-white shadow-[0_5px_18px_rgba(4,52,44,0.06)]" : "border-transparent bg-[#ebeae3]/70"}`}>
			<button className="flex w-full gap-3 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-klutch-teal" type="button" onClick={() => onRead(notification.id)} aria-label={`${isUnread ? "Marcar como lida: " : "Notificação: "}${notification.title}`}>
				<span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${config.backgroundClass} ${config.iconClass}`}><Icon size={21} strokeWidth={2} /></span>
				<span className="min-w-0 flex-1">
					<span className="flex items-start justify-between gap-3">
						<span className={`font-display text-sm leading-5 ${isUnread ? "font-bold text-foreground" : "font-semibold text-foreground/80"}`}>{notification.title}</span>
						{isUnread && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-klutch-teal-light" aria-label="Não lida" />}
					</span>
					<span className="mt-1 block text-xs leading-5 text-klutch-muted">{notification.description}</span>
					<span className="mt-2 block text-[11px] font-semibold text-klutch-muted/75">{notification.createdAt}</span>
				</span>
			</button>
			{notification.actionLabel && (
				<button className="ml-14 mt-3 inline-flex items-center gap-1 text-xs font-bold text-klutch-teal-light transition hover:text-klutch-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-klutch-teal" type="button" onClick={() => onAction(notification)}>
					{notification.actionLabel}<ChevronRight size={14} />
				</button>
			)}
		</article>
	);
}

function NotificationEmptyState() {
	return (
		<div className="rounded-[1.5rem] border border-dashed border-klutch-line bg-white/60 px-6 py-14 text-center">
			<span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-klutch-teal-soft text-klutch-teal"><BellOff size={28} /></span>
			<h2 className="mt-5 font-display text-lg font-bold text-foreground">Nenhuma notificação encontrada</h2>
			<p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-klutch-muted">Quando houver novidades sobre suas reservas, pagamentos ou equipamentos, elas aparecerão aqui.</p>
		</div>
	);
}

function BottomNavigation() {
	const router = useRouter();
	const items = [
		{ label: "Início", icon: Home, route: "/home" },
		{ label: "Explorar", icon: Compass, route: "/home" },
		{ label: "Nova reserva", icon: Plus, route: "/home", central: true },
		{ label: "Conversas", icon: MessageSquare, route: "/home" },
		{ label: "Favoritos", icon: Heart, route: "/home" },
	];

	return (
		<nav className="fixed inset-x-0 bottom-0 z-20 mx-auto flex h-[78px] max-w-[390px] items-center justify-around rounded-t-[1.6rem] bg-klutch-amber-soft px-3 pb-1 pt-3 shadow-[0_-8px_25px_rgba(44,44,42,0.12)] sm:bottom-5 sm:h-[74px] sm:max-w-6xl sm:rounded-full sm:px-8" aria-label="Navegação principal">
			{items.map(({ label, icon: Icon, route, central }) => central ? (
				<button key={label} className="relative z-10 flex h-[62px] w-[62px] -translate-y-5 items-center justify-center rounded-full bg-klutch-amber shadow-[0_7px_15px_rgba(133,79,11,0.22)] transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-klutch-teal" type="button" onClick={() => router.push(route)} aria-label={label}><span className="flex h-[50px] w-[50px] items-center justify-center rounded-full bg-klutch-teal text-klutch-teal-soft"><Icon size={29} strokeWidth={1.8} /></span></button>
			) : (
				<button key={label} className="flex min-w-12 flex-col items-center gap-1 text-[10px] font-medium text-klutch-amber-dark/75 transition hover:text-klutch-amber-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-klutch-teal" type="button" onClick={() => router.push(route)}><Icon size={19} strokeWidth={1.8} /><span>{label}</span></button>
			))}
		</nav>
	);
}

export default function NotificationsPage() {
	const router = useRouter();
	const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
	const [activeFilter, setActiveFilter] = useState<NotificationFilter>("all");
	const unreadCount = notifications.filter((notification) => notification.status === "unread").length;
	const filteredNotifications = useMemo(() => notifications.filter((notification) => activeFilter === "all" || (activeFilter === "unread" ? notification.status === "unread" : notification.type === activeFilter)), [activeFilter, notifications]);
	const todayNotifications = filteredNotifications.filter((notification) => notification.group === "today");
	const earlierNotifications = filteredNotifications.filter((notification) => notification.group === "earlier");

	const markAsRead = (id: string) => setNotifications((current) => current.map((notification) => notification.id === id ? { ...notification, status: "read" } : notification));
	const markAllAsRead = () => setNotifications((current) => current.map((notification) => ({ ...notification, status: "read" })));
	const handleAction = (notification: NotificationItem) => {
		markAsRead(notification.id);
		if (notification.actionRoute) router.push(notification.actionRoute);
	};

	return (
		<main className="min-h-screen bg-background pb-32">
			<div className="mx-auto w-full max-w-[390px] px-5 sm:max-w-2xl sm:px-8 lg:max-w-3xl">
				<NotificationHeader unreadCount={unreadCount} onMarkAll={markAllAsRead} />
				<section className="relative mt-5 overflow-hidden rounded-[1.7rem] bg-klutch-teal px-5 py-5 text-klutch-teal-soft shadow-[0_12px_28px_rgba(4,52,44,0.16)] sm:px-7" aria-live="polite">
					<div className="relative z-10"><p className="text-sm font-medium text-klutch-teal-accent">Seu resumo de hoje</p><h2 className="mt-1 font-display text-xl font-bold tracking-[-0.03em]">Você tem {unreadCount} nova{unreadCount === 1 ? "" : "s"} notificação{unreadCount === 1 ? "" : "ões"}</h2><p className="mt-1 max-w-sm text-xs leading-5 text-klutch-teal-soft/80">Fique por dentro das suas reservas, pagamentos e equipamentos.</p></div>
					<span className="absolute -right-8 -top-12 h-36 w-36 rounded-full border-[18px] border-white/5" /><span className="absolute -bottom-16 right-16 h-32 w-32 rounded-[2.5rem] bg-white/5" />
				</section>
				<section className="mt-7" aria-label="Filtros de notificações"><NotificationTabs activeFilter={activeFilter} onChange={setActiveFilter} /></section>
				<section className="mt-7 space-y-6">
					{filteredNotifications.length === 0 ? <NotificationEmptyState /> : <>
						{todayNotifications.length > 0 && <NotificationGroup title="Hoje" notifications={todayNotifications} onRead={markAsRead} onAction={handleAction} />}
						{earlierNotifications.length > 0 && <NotificationGroup title="Anteriormente" notifications={earlierNotifications} onRead={markAsRead} onAction={handleAction} />}
					</>}
				</section>
			</div>
			<BottomNavigation />
		</main>
	);
}

function NotificationGroup({ title, notifications, onRead, onAction }: { title: string; notifications: NotificationItem[]; onRead: (id: string) => void; onAction: (notification: NotificationItem) => void }) {
	return <div><div className="mb-3 flex items-center gap-3"><h2 className="font-display text-xs font-bold uppercase tracking-[0.15em] text-klutch-muted">{title}</h2><span className="h-px flex-1 bg-klutch-line/70" /></div><div className="space-y-3">{notifications.map((notification) => <NotificationCard key={notification.id} notification={notification} onRead={onRead} onAction={onAction} />)}</div></div>;
}
