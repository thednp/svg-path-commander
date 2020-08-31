import getShapeArea from './getShapeArea.js'
import isCurveArray from './isCurveArray.js'

export default function(curveArray) {
  if (!isCurveArray(curveArray)) {
    throw(`getDrawDirection expects a curveArray`)
  }
  return getShapeArea(curveArray) >= 0
}