// src/morph/equalizeSegments.ts
import type {
  CurveArray,
  EqualizationOptions,
  MorphPathArray,
  PathArray,
  PolylineArray,
} from "../types";
import { pathToCurve } from "../convert/pathToCurve";
import { pathToPolyline } from "./pathToPolyline";
import { reversePath } from "../process/reversePath";
import { normalizePath } from "../process/normalizePath";
import { splitLinePathToCount } from "./splitLinePathToCount";
import { splitCurvePathToCount } from "./splitCurvePathToCount";
import { samplePolygon } from "./samplePolygon";
import { polygonArea } from "../math/polygonTools";
import { getRotatedPath } from "./getRotatedPath";
import { fixPath } from "./fixPath";
import { isPolygonArray } from "../util/isPolygonArray";
import { isPolylineArray } from "../util/isPolylineArray";
import { getTotalLength } from "../util/getTotalLength";
import { roundPath } from "../process/roundPath";

const equalizeSegmentsDefaults: EqualizationOptions = {
  mode: "auto", // "line" | "curve" | "auto"
  sampleSize: 10, // for line option
  roundValues: 4, // 4 decimals
  reverse: true,
  close: false,
  target: undefined,
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
  const { close, mode, reverse, roundValues, target: initialTarget } = Object
    .assign(equalizeSegmentsDefaults, initialCfg);
  let p1 = normalizePath(path1) as MorphPathArray;
  let p2 = normalizePath(path2) as MorphPathArray;

  // fix paths
  fixPath(p1);
  fixPath(p2);

  let bothPoly = (isPolygonArray(p1) || isPolylineArray(p1)) &&
    (isPolygonArray(p2) || isPolylineArray(p2));

  if (bothPoly && mode === "auto") {
    p1 = pathToPolyline(p1 as PolylineArray);
    p2 = pathToPolyline(p2 as PolylineArray);
  } else {
    bothPoly = false;
    p1 = pathToCurve(p1);
    p2 = pathToCurve(p2);
  }

  // Sample and check draw direction
  const area1 = polygonArea(samplePolygon(p1));
  const area2 = polygonArea(samplePolygon(p2));

  if (reverse !== false && (Math.sign(area1) !== Math.sign(area2))) {
    p2 = reversePath(p2);
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
    const idealSegCount = Math.max(
      minTarget,
      Math.round(avgLen / Math.max(avgSegLen, 1)),
    );
    target = Math.min(idealSegCount, Math.max(segCount1, segCount2) * 3);
  } else {
    if (initialTarget >= minTarget) target = initialTarget;
    else {
      console.warn(
        'equalizeSegments "target" option: ' + initialTarget +
          ", expected >= " + minTarget,
      );
    }
  }

  let equalP1: MorphPathArray = p1;
  let equalP2: MorphPathArray = p2;

  if (bothPoly) {
    equalP1 = splitLinePathToCount(
      p1 as PolylineArray,
      target,
    ) as MorphPathArray;
    equalP2 = splitLinePathToCount(
      p2 as PolylineArray,
      target,
    ) as MorphPathArray;
  } else {
    equalP1 = splitCurvePathToCount(p1 as CurveArray, target) as MorphPathArray;
    equalP2 = splitCurvePathToCount(p2 as CurveArray, target) as MorphPathArray;
  }

  // Point alignment
  equalP2 = getRotatedPath(equalP2, equalP1);

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
