import midPoint from '../math/midPoint';

/**
 * Converts an L (line-to) segment to C (cubic-bezier).
 *
 * @param x1 line start x
 * @param y1 line start y
 * @param x2 line end x
 * @param y2 line end y
 * @returns the cubic-bezier segment
 */
const lineToCubic = (x1: number, y1: number, x2: number, y2: number) => {
  const c1 = midPoint([x1, y1], [x2, y2], 1.0 / 3.0);
  const c2 = midPoint([x1, y1], [x2, y2], 2.0 / 3.0);
  return [...c1, ...c2, x2, y2];
};
export default lineToCubic;
