import { currencyForCountry, cadToLocal, type LocalCurrency } from "@/data/currencies";

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

function formatLocalAmount(amount: number, currency: LocalCurrency) {
  try {
    return new Intl.NumberFormat(currency.locale, {
      style: "currency",
      currency: currency.code,
      maximumFractionDigits: 0,
      currencyDisplay: "narrowSymbol",
    }).format(amount);
  } catch {
    return `${num(amount)} ${currency.label}`;
  }
}

export function moneyLocal(cad: number, country: string): string | null {
  const currency = currencyForCountry(country);
  const local = cadToLocal(cad, country);
  if (!currency || local == null) return null;
  const formatted = formatLocalAmount(local, currency);
  // Prefer FCFA label for XOF/XAF when Intl uses cryptic codes
  if (currency.code === "XOF" || currency.code === "XAF") {
    return `${num(local)} ${currency.label}`;
  }
  return formatted;
}

export type MoneyPair = {
  cad: string;
  local: string | null;
};

export function moneyPair(cad: number, country: string): MoneyPair {
  const local = moneyLocal(cad, country);
  return {
    cad: money(cad),
    local: local ? `≈ ${local}` : null,
  };
}

export { currencyForCountry, cadToLocal };
