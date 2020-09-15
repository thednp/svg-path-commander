export default function (x1, y1, qx, qy, x2, y2) {
  let _13 = 1 / 3, _23 = 2 / 3;
  return [
          _13 * x1 + _23 * qx, // cpx1
          _13 * y1 + _23 * qy, // cpy1
          _13 * x2 + _23 * qx, // cpx2
          _13 * y2 + _23 * qy, // cpy2
          x2, y2               // x,y
        ]
}