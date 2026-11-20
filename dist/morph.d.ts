/*!
* SVGPathCommander MORPH v2.4.0 (http://thednp.github.io/svg-path-commander)
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
/** A `PathArray` with only moveto and cubic Bezier segments. */
type CurveArray = [MSegment, ...CSegment[]];
/** A `CurveArray` ending with a closepath segment. */
type ClosedCurveArray = [MSegment, ...CSegment[], ZSegment];
/** A `PathArray` describing a closed polygon (moveto, lineto and closepath). */
type PolygonArray = [MSegment, ...LSegment[], ZSegment];
/** A `PathArray` describing an open polyline (moveto and lineto). */
type PolylineArray = [MSegment, ...LSegment[]];
/** The `PathArray` shapes supported by path morphing. */
type MorphPathArray = PolygonArray | PolylineArray | CurveArray | ClosedCurveArray;
/** The eight coordinates of a cubic Bezier segment. */
type CubicCoordinates = [number, number, number, number, number, number, number, number];
/** Options for equalizing two paths for morphing. */
interface EqualizationOptions {
  /** The equalization mode. @default "auto" */
  mode?: "auto" | "line" | "curve";
  /** The strategy used to place the points of the equalized paths. @default "segment" */
  strategy?: "segment" | "arcLength";
  /** Whether the paths are aligned by rotation. @default true */
  align?: boolean;
  /** The number of sample points for the line mode. */
  sampleSize?: number;
  /** The amount of decimals to round values to. */
  roundValues?: number;
  /** Whether to reverse the second path before equalization. @default true */
  reverse?: boolean | "auto";
  /** Whether to close the path before equalization. */
  close?: boolean;
  /** The target segment count for both paths. */
  target?: number;
}
/** Options for equalizing two paths for morphing with the `equalize` facade. */
interface EqualizeOptions {
  /** The number of points of the equalized paths. @default "auto" */
  points?: number | "auto";
  /** The strategy used to place the points of the equalized paths. @default "segment" */
  strategy?: "segment" | "arcLength";
  /** Whether the paths are aligned by rotation. @default true */
  align?: boolean;
  /** Whether a path is reversed to match the winding of the other one. @default "auto" */
  reverse?: boolean | "auto";
  /** The equalization mode. @default "auto" */
  mode?: "auto" | "line" | "curve";
  /** The amount of decimals to round values to. @default 4 */
  roundValues?: number;
  /** Whether to close the paths before equalization. */
  close?: boolean;
}
/**
 * Checks a `PathArray` for an unnecessary `Z` segment
 * and removes it. The `PathArray` is modified in place.
 * In short, if the segment before `Z` extends to `M`,
 * the `Z` segment must be removed.
 *
 * The `pathInput` must be a single path, without
 * sub-paths. For multi-path `<path>` elements,
 * use `splitPath` first and apply this utility on each
 * sub-path separately.
 *
 * @param pathInput the `pathArray` source
 * @returns void
 */
export declare const fixPath: <T extends PathArray>(pathInput: T | string) => void;
/**
 * Split a cubic Bézier into two cubics at parameter t [0–1].
 *
 * @param x1 - Start point X
 * @param y1 - Start point Y
 * @param x2 - First control point X
 * @param y2 - First control point Y
 * @param x3 - Second control point X
 * @param y3 - Second control point Y
 * @param x4 - End point X
 * @param y4 - End point Y
 * @param t - Parameter in range [0, 1] at which to split
 * @returns Array of two cubic segments, each as [x1,y1, x2,y2, x3,y3, x4,y4]
 */
export declare function splitCubicSegment(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number, t: number): [CubicCoordinates, CubicCoordinates];
/**
 * Equalizes two paths for morphing.
 *
 * The two paths are brought to the same shape, so they can be morphed into
 * each other: they hold the same number of segments of the same type, their
 * winding is the same and their points are aligned.
 *
 * A path with a single sub-path is equalized on its own, a path with more
 * sub-paths is split into sub-paths, the sub-paths are matched by their
 * shape and every pair is equalized on its own.
 *
 * The `strategy` option decides how the points of the paths are placed:
 * - `segment` splits the segments of the paths, so the points of the result
 *   are the points of the paths;
 * - `arcLength` spreads the points of the result evenly over the length of
 *   the paths, so the distance between two points of the result is the same
 *   over the whole path. The corners of the paths are points of the result
 *   too, so the shape of the paths keeps its vertices.
 *
 * The `points` option is the number of points of the result. The automatic
 * mode uses the number of points of the bigger path, raised when the corners
 * of the paths do not fit.
 *
 * The `reverse` option decides what happens when the two paths draw in
 * opposite directions: `true` reverses the second path, `false` leaves the
 * paths as they are and `auto` reverses the path that leaves the two paths
 * closest to each other.
 *
 * @see https://minus-ze.ro/posts/morphing-arbitrary-paths-in-svg/
 *
 * @param pathInput1 - First path string or PathArray
 * @param pathInput2 - Second path string or PathArray
 * @param initialCfg - Configuration options for equalization
 * @returns Tuple of two equalized MorphPathArrays
 *
 * @example
 * ```ts
 * const [eq1, eq2] = equalize('M0 0L100 0L50 100Z', 'M0 0L100 0L100 100L0 100Z')
 * // eq1.length === eq2.length — ready for morphing
 * ```
 */
export declare const equalize: (pathInput1: string | PathArray, pathInput2: string | PathArray, initialCfg?: EqualizeOptions) => [MorphPathArray, MorphPathArray];
/**
 * Equalizes two paths for morphing (single subpath only).
 *
 * @see https://minus-ze.ro/posts/morphing-arbitrary-paths-in-svg/
 * @param path1 - First path string or PathArray
 * @param path2 - Second path string or PathArray
 * @param initialCfg - Equalization options
 * @returns Tuple of two equalized MorphPathArrays
 *
 * @example
 * ```ts
 * const [eq1, eq2] = equalizeSegments('M0 0L100 0L50 100Z', 'M0 0L100 0L100 100L0 100Z')
 * // eq1.length === eq2.length
 * ```
 */
export declare const equalizeSegments: (path1: PathArray | string, path2: PathArray | string, initialCfg?: EqualizationOptions) => [MorphPathArray, MorphPathArray];
/**
 * Equalizes two paths for morphing (single/multi subpath).
 *
 * @see https://minus-ze.ro/posts/morphing-arbitrary-paths-in-svg/
 * @param pathInput1 - First path string or PathArray
 * @param pathInput2 - Second path string or PathArray
 * @param initialCfg - Configuration options for equalization
 * @returns Tuple of two equalized MorphPathArrays
 *
 * @example
 * ```ts
 * const [eq1, eq2] = equalizePaths('M0 0L100 0L50 100Z', 'M0 0L100 0L100 100L0 100Z')
 * // eq1.length === eq2.length — ready for morphing
 * ```
 */
export declare const equalizePaths: (pathInput1: string | PathArray, pathInput2: string | PathArray, initialCfg?: {}) => [MorphPathArray, MorphPathArray];
/**
 * Resamples a path to a given number of points, spread evenly by length.
 *
 * The path is measured along its length and the points of the result are
 * spread evenly over it, so the distance between two points of the result
 * is the same over the whole path. The corners of the path are points of
 * the result too, so the shape of the path keeps its vertices.
 *
 * The result is a polyline, or a path of cubic Bezier segments when the
 * curve mode is used: every cubic of the result starts at a point of the
 * path and ends at the next one, with the direction of the path at both
 * ends, so the curve of the path is kept.
 *
 * @param pathInput - the target path string or PathArray
 * @param count - the number of points of the result
 * @param mode - the type of the segments of the result
 * @returns the resampled path
 *
 * @example
 * ```ts
 * resamplePath("M0 0L100 0L100 100", 3)
 * // => [['M', 0, 0], ['L', 100, 0], ['L', 100, 100]]
 * ```
 */
export declare const resamplePath: (pathInput: string | PathArray, count: number, mode?: "line" | "curve") => MorphPathArray;
export {};
//# sourceMappingURL=morph.d.ts.map