import type { PathCommand, PathSegment } from '../types';
import roundTo from '../math/roundTo';

const roundSegment = <T extends PathSegment>(segment: T, roundOption: number) => {
  const values = (segment.slice(1) as number[]).map(n => roundTo(n, roundOption));
  return [segment[0] as PathCommand | number].concat(values) as T;
};

export default roundSegment;
