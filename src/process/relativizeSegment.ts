import type { ParserParams } from '../interface';
import type {
  RelativeSegment,
  RelativeCommand,
  PathSegment,
  aSegment,
  vSegment,
  hSegment,
  qSegment,
  tSegment,
  sSegment,
  cSegment,
} from '../types';

/**
 * Returns a relative segment of a `PathArray` object.
 *
 * @param segment the segment object
 * @param params the coordinates of the previous segment
 * @param index the segment index
 * @returns the absolute segment
 */
const relativizeSegment = (segment: PathSegment, params: ParserParams, index: number) => {
  const [pathCommand] = segment;
  const { x, y } = params;
  const values = segment.slice(1).map(Number);
  const relCommand = pathCommand.toLowerCase() as RelativeCommand;

  if (index === 0 && pathCommand === 'M') {
    return segment;
  }

  /* istanbul ignore else @preserve */
  if (pathCommand !== relCommand) {
    if (relCommand === 'a') {
      return [
        relCommand,
        values[0],
        values[1],
        values[2],
        values[3],
        values[4],
        values[5] - x,
        values[6] - y,
      ] as aSegment;
    } else if (relCommand === 'v') {
      return [relCommand, values[0] - y] as vSegment;
    } else if (relCommand === 'h') {
      return [relCommand, values[0] - x] as hSegment;
    } else {
      // use brakets for `eslint: no-case-declaration`
      // https://stackoverflow.com/a/50753272/803358
      const relValues = values.map((n, j) => n - (j % 2 ? y : x));
      // for n, l, c, s, q, t
      return [relCommand, ...relValues] as qSegment | tSegment | sSegment | cSegment;
    }
  }

  return segment as RelativeSegment;
};
export default relativizeSegment;
