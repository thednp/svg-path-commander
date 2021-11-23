import epsilon from '../math/epsilon';

/**
 * Apply a 2D transformation matrix to an ellipse.
 *
 * @param {number[]} m the 2D transformation matrix
 * @param {number} rx ellipse radius X
 * @param {number} ry ellipse radius Y
 * @param {number} ax ellipse rotation angle
 */
export default function transformEllipse(m, rx, ry, ax) {
  // We consider the current ellipse as image of the unit circle
  // by first scale(rx,ry) and then rotate(ax) ...
  // So we apply ma =  m x rotate(ax) x scale(rx,ry) to the unit circle.
  const c = Math.cos((ax * Math.PI) / 180);
  const s = Math.sin((ax * Math.PI) / 180);
  const ma = [
    rx * (m[0] * c + m[2] * s),
    rx * (m[1] * c + m[3] * s),
    ry * (-m[0] * s + m[2] * c),
    ry * (-m[1] * s + m[3] * c),
  ];

  // ma * transpose(ma) = [ J L ]
  //                      [ L K ]
  // L is calculated later (if the image is not a circle)
  const J = ma[0] * ma[0] + ma[2] * ma[2];
  const K = ma[1] * ma[1] + ma[3] * ma[3];

  // the discriminant of the characteristic polynomial of ma * transpose(ma)
  let D = ((ma[0] - ma[3]) * (ma[0] - ma[3]) + (ma[2] + ma[1]) * (ma[2] + ma[1]))
          * ((ma[0] + ma[3]) * (ma[0] + ma[3]) + (ma[2] - ma[1]) * (ma[2] - ma[1]));

  // the "mean eigenvalue"
  const JK = (J + K) / 2;

  // check if the image is (almost) a circle
  if (D < epsilon * JK) {
    // if it is
    const rxy = Math.sqrt(JK);

    return { rx: rxy, ry: rxy, ax: 0 };
  }

  // if it is not a circle
  const L = ma[0] * ma[1] + ma[2] * ma[3];

  D = Math.sqrt(D);

  // {l1,l2} = the two eigen values of ma * transpose(ma)
  const l1 = JK + D / 2;
  const l2 = JK - D / 2;
  // the x - axis - rotation angle is the argument of the l1 - eigenvector
  let AX = (Math.abs(L) < epsilon && Math.abs(l1 - K) < epsilon) ? 90
    : Math.atan(Math.abs(L) > Math.abs(l1 - K) ? (l1 - J) / L
      : ((L / (l1 - K))) * 180) / Math.PI;
  let RX;
  let RY;

  // if ax > 0 => rx = sqrt(l1), ry = sqrt(l2), else exchange axes and ax += 90
  if (AX >= 0) {
    // if ax in [0,90]
    RX = Math.sqrt(l1);
    RY = Math.sqrt(l2);
  } else {
    // if ax in ]-90,0[ => exchange axes
    AX += 90;
    RX = Math.sqrt(l2);
    RY = Math.sqrt(l1);
  }

  return { rx: RX, ry: RY, ax: AX };
}
