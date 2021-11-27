export as namespace svgpcNS;

export default SVGPathCommander;

import {default as SVGPathCommander} from './svg-path-commander';

export type pathParser = PathParser;
import PathParser from "./parser/pathParser";

export {default as CSSMatrix, PointTuple, JSONMatrix} from "dommatrix";

export type pathSegment = [string, ...number[]];
export type pathArray = pathSegment[];

export type transformObject = {
  translate: number | number[],
  rotate: number | number[],
  scale: number | number[],
  skew: number[],
  origin: number[],
};

export type shapeTypes = SVGPolylineElement | SVGPolygonElement | SVGLineElement | SVGEllipseElement | SVGCircleElement | SVGRectElement;

export type segmentLimits = {
  min : {x: number, y: number},
  max : {x: number, y: number}
};

export type lineAttr = {
  type: string | null,
  x1: number,
  y1: number,
  x2: number,
  y2: number
};
export type polyAttr = {
  type: string,
  points : string,
};
export type circleAttr = {
  type: string,
  cx: number,
  cy: number,
  r: number,
};
export type ellipseAttr = {
  type: string,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
};
export type rectAttr = {
  type: string,
  width : number,
  height : number,
  x : number,   y : number,
  rx : number, ry : number,
};
export type pathBBox = {
  width: number,
  height: number,
  x: number,   y: number,
  x2: number, y2: number,
  cx: number, cy: number,
};

export type parserParams = {
  x1: number, y1: number,
  x2: number, y2: number,
  x: number,  y: number,
  qx: number | null,
  qy: number | null,
}
