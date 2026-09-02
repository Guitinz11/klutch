"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
	Award,
	Bell,
	Building2,
	Calendar,
	CalendarDays,
	CheckCircle,
	ChevronRight,
	Clock,
	Compass,
	Heart,
	Home,
	LogOut,
	Mail,
	MapPin,
	Menu,
	Pencil,
	Phone,
	Plus,
	Save,
	Settings,
	ShieldCheck,
	Star,
	Tractor,
	User,
	X,
} from "lucide-react";

interface UserProfile {
	id: string;
	name: string;
	email: string;
	phone: string;
	location: string;
	cooperative: string;
	memberSince: string;
	avatar?: string;
	bio?: string;
}

interface ProfileStats {
	completedRentals: number;
	activeRentals: number;
	listedEquipment: number;
	averageRating: number;
}

interface ProfileMenuItem {
	id: string;
	label: string;
	description: string;
	icon: typeof Tractor;
	route?: string;
}

const initialProfile: UserProfile = {
	id: "user-001",
	name: "João Carlos da Silva",
	email: "joao.silva@email.com",
	phone: "(14) 99999-9999",
	location: "Marília, São Paulo",
	cooperative: "Cooperativa Rural Centro-Oeste",
	memberSince: "Agosto de 2025",
	bio: "Produtor rural e cooperado. Utilizo o Klutch para encontrar equipamentos e otimizar a produção da minha propriedade.",
};

const profileStats: ProfileStats = { completedRentals: 12, activeRentals: 2, listedEquipment: 3, averageRating: 4.8 };

const menuItems: ProfileMenuItem[] = [
	{ id: "listings", label: "Meus anúncios", description: "Gerencie seus equipamentos anunciados.", icon: Tractor, route: "/MeusAnuncios" },
	{ id: "rentals", label: "Meus aluguéis", description: "Acompanhe suas reservas e utilizações.", icon: Calendar, route: "/MeusAlugueis" },
	{ id: "reviews", label: "Minhas avaliações", description: "Veja suas avaliações realizadas.", icon: Star, route: "/Review" },
	{ id: "favorites", label: "Favoritos", description: "Seus equipamentos favoritos.", icon: Heart, route: "/home" },
	{ id: "notifications", label: "Notificações", description: "Gerencie seus alertas.", icon: Bell, route: "/Notificacoes" },
];

function ProfileHeader({ onNotifications }: { onNotifications: () => void }) {
	return (
		<header className="flex items-center gap-3 border-b border-klutch-line/60 px-5 py-4 sm:px-0">
			<button type="button" aria-label="Abrir menu" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-klutch-teal transition hover:bg-klutch-teal-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-klutch-teal"><Menu size={23} /></button>
			<div className="min-w-0 flex-1"><h1 className="font-display text-xl font-bold tracking-[-0.04em] text-klutch-teal">Meu Perfil</h1><p className="mt-0.5 truncate text-xs text-klutch-muted">Gerencie suas informações.</p></div>
			<button type="button" aria-label="Abrir notificações" onClick={onNotifications} className="relative flex h-10 w-10 items-center justify-center rounded-full text-foreground transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-klutch-teal"><Bell size={21} /><span className="absolute right-2 top-1.5 h-2 w-2 rounded-full bg-klutch-amber" /></button>
		</header>
	);
}

function ProfileHero({ profile, onEdit }: { profile: UserProfile; onEdit: () => void }) {
	const initials = profile.name.split(" ").map((name) => name[0]).slice(0, 2).join("");
	return (
		<section className="relative isolate overflow-hidden rounded-[1.7rem] bg-klutch-teal px-5 py-6 text-white shadow-[0_12px_28px_rgba(4,52,44,0.16)] sm:px-7">
			<div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex items-center gap-4"><div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-klutch-teal-accent bg-klutch-teal-light font-display text-2xl font-bold text-white">{profile.avatar ? <img src={profile.avatar} alt="" className="h-full w-full object-cover" /> : initials}</div><div className="min-w-0"><h2 className="font-display text-xl font-bold tracking-[-0.04em]">{profile.name}</h2><span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-klutch-teal-soft"><CheckCircle size={13} /> Cooperado Klutch</span><p className="mt-2 flex items-center gap-1.5 text-xs text-klutch-teal-soft/85"><Building2 size={14} />{profile.cooperative}</p></div></div>
				<button type="button" onClick={onEdit} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-xs font-bold text-klutch-teal transition hover:bg-klutch-teal-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"><Pencil size={15} />Editar perfil</button>
			</div>
			<div className="absolute -right-10 -top-14 h-40 w-40 rounded-full border-[18px] border-klutch-teal-light/45" /><div className="absolute -bottom-16 left-1/2 h-32 w-32 rounded-[2.5rem] bg-white/5" />
		</section>
	);
}

function ProfileStats({ stats }: { stats: ProfileStats }) {
	const items = [{ label: "Aluguéis concluídos", value: stats.completedRentals, icon: Calendar }, { label: "Aluguéis ativos", value: stats.activeRentals, icon: Clock }, { label: "Equipamentos anunciados", value: stats.listedEquipment, icon: Tractor }, { label: "Avaliação média", value: stats.averageRating.toFixed(1).replace(".", ","), icon: Star }];
	return <section><h2 className="mb-3 font-display text-lg font-bold tracking-[-0.03em] text-foreground">Seu resumo</h2><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{items.map(({ label, value, icon: Icon }) => <article key={label} className="rounded-2xl bg-white p-4 shadow-[0_6px_20px_rgba(44,44,42,0.05)] transition hover:-translate-y-0.5 hover:shadow-md"><Icon size={19} className={label === "Avaliação média" ? "text-klutch-amber" : "text-klutch-teal-light"} fill={label === "Avaliação média" ? "currentColor" : "none"} /><strong className="mt-3 block font-display text-2xl font-bold text-foreground">{value}</strong><p className="mt-1 text-[11px] leading-4 text-klutch-muted">{label}</p></article>)}</div></section>;
}

function ProfileInformation({ profile, onEdit }: { profile: UserProfile; onEdit: () => void }) {
	const fields = [{ label: "Nome completo", value: profile.name, icon: User }, { label: "E-mail", value: profile.email, icon: Mail }, { label: "Telefone", value: profile.phone, icon: Phone }, { label: "Localização", value: profile.location, icon: MapPin }, { label: "Membro desde", value: profile.memberSince, icon: Calendar }];
	return <section className="rounded-3xl bg-white p-5 shadow-[0_6px_20px_rgba(44,44,42,0.05)] sm:p-6"><div className="flex items-center justify-between gap-3"><h2 className="font-display text-lg font-bold tracking-[-0.03em]">Informações pessoais</h2><button type="button" onClick={onEdit} className="inline-flex min-h-9 items-center gap-1 text-xs font-bold text-klutch-teal-light transition hover:text-klutch-teal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-klutch-teal"><Pencil size={14} />Editar</button></div><dl className="mt-5 grid gap-4 sm:grid-cols-2">{fields.map(({ label, value, icon: Icon }) => <div className="flex min-w-0 items-start gap-3" key={label}><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-klutch-teal-soft text-klutch-teal"><Icon size={16} /></span><div className="min-w-0"><dt className="text-[11px] text-klutch-muted">{label}</dt><dd className="mt-0.5 truncate text-sm font-semibold text-foreground">{value}</dd></div></div>)}</dl>{profile.bio && <p className="mt-5 border-t border-klutch-line/60 pt-4 text-xs leading-5 text-klutch-muted">{profile.bio}</p>}</section>;
}

function CooperativeCard({ cooperative, onView }: { cooperative: string; onView: () => void }) {
	return <section className="rounded-3xl bg-klutch-teal-soft p-5 shadow-[0_6px_20px_rgba(44,44,42,0.04)]"><div className="flex gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-klutch-teal"><Building2 size={24} /></span><div><h2 className="font-display text-lg font-bold text-klutch-teal">Sua cooperativa</h2><p className="mt-1 text-sm font-semibold text-klutch-teal">{cooperative}</p><p className="mt-2 text-xs leading-5 text-klutch-teal/75">Você faz parte de uma comunidade que compartilha recursos para tornar a produção rural mais eficiente.</p></div></div><button type="button" onClick={onView} className="mt-4 inline-flex min-h-10 items-center gap-1 text-xs font-bold text-klutch-teal transition hover:gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-klutch-teal">Ver cooperativa <ChevronRight size={15} /></button></section>;
}

function ProfileMenu({ onNavigate, onSettings }: { onNavigate: (route: string) => void; onSettings: () => void }) {
	return <section><h2 className="mb-3 font-display text-lg font-bold tracking-[-0.03em]">Gerenciar conta</h2><div className="divide-y divide-klutch-line/60 overflow-hidden rounded-3xl bg-white shadow-[0_6px_20px_rgba(44,44,42,0.05)]">{[...menuItems, { id: "settings", label: "Configurações", description: "Preferências e segurança da conta.", icon: Settings }].map(({ id, label, description, icon: Icon, route }) => <button type="button" key={id} onClick={() => route ? onNavigate(route) : onSettings()} className="flex min-h-[76px] w-full items-center gap-3 px-4 text-left transition hover:bg-klutch-teal-soft/60 focus-visible:bg-klutch-teal-soft focus-visible:outline-none"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-klutch-teal-soft text-klutch-teal"><Icon size={19} /></span><span className="min-w-0 flex-1"><strong className="block text-sm font-bold text-foreground">{label}</strong><span className="mt-1 block truncate text-xs text-klutch-muted">{description}</span></span><ChevronRight size={18} className="shrink-0 text-klutch-muted" /></button>)}</div></section>;
}

function ModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
	return <div className="fixed inset-0 z-40 flex items-end justify-center bg-klutch-teal/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-6"><section role="dialog" aria-modal="true" aria-labelledby="profile-modal-title" className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] bg-background px-5 pb-7 pt-5 shadow-2xl sm:rounded-[2rem] sm:px-7"><header className="flex items-start justify-between gap-4"><h2 id="profile-modal-title" className="font-display text-xl font-bold text-foreground">{title}</h2><button type="button" onClick={onClose} aria-label="Fechar" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-klutch-teal transition hover:bg-klutch-teal-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-klutch-teal"><X size={18} /></button></header>{children}</section></div>;
}

function EditProfileModal({ profile, onClose, onSave }: { profile: UserProfile; onClose: () => void; onSave: (profile: UserProfile) => void }) {
	const [formData, setFormData] = useState<UserProfile>(profile);
	const updateField = (field: keyof UserProfile, value: string) => setFormData((current) => ({ ...current, [field]: value }));
	return <ModalShell title="Editar perfil" onClose={onClose}><form className="mt-5 space-y-4" onSubmit={(event) => { event.preventDefault(); onSave(formData); }}><div className="grid gap-4 sm:grid-cols-2">{([{ key: "name", label: "Nome", type: "text", placeholder: "Seu nome completo" }, { key: "email", label: "E-mail", type: "email", placeholder: "seu@email.com" }, { key: "phone", label: "Telefone", type: "tel", placeholder: "(00) 00000-0000" }, { key: "location", label: "Localização", type: "text", placeholder: "Cidade, estado" }] as const).map(({ key, label, type, placeholder }) => <label className="block" key={key}><span className="mb-1.5 block text-xs font-semibold text-foreground">{label}</span><input required type={type} value={formData[key]} onChange={(event) => updateField(key, event.target.value)} placeholder={placeholder} className="min-h-11 w-full rounded-xl border border-klutch-line bg-white px-3 text-sm outline-none transition focus:border-klutch-teal-light focus:ring-2 focus:ring-klutch-teal-accent/30" /></label>)}</div><label className="block"><span className="mb-1.5 block text-xs font-semibold text-foreground">Bio</span><textarea maxLength={300} value={formData.bio ?? ""} onChange={(event) => updateField("bio", event.target.value)} placeholder="Conte um pouco sobre você" rows={4} className="w-full resize-none rounded-xl border border-klutch-line bg-white px-3 py-3 text-sm outline-none transition focus:border-klutch-teal-light focus:ring-2 focus:ring-klutch-teal-accent/30" /><span className="mt-1 block text-right text-[11px] text-klutch-muted">{(formData.bio ?? "").length}/300</span></label><div className="flex gap-3 pt-2"><button type="button" onClick={onClose} className="min-h-11 flex-1 rounded-xl border border-klutch-line bg-white px-4 text-xs font-bold text-klutch-muted transition hover:bg-[#ebeae3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-klutch-teal">Cancelar</button><button type="submit" className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-klutch-teal px-4 text-xs font-bold text-white transition hover:bg-klutch-teal-light focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-klutch-teal"><Save size={16} />Salvar alterações</button></div></form></ModalShell>;
}

function SettingsModal({ notificationsEnabled, onToggle, onClose }: { notificationsEnabled: boolean; onToggle: () => void; onClose: () => void }) {
	return <ModalShell title="Configurações" onClose={onClose}><div className="mt-5 space-y-3"><button type="button" onClick={onToggle} className="flex min-h-16 w-full items-center gap-3 rounded-2xl bg-white px-4 text-left transition hover:bg-klutch-teal-soft/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-klutch-teal"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-klutch-teal-soft text-klutch-teal"><Bell size={19} /></span><span className="flex-1"><strong className="block text-sm">Notificações</strong><span className="text-xs text-klutch-muted">Receba novidades sobre reservas e equipamentos.</span></span><span aria-hidden="true" className={`relative h-6 w-11 rounded-full transition ${notificationsEnabled ? "bg-klutch-teal" : "bg-klutch-line"}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${notificationsEnabled ? "left-6" : "left-1"}`} /></span></button><button type="button" className="flex min-h-16 w-full items-center gap-3 rounded-2xl bg-white px-4 text-left transition hover:bg-klutch-teal-soft/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-klutch-teal"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-klutch-teal-soft text-klutch-teal"><ShieldCheck size={19} /></span><span className="flex-1"><strong className="block text-sm">Gerenciar privacidade</strong><span className="text-xs text-klutch-muted">Controle como seus dados são compartilhados.</span></span><ChevronRight size={18} className="text-klutch-muted" /></button><button type="button" className="flex min-h-16 w-full items-center gap-3 rounded-2xl bg-white px-4 text-left transition hover:bg-klutch-teal-soft/60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-klutch-teal"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-klutch-teal-soft text-klutch-teal"><Award size={19} /></span><span className="flex-1"><strong className="block text-sm">Segurança da conta</strong><span className="text-xs text-klutch-muted">Mantenha seus dados protegidos.</span></span><ChevronRight size={18} className="text-klutch-muted" /></button></div></ModalShell>;
}

function LogoutModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
	return <ModalShell title="Sair da conta?" onClose={onClose}><p className="mt-3 text-sm leading-6 text-klutch-muted">Você precisará entrar novamente para acessar sua conta.</p><div className="mt-6 flex gap-3"><button type="button" onClick={onClose} className="min-h-11 flex-1 rounded-xl border border-klutch-line bg-white px-4 text-xs font-bold text-klutch-muted transition hover:bg-[#ebeae3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-klutch-teal">Cancelar</button><button type="button" onClick={onConfirm} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#a33d35] px-4 text-xs font-bold text-white transition hover:bg-[#89322c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a33d35]"><LogOut size={16} />Sair</button></div></ModalShell>;
}

function BottomNavigation() {
	const router = useRouter();
	const items = [{ label: "Início", icon: Home, route: "/home" }, { label: "Explorar", icon: Compass, route: "/home" }, { label: "Nova reserva", icon: Plus, route: "/home", central: true }, { label: "Meus aluguéis", icon: CalendarDays, route: "/MeusAlugueis" }, { label: "Favoritos", icon: Heart, route: "/home" }];
	return <nav aria-label="Navegação principal" className="fixed inset-x-0 bottom-0 z-20 mx-auto flex h-[78px] max-w-[390px] items-center justify-around rounded-t-[1.6rem] bg-klutch-amber-soft px-2 pb-1 pt-3 shadow-[0_-8px_25px_rgba(44,44,42,0.12)] sm:bottom-5 sm:h-[74px] sm:max-w-6xl sm:rounded-full sm:px-8">{items.map(({ label, icon: Icon, route, central }) => central ? <button key={label} type="button" aria-label={label} onClick={() => router.push(route)} className="relative flex h-[62px] w-[62px] -translate-y-5 items-center justify-center rounded-full bg-klutch-amber text-klutch-teal shadow-[0_7px_15px_rgba(133,79,11,0.22)] transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-klutch-teal"><Icon size={29} /></button> : <button key={label} type="button" onClick={() => router.push(route)} className={`flex min-w-12 flex-col items-center gap-1 text-[10px] transition hover:text-klutch-amber-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-klutch-teal ${label === "Favoritos" ? "font-bold text-klutch-teal" : "text-klutch-amber-dark/75"}`}><Icon size={19} fill={label === "Favoritos" ? "currentColor" : "none"} /><span>{label}</span></button>)}</nav>;
}

export default function ProfilePage() {
	const router = useRouter();
	const [profile, setProfile] = useState<UserProfile>(initialProfile);
	const [editing, setEditing] = useState(false);
	const [settingsOpen, setSettingsOpen] = useState(false);
	const [logoutOpen, setLogoutOpen] = useState(false);
	const [notificationsEnabled, setNotificationsEnabled] = useState(true);
	const [feedback, setFeedback] = useState("");

	const showFeedback = (message: string) => { setFeedback(message); window.setTimeout(() => setFeedback(""), 3000); };
	const saveProfile = (updatedProfile: UserProfile) => { setProfile(updatedProfile); setEditing(false); showFeedback("Perfil atualizado com sucesso!"); };
	const confirmLogout = () => { setLogoutOpen(false); showFeedback("Você saiu da sua conta."); };

	return <main className="min-h-screen bg-background pb-32"><div className="mx-auto w-full max-w-[390px] sm:max-w-2xl sm:px-8 lg:max-w-3xl"><ProfileHeader onNotifications={() => router.push("/Notificacoes")} /><div className="space-y-7 px-4 py-5 sm:px-0"><ProfileHero profile={profile} onEdit={() => setEditing(true)} /><ProfileStats stats={profileStats} /><ProfileInformation profile={profile} onEdit={() => setEditing(true)} /><CooperativeCard cooperative={profile.cooperative} onView={() => showFeedback("Área da cooperativa em breve.")} /><ProfileMenu onNavigate={(route) => router.push(route)} onSettings={() => setSettingsOpen(true)} /><button type="button" onClick={() => setLogoutOpen(true)} className="inline-flex min-h-11 items-center gap-2 rounded-xl px-2 text-xs font-bold text-[#a33d35] transition hover:bg-[#f8e5e2] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a33d35]"><LogOut size={17} />Sair da conta</button></div></div>{feedback && <div role="status" className="fixed left-1/2 top-5 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl bg-klutch-teal px-4 py-3 text-center text-sm font-semibold text-white shadow-lg">{feedback}</div>}<BottomNavigation />{editing && <EditProfileModal profile={profile} onClose={() => setEditing(false)} onSave={saveProfile} />}{settingsOpen && <SettingsModal notificationsEnabled={notificationsEnabled} onToggle={() => { setNotificationsEnabled((current) => !current); showFeedback(`Notificações ${notificationsEnabled ? "desativadas" : "ativadas"}.`); }} onClose={() => setSettingsOpen(false)} />}{logoutOpen && <LogoutModal onClose={() => setLogoutOpen(false)} onConfirm={confirmLogout} />}</main>;
}
