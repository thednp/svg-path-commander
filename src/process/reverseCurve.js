import pathToCurve from '../convert/pathToCurve.js'
import clonePath from '../util/clonePath.js'

// reverse CURVE based pathArray segments only
export default function(pathArray){
  let curveSegments = pathToCurve(pathArray),
      segsCount = curveSegments.length - 1,
      ci = 0, ni = 0,
      currentSeg = [],
      nextSeg = [],
      x1, y1, x2, y2, x, y

  return [curveSegments[0]].concat(curveSegments.slice(1,segsCount).map((p,i)=>{
    ci = segsCount - 1 - i
    ni = ci - 1 < 0 ? segsCount : ci - 1
    
    currentSeg = clonePath(curveSegments[ci])
    nextSeg = clonePath(curveSegments[ni])
    
    x = nextSeg[nextSeg.length - 2];
    y = nextSeg[nextSeg.length - 1];     
    x1 = currentSeg[3]; y1 = currentSeg[4];
    x2 = currentSeg[1]; y2 = currentSeg[2];
    return [p[0],x1,y1,x2,y2,x,y]
  }))
}