import epsilon from '../math/epsilon.js';
import normalizePath from './normalizePath.js';
import roundPath from './roundPath.js';
import clonePath from './clonePath.js';
import pathToAbsolute from '../convert/pathToAbsolute.js';
import segmentToCubic from './segmentToCubic.js';
import fixArc from '../util/fixArc.js';
import getSVGMatrix from '../util/getSVGMatrix.js';
import transformEllipse from '../util/transformEllipse.js';
import projection2d from '../util/projection2d.js';

export default function transformPath(pathArray, transformObject, round) {
  let x; let y; let i; let j; let ii; let jj; let lx; let ly; let te;
  const absolutePath = pathToAbsolute(pathArray);
  const normalizedPath = normalizePath(absolutePath);
  const matrixInstance = getSVGMatrix(transformObject);
  const transformProps = Object.keys(transformObject);
  const { origin } = transformObject;
  const {
    a, b, c, d, e, f,
  } = matrixInstance;
  const matrix2d = [a, b, c, d, e, f];
  const params = {
    x1: 0, y1: 0, x2: 0, y2: 0, x: 0, y: 0,
  };
  let segment = [];
  let seglen = 0;
  let pathCommand = '';
  let transformedPath = [];
  const allPathCommands = []; // needed for arc to curve transformation
  let result = [];

  if (!matrixInstance.isIdentity) {
    for (i = 0, ii = absolutePath.length; i < ii; i += 1) {
      segment = absolutePath[i];

      if (absolutePath[i]) [pathCommand] = segment;

      // REPLACE Arc path commands with Cubic Beziers
      // we don't have any scripting know-how on 3d ellipse transformation
      /// ////////////////////////////////////////
      allPathCommands[i] = pathCommand;

      // Arcs don't work very well with 3D transformations or skews
      if (pathCommand === 'A' && (!matrixInstance.is2D || !['skewX', 'skewY'].find((p) => transformProps.includes(p)))) {
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

      result = { s: absolutePath[i], c: absolutePath[i][0] };

      if (pathCommand !== 'Z') {
        result.x = params.x1;
        result.y = params.y1;
      }
      transformedPath = transformedPath.concat(result);
    }

    transformedPath = transformedPath.map((seg) => {
      pathCommand = seg.c;
      segment = seg.s;
      switch (pathCommand) {
        case 'A': // only apply to 2D transformations
          te = transformEllipse(matrix2d, segment[1], segment[2], segment[3]);

          if (matrix2d[0] * matrix2d[3] - matrix2d[1] * matrix2d[2] < 0) {
            segment[5] = +segment[5] ? 0 : 1;
          }

          [lx, ly] = projection2d(matrixInstance, [segment[6], segment[7]], origin);

          if ((x === lx && y === ly) || (te.rx < epsilon * te.ry) || (te.ry < epsilon * te.rx)) {
            segment = ['L', lx, ly];
          } else {
            segment = [pathCommand, te.rx, te.ry, te.ax, segment[4], segment[5], lx, ly];
          }

          x = lx; y = ly;
          return segment;

        case 'L':
        case 'H':
        case 'V':

          [lx, ly] = projection2d(matrixInstance, [seg.x, seg.y], origin);

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
            // compute line coordinates without altering previous coordinates
            [x, y] = projection2d(matrixInstance, [segment[j], segment[j + 1]], origin);
            segment[j] = x;
            segment[j + 1] = y;
          }
          return segment;
      }
    });
    return roundPath(transformedPath, round);
  }
  return clonePath(absolutePath);
}
