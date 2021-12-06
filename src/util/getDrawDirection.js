import getPathArea from './getPathArea';
import pathToCurve from '../convert/pathToCurve';

/**
 * Check if a path is drawn clockwise and returns true if so,
 * false otherwise.
 *
 * @param {SVGPathCommander.pathArray} path the path string or `pathArray`
 * @returns {boolean} true when clockwise or false if not
 */
export default function getDrawDirection(path) {
  return getPathArea(pathToCurve(path)) >= 0;
}
