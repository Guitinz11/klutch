"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  Check,
  LockKeyhole,
  MapPin,
  Mail,
  Phone,
  Tractor,
  TreePine,
  UserRound,
} from "lucide-react";

type FormErrors = {
  name?: string;
  email?: string;
  cep?: string;
  password?: string;
  confirmation?: string;
  terms?: string;
};

const inputClassName =
  "min-w-0 flex-1 bg-transparent text-sm font-medium text-klutch-foreground outline-none placeholder:text-klutch-muted/65";
const fieldClassName =
  "flex h-14 items-center gap-3 rounded-full border border-klutch-line bg-white px-3 text-klutch-teal transition-colors focus-within:border-klutch-teal-light focus-within:ring-2 focus-within:ring-klutch-teal-accent/20";
const fieldIconClassName =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-klutch-amber text-klutch-amber-dark";
const linkClassName =
  "font-bold text-klutch-teal-light underline-offset-4 transition-colors hover:text-klutch-teal hover:underline focus:outline-none focus:ring-2 focus:ring-klutch-teal-accent";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cep, setCep] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isCreated, setIsCreated] = useState(false);

  function validateForm() {
    const nextErrors: FormErrors = {};

    if (!name.trim()) nextErrors.name = "Informe seu nome completo.";
    if (!email.trim()) nextErrors.email = "Informe seu email.";
    if (cep.replace(/\D/g, "").length !== 8) {
      nextErrors.cep = "Informe um CEP válido.";
    }
    if (password.length < 6) {
      nextErrors.password = "A senha deve ter pelo menos 6 caracteres.";
    }
    if (!confirmation || confirmation !== password) {
      nextErrors.confirmation = "As senhas precisam ser iguais.";
    }
    if (!acceptedTerms) {
      nextErrors.terms = "Aceite os termos para criar sua conta.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsCreated(false);

    if (validateForm()) {
      setIsCreated(true);
    }
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden overflow-y-auto px-5 py-8 sm:py-12">
      <div className="pointer-events-none absolute left-0 top-0 h-1 w-full bg-klutch-teal" />
      <div className="pointer-events-none absolute -right-24 top-24 h-64 w-64 rounded-full bg-klutch-amber-soft/20" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden text-klutch-teal-light/20" aria-hidden="true">
        <TreePine className="absolute bottom-12 left-0 h-14 w-14 sm:left-[7%] sm:h-20 sm:w-20" strokeWidth={1.2} />
        <TreePine className="absolute left-[5%] top-36 h-8 w-8 text-klutch-amber-dark/20 sm:left-[16%] sm:h-11 sm:w-11" strokeWidth={1.2} />
        <Tractor className="absolute bottom-20 right-0 h-16 w-16 text-klutch-amber-dark/25 sm:right-[8%] sm:h-24 sm:w-24" strokeWidth={1.1} />
        <span className="absolute right-[12%] top-28 h-4 w-4 rounded-full border-2 border-klutch-amber-dark/20 sm:right-[18%]" />
        <span className="absolute bottom-36 left-[22%] h-2 w-2 rounded-full bg-klutch-teal-light/25" />
        <span className="absolute right-[27%] bottom-[30%] h-7 w-7 rounded-full border border-klutch-teal-light/15" />
      </div>

      <section className="relative mx-auto w-full max-w-[430px]">
        <header className="flex flex-col items-center text-center">
          <Image
            src="/Klutch-logo.png"
            alt="Klutch"
            width={280}
            height={100}
            priority
            className="-translate-y-3 h-auto w-[190px] sm:w-[210px]"
          />
          <h1 className="relative -top-2 -mt-1 font-display text-[1.8rem] font-bold tracking-[-0.04em] text-klutch-foreground">
            Criar conta
          </h1>
          <p className="mt-1 text-sm text-klutch-muted">
            Crie seu acesso para alugar máquinas com facilidade
          </p>
        </header>

        <form className="mt-7 space-y-3" onSubmit={handleSubmit} noValidate>
          <label className="block">
            <span className={fieldClassName}>
              <span className={fieldIconClassName}>
                <UserRound aria-hidden="true" size={17} strokeWidth={2.5} />
              </span>
              <input
                className={inputClassName}
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Nome completo"
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
              />
            </span>
            {errors.name && (
              <span className="mt-1 block px-2 text-xs font-semibold text-klutch-amber-dark">
                {errors.name}
              </span>
            )}
          </label>

          <label className="block">
            <span className={fieldClassName}>
              <span className={fieldIconClassName}>
                <Mail aria-hidden="true" size={17} strokeWidth={2.5} />
              </span>
              <input
                className={inputClassName}
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Você@exemplo.com"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
              />
            </span>
            {errors.email && (
              <span className="mt-1 block px-2 text-xs font-semibold text-klutch-amber-dark">
                {errors.email}
              </span>
            )}
          </label>

          <label className="block">
            <span className={fieldClassName}>
              <span className={fieldIconClassName}>
                <Phone aria-hidden="true" size={17} strokeWidth={2.5} />
              </span>
              <input
                className={inputClassName}
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="Telefone ou WhatsApp (opcional)"
                autoComplete="tel"
              />
            </span>
          </label>

          <label className="block">
            <span className={fieldClassName}>
              <span className={fieldIconClassName}>
                <MapPin aria-hidden="true" size={17} strokeWidth={2.5} />
              </span>
              <input
                className={inputClassName}
                type="text"
                value={cep}
                onChange={(event) => {
                  const digits = event.target.value.replace(/\D/g, "").slice(0, 8);
                  setCep(digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits);
                }}
                placeholder="CEP"
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={9}
                aria-invalid={Boolean(errors.cep)}
              />
            </span>
            {errors.cep && (
              <span className="mt-1 block px-2 text-xs font-semibold text-klutch-amber-dark">
                {errors.cep}
              </span>
            )}
          </label>

          <label className="block">
            <span className={fieldClassName}>
              <span className={fieldIconClassName}>
                <LockKeyhole aria-hidden="true" size={17} strokeWidth={2.5} />
              </span>
              <input
                className={inputClassName}
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Crie uma senha"
                autoComplete="new-password"
                aria-invalid={Boolean(errors.password)}
              />
            </span>
            {errors.password && (
              <span className="mt-1 block px-2 text-xs font-semibold text-klutch-amber-dark">
                {errors.password}
              </span>
            )}
          </label>

          <label className="block">
            <span className={fieldClassName}>
              <span className={fieldIconClassName}>
                <LockKeyhole aria-hidden="true" size={17} strokeWidth={2.5} />
              </span>
              <input
                className={inputClassName}
                type="password"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                placeholder="Confirme sua senha"
                autoComplete="new-password"
                aria-invalid={Boolean(errors.confirmation)}
              />
            </span>
            {errors.confirmation && (
              <span className="mt-1 block px-2 text-xs font-semibold text-klutch-amber-dark">
                {errors.confirmation}
              </span>
            )}
          </label>

          <label className="flex cursor-pointer items-start gap-2 px-2 pt-2 text-xs leading-5 text-klutch-muted">
            <input
              className="mt-0.5 h-4 w-4 shrink-0 accent-klutch-teal"
              type="checkbox"
              checked={acceptedTerms}
              onChange={(event) => setAcceptedTerms(event.target.checked)}
              aria-invalid={Boolean(errors.terms)}
            />
            <span>
              Eu aceito os{" "}
              <Link className={linkClassName} href="/termos">
                Termos de Uso
              </Link>{" "}
              e a{" "}
              <Link className={linkClassName} href="/privacidade">
                Política de Privacidade
              </Link>
              .
            </span>
          </label>
          {errors.terms && (
            <p className="px-2 text-xs font-semibold text-klutch-amber-dark">
              {errors.terms}
            </p>
          )}

          {isCreated && (
            <p className="flex items-center gap-2 px-2 text-sm font-semibold text-klutch-teal-light">
              <Check aria-hidden="true" size={16} />
              Conta pronta para ser conectada ao backend.
            </p>
          )}

          <button
            className="h-14 w-full rounded-full bg-klutch-teal font-bold text-white transition-transform hover:-translate-y-0.5 hover:bg-klutch-teal-light focus:outline-none focus:ring-4 focus:ring-klutch-teal-accent/40"
            type="submit"
          >
            Criar conta
          </button>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs font-bold text-klutch-muted">
          <span className="h-px flex-1 bg-klutch-amber-dark/35" />
          <span>ou</span>
          <span className="h-px flex-1 bg-klutch-amber-dark/35" />
        </div>

        <div className="grid gap-3">
          <button
            className="flex h-12 items-center justify-center rounded-full border border-klutch-line bg-white text-sm font-bold text-klutch-foreground transition-colors hover:border-klutch-amber hover:bg-klutch-amber-soft/20 focus:outline-none focus:ring-4 focus:ring-klutch-amber/25"
            type="button"
          >
            <span className="flex w-[205px] items-center gap-2">
              <Image src="/google-icon.svg" alt="" width={20} height={20} />
              <span>Cadastrar com Google</span>
            </span>
          </button>
          <button
            className="flex h-12 items-center justify-center rounded-full border border-klutch-line bg-white text-sm font-bold text-klutch-foreground transition-colors hover:border-klutch-amber hover:bg-klutch-amber-soft/20 focus:outline-none focus:ring-4 focus:ring-klutch-amber/25"
            type="button"
          >
            <span className="flex w-[205px] items-center gap-2">
              <Image src="/facebook-icon.svg" alt="" width={20} height={20} />
              <span>Cadastrar com Facebook</span>
            </span>
          </button>
        </div>

        <p className="mt-4 pb-2 text-center text-sm text-klutch-muted">
          Já tem uma conta?{" "}
          <Link className={linkClassName} href="/">
            Entrar
          </Link>
        </p>
      </section>
    </main>
  );
}
