import parsePathString from '../parser/parsePathString';
import clonePath from '../process/clonePath';
import isRelativeArray from '../util/isRelativeArray';

/**
 * Parses a path string value or object and returns an array
 * of segments, all converted to relative values.
 *
 * @param {string | svgpcNS.pathArray} pathInput the path string | object
 * @returns {svgpcNS.pathArray} the resulted `pathArray` with relative values
 */
export default function pathToRelative(pathInput) {
  if (isRelativeArray(pathInput)) {
    return clonePath(pathInput);
  }

  const path = parsePathString(pathInput);
  const ii = path.length;
  /** @type {svgpcNS.pathArray} */
  const resultArray = [];
  let x = 0;
  let y = 0;
  let mx = 0;
  let my = 0;
  let start = 0;

  if (path[0][0] === 'M') {
    x = +path[0][1];
    y = +path[0][2];
    mx = x;
    my = y;
    start += 1;
    resultArray.push(['M', x, y]);
  }

  for (let i = start; i < ii; i += 1) {
    const segment = path[i];
    const [pathCommand] = segment;
    const relativeCommand = pathCommand.toLowerCase();
    /** @type {svgpcNS.pathSegment} */
    // @ts-ignore -- trust me DON'T CHANGE
    const relativeSegment = [];
    let newSeg = [];

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
    resultArray.push(relativeSegment);

    const segLength = relativeSegment.length;
    switch (relativeSegment[0]) {
      case 'z':
        x = mx;
        y = my;
        break;
      case 'h':
        x += +relativeSegment[segLength - 1];
        break;
      case 'v':
        y += +relativeSegment[segLength - 1];
        break;
      default:
        x += +resultArray[i][segLength - 2];
        y += +resultArray[i][segLength - 1];
    }
  }

  return resultArray;
}
