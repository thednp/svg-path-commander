import type { LineAttr, CircleAttr, PolyAttr, RectAttr, EllipseAttr, GlyphAttr, TransformObject } from './interface';

export type SpaceNumber =
  | 0x1680
  | 0x180e
  | 0x2000
  | 0x2001
  | 0x2002
  | 0x2003
  | 0x2004
  | 0x2005
  | 0x2006
  | 0x2007
  | 0x2008
  | 0x2009
  | 0x200a
  | 0x202f
  | 0x205f
  | 0x3000
  | 0xfeff
  | 0x0a
  | 0x0d
  | 0x2028
  | 0x2029
  | 0x20
  | 0x09
  | 0x0b
  | 0x0c
  | 0xa0
  | 0x1680;

export type PathCommandNumber = 0x6d | 0x7a | 0x6c | 0x68 | 0x76 | 0x63 | 0x73 | 0x71 | 0x74 | 0x61;

export type DigitNumber = 0x30 | 0x31 | 0x32 | 0x33 | 0x34 | 0x35 | 0x36 | 0x37 | 0x38 | 0x39;

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

export type AbsoluteCommand =
  | MCommand
  | LCommand
  | VCommand
  | HCommand
  | ZCommand
  | CCommand
  | SCommand
  | QCommand
  | TCommand
  | ACommand;

export type RelativeCommand =
  | mCommand
  | lCommand
  | vCommand
  | hCommand
  | zCommand
  | cCommand
  | sCommand
  | qCommand
  | tCommand
  | aCommand;

export type PathCommand = AbsoluteCommand | RelativeCommand;

export type MSegment = [MCommand, number, number];
export type mSegment = [mCommand, number, number];
export type MoveSegment = MSegment | mSegment;

export type LSegment = [LCommand, number, number];
export type lSegment = [lCommand, number, number];
export type LineSegment = LSegment | lSegment;

export type VSegment = [VCommand, number];
export type vSegment = [vCommand, number];
export type VertLineSegment = vSegment | VSegment;

export type HSegment = [HCommand, number];
export type hSegment = [hCommand, number];
export type HorLineSegment = HSegment | hSegment;

export type ZSegment = [ZCommand];
export type zSegment = [zCommand];
export type CloseSegment = ZSegment | zSegment;

export type CSegment = [CCommand, number, number, number, number, number, number];
export type cSegment = [cCommand, number, number, number, number, number, number];
export type CubicSegment = CSegment | cSegment;

export type SSegment = [SCommand, number, number, number, number];
export type sSegment = [sCommand, number, number, number, number];
export type ShortCubicSegment = SSegment | sSegment;

export type QSegment = [QCommand, number, number, number, number];
export type qSegment = [qCommand, number, number, number, number];
export type QuadSegment = QSegment | qSegment;

export type TSegment = [TCommand, number, number];
export type tSegment = [tCommand, number, number];
export type ShortQuadSegment = TSegment | tSegment;

export type ASegment = [ACommand, number, number, number, number, number, number, number];
export type aSegment = [aCommand, number, number, number, number, number, number, number];
export type ArcSegment = ASegment | aSegment;

export type PathSegment =
  | MoveSegment
  | LineSegment
  | VertLineSegment
  | HorLineSegment
  | CloseSegment
  | CubicSegment
  | ShortCubicSegment
  | QuadSegment
  | ShortQuadSegment
  | ArcSegment;

export type ShortSegment = VertLineSegment | HorLineSegment | ShortCubicSegment | ShortQuadSegment | CloseSegment;

export type AbsoluteSegment =
  | MSegment
  | LSegment
  | VSegment
  | HSegment
  | CSegment
  | SSegment
  | QSegment
  | TSegment
  | ASegment
  | ZSegment;

export type RelativeSegment =
  | mSegment
  | lSegment
  | vSegment
  | hSegment
  | cSegment
  | sSegment
  | qSegment
  | tSegment
  | aSegment
  | zSegment;

export type NormalSegment = MSegment | LSegment | CSegment | QSegment | ASegment | ZSegment;

export type PathArray = [MSegment | mSegment, ...PathSegment[]];
export type AbsoluteArray = [MSegment, ...AbsoluteSegment[]];
export type RelativeArray = [MSegment, ...RelativeSegment[]];
export type NormalArray = [MSegment, ...NormalSegment[]];
export type CurveArray = [MSegment, ...CSegment[]];
export type PolygonArray = [MSegment, ...LSegment[], ZSegment];
export type PolylineArray = [MSegment, ...LSegment[]];

export type ShapeTypes =
  | SVGPolylineElement
  | SVGPolygonElement
  | SVGLineElement
  | SVGEllipseElement
  | SVGCircleElement
  | SVGRectElement;

export type ShapeTags = 'line' | 'polyline' | 'polygon' | 'ellipse' | 'circle' | 'rect' | 'glyph';

export type ShapeOps = LineAttr | PolyAttr | PolyAttr | EllipseAttr | CircleAttr | RectAttr | GlyphAttr;

export type TransformObjectValues = Partial<TransformObject> & { origin: [number, number, number] };

export type Point = {
  x: number;
  y: number;
};

export type PointTuple = [number, number];
