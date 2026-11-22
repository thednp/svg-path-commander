import type {
  CSegment,
  CubicCoordinates,
  CurveArray,
  LSegment,
  MorphPathArray,
  MSegment,
  NormalArray,
  PathArray,
  PathSegment,
  Point,
  PolylineArray,
} from "../types.ts";
import type { PathLengthTable } from "../util/pathLengthTable.ts";
import type { SegmentMeasure } from "../util/measureSegments.ts";
import { buildPathLengthTable } from "../util/pathLengthTable.ts";
import { getSegmentFrame } from "../util/segmentFrame.ts";
import { normalizePath } from "../process/normalizePath.ts";
import { splitSubPaths } from "../process/splitSubPaths.ts";
import { pathToCurve } from "../convert/pathToCurve.ts";
import { getTAtBezierLength } from "../math/bezier.ts";
import { splitCubicSegment } from "./splitCubicSegment.ts";

/**
 * The share of a span used by the control points of a fallback curve.
 */
const CONTROL_SHARE = 3;

/**
 * The distance below which two lengths are the same.
 */
const LENGTH_EPSILON = 1e-9;

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
 * The source segment boundaries are knots too, so every result span belongs
 * to one source segment. The intervals between the boundaries are shared in
 * proportion to their length, so the spacing of the knots stays the same over
 * the whole path.
 *
 * When the source segments do not fit into the requested intervals, the knots
 * are spread evenly and the shape of the path is approximated by its chords.
 *
 * @param totalLength - the length of the path
 * @param intervals - the number of intervals of the result
 * @param boundaries - the length of every source segment boundary
 * @returns the length of every knot of the result, in path order
 */
const buildKnots = (totalLength: number, intervals: number, boundaries: number[]): number[] => {
  const breakpoints = [0];
  for (const boundary of boundaries) {
    if (boundary > breakpoints[breakpoints.length - 1] + LENGTH_EPSILON) {
      breakpoints.push(boundary);
    }
  }
  breakpoints.push(totalLength);

  const spanCount = breakpoints.length - 1;
  const knots: number[] = [];

  // the source segments do not fit: the knots are spread evenly
  if (spanCount > intervals) {
    for (let i = 0; i <= intervals; i += 1) {
      knots.push((totalLength * i) / intervals);
    }
    return knots;
  }

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
 * Returns the control lengths of a fallback curve.
 *
 * @param fromLength - the length of the start of the span
 * @param toLength - the length of the end of the span
 * @param from - the frame at the start of the span
 * @param to - the frame at the end of the span
 * @returns the length of the control point at each end of the span
 */
const getFallbackCurveControls = (
  fromLength: number,
  toLength: number,
  from: ResampleFrame,
  to: ResampleFrame,
): { start: number; end: number } => {
  const span = Math.max(0, toLength - fromLength);
  const fallback = span / CONTROL_SHARE;
  const hasFromDirection = from.outgoing.x !== 0 || from.outgoing.y !== 0;
  const hasToDirection = to.incoming.x !== 0 || to.incoming.y !== 0;
  return {
    start: hasFromDirection ? fallback : 0,
    end: hasToDirection ? fallback : 0,
  };
};

/**
 * Returns the internal boundaries of the measured source segments.
 *
 * @param measures - the measured segments of the path
 * @param totalLength - the length of the path
 * @returns the length of every internal segment boundary
 */
const getSegmentBoundaries = (measures: SegmentMeasure[], totalLength: number): number[] => {
  const boundaries: number[] = [];
  for (const measure of measures) {
    if (measure.geometry[0] === "M" || measure.length <= 0) continue;
    const end = measure.lengthAtSegment + measure.length;
    if (end > LENGTH_EPSILON && end < totalLength - LENGTH_EPSILON) {
      boundaries.push(end);
    }
  }
  return boundaries;
};

/**
 * Finds the source curve that holds a distance.
 *
 * @param measures - the measured curve segments of the path
 * @param distance - the distance along the path
 * @returns the index of the curve segment
 */
const findCurveSegmentIndex = (measures: SegmentMeasure[], distance: number): number => {
  let low = 0;
  let high = measures.length - 1;
  let result = 0;
  while (low <= high) {
    const mid = (low + high) >> 1;
    if (measures[mid].lengthAtSegment <= distance) {
      result = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }
  return result;
};

/**
 * Extracts the exact cubic curve of a source span.
 *
 * @param measures - the measured curve segments of the path
 * @param fromLength - the length of the start of the span
 * @param toLength - the length of the end of the span
 * @returns the exact cubic segment, or `null` when the span crosses a source boundary
 */
const getExactCurveSegment = (
  measures: SegmentMeasure[],
  fromLength: number,
  toLength: number,
): CSegment | null => {
  const index = findCurveSegmentIndex(measures, fromLength);
  const measure = measures[index];
  const segmentStart = measure.lengthAtSegment;
  const segmentEnd = segmentStart + measure.length;
  if (toLength > segmentEnd + LENGTH_EPSILON) return null;

  const geometry = measure.geometry as CSegment;
  const coordinates = [
    measure.startX,
    measure.startY,
    geometry[1],
    geometry[2],
    geometry[3],
    geometry[4],
    measure.endX,
    measure.endY,
  ] as CubicCoordinates;

  const fromOffset = fromLength - segmentStart;
  const toOffset = toLength - segmentStart;
  const t0 =
    fromOffset <= LENGTH_EPSILON
      ? 0
      : getTAtBezierLength(coordinates, Math.min(fromOffset, measure.length));
  const t1 =
    toOffset >= measure.length - LENGTH_EPSILON
      ? 1
      : getTAtBezierLength(coordinates, Math.max(0, toOffset));

  let span: CubicCoordinates;
  if (t0 <= 0) {
    const [first] = splitCubicSegment(...coordinates, t1);
    span = first;
  } else {
    const [, tail] = splitCubicSegment(...coordinates, t0);
    const ratio = Math.max(0, Math.min(1, (t1 - t0) / (1 - t0)));
    const [first] = splitCubicSegment(...tail, ratio);
    span = first;
  }

  return ["C", span[2], span[3], span[4], span[5], span[6], span[7]];
};

/**
 * Resamples a measured path to a given number of points, spread evenly by
 * length.
 *
 * The path is measured along its length and the points of the result are
 * spread evenly over it, so the distance between two points of the result
 * is the same over the whole path. The source segment boundaries are points
 * of the result too, so the shape of the path keeps its vertices.
 *
 * The result is a polyline, or a path of cubic Bezier segments when the
 * curve mode is used. Every cubic of the result is the exact piece of the
 * source curve between two knots.
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

  const boundaries = getSegmentBoundaries(measures, totalLength);
  const knots = buildKnots(totalLength, intervals, boundaries);
  const frames = knots.map((knot) => getFrameAt(table, knot));
  const curveMeasures =
    mode === "curve"
      ? measures.filter((measure) => measure.geometry[0] === "C" && measure.length > LENGTH_EPSILON)
      : [];

  const start = frames[0].point;
  const result: (MSegment | LSegment | CSegment)[] = [["M", start.x, start.y] as MSegment];

  for (let i = 1; i < knots.length; i += 1) {
    const from = frames[i - 1];
    const to = frames[i];
    if (mode === "curve") {
      const exact = getExactCurveSegment(curveMeasures, knots[i - 1], knots[i]);
      if (exact) {
        result.push(exact);
        continue;
      }

      const controls = getFallbackCurveControls(knots[i - 1], knots[i], from, to);
      const c1x = from.point.x + from.outgoing.x * controls.start;
      const c1y = from.point.y + from.outgoing.y * controls.start;
      const c2x = to.point.x - to.incoming.x * controls.end;
      const c2y = to.point.y - to.incoming.y * controls.end;
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
 * Resamples a normalized sub-path to a given number of points, spread evenly
 * by length.
 *
 * @param path - the normalized sub-path to resample
 * @param count - the number of points of the result
 * @param mode - the type of the segments of the result
 * @returns the resampled path
 */
export const resampleNormalizedPath = (
  path: NormalArray,
  count: number,
  mode: "line" | "curve",
): MorphPathArray => {
  const source = mode === "curve" ? pathToCurve(path as PathArray) : path;
  return resampleFromTable(buildPathLengthTable(source as NormalArray), count, mode);
};

/**
 * Resamples a path to a given number of points, spread evenly by length.
 *
 * The path is measured along its length and the points of the result are
 * spread evenly over it, so the distance between two points of the result
 * is the same over the whole path. The source segment boundaries are points
 * of the result too, so the shape of the path keeps its vertices.
 *
 * Every sub-path of the path is resampled on its own, so the sub-paths of
 * the result are the sub-paths of the source: a path with several sub-paths
 * keeps its shape, the points of a sub-path are not shared with the others.
 *
 * The result is a polyline, or a path of cubic Bezier segments when the
 * curve mode is used. Every cubic of the result is the exact piece of the
 * source curve between two knots.
 *
 * @param pathInput - the target path string or PathArray
 * @param count - the number of points of every sub-path of the result
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
): PathArray => {
  const path = normalizePath(pathInput);
  const result: PathSegment[] = [];
  // every sub-path is resampled on its own, so the sub-paths of the result
  // are the sub-paths of the source
  for (const subPath of splitSubPaths(path)) {
    result.push(...(resampleNormalizedPath(subPath, count, mode) as PathSegment[]));
  }
  // the result of a multi-subpath source holds several moveto commands, so
  // its public type is a path array and not a single morph path
  return result as unknown as PathArray;
};
