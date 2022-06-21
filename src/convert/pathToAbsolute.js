import parsePathString from '../parser/parsePathString';
import clonePath from '../process/clonePath';
import isAbsoluteArray from '../util/isAbsoluteArray';
/**
 * Parses a path string value or object and returns an array
 * of segments, all converted to absolute values.
 *
 * @param {string | SVGPath.pathArray} pathInput the path string | object
 * @returns {SVGPath.absoluteArray} the resulted `pathArray` with absolute values
 */
export default function pathToAbsolute(pathInput) {
  /* istanbul ignore else */
  if (isAbsoluteArray(pathInput)) {
    // `isAbsoluteArray` checks if it's `pathArray`
    return clonePath(pathInput);
  }

  const path = parsePathString(pathInput);
  let x = 0; let y = 0;
  let mx = 0; let my = 0;

  // the `absoluteSegment[]` is for sure an `absolutePath`
  return path.map((segment) => {
    const values = segment.slice(1).map(Number);
    const [pathCommand] = segment;
    /** @type {SVGPath.absoluteCommand} */
    const absCommand = pathCommand.toUpperCase();

    if (pathCommand === 'M') {
      [x, y] = values;
      mx = x;
      my = y;
      return ['M', x, y];
    }
    /** @type {SVGPath.absoluteSegment} */
    let absoluteSegment = [];

    if (pathCommand !== absCommand) {
      switch (absCommand) {
        case 'A':
          absoluteSegment = [
            absCommand, values[0], values[1], values[2],
            values[3], values[4], values[5] + x, values[6] + y];
          break;
        case 'V':
          absoluteSegment = [absCommand, values[0] + y];
          break;
        case 'H':
          absoluteSegment = [absCommand, values[0] + x];
          break;
        default: {
          // use brakets for `eslint: no-case-declaration`
          // https://stackoverflow.com/a/50753272/803358
          const absValues = values.map((n, j) => n + (j % 2 ? y : x));
          // for n, l, c, s, q, t
          absoluteSegment = [absCommand, ...absValues];
        }
      }
    } else {
      absoluteSegment = [absCommand, ...values];
    }

    const segLength = absoluteSegment.length;
    switch (absCommand) {
      case 'Z':
        x = mx;
        y = my;
        break;
      case 'H':
        [, x] = absoluteSegment;
        break;
      case 'V':
        [, y] = absoluteSegment;
        break;
      default:
        x = absoluteSegment[segLength - 2];
        y = absoluteSegment[segLength - 1];

        if (absCommand === 'M') {
          mx = x;
          my = y;
        }
    }
    return absoluteSegment;
  });
}
