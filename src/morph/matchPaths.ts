import type { NormalArray, PathFeature, PointTuple } from "../types.ts";
import { isPointInsideBBox } from "../intersect/isPointInsideBBox.ts";
import { boundingBoxIntersect } from "../intersect/boundingBoxIntersect.ts";
import { createPlaceholder } from "./createPlaceholder.ts";

interface CandidateScore {
  index: number;
  hasOverlap: boolean;
  boxIntersect: boolean;
  sizeDifference: number;
  centeredDistance: number;
}

function getBestMatch(target: PathFeature, candidates: PathFeature[]): PathFeature | null {
  const targetBBox = target.bbox;

  // Single pass: collect metrics for every candidate
  const potentialCandidates: CandidateScore[] = [];

  for (let i = 0; i < candidates.length; i++) {
    const { bbox, size } = candidates[i];

    const dx = targetBBox.cx - bbox.cx;
    const dy = targetBBox.cy - bbox.cy;
    const centeredDistance = Math.sqrt(dx * dx + dy * dy);

    const sizeDifference = Math.abs(target.size - size) / Math.max(target.size, size, 1e-6);

    const hasOverlap =
      isPointInsideBBox(
        [targetBBox.x, targetBBox.y, targetBBox.x2, targetBBox.y2],
        [bbox.cx, bbox.cy],
      ) || isPointInsideBBox([bbox.x, bbox.y, bbox.x2, bbox.y2], [targetBBox.cx, targetBBox.cy]);

    const boxIntersect = boundingBoxIntersect(
      [targetBBox.x, targetBBox.y, targetBBox.x2, targetBBox.y2],
      [bbox.x, bbox.y, bbox.x2, bbox.y2],
    );

    potentialCandidates.push({
      index: i,
      hasOverlap,
      boxIntersect,
      sizeDifference,
      centeredDistance,
    });
  }

  // Filter phase: strict overlap — pick smallest distance
  const overlaping = potentialCandidates.filter((c) => c.hasOverlap && c.boxIntersect);
  if (overlaping.length > 0) {
    let best = overlaping[0];
    for (let i = 1; i < overlaping.length; i++) {
      if (overlaping[i].centeredDistance < best.centeredDistance) {
        best = overlaping[i];
      }
    }
    return candidates.splice(best.index, 1)[0];
  }

  return null;
}

/**
 * Matches paths from two sets by proximity and size similarity.
 * Unmatched paths receive placeholder paths at their centroid.
 *
 * @param fromPaths - Source path features to match from
 * @param toPaths - Target path features to match to
 * @returns Array of paired NormalArrays [from, to]
 */
export function matchPaths(
  fromPaths: PathFeature[],
  toPaths: PathFeature[],
): [NormalArray, NormalArray][] {
  const pairs: [NormalArray, NormalArray][] = [];

  // the caller's arrays must not be sorted or emptied
  const from = [...fromPaths].sort((a, b) => b.size - a.size);
  const to = [...toPaths].sort((a, b) => b.size - a.size);

  while (from.length > 0) {
    const fromPath = from.shift()!;
    const bestTo = getBestMatch(fromPath, to);

    if (bestTo) {
      pairs.push([fromPath.path, bestTo.path]);
    } else {
      const fromCentroid: PointTuple = [fromPath.bbox.cx, fromPath.bbox.cy];
      pairs.push([fromPath.path, createPlaceholder(fromCentroid)]);
    }
  }

  while (to.length > 0) {
    const toPath = to.shift()!;
    const toCentroid: PointTuple = [toPath.bbox.cx, toPath.bbox.cy];
    pairs.push([createPlaceholder(toCentroid), toPath.path]);
  }

  return pairs;
}
