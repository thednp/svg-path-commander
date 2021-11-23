import pathToCurve from '../convert/pathToCurve';

/**
 * Returns the area of a single segment shape.
 *
 * http://objectmix.com/graphics/133553-area-closed-bezier-curve.html
 *
 * @param {number} x0 the starting point X
 * @param {number} y0 the starting point Y
 * @param {number} x1 the first control point X
 * @param {number} y1 the first control point Y
 * @param {number} x2 the second control point X
 * @param {number} y2 the second control point Y
 * @param {number} x3 the ending point X
 * @param {number} y3 the ending point Y
 * @returns {number} the area of the cubic-bezier segment
 */
function getCubicSegArea(x0, y0, x1, y1, x2, y2, x3, y3) {
  return (3 * ((y3 - y0) * (x1 + x2) - (x3 - x0) * (y1 + y2)
           + (y1 * (x0 - x2)) - (x1 * (y0 - y2))
           + (y3 * (x2 + x0 / 3)) - (x3 * (y2 + y0 / 3)))) / 20;
}

/**
 * Returns the area of a shape.
 * @author Jürg Lehni & Jonathan Puckey
 *
 * => https://github.com/paperjs/paper.js/blob/develop/src/path/Path.js
 *
 * @param {SVGPC.pathArray} path the shape `pathArray`
 * @returns {SVGPC.pathBBox} the length of the cubic-bezier segment
 */
export default function getPathArea(path) {
  let x = 0; let y = 0;
  let mx = 0; let my = 0;
  let len = 0;
  return pathToCurve(path).map((seg) => {
    switch (seg[0]) {
      case 'M':
      case 'Z':
        mx = seg[0] === 'M' ? seg[1] : mx;
        my = seg[0] === 'M' ? seg[2] : my;
        x = mx;
        y = my;
        return 0;
      default:
        len = getCubicSegArea.apply(0, [x, y].concat(seg.slice(1)));
        [x, y] = seg.slice(-2);
        return len;
    }
  }).reduce((a, b) => a + b, 0);
}
