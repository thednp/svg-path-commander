export default SVGPathCommander;
export as namespace SVGPathCommander;
  
declare namespace SVGPathCommander {
  export { PathParser };
  // UTIL
  export { parsePathString };
  export { isPathArray };
  export { isCurveArray };
  export { isAbsoluteArray };
  export { isRelativeArray };
  export { isNormalizedArray };
  export { isValidPath };
  export { pathToAbsolute };
  export { pathToRelative };
  export { pathToCurve };
  export { pathToString };
  export { getDrawDirection };
  export { getPathArea };
  export { getPathBBox };
  export { getPathLength };
  export { getPointAtLength };
  export { clonePath };
  export { splitPath };
  export { roundPath };
  export { optimizePath };
  export { reverseCurve };
  export { reversePath };
  export { normalizePath };
  export { transformPath };
  export { getSVGMatrix };
  export { shapeToPath };
  export { parserParams };
  export { pathSegment };
  export { pathArray };
  export { options };
  export { transformObject };
  export { shapeTypes };
  export { segmentLimits };
  export { lineAttr };
  export { polyAttr };
  export { circleAttr };
  export { ellipseAttr };
  export { rectAttr };
  export { pathBBox };
}

// custom types
export type parserParams = {
  x1: number; y1: number;
  x2: number; y2: number;
  x: number;  y: number;
  qx: number | null;
  qy: number | null;
}
export type pathSegment = [string, ...number[]];
export type pathArray = pathSegment[];

export type options = {
  round: boolean | number | null;
  decimals: number;
  origin: [number, number];
};

export type transformObject = {
  translate: number | number[];
  rotate: number | number[];
  scale: number | number[];
  skew: number[];
  origin: number[];
};

export type shapeTypes = SVGPolylineElement | SVGPolygonElement | SVGLineElement | SVGEllipseElement | SVGCircleElement | SVGRectElement;

export type segmentLimits = {
  min : {x: number; y: number};
  max : {x: number; y: number}
};

export type lineAttr = {
  type: string | null;
  x1: number;
  y1: number;
  x2: number;
  y2: number
};
export type polyAttr = {
  type: string;
  points : string;
};
export type circleAttr = {
  type: string;
  cx: number;
  cy: number;
  r: number;
};
export type ellipseAttr = {
  type: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
};
export type rectAttr = {
  type: string;
  width : number;
  height : number;
  x : number;   y : number;
  rx : number; ry : number;
};
export type pathBBox = {
  width: number;
  height: number;
  x: number;   y: number;
  x2: number; y2: number;
  cx: number; cy: number;
};

export {default as SVGPathCommander} from './svg-path-commander';
import PathParser from "./parser/pathParser";

import getPathArea from './util/getPathArea';
import getPathLength from './util/getPathLength';
import getDrawDirection from './util/getDrawDirection';
import getPointAtLength from './util/getPointAtLength';
import getPathBBox from './util/getPathBBox';
import isValidPath from './util/isValidPath';
import isPathArray from './util/isPathArray';
import isAbsoluteArray from './util/isAbsoluteArray';
import isRelativeArray from './util/isRelativeArray';
import isCurveArray from './util/isCurveArray';
import isNormalizedArray from './util/isNormalizedArray';
import shapeToPath from './util/shapeToPath';

import parsePathString from './parser/parsePathString';
import clonePath from './process/clonePath';
import roundPath from './process/roundPath';
import splitPath from './process/splitPath';
import optimizePath from './process/optimizePath';
import reverseCurve from './process/reverseCurve';
import reversePath from './process/reversePath';
import normalizePath from './process/normalizePath';
import transformPath from './process/transformPath';
import getSVGMatrix from './process/getSVGMatrix';

import pathToAbsolute from './convert/pathToAbsolute';
import pathToRelative from './convert/pathToRelative';
import pathToCurve from './convert/pathToCurve';
import pathToString from './convert/pathToString';