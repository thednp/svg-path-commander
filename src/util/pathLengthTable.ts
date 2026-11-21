import type { NormalArray, PointTuple } from "../types.ts";
import type { SegmentMeasure } from "./measureSegments.ts";
import { getLineLength, getPointAtLineLength } from "../math/lineTools.ts";
import { getArcLength, getPointAtArcLength } from "../math/arcTools.ts";
import { getCubicLength, getPointAtCubicLength } from "../math/cubicTools.ts";
import { getPointAtQuadLength, getQuadLength } from "../math/quadTools.ts";
import DISTANCE_EPSILON from "./distanceEpsilon.ts";

/**
 * The length table of a normalized path.
 *
 * The table holds the length of every segment and the length accumulated
 * before it, so a point at any distance can be found with a binary search
 * over the accumulated lengths instead of a walk over the whole path.
 */
export type PathLengthTable = {
  /** the measured segments, in path order */
  measures: SegmentMeasure[];
  /** the total length of the path */
  totalLength: number;
  /** the X coordinate the path starts at */
  startX: number;
  /** the Y coordinate the path starts at */
  startY: number;
  /** whether the path is a loop, so it ends where it starts */
  isLoop: boolean;
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
  const measures: SegmentMeasure[] = [];
  let x = 0;
  let y = 0;
  let mx = 0;
  let my = 0;
  let totalLength = 0;
  let movetoCount = 0;

  for (const [index, segment] of path.entries()) {
    const command = segment[0];
    const measure: SegmentMeasure = {
      segment,
      index,
      startX: x,
      startY: y,
      endX: x,
      endY: y,
      length: 0,
      lengthAtSegment: totalLength,
      geometry: segment,
    };

    // a normalized path holds no other command than the ones handled here
    /* istanbul ignore else */
    if (command === "M") {
      mx = segment[1] as number;
      my = segment[2] as number;
      measure.endX = mx;
      measure.endY = my;
      movetoCount += 1;
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
  const last = measures[measures.length - 1];
  // a path with a single sub-path that ends where it starts is a loop, so
  // the point before the start of the path is the point before its end
  const isLoop =
    movetoCount === 1 &&
    !!last &&
    Math.hypot(last.endX - startX, last.endY - startY) <= DISTANCE_EPSILON;

  return { measures, totalLength, startX, startY, isLoop };
};

/**
 * Builds the length table of a path from the shared measure pass.
 *
 * The measure pass resolves the relative offsets and the shorthand control
 * point reflections of a path and holds the length of every segment, so the
 * table can be built from it without measuring the path a second time. The
 * measures of the pass are the measures of the table: the geometry of a
 * measure is the normalized segment, so the table holds the same segments and
 * the same lengths as the one built from a normalized path.
 *
 * @param segmentMeasures - the measured segments of the path
 * @returns the length table of the path
 */
export const buildPathLengthTableFromMeasures = (
  segmentMeasures: SegmentMeasure[],
): PathLengthTable => {
  let movetoCount = 0;

  for (const measure of segmentMeasures) {
    if (measure.geometry[0] === "M") movetoCount += 1;
  }

  const first = segmentMeasures[0];
  const last = segmentMeasures[segmentMeasures.length - 1];
  // the path starts at the point of its first moveto
  const startX = first?.endX ?? 0;
  const startY = first?.endY ?? 0;
  const totalLength = last ? last.lengthAtSegment + last.length : 0;
  // a path with a single sub-path that ends where it starts is a loop, so
  // the point before the start of the path is the point before its end
  const isLoop =
    movetoCount === 1 &&
    !!last &&
    Math.hypot(last.endX - startX, last.endY - startY) <= DISTANCE_EPSILON;

  return { measures: segmentMeasures, totalLength, startX, startY, isLoop };
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
  const { geometry: segment, startX: x1, startY: y1, endX, endY } = measure;
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
