import type { PathArray, Point } from "../types.ts";
import type { PointProperties } from "../interface.ts";
import { buildPathLengthTableFromMeasures, getPointAtTable } from "./pathLengthTable.ts";
import { getPropertiesFromMeasures } from "./getPropertiesAtLength.ts";
import { measureSegments } from "./measureSegments.ts";
import { parsePathString } from "../parser/parsePathString.ts";

/**
 * The relative difference below which two distances are the same.
 *
 * The distance of a point to a path is squared, so the noise of the floating
 * point arithmetic is relative to the distance itself. A path that runs at a
 * constant distance from the point — a circle around it — has no minimum at
 * all, and the noise of the samples must not be read as one.
 */
const distanceEpsilon = 1e-7;

/**
 * Returns the point and segment in path closest to a given point as well as
 * the distance to the path stroke.
 *
 * @see https://bl.ocks.org/mbostock/8027637
 *
 * @param pathInput target `pathArray`
 * @param point the given point
 * @returns the requested properties
 */
export const getPropertiesAtPoint = <T extends PathArray>(
  pathInput: string | T,
  point: Point,
): PointProperties => {
  const path = parsePathString(pathInput);
  // an empty path has no closest point
  if (!path.length) {
    return { closest: { x: 0, y: 0 }, distance: Infinity };
  }
  // one pass over the path, the measure table holds the length of every
  // segment and the length accumulated before it
  const segmentMeasures = measureSegments(path);
  const table = buildPathLengthTableFromMeasures(segmentMeasures);
  const pathLength = table.totalLength;
  // a loop ends where it starts, so the search can walk over the end of the
  // path and find the other side of the join
  const isLoop = table.isLoop;
  const distanceTo = (p: Point) => {
    const dx = p.x - point.x;
    const dy = p.y - point.y;
    return dx * dx + dy * dy;
  };
  // the step of the coarse scan, in units of length
  const scanStep = 8;
  // the local minima of the scanned distance are the places where the path
  // passes near the point: a path can pass near it more than once — a closed
  // sub-path returns to its own start, so the point is sampled twice — and
  // every one of those places has to be searched
  const candidates: { length: number; distance: number; point: Point }[] = [];
  let bestLength = 0;
  let bestDistance = Infinity;
  let bestPoint: Point = { x: 0, y: 0 };
  let previousDistance = Infinity;
  let lastLength = 0;
  let lastDistance = Infinity;
  let lastPoint: Point = { x: 0, y: 0 };

  // linear scan for coarse approximation
  for (let scanLength = 0; scanLength <= pathLength; scanLength += scanStep) {
    const scan = getPointAtTable(table, scanLength);
    const scanDistance = distanceTo(scan);

    // the last sample is a local minimum when the distance starts to grow
    // and it was not growing before it
    if (
      lastDistance < scanDistance - scanDistance * distanceEpsilon &&
      lastDistance <= previousDistance + previousDistance * distanceEpsilon
    ) {
      candidates.push({ length: lastLength, distance: lastDistance, point: lastPoint });
    }

    previousDistance = lastDistance;
    lastLength = scanLength;
    lastDistance = scanDistance;
    lastPoint = scan;

    if (scanDistance < bestDistance) {
      bestLength = scanLength;
      bestDistance = scanDistance;
      bestPoint = scan;
    }
  }

  // the path can end with a minimum too
  if (lastDistance < previousDistance - previousDistance * distanceEpsilon) {
    candidates.push({ length: lastLength, distance: lastDistance, point: lastPoint });
  }

  // the binary search for the precise estimate, around one length
  const refine = (start: { length: number; distance: number; point: Point }) => {
    let { length, distance, point } = start;
    let precision = scanStep / 2;
    let beforeLength = 0;
    let afterLength = 0;

    while (precision > 0.000001) {
      beforeLength = length - precision;
      afterLength = length + precision;
      // a loop is walked over its end, an open path is not
      if (beforeLength < 0) {
        beforeLength = isLoop ? beforeLength + pathLength : -1;
      }
      if (afterLength > pathLength) {
        afterLength = isLoop ? afterLength - pathLength : pathLength + 1;
      }

      const before =
        beforeLength >= 0 && beforeLength <= pathLength
          ? getPointAtTable(table, beforeLength)
          : null;
      const after =
        afterLength >= 0 && afterLength <= pathLength ? getPointAtTable(table, afterLength) : null;
      const beforeDistance = before ? distanceTo(before) : Infinity;
      const afterDistance = after ? distanceTo(after) : Infinity;

      if (before && beforeDistance < distance) {
        point = before;
        length = beforeLength;
        distance = beforeDistance;
      } else if (after && afterDistance < distance) {
        point = after;
        length = afterLength;
        distance = afterDistance;
      } else {
        precision /= 2;
      }
      if (precision < 0.00001) break;
    }

    return { closest: point, distance, length };
  };

  // the best sample of the scan is searched first: it is not a local minimum
  // of the distance when the path runs at a constant distance from the point
  const best = refine({ length: bestLength, distance: bestDistance, point: bestPoint });
  let closest = best.closest;
  let closestDistance = best.distance;
  let closestLength = best.length;

  // the other places where the path passes near the point, the closest ones
  // first: the sampled distance of a place is an upper bound of the distance
  // of the path there, so a place that is not closer than the answer can
  // still be the one that answers it
  candidates.sort((a, b) => a.distance - b.distance);
  for (const candidate of candidates) {
    const refined = refine(candidate);
    if (refined.distance < closestDistance) {
      closest = refined.closest;
      closestDistance = refined.distance;
      closestLength = refined.length;
    }
  }

  const segment = getPropertiesFromMeasures(segmentMeasures, closestLength);

  return { closest, distance: Math.sqrt(closestDistance), segment };
};
