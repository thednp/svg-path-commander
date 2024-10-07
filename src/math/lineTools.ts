import midPoint from './midPoint';
import distanceSquareRoot from './distanceSquareRoot';

/**
 * Returns properties for line segments (MoveTo, LineTo).
 *
 * @param x1 the starting point X
 * @param y1 the starting point Y
 * @param x2 the ending point X
 * @param y2 the ending point Y
 * @param distance the distance to point
 * @returns the segment length, point at length and the bounding box
 */
const getSegmentProperties = (x1: number, y1: number, x2: number, y2: number, distance?: number) => {
  const { min, max } = Math;
  let point = { x: 0, y: 0 };
  const length = () => distanceSquareRoot([x1, y1], [x2, y2]);

  /* istanbul ignore else @preserve */
  if (typeof distance === 'number') {
    const currentLength = length();
    if (distance <= 0) {
      point = { x: x1, y: y1 };
    } else if (distance >= currentLength) {
      point = { x: x2, y: y2 };
    } else {
      const [x, y] = midPoint([x1, y1], [x2, y2], distance / currentLength);
      point = { x, y };
    }
  }

  return {
    point,
    get length() {
      return length();
    },
    get bbox() {
      return {
        min: {
          x: min(x1, x2),
          y: min(y1, y2),
        },
        max: {
          x: max(x1, x2),
          y: max(y1, y2),
        },
      };
    },
  };
};

export default getSegmentProperties;
