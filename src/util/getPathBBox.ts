import iterate from '../process/iterate';
import { PathBBox } from '../interface';
import {
  ArcCoordinates,
  CubicCoordinates,
  LineCoordinates,
  MSegment,
  PathArray,
  Point,
  PointTuple,
  QuadCoordinates,
} from '../types';
// import pathFactory from './pathFactory';
import absolutizeSegment from '../process/absolutizeSegment';
import normalizeSegment from '../process/normalizeSegment';
import parsePathString from '../parser/parsePathString';
import { getLineBBox } from '../math/lineTools';
import { getArcBBox } from '../math/arcTools';
import { getCubicBBox } from '../math/cubicTools';
import { getQuadBBox } from '../math/quadTools';

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
  let x = 0;
  let y = 0;
  let mx = 0;
  let my = 0;
  const MIN = [] as Point[];
  const MAX = [] as Point[];
  let min = { x, y };
  let max = { x, y };

  iterate(path, (seg, params) => {
    const absoluteSegment = absolutizeSegment(seg, params);
    const normalSegment = normalizeSegment(absoluteSegment, params);
    [pathCommand] = normalSegment;
    data = [x, y, ...normalSegment.slice(1)] as number[];

    // this segment is always ZERO
    /* istanbul ignore else @preserve */
    if (pathCommand === 'M') {
      // remember mx, my for Z
      [, mx, my] = normalSegment as MSegment;
      min = { x: mx, y: my };
      max = { x: mx, y: my };
    } else if (pathCommand === 'L') {
      ({ min, max } = getLineBBox(...(data as LineCoordinates)));
    } else if (pathCommand === 'A') {
      ({ min, max } = getArcBBox(...(data as ArcCoordinates)));
    } else if (pathCommand === 'C') {
      ({ min, max } = getCubicBBox(...(data as CubicCoordinates)));
    } else if (pathCommand === 'Q') {
      ({ min, max } = getQuadBBox(...(data as QuadCoordinates)));
    } else if (pathCommand === 'Z') {
      data = [x, y, mx, my];
      ({ min, max } = getLineBBox(...(data as LineCoordinates)));
    }

    MIN.push(min);
    MAX.push(max);

    if (pathCommand === 'Z') {
      x = mx;
      y = my;
    } else {
      [x, y] = normalSegment.slice(-2) as PointTuple;

      if (pathCommand === 'M') {
        mx = x;
        my = y;
      }
    }
    params.x = x;
    params.y = y;
    return normalSegment;
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
