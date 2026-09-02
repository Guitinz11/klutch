"use client";

import { ChangeEvent, useMemo, useState } from "react";
import {
  ArrowRight,
  Camera,
  Check,
  ChevronLeft,
  CircleDashed,
  Clock3,
  Coins,
  Heart,
  ImageIcon,
  MapPin,
  MessageCircle,
  ShieldCheck,
  Star,
  Tractor,
  Truck,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";

type Categoria = "tratores" | "colheitadeiras" | "implementos" | "vans" | "caminhonetes";

type FormularioAnuncio = {
  fotos: string[];
  titulo: string;
  categoria: Categoria;
  descricao: string;
  custoFixo: number;
  custoVariavelPorHora: number;
  precoOriginal?: number;
  cidade: string;
  bairro: string;
  disponivelHoje: boolean;
  raioVisibilidadeKm: number;
};

type Anunciante = {
  nome: string;
  iniciais: string;
  cooperadoDesde: number;
  verificado: boolean;
  avaliacaoMedia: number;
  tempoMedioResposta: string;
};

type StepConfig = {
  id: number;
  label: string;
  title: string;
  subtitle: string;
};

const steps: StepConfig[] = [
  { id: 0, label: "Fotos", title: "Adicionar fotos da máquina", subtitle: "Mostre até 5 imagens e escolha a capa do anúncio." },
  { id: 1, label: "Informações", title: "Informações básicas", subtitle: "Defina o título, categoria e a descrição do anúncio." },
  { id: 2, label: "Precificação", title: "Precificação", subtitle: "Informe o custo fixo e o custo variável por hora." },
  { id: 3, label: "Localização", title: "Localização e disponibilidade", subtitle: "Detalhe onde o anúncio aparece e quando está disponível." },
  { id: 4, label: "Revisão", title: "Revisar e publicar", subtitle: "Confira como o anúncio ficará na listagem e no detalhe." },
];

const categoriaOpcoes: Array<{ value: Categoria; label: string; description: string; icon: LucideIcon }> = [
  { value: "tratores", label: "Tratores", description: "Tratores e máquinas agrícolas", icon: Tractor },
  { value: "colheitadeiras", label: "Colheitadeiras", description: "Colheitadeiras e máquinas de colheita", icon: Wrench },
  { value: "implementos", label: "Implementos", description: "Implementos e acessórios", icon: Wrench },
  { value: "vans", label: "Vans", description: "Vans e transporte rural", icon: Truck },
  { value: "caminhonetes", label: "Caminhonetes", description: "Caminhonetes e utilitários", icon: Truck },
];

const defaultForm: FormularioAnuncio = {
  fotos: [],
  titulo: "",
  categoria: "tratores",
  descricao: "",
  custoFixo: 0,
  custoVariavelPorHora: 0,
  precoOriginal: 0,
  cidade: "",
  bairro: "",
  disponivelHoje: true,
  raioVisibilidadeKm: 3,
};

const anuncianteMock: Anunciante = {
  nome: "Adelmar Barbosa Ribeiro",
  iniciais: "AB",
  cooperadoDesde: 2019,
  verificado: true,
  avaliacaoMedia: 4.8,
  tempoMedioResposta: "1h",
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);

const getCategoriaMeta = (categoria: Categoria) =>
  categoriaOpcoes.find((option) => option.value === categoria) ?? categoriaOpcoes[0];

const getStepValidity = (step: number, form: FormularioAnuncio) => {
  switch (step) {
    case 0:
      return form.fotos.length > 0;
    case 1:
      return Boolean(form.titulo.trim() && form.categoria && form.descricao.trim());
    case 2:
      return form.custoFixo > 0 && form.custoVariavelPorHora >= 0 && (!form.precoOriginal || form.precoOriginal > 0);
    case 3:
      return Boolean(form.cidade.trim() && form.bairro.trim() && form.raioVisibilidadeKm > 0);
    default:
      return true;
  }
};

function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-6 flex items-center justify-between gap-2">
      {steps.map((step, index) => {
        const isActive = currentStep === step.id;
        const isCompleted = currentStep > step.id;

        return (
          <div key={step.id} className="flex flex-1 items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border text-[10px] font-bold ${
                  isCompleted || isActive
                    ? "border-teal-600 bg-teal-600 text-white"
                    : "border-gray-100 bg-white text-gray-600"
                }`}
              >
                {isCompleted ? <Check size={14} /> : index + 1}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`h-px flex-1 ${isCompleted ? "bg-teal-600" : "bg-gray-100"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function StepFotos({ form, onAddPhotos, onRemovePhoto, onSetCover }: {
  form: FormularioAnuncio;
  onAddPhotos: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemovePhoto: (index: number) => void;
  onSetCover: (index: number) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-600">Preview</p>
          <h3 className="mt-1 text-lg font-bold text-teal-900">Fotos do anúncio</h3>
        </div>
        <span className="rounded-full bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-600">
          {form.fotos.length}/5
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {form.fotos.length === 0 ? (
          <div className="col-span-full flex min-h-[220px] flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-gray-100 bg-white text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-teal-600">
              <Camera size={26} />
            </div>
            <p className="text-sm font-semibold text-gray-900">Nenhuma foto adicionada</p>
            <p className="mt-1 text-sm text-gray-600">Adicione imagens reais da máquina ou do implemento.</p>
          </div>
        ) : (
          form.fotos.map((photo, index) => (
            <div key={`${photo}-${index}`} className="relative overflow-hidden rounded-[1.2rem] border border-gray-100 bg-white p-2">
              <img src={photo} alt={`Foto ${index + 1}`} className="h-32 w-full rounded-[0.9rem] object-cover" />
              {index === 0 && (
                <span className="absolute left-4 top-4 rounded-full bg-teal-600 px-2 py-1 text-[10px] font-bold text-white">
                  Capa
                </span>
              )}

              <div className="mt-2 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => onSetCover(index)}
                  className="flex-1 rounded-full border border-gray-100 bg-gray-50 px-2 py-1.5 text-xs font-semibold text-teal-600"
                >
                  {index === 0 ? "Capa principal" : "Definir como capa"}
                </button>
                <button
                  type="button"
                  onClick={() => onRemovePhoto(index)}
                  aria-label="Remover foto"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-red-50 text-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-amber-200 px-4 py-3 text-sm font-bold text-amber-600 shadow-sm transition hover:bg-amber-100">
        <ImageIcon size={18} />
        <span>Adicionar fotos</span>
        <input type="file" accept="image/*" multiple onChange={onAddPhotos} className="hidden" />
      </label>
    </div>
  );
}

function StepInfoBasica({
  form,
  onChange,
}: {
  form: FormularioAnuncio;
  onChange: <K extends keyof FormularioAnuncio>(key: K, value: FormularioAnuncio[K]) => void;
}) {
  const titleLength = form.titulo.length;
  const descriptionLength = form.descricao.length;

  return (
    <div className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-900">Título do anúncio</label>
        <input
          value={form.titulo}
          onChange={(event) => onChange("titulo", event.target.value)}
          placeholder="Trator Massey Ferguson 4292"
          className="w-full rounded-[1rem] border border-gray-100 bg-white px-4 py-3 text-sm text-gray-900 outline-none ring-0 transition focus:border-teal-600"
        />
        <p className="mt-2 text-xs text-gray-600">{titleLength}/80 caracteres</p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-900">Categoria</label>
        <div className="grid gap-3 sm:grid-cols-2">
          {categoriaOpcoes.map(({ value, label, description, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => onChange("categoria", value)}
              className={`flex items-center gap-3 rounded-[1rem] border px-3 py-3 text-left transition ${
                form.categoria === value
                  ? "border-teal-600 bg-teal-50 text-teal-900"
                  : "border-gray-100 bg-white text-gray-900"
              }`}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-200 text-amber-600">
                <Icon size={18} />
              </span>
              <span>
                <span className="block text-sm font-semibold">{label}</span>
                <span className="block text-[11px] text-gray-600">{description}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-gray-900">Descrição</label>
        <textarea
          value={form.descricao}
          onChange={(event) => onChange("descricao", event.target.value)}
          rows={6}
          placeholder="Trator ... estado de conservação, motor em bom funcionamento, ideal para área de 10 a 30 hectares."
          className="w-full rounded-[1rem] border border-gray-100 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-teal-600"
        />
        <p className="mt-2 text-right text-xs text-gray-600">{descriptionLength}/500 caracteres</p>
      </div>
    </div>
  );
}

function StepPrecificacao({
  form,
  onChange,
}: {
  form: FormularioAnuncio;
  onChange: <K extends keyof FormularioAnuncio>(key: K, value: FormularioAnuncio[K]) => void;
}) {
  const valorHora = form.custoFixo + form.custoVariavelPorHora;
  const promocional = Boolean(form.precoOriginal && form.precoOriginal > 0);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-900">Custo fixo (R$)</label>
          <input
            type="number"
            min={0}
            value={form.custoFixo || ""}
            onChange={(event) => onChange("custoFixo", Number(event.target.value || 0))}
            placeholder="150"
            className="w-full rounded-[1rem] border border-gray-100 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-teal-600"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-900">Custo variável por hora (R$)</label>
          <input
            type="number"
            min={0}
            value={form.custoVariavelPorHora || ""}
            onChange={(event) => onChange("custoVariavelPorHora", Number(event.target.value || 0))}
            placeholder="70"
            className="w-full rounded-[1rem] border border-gray-100 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-teal-600"
          />
        </div>
      </div>

      <div className="rounded-[1.2rem] border border-teal-600/15 bg-teal-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">Preço estimado por hora</p>
        <div className="mt-3 flex items-end justify-between gap-4">
          <div>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(valorHora)}</p>
            <p className="text-xs text-gray-600">Custo calculado com base em fixo + variável</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-200 text-amber-600">
            <Coins size={20} />
          </div>
        </div>
      </div>

      <div className="rounded-[1.2rem] border border-gray-100 bg-white p-4">
        <label className="flex items-center justify-between gap-3 text-sm font-semibold text-gray-900">
          <span>Preço promocional</span>
          <input
            type="checkbox"
            checked={promocional}
            onChange={(event) => onChange("precoOriginal", event.target.checked ? form.custoFixo + form.custoVariavelPorHora + 20 : 0)}
            className="h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-600"
          />
        </label>

        {promocional && (
          <div className="mt-3">
            <label className="mb-2 block text-sm font-semibold text-gray-900">Preço original (riscado)</label>
            <input
              type="number"
              min={0}
              value={form.precoOriginal || ""}
              onChange={(event) => onChange("precoOriginal", Number(event.target.value || 0))}
              placeholder="220"
              className="w-full rounded-[1rem] border border-gray-100 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-teal-600"
            />
          </div>
        )}
      </div>
    </div>
  );
}

function StepLocalizacao({
  form,
  onChange,
}: {
  form: FormularioAnuncio;
  onChange: <K extends keyof FormularioAnuncio>(key: K, value: FormularioAnuncio[K]) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-900">Cidade</label>
          <input
            value={form.cidade}
            onChange={(event) => onChange("cidade", event.target.value)}
            placeholder="Lins"
            className="w-full rounded-[1rem] border border-gray-100 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-teal-600"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-900">Bairro</label>
          <input
            value={form.bairro}
            onChange={(event) => onChange("bairro", event.target.value)}
            placeholder="Centro"
            className="w-full rounded-[1rem] border border-gray-100 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-teal-600"
          />
        </div>
      </div>

      <div className="rounded-[1.2rem] border border-gray-100 bg-white p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">Disponível hoje</p>
            <p className="text-xs text-gray-600">Mostra anúncio como disponível imediatamente.</p>
          </div>
          <button
            type="button"
            onClick={() => onChange("disponivelHoje", !form.disponivelHoje)}
            className={`relative h-7 w-12 rounded-full transition ${form.disponivelHoje ? "bg-teal-600" : "bg-gray-100"}`}
            aria-label="Alternar disponibilidade"
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                form.disponivelHoje ? "left-6" : "left-1"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="rounded-[1.2rem] border border-gray-100 bg-white p-4">
        <label className="mb-3 block text-sm font-semibold text-gray-900">Raio de visibilidade</label>
        <div className="flex gap-2">
          {[3, 5, 10, 20].map((km) => (
            <button
              key={km}
              type="button"
              onClick={() => onChange("raioVisibilidadeKm", km)}
              className={`rounded-full px-3 py-2 text-xs font-bold ${
                form.raioVisibilidadeKm === km
                  ? "bg-teal-600 text-white"
                  : "border border-gray-100 bg-gray-50 text-gray-700"
              }`}
            >
              {km} km
            </button>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2 rounded-full bg-teal-50 px-3 py-2 text-xs font-medium text-teal-600">
          <MapPin size={14} />
          {form.raioVisibilidadeKm} km de você
        </div>
      </div>
    </div>
  );
}

function AnuncioCard({ form, anunciante }: { form: FormularioAnuncio; anunciante: Anunciante }) {
  const photo = form.fotos[0] ?? "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=80";
  const price = form.custoFixo + form.custoVariavelPorHora;
  const oldPrice = form.precoOriginal && form.precoOriginal > 0 ? form.precoOriginal : undefined;
  const location = [form.bairro, form.cidade].filter(Boolean).join(", ") || "Lins, Centro - SP";
  const timeLabel = form.disponivelHoje ? "Hoje, 15:54" : "Há 2 dias";

  return (
    <article className="overflow-hidden rounded-[1.5rem] border border-gray-100 bg-white shadow-[0_12px_30px_rgba(44,44,42,0.08)]">
      <div
        className="relative h-[180px] overflow-hidden bg-cover bg-center"
        style={{ backgroundImage: `url("${photo}")` }}
      >
        <button
          type="button"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-600 shadow-sm"
          aria-label="Favoritar anúncio"
        >
          <Heart size={16} />
        </button>
        <div className="absolute inset-x-0 bottom-0 flex justify-center gap-1 pb-3">
          {[0, 1, 2, 3, 4].map((dot) => (
            <span key={dot} className={`h-1.5 w-1.5 rounded-full ${dot === 0 ? "bg-white" : "bg-white/60"}`} />
          ))}
        </div>
      </div>

      <div className="p-4">
        <h3 className="line-clamp-2 text-lg font-bold leading-5 text-gray-900">
          {form.titulo || "Trator Massey Ferguson Modelo 4292 4x4 Ano 2015"}
        </h3>

        <div className="mt-4 space-y-1">
          {oldPrice && <p className="text-xs text-gray-600 line-through">{formatCurrency(oldPrice)}</p>}
          <p className="text-xl font-bold text-gray-900">{formatCurrency(price)}</p>
        </div>

        <p className="mt-4 flex items-center gap-1 text-xs text-gray-600">
          <MapPin size={13} className="text-gray-600" />
          <span>{location}</span>
          <span className="text-gray-100">|</span>
          <span>{timeLabel}</span>
        </p>
      </div>
    </article>
  );
}

function AnuncioDetalhe({ form, anunciante }: { form: FormularioAnuncio; anunciante: Anunciante }) {
  const photo = form.fotos[0] ?? "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=1200&q=80";
  const categoriaMeta = getCategoriaMeta(form.categoria);
  const price = form.custoFixo + form.custoVariavelPorHora;
  const location = `${form.bairro || "Centro"}, ${form.cidade || "Lins"} - SP`;

  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-gray-100 bg-white shadow-[0_12px_30px_rgba(44,44,42,0.08)]">
      <div className="relative h-[220px] overflow-hidden bg-teal-50">
        <img src={photo} alt={form.titulo || "Detalhe do anúncio"} className="h-full w-full object-cover" />
        <button
          type="button"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-700"
          aria-label="Favoritar anúncio"
        >
          <Heart size={16} />
        </button>
        <span className="absolute bottom-3 right-3 rounded-full bg-teal-600 px-2.5 py-1 text-[10px] font-bold text-white">
          1/5
        </span>
      </div>

      <div className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <h2 className="max-w-[240px] text-base font-bold leading-5 text-gray-900">
            {form.titulo || "Trator Massey Ferguson Modelo 4292 4x4 Ano 2015"}
          </h2>
          {form.disponivelHoje && (
            <span className="rounded-full bg-teal-50 px-2 py-1 text-[9px] font-bold text-teal-600">Disponível hoje</span>
          )}
        </div>

        <p className="flex items-center gap-1 text-[10px] text-gray-600">
          <MapPin size={12} className="text-teal-600" />
          {location}
        </p>

        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-gray-900">{formatCurrency(price)}</span>
            <span className="text-xs text-gray-600">/ hora</span>
          </div>
          <p className="text-[10px] text-gray-600">Custo calculado com base em fixo + variável</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-amber-200 px-3 py-1 text-[10px] font-bold text-amber-600">
            {categoriaMeta.label}
          </span>
          <span className="rounded-full border border-gray-100 px-3 py-1 text-[10px] text-gray-700">
            {form.raioVisibilidadeKm} km de você
          </span>
        </div>

        <div>
          <p className="text-xs font-bold text-gray-900">Descrição</p>
          <p className="mt-2 text-[11px] leading-4 text-gray-600">
            {form.descricao || "Trator com implementos, traçado, ideal para pequenas e médias áreas. Bom estado de conservação, revisado e pronto para uso no campo."}
          </p>
        </div>

        <div>
          <p className="text-xs font-bold text-gray-900">Categoria</p>
          <div className="mt-2 flex items-center gap-3 rounded-[0.7rem] border border-gray-100 bg-gray-50 px-3 py-3 text-[11px] font-semibold text-gray-900">
            <categoriaMeta.icon size={17} className="text-teal-600" />
            {categoriaMeta.description}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold text-gray-900">Anunciado por</p>
          <div className="mt-2 flex items-center gap-3 rounded-[0.7rem] border border-gray-100 bg-gray-50 px-3 py-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-50 text-xs font-bold text-teal-600">
              {anunciante.iniciais}
            </span>
            <div className="flex-1">
              <p className="text-[11px] font-bold text-gray-900">{anunciante.nome}</p>
              <p className="text-[10px] text-gray-600">Cooperado desde {anunciante.cooperadoDesde}</p>
            </div>
            {anunciante.verificado && <ShieldCheck size={14} className="text-teal-600" />}
          </div>
        </div>

        <div className="grid grid-cols-2 divide-x divide-gray-100 overflow-hidden rounded-[0.7rem] border border-gray-100 bg-gray-50 py-3">
          <div className="px-3 text-center text-[10px] text-gray-700">
            <Star size={14} className="mx-auto text-amber-400" />
            <span className="mt-1 block font-semibold">{anunciante.avaliacaoMedia.toFixed(1)} avaliação</span>
          </div>
          <div className="px-3 text-center text-[10px] text-gray-700">
            <Clock3 size={14} className="mx-auto text-amber-400" />
            <span className="mt-1 block font-semibold">Resp. em {anunciante.tempoMedioResposta}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepRevisao({ form, anunciante }: { form: FormularioAnuncio; anunciante: Anunciante }) {
  return (
    <div className="space-y-6">
      <div className="rounded-[1.2rem] border border-gray-100 bg-white p-3">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-600">Lista</p>
        <AnuncioCard form={form} anunciante={anunciante} />
      </div>

      <div className="rounded-[1.2rem] border border-gray-100 bg-white p-3">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-gray-600">Detalhe</p>
        <AnuncioDetalhe form={form} anunciante={anunciante} />
      </div>
    </div>
  );
}

export default function RegistroProdutoPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormularioAnuncio>(defaultForm);
  const [published, setPublished] = useState(false);

  const currentStep = steps[step];
  const canContinue = getStepValidity(step, form);

  const updateForm = <K extends keyof FormularioAnuncio>(key: K, value: FormularioAnuncio[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handlePhotoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    const nextPhotos = files.slice(0, 5 - form.fotos.length).map((file) => URL.createObjectURL(file));
    if (!nextPhotos.length) return;

    setForm((current) => ({
      ...current,
      fotos: [...current.fotos, ...nextPhotos].slice(0, 5),
    }));
    event.target.value = "";
  };

  const handleRemovePhoto = (index: number) => {
    setForm((current) => ({
      ...current,
      fotos: current.fotos.filter((_, itemIndex) => itemIndex !== index),
    }));
  };

  const handleSetCover = (index: number) => {
    if (index === 0) return;

    setForm((current) => {
      if (current.fotos.length < 2) return current;
      const next = [...current.fotos];
      const [selected] = next.splice(index, 1);
      return { ...current, fotos: selected ? [selected, ...next] : current.fotos };
    });
  };

  const handleContinue = () => {
    if (!canContinue) return;

    if (step < steps.length - 1) {
      setStep((current) => current + 1);
      return;
    }

    setPublished(true);
  };

  const handleBack = () => {
    if (step === 0) return;
    setStep((current) => current - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepFotos form={form} onAddPhotos={handlePhotoUpload} onRemovePhoto={handleRemovePhoto} onSetCover={handleSetCover} />;
      case 1:
        return <StepInfoBasica form={form} onChange={updateForm} />;
      case 2:
        return <StepPrecificacao form={form} onChange={updateForm} />;
      case 3:
        return <StepLocalizacao form={form} onChange={updateForm} />;
      case 4:
        return <StepRevisao form={form} anunciante={anuncianteMock} />;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6">
      <div className="mx-auto w-full max-w-5xl rounded-[2rem] border border-gray-100 bg-white p-4 shadow-[0_24px_70px_rgba(44,44,42,0.08)] sm:p-6">
        <header className="mb-6 flex flex-col gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-600">Klutch</p>
            <h1 className="mt-1 text-2xl font-bold text-gray-900">Novo anúncio</h1>
          </div>
          {published ? (
            <div className="flex items-center gap-2 rounded-full bg-teal-50 px-3 py-2 text-sm font-semibold text-teal-700">
              <Check size={16} />
              Anúncio publicado
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-full bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-600">
              <CircleDashed size={16} />
              Rascunho salvo localmente
            </div>
          )}
        </header>

        <Stepper currentStep={step} />

        <section className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">{currentStep.label}</p>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">{currentStep.title}</h2>
          <p className="mt-2 text-sm text-gray-600">{currentStep.subtitle}</p>
        </section>

        <div className="rounded-[1.5rem] border border-gray-100 bg-gray-50 p-4 sm:p-6">{renderStep()}</div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={step === 0}
            className="flex items-center justify-center gap-2 rounded-full border border-teal-600 bg-white px-5 py-3 text-sm font-bold text-teal-600 transition hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <ChevronLeft size={16} />
            Voltar
          </button>

          <button
            type="button"
            onClick={handleContinue}
            disabled={!canContinue || published}
            className="flex items-center justify-center gap-2 rounded-full bg-amber-200 px-5 py-3 text-sm font-bold text-amber-600 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {step === steps.length - 1 ? "Publicar anúncio" : "Continuar"}
            {!published && <ArrowRight size={16} />}
          </button>
        </div>
      </div>
    </main>
  );
}
