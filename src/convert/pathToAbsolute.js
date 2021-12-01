import parsePathString from '../parser/parsePathString';
import clonePath from '../process/clonePath';
import isAbsoluteArray from '../util/isAbsoluteArray';

/**
 * Parses a path string value or object and returns an array
 * of segments, all converted to absolute values.
 *
 * @param {SVGPathCommander.pathArray | string} pathInput the path string | object
 * @returns {SVGPathCommander.pathArray} the resulted `pathArray` with absolute values
 */
export default function pathToAbsolute(pathInput) {
  if (isAbsoluteArray(pathInput)) {
    return clonePath(pathInput);
  }

  const path = parsePathString(pathInput);
  const ii = path.length;
  /** @type {SVGPathCommander.pathArray} */
  const resultArray = [];
  let x = 0;
  let y = 0;
  let mx = 0;
  let my = 0;
  let start = 0;

  if (path[0][0] === 'M') {
    // x = path[0][1];
    // y = path[0][2];
    [x, y] = path[0].slice(1).map(Number);
    mx = x;
    my = y;
    start += 1;
    resultArray.push(['M', x, y]);
  }

  for (let i = start; i < ii; i += 1) {
    const segment = path[i];
    const [pathCommand] = segment;
    const absCommand = pathCommand.toUpperCase();
    /** @type {SVGPathCommander.pathSegment} */
    // @ts-ignore -- trust me
    const absoluteSegment = [];
    /** @type {number[]} */
    let newSeg = [];
    // do not change order,
    // keep this push at this location
    resultArray.push(absoluteSegment);

    if (pathCommand !== absCommand) {
      absoluteSegment[0] = absCommand;

      switch (absCommand) {
        case 'A':
          // newSeg = segment.slice(1, -2).concat([+segment[6] + x, +segment[7] + y]);
          newSeg = [...segment.slice(1, -2).map(Number), segment[6] + x, segment[7] + y];
          for (let j = 0; j < newSeg.length; j += 1) {
            absoluteSegment.push(newSeg[j]);
          }
          break;
        case 'V':
          absoluteSegment[1] = segment[1] + y;
          break;
        case 'H':
          absoluteSegment[1] = segment[1] + x;
          break;
        default:
          if (absCommand === 'M') {
            mx = segment[1] + x;
            my = segment[2] + y;
          }
          // for is here to stay for eslint
          for (let j = 1; j < segment.length; j += 1) {
            absoluteSegment.push(+segment[j] + (j % 2 ? x : y));
          }
      }
    } else {
      for (let j = 0; j < segment.length; j += 1) {
        absoluteSegment.push(segment[j]);
      }
    }

    const segLength = absoluteSegment.length;
    switch (absCommand) {
      case 'Z':
        x = mx;
        y = my;
        break;
      case 'H':
        x = +absoluteSegment[1];
        break;
      case 'V':
        y = +absoluteSegment[1];
        break;
      default:
        x = +absoluteSegment[segLength - 2];
        y = +absoluteSegment[segLength - 1];

        if (absCommand === 'M') {
          mx = x;
          my = y;
        }
    }
  }

  return resultArray;
}
