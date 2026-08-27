"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquareText, Search } from "lucide-react";

const conversations: Array<{
  id: string;
  seller: string;
  title: string;
  preview: string;
  time: string;
  unread: number;
  avatar: string;
  online: boolean;
}> = [];

export default function ChatIndexPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const filteredConversations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return conversations;
    }

    return conversations.filter((conversation) =>
      [conversation.seller, conversation.title, conversation.preview]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [query]);

  return (
    <main className="min-h-screen bg-[#F1EFE8] text-[#2C2C2A]">
      <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col overflow-hidden border-x border-[#D3D1C7] bg-[#F1EFE8] shadow-[0_12px_45px_rgba(44,44,42,0.12)]">
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#D3D1C7] bg-[#F1EFE8]/95 backdrop-blur-sm">
          <div className="mx-auto max-w-[480px] px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5F5E5A]">
                  Mensagens
                </p>
                <h1 className="mt-1 text-2xl font-bold text-[#04342C]">Conversas</h1>
              </div>

              <button
                type="button"
                aria-label="Buscar conversas"
                onClick={() => searchInputRef.current?.focus()}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E1F5EE] text-[#04342C] shadow-sm ring-1 ring-[#D3D1C7] transition hover:bg-[#D8F0E8]"
              >
                <Search size={18} />
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 pb-28 pt-28">
          <div className="rounded-2xl border border-[#D3D1C7] bg-[#F1EFE8] p-3 shadow-[0_6px_20px_rgba(44,44,42,0.04)]">
            <div className="mb-3 flex items-center gap-2 rounded-full bg-[#E1F5EE] px-3 py-2 text-xs font-medium text-[#04342C]">
              <MessageSquareText size={14} />
              Selecione uma conversa
            </div>

            <label className="mb-3 flex items-center gap-2 rounded-full border border-[#D3D1C7] bg-[#F1EFE8] px-3 py-2 text-xs text-[#5F5E5A] shadow-sm">
              <Search size={14} className="text-[#04342C]" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar conversa"
                aria-label="Buscar conversas"
                className="w-full border-0 bg-transparent text-sm text-[#2C2C2A] placeholder:text-[#5F5E5A] outline-none"
              />
            </label>

            <div className="space-y-2">
              {filteredConversations.length > 0 ? (
                filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => router.push(`/chat/${conversation.id}`)}
                    className="flex w-full items-center gap-3 rounded-2xl border border-[#D3D1C7] bg-[#F1EFE8] p-3 text-left transition hover:border-[#0E6E56] hover:bg-[#E1F5EE]"
                  >
                    <div className="relative shrink-0">
                      <img
                        src={conversation.avatar}
                        alt={conversation.seller}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      {conversation.online && (
                        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#F1EFE8] bg-[#0E6E56]" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-[#04342C]">
                          {conversation.seller}
                        </p>
                        <span className="text-[10px] text-[#5F5E5A]">
                          {conversation.time}
                        </span>
                      </div>

                      <p className="mt-1 truncate text-xs text-[#5F5E5A]">
                        {conversation.title}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs leading-4 text-[#2C2C2A]">
                        {conversation.preview}
                      </p>
                    </div>

                    {conversation.unread > 0 && (
                      <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-[#0E6E56] px-1.5 text-[10px] font-bold text-[#F1EFE8]">
                        {conversation.unread}
                      </span>
                    )}
                  </button>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-[#D3D1C7] bg-[#F7F5F0] p-5 text-center">
                  <p className="text-sm font-medium text-[#04342C]">Nenhuma conversa por enquanto.</p>
                  <p className="mt-1 text-xs text-[#5F5E5A]">
                    As mensagens reais aparecerão aqui quando o chat estiver conectado.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#D3D1C7] bg-[#F1EFE8] shadow-[0_-8px_20px_rgba(44,44,42,0.04)]">
          <div className="mx-auto max-w-[480px] px-4 pb-4 pt-3" />
        </div>
      </div>
    </main>
  );
}
