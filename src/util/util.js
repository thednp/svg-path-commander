import a2c from './a2c.js'
import catmullRom2bezier from './catmullRom2bezier.js'
import clonePath from './clonePath.js'
import ellipsePath from './ellipsePath.js'
import fixArc from './fixArc.js'
import fixM from './fixM.js'
import getArea from './getArea.js'
import getDrawDirection from './getDrawDirection.js'
import getShapeArea from './getShapeArea.js'
import l2c from './l2c.js'
import q2c from './q2c.js'
import rotateVector from './rotateVector.js'
import splitPath from './splitPath.js'
import SVGPCOptions from '../options/options.js'

import pathToAbsolute from '../convert/pathToAbsolute.js'
import pathToRelative from '../convert/pathToRelative.js'
import pathToCurve from '../convert/pathToCurve.js'
import pathToString from '../convert/pathToString.js'

import parsePathString from '../process/parsePathString.js'
import processPath from '../process/processPath.js'
import reverseCurve from '../process/reverseCurve.js'
import reversePath from '../process/reversePath.js'

export default {
  a2c,
  catmullRom2bezier,
  clonePath,
  ellipsePath,
  fixArc,
  fixM,
  getArea,
  getDrawDirection,
  getShapeArea,
  l2c,
  q2c,
  rotateVector,
  splitPath,
  pathToAbsolute,
  pathToRelative,
  pathToCurve,
  pathToString,
  parsePathString,
  processPath,
  reverseCurve,
  reversePath,
  options: SVGPCOptions
}