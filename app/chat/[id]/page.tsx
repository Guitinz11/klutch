"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCheck,
  EllipsisVertical,
  Paperclip,
  SendHorizontal,
  ShieldCheck,
} from "lucide-react";

interface Mensagem {
  id: string;
  autor: "usuario" | "vendedor";
  texto: string;
  horario: string;
  status?: "enviado" | "entregue" | "lido";
  imagemUrl?: string;
}

interface Vendedor {
  id: string;
  nome: string;
  avatarUrl: string;
  online: boolean;
  ultimaVezVisto?: string;
}

interface Anuncio {
  id: string;
  titulo: string;
  imagemUrl: string;
  precoPorHora: number;
}

const vendedor: Vendedor = {
  id: "",
  nome: "Conversa",
  avatarUrl: "",
  online: false,
};

const anuncios: Record<string, Anuncio> = {};

const quickReplies: string[] = [];

const initialMessages: Mensagem[] = [];

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDateLabel(iso: string) {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, today)) return "Hoje";
  if (isSameDay(date, yesterday)) return "Ontem";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "long",
  }).format(date);
}

function ChatHeader({ seller }: { seller: Vendedor }) {
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#D3D1C7] bg-[#F1EFE8]/95 backdrop-blur-sm">
      <div className="mx-auto max-w-[480px] px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Voltar"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E1F5EE] text-[#04342C] transition hover:bg-[#D8F0E8]"
            >
              <ArrowLeft size={18} />
            </button>

            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={seller.avatarUrl}
                  alt={seller.nome}
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-[#F1EFE8]"
                />
                {seller.online && (
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#F1EFE8] bg-[#0E6E56]" />
                )}
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#04342C]">
                  {seller.nome}
                </p>
                <p className="text-[11px] text-[#5F5E5A]">
                  {seller.online
                    ? "Online"
                    : `Visto por último às ${formatTime(
                        seller.ultimaVezVisto ?? new Date().toISOString()
                      )}`}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            aria-label="Mais opções"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E1F5EE] text-[#04342C] transition hover:bg-[#D8F0E8]"
          >
            <EllipsisVertical size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}

function ListingContextCard({ listing }: { listing: Anuncio }) {
  const router = useRouter();

  return (
    <div className="sticky top-[64px] z-10 border-b border-[#D3D1C7] bg-[#F1EFE8] px-4 py-3">
      <div className="rounded-2xl border border-[#D3D1C7] bg-[#F1EFE8] p-3 shadow-[0_4px_18px_rgba(44,44,42,0.04)]">
        <div className="flex items-center gap-3">
          <div className="h-17 w-20 shrink-0 overflow-hidden rounded-xl bg-[#E1F5EE]">
            <img
              src={listing.imagemUrl}
              alt={listing.titulo}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-5 text-[#2C2C2A]">
              {listing.titulo}
            </p>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-lg font-bold text-[#04342C]">
                R$ {listing.precoPorHora.toLocaleString("pt-BR")}
              </span>
              <span className="text-[11px] text-[#5F5E5A]">/ hora</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => router.push(`/maquina/${listing.id}`)}
            className="rounded-full bg-[#EF9F27] px-3 py-2 text-[11px] font-bold text-[#2C2C2A] shadow-sm transition hover:bg-[#FAC775]"
          >
            Ver anúncio
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Mensagem }) {
  const isMine = message.autor === "usuario";

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[85%] ${isMine ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl px-4 py-3 shadow-sm ${
            isMine
              ? "rounded-br-md bg-[#0E6E56] text-[#F1EFE8]"
              : "rounded-bl-md bg-[#E1F5EE] text-[#2C2C2A]"
          }`}
        >
          {message.imagemUrl && (
            <img
              src={message.imagemUrl}
              alt="Imagem da conversa"
              className="mb-2 h-36 w-full rounded-xl object-cover"
            />
          )}

          <p className="text-sm leading-6">{message.texto}</p>
        </div>

        <div
          className={`mt-1 flex items-center gap-1 text-[10px] ${
            isMine ? "justify-end text-[#5F5E5A]" : "text-[#5F5E5A]"
          }`}
        >
          <span>{formatTime(message.horario)}</span>

          {isMine && (
            <>
              {message.status === "enviado" && (
                <span className="font-medium">Enviado</span>
              )}
              {message.status === "entregue" && (
                <CheckCheck size={11} className="text-[#5F5E5A]" />
              )}
              {message.status === "lido" && (
                <div className="flex items-center gap-0.5">
                  <CheckCheck size={11} className="text-[#5DCAA5]" />
                  <CheckCheck size={11} className="text-[#5DCAA5]" />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickReplies({ onSelect }: { onSelect: (value: string) => void }) {
  return (
    <div className="mb-3 overflow-x-auto pb-1">
      <div className="flex gap-2 whitespace-nowrap">
        {quickReplies.map((reply) => (
          <button
            key={reply}
            type="button"
            onClick={() => onSelect(reply)}
            className="rounded-full border border-[#D3D1C7] bg-[#F1EFE8] px-3 py-2 text-[11px] font-medium text-[#2C2C2A] transition hover:border-[#0E6E56] hover:bg-[#E1F5EE]"
          >
            {reply}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChatInput({
  draft,
  onChange,
  onSend,
}: {
  draft: string;
  onChange: (value: string) => void;
  onSend: () => void;
}) {
  return (
    <div className="flex items-end gap-2 rounded-2xl border border-[#D3D1C7] bg-[#F1EFE8] p-2 shadow-[0_4px_18px_rgba(44,44,42,0.04)]">
      <button
        type="button"
        aria-label="Anexar"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E1F5EE] text-[#04342C] transition hover:bg-[#D8F0E8]"
      >
        <Paperclip size={17} />
      </button>

      <textarea
        value={draft}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            onSend();
          }
        }}
        rows={1}
        placeholder="Escreva uma mensagem..."
        className="max-h-28 min-h-[40px] flex-1 resize-none border-0 bg-transparent px-2 py-2 text-sm text-[#2C2C2A] outline-none placeholder:text-[#5F5E5A]"
      />

      <button
        type="button"
        aria-label="Enviar mensagem"
        disabled={!draft.trim()}
        onClick={onSend}
        className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
          draft.trim()
            ? "bg-[#EF9F27] text-[#2C2C2A] hover:bg-[#FAC775]"
            : "cursor-not-allowed bg-[#D3D1C7] text-[#5F5E5A]"
        }`}
      >
        <SendHorizontal size={18} />
      </button>
    </div>
  );
}

export default function ChatPage() {
  const params = useParams<{ id?: string }>();
  const listing = anuncios[params?.id ?? ""] ?? null;
  const endRef = useRef<HTMLDivElement | null>(null);

  const [messages, setMessages] = useState<Mensagem[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const groupedMessages = useMemo(() => {
    const sorted = [...messages].sort(
      (a, b) =>
        new Date(a.horario).getTime() - new Date(b.horario).getTime()
    );

    const groups: { label: string; items: Mensagem[] }[] = [];

    sorted.forEach((message) => {
      const label = formatDateLabel(message.horario);
      const currentGroup = groups[groups.length - 1];

      if (!currentGroup || currentGroup.label !== label) {
        groups.push({ label, items: [message] });
        return;
      }

      currentGroup.items.push(message);
    });

    return groups;
  }, [messages]);

  const handleSend = () => {
    const trimmed = draft.trim();

    if (!trimmed) return;

    const newUserMessage: Mensagem = {
      id: `msg-${Date.now()}`,
      autor: "usuario",
      texto: trimmed,
      horario: new Date().toISOString(),
      status: "enviado",
    };

    setMessages((current) => [...current, newUserMessage]);
    setDraft("");
    setIsTyping(true);

    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: `msg-vendedor-${Date.now()}`,
          autor: "vendedor",
          texto:
            "Recebi sua mensagem. Posso confirmar a disponibilidade para essa data e te mandar a proposta final em seguida.",
          horario: new Date().toISOString(),
        },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-[#F1EFE8] text-[#2C2C2A]">
      <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col overflow-hidden border-x border-[#D3D1C7] bg-[#F1EFE8] shadow-[0_12px_45px_rgba(44,44,42,0.12)]">
        <ChatHeader seller={vendedor} />
        {listing && <ListingContextCard listing={listing} />}

        <div className="flex-1 overflow-y-auto px-4 pb-28 pt-28">
          <div className="mb-4 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D3D1C7] bg-[#E1F5EE] px-3 py-1.5 text-[10px] font-medium text-[#04342C]">
              <ShieldCheck size={12} />
              O chat real será integrado futuramente.
            </div>
          </div>

          {messages.length === 0 && !isTyping ? (
            <div className="rounded-2xl border border-dashed border-[#D3D1C7] bg-[#F7F5F0] p-5 text-center">
              <p className="text-sm font-medium text-[#04342C]">Nenhuma mensagem disponível.</p>
              <p className="mt-1 text-xs text-[#5F5E5A]">
                A conversa será carregada em tempo real quando o backend estiver pronto.
              </p>
            </div>
          ) : (
            <>
              {groupedMessages.map((group) => (
                <div key={group.label} className="mb-5">
                  <div className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5F5E5A]">
                    {group.label}
                  </div>

                  <div className="space-y-3">
                    {group.items.map((message) => (
                      <MessageBubble key={message.id} message={message} />
                    ))}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md bg-[#E1F5EE] px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#5F5E5A]" />
                      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#5F5E5A] [animation-delay:120ms]" />
                      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#5F5E5A] [animation-delay:240ms]" />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          <div ref={endRef} />
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#D3D1C7] bg-[#F1EFE8] shadow-[0_-8px_20px_rgba(44,44,42,0.04)]">
          <div className="mx-auto max-w-[480px] px-4 pb-4 pt-3">
            {quickReplies.length > 0 && <QuickReplies onSelect={(value) => setDraft(value)} />}
            <ChatInput draft={draft} onChange={setDraft} onSend={handleSend} />
          </div>
        </div>
      </div>
    </main>
  );
}
