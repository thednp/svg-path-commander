import type { PathArray } from "../types.ts";
import { defaultOptions } from "../options/options.ts";

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
  let segment = path[0] as PathArray[number];
  let result = "";

  // allow for ZERO decimals
  round = roundOption === "off"
    ? roundOption
    : typeof roundOption === "number" && roundOption >= 0
    ? roundOption
    : typeof round === "number" && round >= 0
    ? round
    : "off";

  const pow = round === "off" ? 0 : 10 ** round;

  for (let i = 0; i < pathLen; i += 1) {
    segment = path[i];
    const pathCommand = segment[0] as string;
    const segLen = segment.length;
    result += pathCommand;
    if (round === "off") {
      for (let j = 1; j < segLen; j += 1) {
        result += segment[j] as number;
        if (j !== segLen - 1) result += " ";
      }
    } else {
      for (let j = 1; j < segLen; j += 1) {
        result += Math.round((segment[j] as number) * pow) / pow;
        if (j !== segLen - 1) result += " ";
      }
    }
  }

  return result;
};
