import getPathArea from './getPathArea.js'
import pathToCurve from '../convert/pathToCurve.js'

export default function(pathArray) {
  return getPathArea(pathToCurve(pathArray)) >= 0
}