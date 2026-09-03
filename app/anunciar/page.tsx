"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Camera,
  Check,
  CircleDollarSign,
  Eye,
  MapPin,
  Phone,
  Save,
  Tractor,
  Truck,
  UserRound,
  Wheat,
  X,
} from "lucide-react";

type Category = {
  label: string;
  symbol: typeof Tractor;
  tone: string;
};

type Photo = {
  id: string;
  url: string;
  name: string;
};

const categories: Category[] = [
  { label: "Tratores", symbol: Tractor, tone: "bg-[#3a9e94]" },
  { label: "Colheita", symbol: Wheat, tone: "bg-klutch-amber-soft" },
  { label: "Implementos", symbol: Tractor, tone: "bg-[#3a9e94]" },
  { label: "Transporte", symbol: Truck, tone: "bg-klutch-amber-soft" },
];

const inputClassName =
  "min-w-0 flex-1 bg-transparent text-sm font-medium text-klutch-foreground outline-none placeholder:text-klutch-muted/65";
const fieldClassName =
  "flex h-14 items-center gap-3 rounded-full border border-klutch-line bg-white px-3 text-klutch-teal transition-colors focus-within:border-klutch-teal-light focus-within:ring-2 focus-within:ring-klutch-teal-accent/20";
const fieldIconClassName =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-klutch-amber text-klutch-amber-dark";
const errorClassName =
  "mt-1 block px-2 text-xs font-semibold text-klutch-amber-dark";

export default function AnnounceMachinePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const photoUrlsRef = useRef<string[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [ownerName, setOwnerName] = useState("");
  const [cpf, setCpf] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableUntil, setAvailableUntil] = useState("");
  const [cep, setCep] = useState("");
  const [location, setLocation] = useState("");
  const [addressNumber, setAddressNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [cityState, setCityState] = useState("");
  const [immediateBooking, setImmediateBooking] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState("");

  useEffect(() => () => {
    photoUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const canPublish = Boolean(
    ownerName.trim() &&
      cpf.replace(/\D/g, "").length === 11 &&
      phone.replace(/\D/g, "").length >= 10 &&
      name.trim() &&
      category &&
      price.trim() &&
      photos.length > 0 &&
      cep.replace(/\D/g, "").length === 8 &&
      location.trim() &&
      addressNumber.trim() &&
      cityState.trim(),
  );
  const selectedCategory = categories.find((item) => item.label === category);

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []).slice(0, 6 - photos.length);
    const newPhotos = selectedFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}`,
      url: URL.createObjectURL(file),
      name: file.name,
    }));

    photoUrlsRef.current.push(...newPhotos.map((photo) => photo.url));
    setPhotos((currentPhotos) => [...currentPhotos, ...newPhotos]);
    setFeedback("");
    event.target.value = "";
  }

  function removePhoto(photoId: string) {
    setPhotos((currentPhotos) => {
      const photo = currentPhotos.find((item) => item.id === photoId);
      if (photo) {
        URL.revokeObjectURL(photo.url);
        photoUrlsRef.current = photoUrlsRef.current.filter((url) => url !== photo.url);
      }
      return currentPhotos.filter((item) => item.id !== photoId);
    });
  }

  function validateForm() {
    const nextErrors: Record<string, string> = {};
    if (!ownerName.trim()) nextErrors.ownerName = "Informe seu nome completo.";
    if (cpf.replace(/\D/g, "").length !== 11) nextErrors.cpf = "Informe um CPF válido.";
    if (phone.replace(/\D/g, "").length < 10) nextErrors.phone = "Informe um telefone válido.";
    if (!name.trim()) nextErrors.name = "Informe o nome da máquina.";
    if (!category) nextErrors.category = "Selecione uma categoria.";
    if (!price.trim()) nextErrors.price = "Informe o valor da diária.";
    if (photos.length === 0) nextErrors.photos = "Adicione pelo menos uma foto.";
    if (cep.replace(/\D/g, "").length !== 8) nextErrors.cep = "Informe um CEP válido.";
    if (!location.trim()) nextErrors.location = "Informe o endereço de retirada.";
    if (!addressNumber.trim()) nextErrors.addressNumber = "Informe o número.";
    if (!cityState.trim()) nextErrors.cityState = "Informe a cidade e o estado.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback("");
    if (validateForm()) setFeedback("Anúncio pronto para ser publicado.");
  }

  function handleSaveDraft() {
    setFeedback("Rascunho salvo neste dispositivo.");
  }

  function handleFieldChange(field: string, value: string, setter: (nextValue: string) => void) {
    setter(value);
    if (errors[field]) {
      setErrors((currentErrors) => {
        const nextErrors = { ...currentErrors };
        delete nextErrors[field];
        return nextErrors;
      });
    }
    setFeedback("");
  }

  function formatCpf(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    return digits
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 10) {
      return digits.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2");
    }
    return digits.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
  }

  function formatCep(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    return digits.replace(/(\d{5})(\d)/, "$1-$2");
  }

  return (
    <main className="min-h-screen bg-background pb-32 text-foreground">
      <div className="mx-auto w-full max-w-[390px] sm:max-w-3xl sm:px-6 sm:py-5">
        <header className="sticky top-0 z-20 flex items-center gap-3 rounded-b-[1.25rem] bg-white px-4 py-3 shadow-[0_8px_25px_rgba(44,44,42,0.07)] sm:rounded-[1.25rem]">
          <button
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-klutch-teal transition-colors hover:bg-klutch-teal-soft focus:outline-none focus:ring-2 focus:ring-klutch-teal-accent"
            type="button"
            onClick={() => router.back()}
            aria-label="Voltar"
          >
            <ArrowLeft size={22} strokeWidth={2.4} />
          </button>
          <h1 className="font-display text-lg font-bold text-klutch-foreground">Anunciar máquina</h1>
        </header>

        <form ref={formRef} className="space-y-7 px-4 py-6 sm:px-0" onSubmit={handleSubmit} noValidate>
          <section>
            <div className="mb-3 flex items-end justify-between">
              <div>
                <h2 className="font-display text-xl font-bold text-klutch-foreground">Fotos</h2>
                <p className="mt-1 text-xs text-klutch-muted">Adicione até 6 fotos. A primeira será a capa.</p>
              </div>
              <span className="text-xs font-bold text-klutch-muted">{photos.length}/6</span>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-1">
              {photos.map((photo, index) => (
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[0.9rem] bg-klutch-teal-soft" key={photo.id}>
                  <Image className="object-cover" src={photo.url} alt={index === 0 ? "Foto de capa da máquina" : `Foto ${index + 1} da máquina`} fill unoptimized />
                  {index === 0 && <span className="absolute bottom-1 left-1 rounded-full bg-klutch-teal px-2 py-0.5 text-[9px] font-bold text-white">Capa</span>}
                  <button className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-klutch-teal" type="button" onClick={() => removePhoto(photo.id)} aria-label={`Remover ${photo.name}`}><X size={14} /></button>
                </div>
              ))}
              {photos.length < 6 && (
                <button className="flex h-24 w-24 shrink-0 flex-col items-center justify-center gap-1 rounded-[0.9rem] border-2 border-dashed border-klutch-amber bg-white text-klutch-amber-dark transition-colors hover:bg-klutch-amber-soft/20 focus:outline-none focus:ring-2 focus:ring-klutch-amber/40" type="button" onClick={() => fileInputRef.current?.click()}>
                  <Camera size={25} strokeWidth={2} />
                  <span className="text-[10px] font-bold">Adicionar foto</span>
                </button>
              )}
            </div>
            <input ref={fileInputRef} className="sr-only" type="file" accept="image/*" multiple onChange={handlePhotoChange} />
            {errors.photos && <span className={errorClassName}>{errors.photos}</span>}
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold text-klutch-foreground">Dados do anunciante</h2>
            <div className="space-y-3">
              <label className="block">
                <span className={fieldClassName}>
                  <span className={fieldIconClassName}><UserRound aria-hidden="true" size={17} strokeWidth={2.5} /></span>
                  <input className={inputClassName} type="text" value={ownerName} onChange={(event) => handleFieldChange("ownerName", event.target.value, setOwnerName)} placeholder="Nome completo do anunciante" autoComplete="name" aria-label="Nome completo do anunciante" aria-invalid={Boolean(errors.ownerName)} />
                </span>
                {errors.ownerName && <span className={errorClassName}>{errors.ownerName}</span>}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className={fieldClassName}>
                    <span className={fieldIconClassName}><UserRound aria-hidden="true" size={17} strokeWidth={2.5} /></span>
                    <input className={inputClassName} type="text" inputMode="numeric" value={cpf} onChange={(event) => handleFieldChange("cpf", formatCpf(event.target.value), setCpf)} placeholder="CPF" autoComplete="off" aria-label="CPF" aria-invalid={Boolean(errors.cpf)} />
                  </span>
                  {errors.cpf && <span className={errorClassName}>{errors.cpf}</span>}
                </label>
                <label className="block">
                  <span className={fieldClassName}>
                    <span className={fieldIconClassName}><Phone aria-hidden="true" size={17} strokeWidth={2.5} /></span>
                    <input className={inputClassName} type="tel" value={phone} onChange={(event) => handleFieldChange("phone", formatPhone(event.target.value), setPhone)} placeholder="Telefone" autoComplete="tel" aria-label="Telefone para contato" aria-invalid={Boolean(errors.phone)} />
                  </span>
                  {errors.phone && <span className={errorClassName}>{errors.phone}</span>}
                </label>
              </div>
              <p className="px-2 text-xs leading-4 text-klutch-muted">Seus dados ficam vinculados ao anúncio para facilitar o contato entre usuários.</p>
            </div>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold text-klutch-foreground">Informações da máquina</h2>
            <div className="space-y-3">
              <label className="block">
                <span className={fieldClassName}>
                  <span className={fieldIconClassName}><Tractor aria-hidden="true" size={17} strokeWidth={2.5} /></span>
                  <input className={inputClassName} type="text" value={name} onChange={(event) => handleFieldChange("name", event.target.value, setName)} placeholder="Nome do produto" aria-label="Nome do produto" aria-invalid={Boolean(errors.name)} />
                </span>
                {errors.name && <span className={errorClassName}>{errors.name}</span>}
              </label>
              <label className="block">
                <span className={fieldClassName}>
                  <span className={fieldIconClassName}><Tractor aria-hidden="true" size={17} strokeWidth={2.5} /></span>
                  <input className={inputClassName} type="text" value={brand} onChange={(event) => handleFieldChange("brand", event.target.value, setBrand)} placeholder="Marca e modelo" aria-label="Marca e modelo" />
                </span>
              </label>
            </div>

            <div className="mt-5">
              <p className="mb-3 text-sm font-semibold text-klutch-muted">Categoria</p>
              <div className="grid grid-cols-4 gap-2">
                {categories.map((item) => {
                  const CategoryIcon = item.symbol;
                  const isSelected = category === item.label;
                  return (
                    <button className={`flex min-h-24 min-w-0 flex-col items-center justify-center gap-2 rounded-[0.9rem] border text-center transition-colors focus:outline-none focus:ring-2 focus:ring-klutch-teal-accent ${isSelected ? "border-klutch-teal bg-klutch-teal text-white" : "border-transparent bg-white text-klutch-teal"}`} key={item.label} type="button" onClick={() => { setCategory(item.label); setErrors((currentErrors) => { const nextErrors = { ...currentErrors }; delete nextErrors.category; return nextErrors; }); }} aria-pressed={isSelected}>
                      <span className={`flex h-11 w-11 items-center justify-center rounded-[12px] ${isSelected ? "bg-white/15" : item.tone}`}><CategoryIcon size={23} strokeWidth={2.2} /></span>
                      <span className="whitespace-nowrap text-[9px] font-bold sm:text-[10px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>
              {errors.category && <span className={errorClassName}>{errors.category}</span>}
            </div>

            <label className="mt-5 block">
              <span className="block text-sm font-semibold text-klutch-muted">Descrição</span>
              <textarea className="mt-2 min-h-28 w-full resize-y rounded-[1rem] border border-klutch-amber bg-white px-4 py-3 text-sm text-klutch-foreground outline-none placeholder:text-klutch-muted/65 focus:border-klutch-teal-light focus:ring-2 focus:ring-klutch-teal-accent/20" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Descreva o estado da máquina, itens inclusos, condições de uso..." aria-label="Descrição" />
            </label>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold text-klutch-foreground">Preço e disponibilidade</h2>
            <label className="block">
              <span className={fieldClassName}>
                <span className={fieldIconClassName}><CircleDollarSign aria-hidden="true" size={18} strokeWidth={2.5} /></span>
                <input className={inputClassName} type="text" inputMode="decimal" value={price} onChange={(event) => handleFieldChange("price", event.target.value, setPrice)} placeholder="R$ 0,00" aria-label="Valor da diária" aria-invalid={Boolean(errors.price)} />
                <span className="text-xs font-semibold text-klutch-muted">/ diária</span>
              </span>
              {errors.price && <span className={errorClassName}>{errors.price}</span>}
            </label>

            <label className="mt-4 flex cursor-pointer items-center justify-between rounded-[1rem] bg-white px-4 py-3 text-sm font-semibold text-klutch-foreground shadow-[0_4px_14px_rgba(44,44,42,0.06)]">
              <span>Disponível para reserva imediata</span>
              <span className={`relative h-6 w-11 rounded-full transition-colors ${immediateBooking ? "bg-klutch-teal" : "bg-klutch-line"}`}><input className="sr-only" type="checkbox" checked={immediateBooking} onChange={(event) => setImmediateBooking(event.target.checked)} /><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${immediateBooking ? "translate-x-6" : "translate-x-1"}`} /></span>
            </label>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="block"><span className="mb-1 block px-2 text-xs font-semibold text-klutch-muted">Disponível de</span><span className={fieldClassName}><CalendarDays className="shrink-0 text-klutch-teal" size={17} /><input className="min-w-0 flex-1 bg-transparent text-xs text-klutch-foreground outline-none" type="date" value={availableFrom} onChange={(event) => setAvailableFrom(event.target.value)} aria-label="Disponível de" /></span></label>
              <label className="block"><span className="mb-1 block px-2 text-xs font-semibold text-klutch-muted">até</span><span className={fieldClassName}><CalendarDays className="shrink-0 text-klutch-teal" size={17} /><input className="min-w-0 flex-1 bg-transparent text-xs text-klutch-foreground outline-none" type="date" value={availableUntil} onChange={(event) => setAvailableUntil(event.target.value)} aria-label="Disponível até" /></span></label>
            </div>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-bold text-klutch-foreground">Localização</h2>
            <div className="space-y-3">
              <label className="block">
                <span className={fieldClassName}>
                  <span className={fieldIconClassName}><MapPin aria-hidden="true" size={17} strokeWidth={2.5} /></span>
                  <input className={inputClassName} type="text" inputMode="numeric" value={cep} onChange={(event) => handleFieldChange("cep", formatCep(event.target.value), setCep)} placeholder="CEP" autoComplete="postal-code" aria-label="CEP" aria-invalid={Boolean(errors.cep)} />
                </span>
                {errors.cep && <span className={errorClassName}>{errors.cep}</span>}
              </label>
              <label className="block">
                <span className={fieldClassName}>
                  <span className={fieldIconClassName}><MapPin aria-hidden="true" size={17} strokeWidth={2.5} /></span>
                  <input className={inputClassName} type="text" value={location} onChange={(event) => handleFieldChange("location", event.target.value, setLocation)} placeholder="Rua, estrada ou região de retirada" autoComplete="street-address" aria-label="Rua, estrada ou região de retirada" aria-invalid={Boolean(errors.location)} />
                </span>
                {errors.location && <span className={errorClassName}>{errors.location}</span>}
              </label>
              <div className="grid grid-cols-[1fr_1.6fr] gap-3">
                <label className="block">
                  <span className={fieldClassName}>
                    <input className={inputClassName} type="text" inputMode="numeric" value={addressNumber} onChange={(event) => handleFieldChange("addressNumber", event.target.value, setAddressNumber)} placeholder="Número" aria-label="Número" aria-invalid={Boolean(errors.addressNumber)} />
                  </span>
                  {errors.addressNumber && <span className={errorClassName}>{errors.addressNumber}</span>}
                </label>
                <label className="block"><span className={fieldClassName}><input className={inputClassName} type="text" value={complement} onChange={(event) => setComplement(event.target.value)} placeholder="Complemento (opcional)" aria-label="Complemento" /></span></label>
              </div>
              <label className="block">
                <span className={fieldClassName}>
                  <span className={fieldIconClassName}><MapPin aria-hidden="true" size={17} strokeWidth={2.5} /></span>
                  <input className={inputClassName} type="text" value={cityState} onChange={(event) => handleFieldChange("cityState", event.target.value, setCityState)} placeholder="Cidade e estado" autoComplete="address-level2" aria-label="Cidade e estado" aria-invalid={Boolean(errors.cityState)} />
                </span>
                {errors.cityState && <span className={errorClassName}>{errors.cityState}</span>}
              </label>
            </div>
            <p className="mt-2 px-2 text-xs leading-4 text-klutch-muted">Isso ajuda outros usuários a calcular a distância até a máquina, como visto na Home.</p>
          </section>

          <section className="rounded-[1.25rem] bg-white p-4 shadow-[0_6px_20px_rgba(44,44,42,0.07)]">
            <div className="mb-3 flex items-center gap-2 text-klutch-teal"><Eye size={18} /><h2 className="font-display text-base font-bold">Pré-visualização</h2></div>
            <div className="grid grid-cols-[112px_1fr] gap-3">
              <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-[0.7rem] bg-klutch-teal-soft">{photos[0] ? <Image className="object-cover" src={photos[0].url} alt="Pré-visualização da máquina" fill unoptimized /> : <Tractor className="text-klutch-teal-light" size={42} />}</div>
              <div className="min-w-0"><h3 className="line-clamp-2 font-display text-base font-bold text-[#101820]">{name || "Nome da máquina"}</h3><p className="mt-1 text-xs text-klutch-muted">{selectedCategory?.label || "Categoria"}{brand ? ` · ${brand}` : ""}</p><p className="mt-4 font-display text-lg font-bold text-[#101820]">{price || "R$ 0,00"}<span className="ml-1 text-xs font-normal">/ diária</span></p><p className="mt-2 flex items-center gap-1 text-[10px] text-[#64748b]"><MapPin size={12} />{location || "Região de retirada"}</p></div>
            </div>
          </section>

          {feedback && <p className="flex items-center gap-2 px-2 text-sm font-semibold text-klutch-teal-light"><Check size={17} />{feedback}</p>}
        </form>
      </div>

      <div className="fixed inset-x-0 bottom-[76px] z-30 border-t border-klutch-line bg-background/95 px-4 pb-4 pt-3 backdrop-blur sm:bottom-[92px] sm:mx-auto sm:max-w-3xl sm:rounded-t-[1.25rem] sm:border-x">
        <div className="mx-auto flex max-w-[390px] gap-3 sm:max-w-none">
          <button className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-klutch-teal bg-transparent text-sm font-bold text-klutch-teal transition-colors hover:bg-klutch-teal-soft focus:outline-none focus:ring-2 focus:ring-klutch-teal-accent" type="button" onClick={handleSaveDraft}><Save size={17} />Salvar como rascunho</button>
          <button className="flex h-12 flex-1 items-center justify-center rounded-full bg-klutch-teal text-sm font-bold text-white transition-colors hover:bg-klutch-teal-light focus:outline-none focus:ring-4 focus:ring-klutch-teal-accent/40 disabled:cursor-not-allowed disabled:opacity-45" type="button" onClick={() => formRef.current?.requestSubmit()} disabled={!canPublish}>Publicar anúncio</button>
        </div>
      </div>
    </main>
  );
}
