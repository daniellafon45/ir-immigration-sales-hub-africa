import {
  extraPrincipalMode,
  familyHasSpouse,
  familyIsPolygamous,
  financialCapacityAmount,
  type AdultMember,
  type ExtraSpouse,
  type PrincipalMode,
  type Profile,
} from "@/data/profile";

const LANG: Record<string, number> = {
  Débutant: 0,
  Intermédiaire: 3,
  Avancé: 6,
  Bilingue: 8,
};

const EDU: Record<string, number> = {
  Secondaire: 2,
  "Formation professionnelle": 4,
  "DEC / Collège": 5,
  "Baccalauréat / Licence": 7,
  "Maîtrise / Master": 9,
  Doctorat: 10,
};

const SKILLED = new Set([
  "Comptable",
  "Analyste financier",
  "Infirmier(ère)",
  "Développeur logiciel",
  "Analyste en TI",
  "Électromécanicien",
  "Électricien",
  "Ingénieur",
  "Enseignant(e)",
]);

const DEMAND_SECTORS = new Set([
  "Santé",
  "Technologies de l’information",
  "Ingénierie",
  "Construction et métiers",
  "Finance et comptabilité",
]);

export type AdultScore = {
  total: number;
  age: number;
  language: number;
  education: number;
  experience: number;
  occupation: number;
  salary: number;
};

export type AdultRole = "applicant" | "spouse" | `extra:${string}`;

export type ScoredAdult = {
  role: AdultRole;
  member: AdultMember;
  score: AdultScore;
  eligible: boolean;
  label: string;
};

const EMPTY_SCORE: AdultScore = {
  total: -1,
  age: 0,
  language: 0,
  education: 0,
  experience: 0,
  occupation: 0,
  salary: 0,
};

export function isAdultComplete(member: AdultMember) {
  return member.firstName.trim().length > 0;
}

export function scoreAdult(member: AdultMember, province: string): AdultScore {
  const age = ageScore(member.age);
  const language = languageScore(member, province);
  const education = EDU[member.education] ?? 4;
  const experience = Math.min(Math.max(member.experience, 0), 8) * 1.5;
  const occupation =
    (SKILLED.has(member.profession) ? 6 : 2) + (DEMAND_SECTORS.has(member.sector) ? 3 : 0);
  const salary = salaryScore(member.salary);
  const total = age + language + education + experience + occupation + salary;
  return { total, age, language, education, experience, occupation, salary };
}

export function listSpouses(profile: Profile): Array<AdultMember | ExtraSpouse> {
  if (!familyHasSpouse(profile.family)) return [];
  if (!familyIsPolygamous(profile.family)) return [profile.spouse];
  return [profile.spouse, ...profile.extraSpouses];
}

export function scoredAdults(profile: Profile): ScoredAdult[] {
  const polygamous = familyIsPolygamous(profile.family);
  const people: ScoredAdult[] = [
    {
      role: "applicant",
      member: profile.applicant,
      score: scoreAdult(profile.applicant, profile.province),
      eligible: true,
      label: profile.applicant.firstName || "Candidat",
    },
  ];

  if (familyHasSpouse(profile.family)) {
    people.push({
      role: "spouse",
      member: profile.spouse,
      score: isAdultComplete(profile.spouse)
        ? scoreAdult(profile.spouse, profile.province)
        : EMPTY_SCORE,
      eligible: isAdultComplete(profile.spouse),
      label: polygamous
        ? profile.spouse.firstName || "Épouse 1"
        : profile.spouse.firstName || "Conjoint",
    });
    if (polygamous) {
      profile.extraSpouses.forEach((spouse, index) => {
        people.push({
          role: extraPrincipalMode(spouse.id),
          member: spouse,
          score: isAdultComplete(spouse) ? scoreAdult(spouse, profile.province) : EMPTY_SCORE,
          eligible: isAdultComplete(spouse),
          label: spouse.firstName || `Épouse ${index + 2}`,
        });
      });
    }
  }

  return people;
}

export function recommendPrincipal(profile: Profile) {
  const adults = scoredAdults(profile);
  const applicant = adults[0];
  const spouse = adults.find((adult) => adult.role === "spouse");
  const eligible = adults.filter((adult) => adult.eligible);
  const challengers = eligible.filter((adult) => adult.role !== "applicant");
  const bestChallenger = challengers.reduce<ScoredAdult | undefined>(
    (best, adult) => (!best || adult.score.total > best.score.total ? adult : best),
    undefined,
  );

  const recommended: AdultRole =
    bestChallenger && bestChallenger.score.total > applicant.score.total + 2
      ? bestChallenger.role
      : "applicant";

  const selected = resolveSelected(profile.principalMode, recommended, eligible);
  const selectedAdult = eligible.find((adult) => adult.role === selected) ?? applicant;
  const { accompanying, excluded } = householdRoles(profile, selected, eligible);

  return {
    recommended,
    selected,
    applicantScore: applicant.score,
    spouseScore: spouse?.score ?? EMPTY_SCORE,
    spouseEligible: Boolean(spouse?.eligible),
    adults,
    selectedAdult,
    accompanying,
    excluded,
    reasons: buildReasons(profile, selectedAdult, accompanying, excluded, recommended, adults),
  };
}

export function getPrincipalMember(profile: Profile): AdultMember {
  return recommendPrincipal(profile).selectedAdult.member;
}

export function familyLabel(profile: Profile) {
  const kids =
    familyHasSpouse(profile.family) || profile.family.includes("enfant")
      ? profile.children.filter((child) => child.firstName.trim() || child.age > 0).length
      : 0;
  const kidLabel = kids === 1 ? "1 enfant" : `${kids} enfants`;

  if (profile.family === "Seul(e)") return "Seul(e)";
  if (familyIsPolygamous(profile.family)) {
    const wives = Math.max(2, 1 + profile.extraSpouses.length);
    const base = `Polygame, ${wives} conjointes`;
    return kids > 0 ? `${base}, ${kidLabel}` : base;
  }
  if (kids > 0) {
    return familyHasSpouse(profile.family) ? `Couple, ${kidLabel}` : `Parent seul, ${kidLabel}`;
  }
  return familyHasSpouse(profile.family) ? "Couple" : profile.family;
}

export function pitchView(profile: Profile) {
  const principal = getPrincipalMember(profile);
  return {
    firstName: principal.firstName || profile.applicant.firstName,
    profession: principal.profession,
    age: principal.age,
    french: principal.french,
    english: principal.english,
    experience: principal.experience,
    education: principal.education,
    family: familyLabel(profile),
    province: profile.province,
    objective: profile.objective,
    budget: profile.budget,
    country: profile.country,
  };
}

function resolveSelected(
  mode: PrincipalMode,
  recommended: AdultRole,
  eligible: ScoredAdult[],
): AdultRole {
  if (mode === "auto") return recommended;
  if (eligible.some((adult) => adult.role === mode)) return mode as AdultRole;
  return "applicant";
}

function householdRoles(profile: Profile, selected: AdultRole, eligible: ScoredAdult[]) {
  const remaining = eligible
    .filter((adult) => adult.role !== selected)
    .sort((a, b) => b.score.total - a.score.total);

  if (!familyIsPolygamous(profile.family)) {
    return { accompanying: remaining[0], excluded: remaining.slice(1) };
  }

  const husband = eligible.find((adult) => adult.role === "applicant");
  const wives = eligible
    .filter((adult) => adult.role !== "applicant")
    .sort((a, b) => b.score.total - a.score.total);

  if (selected === "applicant") {
    return { accompanying: wives[0], excluded: wives.slice(1) };
  }

  return {
    accompanying: husband && husband.role !== selected ? husband : remaining[0],
    excluded: wives.filter((wife) => wife.role !== selected),
  };
}

function ageScore(age: number) {
  if (age < 18 || age > 54) return 0;
  if (age <= 35) return 12;
  if (age <= 40) return 8;
  if (age <= 45) return 5;
  return 2;
}

function languageScore(member: AdultMember, province: string) {
  const french = LANG[member.french] ?? 0;
  const english = LANG[member.english] ?? 0;
  const quebecBonus = province === "Québec" ? french * 0.4 : 0;
  return french + english * 0.8 + quebecBonus;
}

function salaryScore(capacity: string) {
  const salary = financialCapacityAmount(capacity);
  if (salary >= 80000) return 6;
  if (salary >= 50000) return 4;
  if (salary >= 25000) return 2;
  return 0;
}

function buildReasons(
  profile: Profile,
  winner: ScoredAdult,
  accompanying: ScoredAdult | undefined,
  excluded: ScoredAdult[],
  recommended: AdultRole,
  adults: ScoredAdult[],
) {
  const challengers = adults.filter((adult) => adult.eligible && adult.role !== winner.role);
  const loser = challengers.find((adult) => adult.role === (recommended === "applicant" ? accompanying?.role : "applicant"))
    ?? challengers[0];

  if (challengers.length === 0) {
    const reasons = [`${profile.applicant.firstName || "Le candidat"} est le seul adulte au dossier.`];
    return withPolygamyNote(profile, reasons, accompanying, excluded);
  }

  if (!loser) {
    return withPolygamyNote(profile, [`${winner.member.firstName} est retenu comme demandeur principal.`], accompanying, excluded);
  }

  const winScore = winner.score;
  const loseScore = loser.score;
  const reasons: string[] = [];

  if (winScore.language > loseScore.language + 1) {
    reasons.push(
      profile.province === "Québec"
        ? `${winner.member.firstName} a un profil linguistique plus fort, un atout au Québec.`
        : `${winner.member.firstName} présente un meilleur niveau de langues.`,
    );
  }
  if (winScore.age > loseScore.age + 1) {
    reasons.push(`${winner.member.firstName} est dans une tranche d’âge plus favorable.`);
  }
  if (winScore.occupation > loseScore.occupation) {
    reasons.push(`Le métier de ${winner.member.firstName} est mieux positionné.`);
  }
  if (winScore.education > loseScore.education) {
    reasons.push(`${winner.member.firstName} a un niveau de diplôme plus élevé.`);
  }
  if (winScore.experience > loseScore.experience) {
    reasons.push(`${winner.member.firstName} accumule davantage d’expérience pertinente.`);
  }
  if (winScore.salary > loseScore.salary) {
    reasons.push(`La capacité financière de ${winner.member.firstName} renforce le dossier économique.`);
  }
  if (reasons.length === 0) {
    reasons.push(
      `Les profils sont proches. ${winner.member.firstName} est retenu, devant ${loser.member.firstName}.`,
    );
  }
  return withPolygamyNote(profile, reasons, accompanying, excluded);
}

function withPolygamyNote(
  profile: Profile,
  reasons: string[],
  accompanying: ScoredAdult | undefined,
  excluded: ScoredAdult[],
) {
  if (!familyIsPolygamous(profile.family) || excluded.length === 0) return reasons;
  const excludedNames = excluded.map((adult) => adult.member.firstName || adult.label).join(" et ");
  const accompanyingName = accompanying?.member.firstName || accompanying?.label || "une conjointe";
  reasons.push(
    `Le Canada ne reconnaît qu’un conjoint. ${accompanyingName} peut accompagner le dossier ; ${excludedNames} reste hors statut conjugal.`,
  );
  return reasons;
}
