import a2c from '../util/a2c.js'
import q2c from '../util/q2c.js'
import l2c from '../util/l2c.js'

export default function(segment, params, pathCommand) {
  let nx, ny;

  !(segment[0] in {T: 1, Q: 1}) && (params.qx = params.qy = null);

  switch (segment[0]) {
    case "M":
      params.X = segment[1];
      params.Y = segment[2];
      break;
    case "A":
      segment = ["C"].concat(a2c.apply(0, [params.x, params.y].concat(segment.slice(1))));
      break;
    case "S":
      if (pathCommand === "C" || pathCommand === "S") { // In "S" case we have to take into account, if the previous command is C/S.
        nx = params.x * 2 - params.bx;            // And reflect the previous
        ny = params.y * 2 - params.by;            // command's control point relative to the current point.
      }
      else {                            // or some else or nothing
        nx = params.x;
        ny = params.y;
      }
      segment = ["C", nx, ny].concat(segment.slice(1));
      break;
    case "T":
      if (pathCommand === "Q" || pathCommand === "T") { // In "T" case we have to take into account, if the previous command is Q/T.
        params.qx = params.x * 2 - params.qx;          // And make a reflection similar
        params.qy = params.y * 2 - params.qy;          // to case "S".
      }
      else {                            // or something else or nothing
        params.qx = params.x;
        params.qy = params.y;
      }
      segment = ["C"].concat(q2c(params.x, params.y, params.qx, params.qy, segment[1], segment[2]));
      break;
    case "Q":
      params.qx = segment[1];
      params.qy = segment[2];
      segment = ["C"].concat(q2c(params.x, params.y, segment[1], segment[2], segment[3], segment[4]));
      break;
    case "L":
      segment = ["C"].concat(l2c(params.x, params.y, segment[1], segment[2]));
      break;
    case "H":
      segment = ["C"].concat(l2c(params.x, params.y, segment[1], params.y));
      break;
    case "V":
      segment = ["C"].concat(l2c(params.x, params.y, params.x, segment[1]));
      break;
    case "Z":
      segment = ["C"].concat(l2c(params.x, params.y, params.X, params.Y));
      break;
  }
  return segment;
}