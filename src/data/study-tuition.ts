import type { StudyLevel } from "@/data/study-programs";

const CODES = ["QC", "ON", "AB", "MB", "NB", "BC", "SK", "NS", "PE", "NL", "YT", "NT", "NU"] as const;

type TuitionRow = Record<(typeof CODES)[number], number>;

export const studyTuition: Record<StudyLevel, TuitionRow> = {
  cegep: {
    QC: 18000,
    ON: 16500,
    AB: 15500,
    MB: 14500,
    NB: 14000,
    BC: 18000,
    SK: 14500,
    NS: 15000,
    PE: 13500,
    NL: 14000,
    YT: 16000,
    NT: 16500,
    NU: 17000,
  },
  bachelor: {
    QC: 24000,
    ON: 38000,
    AB: 28000,
    MB: 18000,
    NB: 17000,
    BC: 36000,
    SK: 20000,
    NS: 20000,
    PE: 18000,
    NL: 19000,
    YT: 22000,
    NT: 23000,
    NU: 24000,
  },
  master: {
    QC: 28000,
    ON: 42000,
    AB: 32000,
    MB: 21000,
    NB: 20000,
    BC: 40000,
    SK: 23000,
    NS: 23000,
    PE: 21000,
    NL: 22000,
    YT: 25000,
    NT: 26000,
    NU: 27000,
  },
  doctorate: {
    QC: 20000,
    ON: 22000,
    AB: 18000,
    MB: 16000,
    NB: 15500,
    BC: 21000,
    SK: 16500,
    NS: 17000,
    PE: 16000,
    NL: 16500,
    YT: 18000,
    NT: 18500,
    NU: 19000,
  },
};

export function tuitionFor(level: StudyLevel, code: string) {
  const row = studyTuition[level];
  return row[code as keyof TuitionRow] ?? row.QC;
}
