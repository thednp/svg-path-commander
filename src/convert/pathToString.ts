import type { PathArray, PathSegment } from "../types";
import { defaultOptions } from "../options/options";
import { roundTo } from "../math/roundTo";

/**
 * Returns a valid `d` attribute string value created
 * by rounding values and concatenating the PathArray segments.
 *
 * @param path - The PathArray object
 * @param roundOption - Amount of decimals to round values to, or "off"
 * @returns The concatenated path string
 *
 * @example
 * ```ts
 * pathToString([['M', 10, 10], ['L', 90, 90]], 2)
 * // => 'M10 10L90 90'
 * ```
 */
export const pathToString = <T extends PathArray>(
  path: T,
  roundOption?: number | "off",
): string => {
  const pathLen = path.length;
  let { round } = defaultOptions;
  let segment = path[0] as PathSegment;
  let result = "";

  // allow for ZERO decimals
  round = roundOption === "off"
    ? roundOption
    : typeof roundOption === "number" && roundOption >= 0
    ? roundOption
    : typeof round === "number" && round >= 0
    ? round
    : "off";

  for (let i = 0; i < pathLen; i += 1) {
    segment = path[i];
    const [pathCommand] = segment;
    const values = segment.slice(1) as number[];
    result += pathCommand;
    if (round === "off") {
      result += values.join(" ");
    } else {
      let j = 0;
      const valLen = values.length;
      while (j < valLen) {
        result += roundTo(values[j], round);
        if (j !== valLen - 1) result += " ";
        j += 1;
      }
    }
  }

  return result;
};
