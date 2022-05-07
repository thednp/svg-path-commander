import parsePathString from '../parser/parsePathString';
import getTotalLength from './getTotalLength';

/**
 * Returns the segment, its index and length as well as
 * the length to that segment at a given length in a path.
 *
 * @param {string | SVGPath.pathArray} pathInput target `pathArray`
 * @param {number=} distance the given length
 * @returns {SVGPath.segmentProperties=} the requested properties
 */
export default function getPropertiesAtLength(pathInput, distance) {
  const pathArray = parsePathString(pathInput);

  if (typeof pathArray === 'string') {
    throw TypeError(pathArray);
  }

  let pathTemp = [...pathArray];
  let pathLength = getTotalLength(pathTemp);
  let index = pathTemp.length - 1;
  let lengthAtSegment = 0;
  let length = 0;
  let segment = pathArray[0];
  const [x, y] = segment.slice(-2);
  const point = { x, y };

  // If the path is empty, return 0.
  if (index <= 0 || !distance || !Number.isFinite(distance)) {
    return {
      segment, index: 0, length, point, lengthAtSegment,
    };
  }

  if (distance >= pathLength) {
    pathTemp = pathArray.slice(0, -1);
    lengthAtSegment = getTotalLength(pathTemp);
    length = pathLength - lengthAtSegment;
    return {
      segment: pathArray[index], index, length, lengthAtSegment,
    };
  }

  const segments = [];
  while (index > 0) {
    segment = pathTemp[index];
    pathTemp = pathTemp.slice(0, -1);
    lengthAtSegment = getTotalLength(pathTemp);
    length = pathLength - lengthAtSegment;
    pathLength = lengthAtSegment;
    segments.push({
      segment, index, length, lengthAtSegment,
    });
    index -= 1;
  }

  return segments.find(({ lengthAtSegment: l }) => l <= distance);
}
