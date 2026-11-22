// src/morph/equalize.ts
import type { EqualizeOptions, PathArray } from "../types.ts";
import { isMultiPath } from "../util/isMultiPath.ts";
import { normalizePath } from "../process/normalizePath.ts";
import { equalizePaths } from "./equalizePaths.ts";
import { equalizeSegments } from "./equalizeSegments.ts";
import { error } from "../util/error.ts";

const equalizeDefaults: EqualizeOptions = {
  points: "auto",
  strategy: "segment",
  align: true,
  reverse: "auto",
  mode: "auto",
  roundValues: 4,
  close: false,
};

/**
 * Equalizes two paths for morphing.
 *
 * The two paths are brought to the same shape, so they can be morphed into
 * each other: they hold the same number of segments of the same type, their
 * winding is the same and their points are aligned.
 *
 * A path with a single sub-path is equalized on its own, a path with more
 * sub-paths is split into sub-paths, the sub-paths are matched by their
 * shape and every pair is equalized on its own. Multi-subpath paths are
 * reversed as whole paths, so an outer contour keeps its relationship with
 * its holes. Matched contours are not reversed independently: a fallback
 * pair between an outer contour and a hole can keep opposite winding and
 * interpolate with a twist, because reversing that hole on its own would
 * change the fill topology of the path.
 *
 * The `strategy` option decides how the points of the paths are placed:
 * - `segment` splits the segments of the paths, so the points of the result
 *   are the points of the paths;
 * - `arcLength` distributes the points of the result along the length of
 *   the paths. The source segment boundaries and corners are points of the
 *   result too when the requested count allows it, so the shape of the paths
 *   keeps its vertices.
 *
 * The `points` option is the number of points of the result. The automatic
 * mode uses the number of points of the bigger path.
 *
 * The `reverse` option decides what happens when the two paths draw in
 * opposite directions: `true` reverses the second path, `false` leaves the
 * paths as they are and `auto` reverses the path that leaves the two paths
 * closest to each other.
 *
 * @see https://minus-ze.ro/posts/morphing-arbitrary-paths-in-svg/
 *
 * @param pathInput1 - First path string or PathArray
 * @param pathInput2 - Second path string or PathArray
 * @param initialCfg - Configuration options for equalization
 * @returns Tuple of two equalized PathArrays
 *
 * @example
 * ```ts
 * const [eq1, eq2] = equalize('M0 0L100 0L50 100Z', 'M0 0L100 0L100 100L0 100Z')
 * // eq1.length === eq2.length — ready for morphing
 * ```
 */
export const equalize = (
  pathInput1: string | PathArray,
  pathInput2: string | PathArray,
  initialCfg: EqualizeOptions = {},
): [PathArray, PathArray] => {
  const { align, close, mode, points, reverse, roundValues, strategy } = {
    ...equalizeDefaults,
    ...initialCfg,
  };

  if (typeof points === "number" && (!Number.isFinite(points) || points < 2)) {
    throw new TypeError(`${error}: points must be a number greater than 1`);
  }

  const p1 = normalizePath(pathInput1);
  const p2 = normalizePath(pathInput2);

  // a path with more than one sub-path is split and matched first
  if (isMultiPath(p1) || isMultiPath(p2)) {
    return equalizePaths(p1, p2, {
      align,
      close,
      mode,
      reverse,
      roundValues,
      strategy,
      target: typeof points === "number" ? points : undefined,
    });
  }

  return equalizeSegments(p1, p2, {
    align,
    close,
    mode,
    reverse,
    roundValues,
    strategy,
    target: typeof points === "number" ? points : undefined,
  });
};
