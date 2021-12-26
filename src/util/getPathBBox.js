import getCubicSize from './getCubicSize';
import pathToCurve from '../convert/pathToCurve';

/**
 * Returns the bounding box of a shape.
 *
 * @param {SVGPathCommander.pathArray} path the shape `pathArray`
 * @returns {SVGPathCommander.pathBBox} the length of the cubic-bezier segment
 */
export default function getPathBBox(path) {
  if (!path) {
    return {
      x: 0, y: 0, width: 0, height: 0, x2: 0, y2: 0, cx: 0, cy: 0, cz: 0,
    };
  }
  const pathCurve = pathToCurve(path);

  let x = 0; let y = 0;
  /** @type {number[]} */
  let X = [];
  /** @type {number[]} */
  let Y = [];

  pathCurve.forEach((segment) => {
    const [s1, s2] = segment.slice(-2).map(Number);
    if (segment[0] === 'M') {
      x = s1;
      y = s2;
      X.push(s1);
      Y.push(s2);
    } else {
      const sizeArgs = [x, y, ...segment.slice(1)];
      // @ts-ignore -- this should be fine
      const dim = getCubicSize(...sizeArgs);

      X = [...X, ...[dim.min.x, dim.max.x]];
      Y = [...Y, ...[dim.min.y, dim.max.y]];
      x = s1;
      y = s2;
    }
  });

  const xTop = Math.min(...X);
  const yTop = Math.min(...Y);
  const xBot = Math.max(...X);
  const yBot = Math.max(...Y);
  const width = xBot - xTop;
  const height = yBot - yTop;

  // an estimted guess
  const cz = Math.max(width, height) + Math.min(width, height) / 2;
  return {
    width,
    height,
    x: xTop,
    y: yTop,
    x2: xBot,
    y2: yBot,
    cx: xTop + width / 2,
    cy: yTop + height / 2,
    cz,
  };
}
