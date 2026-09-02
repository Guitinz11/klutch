"use client";

import {
  AlertCircle,
  ArrowLeft,
  Camera,
  CheckCircle2,
  FileText,
  LucideIcon,
  Mail,
  MessageSquare,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";

type TipoDocumento = "cnh" | "rg";
type CanalVerificacao = "email" | "sms" | "whatsapp";
type StatusAnalise = "pendente" | "em_analise" | "aprovado";

type FormularioVerificacao = {
  nomeCompleto: string;
  dataNascimento: string;
  cpf: string;
  rg: string;
  orgaoEmissor: string;
  tipoDocumento: TipoDocumento;
  fotoFrenteUrl?: string;
  fotoVersoUrl?: string;
  fotoSelfieUrl?: string;
  canalVerificacao: CanalVerificacao;
  contatoDestino: string;
  codigoOTP: string;
  statusAnalise: StatusAnalise;
};

const steps = [
  "Dados pessoais",
  "Documentos",
  "Canal de verificação",
  "Código OTP",
  "Status",
] as const;

const initialForm: FormularioVerificacao = {
  nomeCompleto: "",
  dataNascimento: "",
  cpf: "",
  rg: "",
  orgaoEmissor: "",
  tipoDocumento: "cnh",
  canalVerificacao: "email",
  contatoDestino: "joao.silva@cooperado.com.br",
  codigoOTP: "",
  statusAnalise: "pendente",
};

function maskCpf(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function maskRg(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 9);
  return digits
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1})$/, "$1-$2");
}

function maskPhone(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

const channelConfig: Record<CanalVerificacao, { label: string; description: string; placeholder: string; icon: LucideIcon }> = {
  email: {
    label: "E-mail",
    description: "Receber o código no endereço cadastrado",
    placeholder: "joao.silva@cooperado.com.br",
    icon: Mail,
  },
  sms: {
    label: "Telefone (SMS)",
    description: "Receber o código por mensagem SMS",
    placeholder: "(14) 99876-5432",
    icon: Phone,
  },
  whatsapp: {
    label: "WhatsApp",
    description: "Receber o código no seu WhatsApp",
    placeholder: "(14) 99876-5432",
    icon: MessageSquare,
  },
};

function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between gap-2">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isDone = stepNumber < currentStep;

          return (
            <div key={step} className="flex flex-1 items-center gap-2">
              <div className="flex items-center gap-2">
                <div
                  className={[
                    "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold",
                    isActive || isDone
                      ? "bg-[#0F6E56] text-white"
                      : "bg-[#D3D1C7] text-[#5F5E5A]",
                  ].join(" ")}
                >
                  {stepNumber}
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className={[
                  "h-1 flex-1 rounded-full",
                  isDone ? "bg-[#0F6E56]" : "bg-[#D3D1C7]",
                ].join(" ")} />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 text-right">
        <span className="text-xs font-medium uppercase tracking-[0.12em] text-[#5F5E5A]">
          Etapa {currentStep} de {steps.length}
        </span>
      </div>
    </div>
  );
}

function StepDadosPessoais({
  form,
  onChange,
}: {
  form: FormularioVerificacao;
  onChange: (field: keyof FormularioVerificacao, value: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="rounded-[1.5rem] border border-[#D3D1C7] bg-[#F1EFE8] p-4">
        <h2 className="text-xl font-bold text-[#04342C]">Dados pessoais</h2>
        <p className="mt-1 text-sm text-[#5F5E5A]">
          Precisamos confirmar sua identidade para liberar a conta Klutch.
        </p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#2C2C2A]">Nome completo</span>
          <input
            value={form.nomeCompleto}
            onChange={(event) => onChange("nomeCompleto", event.target.value)}
            placeholder="João Carlos da Silva"
            className="w-full rounded-xl border border-[#D3D1C7] bg-white px-3 py-3 text-sm text-[#2C2C2A] placeholder:text-[#5F5E5A] outline-none transition-colors focus:border-[#0F6E56] focus:ring-2 focus:ring-[#5DCAA5]/20"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#2C2C2A]">Data de nascimento</span>
            <input
              type="date"
              value={form.dataNascimento}
              onChange={(event) => onChange("dataNascimento", event.target.value)}
              className="w-full rounded-xl border border-[#D3D1C7] bg-white px-3 py-3 text-sm text-[#2C2C2A] outline-none transition-colors focus:border-[#0F6E56] focus:ring-2 focus:ring-[#5DCAA5]/20"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#2C2C2A]">CPF</span>
            <input
              value={form.cpf}
              onChange={(event) => onChange("cpf", maskCpf(event.target.value))}
              placeholder="000.000.000-00"
              className="w-full rounded-xl border border-[#D3D1C7] bg-white px-3 py-3 text-sm text-[#2C2C2A] placeholder:text-[#5F5E5A] outline-none transition-colors focus:border-[#0F6E56] focus:ring-2 focus:ring-[#5DCAA5]/20"
            />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#2C2C2A]">RG</span>
            <input
              value={form.rg}
              onChange={(event) => onChange("rg", maskRg(event.target.value))}
              placeholder="00.000.000-0"
              className="w-full rounded-xl border border-[#D3D1C7] bg-white px-3 py-3 text-sm text-[#2C2C2A] placeholder:text-[#5F5E5A] outline-none transition-colors focus:border-[#0F6E56] focus:ring-2 focus:ring-[#5DCAA5]/20"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-[#2C2C2A]">Órgão emissor / UF</span>
            <input
              value={form.orgaoEmissor}
              onChange={(event) => onChange("orgaoEmissor", event.target.value)}
              placeholder="SSP - SP"
              className="w-full rounded-xl border border-[#D3D1C7] bg-white px-3 py-3 text-sm text-[#2C2C2A] placeholder:text-[#5F5E5A] outline-none transition-colors focus:border-[#0F6E56] focus:ring-2 focus:ring-[#5DCAA5]/20"
            />
          </label>
        </div>
      </div>
    </div>
  );
}

function StepEnvioDocumentos({
  form,
  onChange,
  onFileChange,
}: {
  form: FormularioVerificacao;
  onChange: (field: keyof FormularioVerificacao, value: string) => void;
  onFileChange: (field: "fotoFrenteUrl" | "fotoVersoUrl" | "fotoSelfieUrl", value: string) => void;
}) {
  const uploadHint =
    form.tipoDocumento === "cnh"
      ? "Envie a frente e verso da CNH"
      : "Envie a frente e verso do RG";

  return (
    <div className="space-y-5">
      <div className="rounded-[1.5rem] border border-[#D3D1C7] bg-[#FAEEDA] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FAC775] text-[#854F0B]">
            <Camera className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#04342C]">Envio de documentos e selfie</h2>
            <p className="text-sm text-[#5F5E5A]">A imagem será simulada localmente.</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-[#2C2C2A]">Tipo de documento</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {(["cnh", "rg"] as TipoDocumento[]).map((documentType) => (
            <button
              key={documentType}
              type="button"
              onClick={() => onChange("tipoDocumento", documentType)}
              className={[
                "rounded-[1.1rem] border px-4 py-3 text-left transition-colors",
                form.tipoDocumento === documentType
                  ? "border-[#0F6E56] bg-[#E1F5EE] text-[#0F6E56]"
                  : "border-[#D3D1C7] bg-white text-[#2C2C2A]",
              ].join(" ")}
            >
              <div className="flex items-center gap-2 font-semibold">
                <FileText className="h-4 w-4" aria-hidden="true" />
                {documentType === "cnh" ? "CNH" : "RG"}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <FileUploadCard
          title="Frente"
          status={form.fotoFrenteUrl ? "Concluído" : "Pendente"}
          isComplete={Boolean(form.fotoFrenteUrl)}
          onUpload={(file) => onFileChange("fotoFrenteUrl", file)}
        />
        <FileUploadCard
          title="Verso"
          status={form.fotoVersoUrl ? "Concluído" : "Pendente"}
          isComplete={Boolean(form.fotoVersoUrl)}
          onUpload={(file) => onFileChange("fotoVersoUrl", file)}
        />
        <FileUploadCard
          title="Selfie"
          status={form.fotoSelfieUrl ? "Concluído" : "Pendente"}
          isComplete={Boolean(form.fotoSelfieUrl)}
          onUpload={(file) => onFileChange("fotoSelfieUrl", file)}
        />
      </div>

      <div className="rounded-[1.1rem] border border-[#D3D1C7] bg-[#F1EFE8] p-4 text-sm text-[#5F5E5A]">
        {uploadHint}
      </div>
    </div>
  );
}

function FileUploadCard({
  title,
  status,
  isComplete,
  onUpload,
}: {
  title: string;
  status: string;
  isComplete: boolean;
  onUpload: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    onUpload(preview);
  };

  return (
    <div className="rounded-[1.25rem] border border-[#D3D1C7] bg-white p-3">
      <div
        className={[
          "relative flex h-28 cursor-pointer items-center justify-center overflow-hidden rounded-[0.9rem] border border-dashed transition-colors",
          isComplete ? "border-[#0F6E56] bg-[#E1F5EE]" : "border-[#D3D1C7] bg-[#F1EFE8]",
        ].join(" ")}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            inputRef.current?.click();
          }
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />

        {isComplete ? (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#E1F5EE] to-[#FAEEDA]">
            <CheckCircle2 className="h-8 w-8 text-[#0F6E56]" aria-hidden="true" />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-[#5F5E5A]">
            <Camera className="h-6 w-6" aria-hidden="true" />
            <span className="text-xs font-medium">Adicionar</span>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-[#2C2C2A]">{title}</span>
        <span
          className={[
            "rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em]",
            isComplete ? "bg-[#E1F5EE] text-[#0F6E56]" : "bg-[#FAEEDA] text-[#854F0B]",
          ].join(" ")}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

function StepCanalVerificacao({
  form,
  onChange,
}: {
  form: FormularioVerificacao;
  onChange: (field: keyof FormularioVerificacao, value: string) => void;
}) {
  const selectedChannel = channelConfig[form.canalVerificacao];
  const Icon = selectedChannel.icon;

  return (
    <div className="space-y-5">
      <div className="rounded-[1.5rem] border border-[#D3D1C7] bg-[#F1EFE8] p-4">
        <h2 className="text-xl font-bold text-[#04342C]">Escolha o canal de verificação</h2>
        <p className="mt-1 text-sm text-[#5F5E5A]">
          Receba o código de confirmação do jeito mais seguro para você.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {(Object.entries(channelConfig) as Array<[CanalVerificacao, (typeof channelConfig)[CanalVerificacao]]>).map(
          ([channel, config]) => {
            const ChannelIcon = config.icon;
            const isSelected = form.canalVerificacao === channel;

            return (
              <button
                key={channel}
                type="button"
                onClick={() => onChange("canalVerificacao", channel)}
                className={[
                  "rounded-[1.25rem] border p-4 text-left transition-colors",
                  isSelected
                    ? "border-[#0F6E56] bg-[#E1F5EE] text-[#0F6E56]"
                    : "border-[#D3D1C7] bg-white text-[#2C2C2A]",
                ].join(" ")}
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#F1EFE8] text-[#0F6E56]">
                  <ChannelIcon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="font-semibold">{config.label}</div>
              </button>
            );
          },
        )}
      </div>

      <div className="rounded-[1.25rem] border border-[#D3D1C7] bg-white p-4">
        <div className="mb-3 flex items-center gap-3 text-[#0F6E56]">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E1F5EE]">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="text-sm font-medium">{selectedChannel.label}</p>
            <p className="text-xs text-[#5F5E5A]">{selectedChannel.description}</p>
          </div>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-[#2C2C2A]">Endereço ou número</span>
          <input
            value={form.contatoDestino}
            onChange={(event) => {
              const rawValue = event.target.value;
              if (form.canalVerificacao === "email") {
                onChange("contatoDestino", rawValue);
                return;
              }

              onChange("contatoDestino", maskPhone(rawValue));
            }}
            placeholder={selectedChannel.placeholder}
            className="w-full rounded-xl border border-[#D3D1C7] bg-[#F1EFE8] px-3 py-3 text-sm text-[#2C2C2A] placeholder:text-[#5F5E5A] outline-none transition-colors focus:border-[#0F6E56] focus:ring-2 focus:ring-[#5DCAA5]/20"
          />
        </label>
      </div>
    </div>
  );
}

function StepValidacaoOTP({
  form,
  onChange,
  onResend,
  onSwitchChannel,
  timeLeft,
}: {
  form: FormularioVerificacao;
  onChange: (field: keyof FormularioVerificacao, value: string) => void;
  onResend: () => void;
  onSwitchChannel: () => void;
  timeLeft: number;
}) {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  function handleDigitChange(index: number, value: string) {
    const digits = Array.from({ length: 6 }, (_, item) => {
      if (item === index) return value.replace(/\D/g, "").slice(-1);
      return form.codigoOTP[item] ?? "";
    });

    const nextCode = digits.join("");
    onChange("codigoOTP", nextCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  return (
    <div className="space-y-5">
      <div className="rounded-[1.5rem] border border-[#D3D1C7] bg-[#FAEEDA] p-4">
        <h2 className="text-xl font-bold text-[#04342C]">Validação de código</h2>
        <p className="mt-1 text-sm text-[#5F5E5A]">
          Enviamos o código para {form.contatoDestino || "o canal selecionado"}.
        </p>
      </div>

      <div className="rounded-[1.25rem] border border-[#D3D1C7] bg-white p-4">
        <div className="flex justify-center gap-2 sm:gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <input
              key={index}
              ref={(element) => {
                inputRefs.current[index] = element;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={form.codigoOTP[index] ?? ""}
              onChange={(event) => handleDigitChange(index, event.target.value)}
              className="h-12 w-12 rounded-xl border border-[#D3D1C7] bg-[#F1EFE8] text-center text-lg font-bold text-[#2C2C2A] outline-none transition-colors focus:border-[#0F6E56] focus:ring-2 focus:ring-[#5DCAA5]/20 sm:h-14 sm:w-14"
              aria-label={`Código OTP ${index + 1}`}
            />
          ))}
        </div>

        <div className="mt-5 flex flex-col items-center gap-3 text-sm text-[#5F5E5A] sm:flex-row sm:justify-center">
          <button type="button" onClick={onResend} className="font-medium text-[#0F6E56]">
            Reenviar código em 00:{String(timeLeft).padStart(2, "0")}
          </button>
          <button type="button" onClick={onSwitchChannel} className="font-medium text-[#0F6E56]">
            Trocar canal
          </button>
        </div>
      </div>
    </div>
  );
}

function StepStatusConclusao({
  form,
}: {
  form: FormularioVerificacao;
}) {
  const isApproved = form.statusAnalise === "aprovado";
  const statusText = isApproved ? "Verificado com sucesso" : "Em análise";

  return (
    <div className="space-y-5">
      <div
        className={[
          "rounded-[1.5rem] border p-5",
          isApproved ? "border-[#0F6E56] bg-[#E1F5EE]" : "border-[#D3D1C7] bg-[#FAEEDA]",
        ].join(" ")}
      >
        <div className="flex items-center gap-3">
          <div
            className={[
              "flex h-12 w-12 items-center justify-center rounded-full",
              isApproved ? "bg-[#0F6E56] text-white" : "bg-[#FAC775] text-[#854F0B]",
            ].join(" ")}
          >
            {isApproved ? <CheckCircle2 className="h-6 w-6" /> : <AlertCircle className="h-6 w-6" />}
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.12em] text-[#5F5E5A]">
              Status da conta
            </p>
            <h2 className="text-2xl font-bold text-[#04342C]">{statusText}</h2>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-[#5F5E5A]">
          O cooperado será avisado assim que a validação for concluída. Em geral, a análise leva até 24 horas úteis.
        </p>
      </div>

      <div className="rounded-[1.5rem] border border-[#D3D1C7] bg-white p-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-[#0F6E56]" aria-hidden="true" />
          <h3 className="text-lg font-bold text-[#04342C]">Benefícios da conta verificada</h3>
        </div>

        <ul className="mt-4 space-y-3 text-sm text-[#5F5E5A]">
          <li className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0F6E56]" />
            Publicação de anúncios com mais segurança e confiança.
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0F6E56]" />
            Reservas e operações com contrato e verificação simplificada.
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#0F6E56]" />
            Acesso a suporte prioritário e canal de atendimento do Sicredi.
          </li>
        </ul>
      </div>
    </div>
  );
}

export default function VerificacaoPage() {
  const [form, setForm] = useState<FormularioVerificacao>(initialForm);
  const [stepIndex, setStepIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(59);

  useEffect(() => {
    if (stepIndex !== 3) {
      return;
    }

    const interval = window.setInterval(() => {
      setTimeLeft((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => window.clearInterval(interval);
  }, [stepIndex]);

  const currentStep = stepIndex + 1;

  const isStepValid = useMemo(() => {
    switch (stepIndex) {
      case 0:
        return (
          form.nomeCompleto.trim().length > 0 &&
          form.dataNascimento.trim().length > 0 &&
          form.cpf.replace(/\D/g, "").length === 11 &&
          form.rg.replace(/\D/g, "").length >= 7 &&
          form.orgaoEmissor.trim().length > 0
        );
      case 1:
        return Boolean(form.fotoFrenteUrl && form.fotoVersoUrl && form.fotoSelfieUrl);
      case 2:
        return Boolean(form.contatoDestino.trim() && form.canalVerificacao);
      case 3:
        return form.codigoOTP.replace(/\D/g, "").length === 6;
      default:
        return true;
    }
  }, [form, stepIndex]);

  const updateField = (field: keyof FormularioVerificacao, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleNext = () => {
    if (!isStepValid) return;

    if (stepIndex === 4) {
      setForm((current) => ({ ...current, statusAnalise: "aprovado" }));
      return;
    }

    if (stepIndex === 3) {
      setForm((current) => ({ ...current, statusAnalise: "em_analise" }));
    }

    setStepIndex((current) => Math.min(current + 1, 4));
  };

  const handleBack = () => {
    setStepIndex((current) => Math.max(current - 1, 0));
  };

  const handleResendCode = () => {
    setTimeLeft(59);
  };

  const renderStep = () => {
    switch (stepIndex) {
      case 0:
        return <StepDadosPessoais form={form} onChange={updateField} />;
      case 1:
        return (
          <StepEnvioDocumentos
            form={form}
            onChange={updateField}
            onFileChange={(field, value) => setForm((current) => ({ ...current, [field]: value }))}
          />
        );
      case 2:
        return <StepCanalVerificacao form={form} onChange={updateField} />;
      case 3:
        return (
          <StepValidacaoOTP
            form={form}
            onChange={updateField}
            onResend={handleResendCode}
            onSwitchChannel={() => setStepIndex(2)}
            timeLeft={timeLeft}
          />
        );
      case 4:
        return <StepStatusConclusao form={form} />;
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-[#F1EFE8] px-4 py-6 text-[#2C2C2A] sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl rounded-[2rem] border border-[#D3D1C7] bg-white p-4 shadow-[0_18px_42px_rgba(44,44,42,0.05)] sm:p-6 lg:p-8">
        <div className="mb-6 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            disabled={stepIndex === 0}
            className="inline-flex items-center gap-2 rounded-full border border-[#0F6E56] bg-white px-3 py-2 text-sm font-semibold text-[#0F6E56] transition-colors hover:bg-[#E1F5EE] disabled:cursor-not-allowed disabled:border-[#D3D1C7] disabled:text-[#5F5E5A]"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Voltar
          </button>

          <div className="flex items-center gap-2 rounded-full bg-[#E1F5EE] px-3 py-2 text-sm font-medium text-[#0F6E56]">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Verificação de identidade
          </div>
        </div>

        <Stepper currentStep={currentStep} />

        <div className="mt-6">{renderStep()}</div>

        {stepIndex < 4 && (
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleBack}
              disabled={stepIndex === 0}
              className="rounded-full border border-[#0F6E56] bg-white px-5 py-3 text-sm font-semibold text-[#0F6E56] transition-colors hover:bg-[#E1F5EE] disabled:cursor-not-allowed disabled:border-[#D3D1C7] disabled:text-[#5F5E5A]"
            >
              Voltar
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={!isStepValid}
              className="rounded-full bg-[#EF9F27] px-5 py-3 text-sm font-semibold text-[#854F0B] transition-colors hover:bg-[#FAC775] disabled:cursor-not-allowed disabled:bg-[#FAC775]/80 disabled:text-[#854F0B]/80"
            >
              {stepIndex === 3 ? "Confirmar código" : stepIndex === 4 ? "Finalizar" : "Continuar"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
