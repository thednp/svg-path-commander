export default SVGPathCommander;
export as namespace SVGPathCommander;

// main
import {default as SVGPathCommander} from './svg-path-commander';

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

export type pathTransformList = {s: pathSegment, c: string, x: number, y: number};

export type transformObject = {
  // translate?: number | [number, number, number];
  // rotate?: number | [number, number, number];
  // scale?: number | [number, number, number];
  // skew?: number | [number, number];
  translate?: number | number[];
  rotate?: number | number[];
  scale?: number | number[];
  skew?: number | number[];
  origin: number[];
};

export type shapeTypes = SVGPolylineElement | SVGPolygonElement | SVGLineElement | SVGEllipseElement | SVGCircleElement | SVGRectElement;
export type shapeOps = lineAttr | polyAttr | ellipseAttr | circleAttr | rectAttr | glyphAttr;

export type lineAttr = {
  type: string;
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
export type glyphAttr = {
  type: string;
  d : string;
};

export type pathBBox = {
  width: number;
  height: number;
  x: number;   y: number;
  x2: number; y2: number;
  cx: number; cy: number;
};
export type segmentLimits = {
  min : {x: number; y: number};
  max : {x: number; y: number}
};

// dependency
export {default as CSSMatrix} from "dommatrix";

// UTIL
export { default as PathParser } from "./parser/pathParser";
export { default as getPathArea } from './util/getPathArea';
export { default as getPathLength } from './util/getPathLength';
export { default as getDrawDirection } from './util/getDrawDirection';
export { default as getPointAtLength } from './util/getPointAtLength';
export { default as getPathBBox } from './util/getPathBBox';
export { default as isValidPath } from './util/isValidPath';
export { default as isPathArray } from './util/isPathArray';
export { default as isAbsoluteArray } from './util/isAbsoluteArray';
export { default as isRelativeArray } from './util/isRelativeArray';
export { default as isCurveArray } from './util/isCurveArray';
export { default as isNormalizedArray } from './util/isNormalizedArray';
export { default as shapeToPath } from './util/shapeToPath';

export { default as parsePathString } from './parser/parsePathString';
export { default as clonePath } from './process/clonePath';
export { default as roundPath } from './process/roundPath';
export { default as splitPath } from './process/splitPath';
export { default as optimizePath } from './process/optimizePath';
export { default as reverseCurve } from './process/reverseCurve';
export { default as reversePath } from './process/reversePath';
export { default as normalizePath } from './process/normalizePath';
export { default as transformPath } from './process/transformPath';
export { default as getSVGMatrix } from './process/getSVGMatrix';
export { default as fixPath } from './process/fixPath';

export { default as pathToAbsolute } from './convert/pathToAbsolute';
export { default as pathToRelative } from './convert/pathToRelative';
export { default as pathToCurve } from './convert/pathToCurve';
export { default as pathToString } from './convert/pathToString';