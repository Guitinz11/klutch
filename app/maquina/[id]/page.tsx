"use client";

import { useState } from "react";
import { Check, ChevronLeft, Heart, MapPin, MessageCircle, Tractor } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useFavorites } from "@/components/favorites/useFavorites";

export default function MachineDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [isReserved, setIsReserved] = useState(false);
  const { favoriteIds, toggleFavorite } = useFavorites();

  const products = {
    mf65x: {
      name: "Trator MF65X ano 1974",
      location: "José Bonifácio",
      price: "R$ 39.800",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Massey%20Ferguson%20tractor.jpg",
    },
    mf4292: {
        name: "Trator Massey Ferguson Modelo 4292 4x4 Ano 2015",
        location: "Lins, Centro - SP",
        price: "R$ 220",
        image: "https://commons.wikimedia.org/wiki/Special:FilePath/Tractor%20Massey%20Ferguson.jpg",
    },
    bh180: {
      name: "Trator BH 180",
      location: "Itatinga, Área Rural de Itatinga",
      price: "R$ 230.000",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Tractor%20in%20a%20field.jpg",
    },
  };
  const product = products[params.id as keyof typeof products] ?? products.mf65x;

  return (
    <main className="min-h-screen w-full bg-[#eeece5] text-[#17251f]">
      <div className="relative flex min-h-screen w-full flex-col overflow-hidden">
        <section className="relative h-[171px] shrink-0 overflow-hidden bg-[#58c3a5]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${product.image}")` }} />
          <div className="absolute inset-0 flex items-center justify-center bg-klutch-teal/10 text-klutch-teal"><Tractor size={54} strokeWidth={2.5} /></div>
          <button className="absolute left-3 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#edf4ee] text-[#4f6c64]" onClick={() => router.back()} type="button" aria-label="Voltar"><ChevronLeft size={19} /></button>
          <button className="absolute right-3 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[#edf4ee] text-[#4f6c64]" type="button" aria-label="Favoritar produto" onClick={() => toggleFavorite({ id: params.id, category: "Tratores", name: product.name, location: product.location, price: `${product.price} / diária` })}><Heart size={16} fill={favoriteIds.has(params.id) ? "currentColor" : "none"} /></button>
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

        <div className="fixed inset-x-0 bottom-0 z-30 mx-auto flex max-w-xl gap-2 border-t border-klutch-line bg-[#eeece5]/95 px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur"><button className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full border border-klutch-teal text-xs font-bold text-klutch-teal" type="button" onClick={() => router.push(`/chat/${params.id}`)}><MessageCircle size={14} />Conversar</button><button className="flex h-11 flex-[1.3] items-center justify-center rounded-full bg-[#efa02b] text-xs font-bold text-klutch-amber-dark transition-colors hover:bg-[#f6b64e]" onClick={() => setIsReserved(true)} type="button">{isReserved ? "Aluguel solicitado" : "Alugar agora"}</button></div>
      </div>
    </main>
  );
}
