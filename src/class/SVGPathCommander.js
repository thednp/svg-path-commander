import pathToAbsolute from '../convert/pathToAbsolute.js'
import pathToRelative from '../convert/pathToRelative.js'
import pathToCurve from '../convert/pathToCurve.js'
import pathToString from '../convert/pathToString.js'

import parsePathString from '../process/parsePathString.js'
import reversePath from '../process/reversePath.js'

import clonePath from '../util/clonePath.js'
import splitPath from '../util/splitPath.js'
import optimizePath from '../util/optimizePath.js'

export default class SVGPathCommander {
  constructor(pathValue){
    let path = parsePathString(pathValue)
    this.segments = clonePath(path)
    this.pathValue = pathValue
    return this
  }
  toAbsolute(){
    let path = pathToAbsolute(this.segments)
    this.segments = clonePath(path)
    return this
  }
  toRelative(){
    let path = pathToRelative(this.segments)
    this.segments = clonePath(path)
    return this
  }
  reverse(onlySubpath){
    let multiPath = splitPath(this.pathValue),
        hasSubpath = multiPath.length > 1,
        absoluteMultiPath = hasSubpath && splitPath(pathToString(pathToAbsolute(this.segments))).map((x,i)=> {
          return onlySubpath ? (i ? reversePath(x) : parsePathString(x)) : reversePath(x)
        }),
        path = hasSubpath ? [].concat.apply([], absoluteMultiPath) : reversePath(this.segments)
    console.log(pathToAbsolute(this.pathValue),path)
    this.segments = clonePath(path)
    return this
  }
  optimize(){
    let path = optimizePath(this.segments)
    this.segments = clonePath(path)
    return this
  }
  toString(){
    return pathToString(this.segments)
  }
}