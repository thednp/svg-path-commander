import pathToAbsolute from '../convert/pathToAbsolute.js'
import pathToRelative from '../convert/pathToRelative.js'

export default function(pathArray,round){
  let absolutePath = pathToAbsolute(pathArray,round),
      relativePath = pathToRelative(pathArray,round)
  return absolutePath.map((x,i) => i ? (x.join('').length < relativePath[i].join('').length ? x : relativePath[i]) : x )
}