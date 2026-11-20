import { describe, expect, test } from "vite-plus/test";
import { getPropertiesAtLength } from "../src/util/getPropertiesAtLength.ts";
import { getSegmentAtLength } from "../src/util/getSegmentAtLength.ts";
import { propertiesAtLengthCases } from "./fixtures/propertiesAtLengthParity.ts";

describe("getPropertiesAtLength parity", () => {
  test("Test the length lookup answers the expected segment metadata", () => {
    propertiesAtLengthCases.forEach(({ path, distance, expected }) => {
      const result = getPropertiesAtLength(path, distance);

      expect(result.segment).to.deep.equal(expected.segment);
      expect(result.index).to.equal(expected.index);
      expect(result.length).to.equal(expected.length);
      expect(result.lengthAtSegment).to.equal(expected.lengthAtSegment);
    });
  });

  test("Test the segment lookup answers the same segment", () => {
    propertiesAtLengthCases.forEach(({ path, distance, expected }) => {
      const result = getSegmentAtLength(path, distance);

      expect(result).to.deep.equal(expected.segment);
    });
  });
});
