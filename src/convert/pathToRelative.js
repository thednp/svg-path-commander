import parsePathString from '../parser/parsePathString';
import clonePath from '../process/clonePath';
import isRelativeArray from '../util/isRelativeArray';

/**
 * Parses a path string value or object and returns an array
 * of segments, all converted to relative values.
 *
 * @param {string | SVGPath.pathArray} pathInput the path string | object
 * @returns {SVGPath.relativeArray} the resulted `pathArray` with relative values
 */
export default function pathToRelative(pathInput) {
  /* istanbul ignore else */
  if (isRelativeArray(pathInput)) {
    return clonePath(pathInput);
  }

  const path = parsePathString(pathInput);
  let x = 0; let y = 0;
  let mx = 0; let my = 0;

  return path.map((segment) => {
    const values = segment.slice(1).map(Number);
    const [pathCommand] = segment;
    /** @type {SVGPath.relativeCommand} */
    const relativeCommand = pathCommand.toLowerCase();

    if (pathCommand === 'M') {
      [x, y] = values;
      mx = x;
      my = y;
      return ['M', x, y];
    }

    /** @type {SVGPath.relativeSegment} */
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
          relativeSegment = [relativeCommand, ...relValues];
        }
      }
    } else {
      if (pathCommand === 'm') {
        mx = values[0] + x;
        my = values[1] + y;
      }
      relativeSegment = [relativeCommand, ...values];
    }

    const segLength = relativeSegment.length;
    switch (relativeCommand) {
      case 'z':
        x = mx;
        y = my;
        break;
      case 'h':
        x += relativeSegment[1];
        break;
      case 'v':
        y += relativeSegment[1];
        break;
      default:
        x += relativeSegment[segLength - 2];
        y += relativeSegment[segLength - 1];
    }
    return relativeSegment;
  });
}
