import type { ParserParams } from "../interface.ts";
import type {
  ASegment,
  CSegment,
  HSegment,
  LSegment,
  MSegment,
  NormalSegment,
  PathCommand,
  PathSegment,
  PointTuple,
  QSegment,
  VSegment,
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
  const values = segment.slice(1) as number[];
  let absValues = values.map((n, j) => n + (isRelative ? (j % 2 ? y : x) : 0));

  if (!"TQ".includes(absCommand)) {
    // optional but good to be cautious
    params.qx = null;
    params.qy = null;
  }

  // istanbul ignore else @preserve
  if (absCommand === "A") {
    absValues = values.slice(0, -2).concat(
      values[5] + (isRelative ? x : 0),
      values[6] + (isRelative ? y : 0),
    );

    return ["A" as PathCommand | number].concat(absValues) as ASegment;
  } else if (absCommand === "H") {
    return [
      "L",
      (segment as HSegment)[1] + (isRelative ? x : 0),
      y,
    ] as LSegment;
  } else if (absCommand === "V") {
    return [
      "L",
      x,
      (segment as VSegment)[1] + (isRelative ? y : 0),
    ] as LSegment;
  } else if (absCommand === "L") {
    return [
      "L",
      (segment as LSegment)[1] + (isRelative ? x : 0),
      (segment as LSegment)[2] + (isRelative ? y : 0),
    ] as LSegment;
  } else if (absCommand === "M") {
    return [
      "M",
      (segment as MSegment)[1] + (isRelative ? x : 0),
      (segment as MSegment)[2] + (isRelative ? y : 0),
    ] as MSegment;
  } else if (absCommand === "C") {
    return ["C" as PathCommand | number].concat(absValues) as CSegment;
  } else if (absCommand === "S") {
    // the control point is only reflected when the previous segment
    // is a cubic, otherwise it coincides with the current point
    const canReflect = prevCommand != null && "CS".includes(prevCommand);
    const x1 = canReflect && params.x2 != null ? x * 2 - params.x2 : x;
    const y1 = canReflect && params.y2 != null ? y * 2 - params.y2 : y;
    return ["C", x1, y1].concat(absValues) as CSegment;
  } else if (absCommand === "T") {
    // keep null check #64
    const qx = params.qx != null ? x * 2 - params.qx : x;
    const qy = params.qy != null ? y * 2 - params.qy : y;
    params.qx = qx;
    params.qy = qy;
    return ["Q", qx, qy].concat(absValues) as QSegment;
  } else if (absCommand === "Q") {
    const [nqx, nqy] = absValues as PointTuple;
    params.qx = nqx;
    params.qy = nqy;
    return ["Q" as PathCommand | number].concat(absValues) as QSegment;
  } else if (absCommand === "Z") {
    return ["Z"] as NormalSegment;
  }

  // istanbul ignore next @preserve
  return segment as NormalSegment;
};
