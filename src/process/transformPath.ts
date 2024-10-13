import getSVGMatrix from './getSVGMatrix';
import projection2d from './projection2d';
import defaultOptions from '../options/options';
import type { AbsoluteArray, CSegment, PathArray, PointTuple, TransformObjectValues } from '../types';
import type { TransformObject } from '../interface';
import iterate from './iterate';
import parsePathString from '../parser/parsePathString';
import absolutizeSegment from './absolutizeSegment';
import segmentToCubic from './segmentToCubic';
import normalizeSegment from './normalizeSegment';
import paramsParser from '../parser/paramsParser';

/**
 * Apply a 2D / 3D transformation to a `pathArray` instance.
 *
 * Since *SVGElement* doesn't support 3D transformation, this function
 * creates a 2D projection of the <path> element.
 *
 * @param path the `pathArray` to apply transformation
 * @param transform the transform functions `Object`
 * @returns the resulted `pathArray`
 */
const transformPath = (pathInput: PathArray | string, transform?: Partial<TransformObject>) => {
  let x = 0;
  let y = 0;
  let mx = 0;
  let my = 0;
  let lx = 0;
  let ly = 0;
  let j = 0;
  let jj = 0;
  let nx = 0;
  let ny = 0;
  let pathCommand = 'M';
  // transform uses it's own set of params
  const transformParams = { ...paramsParser };
  const path = parsePathString(pathInput);
  const transformProps = transform && Object.keys(transform);

  // when used as a static method, invalidate somehow
  if (!transform || (transformProps && !transformProps.length)) return path;

  // transform origin is extremely important
  if (!transform.origin) {
    Object.assign(transform, { origin: defaultOptions.origin });
  }
  const origin = transform.origin as [number, number, number];
  const matrixInstance = getSVGMatrix(transform as TransformObjectValues);

  if (matrixInstance.isIdentity) return path;

  return iterate<AbsoluteArray>(path, (seg, _, i) => {
    const absSegment = absolutizeSegment(seg, transformParams);
    [pathCommand] = absSegment;

    let result =
      pathCommand === 'A'
        ? segmentToCubic(absSegment, transformParams)
        : ['V', 'H'].includes(pathCommand)
        ? normalizeSegment(absSegment, transformParams)
        : absSegment;
    const isLongArc = result[0] === 'C' && result.length > 7;
    const normalizedSegment = (isLongArc ? result.slice(0, 7) : result.slice(0)) as typeof result;

    if (isLongArc) {
      path.splice(i + 1, 0, ['C', ...result.slice(7)] as CSegment);
      result = result.slice(0, 7) as CSegment;
    }

    if (result[0] === 'L') {
      const values = result.slice(-2) as PointTuple;
      [lx, ly] = projection2d(matrixInstance, values, origin);

      /* istanbul ignore else @preserve */
      if (x !== lx && y !== ly) {
        result = ['L', lx, ly];
      } else if (y === ly) {
        result = ['H', lx];
      } else if (x === lx) {
        result = ['V', ly];
      }
    } else {
      for (j = 1, jj = result.length; j < jj; j += 2) {
        [lx, ly] = projection2d(matrixInstance, [+result[j], +result[j + 1]], origin);
        result[j] = lx;
        result[j + 1] = ly;
      }
    }
    // now update x and y
    x = lx;
    y = ly;

    if (pathCommand === 'Z') {
      nx = mx;
      ny = my;
    } else {
      [nx, ny] = normalizedSegment.slice(-2) as PointTuple;
      if (pathCommand === 'M') {
        mx = nx;
        my = ny;
      }
    }

    const seglen = normalizedSegment.length;
    transformParams.x1 = +normalizedSegment[seglen - 2];
    transformParams.y1 = +normalizedSegment[seglen - 1];
    transformParams.x2 = +normalizedSegment[seglen - 4] || transformParams.x1;
    transformParams.y2 = +normalizedSegment[seglen - 3] || transformParams.y1;
    transformParams.x = nx;
    transformParams.y = ny;
    return result;
  });
};

export default transformPath;
