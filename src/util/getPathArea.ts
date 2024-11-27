import pathToCurve from "../convert/pathToCurve";
import type { PathArray, PointTuple } from "../types";

/**
 * Returns the area of a single cubic-bezier segment.
 *
 * http://objectmix.com/graphics/133553-area-closed-bezier-curve.html
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param c1x the first control point X
 * @param c1y the first control point Y
 * @param c2x the second control point X
 * @param c2y the second control point Y
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @returns the area of the cubic-bezier segment
 */
const getCubicSegArea = (
  x1: number,
  y1: number,
  c1x: number,
  c1y: number,
  c2x: number,
  c2y: number,
  x2: number,
  y2: number,
) => {
  return (
    (3 *
      ((y2 - y1) * (c1x + c2x) -
        (x2 - x1) * (c1y + c2y) +
        c1y * (x1 - c2x) -
        c1x * (y1 - c2y) +
        y2 * (c2x + x1 / 3) -
        x2 * (c2y + y1 / 3))) /
    20
  );
};

/**
 * Returns the area of a shape.
 *
 * @author Jürg Lehni & Jonathan Puckey
 *
 * @see https://github.com/paperjs/paper.js/blob/develop/src/path/Path.js
 *
 * @param path the shape `pathArray`
 * @returns the length of the cubic-bezier segment
 */
const getPathArea = (path: PathArray) => {
  let x = 0;
  let y = 0;
  let len = 0;

  return pathToCurve(path)
    .map((seg) => {
      switch (seg[0]) {
        case "M":
          [, x, y] = seg;
          return 0;
        default:
          len = getCubicSegArea(
            x,
            y,
            seg[1],
            seg[2],
            seg[3],
            seg[4],
            seg[5],
            seg[6],
          );
          [x, y] = seg.slice(-2) as PointTuple;
          return len;
      }
    })
    .reduce((a, b) => a + b, 0);
};
export default getPathArea;
