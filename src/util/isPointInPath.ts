import type { PathArray, Point } from "../types.ts";
import type { PointInPathOptions } from "../interface.ts";
import { pathToCurve } from "../convert/pathToCurve.ts";
import { flattenPath } from "../process/flattenPath.ts";
import {
  getPolygonCrossings,
  getPolygonWindingNumber,
  isPointOnPolygon,
} from "../math/pointInPolygon.ts";
import { error } from "./error.ts";

/**
 * The distance a point can be from the boundary of a shape and still be on it.
 *
 * The tolerance of the flattening is the error of the approximation, not the
 * width of the boundary, so the boundary is tested with a tight distance.
 */
const boundaryEpsilon = 1e-9;

/**
 * Checks if a given point is inside a path.
 *
 * The path is flattened into polygons and the point is tested against them
 * with the fill rule of the path: the `nonzero` rule counts the windings of
 * the polygons around the point, the `evenodd` rule counts the crossings of
 * the polygons with a ray from the point. A point on the boundary of the
 * shape is inside of it, the way the browser answers it.
 *
 * The curves of the path are approximated with chords that stay within the
 * tolerance of the curve, so the answer is exact except for the points that
 * are within the tolerance of the boundary of a curve.
 *
 * @param pathInput target path
 * @param point the given `{x,y}` point
 * @param options the options of the test
 * @returns the query result
 *
 * @example
 * ```ts
 * isPointInPath('M0 0L100 0L100 100L0 100Z', { x: 50, y: 50 });
 * // => true
 * ```
 */
export const isPointInPath = <T extends PathArray>(
  pathInput: string | T,
  point: Point,
  options?: PointInPathOptions,
): boolean => {
  const { fillRule = "nonzero", tolerance = 0.1 } = options ?? {};

  if (fillRule !== "nonzero" && fillRule !== "evenodd") {
    throw TypeError(`${error}: fillRule must be "nonzero" or "evenodd"`);
  }
  if (typeof tolerance !== "number" || !Number.isFinite(tolerance) || tolerance <= 0) {
    throw TypeError(`${error}: tolerance must be a positive number`);
  }

  const path = pathToCurve(pathInput);
  // an empty path has no inside
  if (!path.length) return false;

  const polygons = flattenPath(path, tolerance);
  let crossings = 0;
  let winding = 0;

  for (const polygon of polygons) {
    // a point on the boundary of the shape is inside of it
    if (isPointOnPolygon(polygon, point, boundaryEpsilon)) return true;
    crossings += getPolygonCrossings(polygon, point);
    winding += getPolygonWindingNumber(polygon, point);
  }

  return fillRule === "evenodd" ? crossings % 2 === 1 : winding !== 0;
};
