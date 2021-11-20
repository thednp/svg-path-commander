import parsePathString from '../process/parsePathString.js';
import clonePath from '../process/clonePath.js';
import isRelativeArray from '../util/isRelativeArray.js';

export default function pathToRelative(pathInput) {
  if (isRelativeArray(pathInput)) {
    return clonePath(pathInput);
  }

  const pathArray = parsePathString(pathInput);
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
    const relativeCommand = pathCommand.toLowerCase();
    const relativeSegment = [];
    let newSeg = [];
    resultArray.push(relativeSegment);

    if (pathCommand !== relativeCommand) {
      relativeSegment[0] = relativeCommand;
      switch (relativeCommand) {
        case 'a':
          newSeg = segment.slice(1, -2).concat([+segment[6] - x, +segment[7] - y]);

          for (let j = 0; j < newSeg.length; j += 1) {
            relativeSegment.push(newSeg[j]);
          }
          break;
        case 'v':
          relativeSegment[1] = +segment[1] - y;
          break;
        default:
          // for is here to stay for eslint
          for (let j = 1; j < segment.length; j += 1) {
            relativeSegment.push(+segment[j] - (j % 2 ? x : y));
          }

          if (relativeCommand === 'm') {
            mx = +segment[1];
            my = +segment[2];
          }
      }
    } else {
      if (pathCommand === 'm') {
        mx = +segment[1] + x;
        my = +segment[2] + y;
      }
      for (let j = 0; j < segment.length; j += 1) {
        relativeSegment.push(segment[j]);
      }
    }

    const segLength = relativeSegment.length;
    switch (relativeSegment[0]) {
      case 'z':
        x = mx;
        y = my;
        break;
      case 'h':
        x += relativeSegment[segLength - 1];
        break;
      case 'v':
        y += relativeSegment[segLength - 1];
        break;
      default:
        x += resultArray[i][segLength - 2];
        y += resultArray[i][segLength - 1];
    }
  }

  return resultArray;
}
