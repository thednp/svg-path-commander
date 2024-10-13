import type { ParserParams } from '../interface';
import type {
  AbsoluteSegment,
  HSegment,
  NormalSegment,
  PathCommand,
  ShortSegment,
  SSegment,
  TSegment,
  VSegment,
  ZSegment,
} from '../types';

/**
 * Shorten a single segment of a `pathArray` object.
 *
 * @param segment the `absoluteSegment` object
 * @param normalSegment the `normalSegment` object
 * @param params the coordinates of the previous segment
 * @param prevCommand the path command of the previous segment
 * @returns the shortened segment
 */
const shortenSegment = (
  segment: AbsoluteSegment,
  normalSegment: NormalSegment,
  params: ParserParams,
  prevCommand: PathCommand,
): ShortSegment => {
  const [pathCommand] = segment;
  const round4 = (n: number) => Math.round(n * 10 ** 4) / 10 ** 4;
  const segmentValues = segment.slice(1) as number[];
  const normalValues = normalSegment.slice(1) as number[];
  const { x1: px1, y1: py1, x2: px2, y2: py2, x: px, y: py } = params;
  let result = segment;
  const [x, y] = normalValues.slice(-2);

  if (!'TQ'.includes(pathCommand)) {
    // optional but good to be cautious
    params.qx = null;
    params.qy = null;
  }

  if (['V', 'H', 'S', 'T', 'Z'].includes(pathCommand)) {
    result = [pathCommand, ...segmentValues] as VSegment | HSegment | SSegment | TSegment | ZSegment;
  } else if (pathCommand === 'L') {
    if (round4(px) === round4(x)) {
      result = ['V', y];
    } else if (round4(py) === round4(y)) {
      result = ['H', x];
    }
  } else if (pathCommand === 'C') {
    const [x1, y1] = normalValues;

    if (
      'CS'.includes(prevCommand) &&
      ((round4(x1) === round4(px1 * 2 - px2) && round4(y1) === round4(py1 * 2 - py2)) ||
        (round4(px1) === round4(px2 * 2 - px) && round4(py1) === round4(py2 * 2 - py)))
    ) {
      result = ['S', ...normalValues.slice(-4)] as SSegment;
    }
    params.x1 = x1;
    params.y1 = y1;
  } else if (pathCommand === 'Q') {
    const [qx, qy] = normalValues;
    params.qx = qx;
    params.qy = qy;

    if (
      'QT'.includes(prevCommand) &&
      ((round4(qx) === round4(px1 * 2 - px2) && round4(qy) === round4(py1 * 2 - py2)) ||
        (round4(px1) === round4(px2 * 2 - px) && round4(py1) === round4(py2 * 2 - py)))
    ) {
      result = ['T', ...normalValues.slice(-2)] as TSegment;
    }
  }

  return result as ShortSegment;
};
export default shortenSegment;
