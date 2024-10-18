import type { LSegment, MSegment, PathArray, PointTuple } from '../types';
import { getLineLength } from '../math/lineTools';
import { getArcLength } from '../math/arcTools';
import { getCubicLength } from '../math/cubicTools';
import { getQuadLength } from '../math/quadTools';
import iterate from '../process/iterate';
import parsePathString from '../parser/parsePathString';
import absolutizeSegment from '../process/absolutizeSegment';

/**
 * Returns the shape total length, or the equivalent to `shape.getTotalLength()`.
 *
 *
 * @param pathInput the target `pathArray`
 * @returns the shape total length
 */
const getTotalLength = (pathInput: string | PathArray) => {
  const path = parsePathString(pathInput);
  let paramX1 = 0;
  let paramY1 = 0;
  let paramX2 = 0;
  let paramY2 = 0;
  let paramQX = 0;
  let paramQY = 0;
  let pathCommand = 'M';
  let mx = 0;
  let my = 0;
  let totalLength = 0;

  iterate(path, (seg, index, lastX, lastY) => {
    [pathCommand] = seg;
    const absCommand = pathCommand.toUpperCase();
    const isRelative = absCommand !== pathCommand;
    const absoluteSegment = isRelative ? absolutizeSegment(seg, index, lastX, lastY) : (seg.slice(0) as typeof seg);

    const normalSegment =
      absCommand === 'V'
        ? (['L', lastX, absoluteSegment[1]] as LSegment)
        : absCommand === 'H'
        ? (['L', absoluteSegment[1], lastY] as LSegment)
        : absoluteSegment;
    [pathCommand] = normalSegment;

    if (!'TQ'.includes(absCommand)) {
      // optional but good to be cautious
      paramQX = 0;
      paramQY = 0;
    }

    // this segment is always ZERO
    /* istanbul ignore else @preserve */
    if (pathCommand === 'M') {
      // remember mx, my for Z
      [, mx, my] = normalSegment as MSegment;
    } else if (pathCommand === 'L') {
      totalLength += getLineLength(lastX, lastY, normalSegment[1] as number, normalSegment[2] as number);
    } else if (pathCommand === 'A') {
      totalLength += getArcLength(
        lastX,
        lastY,
        normalSegment[1] as number,
        normalSegment[2] as number,
        normalSegment[3] as number,
        normalSegment[4] as number,
        normalSegment[5] as number,
        normalSegment[6] as number,
        normalSegment[7] as number,
      );
    } else if (pathCommand === 'S') {
      const cp1x = paramX1 * 2 - paramX2;
      const cp1y = paramY1 * 2 - paramY2;

      totalLength += getCubicLength(
        lastX,
        lastY,
        cp1x,
        cp1y,
        normalSegment[1] as number,
        normalSegment[2] as number,
        normalSegment[3] as number,
        normalSegment[4] as number,
      );
    } else if (pathCommand === 'C') {
      totalLength += getCubicLength(
        lastX,
        lastY,
        normalSegment[1] as number,
        normalSegment[2] as number,
        normalSegment[3] as number,
        normalSegment[4] as number,
        normalSegment[5] as number,
        normalSegment[6] as number,
      );
    } else if (pathCommand === 'T') {
      paramQX = paramX1 * 2 - paramQX;
      paramQY = paramY1 * 2 - paramQY;
      totalLength += getQuadLength(
        lastX,
        lastY,
        paramQX,
        paramQY,
        normalSegment[1] as number,
        normalSegment[2] as number,
      );
    } else if (pathCommand === 'Q') {
      paramQX = normalSegment[1] as number;
      paramQY = normalSegment[2] as number;
      totalLength += getQuadLength(
        lastX,
        lastY,
        normalSegment[1] as number,
        normalSegment[2] as number,
        normalSegment[3] as number,
        normalSegment[4] as number,
      );
    } else if (pathCommand === 'Z') {
      totalLength += getLineLength(lastX, lastY, mx, my);
    }

    // update params
    [paramX1, paramY1] = pathCommand === 'Z' ? [mx, my] : (normalSegment.slice(-2) as PointTuple);
    [paramX2, paramY2] =
      pathCommand === 'C'
        ? ([normalSegment[3], normalSegment[4]] as PointTuple)
        : pathCommand === 'S'
        ? ([normalSegment[1], normalSegment[2]] as PointTuple)
        : [paramX1, paramY1];
  });

  return totalLength;
};

export default getTotalLength;
