import pathToString from '../convert/pathToString';
import defaultOptions from '../options/options';
import error from '../parser/error';
import isValidPath from './isValidPath';

/**
 * Supported shapes and their specific parameters.
 * @type {Object.<string, string[]>}
 */
const shapeParams = {
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
 * @param {SVGPath.lineAttr} attr shape configuration
 * @returns {SVGPath.pathArray} a new line `pathArray`
 */
export function getLinePath(attr) {
  const {
    x1, y1, x2, y2,
  } = attr;
  return [['M', x1, y1], ['L', x2, y2]];
}

/**
 * Returns a new `pathArray` like from polyline/polygon attributes.
 *
 * @param {SVGPath.polyAttr} attr shape configuration
 * @return {SVGPath.pathArray} a new polygon/polyline `pathArray`
 */
export function getPolyPath(attr) {
  /** @type {SVGPath.pathArray} */
  const pathArray = [];
  const points = (attr.points || '').trim().split(/[\s|,]/).map(Number);

  let index = 0;
  while (index < points.length) {
    pathArray.push([(index ? 'L' : 'M'), (points[index]), (points[index + 1])]);
    index += 2;
  }

  return attr.type === 'polygon' ? [...pathArray, ['z']] : pathArray;
}

/**
 * Returns a new `pathArray` from circle attributes.
 *
 * @param {SVGPath.circleAttr} attr shape configuration
 * @return {SVGPath.pathArray} a circle `pathArray`
 */
export function getCirclePath(attr) {
  const {
    cx, cy, r,
  } = attr;

  return [
    ['M', (cx - r), cy],
    ['a', r, r, 0, 1, 0, (2 * r), 0],
    ['a', r, r, 0, 1, 0, (-2 * r), 0],
  ];
}

/**
 * Returns a new `pathArray` from ellipse attributes.
 *
 * @param {SVGPath.ellipseAttr} attr shape configuration
 * @return {SVGPath.pathArray} an ellipse `pathArray`
 */
export function getEllipsePath(attr) {
  const {
    cx, cy, rx, ry,
  } = attr;

  return [
    ['M', (cx - rx), cy],
    ['a', rx, ry, 0, 1, 0, (2 * rx), 0],
    ['a', rx, ry, 0, 1, 0, (-2 * rx), 0],
  ];
}

/**
 * Returns a new `pathArray` like from rect attributes.
 *
 * @param {SVGPath.rectAttr} attr object with properties above
 * @return {SVGPath.pathArray} a new `pathArray` from `<rect>` attributes
 */
export function getRectanglePath(attr) {
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

  return [
    ['M', x, y],
    ['h', w],
    ['v', h],
    ['H', x],
    ['Z'],
  ];
}

/**
 * Returns a new `<path>` element created from attributes of a `<line>`, `<polyline>`,
 * `<polygon>`, `<rect>`, `<ellipse>`, `<circle>` or `<glyph>`. If `replace` parameter
 * is `true`, it will replace the target.
 *
 * It can also work with an options object,
 * @see SVGPath.shapeOps
 *
 * The newly created `<path>` element keeps all non-specific
 * attributes like `class`, `fill`, etc.
 *
 * @param {SVGPath.shapeTypes | SVGPath.shapeOps} element target shape
 * @param {boolean=} replace option to replace target
 * @return {SVGPathElement | boolean} the newly created `<path>` element
 */
export default function shapeToPath(element, replace) {
  const supportedShapes = Object.keys(shapeParams);
  const { tagName } = element;

  if (tagName && !supportedShapes.some((s) => tagName === s)) {
    throw TypeError(`${error}: "${tagName}" is not SVGElement`);
  }

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  /** @type {string} */
  const type = tagName || element.type;
  /** @type {any} disables TS checking for something that's specific to shape */
  const config = {};
  config.type = type;
  const shapeAttrs = shapeParams[type];

  if (tagName) {
    shapeAttrs.forEach((p) => { config[p] = element.getAttribute(p); });
    // set no-specific shape attributes: fill, stroke, etc
    Object.values(element.attributes).forEach(({ name, value }) => {
      if (!shapeAttrs.includes(name)) path.setAttribute(name, value);
    });
  } else {
    Object.assign(config, element);
    // set no-specific shape attributes: fill, stroke, etc
    Object.keys(config).forEach((k) => {
      if (!shapeAttrs.includes(k) && k !== 'type') {
        path.setAttribute(k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`), config[k]);
      }
    });
  }

  // set d
  let description;
  const { round } = defaultOptions;

  /* istanbul ignore else */
  if (type === 'circle') description = pathToString(getCirclePath(config), round);
  else if (type === 'ellipse') description = pathToString(getEllipsePath(config), round);
  else if (['polyline', 'polygon'].includes(type)) description = pathToString(getPolyPath(config), round);
  else if (type === 'rect') description = pathToString(getRectanglePath(config), round);
  else if (type === 'line') description = pathToString(getLinePath(config), round);
  else if (type === 'glyph') description = tagName ? element.getAttribute('d') : element.d;

  // replace target element
  if (isValidPath(description)) {
    path.setAttribute('d', description);
    if (replace && tagName) {
      element.before(path, element);
      element.remove();
    }
    return path;
  }
  return false;
}
