import SVGPCOps from '../options/options.js'
import clonePath from './clonePath.js'

export default function(pathArray) {
  return SVGPCOps.round ? pathArray.map( seg => seg.map((c,i) => {
            let nr = +c, dc = Math.pow(10,SVGPCOps.decimals)
            return i ? (nr % 1 === 0 ? nr : (nr*dc>>0)/dc) : c
          }
        )) : clonePath(pathArray)
}