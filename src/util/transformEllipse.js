import epsilon from './epsilon.js'

export default function(m,rx,ry,ax) {
  // We consider the current ellipse as image of the unit circle
  // by first scale(rx,ry) and then rotate(ax) ...
  // So we apply ma =  m x rotate(ax) x scale(rx,ry) to the unit circle.
  let c = Math.cos(ax * Math.PI / 180), s = Math.sin(ax * Math.PI / 180),
      ma = [
        rx * (m[0]*c + m[2]*s),
        rx * (m[1]*c + m[3]*s),
        ry * (-m[0]*s + m[2]*c),
        ry * (-m[1]*s + m[3]*c)
      ]

  // ma * transpose(ma) = [ J L ]
  //                      [ L K ]
  // L is calculated later (if the image is not a circle)
  let J = ma[0]*ma[0] + ma[2]*ma[2],
      K = ma[1]*ma[1] + ma[3]*ma[3];

  // the discriminant of the characteristic polynomial of ma * transpose(ma)
  let D = ((ma[0]-ma[3])*(ma[0]-ma[3]) + (ma[2]+ma[1])*(ma[2]+ma[1])) *
          ((ma[0]+ma[3])*(ma[0]+ma[3]) + (ma[2]-ma[1])*(ma[2]-ma[1]));

  // the "mean eigenvalue"
  let JK = (J + K) / 2;

  // check if the image is (almost) a circle
  if (D < epsilon * JK) {
    // if it is
    rx = ry = Math.sqrt(JK);
    ax = 0;
    return { rx, ry, ax }
  }

  // if it is not a circle
  let L = ma[0]*ma[1] + ma[2]*ma[3];

  D = Math.sqrt(D);

  // {l1,l2} = the two eigen values of ma * transpose(ma)
  let l1 = JK + D/2,
      l2 = JK - D/2;
  // the x - axis - rotation angle is the argument of the l1 - eigenvector
  ax = (Math.abs(L) < epsilon && Math.abs(l1 - K) < epsilon) ? 90
      : Math.atan(Math.abs(L) > Math.abs(l1 - K) ? (l1 - J) / L
      : L / (l1 - K)) * 180 / Math.PI;

  // if ax > 0 => rx = sqrt(l1), ry = sqrt(l2), else exchange axes and ax += 90
  if (ax >= 0) {
    // if ax in [0,90]
    rx = Math.sqrt(l1);
    ry = Math.sqrt(l2);
  } else {
    // if ax in ]-90,0[ => exchange axes
    ax += 90;
    rx = Math.sqrt(l2);
    ry = Math.sqrt(l1);
  }

  return { rx, ry, ax }
}