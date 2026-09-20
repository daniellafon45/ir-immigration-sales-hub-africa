import salaryBanner from "@/assets/market/salary-banner.jpg";
import opportunitiesBanner from "@/assets/canada-live/pont-metier.jpg";
import jobsBanner from "@/assets/banners/jobs.jpg";
import routesBanner from "@/assets/canada-live/pont-installation.jpg";
import compareBanner from "@/assets/banners/compare.jpg";
import failuresBanner from "@/assets/banners/failures.jpg";
import ecosystemBanner from "@/assets/banners/ecosystem.jpg";
import canadaBanner from "@/assets/banners/canada.jpg";
import emploiConstruction from "@/assets/canada-live/emploi-construction.jpg";
import demoAines from "@/assets/canada-live/demo-aines.jpg";
import pontEquipe from "@/assets/canada-live/pont-equipe.jpg";

export const sectionBanners = {
  opportunities: opportunitiesBanner,
  jobs: jobsBanner,
  salaries: salaryBanner,
  calculators: salaryBanner,
  provinces: salaryBanner,
  routes: routesBanner,
  compare: compareBanner,
  failures: failuresBanner,
  ecosystem: ecosystemBanner,
  canada: canadaBanner,
};

export function canadaLiveBanner(pageId: string): string {
  if (pageId === "emploi") return emploiConstruction;
  if (pageId === "demographie") return demoAines;
  if (pageId === "pont") return pontEquipe;
  return canadaBanner;
}
