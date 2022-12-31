import type {
  ASegment,
  CSegment,
  HSegment,
  MSegment,
  PathArray,
  PathSegment,
  QSegment,
  SSegment,
  TSegment,
  VSegment,
} from 'src/types';
import pathToAbsolute from '../convert/pathToAbsolute';
import normalizePath from './normalizePath';

/**
 * Reverses all segments of a `pathArray` and returns a new `pathArray` instance.
 *
 * @param pathInput the source `pathArray`
 * @returns the reversed `pathArray`
 */
const reversePath = (pathInput: PathArray): PathArray => {
  const absolutePath = pathToAbsolute(pathInput);
  const isClosed = absolutePath.slice(-1)[0][0] === 'Z';

  const reversedPath = normalizePath(absolutePath)
    .map((segment, i) => {
      const [x, y] = segment.slice(-2).map(Number);
      return {
        seg: absolutePath[i], // absolute
        n: segment, // normalized
        c: absolutePath[i][0], // pathCommand
        x, // x
        y, // y
      };
    })
    .map((seg, i, path) => {
      const segment = seg.seg;
      const data = seg.n;
      const prevSeg = i && path[i - 1];
      const nextSeg = path[i + 1];
      const pathCommand = seg.c;
      const pLen = path.length;
      const x = i ? path[i - 1].x : path[pLen - 1].x;
      const y = i ? path[i - 1].y : path[pLen - 1].y;
      let result = [];

      switch (pathCommand) {
        case 'M':
          result = (isClosed ? ['Z'] : [pathCommand, x, y]) as PathSegment;
          break;
        case 'A':
          result = [pathCommand, ...segment.slice(1, -3), segment[5] === 1 ? 0 : 1, x, y] as ASegment;
          break;
        case 'C':
          if (nextSeg && nextSeg.c === 'S') {
            result = ['S', segment[1], segment[2], x, y] as SSegment;
          } else {
            result = [pathCommand, segment[3], segment[4], segment[1], segment[2], x, y] as CSegment;
          }
          break;
        case 'S':
          if (prevSeg && 'CS'.includes(prevSeg.c) && (!nextSeg || nextSeg.c !== 'S')) {
            result = ['C', data[3], data[4], data[1], data[2], x, y] as CSegment;
          } else {
            result = [pathCommand, data[1], data[2], x, y] as SSegment;
          }
          break;
        case 'Q':
          if (nextSeg && nextSeg.c === 'T') {
            result = ['T', x, y] as TSegment;
          } else {
            result = [pathCommand, ...segment.slice(1, -2), x, y] as QSegment;
          }
          break;
        case 'T':
          if (prevSeg && 'QT'.includes(prevSeg.c) && (!nextSeg || nextSeg.c !== 'T')) {
            result = ['Q', data[1], data[2], x, y] as QSegment;
          } else {
            result = [pathCommand, x, y] as TSegment;
          }
          break;
        case 'Z':
          result = ['M', x, y] as MSegment;
          break;
        case 'H':
          result = [pathCommand, x] as HSegment;
          break;
        case 'V':
          result = [pathCommand, y] as VSegment;
          break;
        default:
          result = [pathCommand, ...segment.slice(1, -2), x, y] as PathSegment;
      }

      return result;
    });

  return (isClosed ? reversedPath.reverse() : [reversedPath[0], ...reversedPath.slice(1).reverse()]) as PathArray;
};
export default reversePath;
