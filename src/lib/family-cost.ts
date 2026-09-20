import { demandFor, demandLabel } from "@/data/job-demand";
import { familyFeesFor } from "@/data/family-fees";
import { irccTimeFor } from "@/data/ircc-times";
import { familyLinkById } from "@/data/family-links";
import { requiredIncome, sizeFor } from "@/data/family-lico";
import { familyHasSpouse, financialCapacityAmount, type Profile } from "@/data/profile";
import { provinceCode } from "@/data/provinces";
import { salaryForProfession } from "@/lib/finance";
import { defaultCityId, livingBasket } from "@/lib/living-basket";

export function reunitedLivingExtras(profile: Profile): { extraAdults: number } {
  if (profile.familyLink === "parent") return { extraAdults: 1 };
  if (profile.familyLink === "spouse" && !familyHasSpouse(profile.family)) return { extraAdults: 1 };
  return { extraAdults: 0 };
}

export function familyCost(profile: Profile) {
  const link = familyLinkById(profile.familyLink);
  const familySize = sizeFor(profile);
  const incomeRequired = requiredIncome(profile.province, familySize, link?.id ?? "");
  const sponsorMid = salaryForProfession(profile.applicant.profession, profile.province)[1];
  const extras = reunitedLivingExtras(profile);
  const basket = livingBasket(profile, defaultCityId(profile), extras);
  const livingReunitedAnnual = basket.total * 12;
  const reminder = link?.id === "spouse" && !familyHasSpouse(profile.family);
  const sponsored =
    link?.id === "spouse" && familyHasSpouse(profile.family)
      ? (() => {
          const profession = profile.spouse.profession;
          const [low, mid, high] = salaryForProfession(profession, profile.province);
          const employability = demandFor(profession, { province: provinceCode(profile.province) }).score;
          return {
            profession,
            low,
            mid,
            high,
            employability,
            employabilityLabel: demandLabel(employability),
          };
        })()
      : undefined;
  const child = link?.id === "child" ? profile.children[0] : undefined;
  const childSponsored = child
    ? { firstName: child.firstName, age: child.age, inSchool: child.age < 18 }
    : undefined;

  return {
    link,
    sponsorStatus: profile.sponsorStatus,
    undertakingYears: link?.undertakingYears,
    familySize,
    incomeRequired,
    sponsorMid,
    sponsorCapacity: financialCapacityAmount(profile.applicant.salary),
    incomeGap: incomeRequired - sponsorMid,
    feesTotal: familyFeesFor(profile).total,
    livingReunitedAnnual,
    delay: irccTimeFor("family"),
    sponsored,
    childSponsored,
    superVisa: link?.superVisaAlt ?? false,
    reminder,
    extraAdults: extras.extraAdults,
  };
}
