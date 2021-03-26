// t = [0-1]
export default function getPointAtSegLength(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
  const t1 = 1 - t;
  return {
    x: (t1 ** 3) * p1x
      + t1 * t1 * 3 * t * c1x
      + t1 * 3 * t * t * c2x
      + (t ** 3) * p2x,
    y: (t1 ** 3) * p1y
      + t1 * t1 * 3 * t * c1y
      + t1 * 3 * t * t * c2y
      + (t ** 3) * p2y,
  };
}
