export function sanitizeText(input: string | null | undefined) {
  return (input ?? "")
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim();
}

export function sanitizeMultiline(input: string | null | undefined) {
  return sanitizeText(input)
    .replace(/\s{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n");
}

export function normalizePhone(input: string | null | undefined) {
  return sanitizeText(input).replace(/[^+\d\s]/g, "");
}

export function slugify(input: string) {
  return sanitizeText(input)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
