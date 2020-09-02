import shorthandToQuadratic from './shorthandToQuadratic.js';
import shorthandToCubic from './shorthandToCubic.js';

export default function(segment, params, prevCommand) {
  let nqxy, nxy;

  switch (segment[0]) {
    case "S":
      nxy = shorthandToCubic(params.x1,params.y1, params.x2,params.y2, prevCommand)
      params.x1 = nxy.x1
      params.y1 = nxy.y1
      segment = ["C", nxy.x1, nxy.y1].concat(segment.slice(1))
      break
    case "T":
      nqxy = shorthandToQuadratic(params.x1,params.y1, params.qx, params.qy, prevCommand)
      params.qx = nqxy.qx
      params.qy = nqxy.qy
      segment = ["Q", params.qx, params.qy].concat(segment.slice(1))
      break
    case "Q":
      params.qx = segment[1]
      params.qy = segment[2]
      break
    case "H":
      segment = ["L", segment[1], params.y1]
      break
    case "V":
      segment = ["L", params.x1, segment[1]]
      break
  }
  return segment
}