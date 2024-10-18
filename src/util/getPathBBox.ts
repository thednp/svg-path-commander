import iterate from '../process/iterate';
import { PathBBox } from '../interface';
import { LSegment, MSegment, PathArray, PointTuple } from '../types';
import { getLineBBox } from '../math/lineTools';
import { getArcBBox } from '../math/arcTools';
import { getCubicBBox } from '../math/cubicTools';
import { getQuadBBox } from '../math/quadTools';
import parsePathString from '../parser/parsePathString';
import absolutizeSegment from '../process/absolutizeSegment';

const getPathBBox = (pathInput: PathArray | string) => {
  if (!pathInput) {
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      x2: 0,
      y2: 0,
      cx: 0,
      cy: 0,
      cz: 0,
    };
  }

  const path = parsePathString(pathInput);
  let pathCommand = 'M';
  let mx = 0;
  let my = 0;
  const { max, min } = Math;
  let xMin = Infinity;
  let yMin = Infinity;
  let xMax = -Infinity;
  let yMax = -Infinity;
  let minX = 0;
  let minY = 0;
  let maxX = 0;
  let maxY = 0;
  let paramX1 = 0;
  let paramY1 = 0;
  let paramX2 = 0;
  let paramY2 = 0;
  let paramQX = 0;
  let paramQY = 0;

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
      [, mx, my] = normalSegment as MSegment;
      minX = mx;
      minY = my;
      maxX = mx;
      maxY = my;
    } else if (pathCommand === 'L') {
      [minX, minY, maxX, maxY] = getLineBBox(lastX, lastY, normalSegment[1] as number, normalSegment[2] as number);
    } else if (pathCommand === 'A') {
      [minX, minY, maxX, maxY] = getArcBBox(
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

      [minX, minY, maxX, maxY] = getCubicBBox(
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
      [minX, minY, maxX, maxY] = getCubicBBox(
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
      [minX, minY, maxX, maxY] = getQuadBBox(
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
      [minX, minY, maxX, maxY] = getQuadBBox(
        lastX,
        lastY,
        normalSegment[1] as number,
        normalSegment[2] as number,
        normalSegment[3] as number,
        normalSegment[4] as number,
      );
    } else if (pathCommand === 'Z') {
      [minX, minY, maxX, maxY] = getLineBBox(lastX, lastY, mx, my);
    }
    xMin = min(minX, xMin);
    yMin = min(minY, yMin);
    xMax = max(maxX, xMax);
    yMax = max(maxY, yMax);

    // update params
    [paramX1, paramY1] = pathCommand === 'Z' ? [mx, my] : (normalSegment.slice(-2) as PointTuple);
    [paramX2, paramY2] =
      pathCommand === 'C'
        ? ([normalSegment[3], normalSegment[4]] as PointTuple)
        : pathCommand === 'S'
        ? ([normalSegment[1], normalSegment[2]] as PointTuple)
        : [paramX1, paramY1];
  });

  const width = xMax - xMin;
  const height = yMax - yMin;

  return {
    width,
    height,
    x: xMin,
    y: yMin,
    x2: xMax,
    y2: yMax,
    cx: xMin + width / 2,
    cy: yMin + height / 2,
    // an estimated guess
    cz: Math.max(width, height) + Math.min(width, height) / 2,
  } satisfies PathBBox;
};

export default getPathBBox;
