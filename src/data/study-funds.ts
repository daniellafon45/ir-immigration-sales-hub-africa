export type StudyFundsBand = {
  student: number;
  spouse: number;
  child: number;
};

export const studyFundsCaq: StudyFundsBand = {
  student: 15078,
  spouse: 5406,
  child: 2703,
};

export function studyFundsLabel(provinceCode: string) {
  return provinceCode === "QC" ? "CAQ" : "IRCC";
}

export function subsistenceFunds(band: StudyFundsBand, hasSpouse: boolean, children: number) {
  return band.student + (hasSpouse ? band.spouse : 0) + Math.max(0, children) * band.child;
}
