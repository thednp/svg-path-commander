import parsePathString from '../parser/parsePathString';
import getTotalLength from './getTotalLength';

/**
 * Returns the segment, its index and length as well as
 * the length to that segment at a given length in a path.
 *
 * @param {string | SVGPathCommander.pathArray} pathInput target `pathArray`
 * @param {number=} distance the given length
 * @returns {SVGPathCommander.segmentProperties=} the requested properties
 */
export default function getPropertiesAtLength(pathInput, distance) {
  const pathArray = parsePathString(pathInput);
  const segments = [];

  let pathTemp = [...pathArray];
  // @ts-ignore
  let pathLength = getTotalLength(pathTemp);
  let index = pathTemp.length - 1;
  let lengthAtSegment = 0;
  let length = 0;
  /** @type {SVGPathCommander.pathSegment} */
  let segment = pathArray[0];
  const [x, y] = segment.slice(-2);
  const point = { x, y };

  // If the path is empty, return 0.
  if (index <= 0 || !distance || !Number.isFinite(distance)) {
    return {
      // @ts-ignore
      segment, index: 0, length, point, lengthAtSegment,
    };
  }

  if (distance >= pathLength) {
    pathTemp = pathArray.slice(0, -1);
    // @ts-ignore
    lengthAtSegment = getTotalLength(pathTemp);
    // @ts-ignore
    length = pathLength - lengthAtSegment;
    return {
      // @ts-ignore
      segment: pathArray[index], index, length, lengthAtSegment,
    };
  }

  while (index > 0) {
    segment = pathTemp[index];
    pathTemp = pathTemp.slice(0, -1);
    // @ts-ignore -- `pathTemp` === `pathSegment[]` === `pathArray`
    lengthAtSegment = getTotalLength(pathTemp);
    // @ts-ignore
    length = pathLength - lengthAtSegment;
    pathLength = lengthAtSegment;
    segments.push({
      segment, index, length, lengthAtSegment,
    });
    index -= 1;
  }

  // @ts-ignore
  return segments.find(({ lengthAtSegment: l }) => l <= distance);
}
