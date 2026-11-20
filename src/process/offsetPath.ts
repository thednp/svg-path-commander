import type { PathArray, PathSegment, PointTuple } from "../types.ts";
import type { OffsetCap, OffsetJoin, OffsetOptions, OffsetSide } from "../interface.ts";
import { error } from "../util/error.ts";
import { measureSegments } from "../util/measureSegments.ts";
import type { SegmentMeasure } from "../util/measureSegments.ts";
import { parsePathString } from "../parser/parsePathString.ts";
import { polygonArea } from "../math/polygonTools.ts";
import { roundTo } from "../math/roundTo.ts";
import { cleanZero } from "../util/segmentFrame.ts";
import { getOffsetNodes } from "./offsetNodes.ts";
import type { OffsetNode } from "./offsetNodes.ts";
import { getCapPoints, getJoinPoints, intersectLines, signedTurn } from "./offsetJoin.ts";
import type { OffsetPoint } from "./offsetJoin.ts";

/**
 * The options of the path offsetting, with the defaults applied.
 */
type ResolvedOptions = {
  /** The side of the path to offset. */
  side: OffsetSide;
  /** The join type at a corner. */
  join: OffsetJoin;
  /** The ratio of the miter length to the offset distance. */
  miterLimit: number;
  /** The cap type at the end of an open path. */
  cap: OffsetCap;
  /** The number of the intervals a curve is sampled with. */
  steps: number;
  /** The number of the decimals of the result. */
  precision: number;
};

/** The sides an offset can be created on. */
const sides: OffsetSide[] = ["left", "right", "both"];
/** The join types of an offset. */
const joins: OffsetJoin[] = ["round", "miter", "bevel"];
/** The cap types of an offset. */
const caps: OffsetCap[] = ["butt", "square", "round"];

/**
 * Returns the options of the path offsetting, with the defaults applied.
 *
 * @param options - the options of the offset
 * @returns the resolved options
 */
const resolveOptions = (options: OffsetOptions): ResolvedOptions => {
  const {
    side = "left",
    join = "miter",
    miterLimit = 4,
    cap = "butt",
    steps = 16,
    precision = 4,
  } = options;

  if (!sides.includes(side)) {
    throw TypeError(`${error}: side must be one of "left", "right" or "both"`);
  }
  if (!joins.includes(join)) {
    throw TypeError(`${error}: join must be one of "round", "miter" or "bevel"`);
  }
  if (!caps.includes(cap)) {
    throw TypeError(`${error}: cap must be one of "butt", "square" or "round"`);
  }
  if (typeof miterLimit !== "number" || !Number.isFinite(miterLimit) || miterLimit <= 0) {
    throw TypeError(`${error}: miterLimit must be a positive number`);
  }
  if (!Number.isInteger(steps) || steps < 1) {
    throw TypeError(`${error}: steps must be an integer greater than 0`);
  }
  if (!Number.isInteger(precision) || precision < 0) {
    throw TypeError(`${error}: precision must be an integer of 0 or more`);
  }

  return { side, join, miterLimit, cap, steps, precision };
};

/**
 * Groups the measured segments of a path into its sub-paths.
 *
 * @param measures - the measured segments of the path
 * @returns the measured segments of every sub-path
 */
const groupSubPaths = (measures: SegmentMeasure[]): SegmentMeasure[][] => {
  const groups: SegmentMeasure[][] = [];
  let group: SegmentMeasure[] = [];

  for (const measure of measures) {
    if (measure.geometry[0] === "M" && group.length) {
      groups.push(group);
      group = [];
    }
    group.push(measure);
  }
  if (group.length) groups.push(group);

  return groups;
};

/**
 * Returns the offset polyline of one side of a sub-path.
 *
 * Every node is shifted along the normal of the path. At a corner the two
 * offset lines meet: on the outer side of the turn the join is applied, and
 * on the inner side of the turn the offset lines cross before the corner, so
 * the curve is trimmed at their intersection.
 *
 * @param nodes - the sampled points of the sub-path
 * @param side - `1` for the left side of the path, `-1` for the right side
 * @param distance - the offset distance
 * @param options - the resolved options of the offset
 * @param closed - whether the sub-path is closed
 * @returns the points of the offset polyline
 */
const buildSidePolyline = (
  nodes: OffsetNode[],
  side: number,
  distance: number,
  options: ResolvedOptions,
  closed: boolean,
): PointTuple[] => {
  const { join, miterLimit } = options;
  const offsets: OffsetPoint[] = nodes.map((node) => ({
    x: node.x - side * node.ty * distance,
    y: node.y + side * node.tx * distance,
    tx: node.tx,
    ty: node.ty,
  }));
  const points: PointTuple[] = [[offsets[0].x, offsets[0].y]];

  for (let i = 1; i < offsets.length; i += 1) {
    const from = offsets[i - 1];
    const to = offsets[i];
    let trimmed = false;

    if (nodes[i].corner) {
      const turn = signedTurn(from, to);
      if (Math.abs(turn) > 1e-9) {
        if (side * turn < 0) {
          points.push(
            ...getJoinPoints(nodes[i].x, nodes[i].y, from, to, distance, join, miterLimit),
          );
        } else {
          const intersection = intersectLines(
            from.x,
            from.y,
            from.tx,
            from.ty,
            to.x,
            to.y,
            to.tx,
            to.ty,
          );
          if (intersection) {
            points[points.length - 1] = intersection;
            // the closing corner of a closed sub-path trims the first point
            // of the path as well
            if (closed && i === offsets.length - 1) points[0] = intersection;
            trimmed = true;
          }
        }
      }
    }

    if (!trimmed) {
      const point: PointTuple = [to.x, to.y];
      // a corner without a turn does not move the path
      if (!samePoint(points[points.length - 1], point)) points.push(point);
    }
  }

  return points;
};

/**
 * Returns whether two points are the same point.
 *
 * @param a - the first point
 * @param b - the second point
 * @returns whether the points are the same
 */
const samePoint = (a: PointTuple, b: PointTuple): boolean =>
  Math.abs(a[0] - b[0]) < 1e-9 && Math.abs(a[1] - b[1]) < 1e-9;

/**
 * Returns a coordinate of the result, rounded and without a negative zero.
 *
 * @param value - the coordinate
 * @param precision - the number of the decimals of the result
 * @returns the rounded coordinate
 */
const roundCoordinate = (value: number, precision: number): number =>
  cleanZero(roundTo(value, precision));

/**
 * Returns the segments of an offset polyline.
 *
 * @param points - the points of the polyline
 * @param closed - whether the polyline is closed
 * @param precision - the number of the decimals of the result
 * @returns the segments of the polyline
 */
const toSegments = (points: PointTuple[], closed: boolean, precision: number): PathSegment[] => {
  const last = points[points.length - 1];
  // a closed polyline ends where it starts, the closing segment is enough
  const list =
    closed && points.length > 1 && samePoint(points[0], last) ? points.slice(0, -1) : points;
  const segments: PathSegment[] = [];

  // the polyline always holds at least one point
  /* istanbul ignore next */
  if (!list.length) return segments;

  segments.push([
    "M",
    roundCoordinate(list[0][0], precision),
    roundCoordinate(list[0][1], precision),
  ]);
  for (let i = 1; i < list.length; i += 1) {
    segments.push([
      "L",
      roundCoordinate(list[i][0], precision),
      roundCoordinate(list[i][1], precision),
    ]);
  }
  if (closed) segments.push(["Z"]);

  return segments;
};

/**
 * Offsets a path along its normals.
 *
 * The path is sampled along its length, every sample is shifted along the
 * normal of the path and the result is a path of straight lines. The
 * corners of the path are joined with the `join` option, and the ends of an
 * open path are capped with the `cap` option.
 *
 * The `side` option is literal: the left side is the left normal of the
 * direction of travel, the same normal `getPropertiesAtLength()` returns.
 * The `both` side is the outline of the stroke, the band between the two
 * sides of the path.
 *
 * The offset is not cleaned up: an offset distance larger than the local
 * radius of curvature of the path produces a self-crossing curve.
 *
 * @param pathInput - the path string or `PathArray`
 * @param distance - the offset distance
 * @param options - the options of the offset
 * @returns the offset path
 *
 * @example
 * ```ts
 * offsetPath('M0 0L100 0', 10)
 * // => [['M', 0, 10], ['L', 100, 10]]
 * ```
 */
export const offsetPath = <T extends PathArray>(
  pathInput: string | T,
  distance: number,
  options?: OffsetOptions,
): PathArray => {
  if (typeof distance !== "number" || !Number.isFinite(distance)) {
    throw TypeError(`${error}: distance must be a number`);
  }
  if (distance < 0) {
    throw TypeError(`${error}: distance must be a positive number`);
  }

  const resolved = resolveOptions(options ?? {});
  // a path without an offset is the path itself
  if (distance === 0) return parsePathString(pathInput) as PathArray;

  const measures = measureSegments(pathInput);
  const groups = groupSubPaths(measures);
  const result: PathSegment[] = [];

  for (const group of groups) {
    const nodes = getOffsetNodes(group, resolved.steps);
    const last = group[group.length - 1];
    const closed = Boolean(last && last.geometry[0] === "Z");

    // a sub-path without a drawable segment keeps its moveto
    if (!nodes.length) {
      const first = group[0];
      result.push(["M", first.endX, first.endY]);
      continue;
    }

    if (resolved.side === "both") {
      const left = buildSidePolyline(nodes, 1, distance, resolved, closed);
      const right = buildSidePolyline(nodes, -1, distance, resolved, closed);

      if (closed) {
        // the outline of a closed path is the outer ring and the inner ring,
        // the inner one is reversed so it is a hole
        const leftArea = Math.abs(polygonArea(left));
        const rightArea = Math.abs(polygonArea(right));
        const outer = leftArea >= rightArea ? left : right;
        const inner = leftArea >= rightArea ? right : left;
        result.push(...toSegments(outer, true, resolved.precision));
        result.push(...toSegments([...inner].reverse(), true, resolved.precision));
        continue;
      }

      // the outline of an open path is the left side, the cap at the end of
      // the path, the right side backwards and the cap at the start
      const start = nodes[0];
      const end = nodes[nodes.length - 1];
      const endCap = getCapPoints(
        end.x,
        end.y,
        left[left.length - 1],
        right[right.length - 1],
        distance,
        resolved.cap,
        end.tx,
        end.ty,
      );
      const startCap = getCapPoints(
        start.x,
        start.y,
        right[0],
        left[0],
        distance,
        resolved.cap,
        -start.tx,
        -start.ty,
      );
      const ring = [...left, ...endCap, ...[...right].reverse(), ...startCap];
      result.push(...toSegments(ring, true, resolved.precision));
      continue;
    }

    const side = resolved.side === "left" ? 1 : -1;
    const polyline = buildSidePolyline(nodes, side, distance, resolved, closed);
    result.push(...toSegments(polyline, closed, resolved.precision));
  }

  return result as PathArray;
};
