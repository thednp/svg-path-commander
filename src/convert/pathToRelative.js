import parsePathString from '../parser/parsePathString';
import clonePath from '../process/clonePath';
import isRelativeArray from '../util/isRelativeArray';

/**
 * Parses a path string value or object and returns an array
 * of segments, all converted to relative values.
 *
 * @param {string | SVGPathCommander.pathArray} pathInput the path string | object
 * @returns {SVGPathCommander.relativeArray} the resulted `pathArray` with relative values
 */
export default function pathToRelative(pathInput) {
  if (isRelativeArray(pathInput)) {
    // @ts-ignore -- `isRelativeArray` checks if it's `pathArray`
    return clonePath(pathInput);
  }

  const path = parsePathString(pathInput);
  let x = 0; let y = 0;
  let mx = 0; let my = 0;

  // @ts-ignore -- this is actually a `relativeArray`
  return path.map((segment) => {
    const values = segment.slice(1).map(Number);
    const [pathCommand] = segment;
    /** @type {SVGPathCommander.relativeCommand} */
    // @ts-ignore
    const relativeCommand = pathCommand.toLowerCase();

    if (pathCommand === 'M') {
      [x, y] = values;
      mx = x;
      my = y;
      return ['M', x, y];
    }

    /** @type {SVGPathCommander.relativeSegment} */
    // @ts-ignore -- trust me DON'T CHANGE
    let relativeSegment = [];

    if (pathCommand !== relativeCommand) {
      switch (relativeCommand) {
        case 'a':
          relativeSegment = [
            relativeCommand, values[0], values[1], values[2],
            values[3], values[4], values[5] - x, values[6] - y];
          break;
        case 'v':
          relativeSegment = [relativeCommand, values[0] - y];
          break;
        case 'h':
          relativeSegment = [relativeCommand, values[0] - x];
          break;
        default: {
          // use brakets for `eslint: no-case-declaration`
          // https://stackoverflow.com/a/50753272/803358
          const relValues = values.map((n, j) => n - (j % 2 ? y : x));
          // @ts-ignore for M, L, C, S, Q, T
          relativeSegment = [relativeCommand, ...relValues];

          if (relativeCommand === 'm') {
            [x, y] = values;
            mx = x;
            my = y;
          }
        }
      }
    } else {
      if (pathCommand === 'm') {
        mx = values[0] + x;
        my = values[1] + y;
      }
      // @ts-ignore
      relativeSegment = [relativeCommand, ...values];
    }

    const segLength = relativeSegment.length;
    switch (relativeCommand) {
      case 'z':
        x = mx;
        y = my;
        break;
      case 'h':
        // @ts-ignore
        x += relativeSegment[1];
        break;
      case 'v':
        // @ts-ignore
        y += relativeSegment[1];
        break;
      default:
        // @ts-ignore
        x += relativeSegment[segLength - 2];
        // @ts-ignore
        y += relativeSegment[segLength - 1];
    }
    return relativeSegment;
  });
}
