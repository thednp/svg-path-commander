export default function (p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) { // t = [0-1]
  let t1 = 1 - t
  return {
      x: Math.pow(t1, 3) * p1x + Math.pow(t1, 2) * 3 * t * c1x + t1 * 3 * t * t * c2x + Math.pow(t, 3) * p2x,
      y: Math.pow(t1, 3) * p1y + Math.pow(t1, 2) * 3 * t * c1y + t1 * 3 * t * t * c2y + Math.pow(t, 3) * p2y
  };
}