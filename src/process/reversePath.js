import pathToAbsolute from '../convert/pathToAbsolute';
import normalizePath from './normalizePath';

/**
 * Reverses all segments and their values of a `pathArray`
 * and returns a new instance.
 *
 * @param {SVGPathCommander.pathArray} pathInput the source `pathArray`
 * @returns {SVGPathCommander.pathArray} the reversed `pathArray`
 */
export default function reversePath(pathInput) {
  const absolutePath = pathToAbsolute(pathInput);
  const isClosed = absolutePath.slice(-1)[0][0] === 'Z';
  let reversedPath = [];

  reversedPath = normalizePath(absolutePath).map((segment, i) => {
    const values = segment.slice(1).map(Number);
    const [x, y] = values.slice(-2);
    return {
      seg: absolutePath[i], // absolute
      n: segment, // normalized
      c: absolutePath[i][0], // pathCommand
      values,
      x, // x
      y, // y
    };
  }).map((seg, i, path) => {
    const segment = seg.seg;
    const { values } = seg;
    const data = seg.n;
    const prevSeg = i && path[i - 1];
    const nextSeg = path[i + 1] && path[i + 1];
    const pathCommand = seg.c;
    const pLen = path.length;
    const x = i ? path[i - 1].x : path[pLen - 1].x;
    const y = i ? path[i - 1].y : path[pLen - 1].y;
    /** @type {SVGPathCommander.pathSegment} */
    let result = [''];

    switch (pathCommand) {
      case 'M':
        result = isClosed ? ['Z'] : [pathCommand, x, y];
        break;
      case 'A':
        // result = segment.slice(0, -3).concat([(segment[5] === 1 ? 0 : 1), x, y]);
        result = [pathCommand, ...values.slice(0, -3), (segment[5] === 1 ? 0 : 1), x, y];
        break;
      case 'C':
        if (nextSeg && nextSeg.c === 'S') {
          result = ['S', segment[1], segment[2], x, y];
        } else {
          result = [pathCommand, segment[3], segment[4], segment[1], segment[2], x, y];
        }
        break;
      case 'S':
        if ((prevSeg && 'CS'.includes(prevSeg.c)) && (!nextSeg || (nextSeg && nextSeg.c !== 'S'))) {
          result = ['C', data[3], data[4], data[1], data[2], x, y];
        } else {
          result = [pathCommand, data[1], data[2], x, y];
        }
        break;
      case 'Q':
        if (nextSeg && nextSeg.c === 'T') {
          result = ['T', x, y];
        } else {
          // result = segment.slice(0, -2).concat([x, y]);
          result = [pathCommand, ...values.slice(0, -2), x, y];
        }
        break;
      case 'T':
        if ((prevSeg && 'QT'.includes(prevSeg.c)) && (!nextSeg || (nextSeg && nextSeg.c !== 'T'))) {
          result = ['Q', data[1], data[2], x, y];
        } else {
          result = [pathCommand, x, y];
        }
        break;
      case 'Z':
        result = ['M', x, y];
        break;
      case 'H':
        result = [pathCommand, x];
        break;
      case 'V':
        result = [pathCommand, y];
        break;
      default:
        // result = segment.slice(0, -2).concat([x, y]);
        result = [pathCommand, ...values.slice(0, -2), x, y];
    }

    return result;
  });

  return isClosed ? reversedPath.reverse()
    : [reversedPath[0], ...reversedPath.slice(1).reverse()];
}
