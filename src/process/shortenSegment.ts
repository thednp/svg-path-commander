import defaultOptions from '../options/options';
import type { ParserParams } from '../interface';
import roundTo from '../math/roundTo';
import type { AbsoluteSegment, NormalSegment, PathCommand, ShortSegment, SSegment, TSegment } from '../types';

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
  const { round: defaultRound } = defaultOptions;
  const round = typeof defaultRound === 'number' ? defaultRound : /* istanbul ignore next */ 4;
  const normalValues = normalSegment.slice(1) as number[];
  const { x1, y1, x2, y2, x, y } = params;
  const [nx, ny] = normalValues.slice(-2);
  const result = segment;

  if (!'TQ'.includes(pathCommand)) {
    // optional but good to be cautious
    params.qx = null;
    params.qy = null;
  }

  if (pathCommand === 'L') {
    if (roundTo(x, round) === roundTo(nx, round)) {
      return ['V', ny];
    } else if (roundTo(y, round) === roundTo(ny, round)) {
      return ['H', nx];
    }
  } else if (pathCommand === 'C') {
    const [nx1, ny1] = normalValues;
    params.x1 = nx1;
    params.y1 = ny1;

    if (
      'CS'.includes(prevCommand) &&
      ((roundTo(nx1, round) === roundTo(x1 * 2 - x2, round) && roundTo(ny1, round) === roundTo(y1 * 2 - y2, round)) ||
        (roundTo(x1, round) === roundTo(x2 * 2 - x, round) && roundTo(y1, round) === roundTo(y2 * 2 - y, round)))
    ) {
      return ['S', normalValues[2], normalValues[3], normalValues[4], normalValues[5]] as SSegment;
    }
  } else if (pathCommand === 'Q') {
    const [qx, qy] = normalValues;
    params.qx = qx;
    params.qy = qy;

    if (
      'QT'.includes(prevCommand) &&
      roundTo(qx, round) === roundTo(x1 * 2 - x2, round) &&
      roundTo(qy, round) === roundTo(y1 * 2 - y2, round)
    ) {
      return ['T', normalValues[2], normalValues[3]] as TSegment;
    }
  }

  // ['V', 'H', 'S', 'T', 'Z'].includes(pathCommand)
  return result as ShortSegment;
};

export default shortenSegment;
