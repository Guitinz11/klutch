import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "accent" };

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const variants = {
    primary: "bg-teal-600 text-white hover:bg-teal-900",
    secondary: "border border-teal-600 bg-white text-teal-600 hover:bg-teal-50",
    accent: "bg-amber-200 text-teal-900 hover:bg-amber-100",
  };
  return <button className={`inline-flex min-h-11 items-center justify-center rounded-xl px-4 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`} {...props} />;
}
