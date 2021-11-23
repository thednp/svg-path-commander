import getCubicSize from './getCubicSize';
import pathToCurve from '../convert/pathToCurve';

/**
 * Returns the bounding box of a shape.
 *
 * @param {SVGPC.pathArray} path the shape `pathArray`
 * @returns {SVGPC.pathBBox} the length of the cubic-bezier segment
 */
export default function getPathBBox(path) {
  if (!path) {
    return {
      x: 0, y: 0, width: 0, height: 0, x2: 0, y2: 0,
    };
  }
  const pathCurve = pathToCurve(path);

  let x = 0;
  let y = 0;
  let X = [];
  let Y = [];

  pathCurve.forEach((segment) => {
    const [s1, s2] = segment.slice(-2);
    if (segment[0] === 'M') {
      x = s1;
      y = s2;
      X.push(s1);
      Y.push(s2);
    } else {
      const dim = getCubicSize.apply(0, [x, y].concat(segment.slice(1)));
      X = X.concat(dim.min.x, dim.max.x);
      Y = Y.concat(dim.min.y, dim.max.y);
      x = s1;
      y = s2;
    }
  });

  const xTop = Math.min.apply(0, X);
  const yTop = Math.min.apply(0, Y);
  const xBot = Math.max.apply(0, X);
  const yBot = Math.max.apply(0, Y);
  const width = xBot - xTop;
  const height = yBot - yTop;

  return {
    width,
    height,
    x: xTop,
    y: yTop,
    x2: xBot,
    y2: yBot,
    cx: xTop + width / 2,
    cy: yTop + height / 2,
  };
}
