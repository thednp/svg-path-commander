import distanceSquareRoot from './distanceSquareRoot.js';
// d3-polygon length

export default function polygonLength(ring) {
  // return ring.reduce((length, point, i) =>
  // (i ? length + distanceSquareRoot(ring[i - 1], point) : 0), 0);
  return ring.reduce((length, point, i) => {
    if (i) {
      return length + distanceSquareRoot(ring[i - 1], point);
    }
    return 0;
  }, 0);
}
