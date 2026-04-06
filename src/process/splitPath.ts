// import paramsParser from "../parser/paramsParser";
import { parsePathString } from "../parser/parsePathString";
import type {
  AbsoluteCommand,
  HSegment,
  MSegment,
  PathArray,
  PointTuple,
  VSegment,
} from "../types";
import { iterate } from "./iterate";

/**
 * Split a path string or PathArray into an array of sub-paths.
 *
 * In the process, values are converted to absolute
 * for visual consistency.
 *
 * @param pathInput - The source path string or PathArray
 * @returns An array of sub-path PathArrays
 *
 * @example
 * ```ts
 * splitPath('M0 0L100 0ZM200 0L300 0Z')
 * // => [
 * //   [['M', 0, 0], ['L', 100, 0], ['Z']],
 * //   [['M', 200, 0], ['L', 300, 0], ['Z']]
 * // ]
 * ```
 */
export const splitPath = <T extends PathArray>(pathInput: T | string): T[] => {
  const composite: T[] = [];
  const parsedPath = parsePathString(pathInput);
  let path = [] as unknown as T;
  let pi = -1;
  let x = 0;
  let y = 0;
  let mx = 0;
  let my = 0;

  iterate(parsedPath, (seg, _, prevX, prevY) => {
    const cmd = seg[0];
    const absCommand = cmd.toUpperCase() as AbsoluteCommand;
    const isRelative = cmd === cmd.toLowerCase();
    const values = seg.slice(1) as number[];

    if (absCommand === "M") {
      pi += 1;

      [x, y] = values as PointTuple;
      x += isRelative ? prevX : 0;
      y += isRelative ? prevY : 0;
      mx = x;
      my = y;
      path = [
        (isRelative ? [absCommand, mx, my] : seg) as MSegment,
      ] as unknown as T;
    } else {
      if (absCommand === "Z") {
        x = mx;
        y = my;
      } else if (absCommand === "H") {
        [, x] = seg as HSegment;
        x += isRelative ? prevX : /* istanbul ignore next @preserve */ 0;
      } else if (absCommand === "V") {
        [, y] = seg as VSegment;
        y += isRelative ? prevY : /* istanbul ignore next @preserve */ 0;
      } else {
        [x, y] = seg.slice(-2) as PointTuple;
        x += isRelative ? prevX : 0;
        y += isRelative ? prevY : 0;
      }
      path.push(seg);
    }

    composite[pi] = path;
  });

  return composite;
};
export default splitPath;
