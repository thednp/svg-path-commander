import normalizePath from './normalizePath';
// import pathToAbsolute from '../convert/pathToAbsolute';
// import segmentToCubic from './segmentToCubic';
// import fixArc from './fixArc';
import getSVGMatrix from './getSVGMatrix';
import projection2d from './projection2d';
import paramsParser from '../parser/paramsParser';
import replaceArc from './replaceArc';
import defaultOptions from '../options/options';
import type { AbsoluteArray, PathArray, TransformObjectValues } from '../types';
import type { PathTransform, TransformObject } from '../interface';

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
const transformPath = (path: string | PathArray, transform?: Partial<TransformObject>): PathArray => {
  let x = 0;
  let y = 0;
  let i;
  let j;
  let ii;
  let jj;
  let lx;
  let ly;
  // REPLACE Arc path commands with Cubic Beziers
  // we don't have any scripting know-how on 3d ellipse transformation
  // Arc segments don't work with 3D transformations or skews
  const absolutePath = replaceArc(path);
  const transformProps = transform && Object.keys(transform);

  // when used as a static method, invalidate somehow
  if (!transform || (transformProps && !transformProps.length)) return absolutePath.slice(0) as PathArray;

  const normalizedPath = normalizePath(absolutePath);
  // transform origin is extremely important
  if (!transform.origin) {
    const { origin: defaultOrigin } = defaultOptions;
    Object.assign(transform, { origin: defaultOrigin });
  }
  const matrixInstance = getSVGMatrix(transform as TransformObjectValues);
  const { origin } = transform;
  const params = { ...paramsParser };
  let segment = [];
  let seglen = 0;
  let pathCommand = '';
  const transformedPath = [] as PathTransform[];

  if (!matrixInstance.isIdentity) {
    for (i = 0, ii = absolutePath.length; i < ii; i += 1) {
      segment = normalizedPath[i];
      seglen = segment.length;

      params.x1 = +segment[seglen - 2];
      params.y1 = +segment[seglen - 1];
      params.x2 = +segment[seglen - 4] || params.x1;
      params.y2 = +segment[seglen - 3] || params.y1;

      const result = {
        s: absolutePath[i],
        c: absolutePath[i][0],
        x: params.x1,
        y: params.y1,
      };

      transformedPath.push(result);
    }

    return transformedPath.map(seg => {
      pathCommand = seg.c;
      segment = seg.s;
      if (pathCommand === 'L' || pathCommand === 'H' || pathCommand === 'V') {
        [lx, ly] = projection2d(matrixInstance, [seg.x, seg.y], origin as [number, number, number]);

        /* istanbul ignore else @preserve */
        if (x !== lx && y !== ly) {
          segment = ['L', lx, ly];
        } else if (y === ly) {
          segment = ['H', lx];
        } else if (x === lx) {
          segment = ['V', ly];
        }

        // now update x and y
        x = lx;
        y = ly;

        return segment;
      } else {
        for (j = 1, jj = segment.length; j < jj; j += 2) {
          [x, y] = projection2d(matrixInstance, [+segment[j], +segment[j + 1]], origin as [number, number, number]);
          segment[j] = x;
          segment[j + 1] = y;
        }

        return segment;
      }
    }) as PathArray;
  }
  return absolutePath.slice(0) as AbsoluteArray;
};
export default transformPath;
