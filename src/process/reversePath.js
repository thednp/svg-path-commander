import pathToAbsolute from '../convert/pathToAbsolute.js';
import reverseCurve from './reverseCurve.js';
import pathToCurve from '../convert/pathToCurve.js';

export default function(pathArray){
  let isClosed = pathToAbsolute(pathArray).some(x=>x[0].toUpperCase() === 'Z'),
      pathCurveArray = reverseCurve(pathToCurve(pathArray)),
      result = [],
      pathCommand, 
      x1, y1, x2, y2, x, y,
      prevSeg = [],
      px, py

  return pathCurveArray.map((p,i)=>{
    x  = p[p.length - 2];
    y  = p[p.length - 1];
    x1 = p[1]; y1 = p[2]; 
    x2 = p[3]; y2 = p[4];

    prevSeg = i - 1 < 0 ? pathCurveArray[pathCurveArray.length - 1] : pathCurveArray[i - 1]

    px = prevSeg[prevSeg.length - 2]
    py = prevSeg[prevSeg.length - 1]

    if (p.length === 3) { // M
      pathCommand = 'M'
    } else if (py===y && py===y1) { // H
      pathCommand = 'H'
    } else if (px===x && px===x1) { // V
      pathCommand = 'V'
    } else if ( px===x1 && py===y1 && x===x2 && y===y2 ) { // L
      pathCommand = 'L'
    } else { // C
      pathCommand = p[0]
    }

    switch(pathCommand) {
      case 'M':
        result = ['M', x,y]
        break;
      case 'L':
        result = [pathCommand, x,y]
        break;
      case 'V':
        result = [pathCommand, y]
        break;
      case 'H':
        result = [pathCommand, x]
        break;
      case 'C':
        result = [pathCommand,x1,y1,x2,y2,x,y]
        break;
      default:
        result = [pathCommand]
    }
    return result
  })
  .concat(isClosed ? [['Z']] : [])
}