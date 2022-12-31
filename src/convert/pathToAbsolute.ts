import parsePathString from '../parser/parsePathString';
import isAbsoluteArray from '../util/isAbsoluteArray';
import type {
  PathArray,
  AbsoluteArray,
  AbsoluteCommand,
  AbsoluteSegment,
  VSegment,
  HSegment,
  QSegment,
  TSegment,
  ASegment,
  SSegment,
  CSegment,
  MSegment,
} from '../types';

/**
 * Parses a path string value or object and returns an array
 * of segments, all converted to absolute values.
 *
 * @param pathInput the path string | object
 * @returns the resulted `pathArray` with absolute values
 */
const pathToAbsolute = (pathInput: string | PathArray): AbsoluteArray => {
  /* istanbul ignore else */
  if (isAbsoluteArray(pathInput)) {
    return [...pathInput];
  }

  const path = parsePathString(pathInput);
  let x = 0;
  let y = 0;
  let mx = 0;
  let my = 0;

  // the `absoluteSegment[]` is for sure an `absolutePath`
  return path.map(segment => {
    const values = segment.slice(1).map(Number);
    const [pathCommand] = segment;
    const absCommand = pathCommand.toUpperCase() as AbsoluteCommand;

    if (pathCommand === 'M') {
      [x, y] = values;
      mx = x;
      my = y;
      return ['M', x, y] as MSegment;
    }

    let absoluteSegment = [] as unknown as AbsoluteSegment;

    if (pathCommand !== absCommand) {
      if (absCommand === 'A') {
        absoluteSegment = [
          absCommand,
          values[0],
          values[1],
          values[2],
          values[3],
          values[4],
          values[5] + x,
          values[6] + y,
        ] as ASegment;
      } else if (absCommand === 'V') {
        absoluteSegment = [absCommand, values[0] + y] as VSegment;
      } else if (absCommand === 'H') {
        absoluteSegment = [absCommand, values[0] + x] as HSegment;
      } else {
        // use brakets for `eslint: no-case-declaration`
        // https://stackoverflow.com/a/50753272/803358
        const absValues = values.map((n, j) => n + (j % 2 ? y : x));
        // for n, l, c, s, q, t
        absoluteSegment = [absCommand, ...absValues] as QSegment | TSegment | SSegment | CSegment;
      }
    } else {
      absoluteSegment = [absCommand, ...values] as typeof segment;
    }

    // const segLength = absoluteSegment.length;
    if (absCommand === 'Z') {
      x = mx;
      y = my;
    } else if (absCommand === 'H') {
      [, x] = absoluteSegment as HSegment;
    } else if (absCommand === 'V') {
      [, y] = absoluteSegment as VSegment;
    } else {
      // x = absoluteSegment[segLength - 2];
      // y = absoluteSegment[segLength - 1];
      [x, y] = absoluteSegment.slice(-2) as [number, number];

      if (absCommand === 'M') {
        mx = x;
        my = y;
      }
    }

    return absoluteSegment;
  }) as AbsoluteArray;
};
export default pathToAbsolute;
