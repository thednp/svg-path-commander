import type { PathArray } from "../types";
import { defaultOptions } from "../options/options";
import { iterate } from "./iterate";
import { roundSegment } from "./roundSegment";

/**
 * Rounds the values of a `pathArray` instance to
 * a specified amount of decimals and returns it.
 *
 * @param path the source `pathArray`
 * @param roundOption the amount of decimals to round numbers to
 * @returns the resulted `pathArray` with rounded values
 */
export const roundPath = <T extends PathArray>(
  path: T,
  roundOption?: number | "off",
): T => {
  let { round } = defaultOptions;
  // allow for ZERO decimals
  round = roundOption === "off"
    ? roundOption
    : typeof roundOption === "number" && roundOption >= 0
    ? roundOption
    : typeof round === "number" && round >= 0
    ? round
    : "off";

  /* istanbul ignore else @preserve */
  if (round === "off") return path.slice(0) as T;

  return iterate(path, (segment) => {
    return roundSegment(segment, round);
  });
};
