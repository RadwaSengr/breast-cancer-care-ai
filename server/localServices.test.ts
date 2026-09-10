import { describe, expect, it } from "vitest";
import { bahyaLocalGuide, bahyaSources, isOfficialBahyaSource } from "../client/src/lib/localServices";

describe("local services guide source controls", () => {
  it("keeps every published reference on Bahya's official domain", () => {
    expect(Object.values(bahyaSources).every(isOfficialBahyaSource)).toBe(true);
  });

  it("exposes a hotline, verification date, and two source-linked locations", () => {
    expect(bahyaLocalGuide.hotline).toBe("16602");
    expect(bahyaLocalGuide.verifiedOn).toBe("2026-08-18");
    expect(bahyaLocalGuide.locations).toHaveLength(2);
    expect(bahyaLocalGuide.locations.every(location => location.mapUrl.startsWith("https://maps.app.goo.gl/"))).toBe(true);
  });
});
