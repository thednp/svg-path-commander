import arcToCubicBezier from './arcToCubicBezier.js'
import quadraticToCubicBezier from './quadraticToCubicBezier.js'
import lineToCubicBezier from './lineToCubicBezier.js'

export default function(segment, params) {

  'TQ'.indexOf(segment[0])<0 && (params.qx = params.qy = null)

  switch (segment[0]) {
    case 'M':
      params.x = segment[1]
      params.y = segment[2]
      break
    case 'A':
      segment = ['C'].concat(arcToCubicBezier.apply(0, [params.x1, params.y1].concat(segment.slice(1))))
      break
    case 'Q':
      params.qx = segment[1];
      params.qy = segment[2];
      segment = ['C'].concat(quadraticToCubicBezier.apply(0, [params.x1, params.y1].concat(segment.slice(1))))
      break
    case 'L':
      segment = ['C'].concat(lineToCubicBezier(params.x1, params.y1, segment[1], segment[2]))
      break
    case 'Z':
      segment = ['C'].concat(lineToCubicBezier(params.x1, params.y1, params.x, params.y))
      break
  }
  return segment
}