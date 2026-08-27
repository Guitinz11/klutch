"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LockKeyhole, Mail, Tractor, TreePine } from "lucide-react";

const inputClassName =
  "min-w-0 flex-1 bg-transparent text-sm font-medium text-klutch-foreground outline-none placeholder:text-klutch-muted/65";
const fieldClassName =
  "flex h-14 items-center gap-3 rounded-full border border-klutch-line bg-white px-3 text-klutch-teal transition-colors focus-within:border-klutch-teal-light focus-within:ring-2 focus-within:ring-klutch-teal-accent/20";
const fieldIconClassName =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-klutch-amber text-klutch-amber-dark";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const result = (await response.json()) as { message?: string };
        throw new Error(result.message ?? "Não foi possível continuar.");
      }

      router.push("/home");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Não foi possível continuar.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
      <main className="relative flex min-h-screen items-center justify-center overflow-x-hidden overflow-y-auto px-5 py-8 sm:py-12">
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
      <section className="relative w-full max-w-[430px]">
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
            Entrar
          </h1>
          <p className="mt-1 text-sm text-klutch-muted">
            Acesse sua conta Klutch
          </p>
        </header>

        <div className="px-1 sm:px-5">
          <form className="mt-7 space-y-3" onSubmit={handleSubmit}>
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
                  required
                />
              </span>
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
                  placeholder="Digite sua senha"
                  autoComplete="current-password"
                  required
                />
              </span>
            </label>

            <div className="flex justify-start px-2">
              <a
                className="text-xs font-bold text-klutch-teal-light underline-offset-4 transition-colors hover:text-klutch-teal hover:underline focus:outline-none focus:ring-2 focus:ring-klutch-teal-accent"
                href="/recuperar-senha"
              >
                Esqueci minha senha
              </a>
            </div>

            {error && <p className="px-2 text-sm font-medium text-red-700">{error}</p>}

            <button
              className="h-14 w-full rounded-full bg-klutch-teal font-bold text-white transition-transform hover:-translate-y-0.5 hover:bg-klutch-teal-light focus:outline-none focus:ring-2 focus:ring-klutch-teal-accent/40 disabled:cursor-wait disabled:opacity-70"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Continuando..." : "Continuar"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs font-bold text-klutch-muted">
            <span className="h-px flex-1 bg-klutch-amber-dark/35" />
            <span>ou</span>
            <span className="h-px flex-1 bg-klutch-amber-dark/35" />
          </div>

          <div className="grid gap-3">
            <button className="flex h-12 items-center justify-center rounded-full border border-klutch-line bg-white text-sm font-bold text-klutch-foreground transition-colors hover:border-klutch-amber hover:bg-klutch-amber-soft/20 focus:outline-none focus:ring-2 focus:ring-klutch-amber/25" type="button">
              <span className="flex w-[185px] items-center gap-2">
                <Image className="h-5 w-5 shrink-0" src="/google-icon.svg" alt="" width={20} height={20} />
                <span className="text-left">Login com Google</span>
              </span>
            </button>
            <button className="flex h-12 items-center justify-center rounded-full border border-klutch-line bg-white text-sm font-bold text-klutch-foreground transition-colors hover:border-klutch-amber hover:bg-klutch-amber-soft/20 focus:outline-none focus:ring-2 focus:ring-klutch-amber/25" type="button">
              <span className="flex w-[185px] items-center gap-2">
                <Image className="h-5 w-5 shrink-0" src="/facebook-icon.svg" alt="" width={20} height={20} />
                <span className="text-left">Login com Facebook</span>
              </span>
            </button>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-klutch-muted">
          Ainda não tem uma conta?{" "}
          <a
            className="font-bold text-klutch-teal-light underline-offset-4 transition-colors hover:text-klutch-teal hover:underline focus:outline-none focus:ring-2 focus:ring-klutch-teal-accent"
            href="/cadastro"
          >
            Criar conta
          </a>
        </p>

        <p className="mt-4 text-center text-xs text-klutch-muted">
          Ao continuar, você concorda com os termos de uso do Klutch.
        </p>
      </section>
    </main>
  );
}
