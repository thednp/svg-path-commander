// SVGPathCommander Global Types
import SVGPathArray from "../src/parser/svgPathArray";

export type pathSegment = [string, ...number[]];

export type pathArray = pathSegment[];

export type transformObject = {
  translate: number | number[] | null,
  rotate: number | number[] | null,
  scale: number | number[] | null,
  skew: number[] | null,
  origin: number[] | null,
};

export type shapeTypes = SVGPolylineElement | SVGPolygonElement | SVGLineElement | SVGEllipseElement | SVGCircleElement | SVGRectElement;

export type parserPathArray = SVGPathArray;

export type segmentLimits = {
  min : {x: number, y: number},
  max : {x: number, y: number}
};

export type lineAttr = {
  type: string | null,
  x1 : number,
  y1 : number,
  x2 : number,
  y2 : number
};
export type polyAttr = {
  type: string,
  points : string,
};
export type circleAttr = {
  type: string,
  cx : number,
  cy : number,
  r : number,
};
export type ellipseAttr = {
  type: string,
  cx : number,
  cy : number,
  rx : number,
  ry : number,
};
export type rectAttr = {
  type: string,
  width : number,
  height : number,
  x : number,
  y : number,
  rx : number,
  ry : number,
};
export type pathBBox = {
  width : number,
  height : number,
  x : number,
  y : number,
  x1 : number,
  y1 : number,
  cx : number,
  cy : number,
};

export as namespace SVGPC;