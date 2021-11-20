import pathToAbsolute from '../convert/pathToAbsolute.js';
import normalizePath from './normalizePath.js';

export default function reversePath(pathString) { // pathArray | pathString
  const absolutePath = pathToAbsolute(pathString);
  const isClosed = absolutePath.slice(-1)[0][0] === 'Z';
  let reversedPath = [];
  let segLength = 0;

  reversedPath = normalizePath(absolutePath).map((segment, i) => {
    segLength = segment.length;
    return {
      seg: absolutePath[i], // absolute
      n: segment, // normalized
      c: absolutePath[i][0], // pathCommand
      x: segment[segLength - 2], // x
      y: segment[segLength - 1], // y
    };
  }).map((seg, i, pathArray) => {
    const segment = seg.seg;
    const data = seg.n;
    const prevSeg = i && pathArray[i - 1];
    const nextSeg = pathArray[i + 1] && pathArray[i + 1];
    const pathCommand = seg.c;
    const pLen = pathArray.length;
    const x = i ? pathArray[i - 1].x : pathArray[pLen - 1].x;
    const y = i ? pathArray[i - 1].y : pathArray[pLen - 1].y;
    let result = [];

    switch (pathCommand) {
      case 'M':
        result = isClosed ? ['Z'] : [pathCommand, x, y];
        break;
      case 'A':
        result = segment.slice(0, -3).concat([(segment[5] === 1 ? 0 : 1), x, y]);
        break;
      case 'C':
        if (nextSeg && nextSeg.c === 'S') {
          result = ['S', segment[1], segment[2], x, y];
        } else {
          result = [pathCommand, segment[3], segment[4], segment[1], segment[2], x, y];
        }
        break;
      case 'S':
        if ((prevSeg && 'CS'.indexOf(prevSeg.c) > -1) && (!nextSeg || (nextSeg && nextSeg.c !== 'S'))) {
          result = ['C', data[3], data[4], data[1], data[2], x, y];
        } else {
          result = [pathCommand, data[1], data[2], x, y];
        }
        break;
      case 'Q':
        if (nextSeg && nextSeg.c === 'T') {
          result = ['T', x, y];
        } else {
          result = segment.slice(0, -2).concat([x, y]);
        }
        break;
      case 'T':
        if ((prevSeg && 'QT'.indexOf(prevSeg.c) > -1) && (!nextSeg || (nextSeg && nextSeg.c !== 'T'))) {
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
        result = segment.slice(0, -2).concat([x, y]);
    }

    return result;
  });

  return isClosed ? reversedPath.reverse()
    : [reversedPath[0]].concat(reversedPath.slice(1).reverse());
}
