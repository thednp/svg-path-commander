// d3-polygon area

export default function polygonArea(polygon) {
  let i = -1;
  const n = polygon.length;
  let a;
  let b = polygon[n - 1];
  let area = 0;

  while (i < n) {
    i += 1;
    a = b;
    b = polygon[i];
    area += a[1] * b[0] - a[0] * b[1];
  }

  return area / 2;
}
