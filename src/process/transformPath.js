import normalizePath from './normalizePath';
import clonePath from './clonePath';
import pathToAbsolute from '../convert/pathToAbsolute';
import segmentToCubic from './segmentToCubic';
import fixArc from './fixArc';
import getSVGMatrix from './getSVGMatrix';
import projection2d from './projection2d';
import paramsParser from '../parser/paramsParser';
import defaultOptions from '../options/options';

/**
 * Apply a 2D / 3D transformation to a `pathArray` instance.
 *
 * Since *SVGElement* doesn't support 3D transformation, this function
 * creates a 2D projection of the <path> element.
 *
 * @param {SVGPath.pathArray} path the `pathArray` to apply transformation
 * @param {SVGPath.transformObject} transform the transform functions `Object`
 * @returns {SVGPath.pathArray} the resulted `pathArray`
 */
export default function transformPath(path, transform) {
  let x = 0; let y = 0; let i; let j; let ii; let jj; let lx; let ly;
  const absolutePath = pathToAbsolute(path);
  const transformProps = transform && Object.keys(transform);

  // when used as a static method, invalidate somehow
  if (!transform || !transformProps.length) return clonePath(absolutePath);

  const normalizedPath = normalizePath(absolutePath);
  // transform origin is extremely important
  if (!transform.origin) {
    const { origin: defaultOrigin } = defaultOptions;
    Object.assign(transform, { origin: defaultOrigin });
  }
  const matrixInstance = getSVGMatrix(transform);
  const { origin } = transform;
  const params = { ...paramsParser };
  /** @type {SVGPath.pathSegment} */
  let segment = [];
  let seglen = 0;
  let pathCommand = '';
  /** @type {SVGPath.pathTransformList[]} */
  let transformedPath = [];
  const allPathCommands = []; // needed for arc to curve transformation

  if (!matrixInstance.isIdentity) {
    for (i = 0, ii = absolutePath.length; i < ii; i += 1) {
      segment = absolutePath[i];

      /* istanbul ignore else */
      if (absolutePath[i]) [pathCommand] = segment;

      // REPLACE Arc path commands with Cubic Beziers
      // we don't have any scripting know-how on 3d ellipse transformation
      // Arc segments don't work 3D transformations or skews
      /// ////////////////////////////////////////
      allPathCommands[i] = pathCommand;

      if (pathCommand === 'A') {
        segment = segmentToCubic(normalizedPath[i], params);

        absolutePath[i] = segmentToCubic(normalizedPath[i], params);
        fixArc(absolutePath, allPathCommands, i);

        normalizedPath[i] = segmentToCubic(normalizedPath[i], params);
        fixArc(normalizedPath, allPathCommands, i);
        ii = Math.max(absolutePath.length, normalizedPath.length);
      }

      /// ////////////////////////////////////////
      segment = normalizedPath[i];
      seglen = segment.length;

      params.x1 = +segment[seglen - 2];
      params.y1 = +segment[seglen - 1];
      params.x2 = +(segment[seglen - 4]) || params.x1;
      params.y2 = +(segment[seglen - 3]) || params.y1;

      /** @type {SVGPath.pathTransformList} */
      const result = {
        s: absolutePath[i], c: absolutePath[i][0], x: params.x1, y: params.y1,
      };

      transformedPath = [...transformedPath, ...[result]];
    }

    return transformedPath.map((seg) => {
      pathCommand = seg.c;
      segment = seg.s;
      switch (pathCommand) {
        case 'L':
        case 'H':
        case 'V':
          [lx, ly] = projection2d(matrixInstance, [seg.x, seg.y], origin);

          /* istanbul ignore else */
          if (x !== lx && y !== ly) {
            segment = ['L', lx, ly];
          } else if (y === ly) {
            segment = ['H', lx];
          } else if (x === lx) {
            segment = ['V', ly];
          }

          x = lx; y = ly; // now update x and y

          return segment;
        default:

          for (j = 1, jj = segment.length; j < jj; j += 2) {
            [x, y] = projection2d(matrixInstance, [+segment[j], +segment[j + 1]], origin);
            segment[j] = x;
            segment[j + 1] = y;
          }

          return segment;
      }
    });
  }
  return clonePath(absolutePath);
}
