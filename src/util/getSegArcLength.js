import getSegCubicLength from './getSegCubicLength';
import arcToCubic from '../process/arcToCubic';

/**
 * Returns the A (arc-to) segment length.
 *
 * @param {Number[]} arguments the arc-to coordinates
 * @returns {Number} the arc-to segment length
 */
export default function getSegArcLength() {
  const args = arguments.slice();
  let [x1, y1] = args.slice(0, 2);
  const cubicSeg = arcToCubic.apply(0, args);
  let cumulatedLength = 0;
  let cubicSubseg = [];

  for (let i = 0, ii = cubicSeg.length; i < ii; i += 6) {
    cubicSubseg = cubicSeg.slice(i, i + 6);
    cumulatedLength += getSegCubicLength.apply(0, [x1, y1].concat(cubicSubseg));
    [x1, y1] = cubicSubseg.slice(-2);
  }

  return cumulatedLength;
}
