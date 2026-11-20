import type { PathArray } from "../types.ts";
import { defaultOptions } from "../options/options.ts";
import { iterate } from "./iterate.ts";
import { roundSegment } from "./roundSegment.ts";

/**
 * Rounds the values of a `pathArray` instance to
 * a specified amount of decimals and returns it.
 *
 * @param path the source `pathArray`
 * @param roundOption the amount of decimals to round numbers to
 * @returns the resulted `pathArray` with rounded values
 */
export const roundPath = <T extends PathArray>(path: T, roundOption?: number | "off"): T => {
  let { round } = defaultOptions;
  // allow for ZERO decimals
  round =
    roundOption === "off"
      ? roundOption
      : typeof roundOption === "number" && roundOption >= 0
        ? roundOption
        : typeof round === "number" && round >= 0
          ? round
          : "off";

  /* istanbul ignore else */
  if (round === "off") return path.slice(0) as T;

  // the caller's array must not be modified in place
  return iterate(path.slice(0) as T, (segment) => {
    return roundSegment(segment, round);
  });
};
