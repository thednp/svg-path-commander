import options from '../options/options.js'

import CSS3Matrix from './DOMMatrix.js'
import getShapeArea from './getShapeArea.js'
import getDrawDirection from './getDrawDirection.js'
import getPathBBox from './getPathBBox.js'
import isPathArray from './isPathArray.js'
import isAbsoluteArray from './isAbsoluteArray.js'
import isCurveArray from './isCurveArray.js'
import isRelativeArray from './isRelativeArray.js'

import parsePathString from '../process/parsePathString.js'
import clonePath from '../process/clonePath.js'
import roundPath from '../process/roundPath.js'
import splitPath from '../process/splitPath.js'
import optimizePath from '../process/optimizePath.js'
import reverseCurve from '../process/reverseCurve.js'
import reversePath from '../process/reversePath.js'
import normalizePath from '../process/normalizePath.js'

import pathToAbsolute from '../convert/pathToAbsolute.js'
import pathToRelative from '../convert/pathToRelative.js'
import pathToCurve from '../convert/pathToCurve.js'
import pathToString from '../convert/pathToString.js'

export default {
  CSS3Matrix,
  getShapeArea,
  getDrawDirection,
  clonePath,
  splitPath,
  isPathArray,
  isCurveArray,
  isAbsoluteArray,
  isRelativeArray,
  getPathBBox,
  roundPath,
  optimizePath,
  pathToAbsolute,
  pathToRelative,
  pathToCurve,
  pathToString,
  parsePathString,
  reverseCurve,
  reversePath,
  normalizePath,
  options
}