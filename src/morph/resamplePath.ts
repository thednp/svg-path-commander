import type {
  CSegment,
  CurveArray,
  LSegment,
  MSegment,
  MorphPathArray,
  NormalArray,
  PathArray,
  Point,
  PolylineArray,
} from "../types.ts";
import type { PathLengthTable } from "../util/pathLengthTable.ts";
import type { SegmentMeasure } from "../util/measureSegments.ts";
import { buildPathLengthTable } from "../util/pathLengthTable.ts";
import { getSegmentFrame } from "../util/segmentFrame.ts";
import { normalizePath } from "../process/normalizePath.ts";

/**
 * The angle the direction of a path has to change by to be a corner.
 *
 * A corner is a place where the path changes its direction abruptly: the
 * vertex of a polygon, the point of a star, the tip of a spike. The fine
 * structure of a flattened circle is not a corner — its vertices are an
 * artifact of the flattening, not a shape — so the angle has to be big
 * enough to tell the two apart.
 */
const CORNER_ANGLE = (10 * Math.PI) / 180;

/**
 * The share of the span of a curve its control points take.
 *
 * The control points of the cubic that replaces a span of the path sit at a
 * third of the span from its ends, the same share the control points of the
 * cubic of a circular arc have.
 */
const CONTROL_SHARE = 3;

/**
 * The frame of a path at a given length: the point, the direction the path
 * comes from and the direction it goes to.
 *
 * The two directions are the same on a smooth spot of the path and they
 * differ on a corner, where the path changes its direction abruptly.
 */
type ResampleFrame = {
  /** the point at the given length */
  point: Point;
  /** the direction of the path at the point, from the point backwards */
  incoming: Point;
  /** the direction of the path at the point, from the point forwards */
  outgoing: Point;
};

/**
 * Finds the length of the corners of a measured path.
 *
 * A corner is the end of a segment whose direction differs from the
 * direction of the segment that follows it by more than the corner angle.
 *
 * @param measures - the measured segments of the path
 * @returns the length of every corner of the path, in path order
 */
const findCorners = (measures: SegmentMeasure[]): number[] => {
  const corners: number[] = [];
  for (let i = 1; i < measures.length; i += 1) {
    const previous = measures[i - 1];
    const current = measures[i];
    // a segment without a length has no direction
    if (previous.length <= 0 || current.length <= 0) continue;

    const incoming = getSegmentFrame(
      previous.geometry,
      previous.startX,
      previous.startY,
      previous.endX,
      previous.endY,
      previous.length,
      previous.length,
    ).tangent;
    const outgoing = getSegmentFrame(
      current.geometry,
      current.startX,
      current.startY,
      current.endX,
      current.endY,
      0,
      current.length,
    ).tangent;
    // a moveto has no direction either
    if (!incoming.x && !incoming.y) continue;
    if (!outgoing.x && !outgoing.y) continue;

    const dot = incoming.x * outgoing.x + incoming.y * outgoing.y;
    const cross = incoming.x * outgoing.y - incoming.y * outgoing.x;
    if (Math.atan2(Math.abs(cross), dot) > CORNER_ANGLE) {
      corners.push(current.lengthAtSegment);
    }
  }
  return corners;
};

/**
 * Distributes a number of intervals among a number of spans.
 *
 * The intervals are shared in proportion to the length of the spans, so the
 * spacing of the intervals stays the same over the whole path. The spans
 * that lose a fraction of an interval share it out, the one with the
 * biggest fraction gets it.
 *
 * @param lengths - the length of every span
 * @param extra - the number of intervals to distribute
 * @returns the number of extra intervals of every span
 */
const distributeIntervals = (lengths: number[], extra: number): number[] => {
  const shares = lengths.map(() => 0);
  if (extra <= 0) return shares;

  const total = lengths.reduce((sum, length) => sum + length, 0);
  // the spans cover the whole path, so their length is the length of the path
  /* istanbul ignore if */
  if (total <= 0) return shares;

  const remainders: { index: number; remainder: number }[] = [];
  let used = 0;
  for (let i = 0; i < lengths.length; i += 1) {
    const exact = (lengths[i] / total) * extra;
    const whole = Math.floor(exact);
    shares[i] = whole;
    used += whole;
    remainders.push({ index: i, remainder: exact - whole });
  }

  remainders.sort((a, b) => b.remainder - a.remainder || a.index - b.index);
  let left = extra - used;
  for (let i = 0; left > 0 && remainders.length; i = (i + 1) % remainders.length) {
    shares[remainders[i].index] += 1;
    left -= 1;
  }
  return shares;
};

/**
 * Builds the lengths of the knots of a resampled path.
 *
 * The knots are spread evenly over the length of the path, but the corners
 * of the path are knots too, so the shape of the path keeps its vertices.
 * The intervals between the corners are shared in proportion to their
 * length, so the spacing of the knots stays the same over the whole path.
 *
 * When the corners of the path are more than the intervals of the result,
 * they cannot all be knots: the knots are spread evenly then, and the shape
 * of the path is approximated by its chords.
 *
 * @param totalLength - the length of the path
 * @param intervals - the number of intervals of the result
 * @param corners - the length of every corner of the path
 * @returns the length of every knot of the result, in path order
 */
const buildKnots = (totalLength: number, intervals: number, corners: number[]): number[] => {
  const spanCount = corners.length + 1;
  const knots: number[] = [];

  // the corners do not fit: the knots are spread evenly
  if (spanCount > intervals) {
    for (let i = 0; i <= intervals; i += 1) {
      knots.push((totalLength * i) / intervals);
    }
    return knots;
  }

  const breakpoints = [0, ...corners, totalLength];
  const lengths = breakpoints.slice(1).map((value, index) => value - breakpoints[index]);
  const shares = distributeIntervals(lengths, intervals - spanCount);

  for (let i = 0; i < spanCount; i += 1) {
    const from = breakpoints[i];
    const to = breakpoints[i + 1];
    const count = shares[i] + 1;
    for (let j = 0; j < count; j += 1) {
      knots.push(from + ((to - from) * j) / count);
    }
  }
  knots.push(totalLength);
  return knots;
};

/**
 * Finds the index of the segment a distance falls into.
 *
 * The segment is the last one whose accumulated length is below the
 * distance, the same segment the linear walk over the path would have
 * stopped at. A distance at the end of a segment belongs to the segment
 * before it, so the frame at that distance is the frame at the end of the
 * segment.
 *
 * @param measures - the measured segments of the path
 * @param distance - the distance along the path
 * @returns the index of the segment
 */
const findSegmentIndex = (measures: SegmentMeasure[], distance: number): number => {
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
  return low;
};

/**
 * Returns the direction of the path after a segment.
 *
 * The segments without a direction are skipped, so the direction of the
 * path is the direction of the first segment that has one.
 *
 * @param measures - the measured segments of the path
 * @param index - the index of the segment
 * @returns the direction of the path, or `null` when the path has none
 */
const findNextDirection = (measures: SegmentMeasure[], index: number): Point | null => {
  for (let i = index + 1; i < measures.length; i += 1) {
    const measure = measures[i];
    if (measure.length <= 0) continue;
    const tangent = getSegmentFrame(
      measure.geometry,
      measure.startX,
      measure.startY,
      measure.endX,
      measure.endY,
      0,
      measure.length,
    ).tangent;
    if (tangent.x || tangent.y) return tangent;
  }
  return null;
};

/**
 * The share of the length of a path the end of the path can be over.
 *
 * The length of a path is the sum of the lengths of its segments, so the end
 * of the path can be a fraction over the end of its last segment. The point
 * at the end of the path is the end point of the path, not a point a
 * fraction before it.
 */
const END_EPSILON = 1e-9;

/**
 * Returns the frame of a path at a given length.
 *
 * @param table - the length table of the path
 * @param distance - the distance along the path
 * @returns the frame of the path at the given length
 */
const getFrameAt = (table: PathLengthTable, distance: number): ResampleFrame => {
  const { measures, totalLength } = table;
  const index = findSegmentIndex(measures, distance);
  const measure = measures[index];
  const rawOffset = distance - measure.lengthAtSegment;
  const atEnd = totalLength - distance <= totalLength * END_EPSILON;
  const offset = atEnd ? measure.length : Math.min(Math.max(rawOffset, 0), measure.length);

  const frame = getSegmentFrame(
    measure.geometry,
    measure.startX,
    measure.startY,
    measure.endX,
    measure.endY,
    offset,
    measure.length,
  );

  // at the end of a segment the path continues with the next one, which can
  // have another direction: that is a corner
  let outgoing = frame.tangent;
  if (offset >= measure.length) {
    const next = findNextDirection(measures, index);
    if (next) outgoing = next;
  }

  return { point: frame.point, incoming: frame.tangent, outgoing };
};

/**
 * Returns the number of corners of a measured path.
 *
 * A corner is a place where the path changes its direction abruptly, so the
 * corners of a path are the vertices of its shape.
 *
 * @param table - the length table of the path
 * @returns the number of corners of the path
 */
export const getTableCornerCount = (table: PathLengthTable): number =>
  findCorners(table.measures).length;

/**
 * Resamples a measured path to a given number of points, spread evenly by
 * length.
 *
 * The path is measured along its length and the points of the result are
 * spread evenly over it, so the distance between two points of the result
 * is the same over the whole path. The corners of the path are points of
 * the result too, so the shape of the path keeps its vertices.
 *
 * The result is a polyline, or a path of cubic Bezier segments when the
 * curve mode is used: every cubic of the result starts at a point of the
 * path and ends at the next one, with the direction of the path at both
 * ends, so the curve of the path is kept.
 *
 * @param table - the length table of the path
 * @param count - the number of points of the result
 * @param mode - the type of the segments of the result
 * @returns the resampled path
 */
export const resampleFromTable = (
  table: PathLengthTable,
  count: number,
  mode: "line" | "curve",
): MorphPathArray => {
  const { measures, totalLength } = table;
  if (!measures.length) return [] as unknown as MorphPathArray;

  const points = Math.max(1, Math.floor(count));
  const intervals = points - 1;

  // a path without a length is a point
  if (totalLength <= 0) {
    return [["M", measures[0].endX, measures[0].endY]] as unknown as MorphPathArray;
  }

  // a single point is the start of the path
  if (intervals <= 0) {
    return [["M", table.startX, table.startY]] as unknown as MorphPathArray;
  }

  const corners = findCorners(measures);
  const knots = buildKnots(totalLength, intervals, corners);
  const frames = knots.map((knot) => getFrameAt(table, knot));

  const start = frames[0].point;
  const result: (MSegment | LSegment | CSegment)[] = [["M", start.x, start.y] as MSegment];

  for (let i = 1; i < knots.length; i += 1) {
    const from = frames[i - 1];
    const to = frames[i];
    if (mode === "curve") {
      // the control points sit at a third of the span from its ends, along
      // the direction of the path at both ends
      const share = (knots[i] - knots[i - 1]) / CONTROL_SHARE;
      const c1x = from.point.x + from.outgoing.x * share;
      const c1y = from.point.y + from.outgoing.y * share;
      const c2x = to.point.x - to.incoming.x * share;
      const c2y = to.point.y - to.incoming.y * share;
      result.push(["C", c1x, c1y, c2x, c2y, to.point.x, to.point.y] as CSegment);
    } else {
      result.push(["L", to.point.x, to.point.y] as LSegment);
    }
  }

  return mode === "curve"
    ? (result as unknown as CurveArray)
    : (result as unknown as PolylineArray);
};

/**
 * Resamples a normalized path to a given number of points, spread evenly by
 * length.
 *
 * @param path - the normalized path to resample
 * @param count - the number of points of the result
 * @param mode - the type of the segments of the result
 * @returns the resampled path
 */
export const resampleNormalizedPath = (
  path: NormalArray,
  count: number,
  mode: "line" | "curve",
): MorphPathArray => resampleFromTable(buildPathLengthTable(path), count, mode);

/**
 * Resamples a path to a given number of points, spread evenly by length.
 *
 * The path is measured along its length and the points of the result are
 * spread evenly over it, so the distance between two points of the result
 * is the same over the whole path. The corners of the path are points of
 * the result too, so the shape of the path keeps its vertices.
 *
 * The result is a polyline, or a path of cubic Bezier segments when the
 * curve mode is used: every cubic of the result starts at a point of the
 * path and ends at the next one, with the direction of the path at both
 * ends, so the curve of the path is kept.
 *
 * @param pathInput - the target path string or PathArray
 * @param count - the number of points of the result
 * @param mode - the type of the segments of the result
 * @returns the resampled path
 *
 * @example
 * ```ts
 * resamplePath("M0 0L100 0L100 100", 3)
 * // => [['M', 0, 0], ['L', 100, 0], ['L', 100, 100]]
 * ```
 */
export const resamplePath = (
  pathInput: string | PathArray,
  count: number,
  mode: "line" | "curve" = "line",
): MorphPathArray => resampleNormalizedPath(normalizePath(pathInput), count, mode);
