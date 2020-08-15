import getShapeArea from './getShapeArea.js'

export default function(curveArray) {
  if (Array.isArray(curveArray) && curveArray.slice(1).every(x=>x[0].toUpperCase() === x[0])) {
    return getShapeArea(curveArray) >= 0
  } else {
    throw(`getDrawDirection expects a curveArray`)
  }
}