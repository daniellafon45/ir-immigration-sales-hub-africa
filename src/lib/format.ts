export function money(n: number) {
  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));
}

export function num(n: number) {
  return new Intl.NumberFormat("fr-CA").format(Number(n || 0));
}
