export type FamilyLinkId = "spouse" | "child" | "parent";

export type FamilyLink = {
  id: FamilyLinkId;
  name: string;
  undertakingYears: number;
  sponsoredCanWorkAfterLanding: boolean;
  superVisaAlt: boolean;
};

export const familyLinks: FamilyLink[] = [
  {
    id: "spouse",
    name: "Conjoint",
    undertakingYears: 3,
    sponsoredCanWorkAfterLanding: true,
    superVisaAlt: false,
  },
  {
    id: "child",
    name: "Enfant",
    undertakingYears: 10,
    sponsoredCanWorkAfterLanding: false,
    superVisaAlt: false,
  },
  {
    id: "parent",
    name: "Parent",
    undertakingYears: 20,
    sponsoredCanWorkAfterLanding: false,
    superVisaAlt: true,
  },
];

export function familyLinkById(id: string) {
  return familyLinks.find((item) => item.id === id);
}
