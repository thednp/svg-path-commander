import pathToAbsolute from './convert/pathToAbsolute.js'
import pathToRelative from './convert/pathToRelative.js'
import pathToCurve from './convert/pathToCurve.js'
import pathToString from './convert/pathToString.js'

import parsePathString from './process/parsePathString.js'
import reversePath from './process/reversePath.js'

import clonePath from './util/clonePath.js'
import splitPath from './util/splitPath.js'
import setPathSpecs from './util/setPathSpecs.js'

export default class SVGPathCommander {
  constructor(pathValue){
    this.original = pathValue 
    this.pathKey = `path-${Math.floor((Math.random() * 9999))}`

    this.pathCache = {}

    this.segments = parsePathString(pathValue)
    this.pathValue = pathToString(clonePath(this.segments)) 

    return this
  }
  toAbsolute(){
    let path = pathToAbsolute(this.segments)

    this.segments = clonePath(path)
    this.pathValue = pathToString(clonePath(path))

    return this
  }
  toRelative(){
    let path = pathToRelative(this.segments)

    this.segments = clonePath(path)
    this.pathValue = pathToString(clonePath(path))

    return this
  }
  toCurve(){
    let path = pathToCurve(this.segments)

    this.segments = clonePath(path)
    this.pathValue = pathToString(clonePath(path))

    return this
  }
  reverse(){
    let multiPath = splitPath(this.pathValue),
        hasSubpath = multiPath.length > 1,
        absoluteMultiPath = hasSubpath && splitPath(pathToString(pathToAbsolute(this.segments))).map(x=>reversePath(x)),
        path = hasSubpath ? [].concat.apply([], absoluteMultiPath) : reversePath(this.segments)

    !('isClosed' in path) && setPathSpecs(path)
    
    this.segments = clonePath(path)
    this.pathValue = pathToString(clonePath(path))

    return this
  }
  toString(){
    return this.pathValue
  }
}