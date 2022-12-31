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
  const t = 0.5;
  const mid = midPoint([x1, y1], [x2, y2], t);
  return [...mid, x2, y2, x2, y2];
};
export default lineToCubic;
