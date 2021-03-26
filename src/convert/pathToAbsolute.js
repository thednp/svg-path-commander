import parsePathString from '../process/parsePathString.js';
import roundPath from '../process/roundPath.js';
import clonePath from '../process/clonePath.js';
import isAbsoluteArray from '../util/isAbsoluteArray.js';

export default function pathToAbsolute(pathInput, round) {
  if (isAbsoluteArray(pathInput)) {
    return clonePath(pathInput);
  }

  const pathArray = parsePathString(pathInput, round);
  const ii = pathArray.length;
  const resultArray = [];
  let x = 0;
  let y = 0;
  let mx = 0;
  let my = 0;
  let start = 0;

  if (pathArray[0][0] === 'M') {
    x = +pathArray[0][1];
    y = +pathArray[0][2];
    mx = x;
    my = y;
    start += 1;
    resultArray.push(['M', x, y]);
  }

  for (let i = start; i < ii; i += 1) {
    const segment = pathArray[i];
    const [pathCommand] = segment;
    const absCommand = pathCommand.toUpperCase();
    const absoluteSegment = [];
    let newSeg = [];
    resultArray.push(absoluteSegment);

    if (pathCommand !== absCommand) {
      absoluteSegment[0] = absCommand;

      switch (absCommand) {
        case 'A':
          newSeg = segment.slice(1, -2).concat([+segment[6] + x, +segment[7] + y]);
          for (let j = 0; j < newSeg.length; j += 1) {
            absoluteSegment.push(newSeg[j]);
          }
          break;
        case 'V':
          absoluteSegment[1] = +segment[1] + y;
          break;
        case 'H':
          absoluteSegment[1] = +segment[1] + x;
          break;
        default:
          if (absCommand === 'M') {
            mx = +segment[1] + x;
            my = +segment[2] + y;
          }
          // for is here to stay for eslint
          for (let j = 1; j < segment.length; j += 1) {
            absoluteSegment.push(+segment[j] + (j % 2 ? x : y));
          }
      }
    } else {
      for (let j = 0; j < segment.length; j += 1) {
        absoluteSegment.push(segment[j]);
      }
    }

    const segLength = absoluteSegment.length;
    switch (absCommand) {
      case 'Z':
        x = mx;
        y = my;
        break;
      case 'H':
        x = +absoluteSegment[1];
        break;
      case 'V':
        y = +absoluteSegment[1];
        break;
      default:
        x = +absoluteSegment[segLength - 2];
        y = +absoluteSegment[segLength - 1];

        if (absCommand === 'M') {
          mx = x;
          my = y;
        }
    }
  }

  return roundPath(resultArray, round);
}
