import type { PathArray, PathSegment } from '../types';
import type { SegmentProperties } from '../interface';
import parsePathString from '../parser/parsePathString';
import getTotalLength from './getTotalLength';

/**
 * Returns the segment, its index and length as well as
 * the length to that segment at a given length in a path.
 *
 * @param pathInput target `pathArray`
 * @param distance the given length
 * @returns the requested properties
 */
const getPropertiesAtLength = (pathInput: string | PathArray, distance?: number): SegmentProperties => {
  const pathArray = parsePathString(pathInput);

  let pathTemp = pathArray.slice(0) as PathArray;
  let pathLength = getTotalLength(pathTemp);
  let index = pathTemp.length - 1;
  let lengthAtSegment = 0;
  let length = 0;
  let segment = pathArray[0] as PathSegment;
  const [x, y] = segment.slice(-2) as [number, number];
  const point = { x, y };

  // If the path is empty, return 0.
  if (index <= 0 || !distance || !Number.isFinite(distance)) {
    return {
      segment,
      index: 0,
      length,
      point,
      lengthAtSegment,
    };
  }

  if (distance >= pathLength) {
    pathTemp = pathArray.slice(0, -1) as PathArray;
    lengthAtSegment = getTotalLength(pathTemp);
    length = pathLength - lengthAtSegment;
    return {
      segment: pathArray[index],
      index,
      length,
      lengthAtSegment,
    };
  }

  const segments = [] as SegmentProperties[];
  while (index > 0) {
    segment = pathTemp[index];
    pathTemp = pathTemp.slice(0, -1) as PathArray;
    lengthAtSegment = getTotalLength(pathTemp);
    length = pathLength - lengthAtSegment;
    pathLength = lengthAtSegment;
    segments.push({
      segment,
      index,
      length,
      lengthAtSegment,
    });
    index -= 1;
  }

  return segments.find(({ lengthAtSegment: l }) => l <= distance) as SegmentProperties;
};

export default getPropertiesAtLength;
