import getSegCubicLength from './getSegCubicLength';
import arcToCubic from '../process/arcToCubic';

/**
 * Returns the A (arc-to) segment length.
 *
 * @param {number[]} arguments the arc-to coordinates
 * @returns {number} the arc-to segment length
 */
export default function getSegArcLength() {
  const args = arguments.slice();
  let [x1, y1] = args.slice(0, 2);
  // const cubicSeg = arcToCubic.apply(0, args);
  const cubicSeg = arcToCubic(...args);
  let cumulatedLength = 0;
  let cubicSubseg = [];
  let argsc = [];

  for (let i = 0, ii = cubicSeg.length; i < ii; i += 6) {
    cubicSubseg = cubicSeg.slice(i, i + 6);
    argsc = [x1, y1, ...cubicSubseg];
    // cumulatedLength += getSegCubicLength.apply(0, [x1, y1].concat(cubicSubseg));
    cumulatedLength += getSegCubicLength(...argsc);
    [x1, y1] = cubicSubseg.slice(-2);
  }

  return cumulatedLength;
}