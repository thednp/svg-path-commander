import arcToCubic from './arcToCubic.js'
import quadToCubic from './quadToCubic.js'
import lineToCubic from './lineToCubic.js'

export default function(segment, params) {

  'TQ'.indexOf(segment[0])<0 && (params.qx = params.qy = null)

  switch (segment[0]) {
    case 'M':
      params.x = segment[1]
      params.y = segment[2]
      return segment
    case 'A':
      return ['C'].concat(arcToCubic.apply(0, [params.x1, params.y1].concat(segment.slice(1))))
    case 'Q':
      params.qx = segment[1];
      params.qy = segment[2];
      return ['C'].concat(quadToCubic.apply(0, [params.x1, params.y1].concat(segment.slice(1))))
    case 'L':
      return ['C'].concat(lineToCubic(params.x1, params.y1, segment[1], segment[2]))
    case 'Z':
      return ['C'].concat(lineToCubic(params.x1, params.y1, params.x, params.y))
  }
  return segment
}