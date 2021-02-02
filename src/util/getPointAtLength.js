import getSegCubicLength from './getSegCubicLength.js'
import getPointAtSegLength from './getPointAtSegLength.js'
import pathToCurve from '../convert/pathToCurve.js'

// calculates the shape total length
// almost equivalent to shape.getTotalLength()
export default function(pathArray,length){
  let totalLength = 0, segLen, data
  return pathToCurve(pathArray,9).map((seg,i,curveArray) => { // process data
    data = i ? curveArray[i-1].slice(-2).concat(seg.slice(1)) : seg.slice(1)
    segLen = i ? getSegCubicLength.apply(0, data) : 0
    totalLength += segLen

    return i === 0 ? {x:data[0], y:data[1]} :
           totalLength>length && length>totalLength-segLen ? 
              getPointAtSegLength.apply(0,data.concat(1 - (totalLength-length)/segLen)) : null
  }).filter(x=>x).slice(-1)[0] // isolate last segment
}