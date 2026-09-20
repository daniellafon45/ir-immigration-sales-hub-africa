export const sourceUrl =
  "https://docs.google.com/spreadsheets/d/1xPJHVvXbmSO9cyPPq11QIag0LxyzJ9-m/edit?gid=2101064675#gid=2101064675";

export type HonorairesTrack = "rp" | "visa" | "studies" | "work";

export type HonorairesRates = {
  service: number;
  extraAdult: number;
  child: number;
};

export const honorairesGrid: Record<HonorairesTrack, HonorairesRates> = {
  rp: { service: 5000, extraAdult: 1500, child: 150 },
  visa: { service: 2000, extraAdult: 500, child: 150 },
  studies: { service: 6000, extraAdult: 0, child: 0 },
  work: { service: 2000, extraAdult: 0, child: 0 },
};
