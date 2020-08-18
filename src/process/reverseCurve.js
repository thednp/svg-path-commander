import clonePath from '../util/clonePath.js'

// reverse CURVE based pathArray segments only
export default function(pathCurveArray){
  let curveSegments = clonePath(pathCurveArray),
      curveCount = curveSegments.length - 2,
      ci = 0, ni = 0,
      currentSeg = [],
      nextSeg = [],
      x1, y1, x2, y2, x, y,
      curveOnly = curveSegments.slice(1),
      rotatedCurve = curveOnly.map((p,i)=>{
        ci = curveCount - i
        ni = ci - 1 < 0 ? curveCount : ci - 1
        currentSeg = curveOnly[ci]
        nextSeg = curveOnly[ni]
        x = nextSeg[nextSeg.length - 2];
        y = nextSeg[nextSeg.length - 1];
        x1 = currentSeg[3]; y1 = currentSeg[4];
        x2 = currentSeg[1]; y2 = currentSeg[2];
        return ['C',x1,y1,x2,y2,x,y]
      })

  // return [['M',rotatedCurve[curveCount][5],rotatedCurve[curveCount][6]]].concat(rotatedCurve)  
  return [['M',x,y]].concat(rotatedCurve)  
}