import type {
  AbsoluteSegment,
  PathArray,
  PathCommand,
  PathSegment,
} from "../types";
import { pathToAbsolute } from "../convert/pathToAbsolute";
import { shortenSegment } from "./shortenSegment";
import { paramsParser } from "../parser/paramsParser";
import { iterate } from "./iterate";
import { normalizeSegment } from "./normalizeSegment";
import { relativizeSegment } from "./relativizeSegment";
import { roundSegment } from "./roundSegment";

/**
 * Optimizes a PathArray:
 * * converts segments to shorthand if possible
 * * selects shortest representation from absolute and relative forms
 *
 * @param pathInput - A path string or PathArray
 * @param roundOption - Number of decimal places for rounding
 * @returns The optimized PathArray
 *
 * @example
 * ```ts
 * optimizePath('M10 10L10 10L90 90', 2)
 * // => [['M', 10, 10], ['l', 0, 0], ['l', 80, 80]]
 * ```
 */
export const optimizePath = <T extends PathArray>(
  pathInput: T,
  roundOption?: number,
): PathArray => {
  const path = pathToAbsolute(pathInput);
  // allow for ZERO decimals or use an aggressive value of 2
  const round = typeof roundOption === "number" && roundOption >= 0
    ? roundOption
    : 2;
  // this utility overrides the iterator params
  const optimParams = { ...paramsParser };

  const allPathCommands = [] as PathCommand[];
  let pathCommand = "M" as PathCommand;
  let prevCommand = "Z" as PathCommand;

  return iterate(path, (seg, i, lastX, lastY) => {
    optimParams.x = lastX;
    optimParams.y = lastY;
    const normalizedSegment = normalizeSegment(seg, optimParams);
    let result: PathSegment = seg;
    pathCommand = seg[0];

    // Save current path command
    allPathCommands[i] = pathCommand;
    if (i) {
      // Get previous path command for `shortenSegment`
      prevCommand = allPathCommands[i - 1];
      const shortSegment = shortenSegment(
        seg as AbsoluteSegment,
        normalizedSegment,
        optimParams,
        prevCommand,
      );
      const absSegment = roundSegment(shortSegment, round);
      const absString = absSegment.join("");
      const relativeSegment = relativizeSegment(shortSegment, i, lastX, lastY);
      const relSegment = roundSegment(relativeSegment, round);
      const relString = relSegment.join("");
      result = absString.length < relString.length ? absSegment : relSegment;
    }

    const seglen = normalizedSegment.length;
    optimParams.x1 = +normalizedSegment[seglen - 2];
    optimParams.y1 = +normalizedSegment[seglen - 1];
    optimParams.x2 = +normalizedSegment[seglen - 4] || optimParams.x1;
    optimParams.y2 = +normalizedSegment[seglen - 3] || optimParams.y1;

    return result;
  });
};
