
// https://github.com/paperjs/paper.js/blob/develop/src/path/Path.js
// Jürg Lehni & Jonathan Puckey
import pathToCurve from '../convert/pathToCurve.js'

function getCubicSegArea(x0,y0, x1,y1, x2,y2, x3,y3) {
  // http://objectmix.com/graphics/133553-area-closed-bezier-curve.html
  return 3 * ((y3 - y0) * (x1 + x2) - (x3 - x0) * (y1 + y2)
           + y1 * (x0 - x2) - x1 * (y0 - y2)
           + y3 * (x2 + x0 / 3) - x3 * (y2 + y0 / 3)) / 20;
}

export default function(pathArray,round) {
  let x = 0, y = 0, mx = 0, my = 0, len = 0
  return pathToCurve(pathArray,round).map(seg => {
    switch (seg[0]){
      case 'M':
      case 'Z':
        mx = seg[0] === 'M' ? seg[1] : mx
        my = seg[0] === 'M' ? seg[2] : my
        x = mx
        y = my
        return 0
      default:
        len = getCubicSegArea.apply(0, [x,y].concat(seg.slice(1) ));
        [x,y] = seg.slice(-2)
        return len
    }
  }).reduce((a, b) => a + b, 0)
}