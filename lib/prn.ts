export function isValidPrn(value: string) {
  return /^\d{11}$/.test(value.trim());
}

export function formatPrn(value: string) {
  return value.replace(/\D/g, "").slice(0, 11);
}
