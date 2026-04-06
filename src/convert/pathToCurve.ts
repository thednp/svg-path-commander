import { segmentToCubic } from "../process/segmentToCubic";
import { AbsoluteCommand, CSegment, CurveArray, PathArray } from "../types";
import { iterate } from "../process/iterate";
import { parsePathString } from "../parser/parsePathString";
import { normalizeSegment } from "../process/normalizeSegment";
import { paramsParser } from "../parser/paramsParser";

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
 * // => [['M', 10, 50], ['C', 25, 25, 40, 50, 40, 50]]
 * ```
 */
export const pathToCurve = <T extends PathArray>(
  pathInput: string | T,
): CurveArray => {
  const params = { ...paramsParser };
  const path = parsePathString(pathInput);
  // let mx = 0;
  // let my = 0;

  return iterate(path, (seg, index, lastX, lastY) => {
    params.x = lastX;
    params.y = lastY;
    const normalSegment = normalizeSegment(seg, params);
    if (normalSegment[0] === "M") {
      params.mx = normalSegment[1];
      params.my = normalSegment[2];
    }
    let result = segmentToCubic(normalSegment, params);
    const isLongArc = result[0] === "C" && result.length > 7;

    if (isLongArc) {
      path.splice(
        index + 1,
        0,
        ["C" as AbsoluteCommand | number].concat(result.slice(7)) as CSegment,
      );
      result = result.slice(0, 7) as CSegment;
    }

    const seglen = result.length;
    params.x1 = +result[seglen - 2];
    params.y1 = +result[seglen - 1];
    params.x2 = +result[seglen - 4] || params.x1;
    params.y2 = +result[seglen - 3] || params.y1;

    return result;
  }) as CurveArray;
};
