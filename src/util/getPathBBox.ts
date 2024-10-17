import iterate from '../process/iterate';
import { PathBBox } from '../interface';
import { MSegment, PathArray, Point } from '../types';
import { getLineBBox } from '../math/lineTools';
import { getArcBBox } from '../math/arcTools';
import { getCubicBBox } from '../math/cubicTools';
import { getQuadBBox } from '../math/quadTools';
import parsePathString from '../parser/parsePathString';
import paramsParser from '../parser/paramsParser';
import normalizeSegment from '../process/normalizeSegment';

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
  let data = [] as number[];
  let pathCommand = 'M';
  const x = 0;
  const y = 0;
  let mx = 0;
  let my = 0;
  const MIN = [] as Point[];
  const MAX = [] as Point[];
  let min = { x, y };
  let max = { x, y };
  const params = { ...paramsParser };

  iterate(path, (seg, _, lastX, lastY) => {
    params.x = lastX;
    params.y = lastY;
    const result = normalizeSegment(seg, params);
    [pathCommand] = result;
    data = [lastX, lastY].concat(result.slice(1) as number[]);

    // this segment is always ZERO
    /* istanbul ignore else @preserve */
    if (pathCommand === 'M') {
      // remember mx, my for Z
      [, mx, my] = result as MSegment;
      min = { x: mx, y: my };
      max = { x: mx, y: my };
    } else if (pathCommand === 'L') {
      ({ min, max } = getLineBBox(data[0], data[1], data[2], data[3]));
    } else if (pathCommand === 'A') {
      ({ min, max } = getArcBBox(data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8]));
    } else if (pathCommand === 'C') {
      ({ min, max } = getCubicBBox(data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7]));
    } else if (pathCommand === 'Q') {
      ({ min, max } = getQuadBBox(data[0], data[1], data[2], data[3], data[4], data[5]));
    } else if (pathCommand === 'Z') {
      data = [lastX, lastY, mx, my];
      ({ min, max } = getLineBBox(data[0], data[1], data[2], data[3]));
    }

    MIN.push(min);
    MAX.push(max);

    const seglen = result.length;
    params.x1 = +result[seglen - 2];
    params.y1 = +result[seglen - 1];
    params.x2 = +result[seglen - 4] || params.x1;
    params.y2 = +result[seglen - 3] || params.y1;
  });

  const xMin = Math.min(...MIN.map(n => n.x));
  const xMax = Math.max(...MAX.map(n => n.x));
  const yMin = Math.min(...MIN.map(n => n.y));
  const yMax = Math.max(...MAX.map(n => n.y));
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
