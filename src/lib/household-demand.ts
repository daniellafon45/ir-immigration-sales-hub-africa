import { ALL_CITIES, ALL_PROVINCES, demandFor, demandSeries, type DemandPoint } from "@/data/job-demand";
import { livingCities } from "@/data/cost-of-living";
import { provinceData } from "@/data/provinces";
import type { Profile } from "@/data/profile";
import { householdMarket, type HouseholdMarketAdult } from "@/lib/household-market";

export type DemandMetric = "score" | "intlShare";

export type HouseholdDemandGroup = {
  adult: HouseholdMarketAdult;
  current: DemandPoint;
  series: DemandPoint[];
  metric: DemandMetric;
};

export type HouseholdDemand = {
  groups: HouseholdDemandGroup[];
  placeLabel: string;
};

function cityById(id: string) {
  return livingCities.find((city) => city.id === id);
}

function placeLabel(province: string, cityId: string) {
  if (cityId !== ALL_CITIES) {
    const city = cityById(cityId);
    if (city) return `${city.name}, ${city.province}`;
  }
  if (province !== ALL_PROVINCES) return provinceData[province]?.name ?? province;
  return "Canada";
}

export function householdDemand(
  profile: Profile,
  options: { province: string; cityId: string; intlOnly?: boolean },
): HouseholdDemand {
  const market = householdMarket(profile);
  const city = options.cityId === ALL_CITIES ? undefined : cityById(options.cityId);
  const province = city && options.province === ALL_PROVINCES ? city.province : options.province;
  const cityId = options.cityId;
  const metric: DemandMetric = options.intlOnly ? "intlShare" : "score";
  const groups = market.adults.map((adult) => ({
    adult,
    current: demandFor(adult.member.profession, { province, cityId }),
    series: demandSeries(adult.member.profession, { province, cityId }),
    metric,
  }));
  return {
    groups,
    placeLabel: placeLabel(province, cityId),
  };
}
