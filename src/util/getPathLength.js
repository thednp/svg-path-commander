import getSegCubicLength from './getSegCubicLength.js'
import pathToCurve from '../convert/pathToCurve.js'

// calculates the shape total length
// equivalent to shape.getTotalLength()
// pathToCurve version
export default function(pathArray){
  let totalLength = 0
  pathToCurve(pathArray).map((s,i,curveArray) => {
    totalLength += 'M' !== s[0] ? getSegCubicLength.apply(0, curveArray[i-1].slice(-2).concat(s.slice(1)) ) : 0
  })
  return totalLength
}