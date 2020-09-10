import shorthandToQuad from './shorthandToQuad.js';
import shorthandToCubic from './shorthandToCubic.js';

export default function(segment, params, prevCommand) {
  let nqxy, nxy;

  switch (segment[0]) {
    case "S":
      nxy = shorthandToCubic(params.x1,params.y1, params.x2,params.y2, prevCommand)
      params.x1 = nxy.x1
      params.y1 = nxy.y1
      return ["C", nxy.x1, nxy.y1].concat(segment.slice(1))
    case "T":
      nqxy = shorthandToQuad(params.x1,params.y1, params.qx, params.qy, prevCommand)
      params.qx = nqxy.qx
      params.qy = nqxy.qy
      return ["Q", params.qx, params.qy].concat(segment.slice(1))
    case "Q":
      params.qx = segment[1]
      params.qy = segment[2]
    case "H":
      return ["L", segment[1], params.y1]
    case "V":
      return ["L", params.x1, segment[1]]
  }
  return segment
}