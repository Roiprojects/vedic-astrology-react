import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(n: number | null | undefined): string {
  if (n == null) return "";
  return `₹${n.toLocaleString("en-IN")}`;
}

export function whatsappLink(
  raw: string,
  message?: string
): string {
  const phone = (raw || "").replace(/[^0-9]/g, "");
  const base = `https://wa.me/${phone}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
