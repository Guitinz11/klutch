"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { ChevronDown, LifeBuoy, MessageCircle, Phone, Search, X } from "lucide-react";

type CategoriaFaq = "aluguel" | "anuncios" | "conta" | "seguros";

type FaqItem = {
  id: string;
  pergunta: string;
  resposta: string;
  categoria: CategoriaFaq;
};

type TicketForm = {
  assunto: string;
  mensagem: string;
};

const categorias: Array<{ id: "todas" | CategoriaFaq; label: string }> = [
  { id: "todas", label: "Todas" },
  { id: "aluguel", label: "Para quem aluga" },
  { id: "anuncios", label: "Para quem anuncia" },
  { id: "conta", label: "Conta e Pagamentos" },
  { id: "seguros", label: "Seguros" },
];

const faqData: FaqItem[] = [
  {
    id: "seguro-aluguel",
    pergunta: "Como funciona o seguro durante o aluguel?",
    resposta:
      "O seguro é cobrado conforme o valor da máquina e a cobertura do contrato. Durante o período de locação, o Klutch oferece proteção contra danos por uso comum e você recebe orientações de como acionar a assistência em caso de sinistro.",
    categoria: "aluguel",
  },
  {
    id: "cancelar-reserva",
    pergunta: "Posso cancelar uma reserva?",
    resposta:
      "Sim. O cancelamento depende do momento em que a solicitação é feita e das regras do anúncio. Se a reserva ainda não foi confirmada pelo locador, o estorno pode ser integral. Já após a confirmação, a política do anúncio e do canal de pagamento será aplicada.",
    categoria: "aluguel",
  },
  {
    id: "transporte-maquina",
    pergunta: "Como é feito o transporte da máquina?",
    resposta:
      "O transporte pode ser organizado pelo próprio locatário ou por um parceiro da plataforma, conforme a opção selecionada no anúncio. Antes da retirada, o locador e o locatário validam a condição da máquina e o canal de entrega.",
    categoria: "aluguel",
  },
  {
    id: "receber-pagamento",
    pergunta: "Como recebo meu pagamento?",
    resposta:
      "Os pagamentos são liberados para a conta vinculada no seu perfil após a confirmação de entrega e o fechamento do período de locação. O valor é repassado ao cooperado com base no contrato e no status da máquina informado no app.",
    categoria: "anuncios",
  },
  {
    id: "maquina-danificada",
    pergunta: "O que fazer se a máquina voltar danificada?",
    resposta:
      "Você deve registrar a ocorrência no chat do anúncio com fotos e descrição do problema. O sistema orienta os passos para vistoria, envio de documentação e acionamento do suporte em caso de sinistro ou devolução com avaria.",
    categoria: "anuncios",
  },
  {
    id: "editar-anuncio",
    pergunta: "Como editar meu anúncio?",
    resposta:
      "Acesse o painel do seu anúncio e selecione a opção Editar. Você pode alterar fotos, descrição, preço e disponibilidade, desde que a máquina ainda esteja dentro das regras de publicação e sem reservas ativas em andamento.",
    categoria: "anuncios",
  },
  {
    id: "ser-cooperado",
    pergunta: "Preciso ser cooperado para alugar?",
    resposta:
      "Não necessariamente para todas as experiências. A plataforma valida o perfil e o vínculo com o Sicredi conforme o tipo de operação. Em alguns casos, a conta do cooperado é usada para facilitar a identificação e a liberação do contrato.",
    categoria: "conta",
  },
  {
    id: "vincular-conta",
    pergunta: "Como vincular minha conta corrente?",
    resposta:
      "Entre em Configurações > Dados bancários e informe a conta da sua cooperativa ou instituição financeira de preferência. É necessário confirmar a titularidade e revisar os dados antes de receber ou pagar operações na plataforma.",
    categoria: "conta",
  },
  {
    id: "cobertura-seguro",
    pergunta: "Quais máquinas estão cobertas pelo seguro?",
    resposta:
      "A cobertura varia conforme a categoria, o valor do aluguel e as condições do contrato. Máquinas com avarias pré-existentes ou uso incompatível com a operação podem ter a cobertura condicionada ou negada após a análise do suporte.",
    categoria: "seguros",
  },
];

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

function FaqSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="rounded-[1.75rem] border border-[#D3D1C7] bg-[#E1F5EE] p-4 shadow-[0_10px_30px_rgba(4,52,44,0.04)] sm:p-5">
      <label className="flex items-center gap-3 rounded-full border border-[#D3D1C7] bg-white px-4 py-3 shadow-sm focus-within:border-[#0F6E56] focus-within:ring-2 focus-within:ring-[#5DCAA5]/20">
        <Search className="h-5 w-5 text-[#0F6E56]" aria-hidden="true" />
        <input
          aria-label="Buscar dúvidas"
          className="w-full bg-transparent text-sm text-[#2C2C2A] placeholder:text-[#5F5E5A] focus:outline-none"
          placeholder="Busque por dúvidas."
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </label>
    </div>
  );
}

function CategoryTabs({
  activeCategory,
  onChange,
  hidden,
}: {
  activeCategory: "todas" | CategoriaFaq;
  onChange: (category: "todas" | CategoriaFaq) => void;
  hidden: boolean;
}) {
  if (hidden) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categorias.map((category) => {
        const isActive = activeCategory === category.id;

        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onChange(category.id)}
            className={[
              "rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
              isActive
                ? "border-[#0F6E56] bg-[#E1F5EE] text-[#0F6E56] shadow-sm"
                : "border-[#D3D1C7] bg-white text-[#5F5E5A] hover:border-[#0F6E56] hover:text-[#0F6E56]",
            ].join(" ")}
            aria-pressed={isActive}
          >
            {category.label}
          </button>
        );
      })}
    </div>
  );
}

function FaqAccordion({
  items,
  openItem,
  onToggle,
}: {
  items: FaqItem[];
  openItem: string | null;
  onToggle: (id: string) => void;
}) {
  return (
    <div className="space-y-3">
      {items.map((item) => {
        const isOpen = openItem === item.id;

        return (
          <div
            key={item.id}
            className="overflow-hidden rounded-[1.25rem] border border-[#D3D1C7] bg-white"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left sm:px-5"
              onClick={() => onToggle(item.id)}
              aria-expanded={isOpen}
              aria-controls={`faq-panel-${item.id}`}
            >
              <span className="pr-4 text-sm font-semibold text-[#2C2C2A] sm:text-base">
                {item.pergunta}
              </span>
              <span
                className={[
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D3D1C7] bg-[#F1EFE8] text-[#0F6E56] transition-transform duration-200",
                  isOpen ? "rotate-180" : "rotate-0",
                ].join(" ")}
              >
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </span>
            </button>

            {isOpen && (
              <div id={`faq-panel-${item.id}`} className="border-t border-[#D3D1C7] bg-[#F1EFE8] px-4 py-4 sm:px-5">
                <p className="text-sm leading-6 text-[#5F5E5A]">{item.resposta}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ContactCards({
  onOpenTicket,
}: {
  onOpenTicket: () => void;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <a
        href="https://wa.me/5511999999999"
        target="_blank"
        rel="noreferrer"
        className="group rounded-[1.5rem] border border-[#D3D1C7] bg-white p-4 text-left transition-colors hover:border-[#0F6E56]"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#E1F5EE] text-[#0F6E56]">
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
        </div>
        <h3 className="text-base font-bold text-[#2C2C2A]">WhatsApp</h3>
        <p className="mt-1 text-sm text-[#5F5E5A]">Atendimento rápido</p>
      </a>

      <a
        href="tel:+5511300000000"
        className="group rounded-[1.5rem] border border-[#D3D1C7] bg-white p-4 text-left transition-colors hover:border-[#0F6E56]"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#E1F5EE] text-[#0F6E56]">
          <Phone className="h-5 w-5" aria-hidden="true" />
        </div>
        <h3 className="text-base font-bold text-[#2C2C2A]">Falar com o Gerente Sicredi</h3>
        <p className="mt-1 text-sm text-[#5F5E5A]">Suporte personalizado</p>
      </a>

      <button
        type="button"
        onClick={onOpenTicket}
        className="group rounded-[1.5rem] border border-[#D3D1C7] bg-[#FAEEDA] p-4 text-left transition-colors hover:border-[#0F6E56]"
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FAC775] text-[#854F0B]">
          <LifeBuoy className="h-5 w-5" aria-hidden="true" />
        </div>
        <h3 className="text-base font-bold text-[#2C2C2A]">Abrir um Chamado</h3>
        <p className="mt-1 text-sm text-[#5F5E5A]">Envie sua mensagem</p>
      </button>
    </div>
  );
}

function TicketModal({
  open,
  form,
  onChange,
  onSubmit,
  onClose,
}: {
  open: boolean;
  form: TicketForm;
  onChange: (field: keyof TicketForm, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#2C2C2A]/45 p-4 sm:items-center">
      <div className="w-full max-w-lg rounded-[1.75rem] border border-[#D3D1C7] bg-[#F1EFE8] p-5 shadow-[0_22px_50px_rgba(44,44,42,0.18)]">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#5F5E5A]">
              Atendimento Klutch
            </p>
            <h3 className="mt-1 text-xl font-bold text-[#2C2C2A]">Abrir chamado</h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar modal"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#D3D1C7] bg-white text-[#5F5E5A] transition-colors hover:border-[#0F6E56] hover:text-[#0F6E56]"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label htmlFor="ticket-assunto" className="mb-2 block text-sm font-medium text-[#2C2C2A]">
              Assunto
            </label>
            <select
              id="ticket-assunto"
              value={form.assunto}
              onChange={(event) => onChange("assunto", event.target.value)}
              className="w-full rounded-xl border border-[#D3D1C7] bg-white px-3 py-3 text-sm text-[#2C2C2A] outline-none transition-colors focus:border-[#0F6E56] focus:ring-2 focus:ring-[#5DCAA5]/20"
            >
              <option value="">Selecione</option>
              <option value="problema-na-maquina">Problema na máquina</option>
              <option value="pagamento">Pagamento</option>
              <option value="anuncio">Anúncio</option>
              <option value="conta">Conta e acesso</option>
              <option value="seguro">Seguro</option>
            </select>
          </div>

          <div>
            <label htmlFor="ticket-mensagem" className="mb-2 block text-sm font-medium text-[#2C2C2A]">
              Mensagem
            </label>
            <textarea
              id="ticket-mensagem"
              value={form.mensagem}
              onChange={(event) => onChange("mensagem", event.target.value)}
              rows={5}
              placeholder="Descreva o que aconteceu e o que você precisa de ajuda."
              className="w-full rounded-xl border border-[#D3D1C7] bg-white px-3 py-3 text-sm text-[#2C2C2A] placeholder:text-[#5F5E5A] outline-none transition-colors focus:border-[#0F6E56] focus:ring-2 focus:ring-[#5DCAA5]/20"
            />
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#0F6E56] bg-white px-5 py-2.5 text-sm font-semibold text-[#0F6E56] transition-colors hover:bg-[#E1F5EE]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!form.assunto || !form.mensagem.trim()}
              className="rounded-full bg-[#EF9F27] px-5 py-2.5 text-sm font-semibold text-[#854F0B] transition-colors hover:bg-[#FAC775] disabled:cursor-not-allowed disabled:bg-[#FAC775]/70 disabled:text-[#854F0B]/70"
            >
              Enviar mensagem
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function SupportPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<"todas" | CategoriaFaq>("todas");
  const [openItem, setOpenItem] = useState<string | null>(faqData[0]?.id ?? null);
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketForm, setTicketForm] = useState<TicketForm>({ assunto: "", mensagem: "" });

  const hasSearch = search.trim().length > 0;

  const filteredFaqs = useMemo(() => {
    const normalizedSearch = normalizeText(search);

    return faqData.filter((item) => {
      const matchesCategory = activeCategory === "todas" || item.categoria === activeCategory;
      const matchesSearch =
        normalizedSearch.length === 0 ||
        normalizeText(`${item.pergunta} ${item.resposta}`).includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  useEffect(() => {
    if (!hasSearch && filteredFaqs.length > 0 && !filteredFaqs.some((item) => item.id === openItem)) {
      setOpenItem(filteredFaqs[0].id);
    }
  }, [filteredFaqs, openItem, hasSearch]);

  const handleToggle = (id: string) => {
    setOpenItem((current) => (current === id ? null : id));
  };

  const handleTicketChange = (field: keyof TicketForm, value: string) => {
    setTicketForm((current) => ({ ...current, [field]: value }));
  };

  const handleTicketSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsTicketModalOpen(false);
    setTicketForm({ assunto: "", mensagem: "" });
  };

  return (
    <main className="min-h-screen bg-[#F1EFE8] text-[#2C2C2A]">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-[#D3D1C7] bg-white p-4 shadow-[0_14px_35px_rgba(4,52,44,0.04)] sm:p-6 lg:p-8">
          <div className="mb-6">
            <p className="text-sm font-medium uppercase tracking-[0.12em] text-[#0F6E56]">
              Klutch Support
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-[-0.04em] text-[#04342C] sm:text-4xl">
              Como podemos te ajudar hoje?
            </h1>
          </div>

          <FaqSearch value={search} onChange={setSearch} />

          {!hasSearch && (
            <div className="mt-6">
              <CategoryTabs
                activeCategory={activeCategory}
                onChange={setActiveCategory}
                hidden={false}
              />
            </div>
          )}

          {hasSearch && (
            <div className="mt-4 rounded-full border border-[#D3D1C7] bg-[#E1F5EE] px-4 py-2 text-sm text-[#0F6E56]">
              Resultados para: <span className="font-semibold">“{search}”</span>
            </div>
          )}

          <div className="mt-8">
            {filteredFaqs.length > 0 ? (
              <FaqAccordion items={filteredFaqs} openItem={openItem} onToggle={handleToggle} />
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-[#D3D1C7] bg-[#F1EFE8] p-8 text-center">
                <p className="text-lg font-semibold text-[#2C2C2A]">Nenhuma dúvida encontrada</p>
                <p className="mt-2 text-sm text-[#5F5E5A]">
                  Tente outra palavra-chave ou abra um chamado com o atendimento.
                </p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-2xl font-bold tracking-[-0.04em] text-[#04342C]">
              Ainda precisa de ajuda?
            </h2>
          </div>
          <ContactCards onOpenTicket={() => setIsTicketModalOpen(true)} />
        </section>
      </div>

      <TicketModal
        open={isTicketModalOpen}
        form={ticketForm}
        onChange={handleTicketChange}
        onSubmit={handleTicketSubmit}
        onClose={() => setIsTicketModalOpen(false)}
      />
    </main>
  );
}
