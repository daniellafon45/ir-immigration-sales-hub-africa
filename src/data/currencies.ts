/** Indicative CAD → local multipliers for Africa closing demos (not live FX). */
export const CURRENCY_RATES_AS_OF = "2026-09";

export type LocalCurrency = {
  code: string;
  /** Display symbol/label for sales copy (e.g. FCFA). */
  label: string;
  locale: string;
  /** Multiply CAD amount to get local units. */
  cadToLocal: number;
};

const XOF: LocalCurrency = { code: "XOF", label: "FCFA", locale: "fr-FR", cadToLocal: 480 };
const XAF: LocalCurrency = { code: "XAF", label: "FCFA", locale: "fr-FR", cadToLocal: 480 };
const MAD: LocalCurrency = { code: "MAD", label: "MAD", locale: "fr-MA", cadToLocal: 7.2 };
const DZD: LocalCurrency = { code: "DZD", label: "DA", locale: "fr-DZ", cadToLocal: 97 };
const TND: LocalCurrency = { code: "TND", label: "TND", locale: "fr-TN", cadToLocal: 2.2 };
const EGP: LocalCurrency = { code: "EGP", label: "EGP", locale: "ar-EG", cadToLocal: 35 };
const NGN: LocalCurrency = { code: "NGN", label: "₦", locale: "en-NG", cadToLocal: 1150 };
const GHS: LocalCurrency = { code: "GHS", label: "GHS", locale: "en-GH", cadToLocal: 11.5 };
const KES: LocalCurrency = { code: "KES", label: "KES", locale: "en-KE", cadToLocal: 95 };
const ZAR: LocalCurrency = { code: "ZAR", label: "R", locale: "en-ZA", cadToLocal: 13.2 };
const MUR: LocalCurrency = { code: "MUR", label: "Rs", locale: "en-MU", cadToLocal: 33 };
const ETB: LocalCurrency = { code: "ETB", label: "Br", locale: "am-ET", cadToLocal: 95 };
const RWF: LocalCurrency = { code: "RWF", label: "FRw", locale: "fr-RW", cadToLocal: 990 };
const UGX: LocalCurrency = { code: "UGX", label: "USh", locale: "en-UG", cadToLocal: 2700 };
const TZS: LocalCurrency = { code: "TZS", label: "TSh", locale: "sw-TZ", cadToLocal: 1900 };
const MGA: LocalCurrency = { code: "MGA", label: "Ar", locale: "fr-MG", cadToLocal: 3300 };
const CDF: LocalCurrency = { code: "CDF", label: "FC", locale: "fr-CD", cadToLocal: 2100 };
const MZN: LocalCurrency = { code: "MZN", label: "MT", locale: "pt-MZ", cadToLocal: 47 };
const AOA: LocalCurrency = { code: "AOA", label: "Kz", locale: "pt-AO", cadToLocal: 680 };
const GNF: LocalCurrency = { code: "GNF", label: "FG", locale: "fr-GN", cadToLocal: 6400 };
const SLL: LocalCurrency = { code: "SLE", label: "Le", locale: "en-SL", cadToLocal: 17 };
const LRD: LocalCurrency = { code: "LRD", label: "L$", locale: "en-LR", cadToLocal: 140 };
const GMD: LocalCurrency = { code: "GMD", label: "D", locale: "en-GM", cadToLocal: 52 };
const MRU: LocalCurrency = { code: "MRU", label: "UM", locale: "ar-MR", cadToLocal: 29 };
const SDG: LocalCurrency = { code: "SDG", label: "SDG", locale: "ar-SD", cadToLocal: 440 };
const SOS: LocalCurrency = { code: "SOS", label: "Sh", locale: "so-SO", cadToLocal: 420 };
const DJF: LocalCurrency = { code: "DJF", label: "Fdj", locale: "fr-DJ", cadToLocal: 130 };
const ERN: LocalCurrency = { code: "ERN", label: "Nfk", locale: "ti-ER", cadToLocal: 11 };
const BWP: LocalCurrency = { code: "BWP", label: "P", locale: "en-BW", cadToLocal: 10 };
const NAD: LocalCurrency = { code: "NAD", label: "N$", locale: "en-NA", cadToLocal: 13.2 };
const ZMW: LocalCurrency = { code: "ZMW", label: "K", locale: "en-ZM", cadToLocal: 20 };
const MWK: LocalCurrency = { code: "MWK", label: "MK", locale: "en-MW", cadToLocal: 1270 };
const EUR: LocalCurrency = { code: "EUR", label: "€", locale: "fr-FR", cadToLocal: 0.67 };

/** Country name (as in profile.countries) → local currency. Canada omitted = CAD only. */
export const countryCurrencies: Record<string, LocalCurrency> = {
  Bénin: XOF,
  "Burkina Faso": XOF,
  "Côte d’Ivoire": XOF,
  "Côte d'Ivoire": XOF,
  "Guinée-Bissau": XOF,
  Mali: XOF,
  Niger: XOF,
  Sénégal: XOF,
  Togo: XOF,
  Cameroun: XAF,
  Tchad: XAF,
  Congo: XAF,
  Gabon: XAF,
  "Guinée équatoriale": XAF,
  Maroc: MAD,
  Algérie: DZD,
  Tunisie: TND,
  Égypte: EGP,
  Nigeria: NGN,
  Ghana: GHS,
  Kenya: KES,
  "Afrique du Sud": ZAR,
  Maurice: MUR,
  Éthiopie: ETB,
  Rwanda: RWF,
  Ouganda: UGX,
  Tanzanie: TZS,
  Madagascar: MGA,
  "République démocratique du Congo": CDF,
  Mozambique: MZN,
  Angola: AOA,
  Guinée: GNF,
  "Sierra Leone": SLL,
  Liberia: LRD,
  Gambie: GMD,
  Mauritanie: MRU,
  Soudan: SDG,
  Somalie: SOS,
  Djibouti: DJF,
  Érythrée: ERN,
  Botswana: BWP,
  Namibie: NAD,
  Zambie: ZMW,
  Malawi: MWK,
  "Cap-Vert": EUR,
  Comores: EUR,
};

export function currencyForCountry(country: string): LocalCurrency | null {
  const key = country.trim();
  if (!key || key === "Canada") return null;
  return countryCurrencies[key] ?? null;
}

export function cadToLocal(cad: number, country: string): number | null {
  const currency = currencyForCountry(country);
  if (!currency) return null;
  return Math.round(Number(cad || 0) * currency.cadToLocal);
}
