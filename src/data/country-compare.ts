import type { CountryCompareAxisId } from "@/data/country-compare-proof";
import { countryCompareAxesFor, type CompareAxisCopy } from "@/lib/country-compare-facts";

export type CountryCompareAxis = CompareAxisCopy;

/** Default snapshot (Bénin) for tests / static imports — prefer `countryCompareAxesFor(country)`. */
export const countryCompareAxes: CountryCompareAxis[] = countryCompareAxesFor("Bénin");

export { countryCompareAxesFor };

export function countryCompareTitle(country: string) {
  const name = country.trim() || "votre pays";
  return `Canada vs ${name}`;
}

export function countryCompareLead(country: string) {
  const name = country.trim() || "votre pays d’origine";
  return `Ce n’est pas « mieux partout ». C’est un projet de vie à comparer honnêtement avec ${name}.`;
}

export type { CountryCompareAxisId };
