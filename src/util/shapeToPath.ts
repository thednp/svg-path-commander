import type { CircleAttr, EllipseAttr, GlyphAttr, LineAttr, PolyAttr, RectAttr, ShapeParams } from '../interface';
import type { PathArray, PathSegment, ShapeOps, ShapeTypes } from '../types';
import pathToString from '../convert/pathToString';
import defaultOptions from '../options/options';
import error from '../parser/error';
import isValidPath from './isValidPath';

/**
 * Supported shapes and their specific parameters.
 */
const shapeParams: ShapeParams = {
  line: ['x1', 'y1', 'x2', 'y2'],
  circle: ['cx', 'cy', 'r'],
  ellipse: ['cx', 'cy', 'rx', 'ry'],
  rect: ['width', 'height', 'x', 'y', 'rx', 'ry'],
  polygon: ['points'],
  polyline: ['points'],
  glyph: ['d'],
};

/**
 * Returns a new `pathArray` from line attributes.
 *
 * @param attr shape configuration
 * @returns a new line `pathArray`
 */
export const getLinePath = (attr: LineAttr): PathArray => {
  const { x1, y1, x2, y2 } = attr;
  return [
    ['M', x1, y1],
    ['L', x2, y2],
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
  const points = (attr.points || '')
    .trim()
    .split(/[\s|,]/)
    .map(Number);

  let index = 0;
  while (index < points.length) {
    pathArray.push([index ? 'L' : 'M', points[index], points[index + 1]]);
    index += 2;
  }

  return (attr.type === 'polygon' ? [...pathArray, ['z']] : pathArray) as PathArray;
};

/**
 * Returns a new `pathArray` from circle attributes.
 *
 * @param attr shape configuration
 * @return a circle `pathArray`
 */
export const getCirclePath = (attr: CircleAttr): PathArray => {
  const { cx, cy, r } = attr;

  return [
    ['M', cx - r, cy],
    ['a', r, r, 0, 1, 0, 2 * r, 0],
    ['a', r, r, 0, 1, 0, -2 * r, 0],
  ];
};

/**
 * Returns a new `pathArray` from ellipse attributes.
 *
 * @param attr shape configuration
 * @return an ellipse `pathArray`
 */
export const getEllipsePath = (attr: EllipseAttr): PathArray => {
  const { cx, cy, rx, ry } = attr;

  return [
    ['M', cx - rx, cy],
    ['a', rx, ry, 0, 1, 0, 2 * rx, 0],
    ['a', rx, ry, 0, 1, 0, -2 * rx, 0],
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
  let rx = +attr.rx;
  let ry = +attr.ry;

  // Validity checks from http://www.w3.org/TR/SVG/shapes.html#RectElement:
  if (rx || ry) {
    rx = !rx ? ry : rx;
    ry = !ry ? rx : ry;

    /* istanbul ignore else */
    if (rx * 2 > w) rx -= (rx * 2 - w) / 2;
    /* istanbul ignore else */
    if (ry * 2 > h) ry -= (ry * 2 - h) / 2;

    return [
      ['M', x + rx, y],
      ['h', w - rx * 2],
      ['s', rx, 0, rx, ry],
      ['v', h - ry * 2],
      ['s', 0, ry, -rx, ry],
      ['h', -w + rx * 2],
      ['s', -rx, 0, -rx, -ry],
      ['v', -h + ry * 2],
      ['s', 0, -ry, rx, -ry],
    ];
  }

  return [['M', x, y], ['h', w], ['v', h], ['H', x], ['Z']];
};

/**
 * Returns a new `<path>` element created from attributes of a `<line>`, `<polyline>`,
 * `<polygon>`, `<rect>`, `<ellipse>`, `<circle>` or `<glyph>`. If `replace` parameter
 * is `true`, it will replace the target. The default `ownerDocument` is your current
 * `document` browser page, if you want to use in server-side using `jsdom`, you can
 * pass the `jsdom` `document` to `ownDocument`.
 *
 * It can also work with an options object,
 *
 * @see ShapeOps
 *
 * The newly created `<path>` element keeps all non-specific
 * attributes like `class`, `fill`, etc.
 *
 * @param element target shape
 * @param replace option to replace target
 * @param ownerDocument document for create element
 * @return the newly created `<path>` element
 */
const shapeToPath = (
  element: ShapeTypes | ShapeOps,
  replace?: boolean,
  ownerDocument?: Document,
): SVGPathElement | false => {
  const doc = ownerDocument || document;
  const win = doc.defaultView || /* istanbul ignore next */ window;
  const supportedShapes = Object.keys(shapeParams) as (keyof ShapeParams)[];
  const elementIsElement = element instanceof win.SVGElement;
  const tagName = elementIsElement ? element.tagName : null;

  if (tagName && supportedShapes.every(s => tagName !== s)) {
    throw TypeError(`${error}: "${tagName}" is not SVGElement`);
  }

  const path = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
  const type = (elementIsElement ? tagName : element.type) as ShapeOps['type'];
  const shapeAttrs = shapeParams[type] as string[];
  const config = { type } as Record<string, string>;

  if (elementIsElement) {
    shapeAttrs.forEach(p => {
      if (shapeAttrs.includes(p)) config[p] = element.getAttribute(p) as string;
    });
    // set no-specific shape attributes: fill, stroke, etc
    Object.values(element.attributes).forEach(({ name, value }) => {
      if (!shapeAttrs.includes(name)) path.setAttribute(name, value);
    });
  } else {
    Object.assign(config, element);
    // set no-specific shape attributes: fill, stroke, etc
    Object.keys(config).forEach(k => {
      if (!shapeAttrs.includes(k) && k !== 'type') {
        path.setAttribute(
          k.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`),
          config[k],
        );
      }
    });
  }

  // set d
  let description = '';
  const round = defaultOptions.round as number;

  /* istanbul ignore else */
  if (type === 'circle') description = pathToString(getCirclePath(config as unknown as CircleAttr), round);
  else if (type === 'ellipse') description = pathToString(getEllipsePath(config as unknown as EllipseAttr), round);
  else if (['polyline', 'polygon'].includes(type))
    description = pathToString(getPolyPath(config as unknown as PolyAttr), round);
  else if (type === 'rect') description = pathToString(getRectanglePath(config as unknown as RectAttr), round);
  else if (type === 'line') description = pathToString(getLinePath(config as unknown as LineAttr), round);
  else if (type === 'glyph')
    description = elementIsElement ? (element.getAttribute('d') as string) : (element as GlyphAttr).d;

  // replace target element
  if (isValidPath(description)) {
    path.setAttribute('d', description);
    if (replace && elementIsElement) {
      element.before(path, element);
      element.remove();
    }
    return path;
  }
  return false;
};
export default shapeToPath;
