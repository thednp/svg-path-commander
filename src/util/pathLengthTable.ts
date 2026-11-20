import type { NormalArray, NormalSegment, PointTuple } from "../types.ts";
import { getLineLength, getPointAtLineLength } from "../math/lineTools.ts";
import { getArcLength, getPointAtArcLength } from "../math/arcTools.ts";
import { getCubicLength, getPointAtCubicLength } from "../math/cubicTools.ts";
import { getPointAtQuadLength, getQuadLength } from "../math/quadTools.ts";
import DISTANCE_EPSILON from "./distanceEpsilon.ts";

/**
 * The measured properties of a single segment of a normalized path.
 */
export type NormalizedSegmentMeasure = {
  /** the normalized segment */
  segment: NormalSegment;
  /** the X coordinate the segment starts at */
  startX: number;
  /** the Y coordinate the segment starts at */
  startY: number;
  /** the X coordinate the segment ends at */
  endX: number;
  /** the Y coordinate the segment ends at */
  endY: number;
  /** the length of the segment */
  length: number;
  /** the accumulated length of all segments before this one */
  lengthAtSegment: number;
};

/**
 * The length table of a normalized path.
 *
 * The table holds the length of every segment and the length accumulated
 * before it, so a point at any distance can be found with a binary search
 * over the accumulated lengths instead of a walk over the whole path.
 */
export type PathLengthTable = {
  /** the measured segments, in path order */
  measures: NormalizedSegmentMeasure[];
  /** the total length of the path */
  totalLength: number;
  /** the X coordinate the path starts at */
  startX: number;
  /** the Y coordinate the path starts at */
  startY: number;
};

/**
 * Measures every segment of a normalized path in a single pass.
 *
 * A normalized path holds absolute `M`, `L`, `C`, `Q`, `A` and `Z` segments
 * only, so no relative offsets and no shorthand control point reflections
 * have to be resolved here — the length of a segment is exactly the length
 * the point lookup at that distance will use.
 *
 * @param path - the normalized path to measure
 * @returns the length table of the path
 */
export const buildPathLengthTable = (path: NormalArray): PathLengthTable => {
  const measures: NormalizedSegmentMeasure[] = [];
  let x = 0;
  let y = 0;
  let mx = 0;
  let my = 0;
  let totalLength = 0;

  for (const segment of path) {
    const command = segment[0];
    const measure: NormalizedSegmentMeasure = {
      segment,
      startX: x,
      startY: y,
      endX: x,
      endY: y,
      length: 0,
      lengthAtSegment: totalLength,
    };

    // a normalized path holds no other command than the ones handled here
    /* istanbul ignore else */
    if (command === "M") {
      mx = segment[1] as number;
      my = segment[2] as number;
      measure.endX = mx;
      measure.endY = my;
    } else if (command === "L") {
      measure.endX = segment[1] as number;
      measure.endY = segment[2] as number;
      measure.length = getLineLength(x, y, measure.endX, measure.endY);
    } else if (command === "C") {
      measure.endX = segment[5] as number;
      measure.endY = segment[6] as number;
      measure.length = getCubicLength(
        x,
        y,
        segment[1] as number,
        segment[2] as number,
        segment[3] as number,
        segment[4] as number,
        measure.endX,
        measure.endY,
      );
    } else if (command === "Q") {
      measure.endX = segment[3] as number;
      measure.endY = segment[4] as number;
      measure.length = getQuadLength(
        x,
        y,
        segment[1] as number,
        segment[2] as number,
        measure.endX,
        measure.endY,
      );
    } else if (command === "A") {
      measure.endX = segment[6] as number;
      measure.endY = segment[7] as number;
      measure.length = getArcLength(
        x,
        y,
        segment[1] as number,
        segment[2] as number,
        segment[3] as number,
        segment[4] as number,
        segment[5] as number,
        measure.endX,
        measure.endY,
      );
    } else if (command === "Z") {
      // the segment closes back to the start of the sub-path
      measure.endX = mx;
      measure.endY = my;
      measure.length = getLineLength(x, y, mx, my);
    }

    measures.push(measure);
    totalLength += measure.length;
    x = measure.endX;
    y = measure.endY;
  }

  const [startX, startY] = (path[0]?.slice(1) ?? []) as PointTuple;

  return { measures, totalLength, startX, startY };
};

/**
 * Returns the point of a measured path at a given distance.
 *
 * The segment is found with a binary search over the accumulated lengths:
 * it is the last segment whose accumulated length is still below the
 * distance, which is the same segment the linear walk over the path would
 * have stopped at.
 *
 * @param table - the length table of the path
 * @param distance - the distance along the path
 * @returns the requested {x, y} point coordinates
 */
export const getPointAtTable = (
  table: PathLengthTable,
  distance?: number,
): { x: number; y: number } => {
  const { measures, startX, startY } = table;

  // an empty path has no point to return
  if (!measures.length) return { x: 0, y: 0 };

  // a missing, a negative or a not-a-number distance has no point to look
  // for, the path starts there
  if (typeof distance !== "number" || Number.isNaN(distance) || distance < DISTANCE_EPSILON) {
    return { x: startX, y: startY };
  }

  // the last segment whose accumulated length is below the distance
  let low = 0;
  let high = measures.length - 1;
  while (low < high) {
    const mid = (low + high + 1) >> 1;
    if (measures[mid].lengthAtSegment < distance) {
      low = mid;
    } else {
      high = mid - 1;
    }
  }

  const measure = measures[low];
  const { segment, startX: x1, startY: y1, endX, endY } = measure;
  const command = segment[0];
  // the distance within the segment
  const offset = distance - measure.lengthAtSegment;

  // a normalized path holds no other command than the ones handled here
  /* istanbul ignore else */
  if (command === "M") {
    return { x: endX, y: endY };
  }
  if (command === "L") {
    return getPointAtLineLength(x1, y1, endX, endY, offset);
  }
  if (command === "C") {
    return getPointAtCubicLength(
      x1,
      y1,
      segment[1] as number,
      segment[2] as number,
      segment[3] as number,
      segment[4] as number,
      endX,
      endY,
      offset,
    );
  }
  if (command === "Q") {
    return getPointAtQuadLength(
      x1,
      y1,
      segment[1] as number,
      segment[2] as number,
      endX,
      endY,
      offset,
    );
  }
  if (command === "A") {
    return getPointAtArcLength(
      x1,
      y1,
      segment[1] as number,
      segment[2] as number,
      segment[3] as number,
      segment[4] as number,
      segment[5] as number,
      endX,
      endY,
      offset,
    );
  }
  // the close segment returns to the start of the sub-path
  return getPointAtLineLength(x1, y1, endX, endY, offset);
};
