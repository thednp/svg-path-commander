function base3(p1, p2, p3, p4, t) {
  var t1 = -3 * p1 + 9 * p2 - 9 * p3 + 3 * p4,
      t2 = t * t1 + 6 * p1 - 12 * p2 + 6 * p3;
  return t * t2 - 3 * p1 + 3 * p2;
}

// returns the cubic bezier segment length
export default function (x1, y1, x2, y2, x3, y3, x4, y4, z) {
  z == null && (z = 1)
  
  z = z > 1 ? 1 : z < 0 ? 0 : z;
  let z2 = z / 2, n = 12, ct = 0, xbase = 0, ybase = 0, comb = 0, sum = 0,
      Tvalues = [-0.1252,0.1252,-0.3678,0.3678,-0.5873,0.5873,-0.7699,0.7699,-0.9041,0.9041,-0.9816,0.9816],
      Cvalues = [0.2491,0.2491,0.2335,0.2335,0.2032,0.2032,0.1601,0.1601,0.1069,0.1069,0.0472,0.0472]

  Tvalues.map((T,i)=>{
    ct = z2 * T + z2
    xbase = base3( x1, x2, x3, x4, ct)
    ybase = base3( y1, y2, y3, y4, ct)
    comb = xbase * xbase + ybase * ybase
    sum += Cvalues[i] * Math.sqrt(comb)
  })

  return z2 * sum;
}