import type { ReactNode } from "react";

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return <header className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4"><div><h1 className="font-display text-2xl font-bold text-teal-900">{title}</h1>{subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}</div>{actions}</header>;
}
