/*!
* SVGPathCommander INTERSECT v2.3.6 (http://thednp.github.io/svg-path-commander)
* Copyright 2026 © thednp
* Licensed under MIT (https://github.com/thednp/svg-path-commander/blob/master/LICENSE)
*/
/** The absolute moveto command letter. */
type MCommand = "M";
/** The relative moveto command letter. */
type mCommand = "m";
/** The absolute lineto command letter. */
type LCommand = "L";
/** The relative lineto command letter. */
type lCommand = "l";
/** The absolute vertical lineto command letter. */
type VCommand = "V";
/** The relative vertical lineto command letter. */
type vCommand = "v";
/** The absolute horizontal lineto command letter. */
type HCommand = "H";
/** The relative horizontal lineto command letter. */
type hCommand = "h";
/** The absolute closepath command letter. */
type ZCommand = "Z";
/** The relative closepath command letter. */
type zCommand = "z";
/** The absolute cubic Bezier command letter. */
type CCommand = "C";
/** The relative cubic Bezier command letter. */
type cCommand = "c";
/** The absolute smooth cubic Bezier command letter. */
type SCommand = "S";
/** The relative smooth cubic Bezier command letter. */
type sCommand = "s";
/** The absolute quadratic Bezier command letter. */
type QCommand = "Q";
/** The relative quadratic Bezier command letter. */
type qCommand = "q";
/** The absolute smooth quadratic Bezier command letter. */
type TCommand = "T";
/** The relative smooth quadratic Bezier command letter. */
type tCommand = "t";
/** The absolute elliptical arc command letter. */
type ACommand = "A";
/** The relative elliptical arc command letter. */
type aCommand = "a";
/** The absolute moveto segment tuple `[M, x, y]`. */
type MSegment = [MCommand, number, number];
/** The relative moveto segment tuple `[m, dx, dy]`. */
type mSegment = [mCommand, number, number];
/** The moveto segment, absolute or relative. */
type MoveSegment = MSegment | mSegment;
/** The absolute lineto segment tuple `[L, x, y]`. */
type LSegment = [LCommand, number, number];
/** The relative lineto segment tuple `[l, dx, dy]`. */
type lSegment = [lCommand, number, number];
/** The lineto segment, absolute or relative. */
type LineSegment = LSegment | lSegment;
/** The absolute vertical lineto segment tuple `[V, y]`. */
type VSegment = [VCommand, number];
/** The relative vertical lineto segment tuple `[v, dy]`. */
type vSegment = [vCommand, number];
/** The vertical lineto segment, absolute or relative. */
type VertLineSegment = vSegment | VSegment;
/** The absolute horizontal lineto segment tuple `[H, x]`. */
type HSegment = [HCommand, number];
/** The relative horizontal lineto segment tuple `[h, dx]`. */
type hSegment = [hCommand, number];
/** The horizontal lineto segment, absolute or relative. */
type HorLineSegment = HSegment | hSegment;
/** The absolute closepath segment tuple `[Z]`. */
type ZSegment = [ZCommand];
/** The relative closepath segment tuple `[z]`. */
type zSegment = [zCommand];
/** The closepath segment, absolute or relative. */
type CloseSegment = ZSegment | zSegment;
/** The absolute cubic Bezier segment tuple `[C, x1, y1, x2, y2, x, y]`. */
type CSegment = [CCommand, number, number, number, number, number, number];
/** The relative cubic Bezier segment tuple `[c, dx1, dy1, dx2, dy2, dx, dy]`. */
type cSegment = [cCommand, number, number, number, number, number, number];
/** The cubic Bezier segment, absolute or relative. */
type CubicSegment = CSegment | cSegment;
/** The absolute smooth cubic Bezier segment tuple `[S, x2, y2, x, y]`. */
type SSegment = [SCommand, number, number, number, number];
/** The relative smooth cubic Bezier segment tuple `[s, dx2, dy2, dx, dy]`. */
type sSegment = [sCommand, number, number, number, number];
/** The smooth cubic Bezier segment, absolute or relative. */
type ShortCubicSegment = SSegment | sSegment;
/** The absolute quadratic Bezier segment tuple `[Q, x1, y1, x, y]`. */
type QSegment = [QCommand, number, number, number, number];
/** The relative quadratic Bezier segment tuple `[q, dx1, dy1, dx, dy]`. */
type qSegment = [qCommand, number, number, number, number];
/** The quadratic Bezier segment, absolute or relative. */
type QuadSegment = QSegment | qSegment;
/** The absolute smooth quadratic Bezier segment tuple `[T, x, y]`. */
type TSegment = [TCommand, number, number];
/** The relative smooth quadratic Bezier segment tuple `[t, dx, dy]`. */
type tSegment = [tCommand, number, number];
/** The smooth quadratic Bezier segment, absolute or relative. */
type ShortQuadSegment = TSegment | tSegment;
/** The absolute elliptical arc segment tuple `[A, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, x, y]`. */
type ASegment = [ACommand, number, number, number, number, number, number, number];
/** The relative elliptical arc segment tuple `[a, rx, ry, xAxisRotation, largeArcFlag, sweepFlag, dx, dy]`. */
type aSegment = [aCommand, number, number, number, number, number, number, number];
/** The elliptical arc segment, absolute or relative. */
type ArcSegment = ASegment | aSegment;
/** Any SVG path command segment. */
type PathSegment = MoveSegment | LineSegment | VertLineSegment | HorLineSegment | CloseSegment | CubicSegment | ShortCubicSegment | QuadSegment | ShortQuadSegment | ArcSegment;
/** A parsed SVG path string as an array of path segments. */
type PathArray = [MSegment | mSegment, ...PathSegment[]];
/** A 2D point as a tuple `[x, y]`. */
type PointTuple = [number, number];
/** The bounding box extremes `[minX, minY, maxX, maxY]`. */
type BBoxMaxima = [minX: number, minY: number, maxX: number, maxY: number];
/** An intersection point between two curves, including both `t` ratios. */
type IntersectionPoint = {
  /** The X coordinate of the intersection point. */
  x: number;
  /** The Y coordinate of the intersection point. */
  y: number;
  /** The parameter ratio of the first curve. */
  t1: number;
  /** The parameter ratio of the second curve. */
  t2: number;
};
/**
 * Finds intersection points between two paths.
 *
 * @param pathInput1 - First path string or PathArray
 * @param pathInput2 - Second path string or PathArray
 * @param justCount - If true, returns the count of intersections; if false, returns the intersection points
 * @returns The number of intersections (when justCount is true) or an array of IntersectionPoint objects
 *
 * @example
 * ```ts
 * pathsIntersection('M0 50C0 0,100 0,100 50', 'M50 0C100 0,100 100,50 100', true)
 * // => 1
 * pathsIntersection('M0 50C0 0,100 0,100 50', 'M50 0C100 0,100 100,50 100', false)
 * // => [{ x: 80.4136, y: 19.5864, t1: 0.7262, t2: 0.2738 }]
 * ```
 */
export declare const pathsIntersection: <T extends string | PathArray>(pathInput1: T, pathInput2: T, justCount?: boolean) => number | IntersectionPoint[];
/**
 * Checks if two bounding boxes intersect.
 *
 * @param a - First bounding box as [minX, minY, maxX, maxY]
 * @param b - Second bounding box as [minX, minY, maxX, maxY]
 * @returns True if the bounding boxes overlap
 */
export declare const boundingBoxIntersect: (a: BBoxMaxima, b: BBoxMaxima) => boolean;
/**
 * Checks if a point is inside a bounding box.
 *
 * @param bbox - The bounding box as [minX, minY, maxX, maxY]
 * @param point - The point as [x, y]
 * @returns True if the point is inside or on the edge of the bounding box
 */
export declare const isPointInsideBBox: (bbox: BBoxMaxima, [x, y]: PointTuple) => boolean;
export {};
//# sourceMappingURL=intersect.d.ts.map