import a2c from '../util/a2c.js'
import q2c from '../util/q2c.js'
import l2c from '../util/l2c.js'

export default function(path, d, pcom) {
  let nx, ny;
  if (!path) {
    return ["C", d.x, d.y, d.x, d.y, d.x, d.y];
  }
  !(path[0] in {T: 1, Q: 1}) && (d.qx = d.qy = null);
  switch (path[0]) {
    case "M":
      d.X = path[1];
      d.Y = path[2];
      break;
    case "A":
      path = ["C"].concat(a2c.apply(0, [d.x, d.y].concat(path.slice(1))));
      break;
    case "S":
      if (pcom === "C" || pcom === "S") { // In "S" case we have to take into account, if the previous command is C/S.
        nx = d.x * 2 - d.bx;            // And reflect the previous
        ny = d.y * 2 - d.by;            // command's control point relative to the current point.
      }
      else {                            // or some else or nothing
        nx = d.x;
        ny = d.y;
      }
      path = ["C", nx, ny].concat(path.slice(1));
      break;
    case "T":
      if (pcom === "Q" || pcom === "T") { // In "T" case we have to take into account, if the previous command is Q/T.
        d.qx = d.x * 2 - d.qx;          // And make a reflection similar
        d.qy = d.y * 2 - d.qy;          // to case "S".
      }
      else {                            // or something else or nothing
        d.qx = d.x;
        d.qy = d.y;
      }
      path = ["C"].concat(q2c(d.x, d.y, d.qx, d.qy, path[1], path[2]));
      break;
    case "Q":
      d.qx = path[1];
      d.qy = path[2];
      path = ["C"].concat(q2c(d.x, d.y, path[1], path[2], path[3], path[4]));
      break;
    case "L":
      path = ["C"].concat(l2c(d.x, d.y, path[1], path[2]));
      break;
    case "H":
      path = ["C"].concat(l2c(d.x, d.y, path[1], d.y));
      break;
    case "V":
      path = ["C"].concat(l2c(d.x, d.y, d.x, path[1]));
      break;
    case "Z":
      path = ["C"].concat(l2c(d.x, d.y, d.X, d.Y));
      break;
  }
  return path;
}