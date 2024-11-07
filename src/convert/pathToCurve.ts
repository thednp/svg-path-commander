import segmentToCubic from "../process/segmentToCubic";
import { AbsoluteCommand, CSegment, CurveArray, PathArray } from "../types";
import iterate from "../process/iterate";
import parsePathString from "../parser/parsePathString";
import normalizeSegment from "../process/normalizeSegment";
import paramsParser from "../parser/paramsParser";

/**
 * Parses a path string value or 'pathArray' and returns a new one
 * in which all segments are converted to cubic-bezier.
 *
 * In addition, un-necessary `Z` segment is removed if previous segment
 * extends to the `M` segment.
 *
 * @param pathInput the string to be parsed or 'pathArray'
 * @returns the resulted `pathArray` converted to cubic-bezier
 */
const pathToCurve = (pathInput: string | PathArray): CurveArray => {
  const params = { ...paramsParser };
  const path = parsePathString(pathInput);

  return iterate<CurveArray>(path, (seg, index, lastX, lastY) => {
    params.x = lastX;
    params.y = lastY;
    const normalSegment = normalizeSegment(seg, params);
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
  });
};
export default pathToCurve;
