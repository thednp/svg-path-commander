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
} from "../types.ts";
import { pathToAbsolute } from "../convert/pathToAbsolute.ts";
import { normalizePath } from "./normalizePath.ts";
import { iterate } from "./iterate.ts";

/**
 * Reverses the segments of a single sub-path and returns a new PathArray
 * with absolute values.
 *
 * @param absolutePath - The absolute PathArray of a single sub-path
 * @returns The reversed PathArray
 */
const reverseSubPath = (absolutePath: PathArray): PathArray => {
  const normalizedPath = normalizePath(absolutePath);
  const pLen = absolutePath.length;
  const isClosed = absolutePath[pLen - 1][0] === "Z";

  // the end point of every normalized segment, the closing point of a
  // subpath is its starting point, so a segment following a `Z` starts
  // where the `Z` ends, not where the previous segment ended
  const endPoints: PointTuple[] = [];
  let endX = 0;
  let endY = 0;
  let subX = 0;
  let subY = 0;
  for (const seg of normalizedPath) {
    if (seg[0] === "M") {
      subX = +seg[1];
      subY = +seg[2];
      endX = subX;
      endY = subY;
    } else if (seg[0] === "Z") {
      endX = subX;
      endY = subY;
    } else {
      endX = +seg[seg.length - 2];
      endY = +seg[seg.length - 1];
    }
    endPoints.push([endX, endY]);
  }

  const reversedPath = iterate(absolutePath, (segment, i) => {
    const normalizedSegment = normalizedPath[i];
    const prevSeg = i && absolutePath[i - 1];
    const prevCommand = prevSeg && prevSeg[0];
    const nextSeg = absolutePath[i + 1];
    const nextCommand = nextSeg && nextSeg[0];
    const pathCommand = segment[0];
    const [x, y] = endPoints[i ? i - 1 : pLen - 1];
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
          result = [pathCommand, segment[3], segment[4], segment[1], segment[2], x, y];
        }
        break;
      case "S":
        // the control points can stay implicit only when the next segment
        // is an `S` as well, the reflected control point of the reversed
        // segment is then recovered from the previous segment of the
        // reversed path
        if (nextSeg && nextCommand === "S") {
          result = [pathCommand, normalizedSegment[1], normalizedSegment[2], x, y] as SSegment;
        } else {
          result = [
            "C",
            normalizedSegment[3],
            normalizedSegment[4],
            normalizedSegment[1],
            normalizedSegment[2],
            x,
            y,
          ] as CSegment;
        }
        break;
      case "Q":
        if (nextSeg && nextCommand === "T") {
          result = ["T", x, y] as TSegment;
        } else {
          result = [pathCommand, segment[1], segment[2], x, y];
        }
        break;
      case "T": {
        // the `T` shorthand reflects the control point of the previous
        // segment of the *reversed* path, which is the original successor
        // - when that successor is a `Q`, the shorthand would reflect the
        // `Q`'s control point instead of this segment's own control point
        // and silently change the curve
        const prevIsQuad = Boolean(prevCommand && "QT".includes(prevCommand));
        const nextIsT = Boolean(nextSeg && nextCommand === "T");
        const nextIsQuad = Boolean(nextSeg && nextCommand === "Q");
        if (nextIsT || (!prevIsQuad && !nextIsQuad)) {
          result = [pathCommand, x, y] as TSegment;
        } else {
          result = ["Q", normalizedSegment[1], normalizedSegment[2], x, y] as QSegment;
        }
        break;
      }
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
  ) as PathArray;
};

/**
 * Reverses all segments of a PathArray and returns a new PathArray
 * with absolute values.
 *
 * Every sub-path is reversed on its own, so the `M` and the `Z` of a
 * sub-path are swapped with each other and the sub-paths keep their
 * original order.
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
export const reversePath = <T extends PathArray>(pathInput: T | string): T => {
  const absolutePath = pathToAbsolute(pathInput);
  const subPaths: PathSegment[][] = [];
  let subPath: PathSegment[] = [];

  for (const segment of absolutePath) {
    if (segment[0] === "M" && subPath.length) {
      subPaths.push(subPath);
      subPath = [];
    }
    subPath.push(segment);
  }
  if (subPath.length) {
    subPaths.push(subPath);
  }

  const reversed = subPaths.map((path) => reverseSubPath(path as PathArray));

  return (reversed.length === 1 ? reversed[0] : reversed.flat()) as T;
};
