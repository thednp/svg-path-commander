import pathToCurve from '../convert/pathToCurve';

/**
 * Returns the area of a single cubic-bezier segment.
 *
 * http://objectmix.com/graphics/133553-area-closed-bezier-curve.html
 *
 * @param {number} x1 the starting point X
 * @param {number} y1 the starting point Y
 * @param {number} c1x the first control point X
 * @param {number} c1y the first control point Y
 * @param {number} c2x the second control point X
 * @param {number} c2y the second control point Y
 * @param {number} x2 the ending point X
 * @param {number} y2 the ending point Y
 * @returns {number} the area of the cubic-bezier segment
 */
function getCubicSegArea(x1, y1, c1x, c1y, c2x, c2y, x2, y2) {
  return (3 * ((y2 - y1) * (c1x + c2x) - (x2 - x1) * (c1y + c2y)
           + (c1y * (x1 - c2x)) - (c1x * (y1 - c2y))
           + (y2 * (c2x + x1 / 3)) - (x2 * (c2y + y1 / 3)))) / 20;
}

/**
 * Returns the area of a shape.
 * @author Jürg Lehni & Jonathan Puckey
 *
 * @see https://github.com/paperjs/paper.js/blob/develop/src/path/Path.js
 *
 * @param {SVGPathCommander.pathArray} path the shape `pathArray`
 * @returns {number} the length of the cubic-bezier segment
 */
export default function getPathArea(path) {
  let x = 0; let y = 0; let len = 0;

  return pathToCurve(path).map((seg) => {
    switch (seg[0]) {
      case 'M':
        [, x, y] = seg;
        return 0;
      default:
        // @ts-ignore -- the utility will have proper amount of params
        len = getCubicSegArea(x, y, ...seg.slice(1));
        // @ts-ignore -- the segment always has numbers
        [x, y] = seg.slice(-2);
        return len;
    }
  }).reduce((a, b) => a + b, 0);
}
