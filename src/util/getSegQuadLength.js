// https://gist.github.com/tunght13488/6744e77c242cc7a94859#gistcomment-2047251
export default function (x1,y1, qx,qy, x2,y2) {
  let ax = x1 - 2 * qx + x2,
      ay = y1 - 2 * qy + y2,
      bx = 2 * qx - 2 * x1,
      by = 2 * qy - 2 * y1,
      A = 4 * (ax * ax + ay * ay),
      B = 4 * (ax * bx + ay * by),
      C = bx * bx + by * by,

      Sabc = 2 * Math.sqrt(A+B+C),
      A_2 = Math.sqrt(A),
      A_32 = 2 * A * A_2,
      C_2 = 2 * Math.sqrt(C),
      BA = B / A_2;

  return (A_32 * Sabc + A_2 * B * (Sabc - C_2) + (4 * C * A - B * B) * Math.log((2 * A_2 + BA + Sabc) / (BA + C_2))) / (4 * A_32)
}