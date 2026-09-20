import { livingCities, type LivingCity } from "@/data/cost-of-living";
import type { Profile } from "@/data/profile";
import { provinceCode } from "@/data/provinces";
import { householdLiving } from "@/lib/household-living";
import { householdMarket } from "@/lib/household-market";

export type LivingBasket = {
  city: LivingCity;
  housing: number;
  grocery: number;
  transport: number;
  utilities: number;
  childcare: number;
  total: number;
  netMonthly: number;
  remainder: number;
  adults: number;
  kids: number;
};

export function citiesForProvince(code: string) {
  return livingCities.filter((city) => city.province === code);
}

export function cityById(id: string) {
  return livingCities.find((city) => city.id === id) ?? livingCities[0];
}

export function defaultCityId(profile: Profile) {
  return citiesForProvince(provinceCode(profile.province))[0]?.id ?? "montreal";
}

export function defaultProvinceCode(profile: Profile) {
  const code = provinceCode(profile.province);
  if (citiesForProvince(code).length > 0) return code;
  return cityById(defaultCityId(profile)).province;
}

export function defaultCompareIds(profile: Profile) {
  const primary = defaultCityId(profile);
  const extras = ["toronto", "moncton", "vancouver", "winnipeg"].filter((id) => id !== primary);
  return [primary, extras[0], extras[1]] as const;
}

export function livingBasket(profile: Profile, cityId: string, extras?: { extraAdults?: number }): LivingBasket {
  const city = cityById(cityId);
  const market = householdMarket(profile);
  const adults = market.adults.length + Math.max(0, extras?.extraAdults ?? 0);
  const kids = market.kids.length;
  const familyHome = adults > 1 || kids > 0;
  const housing = familyHome ? city.housing2 : city.housing1;
  const grocery = city.grocery * adults + Math.round(city.grocery * 0.5) * kids;
  const transport = city.transport * adults;
  const utilities = city.utilities;
  const childcare = city.childcare * kids;
  const total = housing + grocery + transport + utilities + childcare;
  const netMonthly = householdLiving(profile).combinedNetMonthly;
  return {
    city,
    housing,
    grocery,
    transport,
    utilities,
    childcare,
    total,
    netMonthly,
    remainder: Math.max(0, netMonthly - total),
    adults,
    kids,
  };
}

export type LivingOverrides = Partial<
  Pick<LivingBasket, "housing" | "grocery" | "transport" | "utilities" | "childcare" | "netMonthly">
>;

function moneyAmount(value: number) {
  return Math.max(0, Number(value) || 0);
}

export function withLivingOverrides(basket: LivingBasket, overrides?: LivingOverrides): LivingBasket {
  const housing = moneyAmount(overrides?.housing ?? basket.housing);
  const grocery = moneyAmount(overrides?.grocery ?? basket.grocery);
  const transport = moneyAmount(overrides?.transport ?? basket.transport);
  const utilities = moneyAmount(overrides?.utilities ?? basket.utilities);
  const childcare = moneyAmount(overrides?.childcare ?? basket.childcare);
  const netMonthly = moneyAmount(overrides?.netMonthly ?? basket.netMonthly);
  const total = housing + grocery + transport + utilities + childcare;
  return {
    ...basket,
    housing,
    grocery,
    transport,
    utilities,
    childcare,
    total,
    netMonthly,
    remainder: Math.max(0, netMonthly - total),
  };
}
