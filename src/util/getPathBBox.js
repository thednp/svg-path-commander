import getCubicBezierSize from './getCubicBezierSize.js'
import pathToCurve from '../convert/pathToCurve.js';

export default function(pathArray) {
  if (!pathArray) {
    return {x: 0, y: 0, width: 0, height: 0, x2: 0, y2: 0};
  }
  pathArray = pathToCurve(pathArray)

  let x = 0, y = 0, X = [], Y = []

  pathArray.map(segment=>{
    if (segment[0] === "M") {
      x = segment[1];
      y = segment[2];
      X.push(x);
      Y.push(y);
    } else {
      let dim = getCubicBezierSize.apply(0, [x, y].concat(segment.slice(1)));
      X = X.concat(dim.min.x, dim.max.x);
      Y = Y.concat(dim.min.y, dim.max.y);
      x = segment[5];
      y = segment[6];
    }
  })

  let xTop = Math.min.apply(0, X), yTop = Math.min.apply(0, Y),
      xBot = Math.max.apply(0, X), yBot = Math.max.apply(0, Y),
      width = xBot - xTop, height = yBot - yTop

  return {
    x: xTop, y: yTop,
    x2: xBot, y2: yBot,
    width: width, height: height,
    cx: xTop + width / 2,
    cy: yTop + height / 2
  }
}