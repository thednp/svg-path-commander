import getShapeArea from './getShapeArea.js'
import pathToCurve from '../convert/pathToCurve.js'

export default function(curveArray) {
  return getShapeArea(curveArray = pathToCurve(curveArray)) >= 0
}