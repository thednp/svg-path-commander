// src/morph/getPathSplits.ts

import type { CSegment, CurveArray, PointTuple, PolylineArray } from "../types";
import { getLineLength } from "../math/lineTools";
import { getCubicLength } from "../math/cubicTools";
import { getTotalLength } from "../util/getTotalLength";
import { isPolylineArray } from "../util/isPolylineArray";
import { error } from "../util/error";
import { iterate } from "../process/iterate";

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
  if (target <= 1) throw new TypeError(`${error}: target must be >= 2`);

  const totalLength = getTotalLength(path);
  if (totalLength === 0) return Array(path.length).fill(1);

  const idealSegLen = totalLength / target; // minus M segment
  const isPoly = isPolylineArray(path);

  const splits: number[] = [1]; // M gets 0 splits
  const lengths: number[] = [0]; // M has 0 length

  // First pass: measure each segment length
  iterate(path, (seg, i, prevX, prevY) => {
    if (i > 0) {
      const [endX, endY] = seg.slice(-2) as PointTuple;
      const segLen = isPoly
        ? getLineLength(prevX, prevY, endX, endY)
        : getCubicLength(
          prevX,
          prevY,
          seg[1],
          seg[2],
          (seg as CSegment)[3],
          (seg as CSegment)[4],
          (seg as CSegment)[5],
          (seg as CSegment)[6],
        );
      lengths.push(segLen);
      splits.push(1); // placeholder
    }
  });

  // Second pass: distribute splits proportionally
  let totalAllocated = 1; // 1 stands for first M segment

  for (let i = 1; i < lengths.length; i++) {
    const segLen = lengths[i];
    const desired = segLen > idealSegLen ? Math.round(segLen / idealSegLen) : 1;

    splits[i] = desired;
    totalAllocated += desired;
  }

  // Third pass: adjust to hit exact target
  let diff = target - totalAllocated;

  if (diff !== 0) {
    const candidates: PointTuple[] = [];
    for (let i = 1; i < lengths.length; i++) {
      // istanbul ignore else
      if (lengths[i] > 0) {
        candidates.push([i, lengths[i]]);
      }
    }

    const cLen = candidates.length;

    // istanbul ignore else - impossible to test that edge case
    if (diff < 0) {
      // sort ascending
      candidates.sort((a, b) => a[1] - b[1]);
      for (let i = 0; i < cLen; i++) {
        const idx = candidates[i][0];
        if (splits[idx] > 1 && candidates[i][1] > 0) {
          splits[idx]--;
          diff++;
        }
        if (diff === 0) break;
        else if (i === cLen - 1) i = 0;
      }
    } else if (diff > 0) {
      // sort descending
      candidates.sort((a, b) => b[1] - a[1]);
      for (let i = 0; i < cLen; i++) {
        const idx = candidates[i][0];
        if (candidates[i][1] > 0) {
          splits[idx]++;
          diff--;
        }
        if (diff === 0) break;
        else if (i === cLen - 1) i = 0;
      }
    }
  }
  return splits;
}
