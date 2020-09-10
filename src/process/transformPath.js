import normalizePath from './normalizePath.js'
import roundPath from './roundPath.js'
import pathToAbsolute from '../convert/pathToAbsolute.js'
// import segmentToCubic from './segmentToCubic.js'       // REQUIRED FOR CONVERTING A=>C
// import fixArc from '../util/fixArc.js'                 // REQUIRED FOR CONVERTING A=>C
import epsilon from '../util/epsilon.js'
import getSVGMatrix from '../util/getSVGMatrix.js'
import transformEllipse from '../util/transformEllipse.js'
import pathToCurve from '../convert/pathToCurve.js'


// Apply matrix to 2D point
function point2DLerp(m, x, y) {
  return [
    x * m[0] + y * m[2] + m[4],
    x * m[1] + y * m[3] + m[5]
  ]
}

export default function(pathArray,transformObject,{round,origin}){

  let x, y, i, j, ii, jj, lx, ly,
      absolutePath = pathToAbsolute(pathArray),
      curvePath = pathToCurve(absolutePath),
      normalizedPath = normalizePath(absolutePath),
      matrix = getSVGMatrix(curvePath,transformObject,origin),
      params = {x1: 0, y1: 0, x2: 0, y2: 0, x: 0, y: 0}, 
      transformedPath = [], allPathCommands = [],
      segment = [], seglen = 0, pathCommand = '',
      result = [];

  for (i=0, ii = absolutePath.length; i<ii; i++ ) {
    segment = absolutePath[i]
    absolutePath[i] && (pathCommand = segment[0])

    // WHEN WE HAVE THE KNOW-HOW ON matrix3d and SVG path commands
    // REPLACE A with C(s) - 

    // allPathCommands[i] = pathCommand
    
    // if (pathCommand==='A') { // later when 3d can be applied, we use C instead of A
    //   segment = segmentToCubic(normalizedPath[i], params)
    
    //   absolutePath[i] = segmentToCubic(normalizedPath[i], params)
    //   fixArc(absolutePath,allPathCommands,i)
    
    //   normalizedPath[i] = segmentToCubic(normalizedPath[i], params)
    //   fixArc(normalizedPath,allPathCommands,i)
    // }
    
    // ii = Math.max(absolutePath.length,normalizedPath.length)
    // REPLACE A with Cs

    segment = normalizedPath[i]
    seglen = segment.length

    params.x1 = +segment[seglen - 2]
    params.y1 = +segment[seglen - 1]
    params.x2 = +(segment[seglen - 4]) || params.x1
    params.y2 = +(segment[seglen - 3]) || params.y1

    result = {s:absolutePath[i], c:absolutePath[i][0]}

    if (pathCommand !== 'Z') {
      result.x = params.x1
      result.y = params.y1
    }
    transformedPath = transformedPath.concat(result)
  }

  transformedPath = transformedPath.map((seg,i,tfArray)=>{
    pathCommand = seg.c
    segment = seg.s
    switch (pathCommand){
      case 'A':
        let TE = transformEllipse(matrix, segment[1], segment[2], segment[3]);

        if (matrix[0] * matrix[3] - matrix[1] * matrix[2] < 0) {
          segment[5] = +segment[5] ? 0 : 1;
        }

        [x,y] = point2DLerp(matrix, seg.x, seg.y)

        if ( segment[6] === x && segment[7] === y || TE.rx < epsilon * TE.ry || TE.ry < epsilon * TE.rx ) {
          return [ 'L', x, y ];
        }
        return [ pathCommand, TE.rx, TE.ry, TE.ax, segment[4], segment[5], x, y ];

      case 'L':
      case 'H':
      case 'V':
        [lx,ly] = point2DLerp(matrix, seg.x, seg.y) // compute line coordinates without altering previous coordinates

        if ( x !== lx && y !== ly ) {
          segment = ['L',lx,ly]
        } else if (y === ly){
          segment = ['H',lx]
        } else if (x === lx){
          segment = ['V',ly]
        }

        x = lx; y = ly // now update x and y

        return segment

      default:
        for (j = 1, jj = segment.length; j < jj; j += 2) {
          [x,y] = point2DLerp(matrix, segment[j], segment[j + 1]);
          segment[j] = x;
          segment[j + 1] = y;
        }
        return segment
    }
  })

  return roundPath(transformedPath,round);
}