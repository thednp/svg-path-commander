import rotateVector from "./rotateVector.js"

// for more information of where this math came from visit:
// http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
export default function a2c(x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive) {
  let _120 = Math.PI * 120 / 180, 
      rad = Math.PI / 180 * (angle || 0),
      res = [], xy, f1, f2, cx, cy;

  if (!recursive) {
    xy = rotateVector(x1, y1, -rad);
    x1 = xy.x; y1 = xy.y;
    xy = rotateVector(x2, y2, -rad);
    x2 = xy.x; y2 = xy.y;

    let x = (x1 - x2) / 2, 
        y = (y1 - y2) / 2, 
        h = (x * x) / (rx * rx) + (y * y) / (ry * ry);
    if (h > 1) {
      h = Math.sqrt(h);
      rx = h * rx;
      ry = h * ry;
    }
    let rx2 = rx * rx, 
        ry2 = ry * ry,
        k = (large_arc_flag == sweep_flag ? -1 : 1) 
          * Math.sqrt(Math.abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) 
          / (rx2 * y * y + ry2 * x * x)));

    cx = k * rx * y / ry + (x1 + x2) / 2
    cy = k * -ry * x / rx + (y1 + y2) / 2

    f1 = Math.asin( (((y1 - cy) / ry) * 10000 >> 0) / 10000 ) // keep toFIxed(9)!
    f2 = Math.asin( (((y2 - cy) / ry) * 10000 >> 0) / 10000 )

    f1 = x1 < cx ? Math.PI - f1 : f1;
    f2 = x2 < cx ? Math.PI - f2 : f2;
    f1 < 0 && (f1 = Math.PI * 2 + f1);
    f2 < 0 && (f2 = Math.PI * 2 + f2);
    if (sweep_flag && f1 > f2) {
      f1 = f1 - Math.PI * 2;
    }
    if (!sweep_flag && f2 > f1) {
      f2 = f2 - Math.PI * 2;
    }
  } else {
    f1 = recursive[0];
    f2 = recursive[1];
    cx = recursive[2];
    cy = recursive[3];
  }
  let df = f2 - f1;
  if (Math.abs(df) > _120) {
    let f2old = f2, x2old = x2, y2old = y2;

    f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
    x2 = cx + rx * Math.cos(f2);
    y2 = cy + ry * Math.sin(f2);
    res = a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [f2, f2old, cx, cy]);
  }
  df = f2 - f1;
  let c1 = Math.cos(f1),
      s1 = Math.sin(f1),
      c2 = Math.cos(f2),
      s2 = Math.sin(f2),
      t = Math.tan(df / 4),
      hx = 4 / 3 * rx * t,
      hy = 4 / 3 * ry * t,
      m1 = [x1, y1],
      m2 = [x1 + hx * s1, y1 - hy * c1],
      m3 = [x2 + hx * s2, y2 - hy * c2],
      m4 = [x2, y2];
  m2[0] = 2 * m1[0] - m2[0];
  m2[1] = 2 * m1[1] - m2[1];
  if (recursive) {
    return [m2, m3, m4].concat(res);
  } else {
    res = [m2, m3, m4].concat(res).join().split(",");
    return res.map((rz,i)=> i % 2 ? rotateVector(res[i - 1], rz, rad).y : rotateVector(rz, res[i + 1], rad).x);
  }
}