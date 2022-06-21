import rotateVector from '../math/rotateVector';

/**
 * Converts A (arc-to) segments to C (cubic-bezier-to).
 *
 * For more information of where this math came from visit:
 * http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
 *
 * @param {number} X1 the starting x position
 * @param {number} Y1 the starting y position
 * @param {number} RX x-radius of the arc
 * @param {number} RY y-radius of the arc
 * @param {number} angle x-axis-rotation of the arc
 * @param {number} LAF large-arc-flag of the arc
 * @param {number} SF sweep-flag of the arc
 * @param {number} X2 the ending x position
 * @param {number} Y2 the ending y position
 * @param {number[]=} recursive the parameters needed to split arc into 2 segments
 * @return {number[]} the resulting cubic-bezier segment(s)
 */
export default function arcToCubic(X1, Y1, RX, RY, angle, LAF, SF, X2, Y2, recursive) {
  let x1 = X1; let y1 = Y1; let rx = RX; let ry = RY; let x2 = X2; let y2 = Y2;
  // for more information of where this Math came from visit:
  // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
  const d120 = (Math.PI * 120) / 180;

  const rad = (Math.PI / 180) * (+angle || 0);
  /** @type {number[]} */
  let res = [];
  let xy;
  let f1;
  let f2;
  let cx;
  let cy;

  if (!recursive) {
    xy = rotateVector(x1, y1, -rad);
    x1 = xy.x;
    y1 = xy.y;
    xy = rotateVector(x2, y2, -rad);
    x2 = xy.x;
    y2 = xy.y;

    const x = (x1 - x2) / 2;
    const y = (y1 - y2) / 2;
    let h = (x * x) / (rx * rx) + (y * y) / (ry * ry);
    if (h > 1) {
      h = Math.sqrt(h);
      rx *= h;
      ry *= h;
    }
    const rx2 = rx * rx;
    const ry2 = ry * ry;

    const k = (LAF === SF ? -1 : 1)
            * Math.sqrt(Math.abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x)
                / (rx2 * y * y + ry2 * x * x)));

    cx = ((k * rx * y) / ry) + ((x1 + x2) / 2);
    cy = ((k * -ry * x) / rx) + ((y1 + y2) / 2);
    // eslint-disable-next-line no-bitwise -- Impossible to satisfy no-bitwise
    f1 = Math.asin((((y1 - cy) / ry) * (10 ** 9) >> 0) / (10 ** 9));
    // eslint-disable-next-line no-bitwise -- Impossible to satisfy no-bitwise
    f2 = Math.asin((((y2 - cy) / ry) * (10 ** 9) >> 0) / (10 ** 9));

    f1 = x1 < cx ? Math.PI - f1 : f1;
    f2 = x2 < cx ? Math.PI - f2 : f2;
    if (f1 < 0) (f1 = Math.PI * 2 + f1);
    if (f2 < 0) (f2 = Math.PI * 2 + f2);
    if (SF && f1 > f2) {
      f1 -= Math.PI * 2;
    }
    if (!SF && f2 > f1) {
      f2 -= Math.PI * 2;
    }
  } else {
    [f1, f2, cx, cy] = recursive;
  }
  let df = f2 - f1;
  if (Math.abs(df) > d120) {
    const f2old = f2;
    const x2old = x2;
    const y2old = y2;
    f2 = f1 + d120 * (SF && f2 > f1 ? 1 : -1);
    x2 = cx + rx * Math.cos(f2);
    y2 = cy + ry * Math.sin(f2);
    res = arcToCubic(x2, y2, rx, ry, angle, 0, SF, x2old, y2old, [f2, f2old, cx, cy]);
  }
  df = f2 - f1;
  const c1 = Math.cos(f1);
  const s1 = Math.sin(f1);
  const c2 = Math.cos(f2);
  const s2 = Math.sin(f2);
  const t = Math.tan(df / 4);
  const hx = (4 / 3) * rx * t;
  const hy = (4 / 3) * ry * t;
  const m1 = [x1, y1];
  const m2 = [x1 + hx * s1, y1 - hy * c1];
  const m3 = [x2 + hx * s2, y2 - hy * c2];
  const m4 = [x2, y2];
  m2[0] = 2 * m1[0] - m2[0];
  m2[1] = 2 * m1[1] - m2[1];
  if (recursive) {
    return [...m2, ...m3, ...m4, ...res];
  }
  res = [...m2, ...m3, ...m4, ...res];
  const newres = [];
  for (let i = 0, ii = res.length; i < ii; i += 1) {
    newres[i] = i % 2
      ? rotateVector(res[i - 1], res[i], rad).y
      : rotateVector(res[i], res[i + 1], rad).x;
  }
  return newres;
}
