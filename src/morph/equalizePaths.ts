import type {
  MorphPathArray,
  PathArray,
  PathsEqualizationOptions,
} from "../types.ts";
import { isMultiPath } from "../util/isMultiPath";
import { splitPath } from "../process/splitPath";
import { equalizeSegments } from "./equalizeSegments";
import { matchPaths } from "./matchPaths";
import { normalizePath } from "../process/normalizePath";
import { reversePath } from "../process/reversePath";
import { polygonArea } from "../math/polygonTools";
import { samplePolygon } from "./samplePolygon";
import { classifyPaths } from "./classifyPaths.ts";

const equalizePathsDefaults: PathsEqualizationOptions = {
  mode: "auto", // "line" | "curve" | "auto"
  roundValues: 4, // 4 decimals
  close: false,
  sampleSize: 10,
};

/**
 * Equalizes two paths for morphing (single/multi subpath).
 *
 * @see https://minus-ze.ro/posts/morphing-arbitrary-paths-in-svg/
 * @param pathInput1 - First path string or PathArray
 * @param pathInput2 - Second path string or PathArray
 * @param initialCfg - Configuration options for equalization
 * @returns Tuple of two equalized MorphPathArrays
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
  initialCfg = {},
) => {
  const cfg = Object.assign(equalizePathsDefaults, initialCfg);
  const p1 = normalizePath(pathInput1);
  const p2 = normalizePath(pathInput2);

  const multi1 = isMultiPath(p1);
  const multi2 = isMultiPath(p2);

  if (!multi1 && !multi2) {
    // Single subpath — use fast path
    return equalizeSegments(p1, p2, cfg);
  }

  // Global direction alignment (optional — helps with overall winding)
  const globalArea1 = polygonArea(samplePolygon(p1));
  const globalArea2 = polygonArea(samplePolygon(p2));

  let path1 = p1;
  let path2 = p2;

  // all paths must be clockwise
  if (Math.sign(globalArea1) < 0) {
    path1 = reversePath(path1);
  }
  if (Math.sign(globalArea2) < 0) {
    path2 = reversePath(path2);
  }

  // Multi-subpath: split and match
  const multiPath1 = splitPath(path1);
  const multiPath2 = splitPath(path2);

  const { outers: outers1, inners: inners1 } = classifyPaths(multiPath1);
  const { outers: outers2, inners: inners2 } = classifyPaths(multiPath2);

  // Match outers
  const outerPairs = matchPaths(outers1, outers2);

  // Match holes (simple: pair by area, ignore nesting for now)
  const innerPairs = matchPaths(inners1, inners2);

  // Equalize each pair
  const equalizedPairs: [MorphPathArray, MorphPathArray][] = [];

  for (const [from, to] of [...outerPairs, ...innerPairs]) {
    const [eqFrom, eqTo] = equalizeSegments(from, to, {
      ...cfg,
      reverse: false,
    });
    equalizedPairs.push([eqFrom, eqTo]);
  }

  // Reassemble into final morphable paths
  const finalFrom = equalizedPairs.map((p) => p[0]).flat() as MorphPathArray;
  const finalTo = equalizedPairs.map((p) => p[1]).flat() as MorphPathArray;

  return [finalFrom, finalTo] as [MorphPathArray, MorphPathArray];
};
