import type {
  CircleAttr,
  EllipseAttr,
  GlyphAttr,
  LineAttr,
  PolyAttr,
  RectAttr,
  ShapeParams,
} from "../interface";
import type { PathArray, PathSegment, ShapeOps, ShapeTypes } from "../types";
import { error } from "./error";
import { parsePathString } from "../parser/parsePathString";
import { shapeParams } from "./shapeParams";
import { isPathArray } from "./isPathArray";
import { isElement } from "./isElement";

/**
 * Returns a new PathArray from line attributes.
 *
 * @param attr - Shape configuration with x1, y1, x2, y2
 * @returns A new line PathArray
 *
 * @example
 * ```ts
 * getLinePath({ x1: 0, y1: 0, x2: 100, y2: 100 })
 * // => [['M', 0, 0], ['L', 100, 100]]
 * ```
 */
export const getLinePath = (attr: LineAttr): PathArray => {
  let { x1, y1, x2, y2 } = attr;
  [x1, y1, x2, y2] = [x1, y1, x2, y2].map((a) => +a);
  return [
    ["M", x1, y1],
    ["L", x2, y2],
  ];
};

/**
 * Returns a new PathArray from polyline/polygon attributes.
 *
 * @param attr - Shape configuration with points string
 * @returns A new polygon/polyline PathArray
 *
 * @example
 * ```ts
 * getPolyPath({ type: 'polygon', points: '0,0 100,0 100,100 0,100' })
 * // => [['M', 0, 0], ['L', 100, 0], ['L', 100, 100], ['L', 0, 100], ['z']]
 * ```
 */
export const getPolyPath = (attr: PolyAttr): PathArray => {
  const pathArray = [] as PathSegment[];
  const points = (attr.points || "")
    .trim()
    .split(/[\s|,]/)
    .map((a) => +a);

  let index = 0;
  while (index < points.length) {
    pathArray.push([index ? "L" : "M", points[index], points[index + 1]]);
    index += 2;
  }

  return (
    attr.type === "polygon" ? [...pathArray, ["z"]] : pathArray
  ) as PathArray;
};

/**
 * Returns a new PathArray from circle attributes.
 *
 * @param attr - Shape configuration with cx, cy, r
 * @returns A circle PathArray
 *
 * @example
 * ```ts
 * getCirclePath({ cx: 50, cy: 50, r: 25 })
 * // => [['M', 25, 50], ['a', 25, 25, 0, 1, 0, 50, 0], ['a', 25, 25, 0, 1, 0, -50, 0]]
 * ```
 */
export const getCirclePath = (attr: CircleAttr): PathArray => {
  let { cx, cy, r } = attr;
  [cx, cy, r] = [cx, cy, r].map((a) => +a);

  return [
    ["M", cx - r, cy],
    ["a", r, r, 0, 1, 0, 2 * r, 0],
    ["a", r, r, 0, 1, 0, -2 * r, 0],
  ];
};

/**
 * Returns a new PathArray from ellipse attributes.
 *
 * @param attr - Shape configuration with cx, cy, rx, ry
 * @returns An ellipse PathArray
 *
 * @example
 * ```ts
 * getEllipsePath({ cx: 50, cy: 50, rx: 30, ry: 20 })
 * // => [['M', 20, 50], ['a', 30, 20, 0, 1, 0, 60, 0], ['a', 30, 20, 0, 1, 0, -60, 0]]
 * ```
 */
export const getEllipsePath = (attr: EllipseAttr): PathArray => {
  let { cx, cy } = attr;
  let rx = attr.rx || 0;
  let ry = attr.ry || rx;
  [cx, cy, rx, ry] = [cx, cy, rx, ry].map((a) => +a);

  return [
    ["M", cx - rx, cy],
    ["a", rx, ry, 0, 1, 0, 2 * rx, 0],
    ["a", rx, ry, 0, 1, 0, -2 * rx, 0],
  ];
};

/**
 * Returns a new PathArray from rect attributes.
 *
 * @param attr - Object with x, y, width, height, and optional rx/ry
 * @returns A new PathArray from `<rect>` attributes
 *
 * @example
 * ```ts
 * getRectanglePath({ x: 0, y: 0, width: 100, height: 50, ry: 10 })
 * // => [['M', 10, 0], ['h', 80], ['a', 10, 10, 0, 0, 1, 10, 10], ...]
 * ```
 */
export const getRectanglePath = (attr: RectAttr): PathArray => {
  const x = +attr.x || 0;
  const y = +attr.y || 0;
  const w = +attr.width;
  const h = +attr.height;
  let rx = +(attr.rx || 0);
  let ry = +(attr.ry || rx);

  // Validity checks from http://www.w3.org/TR/SVG/shapes.html#RectElement:
  if (rx || ry) {
    // rx = !rx ? ry : rx;
    // ry = !ry ? rx : ry;

    /* istanbul ignore else @preserve */
    if (rx * 2 > w) rx -= (rx * 2 - w) / 2;
    /* istanbul ignore else @preserve */
    if (ry * 2 > h) ry -= (ry * 2 - h) / 2;

    return [
      ["M", x + rx, y],
      ["h", w - rx * 2],
      ["s", rx, 0, rx, ry],
      ["v", h - ry * 2],
      ["s", 0, ry, -rx, ry],
      ["h", -w + rx * 2],
      ["s", -rx, 0, -rx, -ry],
      ["v", -h + ry * 2],
      ["s", 0, -ry, rx, -ry],
    ];
  }

  return [["M", x, y], ["h", w], ["v", h], ["H", x], ["Z"]];
};

/**
 * Returns a new `pathArray` created from attributes of a `<line>`, `<polyline>`,
 * `<polygon>`, `<rect>`, `<ellipse>`, `<circle>`, <path> or `<glyph>`.
 *
 * It can also work with an options object, see the type below
 * @see ShapeOps
 *
 * @param element target shape
 * @returns the newly created `<path>` element
 */
export const shapeToPathArray = (element: ShapeTypes | ShapeOps) => {
  const supportedShapes = Object.keys(shapeParams) as (keyof ShapeParams)[];
  const targetIsElement = isElement(element);
  const tagName = targetIsElement ? element.tagName : null;

  if (tagName && [...supportedShapes, "path"].every((s) => tagName !== s)) {
    throw TypeError(`${error}: "${tagName}" is not SVGElement`);
  }

  const type = (
    targetIsElement ? tagName : (element as ShapeOps).type
  ) as ShapeOps["type"];
  const shapeAttrs = shapeParams[type] as string[];
  const config = { type } as Record<string, string>;

  if (targetIsElement) {
    shapeAttrs.forEach((p) => {
      config[p] = element.getAttribute(p) as string;
    });
  } else {
    Object.assign(config, element);
  }

  // set d
  let pathArray = [] as unknown as PathArray;

  /* istanbul ignore else */
  if (type === "circle") {
    pathArray = getCirclePath(config as unknown as CircleAttr);
  } else if (type === "ellipse") {
    pathArray = getEllipsePath(config as unknown as EllipseAttr);
  } else if (["polyline", "polygon"].includes(type)) {
    pathArray = getPolyPath(config as unknown as PolyAttr);
  } else if (type === "rect") {
    pathArray = getRectanglePath(config as unknown as RectAttr);
  } else if (type === "line") {
    pathArray = getLinePath(config as unknown as LineAttr);
  } else if (["glyph", "path"].includes(type)) {
    pathArray = parsePathString(
      targetIsElement
        ? element.getAttribute("d") || /* istanbul ignore next @preserve */ ""
        : (element as GlyphAttr).d || "",
    );
  }

  // replace target element
  if (isPathArray(pathArray) && pathArray.length) {
    return pathArray;
  }
  return false;
};
