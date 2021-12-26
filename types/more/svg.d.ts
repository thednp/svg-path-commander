// custom types
export type MCommand = 'M';
export type mCommand = 'm';

export type LCommand = 'L';
export type lCommand = 'l';

export type VCommand = 'V';
export type vCommand = 'v';

export type HCommand = 'H';
export type hCommand = 'h';

export type ZCommand = 'Z';
export type zCommand = 'z';

export type CCommand = 'C';
export type cCommand = 'c';

export type SCommand = 'S';
export type sCommand = 's';

export type QCommand = 'Q';
export type qCommand = 'q';

export type TCommand = 'T';
export type tCommand = 't';

export type ACommand = 'A';
export type aCommand = 'a';

export type absoluteCommand = MCommand | LCommand | VCommand | HCommand | ZCommand
  | CCommand | SCommand | QCommand | TCommand | ACommand;
export type relativeCommand = mCommand | lCommand | vCommand | hCommand | zCommand
  | cCommand | sCommand | qCommand | tCommand | aCommand;

export type pathCommand = absoluteCommand | relativeCommand;

export type MSegment =     [MCommand, number, number];
export type mSegment =     [mCommand, number, number];
export type moveSegment =  MSegment | mSegment;

export type LSegment =     [LCommand, number, number];
export type lSegment =     [lCommand, number, number];
export type lineSegment =  LSegment | lSegment;

export type VSegment =        [VCommand, number];
export type vSegment =        [vCommand, number];
export type vertLineSegment = vSegment | VSegment;

export type HSegment =        [HCommand, number];
export type hSegment =        [hCommand, number];
export type horLineSegment =  HSegment | hSegment;

export type ZSegment =      [ZCommand];
export type zSegment =      [zCommand];
export type closeSegment =  ZSegment | zSegment;

export type CSegment =      [CCommand, number, number, number, number, number, number];
export type cSegment =      [cCommand, number, number, number, number, number, number];
export type cubicSegment =  CSegment | cSegment;

export type SSegment =          [SCommand, number, number, number, number];
export type sSegment =          [sCommand, number, number, number, number];
export type shortCubicSegment = SSegment | sSegment;

export type QSegment =    [QCommand, number, number, number, number];
export type qSegment =    [qCommand, number, number, number, number];
export type quadSegment = QSegment | qSegment;

export type TSegment =          [TCommand, number, number];
export type tSegment =          [tCommand, number, number];
export type shortQuadSegment =  TSegment | tSegment;

export type ASegment =    [ACommand, number, number, number, number, number, number, number];
export type aSegment =    [aCommand, number, number, number, number, number, number, number];
export type arcSegment =  ASegment | aSegment;

export type pathSegment = moveSegment | lineSegment | vertLineSegment | horLineSegment | closeSegment
| cubicSegment | shortCubicSegment | quadSegment | shortQuadSegment | arcSegment;

export interface segmentProperties {
  /** the segment */
  segment: pathSegment,
  /** the segment index */
  index: number,
  /** the segment length */
  length: number;
  /** the length including the segment length */
  lengthAtSegment: number,
  [key: string]: any
}

export type shortSegment = vertLineSegment | horLineSegment | shortCubicSegment | shortQuadSegment | closeSegment;
export type absoluteSegment = MSegment | LSegment | VSegment | HSegment | CSegment | SSegment | QSegment | TSegment | ASegment | ZSegment;
export type relativeSegment = mSegment | lSegment | vSegment | hSegment | cSegment | sSegment | qSegment | tSegment | aSegment | zSegment;
export type normalSegment   = MSegment | LSegment | CSegment | QSegment | ASegment | ZSegment;

export type pathArray =       [(MSegment | mSegment), ...pathSegment[]];
export type absoluteArray =   [MSegment, ...absoluteSegment[]];
export type relativeArray =   [MSegment, ...relativeSegment[]];
export type normalArray =     [MSegment, ...normalSegment[]];
export type curveArray =      [MSegment, ...CSegment[]];
export type polygonArray =    [MSegment, ...LSegment[], ZSegment];
export type polylineArray =   [MSegment, ...LSegment[]];

export interface options {
  /** @default 4 */
  round: boolean | number;
  /** @default [0,0,0] */
  origin: number[];
}

export interface pathTransformList {
  /** segment */
  s: pathSegment,
  /** pathCommand */
  c: string,
  /** x */
  x: number,
  /** y */
  y: number
}

export interface transformObject {
  // translate?: number | [number, number, number];
  // rotate?: number | [number, number, number];
  // scale?: number | [number, number, number];
  // skew?: number | [number, number];
  translate?: number | number[];
  rotate?: number | number[];
  scale?: number | number[];
  skew?: number | number[];
  origin: number[];
}

export type shapeTypes = SVGPolylineElement | SVGPolygonElement | SVGLineElement | SVGEllipseElement | SVGCircleElement | SVGRectElement;
export type shapeOps = lineAttr | polyAttr | ellipseAttr | circleAttr | rectAttr | glyphAttr;

export interface lineAttr {
  type: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number
}
export interface polyAttr {
  type: string;
  points : string;
}
export interface circleAttr {
  type: string;
  cx: number;
  cy: number;
  r: number;
}
export interface ellipseAttr {
  type: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}
export interface rectAttr {
  type: string;
  width : number;
  height : number;
  x : number;   y : number;
  rx : number; ry : number;
}
export interface glyphAttr {
  type: string;
  d : string;
}

export interface pathBBox {
  width: number;
  height: number;
  x: number;   y: number;
  x2: number; y2: number;
  cx: number; cy: number; cz: number;
}
export interface segmentLimits {
  min : {x: number; y: number};
  max : {x: number; y: number}
}

export interface parserParams {
  x1: number; y1: number;
  x2: number; y2: number;
  x: number;  y: number;
  qx: number | null;
  qy: number | null;
}

export interface pointProperties {
  closest: {
    x: number,
    y: number,
  }
  distance: number,
  segment?: segmentProperties,
}