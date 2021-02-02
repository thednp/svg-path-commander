import SVGPCO from '../options/options.js'

import pathToAbsolute from '../convert/pathToAbsolute.js'
import pathToRelative from '../convert/pathToRelative.js'
import pathToString from '../convert/pathToString.js'

import parsePathString from '../process/parsePathString.js'
import reversePath from '../process/reversePath.js'

import clonePath from '../process/clonePath.js'
import splitPath from '../process/splitPath.js'
import optimizePath from '../process/optimizePath.js'
import normalizePath from '../process/normalizePath.js'
import transformPath from '../process/transformPath.js'
import getPathBBox from '../util/getPathBBox.js'


export default class SVGPathCommander {
  constructor(pathValue,options){
    let roundOption = options && (+options.round === 0 || options.round === false) ? 0 : SVGPCO.round, // check for either true or > 0
        decimalsOption = roundOption && (options && options.decimals || SVGPCO.decimals),
        originOption = options && options.origin,
        path = parsePathString(pathValue,this.round)
        
    // set instance options
    this.round = roundOption === 0 ? 0 : decimalsOption // ZERO will disable rounding numbers 
    this.origin = originOption && !isNaN(originOption.x) && !isNaN(originOption.y) ? originOption : null

    this.segments = clonePath(path)
    this.pathValue = pathValue
    return this
  }
}

const SVGPCProto = SVGPathCommander.prototype

SVGPCProto.toAbsolute = function(){
  let path = pathToAbsolute(this.segments,this.round)
  this.segments = clonePath(path)
  return this
}
SVGPCProto.toRelative = function(){
  let path = pathToRelative(this.segments,this.round)
  this.segments = clonePath(path)
  return this
}
SVGPCProto.reverse = function(onlySubpath){
  this.toAbsolute()
  
  let subPath = splitPath(this.pathValue).length > 1 && splitPath(this.toString()),
      absoluteMultiPath, path 

  absoluteMultiPath = subPath && clonePath(subPath)
                    .map((x,i) => onlySubpath 
                    ? (i ? reversePath(x) : parsePathString(x))
                    : reversePath(x))

  path = subPath ? [].concat.apply([], absoluteMultiPath) 
        : onlySubpath ? this.segments : reversePath(this.segments)

  this.segments = clonePath(path)
  return this
}
SVGPCProto.normalize = function(){
  let path = normalizePath(this.segments,this.round)
  this.segments = clonePath(path)
  return this
}
SVGPCProto.optimize = function(){
  let path = optimizePath(this.segments,this.round)
  this.segments = clonePath(path)
  return this
}
SVGPCProto.transform = function(transformObject){
  transformObject = transformObject || {}
  if (!transformObject.origin) {
    let BBox = getPathBBox(this.segments)
    transformObject.origin = [BBox.cx,BBox.cy,BBox.cx]
  }

  let path = transformPath(
    this.segments,   // the pathArray
    transformObject, // transform functions object, now includes the transform origin
    this.round)      // decimals option

  this.segments = clonePath(path)
  return this
}
SVGPCProto.flipX = function(){
  this.transform({rotate:[180,0,0]})
  return this
}
SVGPCProto.flipY = function(){
  this.transform({rotate:[0,180,0]})
  return this
}
SVGPCProto.toString = function(){
  return pathToString(this.segments)
}