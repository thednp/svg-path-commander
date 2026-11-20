import type {
  CSegment,
  LSegment,
  MSegment,
  NormalSegment,
  PathArray,
  PathSegment,
  PointTuple,
  QSegment,
} from "../types.ts";
import { getLineLength } from "../math/lineTools.ts";
import { getArcLength } from "../math/arcTools.ts";
import { getCubicLength } from "../math/cubicTools.ts";
import { getQuadLength } from "../math/quadTools.ts";
import { iterate } from "../process/iterate.ts";
import { parsePathString } from "../parser/parsePathString.ts";
import { absolutizeSegment } from "../process/absolutizeSegment.ts";

/**
 * The measured properties of a single path segment.
 */
export type SegmentMeasure = {
  /** the original (non-normalized) segment */
  segment: PathSegment;
  /** the index of the segment in the path */
  index: number;
  /** the length of the segment itself */
  length: number;
  /** the accumulated length of all segments before this one */
  lengthAtSegment: number;
  /** the absolute X coordinate the segment starts at */
  startX: number;
  /** the absolute Y coordinate the segment starts at */
  startY: number;
  /** the absolute X coordinate the segment ends at */
  endX: number;
  /** the absolute Y coordinate the segment ends at */
  endY: number;
  /** the absolute segment, with the shorthand commands expanded */
  geometry: NormalSegment;
};

/**
 * Measures every segment of a path in a single pass.
 *
 * This is the one source of truth for the length math: it absolutises relative
 * segments, rewrites `H`/`V` to `L` and carries the reflectable control-point
 * state for `S`/`T`, exactly like `getTotalLength` does. Every consumer that
 * needs per-segment lengths reads them from here so they cannot disagree with
 * each other.
 *
 * @param pathInput - the target path string or `PathArray`
 * @returns the measured segments, in path order
 */
export const measureSegments = (pathInput: string | PathArray): SegmentMeasure[] => {
  const path = parsePathString(pathInput);
  const measures: SegmentMeasure[] = [];
  let paramX1 = 0;
  let paramY1 = 0;
  let paramX2 = 0;
  let paramY2 = 0;
  // keep null check #64
  let paramQX: number | null = null;
  let paramQY: number | null = null;
  let pathCommand = "M";
  let mx = 0;
  let my = 0;
  let totalLength = 0;

  iterate(path, (seg, index, lastX, lastY) => {
    [pathCommand] = seg;
    const absCommand = pathCommand.toUpperCase();
    const isRelative = absCommand !== pathCommand;
    const absoluteSegment = isRelative
      ? absolutizeSegment(seg, index, lastX, lastY)
      : (seg.slice(0) as typeof seg);

    const normalSegment =
      absCommand === "V"
        ? (["L", lastX, absoluteSegment[1]] as LSegment)
        : absCommand === "H"
          ? (["L", absoluteSegment[1], lastY] as LSegment)
          : absoluteSegment;
    [pathCommand] = normalSegment;

    if (!"TQ".includes(absCommand)) {
      // keep null check #64
      paramQX = null;
      paramQY = null;
    }

    let length = 0;
    // the absolute segment, with the shorthand commands expanded: the
    // reflected control point of an `S` or a `T` is resolved here, so the
    // geometry and the length of a segment always agree
    let geometry = normalSegment as NormalSegment;

    // this segment is always ZERO
    /* istanbul ignore else */
    if (pathCommand === "M") {
      // remember mx, my for Z
      [, mx, my] = normalSegment as MSegment;
    } else if (pathCommand === "L") {
      length = getLineLength(lastX, lastY, normalSegment[1] as number, normalSegment[2] as number);
    } else if (pathCommand === "A") {
      length = getArcLength(
        lastX,
        lastY,
        normalSegment[1] as number,
        normalSegment[2] as number,
        normalSegment[3] as number,
        normalSegment[4] as number,
        normalSegment[5] as number,
        normalSegment[6] as number,
        normalSegment[7] as number,
      );
    } else if (pathCommand === "S") {
      const cp1x = paramX1 * 2 - paramX2;
      const cp1y = paramY1 * 2 - paramY2;

      geometry = [
        "C",
        cp1x,
        cp1y,
        normalSegment[1] as number,
        normalSegment[2] as number,
        normalSegment[3] as number,
        normalSegment[4] as number,
      ] as CSegment;
      length = getCubicLength(
        lastX,
        lastY,
        cp1x,
        cp1y,
        normalSegment[1] as number,
        normalSegment[2] as number,
        normalSegment[3] as number,
        normalSegment[4] as number,
      );
    } else if (pathCommand === "C") {
      length = getCubicLength(
        lastX,
        lastY,
        normalSegment[1] as number,
        normalSegment[2] as number,
        normalSegment[3] as number,
        normalSegment[4] as number,
        normalSegment[5] as number,
        normalSegment[6] as number,
      );
    } else if (pathCommand === "T") {
      // keep null check #64
      paramQX = paramQX === null ? lastX : paramX1 * 2 - paramQX;
      paramQY = paramQY === null ? lastY : paramY1 * 2 - paramQY;
      geometry = [
        "Q",
        paramQX,
        paramQY,
        normalSegment[1] as number,
        normalSegment[2] as number,
      ] as QSegment;
      length = getQuadLength(
        lastX,
        lastY,
        paramQX,
        paramQY,
        normalSegment[1] as number,
        normalSegment[2] as number,
      );
    } else if (pathCommand === "Q") {
      paramQX = normalSegment[1] as number;
      paramQY = normalSegment[2] as number;
      length = getQuadLength(
        lastX,
        lastY,
        normalSegment[1] as number,
        normalSegment[2] as number,
        normalSegment[3] as number,
        normalSegment[4] as number,
      );
    } else if (pathCommand === "Z") {
      length = getLineLength(lastX, lastY, mx, my);
    }

    // the close segment returns to the start of the sub-path
    const [endX, endY] = pathCommand === "Z" ? [mx, my] : (geometry.slice(-2) as PointTuple);

    measures.push({
      segment: seg,
      index,
      length,
      lengthAtSegment: totalLength,
      startX: lastX,
      startY: lastY,
      endX,
      endY,
      geometry,
    });
    totalLength += length;

    // update params
    [paramX1, paramY1] = pathCommand === "Z" ? [mx, my] : (normalSegment.slice(-2) as PointTuple);
    [paramX2, paramY2] =
      pathCommand === "C"
        ? ([normalSegment[3], normalSegment[4]] as PointTuple)
        : pathCommand === "S"
          ? ([normalSegment[1], normalSegment[2]] as PointTuple)
          : [paramX1, paramY1];
  });

  return measures;
};
