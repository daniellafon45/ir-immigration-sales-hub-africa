import {
  extraPrincipalMode,
  familyHasChildren,
  familyHasSpouse,
  familyIsPolygamous,
  type AdultMember,
  type ChildMember,
  type Profile,
} from "@/data/profile";
import { salaryForProfession } from "@/lib/finance";
import { familyLabel, recommendPrincipal, type AdultRole } from "@/lib/principal";
import { studentMember } from "@/lib/study-program";

export type HouseholdMarketAdult = {
  role: AdultRole;
  label: string;
  member: AdultMember;
  selected: boolean;
  low: number;
  mid: number;
  high: number;
};

export type HouseholdMarket = {
  adults: HouseholdMarketAdult[];
  principal: HouseholdMarketAdult;
  accompanying: HouseholdMarketAdult | undefined;
  excluded: HouseholdMarketAdult[];
  kids: ChildMember[];
  family: string;
  province: string;
  polygamous: boolean;
};

function marketFor(
  member: AdultMember,
  role: AdultRole,
  label: string,
  selected: boolean,
  province: string,
): HouseholdMarketAdult {
  const [low, mid, high] = salaryForProfession(member.profession, province);
  return {
    role,
    label,
    member,
    selected,
    low,
    mid,
    high,
  };
}

export function householdMarket(profile: Profile): HouseholdMarket {
  const analysis = recommendPrincipal(profile);
  const polygamous = familyIsPolygamous(profile.family);
  const province = profile.province;
  const selected = analysis.selected;
  const adults: HouseholdMarketAdult[] = [
    marketFor(studentMember(profile), "applicant", "Candidat", selected === "applicant", province),
  ];

  if (familyHasSpouse(profile.family)) {
    adults.push(
      marketFor(
        profile.spouse,
        "spouse",
        polygamous ? "Épouse 1" : "Conjoint",
        selected === "spouse",
        province,
      ),
    );
    if (polygamous) {
      profile.extraSpouses.forEach((spouse, index) => {
        const role = extraPrincipalMode(spouse.id);
        adults.push(marketFor(spouse, role, `Épouse ${index + 2}`, selected === role, province));
      });
    }
  }

  const principal = adults.find((adult) => adult.selected) ?? adults[0];
  const accompanying = analysis.accompanying
    ? adults.find((adult) => adult.role === analysis.accompanying?.role)
    : undefined;
  const excluded = analysis.excluded
    .map((adult) => adults.find((item) => item.role === adult.role))
    .filter((adult): adult is HouseholdMarketAdult => Boolean(adult));

  return {
    adults,
    principal,
    accompanying,
    excluded,
    kids: familyHasChildren(profile.family) ? profile.children : [],
    family: familyLabel(profile),
    province,
    polygamous,
  };
}

