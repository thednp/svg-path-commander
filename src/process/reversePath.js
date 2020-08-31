import pathToAbsolute from '../convert/pathToAbsolute.js';

export default function(pathString){ // pathArray | pathString
  let absolutePath = pathToAbsolute(pathString),
      isClosed = absolutePath.slice(-1)[0][0] === 'Z',
      pathCommand, pLen, 
      x = 0, y = 0,
      reversedPath;

  reversedPath = absolutePath.map((seg,i,pathArray)=>{
    pLen = pathArray.length
    pathCommand = seg[0]

    switch(pathCommand){
      case 'M':
        x = seg[1]
        y = seg[2]
        break
      case 'Z':
        x = pathArray[0][1]
        y = pathArray[0][2]
        break
      case 'V':
        x = x
        y = seg[1]
        break
      case 'H':
        x = seg[1]
        y = y 
        break
      default:
        x = seg[seg.length - 2]
        y = seg[seg.length - 1]
    }

    return {
      c: pathCommand, 
      x: x,
      y: y,
      seg: seg
    }
  })
  .map((seg,i,pathArray)=>{
    let x1 = 0, y1 = 0, x2 = 0, y2 = 0,
        xAxisRotation, largeArcFlag, sweepFlag,
        segment = seg.seg,
        result = []

    pLen = pathArray.length
    pathCommand = seg.c,

    x = i ? pathArray[i-1].x : pathArray[pLen-1].x
    y = i ? pathArray[i-1].y : pathArray[pLen-1].y

    switch(pathCommand){
      case 'M':
        result = isClosed ? ['Z'] : [pathCommand,x,y]
        break
      case 'A': // rx ry x-axis-rotation large-arc-flag sweep-flag x y
        x1 = segment[1]
        y1 = segment[2]
        xAxisRotation = segment[3]
        largeArcFlag = segment[4]
        sweepFlag = segment[5] === 1 ? 0 : 1
        result = [pathCommand, x1,y1, xAxisRotation,largeArcFlag,sweepFlag, x,y]
        break
      case 'C':
        x1 = segment[3]
        y1 = segment[4]
        x2 = segment[1]
        y2 = segment[2]
        result = [pathCommand, x1,y1, x2,y2, x,y]
        break
      case 'Z':
        result = ['M',x,y]
        break
      case 'H':
        result = [pathCommand,x]
        break
      case 'V':
        result = [pathCommand,y]
        break
      default:
        result = segment.slice(0,-2).concat([x,y])
    }
    return result
  })
  return isClosed ? reversedPath.reverse() : [reversedPath[0]].concat(reversedPath.slice(1).reverse())
}