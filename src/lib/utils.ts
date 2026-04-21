import { clsx } from "clsx";

export function cn(...classes: Array<string | false | null | undefined>) {
  return clsx(classes);
}

export function formatPrice(value: number | string) {
  const numericValue = typeof value === "string" ? Number(value) : value;

  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR",
  }).format(numericValue);
}

export function formatDateTime(date: Date | string) {
  const parsedDate = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("pt-PT", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(parsedDate);
}

export function formatShortDate(date: Date | string) {
  const parsedDate = typeof date === "string" ? new Date(date) : date;

  return new Intl.DateTimeFormat("pt-PT", {
    dateStyle: "medium",
  }).format(parsedDate);
}

export function weekdayLabel(value: number) {
  return [
    "Domingo",
    "Segunda-feira",
    "Terça-feira",
    "Quarta-feira",
    "Quinta-feira",
    "Sexta-feira",
    "Sábado",
  ][value];
}
