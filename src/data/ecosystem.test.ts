import { describe, expect, it } from "vitest";
import { sections } from "@/catalog";
import {
  IR_CTA,
  IR_SITE_LABEL,
  IR_SITE_URL,
  IR_WHATSAPP_LABEL,
  IR_WHATSAPP_URL,
  ecosystemPillars,
} from "@/data/ecosystem";

describe("ecosystem catalog", () => {
  it("keeps a single ecosystem slide", () => {
    expect(sections.find((section) => section.id === "ecosysteme")?.slideCount).toBe(1);
  });
});

describe("ecosystemPillars", () => {
  it("lists immigration, recruitment and concierge with live site URLs", () => {
    expect(ecosystemPillars.map((pillar) => pillar.id)).toEqual(["immigration", "recruitment", "concierge"]);
    expect(ecosystemPillars.map((pillar) => pillar.title)).toEqual(["Immigration", "Recrutement", "Conciergerie"]);
    expect(ecosystemPillars[1]?.tag).toMatch(/Industrielle RH/i);
    expect(ecosystemPillars[1]?.body).toContain("garanti");
    expect(ecosystemPillars.map((pillar) => pillar.url)).toEqual([
      "https://ir-immigration.com/",
      "https://industriellerh.com/",
      "https://ir-conciergerie.com/",
    ]);
    expect(ecosystemPillars.every((pillar) => pillar.image.length > 0)).toBe(true);
  });
});

describe("IR contact", () => {
  it("exposes the pitch site and WhatsApp action", () => {
    expect(IR_SITE_LABEL).toBe("ir-immigration.com");
    expect(IR_SITE_URL).toBe("https://ir-immigration.com/");
    expect(IR_WHATSAPP_LABEL).toBe("WhatsApp 819 919 8683");
    expect(IR_WHATSAPP_URL).toBe("https://wa.me/18199198683");
    expect(IR_CTA).toBe("Prendre rendez-vous");
  });
});
