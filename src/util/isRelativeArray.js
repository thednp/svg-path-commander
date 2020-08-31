import isPathArray from './isPathArray.js'

export default function(pathInput){
  return isPathArray(pathInput) && pathInput.slice(1).every(x=>x[0] === x[0].toLowerCase())
}