import type { PathArray, Point } from "../types.ts";
import type { PointProperties } from "../interface.ts";
import type { SegmentMeasure } from "./measureSegments.ts";
import { buildPathLengthTableFromMeasures, getPointAtTable } from "./pathLengthTable.ts";
import { getPropertiesFromMeasure } from "./getPropertiesAtLength.ts";
import { measureSegments } from "./measureSegments.ts";
import { parsePathString } from "../parser/parsePathString.ts";

/**
 * The relative difference below which two distances are the same.
 *
 * The distance of a point to a path is squared, so the noise of the floating
 * point arithmetic is relative to the distance itself. A path that runs at
 * a constant distance from the point — a circle around it — has no minimum at
 * all, and the noise of the samples must not be read as one.
 */
const distanceEpsilon = 1e-7;

/**
 * The precision of the refinement of the closest point.
 *
 * The precision is relative to the length of the path: a path of a few units
 * needs a finer precision than a path of thousands of units, and the answer
 * of a short path is expected to be as exact as the answer of a long one. The
 * relative floor is capped, so a very long path does not trade the accuracy
 * of its distance for a path-relative length precision.
 */
const precisionShare = 1e-9;
const maxPrecisionFloor = 1e-6;

/**
 * The number of samples of the coarse scan of a short path.
 *
 * The scan of the path is spread over its length, so a short path is sampled
 * more densely than a long one: the place where the path passes closest to
 * the point must not fall between two samples of the scan.
 */
const minSamples = 64;

/**
 * The maximum number of samples of the coarse scan of a path.
 *
 * The scan is dense enough to find the place where the path passes closest
 * to the point, but it stays bounded for a long path: the length of the path
 * is divided into this many intervals at most.
 */
const maxSamples = 4096;

/**
 * The step of the coarse scan of a long path, in units of length.
 */
const maxScanStep = 8;

/**
 * Finds the index of the segment a distance falls into.
 *
 * The segment is the last one whose accumulated length is below the
 * distance, the same segment the lookup of a point at that distance uses.
 *
 * @param measures - the measured segments of the path
 * @param distance - the distance along the path
 * @returns the index of the segment
 */
const findSegmentIndex = (measures: SegmentMeasure[], distance: number): number => {
  if (distance <= 0) return 0;

  let low = 0;
  let high = measures.length - 1;
  while (low < high) {
    const mid = (low + high + 1) >> 1;
    if (measures[mid].lengthAtSegment <= distance) {
      low = mid;
    } else {
      high = mid - 1;
    }
  }
  return low;
};

/**
 * Returns the closest point of a straight segment.
 *
 * The projection of the point on the line of the segment is the closest
 * point of the segment when it falls on the segment, and the closest end of
 * the segment when it does not. The projection is computed along the direction
 * of the segment, so a point that is on the segment is answered with itself.
 *
 * @param point - the point to project
 * @param startX - the X coordinate of the start of the segment
 * @param startY - the Y coordinate of the start of the segment
 * @param endX - the X coordinate of the end of the segment
 * @param endY - the Y coordinate of the end of the segment
 * @returns the closest point of the segment and its position on the segment
 */
const projectOnSegment = (
  point: Point,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
): { point: Point; ratio: number } => {
  const dx = endX - startX;
  const dy = endY - startY;
  const length = Math.hypot(dx, dy);
  // a segment without a length is a point
  /* istanbul ignore next */
  if (!length) return { point: { x: startX, y: startY }, ratio: 0 };

  // the projection has to be on the segment
  const ratio = ((point.x - startX) * dx + (point.y - startY) * dy) / (length * length);
  const clamped = Math.max(0, Math.min(1, ratio));
  return {
    point: { x: startX + dx * clamped, y: startY + dy * clamped },
    ratio: clamped,
  };
};

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
  // the step of the coarse scan, in units of length: a path that is shorter
  // than the step would be sampled at its ends only, so the step is a share
  // of the length of the path — a short path is sampled more densely, so the
  // place where the path passes closest to the point is not missed. The step
  // grows again for a very long path, so the number of samples stays bounded
  const scanStep = pathLength
    ? Math.max(pathLength / maxSamples, Math.min(maxScanStep, pathLength / minSamples))
    : maxScanStep;
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
  let lastScannedLength = -1;

  // the scan of the path: every sample is a point of the path, and the
  // distance to the point is measured
  const scan = (scanLength: number) => {
    if (scanLength <= lastScannedLength) return;
    lastScannedLength = scanLength;
    const scanPoint = getPointAtTable(table, scanLength);
    const scanDistance = distanceTo(scanPoint);

    // the last sample is a local minimum when the distance starts to grow
    // and it was not growing before it
    if (
      lastDistance < scanDistance - scanDistance * distanceEpsilon &&
      lastDistance <= previousDistance + previousDistance * distanceEpsilon
    ) {
      candidates.push({
        length: lastLength,
        distance: lastDistance,
        point: lastPoint,
      });
    }

    previousDistance = lastDistance;
    lastLength = scanLength;
    lastDistance = scanDistance;
    lastPoint = scanPoint;

    if (scanDistance < bestDistance) {
      bestLength = scanLength;
      bestDistance = scanDistance;
      bestPoint = scanPoint;
    }
  };

  // every segment is scanned on its own, so a short segment between two long
  // ones cannot fall between two samples of a scan of the whole path
  for (const measure of segmentMeasures) {
    const segmentStart = measure.lengthAtSegment;
    const segmentEnd = segmentStart + measure.length;
    for (let scanLength = segmentStart; scanLength < segmentEnd; scanLength += scanStep) {
      scan(scanLength);
    }
    scan(segmentEnd);
  }

  // the path can end with a minimum too
  if (lastDistance < previousDistance - previousDistance * distanceEpsilon) {
    candidates.push({
      length: lastLength,
      distance: lastDistance,
      point: lastPoint,
    });
  }

  // the binary search for the precise estimate, around one length
  const refine = (start: { length: number; distance: number; point: Point }) => {
    let { length, distance } = start;
    let closest = start.point;
    let precision = scanStep / 2;
    let beforeLength = 0;
    let afterLength = 0;
    // the search cannot go below the precision of the arithmetic, so the
    // precision is a share of the length of the path with an absolute cap
    const precisionFloor = Math.min(Math.max(pathLength * precisionShare, 1e-9), maxPrecisionFloor);

    while (precision > precisionFloor) {
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
        closest = before;
        length = beforeLength;
        distance = beforeDistance;
      } else if (after && afterDistance < distance) {
        closest = after;
        length = afterLength;
        distance = afterDistance;
      } else {
        precision /= 2;
      }
    }

    // the walk approximates the closest point, so the answer is snapped to
    // the exact projection of the point on the straight segment it is on
    const measure = segmentMeasures[findSegmentIndex(segmentMeasures, length)];
    const command = measure.geometry[0];
    if (command === "L" || command === "Z") {
      const { point: projected, ratio } = projectOnSegment(
        point,
        measure.startX,
        measure.startY,
        measure.endX,
        measure.endY,
      );
      const dx = point.x - projected.x;
      const dy = point.y - projected.y;
      const projectedDistance = dx * dx + dy * dy;
      if (projectedDistance < distance) {
        closest = projected;
        distance = projectedDistance;
        length = measure.lengthAtSegment + ratio * measure.length;
      }
    }

    return { closest, distance, length, measure };
  };

  // the best sample of the scan is searched first: it is not a local minimum
  // of the distance when the path runs at a constant distance from the point
  const best = refine({
    length: bestLength,
    distance: bestDistance,
    point: bestPoint,
  });
  let closest = best.closest;
  let closestDistance = best.distance;
  let closestLength = best.length;
  let closestMeasure = best.measure;

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
      closestMeasure = refined.measure;
    }
  }

  for (const measure of segmentMeasures) {
    const command = measure.geometry[0];
    let projected: Point;
    let ratio = 0;
    if (command === "M") {
      projected = { x: measure.endX, y: measure.endY };
    } else if (command === "L" || command === "Z") {
      const projection = projectOnSegment(
        point,
        measure.startX,
        measure.startY,
        measure.endX,
        measure.endY,
      );
      projected = projection.point;
      ratio = projection.ratio;
    } else {
      continue;
    }

    const dx = point.x - projected.x;
    const dy = point.y - projected.y;
    const projectedDistance = dx * dx + dy * dy;
    if (!Number.isFinite(projectedDistance) || projectedDistance >= closestDistance) continue;

    const projectedLength = measure.lengthAtSegment + ratio * measure.length;

    closest = projected;
    closestDistance = projectedDistance;
    closestLength = projectedLength;
    closestMeasure = measure;
  }

  const segment = getPropertiesFromMeasure(
    closestMeasure,
    Math.max(0, Math.min(closestMeasure.length, closestLength - closestMeasure.lengthAtSegment)),
  );

  return { closest, distance: Math.sqrt(closestDistance), segment };
};
