import rotateVector from '../util/rotateVector.js';

// for more information of where this math came from visit:
// http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
// LAF = largeArcFlag, SF = sweepFlag

export default function arcToCubic(x1, y1, rx, ry, angle, LAF, SF, x2, y2, recursive) {
  const d120 = (Math.PI * 120) / 180;
  const rad = (Math.PI / 180) * (angle || 0);
  let res = [];
  let X1 = x1;
  let X2 = x2;
  let Y1 = y1;
  let Y2 = y2;
  let RX = rx;
  let RY = ry;
  let xy;
  let f1;
  let f2;
  let cx;
  let cy;

  if (!recursive) {
    xy = rotateVector(X1, Y1, -rad);
    X1 = xy.x;
    Y1 = xy.y;
    xy = rotateVector(X2, Y2, -rad);
    X2 = xy.x;
    Y2 = xy.y;

    const x = (X1 - X2) / 2;
    const y = (Y1 - Y2) / 2;
    let h = (x * x) / (RX * RY) + (y ** 2) / (RY ** 2);
    if (h > 1) {
      h = Math.sqrt(h);
      RX *= h;
      RY *= h;
    }
    const rx2 = RX ** 2;
    const ry2 = RY ** 2;
    const k = (LAF === SF ? -1 : 1)
          * Math.sqrt(Math.abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x)
          / (rx2 * y * y + ry2 * x * x)));

    cx = ((k * RX * y) / RY) + ((X1 + X2) / 2);
    cy = ((k * -RY * x) / RX) + ((Y1 + Y2) / 2);

    // f1 = Math.asin(((Y1 - cy) / RY).toFixed(9)); // keep toFIxed(9)!
    // f2 = Math.asin(((Y2 - cy) / RY).toFixed(9));
    f1 = Math.asin((((Y1 - cy) / RY) * 10 ** 9 >> 0) / (10 ** 9));
    f2 = Math.asin((((Y2 - cy) / RY) * 10 ** 9 >> 0) / (10 ** 9));

    f1 = X1 < cx ? Math.PI - f1 : f1;
    f2 = X2 < cx ? Math.PI - f2 : f2;

    if (f1 < 0) f1 = Math.PI * 2 + f1;
    if (f2 < 0) f2 = Math.PI * 2 + f2;

    if (SF && f1 > f2) {
      f1 -= Math.PI * 2;
    }
    if (!SF && f2 > f1) {
      f2 -= Math.PI * 2;
    }
  } else {
    const [r1, r2, r3, r4] = recursive;
    f1 = r1;
    f2 = r2;
    cx = r3;
    cy = r4;
  }

  let df = f2 - f1;

  if (Math.abs(df) > d120) {
    const f2old = f2; const x2old = X2; const
      y2old = Y2;

    f2 = f1 + d120 * (SF && f2 > f1 ? 1 : -1);
    X2 = cx + RX * Math.cos(f2);
    Y2 = cy + RY * Math.sin(f2);
    res = arcToCubic(X2, Y2, RX, RY, angle, 0, SF, x2old, y2old, [f2, f2old, cx, cy]);
  }

  df = f2 - f1;
  const c1 = Math.cos(f1);
  const s1 = Math.sin(f1);
  const c2 = Math.cos(f2);
  const s2 = Math.sin(f2);
  const t = Math.tan(df / 4);
  const hx = (4 / 3) * RX * t;
  const hy = (4 / 3) * RY * t;
  const m1 = [X1, Y1];
  const m2 = [X1 + hx * s1, Y1 - hy * c1];
  const m3 = [X2 + hx * s2, Y2 - hy * c2];
  const m4 = [X2, Y2];
  m2[0] = 2 * m1[0] - m2[0];
  m2[1] = 2 * m1[1] - m2[1];

  if (recursive) {
    return [m2, m3, m4].concat(res);
  }
  res = [m2, m3, m4].concat(res).join().split(',');
  return res.map((rz, i) => {
    if (i % 2) {
      return rotateVector(res[i - 1], rz, rad).y;
    }
    return rotateVector(rz, res[i + 1], rad).x;
  });
}
