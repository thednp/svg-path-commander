import SVGPCOps from '../options/options.js'
import clonePath from './clonePath.js'
import setPathSpecs from './setPathSpecs.js'

export default function(pathArray) {
  let pa = SVGPCOps.round ? pathArray.map( s => s.map((c,i) => {
          let nr = +c, dc = Math.pow(10,SVGPCOps.decimals)
          return i ? (nr % 1 === 0 ? nr : (nr*dc>>0)/dc) : c
        }
      )) : clonePath(pathArray)
  setPathSpecs(pa)
  return pa
}