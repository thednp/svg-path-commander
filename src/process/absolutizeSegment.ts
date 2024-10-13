import type { ParserParams } from '../interface';
import type {
  AbsoluteSegment,
  AbsoluteCommand,
  ASegment,
  VSegment,
  HSegment,
  QSegment,
  SSegment,
  TSegment,
  CSegment,
  PathSegment,
  MSegment,
} from '../types';

/**
 * Returns an absolute segment of a `PathArray` object.
 *
 * @param segment the segment object
 * @param params the coordinates of the previous segment
 * @returns the absolute segment
 */
const absolutizeSegment = (segment: PathSegment, params: ParserParams) => {
  const [pathCommand] = segment;
  const { x, y } = params;
  const values = segment.slice(1).map(Number);
  const absCommand = pathCommand.toUpperCase() as AbsoluteCommand;
  const isAbsolute = absCommand === pathCommand;

  /* istanbul ignore else @preserve */
  if (!isAbsolute) {
    if (absCommand === 'A') {
      return [
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
      return [absCommand, values[0] + y] as VSegment;
    } else if (absCommand === 'H') {
      return [absCommand, values[0] + x] as HSegment;
    } else {
      // use brakets for `eslint: no-case-declaration`
      // https://stackoverflow.com/a/50753272/803358
      const absValues = values.map((n, j) => n + (j % 2 ? y : x));
      // for n, l, c, s, q, t
      return [absCommand, ...absValues] as MSegment | QSegment | TSegment | SSegment | CSegment;
    }
  }

  return segment as AbsoluteSegment;
};
export default absolutizeSegment;
