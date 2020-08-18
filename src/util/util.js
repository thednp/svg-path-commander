import parsePathString from '../process/parsePathString.js'
import clonePath from './clonePath.js'
import getDrawDirection from './getDrawDirection.js'
import getShapeArea from './getShapeArea.js'
import splitPath from './splitPath.js'
import roundPath from './roundPath.js'
import optimizePath from './optimizePath.js'

import pathToAbsolute from '../convert/pathToAbsolute.js'
import pathToRelative from '../convert/pathToRelative.js'
import pathToCurve from '../convert/pathToCurve.js'
import pathToString from '../convert/pathToString.js'

import reverseCurve from '../process/reverseCurve.js'
import reversePath from '../process/reversePath.js'

import SVGPathCommanderOptions from '../options/options.js'

export default {
  clonePath,
  getDrawDirection,
  getShapeArea,
  splitPath,
  roundPath,
  optimizePath,
  pathToAbsolute,
  pathToRelative,
  pathToCurve,
  pathToString,
  parsePathString,
  reverseCurve,
  reversePath,
  options: SVGPathCommanderOptions
}