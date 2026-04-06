// src/morph/splitLineToCount.ts

/**
 * Split a line segment into `count` smaller segments of equal length
 * using the same repeated front-cutting strategy as splitCubicToCount.
 *
 * Does NOT mutate input.
 *
 * @param x1 - Start point X
 * @param y1 - Start point Y
 * @param x2 - End point X
 * @param y2 - End point Y
 * @param count - Number of segments to split into
 * @returns Array of `count` line segments, each as [x1, y1, x2, y2]
 */
export default function splitLineToCount(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  count: number,
): Array<[number, number, number, number]> {
  if (count <= 1) return [[x1, y1, x2, y2]];

  const result: Array<[number, number, number, number]> = [];
  const dx = x2 - x1;
  const dy = y2 - y1;

  let currentX = x1;
  let currentY = y1;

  // Loop count times to produce count segments
  // We generate points at 1/count, 2/count, ..., count/count
  let i = 0;
  while (i < count) {
    const t = 1 / (count - i);
    const nextX = x1 + t * dx;
    const nextY = y1 + t * dy;

    result.push([currentX, currentY, nextX, nextY]);

    currentX = nextX;
    currentY = nextY;
    i++;
  }

  return result;
}
