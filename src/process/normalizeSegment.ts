import type { ParserParams } from "../interface.ts";
import type {
  ASegment,
  CSegment,
  LSegment,
  MSegment,
  NormalSegment,
  PathCommand,
  PathSegment,
  QSegment,
} from "../types.ts";

/**
 * Normalizes a single segment of a `pathArray` object.
 *
 * @param segment the segment object
 * @param params the normalization parameters
 * @param prevCommand the command of the previous segment
 * @returns the normalized segment
 */
export const normalizeSegment = (
  segment: PathSegment,
  params: ParserParams,
  prevCommand?: PathCommand | null,
): NormalSegment => {
  const [pathCommand] = segment;
  const absCommand = pathCommand.toUpperCase();
  const isRelative = pathCommand !== absCommand;
  const { x, y } = params;

  if (!"TQ".includes(absCommand)) {
    // optional but good to be cautious
    params.qx = null;
    params.qy = null;
  }

  // the absolute value of a parameter of the segment: the x and the y
  // parameters alternate
  const absolute = (index: number): number => {
    const value = segment[index] as number;
    if (!isRelative) return value;
    return index % 2 === 1 ? value + x : value + y;
  };

  // istanbul ignore else
  if (absCommand === "A") {
    // the parameters of an arc that are not points are not offset, only its
    // end point is
    return [
      "A",
      segment[1],
      segment[2],
      segment[3],
      segment[4],
      segment[5],
      (segment[6] as number) + (isRelative ? x : 0),
      (segment[7] as number) + (isRelative ? y : 0),
    ] as ASegment;
  } else if (absCommand === "H") {
    return ["L", absolute(1), y] as LSegment;
  } else if (absCommand === "V") {
    // the only parameter of a vertical line is a y coordinate
    return ["L", x, (segment[1] as number) + (isRelative ? y : 0)] as LSegment;
  } else if (absCommand === "L") {
    return ["L", absolute(1), absolute(2)] as LSegment;
  } else if (absCommand === "M") {
    return ["M", absolute(1), absolute(2)] as MSegment;
  } else if (absCommand === "C") {
    return [
      "C",
      absolute(1),
      absolute(2),
      absolute(3),
      absolute(4),
      absolute(5),
      absolute(6),
    ] as CSegment;
  } else if (absCommand === "S") {
    // the control point is only reflected when the previous segment
    // is a cubic, otherwise it coincides with the current point
    const canReflect = prevCommand != null && "CS".includes(prevCommand);
    const x1 = canReflect && params.x2 != null ? x * 2 - params.x2 : x;
    const y1 = canReflect && params.y2 != null ? y * 2 - params.y2 : y;
    return ["C", x1, y1, absolute(1), absolute(2), absolute(3), absolute(4)] as CSegment;
  } else if (absCommand === "T") {
    // keep null check #64
    const qx = params.qx != null ? x * 2 - params.qx : x;
    const qy = params.qy != null ? y * 2 - params.qy : y;
    params.qx = qx;
    params.qy = qy;
    return ["Q", qx, qy, absolute(1), absolute(2)] as QSegment;
  } else if (absCommand === "Q") {
    const nqx = absolute(1);
    const nqy = absolute(2);
    params.qx = nqx;
    params.qy = nqy;
    return ["Q", nqx, nqy, absolute(3), absolute(4)] as QSegment;
  } else if (absCommand === "Z") {
    return ["Z"] as NormalSegment;
  }

  // istanbul ignore next
  return segment as NormalSegment;
};
