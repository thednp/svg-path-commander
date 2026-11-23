// src/morph/getRotatedPath.ts

import type {
  CSegment,
  // CurveArray,
  LSegment,
  MorphPathArray,
  MSegment,
  PathSegment,
  // PolylineArray,
  ZSegment,
} from "../types.ts";
import { error } from "../util/error.ts";

/**
 * Returns a single rotation of a path (line or curve) by shifting the start point.
 * The rotation starts at the end of the segment at `idx` and continues with the
 * following segments, wrapping around the end of the path.
 *
 * @param a PathArray (M + L/C + optional Z) — must be single subpath, normalized
 * @param idx the index of the segment the rotation starts at
 * @returns PathArray — the rotation of the path
 */
export function getRotation<T extends MorphPathArray>(a: T, idx: number): T {
  const pathLen = a.length;
  const pointCount = pathLen - 1;
  const path = [] as unknown as T;

  for (let i = 0; i < pathLen; i++) {
    let oldSegIdx = idx + i;
    let seg: LSegment | CSegment | MSegment | ZSegment;

    if (i === 0 || (a[oldSegIdx] && a[oldSegIdx][0] === "M")) {
      seg = a[oldSegIdx];
      path.push(["M", ...seg.slice(-2)] as MSegment);
      continue;
    }
    if (oldSegIdx >= pathLen) {
      oldSegIdx -= pointCount;
    }
    path.push(a[oldSegIdx] as never);
  }
  return path;
}

/**
 * Returns all possible rotations of a path (line or curve) by shifting the start point.
 * Each rotation is a new PathArray starting at a different original segment.
 *
 * @param path PathArray (M + L/C + optional Z) — must be single subpath, normalized
 * @returns PathArray[] — array of all possible rotations
 */
export function getRotations<T extends MorphPathArray>(a: T): T[] {
  const pathLen = a.length;
  const result = [] as T[];

  for (let idx = 0; idx < pathLen; idx++) {
    result.push(getRotation(a, idx));
  }
  return result;
}

const getSegmentDistanceSquared = (a: PathSegment, b: PathSegment): number => {
  let distance = 0;
  for (let i = 1; i < a.length; i += 1) {
    const delta = Number(a[i]) - Number(b[i]);
    distance += delta * delta;
  }
  return distance;
};

const getStartDistanceSquared = (a: PathSegment, b: PathSegment): number => {
  const dx = Number(a[a.length - 2]) - Number(b[b.length - 2]);
  const dy = Number(a[a.length - 1]) - Number(b[b.length - 1]);
  return dx * dx + dy * dy;
};

/**
 * Finds the rotation of `pathA` that matches `pathB` best by minimizing the sum
 * of squared distances between all corresponding coordinates, including the
 * control points of the curves.
 *
 * The rotations are not materialized: the segment at index `j` of the rotation
 * that starts at `idx` is the segment at index `1 + ((idx + i - 1) mod
 * pointCount)` of the source path, so the sum can be computed from the source
 * path alone.
 *
 * A rotation whose running sum is already worse than the best rotation found so
 * far cannot become the best one — the terms of the sum are squared distances,
 * so the sum only grows — and the rotation is dropped right there.
 *
 * The rotations are checked in the order of their first term, the distance
 * between the start of the rotation and the start of the reference path: the
 * rotation that matches best is usually the one that starts closest, so it is
 * usually found early and the rest of the rotations are dropped right away.
 *
 * @param pathA the path to rotate
 * @param pathB the reference path
 * @returns the index of the best rotation
 */
const getBestRotationIndex = <T extends MorphPathArray>(pathA: T, pathB: T): number => {
  const pathLen = pathA.length;
  const pointCount = pathLen - 1;

  const firstTerms: number[] = [];
  const order: number[] = [];
  for (let idx = 0; idx < pathLen; idx++) {
    firstTerms.push(getStartDistanceSquared(pathA[idx], pathB[0]));
    order.push(idx);
  }
  order.sort((a, b) => {
    const first = firstTerms[a];
    const second = firstTerms[b];
    if (first < second) return -1;
    if (first > second) return 1;
    return a - b;
  });

  let bestIndex = 0;
  let minDistanceSq = Infinity;

  for (const idx of order) {
    let sumDistSq = firstTerms[idx];
    if (sumDistSq > minDistanceSq) continue;

    for (let i = 1; i < pathLen; i++) {
      const j = 1 + ((idx + i - 1) % pointCount);
      sumDistSq += getSegmentDistanceSquared(pathA[j], pathB[i]);
      if (sumDistSq > minDistanceSq) break;
    }

    if (sumDistSq < minDistanceSq || (sumDistSq === minDistanceSq && idx < bestIndex)) {
      minDistanceSq = sumDistSq;
      bestIndex = idx;
    }
  }

  return bestIndex;
};

/**
 * Finds the best rotation of pathA to match pathB by minimizing the sum of squared distances
 * between corresponding coordinates, including curve control points.
 *
 * Works with both polygon (L) and curve (C) arrays.
 *
 * @param pathA PathArray to rotate (will be modified in rotation options)
 * @param pathB PathArray reference (fixed)
 * @returns PathArray — best rotation of pathA
 */
export function getRotatedPath<T extends MorphPathArray>(
  pathA: T,
  pathB: T,
  computedRotations?: T[],
): T {
  const segCountA = pathA.length;
  const segCountB = pathB.length;

  if (segCountA !== segCountB) {
    throw new TypeError(error + ": paths must have the same number of segments after equalization");
  }

  if (computedRotations) {
    let bestIndex = 0;
    let minDistanceSq = Infinity;

    for (let ri = 0; ri < computedRotations.length; ri++) {
      const rotation = computedRotations[ri];
      let sumDistSq = 0;

      for (let i = 0; i < rotation.length; i++) {
        sumDistSq += getSegmentDistanceSquared(rotation[i], pathB[i]);
      }

      if (sumDistSq < minDistanceSq) {
        minDistanceSq = sumDistSq;
        bestIndex = ri;
      }
    }

    return computedRotations[bestIndex];
  }

  return getRotation(pathA, getBestRotationIndex(pathA, pathB));
}
