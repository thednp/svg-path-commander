import isPathArray from './isPathArray.js'

export default function(pathArray){
  return isPathArray(pathArray) && pathArray.slice(1).every(x=>x[0] === 'C')
}