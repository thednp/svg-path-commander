import defaultOptions from '../options/options.js'

import pathToAbsolute from '../convert/pathToAbsolute.js'
import pathToRelative from '../convert/pathToRelative.js'
import pathToString from '../convert/pathToString.js'

import parsePathString from '../process/parsePathString.js'
import reversePath from '../process/reversePath.js'

import clonePath from '../process/clonePath.js'
import splitPath from '../process/splitPath.js'
import optimizePath from '../process/optimizePath.js'
import normalizePath from '../process/normalizePath.js'

export default class SVGPathCommander {
  constructor(pathValue,ops){
    this.round =  ops && ops.round === 0 ? 0 : 
                  ops && ops.decimals ? ops.decimals : 
                  defaultOptions.round && defaultOptions.decimals ? 
                  defaultOptions.decimals : 0

    let path = parsePathString(pathValue,this.round)
    this.segments = clonePath(path)
    this.pathValue = pathValue
    return this
  }
  toAbsolute(){
    let path = pathToAbsolute(this.segments,this.round)
    this.segments = clonePath(path)
    return this
  }
  toRelative(){
    let path = pathToRelative(this.segments,this.round)
    this.segments = clonePath(path)
    return this
  }
  reverse(onlySubpath){
    this.toAbsolute()
    
    let subPath = splitPath(this.pathValue).length > 1 && splitPath(this.toString()), 
        absoluteMultiPath = subPath && clonePath(subPath).map((x,i) => {
          return onlySubpath ? (i ? reversePath(x) : parsePathString(x)) : reversePath(x)
        }), 
        path =  subPath ? [].concat.apply([], absoluteMultiPath) 
              : onlySubpath ? this.segments : reversePath(this.segments)

    this.segments = clonePath(path)
    return this
  }
  normalize(){
    let path = normalizePath(this.segments,this.round)
    this.segments = clonePath(path)
    return this
  }
  optimize(){
    let path = optimizePath(this.segments,this.round)
    this.segments = clonePath(path)
    return this
  }
  toString(){
    return pathToString(this.segments)
  }
}