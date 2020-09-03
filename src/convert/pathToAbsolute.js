import parsePathString from '../process/parsePathString.js'
import roundPath from '../process/roundPath.js'
import clonePath from '../process/clonePath.js'
import catmullRom2bezier from '../process/catmullRom2bezier.js'
import ellipseToArc from '../process/ellipseToArc.js'
import isAbsoluteArray from '../util/isAbsoluteArray.js'

export default function(pathArray) {
  if (isAbsoluteArray(pathArray)) {
    return clonePath(pathArray)
  }
  pathArray = parsePathString(pathArray)

  let resultArray = [], 
      x = 0, y = 0, mx = 0, my = 0, 
      start = 0, ii = pathArray.length,
      pathCommand = '', segment = [], 
      absoluteSegment = [], segmentCoordinates = [],
      crz = pathArray.length === 3 &&
            pathArray[0][0] === "M" &&
            pathArray[1][0].toUpperCase() === "R" &&
            pathArray[2][0].toUpperCase() === "Z";

  if (pathArray[0][0] === "M") {
    x = +pathArray[0][1];
    y = +pathArray[0][2];
    mx = x;
    my = y;
    start++;
    resultArray[0] = ["M", x, y];
  }

  for (let i = start; i < ii; i++) {
    segment = pathArray[i]
    pathCommand = segment[0]
    segmentCoordinates = []

    resultArray.push(absoluteSegment = []);

    if (pathCommand !== pathCommand.toUpperCase()) {
      absoluteSegment[0] = pathCommand.toUpperCase();
      switch (absoluteSegment[0]) {
        case "A":
          absoluteSegment[1] = segment[1];
          absoluteSegment[2] = segment[2];
          absoluteSegment[3] = segment[3];
          absoluteSegment[4] = segment[4];
          absoluteSegment[5] = segment[5];
          absoluteSegment[6] = +segment[6] + x;
          absoluteSegment[7] = +segment[7] + y;
          break;
        case "V":
          absoluteSegment[1] = +segment[1] + y;
          break;
        case "H":
          absoluteSegment[1] = +segment[1] + x;
          break;
        case "R":
          segmentCoordinates = [x, y].concat(segment.slice(1));
          for (let j = 2, jj = segmentCoordinates.length; j < jj; j++) {
            segmentCoordinates[j] = +segmentCoordinates[j] + x;
            segmentCoordinates[++j] = +segmentCoordinates[j] + y;
          }
          resultArray.pop();
          resultArray = resultArray.concat(catmullRom2bezier(segmentCoordinates, crz));
          break;
        case "O":
          resultArray.pop();
          segmentCoordinates = ellipseToArc(x, y, +segment[1], +segment[2]);
          segmentCoordinates.push(segmentCoordinates[0]);
          resultArray = resultArray.concat(segmentCoordinates);
          break;
        case "U":
          resultArray.pop();
          resultArray = resultArray.concat(ellipseToArc(x, y, segment[1], segment[2], segment[3]));
          absoluteSegment = ["U"].concat(resultArray[resultArray.length - 1].slice(-2));
          break;
        case "M":
          mx = +segment[1] + x;
          my = +segment[2] + y;
        default:
          for (let k = 1, kk = segment.length; k < kk; k++) {
            absoluteSegment[k] = +segment[k] + ((k % 2) ? x : y);
          }
      }
    } else if (pathCommand === "R") {
      segmentCoordinates = [x, y].concat(segment.slice(1));
      resultArray.pop();
      resultArray = resultArray.concat(catmullRom2bezier(segmentCoordinates, crz));
      absoluteSegment = ["R"].concat(segment.slice(-2));
    } else if (pathCommand === "O") {
      resultArray.pop();
      segmentCoordinates = ellipseToArc(x, y, +segment[1], +segment[2]);
      segmentCoordinates.push(segmentCoordinates[0]);
      resultArray = resultArray.concat(segmentCoordinates);
    } else if (pathCommand === "U") {
      resultArray.pop();
      resultArray = resultArray.concat(ellipseToArc(x, y, +segment[1], +segment[2], +segment[3]));
      absoluteSegment = ["U"].concat(resultArray[resultArray.length - 1].slice(-2));
    } else {
      segment.map(k=>absoluteSegment.push(k))
    }
    pathCommand = pathCommand.toUpperCase();
    if (pathCommand !== "O") {
      switch (absoluteSegment[0]) {
        case "Z":
          x = mx;
          y = my;
          break;
        case "H":
          x = +absoluteSegment[1];
          break;
        case "V":
          y = +absoluteSegment[1];
          break;
        case "M":
          mx = +absoluteSegment[absoluteSegment.length - 2];
          my = +absoluteSegment[absoluteSegment.length - 1];
        default:
          x = +absoluteSegment[absoluteSegment.length - 2];
          y = +absoluteSegment[absoluteSegment.length - 1];
      }
    }
  }
  return roundPath(resultArray)
}