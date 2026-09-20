export type WorkPermitId = "lmia" | "imp" | "open" | "ict" | "iec";
export type OpenVsClosed = "closed" | "open" | "varies";

export type WorkPermit = {
  id: WorkPermitId;
  name: string;
  employerTied: boolean;
  needsOffer: boolean;
  openVsClosed: OpenVsClosed;
};

export const workPermits: WorkPermit[] = [
  {
    id: "lmia",
    name: "Permis fermé avec EIMT",
    employerTied: true,
    needsOffer: true,
    openVsClosed: "closed",
  },
  {
    id: "imp",
    name: "Permis fermé avec exemption IMP",
    employerTied: true,
    needsOffer: true,
    openVsClosed: "closed",
  },
  {
    id: "open",
    name: "Permis de travail ouvert",
    employerTied: false,
    needsOffer: false,
    openVsClosed: "open",
  },
  {
    id: "ict",
    name: "Transfert intraentreprise",
    employerTied: true,
    needsOffer: true,
    openVsClosed: "closed",
  },
  {
    id: "iec",
    name: "Expérience internationale Canada",
    employerTied: false,
    needsOffer: false,
    openVsClosed: "varies",
  },
];

const permitMap = new Map(workPermits.map((item) => [item.id, item]));

export function workPermitById(id: string) {
  return permitMap.get(id as WorkPermitId);
}
