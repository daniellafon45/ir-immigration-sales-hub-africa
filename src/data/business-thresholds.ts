export const BUSINESS_THRESHOLD_CODES = [
  "QC",
  "ON",
  "AB",
  "MB",
  "NB",
  "BC",
  "SK",
  "NS",
  "PE",
  "NL",
  "YT",
  "NT",
  "NU",
] as const;

type BusinessThresholdCode = (typeof BUSINESS_THRESHOLD_CODES)[number];
type ThresholdRow = Record<BusinessThresholdCode, number>;

export const businessThresholdsLabel = "Données de démonstration";
export const businessThresholdsRetrievedAt = "2026-09-19";

export const c11WorkingCapital: ThresholdRow = {
  QC: 100000,
  ON: 150000,
  AB: 125000,
  MB: 100000,
  NB: 90000,
  BC: 150000,
  SK: 100000,
  NS: 100000,
  PE: 100000,
  NL: 90000,
  YT: 100000,
  NT: 100000,
  NU: 100000,
};

export const pnpEntrepreneur: ThresholdRow = {
  QC: 200000,
  ON: 250000,
  AB: 200000,
  MB: 150000,
  NB: 150000,
  BC: 300000,
  SK: 150000,
  NS: 175000,
  PE: 150000,
  NL: 150000,
  YT: 150000,
  NT: 150000,
  NU: 150000,
};
