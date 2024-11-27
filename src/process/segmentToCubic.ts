import arcToCubic from "./arcToCubic";
import quadToCubic from "./quadToCubic";
import lineToCubic from "./lineToCubic";
import type { CSegment, MSegment, PathSegment } from "../types";
import type { ParserParams } from "../interface";

/**
 * Converts any segment to C (cubic-bezier).
 *
 * @param segment the source segment
 * @param params the source segment parameters
 * @returns the cubic-bezier segment
 */
const segmentToCubic = (segment: PathSegment, params: ParserParams) => {
  const [pathCommand] = segment;
  const values = segment.slice(1).map(Number);
  const [x, y] = values;
  // let args;
  const { x1: px1, y1: py1, x: px, y: py } = params;

  if (!"TQ".includes(pathCommand)) {
    params.qx = null;
    params.qy = null;
  }

  if (pathCommand === "M") {
    params.x = x;
    params.y = y;
    return segment;
  } else if (pathCommand === "A") {
    return ["C" as string | number].concat(
      arcToCubic(
        px1,
        py1,
        values[0],
        values[1],
        values[2],
        values[3],
        values[4],
        values[5],
        values[6],
      ),
    ) as CSegment;
  } else if (pathCommand === "Q") {
    params.qx = x;
    params.qy = y;
    return ["C" as string | number].concat(
      quadToCubic(px1, py1, values[0], values[1], values[2], values[3]),
    ) as CSegment;
  } else if (pathCommand === "L") {
    return ["C" as string | number].concat(
      lineToCubic(px1, py1, x, y),
    ) as CSegment;
  } else if (pathCommand === "Z") {
    return ["C" as string | number].concat(
      lineToCubic(px1, py1, px, py),
    ) as CSegment;
  }

  return segment as MSegment | CSegment;
};
export default segmentToCubic;
