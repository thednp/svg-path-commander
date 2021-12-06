// custom types
export declare type MCommand = 'M';
export declare type mCommand = 'm';

export declare type LCommand = 'L';
export declare type lCommand = 'l';

export declare type VCommand = 'V';
export declare type vCommand = 'v';

export declare type HCommand = 'H';
export declare type hCommand = 'h';

export declare type ZCommand = 'Z';
export declare type zCommand = 'z';

export declare type CCommand = 'C';
export declare type cCommand = 'c';

export declare type SCommand = 'S';
export declare type sCommand = 's';

export declare type QCommand = 'Q';
export declare type qCommand = 'q';

export declare type TCommand = 'T';
export declare type tCommand = 't';

export declare type ACommand = 'A';
export declare type aCommand = 'a';

export declare type absoluteCommand = MCommand | LCommand | VCommand | HCommand | ZCommand
  | CCommand | SCommand | QCommand | TCommand | ACommand;
export declare type relativeCommand = mCommand | lCommand | vCommand | hCommand | zCommand
  | cCommand | sCommand | qCommand | tCommand | aCommand;

export declare type pathCommand = absoluteCommand | relativeCommand;

export declare type MSegment =     [MCommand, number, number];
export declare type mSegment =     [mCommand, number, number];
export declare type moveSegment =  MSegment | mSegment;

export declare type LSegment =     [LCommand, number, number];
export declare type lSegment =     [lCommand, number, number];
export declare type lineSegment =  LSegment | lSegment;

export declare type VSegment =        [VCommand, number];
export declare type vSegment =        [vCommand, number];
export declare type vertLineSegment = vSegment | VSegment;

export declare type HSegment =        [HCommand, number];
export declare type hSegment =        [hCommand, number];
export declare type horLineSegment =  HSegment | hSegment;

export declare type ZSegment =      [ZCommand];
export declare type zSegment =      [zCommand];
export declare type closeSegment =  ZSegment | zSegment;

export declare type CSegment =      [CCommand, number, number, number, number, number, number];
export declare type cSegment =      [cCommand, number, number, number, number, number, number];
export declare type cubicSegment =  CSegment | cSegment;

export declare type SSegment =          [SCommand, number, number, number, number];
export declare type sSegment =          [sCommand, number, number, number, number];
export declare type shortCubicSegment = SSegment | sSegment;

export declare type QSegment =    [QCommand, number, number, number, number];
export declare type qSegment =    [qCommand, number, number, number, number];
export declare type quadSegment = QSegment | qSegment;

export declare type TSegment =          [TCommand, number, number];
export declare type tSegment =          [tCommand, number, number];
export declare type shortQuadSegment =  TSegment | tSegment;

export declare type ASegment =    [ACommand, number, number, number, number, number, number, number];
export declare type aSegment =    [aCommand, number, number, number, number, number, number, number];
export declare type arcSegment =  ASegment | aSegment;

export declare type pathSegment = moveSegment | lineSegment | vertLineSegment | horLineSegment | closeSegment
| cubicSegment | shortCubicSegment | quadSegment | shortQuadSegment | arcSegment;

export declare type shortSegment = vertLineSegment | horLineSegment | shortCubicSegment | shortQuadSegment | closeSegment;
export declare type absoluteSegment = MSegment | LSegment | VSegment | HSegment | CSegment | SSegment | QSegment | TSegment | ASegment | ZSegment;
export declare type relativeSegment = mSegment | lSegment | vSegment | hSegment | cSegment | sSegment | qSegment | tSegment | aSegment | zSegment;
export declare type normalSegment   = MSegment | LSegment | CSegment | QSegment | ASegment | ZSegment;

export declare type pathArray =       [MSegment, ...pathSegment[]] | [mSegment, ...pathSegment[]];
export declare type absoluteArray =   [MSegment, ...absoluteSegment[]];
export declare type relativeArray =   [MSegment, ...relativeSegment[]];
export declare type normalArray =     [MSegment, ...normalSegment[]];
export declare type curveArray =      [MSegment, ...cubicSegment[]];

// export type pathSegment = [string, ...number[]];
// export type pathArray = pathSegment[];

export declare interface options {
  /** @default 4 */
  round: boolean | number;
  /** @default [0,0,0] */
  origin: number[];
}

export declare interface pathTransformList {
  /** segment */
  s: pathSegment,
  /** pathCommand */
  c: string,
  /** x */
  x: number,
  /** y */
  y: number
}

export declare interface transformObject {
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

export declare interface lineAttr {
  type: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number
}
export declare interface polyAttr {
  type: string;
  points : string;
}
export declare interface circleAttr {
  type: string;
  cx: number;
  cy: number;
  r: number;
}
export declare interface ellipseAttr {
  type: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}
export declare interface rectAttr {
  type: string;
  width : number;
  height : number;
  x : number;   y : number;
  rx : number; ry : number;
}
export declare interface glyphAttr {
  type: string;
  d : string;
}

export declare interface pathBBox {
  width: number;
  height: number;
  x: number;   y: number;
  x2: number; y2: number;
  cx: number; cy: number;
}
export declare interface segmentLimits {
  min : {x: number; y: number};
  max : {x: number; y: number}
}

export declare interface parserParams {
  x1: number; y1: number;
  x2: number; y2: number;
  x: number;  y: number;
  qx: number | null;
  qy: number | null;
}