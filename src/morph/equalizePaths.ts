import type {
  NormalArray,
  PathArray,
  PathFeature,
  PathsEqualizationOptions,
  PointTuple,
} from "../types.ts";
import { isMultiPath } from "../util/isMultiPath.ts";
import { splitPath } from "../process/splitPath.ts";
import { equalizeSegments, getDistance, getPathEnds } from "./equalizeSegments.ts";
import { matchPathFeatures } from "./matchPaths.ts";
import { createPlaceholder } from "./createPlaceholder.ts";
import { normalizePath } from "../process/normalizePath.ts";
import { reversePath } from "../process/reversePath.ts";
import { polygonArea } from "../math/polygonTools.ts";
import { samplePolygon } from "./samplePolygon.ts";
import { classifyPaths } from "./classifyPaths.ts";
import { getPathArea } from "../util/getPathArea.ts";

const equalizePathsDefaults: PathsEqualizationOptions = {
  mode: "auto", // "line" | "curve" | "auto"
  strategy: "segment", // "segment" | "arcLength"
  align: true,
  roundValues: 4, // 4 decimals
  sampleSize: 10,
};

const getPrimaryOuter = (outers: PathFeature[]): PathFeature | undefined => {
  let primary: PathFeature | undefined;
  for (const outer of outers) {
    if (!primary || outer.size > primary.size) primary = outer;
  }
  return primary;
};

const getOuterDirection = (outers: PathFeature[]): number => {
  const primary = getPrimaryOuter(outers);
  if (!primary) return 0;
  return Math.sign(getPathArea(primary.path));
};

/**
 * Equalizes two paths for morphing (single/multi subpath).
 *
 * Multi-subpath paths are reversed as whole paths, so an outer contour keeps
 * its relationship with its holes. Outer contours only match outer contours
 * and holes only match holes: an unmatched contour collapses at its own
 * centroid instead of taking the opposite fill role.
 *
 * @see https://minus-ze.ro/posts/morphing-arbitrary-paths-in-svg/
 * @param pathInput1 - First path string or PathArray
 * @param pathInput2 - Second path string or PathArray
 * @param initialCfg - Configuration options for equalization
 * @returns Tuple of two equalized PathArrays
 *
 * @example
 * ```ts
 * const [eq1, eq2] = equalizePaths('M0 0L100 0L50 100Z', 'M0 0L100 0L100 100L0 100Z')
 * // eq1.length === eq2.length — ready for morphing
 * ```
 */
export const equalizePaths = (
  pathInput1: string | PathArray,
  pathInput2: string | PathArray,
  initialCfg: PathsEqualizationOptions = {},
): [PathArray, PathArray] => {
  const cfg = { ...equalizePathsDefaults, ...initialCfg };
  const p1 = normalizePath(pathInput1);
  const p2 = normalizePath(pathInput2);

  const multi1 = isMultiPath(p1);
  const multi2 = isMultiPath(p2);

  if (!multi1 && !multi2) {
    // Single subpath — use fast path
    return equalizeSegments(p1, p2, cfg);
  }

  let path1 = p1;
  let path2 = p2;
  let multiPath1 = splitPath(path1);
  let multiPath2 = splitPath(path2);
  let classified1 = classifyPaths(multiPath1);
  let classified2 = classifyPaths(multiPath2);

  if (cfg.reverse === undefined) {
    const globalArea1 = polygonArea(samplePolygon(p1));
    const globalArea2 = polygonArea(samplePolygon(p2));

    if (Math.sign(globalArea1) < 0) path1 = reversePath(path1);
    if (Math.sign(globalArea2) < 0) path2 = reversePath(path2);
  } else if (cfg.reverse === true || cfg.reverse === "auto") {
    const direction1 = getOuterDirection(classified1.outers);
    const direction2 = getOuterDirection(classified2.outers);

    if (direction1 && direction2 && direction1 !== direction2) {
      let reverseFirst = false;

      if (cfg.reverse === "auto") {
        const outer1 = getPrimaryOuter(classified1.outers)!;
        const outer2 = getPrimaryOuter(classified2.outers)!;
        const ends1 = getPathEnds(outer1.path);
        const ends2 = getPathEnds(outer2.path);
        reverseFirst = getDistance(ends1.end, ends2.start) < getDistance(ends1.start, ends2.end);
      }

      if (reverseFirst) path1 = reversePath(path1);
      else path2 = reversePath(path2);
    }
  }

  if (path1 !== p1 || path2 !== p2) {
    multiPath1 = splitPath(path1);
    multiPath2 = splitPath(path2);
    classified1 = classifyPaths(multiPath1);
    classified2 = classifyPaths(multiPath2);
  }

  const outerMatches = matchPathFeatures(classified1.outers, classified2.outers);
  const innerMatches = matchPathFeatures(classified1.inners, classified2.inners);
  const featurePairs = [...outerMatches.pairs, ...innerMatches.pairs];
  const contourPairs: [NormalArray, NormalArray][] = featurePairs.map(([from, to]) => [
    from.path,
    to.path,
  ]);

  for (const feature of [...outerMatches.unmatchedFrom, ...innerMatches.unmatchedFrom]) {
    const centroid: PointTuple = [feature.bbox.cx, feature.bbox.cy];
    contourPairs.push([feature.path, createPlaceholder(centroid)]);
  }

  for (const feature of [...outerMatches.unmatchedTo, ...innerMatches.unmatchedTo]) {
    const centroid: PointTuple = [feature.bbox.cx, feature.bbox.cy];
    contourPairs.push([createPlaceholder(centroid), feature.path]);
  }

  const equalizedPairs: [PathArray, PathArray][] = [];

  for (const [from, to] of contourPairs) {
    const [eqFrom, eqTo] = equalizeSegments(from, to, {
      ...cfg,
      reverse: false,
    });
    equalizedPairs.push([eqFrom, eqTo]);
  }

  // Reassemble into final morphable paths
  const finalFrom = equalizedPairs.map((p) => p[0]).flat() as PathArray;
  const finalTo = equalizedPairs.map((p) => p[1]).flat() as PathArray;

  return [finalFrom, finalTo];
};
