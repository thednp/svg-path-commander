import { segmentToCubic } from "../process/segmentToCubic.ts";
import type { AbsoluteCommand, CSegment, CurveArray, PathArray, PathCommand } from "../types.ts";
import { iterate } from "../process/iterate.ts";
import { parsePathString } from "../parser/parsePathString.ts";
import { normalizeSegment } from "../process/normalizeSegment.ts";
import { paramsParser } from "../parser/paramsParser.ts";

/**
 * Parses a path string or PathArray and returns a new one
 * in which all segments are converted to cubic-bezier.
 *
 * @param pathInput - The path string or PathArray
 * @returns The resulted CurveArray with all segments as cubic beziers
 *
 * @example
 * ```ts
 * pathToCurve('M10 50q15 -25 30 0')
 * // => [['M', 10, 50], ['C', 20, 33.3333, 30, 33.3333, 40, 50]]
 * ```
 */
export const pathToCurve = <T extends PathArray>(pathInput: string | T): CurveArray => {
  const params = { ...paramsParser };
  const path = parsePathString(pathInput);
  let prevCommand: PathCommand | null = null;
  // let mx = 0;
  // let my = 0;

  return iterate(path, (seg, index, lastX, lastY) => {
    params.x = lastX;
    params.y = lastY;
    const normalSegment = normalizeSegment(seg, params, prevCommand);
    if (normalSegment[0] === "M") {
      params.mx = normalSegment[1];
      params.my = normalSegment[2];
    }
    let result = segmentToCubic(normalSegment, params);
    const isLongArc = result[0] === "C" && result.length > 7;

    if (isLongArc) {
      // an arc of more than 120 degrees is converted to more than one cubic
      // segment, the first one stays in place and the rest are inserted
      // after it, one segment each
      const values = result as unknown as (number | AbsoluteCommand)[];
      const segments: CSegment[] = [];
      for (let i = 7; i < values.length; i += 6) {
        segments.push(["C" as AbsoluteCommand | number].concat(values.slice(i, i + 6)) as CSegment);
      }
      path.splice(index + 1, 0, ...segments);
      result = values.slice(0, 7) as CSegment;
    }

    const seglen = result.length;
    params.x1 = +result[seglen - 2];
    params.y1 = +result[seglen - 1];
    // only cubic segments carry a reflectable control point, quadratics
    // are converted to cubics, so their control point is not reflectable
    if (normalSegment[0] === "C") {
      params.x2 = +result[seglen - 4];
      params.y2 = +result[seglen - 3];
    } else {
      params.x2 = null;
      params.y2 = null;
    }
    prevCommand = normalSegment[0];

    return result;
  }) as CurveArray;
};
