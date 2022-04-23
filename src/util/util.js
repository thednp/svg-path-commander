import CSSMatrix from 'dommatrix';
import defaultOptions from '../options/options';
import getPathBBox from './getPathBBox';
import getPathArea from './getPathArea';
import getTotalLength from './getTotalLength';
import getDrawDirection from './getDrawDirection';
import getPointAtLength from './getPointAtLength';
import pathLengthFactory from './pathLengthFactory';

import getPropertiesAtLength from './getPropertiesAtLength';
import getPropertiesAtPoint from './getPropertiesAtPoint';
import getClosestPoint from './getClosestPoint';
import getSegmentOfPoint from './getSegmentOfPoint';
import getSegmentAtLength from './getSegmentAtLength';
import isPointInStroke from './isPointInStroke';

import isValidPath from './isValidPath';
import isPathArray from './isPathArray';
import isAbsoluteArray from './isAbsoluteArray';
import isRelativeArray from './isRelativeArray';
import isCurveArray from './isCurveArray';
import isNormalizedArray from './isNormalizedArray';
import shapeToPath from './shapeToPath';

import parsePathString from '../parser/parsePathString';
import clonePath from '../process/clonePath';
import roundPath from '../process/roundPath';
import splitPath from '../process/splitPath';
import optimizePath from '../process/optimizePath';
import reverseCurve from '../process/reverseCurve';
import reversePath from '../process/reversePath';
import normalizePath from '../process/normalizePath';
import transformPath from '../process/transformPath';
import fixPath from '../process/fixPath';

import pathToAbsolute from '../convert/pathToAbsolute';
import pathToRelative from '../convert/pathToRelative';
import pathToCurve from '../convert/pathToCurve';
import pathToString from '../convert/pathToString';

/**
 * @interface
 */
const Util = {
  CSSMatrix,
  parsePathString,
  isPathArray,
  isCurveArray,
  isAbsoluteArray,
  isRelativeArray,
  isNormalizedArray,
  isValidPath,
  pathToAbsolute,
  pathToRelative,
  pathToCurve,
  pathToString,
  getDrawDirection,
  getPathArea,
  getPathBBox,
  pathLengthFactory,
  getTotalLength,
  getPointAtLength,
  getClosestPoint,
  getSegmentOfPoint,
  getPropertiesAtPoint,
  getPropertiesAtLength,
  getSegmentAtLength,
  isPointInStroke,
  clonePath,
  splitPath,
  fixPath,
  roundPath,
  optimizePath,
  reverseCurve,
  reversePath,
  normalizePath,
  transformPath,
  shapeToPath,
  options: defaultOptions,
};

export default Util;
