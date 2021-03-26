import getPathArea from './getPathArea.js';
import pathToCurve from '../convert/pathToCurve.js';

export default function getDrawDirection(pathArray, round) {
  return getPathArea(pathToCurve(pathArray, round)) >= 0;
}
