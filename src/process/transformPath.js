import epsilon from '../math/epsilon.js'
import normalizePath from './normalizePath.js'
import roundPath from './roundPath.js'
import clonePath from './clonePath.js'
import pathToAbsolute from '../convert/pathToAbsolute.js'
import segmentToCubic from './segmentToCubic.js'
import fixArc from '../util/fixArc.js'
import getSVGMatrix from '../util/getSVGMatrix.js'
import transformEllipse from '../util/transformEllipse.js'
import projection2d from '../util/projection2d.js'
import midPoint from '../math/midPoint.js'

export default function(pathArray,transformObject,round){

  let x, y, i, j, ii, jj, lx, ly,
      absolutePath = pathToAbsolute(pathArray),
      normalizedPath = normalizePath(absolutePath),
      matrixInstance = getSVGMatrix(transformObject),
      origin = transformObject.origin,
      matrix2d = [matrixInstance.a, matrixInstance.b, matrixInstance.c, matrixInstance.d, matrixInstance.e, matrixInstance.f],
      params = {x1: 0, y1: 0, x2: 0, y2: 0, x: 0, y: 0}, 
      segment = [], seglen = 0, pathCommand = '',
      transformedPath = [], 
      allPathCommands = [], // needed for art to curve transformation
      result = [];

  if (!matrixInstance.isIdentity) {
    for ( i=0, ii = absolutePath.length; i<ii; i++ ) {
      segment = absolutePath[i]
      absolutePath[i] && (pathCommand = segment[0])
  
      // REPLACE Arc path commands with Cubic Beziers
      // we don't have any scripting know-how on 3d ellipse transformation
      /////////////////////////////////////////// 
      allPathCommands[i] = pathCommand
      
      if (pathCommand ==='A' && !matrixInstance.is2D) {
        segment = segmentToCubic(normalizedPath[i], params)
      
        absolutePath[i] = segmentToCubic(normalizedPath[i], params)
        fixArc(absolutePath,allPathCommands,i)
      
        normalizedPath[i] = segmentToCubic(normalizedPath[i], params)
        fixArc(normalizedPath,allPathCommands,i)
        ii = Math.max(absolutePath.length,normalizedPath.length)
      }
      ///////////////////////////////////////////
  
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
  
    transformedPath = transformedPath.map(seg=>{
      pathCommand = seg.c
      segment = seg.s
      switch (pathCommand){
        case 'A': // only apply to 2D transformations
          let TE = transformEllipse(matrix2d, segment[1], segment[2], segment[3]);

          if (matrix2d[0] * matrix2d[3] - matrix2d[1] * matrix2d[2] < 0) {
            segment[5] = +segment[5] ? 0 : 1;
          }
          
          [lx,ly] = projection2d(matrixInstance, [segment[6], segment[7]], origin)
          
          if ( x === lx && y === ly || TE.rx < epsilon * TE.ry || TE.ry < epsilon * TE.rx ) {
            segment = [ 'L', lx, ly ];
          } else {
            segment = [ pathCommand, TE.rx, TE.ry, TE.ax, segment[4], segment[5], lx, ly ];
          }

          x = lx; y = ly
          return segment
  
        case 'L':
        case 'H':
        case 'V':

          [lx,ly] = projection2d(matrixInstance, [seg.x, seg.y], origin)

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
            [x,y] = projection2d(matrixInstance, [segment[j], segment[j+1]], origin) // compute line coordinates without altering previous coordinates

            segment[j] = x;
            segment[j + 1] = y;
          }
          return segment
      }
    })
    return roundPath(transformedPath,round);
  } else {
    return clonePath(absolutePath);
  }
}