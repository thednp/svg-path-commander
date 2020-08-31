import pathToAbsolute from '../convert/pathToAbsolute.js'
import pathToRelative from '../convert/pathToRelative.js'

export default function(pathArray){
  let absolutePath = pathToAbsolute(pathArray),
      relativePath = pathToRelative(pathArray)
  return absolutePath.map((x,i) => i ? (x.join('').length < relativePath[i].join('').length ? x : relativePath[i]) : x )
}