import type { LSegment, MSegment, NormalArray, PathArray, ZSegment } from "../types.ts";
import type { SimplifyOptions } from "../interface.ts";
import { error } from "../util/error.ts";
import { normalizePath } from "./normalizePath.ts";
import { buildPathLengthTable } from "../util/pathLengthTable.ts";
import { samplePath } from "./samplePath.ts";
import { douglasPeucker } from "./douglasPeucker.ts";

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
 * Splits a normalized path into its sub-paths.
 *
 * @param path - the normalized path to split
 * @returns the sub-paths of the path
 */
const splitSubPaths = (path: NormalArray): NormalArray[] => {
  const result: NormalArray[] = [];
  let current: NormalArray = [] as unknown as NormalArray;
  for (const segment of path) {
    if (segment[0] === "M") {
      // the path is not empty, so the first sub-path is never missing
      if (current.length) result.push(current);
      current = [segment] as unknown as NormalArray;
    } else {
      current.push(segment);
    }
  }
  result.push(current);
  return result;
};

/**
 * Simplifies a path, with the Douglas-Peucker algorithm.
 *
 * The path is sampled along its length and the points that are needed to
 * keep its shape within the tolerance are kept: the result is a path of
 * straight lines, one sub-path for every sub-path of the source.
 *
 * The tolerance is the maximum distance between the result and the source:
 * every point of the source stays within the tolerance of the result. A
 * smaller tolerance keeps more points, a bigger one removes more.
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
    const { totalLength } = buildPathLengthTable(subPath);
    // the step between two samples of the path
    const step = Math.max(tolerance / SAMPLE_SHARE, totalLength / MAX_SAMPLES);
    const samples = samplePath(subPath, step);
    const kept = douglasPeucker(samples, tolerance * ACCEPTANCE);

    const start = samples[0];
    result.push(["M", start.x, start.y] as MSegment);

    // a closed sub-path ends with the point it started at, the close
    // segment takes its place
    const closed = subPath[subPath.length - 1][0] === "Z";
    const end = closed ? kept.length - 1 : kept.length;
    for (let i = 1; i < end; i += 1) {
      const point = samples[kept[i]];
      result.push(["L", point.x, point.y] as LSegment);
    }
    if (closed) result.push(["Z"] as ZSegment);
  }

  return result;
};
