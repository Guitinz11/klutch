import type { InputHTMLAttributes } from "react";

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`min-h-11 w-full rounded-xl border border-gray-100 bg-white px-3 text-sm text-gray-900 outline-none placeholder:text-gray-600/70 focus:border-teal-600 focus:ring-2 focus:ring-teal-200/40 ${className}`} {...props} />;
}
