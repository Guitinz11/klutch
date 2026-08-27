"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowLeft, Check, Mail, Tractor, TreePine } from "lucide-react";

const inputClassName =
  "min-w-0 flex-1 bg-transparent text-sm font-medium text-klutch-foreground outline-none placeholder:text-klutch-muted/65";
const fieldClassName =
  "flex h-14 items-center gap-3 rounded-full border border-klutch-line bg-white px-3 text-klutch-teal transition-colors focus-within:border-klutch-teal-light focus-within:ring-2 focus-within:ring-klutch-teal-accent/20";
const fieldIconClassName =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-klutch-amber text-klutch-amber-dark";
const linkClassName =
  "font-bold text-klutch-teal-light underline-offset-4 transition-colors hover:text-klutch-teal hover:underline focus:outline-none focus:ring-2 focus:ring-klutch-teal-accent";

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default function RecoverPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [hasBlurredEmail, setHasBlurredEmail] = useState(false);
  const [status, setStatus] = useState<"form" | "success">("form");

  const emailIsValid = isValidEmail(email);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      setError("Informe seu email.");
      return;
    }

    if (!emailIsValid) {
      setError("Informe um email válido.");
      return;
    }

    setError("");
    setStatus("success");
  }

  function handleEmailChange(value: string) {
    setEmail(value);
    if (error) setError("");
  }

  function handleEmailBlur() {
    setHasBlurredEmail(true);
    if (!email.trim()) {
      setError("Informe seu email.");
    } else if (!emailIsValid) {
      setError("Informe um email válido.");
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-x-hidden overflow-y-auto px-5 py-8 sm:py-12">
      <div className="pointer-events-none absolute left-0 top-0 h-1 w-full bg-klutch-teal" />
      <div className="pointer-events-none absolute -right-24 top-24 h-64 w-64 rounded-full bg-klutch-amber-soft/20" />
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden text-klutch-teal-light/20"
        aria-hidden="true"
      >
        <TreePine
          className="absolute bottom-12 left-0 h-14 w-14 sm:left-[7%] sm:h-20 sm:w-20"
          strokeWidth={1.2}
        />
        <TreePine
          className="absolute left-[5%] top-36 h-8 w-8 text-klutch-amber-dark/20 sm:left-[16%] sm:h-11 sm:w-11"
          strokeWidth={1.2}
        />
        <Tractor
          className="absolute bottom-20 right-0 h-16 w-16 text-klutch-amber-dark/25 sm:right-[8%] sm:h-24 sm:w-24"
          strokeWidth={1.1}
        />
        <span className="absolute right-[12%] top-28 h-4 w-4 rounded-full border-2 border-klutch-amber-dark/20 sm:right-[18%]" />
        <span className="absolute bottom-36 left-[22%] h-2 w-2 rounded-full bg-klutch-teal-light/25" />
        <span className="absolute right-[27%] bottom-[30%] h-7 w-7 rounded-full border border-klutch-teal-light/15" />
      </div>

      <section className="relative w-full max-w-[430px]">
        <Link
          className="absolute left-0 top-1 flex h-9 w-9 items-center justify-center rounded-full text-klutch-teal transition-colors hover:bg-klutch-teal-soft focus:outline-none focus:ring-2 focus:ring-klutch-teal-accent"
          href="/"
          aria-label="Voltar para o login"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </Link>

        <header className="flex flex-col items-center text-center">
          <Image
            src="/Klutch-logo.png"
            alt="Klutch"
            width={280}
            height={100}
            priority
            className="-translate-y-2 h-auto w-[150px] sm:w-[170px]"
          />
          {status === "form" ? (
            <>
              <h1 className="mt-2 font-display text-[1.8rem] font-bold tracking-[-0.04em] text-klutch-foreground">
                Esqueceu sua senha?
              </h1>
              <p className="mt-2 max-w-[360px] text-sm leading-5 text-klutch-muted">
                Digite seu email cadastrado e enviaremos um link para redefinir sua senha.
              </p>
            </>
          ) : (
            <>
              <span className="mt-3 flex h-14 w-14 items-center justify-center rounded-full bg-klutch-teal-soft text-klutch-teal-light">
                <Check aria-hidden="true" size={28} strokeWidth={2.5} />
              </span>
              <h1 className="mt-4 font-display text-[1.8rem] font-bold tracking-[-0.04em] text-klutch-foreground">
                Verifique seu email
              </h1>
              <p className="mt-2 max-w-[360px] text-sm leading-5 text-klutch-muted">
                Enviamos um link de recuperação para <strong className="font-bold text-klutch-foreground">{email}</strong>. Verifique sua caixa de entrada ou spam.
              </p>
            </>
          )}
        </header>

        {status === "form" ? (
          <form className="mt-8 space-y-3 px-1 sm:px-5" onSubmit={handleSubmit} noValidate>
            <label className="block">
              <span className={fieldClassName}>
                <span className={fieldIconClassName}>
                  <Mail aria-hidden="true" size={17} strokeWidth={2.5} />
                </span>
                <input
                  className={inputClassName}
                  type="email"
                  value={email}
                  onChange={(event) => handleEmailChange(event.target.value)}
                  onBlur={handleEmailBlur}
                  placeholder="Email"
                  autoComplete="email"
                  aria-label="Email"
                  aria-invalid={Boolean(error)}
                />
              </span>
              {(error || (hasBlurredEmail && !emailIsValid)) && (
                <span className="mt-1 block px-2 text-xs font-semibold text-klutch-amber-dark">
                  {error || "Informe um email válido."}
                </span>
              )}
            </label>

            <button
              className="h-14 w-full rounded-full bg-klutch-teal font-bold text-white transition-transform hover:-translate-y-0.5 hover:bg-klutch-teal-light focus:outline-none focus:ring-4 focus:ring-klutch-teal-accent/40 disabled:cursor-not-allowed disabled:opacity-50"
              type="submit"
              disabled={!emailIsValid}
            >
              Enviar link de recuperação
            </button>
          </form>
        ) : (
          <div className="mt-8 px-1 sm:px-5">
            <button
              className="block w-full text-center text-sm font-bold text-klutch-teal-light underline-offset-4 transition-colors hover:text-klutch-teal hover:underline focus:outline-none focus:ring-2 focus:ring-klutch-teal-accent"
              type="button"
              onClick={() => setStatus("form")}
            >
              Reenviar email
            </button>
            <Link
              className="mt-5 flex h-14 w-full items-center justify-center rounded-full bg-klutch-teal font-bold text-white transition-transform hover:-translate-y-0.5 hover:bg-klutch-teal-light focus:outline-none focus:ring-4 focus:ring-klutch-teal-accent/40"
              href="/"
            >
              Voltar para o Login
            </Link>
          </div>
        )}

        {status === "form" && (
          <p className="mt-6 text-center text-sm text-klutch-muted">
            Lembrou sua senha? {" "}
            <Link className={linkClassName} href="/">
              Voltar para o Login
            </Link>
          </p>
        )}
      </section>
    </main>
  );
}
