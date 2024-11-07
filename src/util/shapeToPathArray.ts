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
import error from "../parser/error";
import parsePathString from "../parser/parsePathString";
import shapeParams from "./shapeParams";
import isPathArray from "./isPathArray";

/**
 * Returns a new `pathArray` from line attributes.
 *
 * @param attr shape configuration
 * @returns a new line `pathArray`
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
 * Returns a new `pathArray` like from polyline/polygon attributes.
 *
 * @param attr shape configuration
 * @return a new polygon/polyline `pathArray`
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

  return (attr.type === "polygon"
    ? [...pathArray, ["z"]]
    : pathArray) as PathArray;
};

/**
 * Returns a new `pathArray` from circle attributes.
 *
 * @param attr shape configuration
 * @return a circle `pathArray`
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
 * Returns a new `pathArray` from ellipse attributes.
 *
 * @param attr shape configuration
 * @return an ellipse `pathArray`
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
 * Returns a new `pathArray` like from rect attributes.
 *
 * @param attr object with properties above
 * @return a new `pathArray` from `<rect>` attributes
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
 * The default `ownerDocument` is your current `document` browser page,
 * if you want to use in server-side using `jsdom`, you can pass the
 * `jsdom` `document` to `ownDocument`.
 *
 * It can also work with an options object, see the type below
 *
 * @see ShapeOps
 *
 * @param element target shape
 * @param ownerDocument document for create element
 * @return the newly created `<path>` element
 */
const shapeToPathArray = (
  element: ShapeTypes | ShapeOps,
  ownerDocument?: Document,
) => {
  const doc = ownerDocument || document;
  const win = doc.defaultView || /* istanbul ignore next */ window;
  const supportedShapes = Object.keys(shapeParams) as (keyof ShapeParams)[];
  const targetIsElement = element instanceof win.SVGElement;
  const tagName = targetIsElement ? element.tagName : null;

  if (tagName && [...supportedShapes, "path"].every((s) => tagName !== s)) {
    throw TypeError(`${error}: "${tagName}" is not SVGElement`);
  }

  const type = (targetIsElement ? tagName : element.type) as ShapeOps["type"];
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
export default shapeToPathArray;
