// import paramsParser from '../parser/paramsParser';
import type { AbsoluteCommand, IteratorCallback, PathArray } from "../types";

/**
 * Iterates over a `PathArray`, executing a callback for each segment.
 * The callback can:
 * - Read current position (`x`, `y`)
 * - Modify the segment (return new segment)
 * - Stop early (return `false`)
 *
 * The iterator maintains accurate current point (`x`, `y`) and subpath start (`mx`, `my`)
 * while correctly handling relative/absolute commands, including H/V and Z.
 *
 * **Important**: If the callback returns a new segment with more coordinates (e.g., Q → C),
 * the path length may increase, and iteration will continue over new segments.
 *
 * @template T - Specific PathArray type (e.g., CurveArray, PolylineArray)
 * @param path - The source `PathArray` to iterate over
 * @param iterator - Callback function for each segment
 * @param iterator.segment - Current path segment
 * @param iterator.index - Index of current segment
 * @param iterator.x - Current X position (after applying relative offset)
 * @param iterator.y - Current Y position (after applying relative offset)
 * @returns The modified `path` (or original if no changes)
 *
 * @example
 * iterate(path, (seg, i, x, y) => {
 *   if (seg[0] === 'L') return ['C', x, y, seg[1], seg[2], seg[1], seg[2]];
 * });
 */
export const iterate = <T extends PathArray>(
  path: T,
  iterator: IteratorCallback<T>,
) => {
  let x = 0;
  let y = 0;
  let mx = 0;
  let my = 0;

  let i = 0;
  while (i < path.length) {
    const segment = path[i];
    const [pathCommand] = segment;
    const absCommand = pathCommand.toUpperCase() as AbsoluteCommand;
    const isRelative = absCommand !== pathCommand;

    const iteratorResult = iterator(segment, i, x, y);
    // some methods like getPointAtLength would like to break
    // when task is complete
    if (iteratorResult === false) {
      break;
    }

    // segment = path[i];
    if (absCommand === "Z") {
      x = mx;
      y = my;
    } else if (absCommand === "H") {
      x = (segment[1] as number) + (isRelative ? x : 0);
    } else if (absCommand === "V") {
      y = (segment[1] as number) + (isRelative ? y : 0);
    } else {
      const segLen = segment.length;

      x = (segment[segLen - 2] as number) + (isRelative ? x : 0);
      y = (segment[segLen - 1] as number) + (isRelative ? y : 0);

      if (absCommand === "M") {
        mx = x;
        my = y;
      }
    }

    if (iteratorResult) {
      path[i] = iteratorResult;
    }

    i += 1;
  }
  return path as T;
};
