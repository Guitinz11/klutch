"use client";

import { useState } from "react";
import { Check, ChevronLeft, Heart, MapPin, MessageCircle, Tractor } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function MachineDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [isReserved, setIsReserved] = useState(false);

  const isSecondMachine = params.id === "mf4292";
  const product = isSecondMachine
    ? {
        name: "Trator Massey Ferguson Modelo 4292 4x4 Ano 2015",
        location: "Lins, Centro - SP",
        price: "R$ 220",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Tractor%20Massey%20Ferguson.jpg",
      }
    : {
        name: "Trator Massey Ferguson 5310",
        location: "Ayrosa, Osasco - SP",
        price: "R$ 180",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Massey%20Ferguson%20tractor.jpg",
      };

  return (
    <main className="min-h-screen w-full bg-[#eeece5] text-[#17251f]">
      <div className="relative flex min-h-screen w-full flex-col overflow-hidden">
        <section className="relative h-[171px] shrink-0 overflow-hidden bg-[#58c3a5]">
          <div className="absolute inset-0 bg-cover bg-center opacity-0" style={{ backgroundImage: `url("${product.image}")` }} />
          <div className="absolute inset-0 flex items-center justify-center text-klutch-teal"><Tractor size={54} strokeWidth={2.5} /></div>
          <button className="absolute left-3 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#edf4ee] text-[#4f6c64]" onClick={() => router.back()} type="button" aria-label="Voltar"><ChevronLeft size={19} /></button>
          <button className="absolute right-3 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#edf4ee] text-[#4f6c64]" type="button" aria-label="Favoritar produto"><Heart size={16} /></button>
          <span className="absolute bottom-2 right-3 rounded-full bg-klutch-teal px-2 py-0.5 text-[10px] font-bold text-white">1/5</span>
        </section>

        <section className="flex-1 px-4 pb-24 pt-3">
          <div className="flex items-start justify-between gap-3">
            <h1 className="max-w-[270px] font-display text-base font-bold leading-5">{product.name}</h1>
            <span className="mt-1 whitespace-nowrap rounded-full bg-[#dff1e7] px-2 py-1 text-[9px] font-bold text-klutch-teal">Disponível hoje</span>
          </div>
          <p className="mt-1 flex items-center gap-1 text-[10px] text-[#465c58]"><MapPin size={12} />{product.location}</p>

          <div className="mt-3 flex items-baseline gap-1"><span className="font-display text-xl font-bold">{product.price}</span><span className="text-xs">/ hora</span></div>
          <p className="text-[10px] text-[#394d48]">Custo calculado com base em fixo + variável</p>

          <div className="mt-3 flex gap-2"><span className="rounded-full bg-[#f7c875] px-3 py-1 text-[10px] text-klutch-amber-dark">Tratores</span><span className="rounded-full border border-[#cbc6b9] px-3 py-1 text-[10px] text-[#56615b]">3 km de você</span></div>

          <div className="mt-4"><h2 className="text-xs font-bold">Descrição</h2><p className="mt-1 text-[11px] leading-4 text-[#384944]">Trator com implementos, traçado, ideal para pequenas e médias áreas. Bom estado de conservação, revisado recentemente.</p></div>

          <div className="mt-4"><h2 className="text-xs font-bold">Categoria</h2><div className="mt-1 flex items-center gap-3 rounded-[0.65rem] border border-[#d0ccc3] bg-[#f8f8f6] px-3 py-3 text-[11px] font-semibold"><Tractor size={17} className="text-klutch-teal-light" />Tratores e máquinas agrícolas</div></div>

          <div className="mt-4"><h2 className="text-xs font-bold">Anunciado por</h2><div className="mt-1 flex items-center gap-3 rounded-[0.65rem] border border-[#d0ccc3] bg-[#f8f8f6] px-3 py-2.5"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d9f1e8] text-xs font-bold text-klutch-teal-light">AB</span><div className="flex-1"><p className="text-[11px] font-bold">Adelmar Barbosa Ribeiro</p><p className="text-[10px] text-[#50635d]">Cooperado desde 2019</p></div><Check size={14} className="text-klutch-teal-light" /></div></div>

          <div className="mt-4 grid grid-cols-2 divide-x rounded-[0.65rem] border border-[#d0ccc3] bg-[#f8f8f6] py-3 text-center text-[10px] text-[#465951]"><div><span className="block text-base text-[#e6a13b]">☆</span>4.8 avaliação</div><div><span className="block text-base text-[#e6a13b]">◷</span>Resp. em 1h</div></div>
        </section>

        <div className="absolute inset-x-0 bottom-0 flex gap-2 bg-[#eeece5] px-4 pb-4 pt-2"><button className="flex h-10 flex-1 items-center justify-center gap-2 rounded-full border border-klutch-teal text-xs font-bold text-klutch-teal" type="button"><MessageCircle size={14} />Conversar</button><button className="flex h-10 flex-[1.3] items-center justify-center rounded-full bg-[#efa02b] text-xs font-bold text-klutch-amber-dark transition-colors hover:bg-[#f6b64e]" onClick={() => setIsReserved(true)} type="button">{isReserved ? "Reserva solicitada" : "Reservar agora"}</button></div>
      </div>
    </main>
  );
}