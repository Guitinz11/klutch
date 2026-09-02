"use client";

import { useEffect, useState } from "react";
import {
	Bell,
	Check,
	ChevronDown,
	ChevronUp,
	CircleCheck,
	CreditCard,
	Heart,
	Home,
	LoaderCircle,
	Menu,
	Plus,
	QrCode,
	Tractor,
	Wallet,
	Wheat,
	X,
	Zap,
} from "lucide-react";

type PaymentStatus = "paid" | "pending" | "processing";
type PaymentMethod = "pix" | "credit_card" | "cooperative_balance";

type Payment = {
	id: string;
	equipmentName: string;
	equipmentType: string;
	date: string;
	amount: number;
	status: PaymentStatus;
	icon: "tractor" | "implement" | "truck";
};

type PaymentMethodOption = {
	id: PaymentMethod;
	name: string;
	description: string;
	icon: typeof QrCode;
};

const formatCurrency = (value: number) =>
	new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);

const initialPayment: Payment = {
	id: "payment-001",
	equipmentName: "Reserva de Trator 5075E",
	equipmentType: "Trator",
	date: "28 de Agosto",
	amount: 350,
	status: "pending",
	icon: "tractor",
};

const initialHistory: Payment[] = [
	{ id: "payment-002", equipmentName: "Trator John Deere 5075E", equipmentType: "Trator", date: "15 de Agosto", amount: 420, status: "paid", icon: "tractor" },
	{ id: "payment-003", equipmentName: "Implemento agrícola", equipmentType: "Implemento", date: "08 de Agosto", amount: 180, status: "paid", icon: "implement" },
	{ id: "payment-004", equipmentName: "Caminhonete S10", equipmentType: "Transporte", date: "02 de Agosto", amount: 250, status: "paid", icon: "truck" },
];

const paymentMethods: PaymentMethodOption[] = [
	{ id: "pix", name: "PIX", description: "Pagamento instantâneo", icon: QrCode },
	{ id: "credit_card", name: "Cartão", description: "Crédito ou débito", icon: CreditCard },
	{ id: "cooperative_balance", name: "Saldo cooperativo", description: "Utilizar saldo disponível", icon: Wallet },
];

const statusLabels: Record<PaymentStatus, string> = {
	paid: "Pago",
	pending: "Pendente",
	processing: "Processando",
};

function StatusBadge({ status }: { status: PaymentStatus }) {
	const styles: Record<PaymentStatus, string> = {
		paid: "bg-klutch-teal-soft text-klutch-teal",
		pending: "bg-[#FAEEDA] text-klutch-amber-dark",
		processing: "bg-[#D3D1C7] text-foreground",
	};

	return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${styles[status]}`}><span className={`h-1.5 w-1.5 rounded-full ${status === "paid" ? "bg-klutch-teal-accent" : status === "pending" ? "bg-klutch-amber" : "bg-klutch-muted"}`} />{statusLabels[status]}</span>;
}

function PaymentIcon({ type, active = false }: { type: Payment["icon"]; active?: boolean }) {
	const Icon = type === "implement" ? Wheat : type === "truck" ? Wallet : Tractor;
	return <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${active ? "bg-[#D8F1E7] text-klutch-teal" : "bg-[#F1FEE8] text-klutch-teal-light"}`}><Icon size={23} strokeWidth={1.8} /></span>;
}

function PaymentHeader() {
	return <header className="flex items-center gap-3 border-b border-[#D3D1C7]/60 px-5 py-4 sm:px-0"><button type="button" aria-label="Abrir menu" className="flex h-10 w-10 items-center justify-center rounded-full text-klutch-teal transition hover:bg-klutch-teal-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klutch-teal"><Menu size={23} /></button><div className="min-w-0 flex-1"><p className="font-display text-xl font-bold tracking-[-0.04em] text-klutch-teal">Pagamentos</p><p className="mt-0.5 truncate text-xs text-klutch-muted">Gerencie seus pagamentos e gastos.</p></div><button type="button" aria-label="Notificações" className="relative flex h-10 w-10 items-center justify-center rounded-full text-foreground transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klutch-teal"><Bell size={21} /><span className="absolute right-2 top-1.5 h-2 w-2 rounded-full bg-klutch-amber" /></button></header>;
}

function FinancialSummary({ total, completedPayments }: { total: number; completedPayments: number }) {
	return <section className="relative isolate overflow-hidden rounded-3xl bg-klutch-teal px-6 py-6 text-klutch-teal-soft shadow-[0_12px_28px_rgba(4,52,44,0.16)]"><div className="relative z-10"><div className="flex items-center justify-between"><p className="text-sm font-medium text-klutch-teal-accent">Resumo financeiro</p><CircleCheck size={20} className="text-klutch-teal-accent" /></div><p className="mt-5 font-display text-[2.15rem] font-bold tracking-[-0.06em]">{formatCurrency(total)}</p><p className="mt-1 text-xs text-klutch-teal-accent">Total gasto este mês</p><div className="mt-7 flex gap-7 border-t border-white/15 pt-4 text-xs"><span><strong className="block text-base text-white">{completedPayments}</strong>pagamentos realizados</span><span><strong className="block text-base text-white">5 dias</strong>próximo pagamento</span></div></div><div className="absolute -right-12 -top-14 h-44 w-44 rounded-full border-[22px] border-klutch-teal-light/40" /><div className="absolute -bottom-20 -left-12 h-40 w-40 rounded-full bg-klutch-teal-light/25" /><div className="absolute right-16 bottom-8 h-3 w-3 rounded-full bg-klutch-amber opacity-80" /></section>;
}

function UpcomingPayment({ payment, onPay, disabled }: { payment: Payment; onPay: () => void; disabled: boolean }) {
	return <section><div className="mb-3 flex items-center justify-between"><h2 className="font-display text-lg font-bold tracking-[-0.03em] text-foreground">Próximo pagamento</h2><span className="text-xs text-klutch-muted">Reserva ativa</span></div><article className="rounded-3xl bg-white p-4 shadow-[0_6px_20px_rgba(44,44,42,0.06)]"><div className="flex items-start gap-3"><PaymentIcon type="tractor" active /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-start justify-between gap-2"><div><h3 className="font-display text-sm font-bold text-foreground">{payment.equipmentName}</h3><p className="mt-1 text-xs text-klutch-muted">Uso realizado em {payment.date}</p></div><StatusBadge status={payment.status} /></div><div className="mt-5 flex items-end justify-between gap-3"><div><p className="text-[10px] uppercase tracking-[0.12em] text-klutch-muted">Valor total</p><p className="mt-1 font-display text-xl font-bold text-klutch-teal">{formatCurrency(payment.amount)}</p></div><button type="button" onClick={onPay} disabled={disabled} className="min-h-11 rounded-xl bg-klutch-amber px-4 text-xs font-bold text-foreground transition hover:bg-[#D98D1C] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klutch-amber-dark">{payment.status === "processing" ? <span className="flex items-center gap-2"><LoaderCircle size={15} className="animate-spin" />Processando...</span> : payment.status === "paid" ? <span className="flex items-center gap-2"><Check size={15} />Pagamento realizado</span> : "Pagar agora"}</button></div></div></div></article></section>;
}

function PaymentMethodSelector({ selected, onSelect }: { selected: PaymentMethod; onSelect: (method: PaymentMethod) => void }) {
	return <section><h2 className="mb-3 font-display text-lg font-bold tracking-[-0.03em] text-foreground">Forma de pagamento</h2><div className="grid grid-cols-3 gap-2">{paymentMethods.map(({ id, name, description, icon: Icon }) => { const isSelected = id === selected; return <button type="button" key={id} onClick={() => onSelect(id)} aria-pressed={isSelected} className={`min-h-[106px] rounded-2xl border px-2 py-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klutch-teal ${isSelected ? "border-klutch-teal bg-klutch-teal-soft" : "border-[#D3D1C7] bg-white hover:border-klutch-teal-accent"}`}><span className={`mb-3 flex h-8 w-8 items-center justify-center rounded-lg ${isSelected ? "bg-white text-klutch-teal" : "bg-[#F1FEE8] text-klutch-muted"}`}><Icon size={17} /></span><span className={`block text-xs font-bold ${isSelected ? "text-klutch-teal" : "text-foreground"}`}>{name}</span><span className="mt-1 block text-[10px] leading-3 text-klutch-muted">{description}</span></button>; })}</div></section>;
}

function PaymentBreakdown({ expanded, onToggle }: { expanded: boolean; onToggle: () => void }) {
	return <section className="rounded-2xl border border-[#D3D1C7] bg-white"><button type="button" onClick={onToggle} aria-expanded={expanded} className="flex min-h-14 w-full items-center justify-between px-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-klutch-teal"><span className="text-sm font-bold text-foreground">Como esse valor foi calculado?</span>{expanded ? <ChevronUp size={18} className="text-klutch-teal" /> : <ChevronDown size={18} className="text-klutch-teal" />}</button>{expanded && <div className="border-t border-[#D3D1C7]/70 px-4 pb-4 pt-3 text-xs"><div className="space-y-3 text-klutch-muted"><div className="flex justify-between"><span>Custo de utilização</span><span className="font-medium text-foreground">{formatCurrency(280)}</span></div><div className="flex justify-between"><span>Custos operacionais</span><span className="font-medium text-foreground">{formatCurrency(50)}</span></div><div className="flex justify-between"><span>Taxa da plataforma</span><span className="font-medium text-foreground">{formatCurrency(20)}</span></div></div><div className="mt-4 flex justify-between border-t border-[#D3D1C7] pt-3 text-sm font-bold text-klutch-teal"><span>TOTAL</span><span>{formatCurrency(350)}</span></div></div>}</section>;
}

function PaymentCard({ payment }: { payment: Payment }) {
	return <article className="flex items-center gap-3 border-b border-[#D3D1C7]/70 py-3.5 last:border-0"><PaymentIcon type={payment.icon} /><div className="min-w-0 flex-1"><h3 className="truncate text-sm font-semibold text-foreground">{payment.equipmentName}</h3><p className="mt-1 text-xs text-klutch-muted">{payment.date}</p></div><div className="flex shrink-0 flex-col items-end gap-1.5"><p className="text-sm font-bold text-foreground">{formatCurrency(payment.amount)}</p><StatusBadge status={payment.status} /></div></article>;
}

function PaymentHistory({ payments, onViewAll }: { payments: Payment[]; onViewAll: () => void }) {
	return <section><div className="mb-2 flex items-center justify-between"><h2 className="font-display text-lg font-bold tracking-[-0.03em] text-foreground">Histórico recente</h2><span className="text-xs text-klutch-muted">Agosto</span></div><div className="rounded-3xl bg-white px-4 shadow-[0_6px_20px_rgba(44,44,42,0.05)]">{payments.slice(0, 3).map((payment) => <PaymentCard key={payment.id} payment={payment} />)}<button type="button" onClick={onViewAll} className="w-full border-t border-[#D3D1C7]/70 py-4 text-xs font-bold text-klutch-teal transition hover:text-klutch-teal-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klutch-teal">Ver histórico completo</button></div></section>;
}

type HistoryFilter = "all" | PaymentStatus;

function FullHistory({ payments, onClose }: { payments: Payment[]; onClose: () => void }) {
	const [filter, setFilter] = useState<HistoryFilter>("all");
	const filteredPayments = filter === "all" ? payments : payments.filter((payment) => payment.status === filter);
	const paidTotal = payments.filter((payment) => payment.status === "paid").reduce((total, payment) => total + payment.amount, 0);

	return <div className="fixed inset-0 z-30 flex items-end justify-center bg-[#04342C]/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"><section role="dialog" aria-modal="true" aria-labelledby="full-history-title" className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-[2rem] bg-background px-5 pb-8 pt-5 shadow-2xl sm:rounded-[2rem] sm:px-7"><div className="mx-auto mb-4 h-1 w-10 rounded-full bg-klutch-line sm:hidden" /><header className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.14em] text-klutch-teal-light">Movimentações</p><h2 id="full-history-title" className="mt-1 font-display text-2xl font-bold tracking-[-0.05em] text-foreground">Histórico completo</h2><p className="mt-1 text-xs text-klutch-muted">Acompanhe cada pagamento das suas reservas.</p></div><button type="button" onClick={onClose} aria-label="Fechar histórico completo" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-klutch-teal transition hover:bg-klutch-teal-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klutch-teal"><X size={19} /></button></header><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-2xl bg-klutch-teal px-4 py-3 text-klutch-teal-soft"><p className="text-[10px] text-klutch-teal-accent">Total pago</p><p className="mt-1 font-display text-xl font-bold">{formatCurrency(paidTotal)}</p></div><div className="rounded-2xl bg-[#FAEEDA] px-4 py-3 text-klutch-amber-dark"><p className="text-[10px]">Pagamentos registrados</p><p className="mt-1 font-display text-xl font-bold">{payments.length}</p></div></div><div className="mt-6 flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Filtrar histórico">{(["all", "paid", "pending", "processing"] as HistoryFilter[]).map((option) => <button type="button" role="tab" aria-selected={filter === option} key={option} onClick={() => setFilter(option)} className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klutch-teal ${filter === option ? "bg-klutch-teal text-white" : "bg-white text-klutch-muted hover:bg-klutch-teal-soft"}`}>{option === "all" ? "Todos" : statusLabels[option]}</button>)}</div><div className="mt-3 rounded-3xl bg-white px-4 shadow-sm">{filteredPayments.length > 0 ? filteredPayments.map((payment) => <PaymentCard key={payment.id} payment={payment} />) : <div className="py-10 text-center text-sm text-klutch-muted">Nenhum pagamento neste status.</div>}</div></section></div>;
}

function BottomNavigation() {
	return <nav aria-label="Navegação principal" className="fixed inset-x-0 bottom-0 z-20 mx-auto flex h-[76px] max-w-[390px] items-center justify-around rounded-t-3xl bg-klutch-amber-soft px-3 pb-1 pt-2 shadow-[0_-8px_25px_rgba(44,44,42,0.12)] sm:bottom-5 sm:max-w-2xl sm:rounded-full"><button type="button" className="flex min-w-12 flex-col items-center gap-1 text-[10px] text-klutch-amber-dark/70"><Home size={19} /><span>Home</span></button><button type="button" className="flex min-w-12 flex-col items-center gap-1 text-[10px] text-klutch-amber-dark/70"><Zap size={19} /><span>Explorar</span></button><button type="button" aria-label="Criar nova reserva" className="relative flex h-14 w-14 -translate-y-5 items-center justify-center rounded-full bg-klutch-teal text-klutch-teal-soft shadow-[0_7px_15px_rgba(4,52,44,0.25)] transition hover:bg-klutch-teal-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-klutch-teal"><Plus size={28} /></button><button type="button" className="flex min-w-12 flex-col items-center gap-1 text-[10px] font-bold text-klutch-teal"><CreditCard size={19} /><span>Pagamentos</span></button><button type="button" className="flex min-w-12 flex-col items-center gap-1 text-[10px] text-klutch-amber-dark/70"><Heart size={19} /><span>Favoritos</span></button></nav>;
}

export default function PaymentsPage() {
	const [payment, setPayment] = useState(initialPayment);
	const [history, setHistory] = useState(initialHistory);
	const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("pix");
	const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
	const [isHistoryOpen, setIsHistoryOpen] = useState(false);
	const [monthlyTotal, setMonthlyTotal] = useState(1250);

	useEffect(() => {
		if (payment.status !== "processing") return;
		const timer = window.setTimeout(() => {
			setPayment((current) => ({ ...current, status: "paid" }));
			setHistory((current) => [{ ...initialPayment, status: "paid" }, ...current]);
			setMonthlyTotal((current) => current + initialPayment.amount);
		}, 2000);
		return () => window.clearTimeout(timer);
	}, [payment.status]);

	const handlePayment = () => {
		if (payment.status === "pending") setPayment((current) => ({ ...current, status: "processing" }));
	};

	return <main className="min-h-screen bg-background pb-28"><div className="mx-auto w-full max-w-[390px] sm:max-w-2xl sm:px-8 lg:max-w-3xl"><PaymentHeader /><div className="space-y-7 px-4 py-6 sm:px-0"><FinancialSummary total={monthlyTotal} completedPayments={payment.status === "paid" ? 4 : 3} /><UpcomingPayment payment={payment} onPay={handlePayment} disabled={payment.status !== "pending"} /><PaymentMethodSelector selected={selectedMethod} onSelect={setSelectedMethod} /><PaymentBreakdown expanded={isBreakdownOpen} onToggle={() => setIsBreakdownOpen((current) => !current)} /><PaymentHistory payments={history} onViewAll={() => setIsHistoryOpen(true)} /></div></div><BottomNavigation />{isHistoryOpen && <FullHistory payments={history} onClose={() => setIsHistoryOpen(false)} />}</main>;
}
