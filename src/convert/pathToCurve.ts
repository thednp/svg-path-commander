import segmentToCubic from '../process/segmentToCubic';
import { AbsoluteCommand, CSegment, CurveArray, PathArray, PointTuple } from '../types';
import iterate from '../process/iterate';
import parsePathString from '../parser/parsePathString';
import normalizeSegment from '../process/normalizeSegment';
import absolutizeSegment from '../process/absolutizeSegment';

/**
 * Parses a path string value or 'pathArray' and returns a new one
 * in which all segments are converted to cubic-bezier.
 *
 * In addition, un-necessary `Z` segment is removed if previous segment
 * extends to the `M` segment.
 *
 * @param pathInput the string to be parsed or 'pathArray'
 * @returns the resulted `pathArray` converted to cubic-bezier
 */
const pathToCurve = (pathInput: string | PathArray): CurveArray => {
  let x = 0;
  let y = 0;
  let mx = 0;
  let my = 0;
  let pathCommand = 'M';

  const path = parsePathString(pathInput);
  return iterate<CurveArray>(path, (seg, params, i) => {
    const absSegment = absolutizeSegment(seg, params);
    [pathCommand] = absSegment;

    const absCommand = pathCommand.toUpperCase() as AbsoluteCommand;
    const normalSegment = normalizeSegment(absSegment, params);
    let result = segmentToCubic(normalSegment, params);
    const isLongArc = result[0] === 'C' && result.length > 7;

    if (isLongArc) {
      path.splice(i + 1, 0, ['C', ...result.slice(7)] as CSegment);
      result = result.slice(0, 7) as CSegment;
    }

    if (absCommand === 'Z') {
      x = mx;
      y = my;
    } else {
      [x, y] = result.slice(-2) as PointTuple;

      if (absCommand === 'M') {
        mx = x;
        my = y;
      }
    }

    params.x = x;
    params.y = y;
    return result;
  });
};
export default pathToCurve;
