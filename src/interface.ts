import type { PathSegment } from './types';

export interface SegmentProperties {
  segment: PathSegment;
  index: number;
  length: number;
  lengthAtSegment: number;
  [key: string]: any;
}

export interface PointProperties {
  closest: {
    x: number;
    y: number;
  };
  distance: number;
  segment?: SegmentProperties;
}

export interface LineAttr {
  type: 'line';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  [key: string]: string | number;
}
export interface PolyAttr {
  type: 'polygon' | 'polyline';
  points: string;
  [key: string]: string | number;
}
export interface CircleAttr {
  type: 'circle';
  cx: number;
  cy: number;
  r: number;
  [key: string]: string | number;
}
export interface EllipseAttr {
  type: 'ellipse';
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  [key: string]: string | number;
}
export interface RectAttr {
  type: 'rect';
  width: number;
  height: number;
  x: number;
  y: number;
  rx: number;
  ry: number;
  [key: string]: string | number;
}
export interface GlyphAttr {
  type: 'glyph';
  d: string;
  [key: string]: string | number;
}

export interface ShapeParams {
  line: ['x1', 'y1', 'x2', 'y2'];
  circle: ['cx', 'cy', 'r'];
  ellipse: ['cx', 'cy', 'rx', 'ry'];
  rect: ['width', 'height', 'x', 'y', 'rx', 'ry'];
  polygon: ['points'];
  polyline: ['points'];
  glyph: ['d'];
}

export interface PathBBox {
  width: number;
  height: number;
  x: number;
  y: number;
  x2: number;
  y2: number;
  cx: number;
  cy: number;
  cz: number;
}
export interface SegmentLimits {
  min: { x: number; y: number };
  max: { x: number; y: number };
}

export interface ParserParams {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x: number;
  y: number;
  qx: number | null;
  qy: number | null;
}

export interface LengthFactory {
  length: number;
  point: { x: number; y: number };
  min: { x: number; y: number };
  max: { x: number; y: number };
}

export interface Options {
  round: 'auto' | 'off' | number;
  origin: number[];
}

export interface PathTransform {
  s: PathSegment;
  c: string;
  x: number;
  y: number;
}

export interface TransformObject {
  translate: number | number[];
  rotate: number | number[];
  scale: number | number[];
  skew: number | number[];
  origin: number[];
}

export type TransformProps = keyof TransformObject;
export type TransformEntries = [TransformProps, TransformObject[TransformProps]][];
