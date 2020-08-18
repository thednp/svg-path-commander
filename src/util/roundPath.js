import SVGPathCommanderOptions from '../options/options.js'
import clonePath from './clonePath.js'

export default function(pathArray) {
  return SVGPathCommanderOptions.round ? 
    pathArray.map( seg => seg.map((c,i) => {
        let nr = +c, dc = Math.pow(10,SVGPathCommanderOptions.decimals)
        return i ? (nr % 1 === 0 ? nr : (nr*dc>>0)/dc) : c
      }
    )) : clonePath(pathArray)
}