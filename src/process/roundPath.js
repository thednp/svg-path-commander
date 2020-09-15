import options from '../options/options.js'
import clonePath from './clonePath.js'

export default function(pathArray,round) {
  let decimalsOption = !isNaN(+round) ? +round : options.round && options.decimals;
  return decimalsOption ? 
    pathArray.map( seg => seg.map((c,i) => {
      let nr = +c, dc = Math.pow(10,decimalsOption)
      return nr ? (nr % 1 === 0 ? nr : Math.round(nr*dc)/dc) : c
    }
  )) : clonePath(pathArray)
}