import type {
  // ASegment,
  CSegment,
  // HSegment,
  // MSegment,
  PathArray,
  PathSegment,
  PointTuple,
  QSegment,
  SSegment,
  TSegment,
  // VSegment,
} from "../types";
import { pathToAbsolute } from "../convert/pathToAbsolute";
import { normalizePath } from "./normalizePath";
import { iterate } from "./iterate";

/**
 * Reverses all segments of a PathArray and returns a new PathArray
 * with absolute values.
 *
 * @param pathInput - The source PathArray
 * @returns The reversed PathArray
 *
 * @example
 * ```ts
 * reversePath([['M', 0, 0], ['L', 100, 0], ['L', 100, 100], ['L', 0, 100], ['Z']])
 * // => [['M', 0, 100], ['L', 0, 0], ['L', 100, 0], ['L', 100, 100], ['Z']]
 * ```
 */
export const reversePath = <T extends PathArray>(pathInput: T) => {
  const absolutePath = pathToAbsolute(pathInput);
  const normalizedPath = normalizePath(absolutePath);
  const pLen = absolutePath.length;
  const isClosed = absolutePath[pLen - 1][0] === "Z";

  const reversedPath = iterate(absolutePath, (segment, i) => {
    const normalizedSegment = normalizedPath[i];
    const prevSeg = i && absolutePath[i - 1];
    const prevCommand = prevSeg && prevSeg[0];
    const nextSeg = absolutePath[i + 1];
    const nextCommand = nextSeg && nextSeg[0];
    const pathCommand = segment[0];
    const [x, y] = normalizedPath[i ? i - 1 : pLen - 1].slice(-2) as PointTuple;
    let result = segment;

    switch (pathCommand) {
      case "M":
        result = isClosed ? ["Z"] : [pathCommand, x, y];
        break;
      case "A":
        result = [
          pathCommand,
          segment[1],
          segment[2],
          segment[3],
          segment[4],
          segment[5] === 1 ? 0 : 1,
          x,
          y,
        ];
        break;
      case "C":
        if (nextSeg && nextCommand === "S") {
          result = ["S", segment[1], segment[2], x, y];
        } else {
          result = [
            pathCommand,
            segment[3],
            segment[4],
            segment[1],
            segment[2],
            x,
            y,
          ];
        }
        break;
      case "S":
        if (
          prevCommand &&
          "CS".includes(prevCommand) &&
          (!nextSeg || nextCommand !== "S")
        ) {
          result = [
            "C",
            normalizedSegment[3],
            normalizedSegment[4],
            normalizedSegment[1],
            normalizedSegment[2],
            x,
            y,
          ] as CSegment;
        } else {
          result = [
            pathCommand,
            normalizedSegment[1],
            normalizedSegment[2],
            x,
            y,
          ] as SSegment;
        }
        break;
      case "Q":
        if (nextSeg && nextCommand === "T") {
          result = ["T", x, y] as TSegment;
        } else {
          result = [pathCommand, segment[1], segment[2], x, y];
        }
        break;
      case "T":
        if (
          prevCommand &&
          "QT".includes(prevCommand) &&
          (!nextSeg || nextCommand !== "T")
        ) {
          result = [
            "Q",
            normalizedSegment[1],
            normalizedSegment[2],
            x,
            y,
          ] as QSegment;
        } else {
          result = [pathCommand, x, y] as TSegment;
        }
        break;
      case "Z":
        result = ["M", x, y];
        break;
      case "H":
        result = [pathCommand, x];
        break;
      case "V":
        result = [pathCommand, y];
        break;
      default:
        result = [pathCommand as typeof pathCommand | number].concat(
          segment.slice(1, -2),
          x,
          y,
        ) as typeof segment;
    }

    return result;
  });

  return (
    isClosed
      ? reversedPath.reverse()
      : [reversedPath[0] as PathSegment].concat(reversedPath.slice(1).reverse())
  ) as T;
};
