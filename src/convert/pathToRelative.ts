import type {
  aSegment,
  hSegment,
  PathArray,
  RelativeArray,
  RelativeCommand,
  RelativeSegment,
  vSegment,
} from '../types';
import parsePathString from '../parser/parsePathString';
import isRelativeArray from '../util/isRelativeArray';

/**
 * Parses a path string value or object and returns an array
 * of segments, all converted to relative values.
 *
 * @param pathInput the path string | object
 * @returns the resulted `pathArray` with relative values
 */
const pathToRelative = (pathInput: string | PathArray): RelativeArray => {
  /* istanbul ignore else */
  if (isRelativeArray(pathInput)) {
    return pathInput.slice(0) as RelativeArray;
  }

  const path = parsePathString(pathInput);
  let x = 0;
  let y = 0;
  let mx = 0;
  let my = 0;

  return path.map(segment => {
    const values = segment.slice(1).map(Number);
    const [pathCommand] = segment;
    const relativeCommand = pathCommand.toLowerCase() as RelativeCommand;

    if (pathCommand === 'M') {
      [x, y] = values;
      mx = x;
      my = y;
      return ['M', x, y];
    }

    let relativeSegment = [];

    if (pathCommand !== relativeCommand) {
      if (relativeCommand === 'a') {
        relativeSegment = [
          relativeCommand,
          values[0],
          values[1],
          values[2],
          values[3],
          values[4],
          values[5] - x,
          values[6] - y,
        ] as aSegment;
      } else if (relativeCommand === 'v') {
        relativeSegment = [relativeCommand, values[0] - y] as vSegment;
      } else if (relativeCommand === 'h') {
        relativeSegment = [relativeCommand, values[0] - x] as hSegment;
      } else {
        // use brakets for `eslint: no-case-declaration`
        // https://stackoverflow.com/a/50753272/803358
        const relValues = values.map((n, j) => n - (j % 2 ? y : x));
        relativeSegment = [relativeCommand, ...relValues] as RelativeSegment;
      }
    } else {
      if (pathCommand === 'm') {
        mx = values[0] + x;
        my = values[1] + y;
      }
      relativeSegment = [relativeCommand, ...values] as RelativeSegment;
    }

    const segLength = relativeSegment.length;
    if (relativeCommand === 'z') {
      x = mx;
      y = my;
    } else if (relativeCommand === 'h') {
      x += relativeSegment[1] as number;
    } else if (relativeCommand === 'v') {
      y += relativeSegment[1] as number;
    } else {
      x += relativeSegment[segLength - 2] as number;
      y += relativeSegment[segLength - 1] as number;
    }

    return relativeSegment as typeof segment;
  }) as RelativeArray;
};
export default pathToRelative;
