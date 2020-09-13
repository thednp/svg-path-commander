import getSegCubicLength from './getSegCubicLength.js'
import arcToCubic from '../process/arcToCubic.js'

// returns the Arc segment length by transforming the segment to cubic bezier curve(s)
// A rx ry x-axis-rotation large-arc-flag sweep-flag x y
export default function(){ // x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2
  let args = Array.from(arguments),
      [x1,y1] = args.slice(0,2), 
      cubicSeg = arcToCubic.apply(0,args),
      cumulatedLength = 0,
      cubicSubseg = []

  for (let i=0,ii=cubicSeg.length; i<ii; i+=6) {
    cubicSubseg = cubicSeg.slice(i,i+6)
    cumulatedLength += getSegCubicLength.apply(0,[x1,y1].concat(cubicSubseg));
    [x1,y1] = cubicSubseg.slice(-2)
  }

  return cumulatedLength
}