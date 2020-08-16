import pathToAbsolute from '../convert/pathToAbsolute.js'
import pathToRelative from '../convert/pathToRelative.js'
import pathToString from '../convert/pathToString.js'
import clonePath from './clonePath.js'

export default function(pathArray){
  let absolutePath = pathArray.isAbsolute ? clonePath(pathArray) : pathToAbsolute(pathArray),
      relativePath = pathToRelative(pathArray),
      absoluteString = pathToString(clonePath(absolutePath)),
      relativeString = pathToString(clonePath(relativePath))
  return absoluteString.length < relativeString.length ? clonePath(absolutePath) : clonePath(relativePath)
}