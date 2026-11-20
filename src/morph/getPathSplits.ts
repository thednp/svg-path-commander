// src/morph/getPathSplits.ts

import type { CurveArray, PointTuple, PolylineArray } from "../types.ts";
import { measureSegments } from "../util/measureSegments.ts";
import { error } from "../util/error.ts";

/**
 * Determine the right amount of splits for each segment in a given PathArray
 * and for a target total amount of sub-segments.
 * For a triangle path "M0,0 L600,300 L0,600 Z" we have 3 equal lines,
 * we can easily do 4 splits per line and go to town, however, most triangles
 * are not even so we need to take side lengths into account.
 * @param path The target PathArray
 * @param target The total amount of sub-segments
 * @returns an array of numbers reprezenting the sub-segment count for each segment
 */
export function getPathSplits<T extends PolylineArray | CurveArray>(
  path: T,
  target: number,
): number[] {
  if (!Number.isFinite(target)) {
    throw new TypeError(`${error}: target must be a finite number`);
  }
  if (target < 2) throw new TypeError(`${error}: target must be >= 2`);

  // one measurement pass gives the length of every segment and the total
  const measures = measureSegments(path);
  const segmentCount = measures.length;
  if (!segmentCount) return [];

  const lengths = measures.map(({ length }) => length);
  const totalLength = lengths.reduce((total, length) => total + length, 0);
  if (!totalLength) return Array(segmentCount).fill(1);

  // the leading `M` counts as one split and every other segment needs at
  // least one, so the smallest reachable total is one split per segment
  const effectiveTarget = Math.max(Math.floor(target), segmentCount);
  const idealSegLen = totalLength / effectiveTarget;

  const splits: number[] = Array(segmentCount).fill(1);

  // First pass: distribute the splits proportionally to the segment lengths
  let totalAllocated = 1; // 1 stands for first M segment

  for (let i = 1; i < segmentCount; i += 1) {
    const segLen = lengths[i];
    const desired = segLen > idealSegLen ? Math.round(segLen / idealSegLen) : 1;

    splits[i] = desired;
    totalAllocated += desired;
  }

  // Second pass: adjust to hit the exact target
  let diff = effectiveTarget - totalAllocated;

  if (diff !== 0) {
    const candidates: PointTuple[] = [];
    for (let i = 1; i < segmentCount; i += 1) {
      if (lengths[i] > 0) {
        candidates.push([i, lengths[i]]);
      }
    }

    if (diff < 0) {
      // take the extra splits away from the shortest segments first
      candidates.sort((a, b) => a[1] - b[1]);
      while (diff < 0) {
        let changed = false;
        for (const [index] of candidates) {
          if (splits[index] > 1) {
            splits[index] -= 1;
            diff += 1;
            changed = true;
            if (diff === 0) break;
          }
        }
        // nothing left to give away - the target cannot be reached
        /* istanbul ignore if - the clamp above makes this unreachable */
        if (!changed) break;
      }
    } else {
      // give the extra splits to the longest segments first
      candidates.sort((a, b) => b[1] - a[1]);
      while (diff > 0) {
        for (const [index] of candidates) {
          splits[index] += 1;
          diff -= 1;
          if (diff === 0) break;
        }
      }
    }
  }
  return splits;
}
