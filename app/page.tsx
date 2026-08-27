"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LockKeyhole, Mail } from "lucide-react";

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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-8">
      <div className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full border border-klutch-teal-accent/30" />
      <div className="pointer-events-none absolute -right-32 bottom-[-5rem] h-80 w-80 rounded-full bg-klutch-amber-soft/35" />
      <section className="relative w-full max-w-md -translate-y-12">
        <header className="relative -top-3 mb-4 flex justify-center">
          <Image
            src="/Klutch-logo.png"
            alt="Klutch"
            width={280}
            height={100}
            priority
            className="h-auto w-[250px] scale-[1.15] sm:w-[280px]"
          />
        </header>

        <div className="bg-white/20 px-1 sm:px-5">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block">
              <span className="flex h-14 items-center gap-3 rounded-full bg-klutch-amber px-5 text-klutch-amber-dark transition-shadow focus-within:ring-4 focus-within:ring-klutch-amber/25">
                <Mail aria-hidden="true" size={18} strokeWidth={2.5} />
                <input
                  className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-klutch-amber-dark/65"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="voce@exemplo.com"
                  autoComplete="email"
                  required
                />
              </span>
            </label>

            <label className="block">
              <span className="flex h-14 items-center gap-3 rounded-full bg-klutch-amber px-5 text-klutch-amber-dark transition-shadow focus-within:ring-4 focus-within:ring-klutch-amber/25">
                <LockKeyhole aria-hidden="true" size={18} strokeWidth={2.5} />
                <input
                  className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none placeholder:text-klutch-amber-dark/65"
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
              className="h-14 w-full rounded-full bg-klutch-teal font-bold text-klutch-teal-soft transition-transform hover:-translate-y-0.5 hover:bg-klutch-teal-light disabled:cursor-wait disabled:opacity-70"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Continuando..." : "Continuar"}
            </button>
          </form>

          <div className="my-7 flex items-center gap-3 text-xs font-bold text-klutch-amber-dark">
            <span className="h-px flex-1 bg-klutch-amber-dark/35" />
            <span>ou</span>
            <span className="h-px flex-1 bg-klutch-amber-dark/35" />
          </div>

          <div className="grid gap-3">
            <button className="flex h-12 items-center justify-center rounded-full bg-klutch-amber text-sm font-bold text-klutch-amber-dark transition-colors hover:bg-klutch-amber-soft" type="button">
              <span className="flex w-[185px] items-center gap-2">
                <Image className="h-5 w-5 shrink-0" src="/google-icon.svg" alt="" width={20} height={20} />
                <span className="text-left">Login com Google</span>
              </span>
            </button>
            <button className="flex h-12 items-center justify-center rounded-full bg-klutch-amber text-sm font-bold text-klutch-amber-dark transition-colors hover:bg-klutch-amber-soft" type="button">
              <span className="flex w-[185px] items-center gap-2">
                <Image className="h-5 w-5 shrink-0" src="/facebook-icon.svg" alt="" width={20} height={20} />
                <span className="text-left">Login com Facebook</span>
              </span>
            </button>
          </div>
        </div>

        <p className="mt-7 text-center text-sm text-klutch-muted">
          Ainda não tem uma conta?{" "}
          <a
            className="font-bold text-klutch-teal-light underline-offset-4 transition-colors hover:text-klutch-teal hover:underline focus:outline-none focus:ring-2 focus:ring-klutch-teal-accent"
            href="/cadastro"
          >
            Criar conta
          </a>
        </p>

        <p className="mt-6 text-center text-xs text-klutch-muted">
          Ao continuar, você concorda com os termos de uso do Klutch.
        </p>
      </section>
    </main>
  );
}
