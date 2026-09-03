import type { HTMLAttributes } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-2xl border border-gray-100 bg-white shadow-[0_4px_14px_rgba(44,44,42,0.06)] ${className}`} {...props} />;
}
