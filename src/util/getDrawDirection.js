import getShapeArea from './getShapeArea.js'

export default function(curveArray) {
  if (Array.isArray(curveArray) && curveArray.slice(1).every(x=>x[0] === 'C')) {
    return getShapeArea(curveArray) >= 0
  } else {
    throw(`getDrawDirection expects a curveArray`)
  }
}