function base3(p1, p2, p3, p4, t) {
  const t1 = -3 * p1 + 9 * p2 - 9 * p3 + 3 * p4;
  const t2 = t * t1 + 6 * p1 - 12 * p2 + 6 * p3;
  return t * t2 - 3 * p1 + 3 * p2;
}

// returns the cubic bezier segment length
export default function getSegCubicLength(x1, y1, x2, y2, x3, y3, x4, y4, z) {
  let Z;
  if (z === null || Number.isNaN(+z)) Z = 1;

  // Z = Z > 1 ? 1 : Z < 0 ? 0 : Z;
  if (Z > 1) Z = 1;
  if (Z < 0) Z = 0;

  const z2 = Z / 2; let ct = 0; let xbase = 0; let ybase = 0; let sum = 0;
  const Tvalues = [-0.1252, 0.1252, -0.3678, 0.3678,
    -0.5873, 0.5873, -0.7699, 0.7699,
    -0.9041, 0.9041, -0.9816, 0.9816];
  const Cvalues = [0.2491, 0.2491, 0.2335, 0.2335,
    0.2032, 0.2032, 0.1601, 0.1601,
    0.1069, 0.1069, 0.0472, 0.0472];

  Tvalues.forEach((T, i) => {
    ct = z2 * T + z2;
    xbase = base3(x1, x2, x3, x4, ct);
    ybase = base3(y1, y2, y3, y4, ct);
    sum += Cvalues[i] * Math.sqrt(xbase * xbase + ybase * ybase);
  });
  return z2 * sum;
}
