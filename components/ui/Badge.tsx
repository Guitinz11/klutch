import type { HTMLAttributes } from "react";

export function Badge({ className = "", ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={`inline-flex items-center rounded-full bg-teal-50 px-2.5 py-1 text-xs font-bold text-teal-600 ${className}`} {...props} />;
}
