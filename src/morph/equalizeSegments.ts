// src/morph/equalizeSegments.ts
import type {
  CurveArray,
  EqualizationOptions,
  MorphPathArray,
  PathArray,
  Point,
  PolylineArray,
} from "../types.ts";
import { pathToCurve } from "../convert/pathToCurve.ts";
import { pathToPolyline } from "./pathToPolyline.ts";
import { reversePath } from "../process/reversePath.ts";
import { normalizePath } from "../process/normalizePath.ts";
import { splitLinePathToCount } from "./splitLinePathToCount.ts";
import { splitCurvePathToCount } from "./splitCurvePathToCount.ts";
import { samplePolygon } from "./samplePolygon.ts";
import { polygonArea } from "../math/polygonTools.ts";
import { getRotatedPath } from "./getRotatedPath.ts";
import { fixPath } from "./fixPath.ts";
import { isPolygonArray } from "../util/isPolygonArray.ts";
import { isPolylineArray } from "../util/isPolylineArray.ts";
import { getTotalLength } from "../util/getTotalLength.ts";
import { roundPath } from "../process/roundPath.ts";
import { resampleFromTable } from "./resamplePath.ts";
import { buildPathLengthTable } from "../util/pathLengthTable.ts";
import type { PathLengthTable } from "../util/pathLengthTable.ts";

const equalizeSegmentsDefaults: EqualizationOptions = {
  mode: "auto", // "line" | "curve" | "auto"
  strategy: "segment", // "segment" | "arcLength"
  align: true,
  sampleSize: 10, // for line option
  roundValues: 4, // 4 decimals
  reverse: true,
  close: false,
  target: undefined,
};

/**
 * Returns the start and the end point of a path.
 *
 * A closed path ends at the start of its sub-path, so the end point of a
 * path that ends with a close command is the start of the sub-path it
 * belongs to.
 *
 * @param path - the path to read
 * @returns the start and the end point of the path
 */
export const getPathEnds = (path: PathArray): { start: Point; end: Point } => {
  const first = path[0];
  const start = { x: first[1] as number, y: first[2] as number };
  let subStart = start;
  let end = start;
  for (const segment of path) {
    const command = segment[0];
    if (command === "M") {
      subStart = { x: segment[1] as number, y: segment[2] as number };
      end = subStart;
    } else if (command === "Z") {
      end = subStart;
    } else {
      end = {
        x: segment[segment.length - 2] as number,
        y: segment[segment.length - 1] as number,
      };
    }
  }
  return { start, end };
};

/**
 * Returns the distance between two points.
 *
 * @param a - the first point
 * @param b - the second point
 * @returns the distance between the points
 */
export const getDistance = (a: Point, b: Point): number => Math.hypot(a.x - b.x, a.y - b.y);

/**
 * Returns the number of points the arc length strategy uses.
 *
 * The number of points of the result is the number of the segments of the
 * bigger path, so every source segment can have its own span in the result.
 *
 * @param table1 - the length table of the first path
 * @param table2 - the length table of the second path
 * @param target - the requested number of points
 * @returns the number of points of the result
 */
const getArcLengthCount = (
  table1: PathLengthTable,
  table2: PathLengthTable,
  target?: number,
): number => {
  if (typeof target === "number") return Math.max(2, Math.floor(target));

  return Math.max(table1.measures.length, table2.measures.length, 2);
};

/**
 * Equalizes two paths for morphing (single subpath only).
 *
 * @see https://minus-ze.ro/posts/morphing-arbitrary-paths-in-svg/
 * @param path1 - First path string or PathArray
 * @param path2 - Second path string or PathArray
 * @param initialCfg - Equalization options
 * @returns Tuple of two equalized MorphPathArrays
 *
 * @example
 * ```ts
 * const [eq1, eq2] = equalizeSegments('M0 0L100 0L50 100Z', 'M0 0L100 0L100 100L0 100Z')
 * // eq1.length === eq2.length
 * ```
 */
export const equalizeSegments = (
  path1: PathArray | string,
  path2: PathArray | string,
  initialCfg: EqualizationOptions = {},
): [MorphPathArray, MorphPathArray] => {
  const {
    align,
    close,
    mode,
    reverse,
    roundValues,
    strategy,
    target: initialTarget,
  } = { ...equalizeSegmentsDefaults, ...initialCfg };
  let p1 = fixPath(normalizePath(path1)) as MorphPathArray;
  let p2 = fixPath(normalizePath(path2)) as MorphPathArray;

  const bothPoly =
    (isPolygonArray(p1) || isPolylineArray(p1)) && (isPolygonArray(p2) || isPolylineArray(p2));

  // Sample and check draw direction
  const area1 = polygonArea(samplePolygon(p1));
  const area2 = polygonArea(samplePolygon(p2));

  if (reverse !== false && Math.sign(area1) !== Math.sign(area2)) {
    if (reverse === "auto") {
      // the path that is reversed is the one that leaves the two paths
      // closest to each other
      const ends1 = getPathEnds(p1);
      const ends2 = getPathEnds(p2);
      if (getDistance(ends1.end, ends2.start) < getDistance(ends1.start, ends2.end)) {
        p1 = reversePath(p1);
      } else {
        p2 = reversePath(p2);
      }
    } else {
      p2 = reversePath(p2);
    }
  }

  if (strategy === "arcLength") {
    const resampleMode =
      mode === "curve" ? "curve" : mode === "line" ? "line" : bothPoly ? "line" : "curve";
    // curve mode works on cubic source segments, so every result span can be
    // an exact piece of one source curve
    const source1 = resampleMode === "curve" ? pathToCurve(p1) : p1;
    const source2 = resampleMode === "curve" ? pathToCurve(p2) : p2;
    const table1 = buildPathLengthTable(source1);
    const table2 = buildPathLengthTable(source2);
    const count = getArcLengthCount(table1, table2, initialTarget);
    let equalP1 = resampleFromTable(table1, count, resampleMode);
    let equalP2 = resampleFromTable(table2, count, resampleMode);

    // Point alignment
    if (align !== false) equalP2 = getRotatedPath(equalP2, equalP1);

    if (typeof roundValues === "number" && roundValues !== 4) {
      equalP1 = roundPath(equalP1, roundValues);
      equalP2 = roundPath(equalP2, roundValues);
    }

    if (close) {
      equalP1.push(["Z"] as never);
      equalP2.push(["Z"] as never);
    }

    return [equalP1, equalP2];
  }

  let bothPolyline = bothPoly;
  if (bothPolyline && mode !== "curve") {
    p1 = pathToPolyline(p1 as PolylineArray);
    p2 = pathToPolyline(p2 as PolylineArray);
  } else {
    bothPolyline = false;
    p1 = pathToCurve(p1);
    p2 = pathToCurve(p2);
  }

  // Get segment counts
  const segCount1 = p1.length;
  const segCount2 = p2.length;
  const minTarget = Math.max(segCount1, segCount2);
  let target = minTarget;

  if (typeof initialTarget !== "number") {
    const len1 = getTotalLength(p1);
    const len2 = getTotalLength(p2);
    const avgLen = (len1 + len2) / 2;
    const maxSegCount = Math.max(segCount1, segCount2);
    const avgSegLen = avgLen / maxSegCount;
    const idealSegCount = Math.max(minTarget, Math.round(avgLen / Math.max(avgSegLen, 1)));
    target = Math.min(idealSegCount, Math.max(segCount1, segCount2) * 3);
  } else {
    if (initialTarget >= minTarget) target = initialTarget;
    else {
      console.warn(
        'equalizeSegments "target" option: ' + initialTarget + ", expected >= " + minTarget,
      );
    }
  }

  let equalP1: MorphPathArray = p1;
  let equalP2: MorphPathArray = p2;

  if (bothPolyline) {
    equalP1 = splitLinePathToCount(p1 as PolylineArray, target) as MorphPathArray;
    equalP2 = splitLinePathToCount(p2 as PolylineArray, target) as MorphPathArray;
  } else {
    equalP1 = splitCurvePathToCount(p1 as CurveArray, target) as MorphPathArray;
    equalP2 = splitCurvePathToCount(p2 as CurveArray, target) as MorphPathArray;
  }

  // Point alignment
  if (align !== false) equalP2 = getRotatedPath(equalP2, equalP1);

  if (typeof roundValues === "number" && roundValues !== 4) {
    equalP1 = roundPath(equalP1, roundValues);
    equalP2 = roundPath(equalP2, roundValues);
  }

  if (close) {
    equalP1.push(["Z"] as never);
    equalP2.push(["Z"] as never);
  }

  return [equalP1, equalP2];
};
