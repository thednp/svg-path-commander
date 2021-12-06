import getSegCubicLength from './getSegCubicLength';
import arcToCubic from '../process/arcToCubic';

/**
 * Returns the A (arc-to) segment length.
 *
 * @param {number[]} args the arc-to coordinates
 * @returns {number} the arc-to segment length
 */
export default function getSegArcLength(...args) {
  let [x1, y1] = args.slice(0, 2);
  // @ts-ignore -- this is an `arcSegment`
  const cubicSeg = arcToCubic(...args);
  let cumulatedLength = 0;
  let cubicSubseg = [];
  let argsc = [];

  for (let i = 0, ii = cubicSeg.length; i < ii; i += 6) {
    cubicSubseg = cubicSeg.slice(i, i + 6);
    argsc = [x1, y1, ...cubicSubseg];
    // @ts-ignore -- this is a `cubicSegment`
    cumulatedLength += getSegCubicLength(...argsc);
    [x1, y1] = cubicSubseg.slice(-2);
  }

  return cumulatedLength;
}
