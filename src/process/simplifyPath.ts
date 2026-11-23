import type { LSegment, MSegment, PathArray, ZSegment } from "../types.ts";
import type { SimplifyOptions } from "../interface.ts";
import { error } from "../util/error.ts";
import { normalizePath } from "./normalizePath.ts";
import { splitSubPaths } from "./splitSubPaths.ts";
import { buildPathLengthTable } from "../util/pathLengthTable.ts";
import { samplePath } from "./samplePath.ts";
import { douglasPeucker } from "./douglasPeucker.ts";
import { fitCubic } from "./fitCubic.ts";

/**
 * The default tolerance of the simplification.
 */
const defaultTolerance = 1;

/**
 * The maximum number of samples of a path.
 *
 * The samples are the measurements of the algorithm, so their number grows
 * with the length of the path and shrinks with the tolerance: a very long
 * path with a very small tolerance would need millions of samples, so the
 * sampling is capped and the step grows to fit.
 */
const MAX_SAMPLES = 20000;

/**
 * The share of the tolerance the samples are spread with.
 *
 * The curve is sampled with a step of a sixteenth of the tolerance, so the
 * deviation of the curve between two samples is a fraction of the tolerance
 * itself: a range is only accepted when the curve stays within four fifths
 * of the tolerance from the chord, so the result cannot exceed it.
 */
const SAMPLE_SHARE = 16;

/**
 * The share of the tolerance a range of the path may use.
 *
 * The samples are a discretization of the path, so the deviation between two
 * samples is not measured: the range is accepted at four fifths of the
 * tolerance, so the result stays within the tolerance even when the curve
 * bulges a little between two samples.
 */
const ACCEPTANCE = 0.8;

/**
 * Simplifies a path within a geometric tolerance.
 *
 * Straight-line runs are reduced with Douglas-Peucker. Curve runs are fitted
 * with cubic Béziers, while arcs and original curves are preserved whenever
 * fitting would not reduce the segment count. Every source sub-path and its
 * closure are retained.
 *
 * The tolerance is the target geometric error of the sampled fitting. A
 * smaller tolerance keeps more detail, a bigger one removes more.
 *
 * @param pathInput - the target path string or PathArray
 * @param options - the tolerance of the simplification, or the options
 * @returns the simplified path
 *
 * @example
 * ```ts
 * simplifyPath("M0 0L10 0L20 0L30 0", 1)
 * // => [['M', 0, 0], ['L', 30, 0]]
 * ```
 */
export const simplifyPath = (
  pathInput: string | PathArray,
  options?: number | SimplifyOptions,
): PathArray => {
  const tolerance =
    typeof options === "number" ? options : (options?.tolerance ?? defaultTolerance);

  if (!Number.isFinite(tolerance) || tolerance <= 0) {
    throw new TypeError(`${error}: tolerance must be a positive number`);
  }

  const normalized = normalizePath(pathInput);
  if (!normalized.length) return [] as unknown as PathArray;

  const result: PathArray = [] as unknown as PathArray;
  for (const subPath of splitSubPaths(normalized)) {
    const closed = subPath[subPath.length - 1][0] === "Z";
    const straight = subPath
      .slice(1)
      .every(
        (segment) =>
          segment[0] === "L" ||
          segment[0] === "Z" ||
          (segment[0] === "A" && (segment[1] === 0 || segment[2] === 0)),
      );
    const { totalLength } = buildPathLengthTable(subPath);
    const step = Math.max(tolerance / SAMPLE_SHARE, totalLength / MAX_SAMPLES);
    const samples = samplePath(subPath, step);
    const start = samples[0];

    if (straight) {
      const kept = douglasPeucker(samples, tolerance * ACCEPTANCE);
      result.push(["M", start.x, start.y] as MSegment);
      const end = closed ? kept.length - 1 : kept.length;
      for (let i = 1; i < end; i += 1) {
        const point = samples[kept[i]];
        result.push(["L", point.x, point.y] as LSegment);
      }
      if (closed) result.push(["Z"] as ZSegment);
      continue;
    }

    const originalCount = subPath.length - 1 - (closed ? 1 : 0);
    const points = samples.filter(
      (point, index) =>
        index === 0 || point.x !== samples[index - 1].x || point.y !== samples[index - 1].y,
    );
    const curves =
      originalCount > 1 && points.length > 1 ? fitCubic(points, tolerance * ACCEPTANCE) : [];

    if (!curves.length || curves.length >= originalCount) {
      result.push(...subPath);
      continue;
    }

    result.push(["M", start.x, start.y] as MSegment, ...curves);
    if (closed) result.push(["Z"] as ZSegment);
  }

  return result;
};
