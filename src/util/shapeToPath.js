import pathToString from '../convert/pathToString';
import defaultOptions from '../options/options';

/**
 * Supported shapes and their specific parameters.
 * @type {Object.<string, string[]>}
 */
const shapeParams = {
  circle: ['cx', 'cy', 'r'],
  ellipse: ['cx', 'cy', 'rx', 'ry'],
  rect: ['width', 'height', 'x', 'y', 'rx', 'ry'],
  polygon: ['points'],
  polyline: ['points'],
  glyph: [],
};

/**
 * Returns a new `pathArray` from line attributes.
 *
 * @param {SVGPathCommander.lineAttr} attr shape configuration
 * @returns {SVGPathCommander.pathArray} a new line `pathArray`
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
 * @param {SVGPathCommander.polyAttr} attr shape configuration
 * @return {SVGPathCommander.pathArray} a new polygon/polyline `pathArray`
 */
export function getPolyPath(attr) {
  /** @type {SVGPathCommander.pathArray} */
  // @ts-ignore -- it's an empty `pathArray`
  const pathArray = [];
  const points = attr.points.split(/[\s|,]/).map(Number);

  let index = 0;
  while (index < points.length) {
    pathArray.push([(index ? 'L' : 'M'), (points[index]), (points[index + 1])]);
    index += 2;
  }
  // @ts-ignore -- it's a `pathArray`
  return attr.type === 'polygon' ? [...pathArray, ['z']] : pathArray;
}

/**
 * Returns a new `pathArray` from circle attributes.
 *
 * @param {SVGPathCommander.circleAttr} attr shape configuration
 * @return {SVGPathCommander.pathArray} a circle `pathArray`
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
 * @param {SVGPathCommander.ellipseAttr} attr shape configuration
 * @return {SVGPathCommander.pathArray} an ellipse `pathArray`
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
 * @param {SVGPathCommander.rectAttr} attr object with properties above
 * @return {SVGPathCommander.pathArray} a new `pathArray` from `<rect>` attributes
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

    if (rx * 2 > w) rx -= (rx * 2 - w) / 2;
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
 * @see SVGPathCommander.shapeOps
 *
 * The newly created `<path>` element keeps all non-specific
 * attributes like `class`, `fill`, etc.
 *
 * @param {SVGPathCommander.shapeTypes | SVGPathCommander.shapeOps} element target shape
 * @param {boolean=} replace option to replace target
 * @return {SVGPathElement | boolean} the newly created `<path>` element
 */
export default function shapeToPath(element, replace) {
  const supportedShapes = Object.keys(shapeParams);
  const isElement = element instanceof Element;

  if (isElement && !supportedShapes.some((s) => element.tagName === s)) {
    throw TypeError(`shapeToPath: "${element}" is not SVGElement`);
  }

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  /** @type {string} */
  const type = isElement ? element.tagName : element.type;
  /** @type {any} disables TS checking for something that's specific to shape */
  const config = {};
  config.type = type;

  if (isElement) {
    const shapeAttrs = shapeParams[type];
    shapeAttrs.forEach((p) => { config[p] = element.getAttribute(p); });
    // set no-specific shape attributes: fill, stroke, etc
    Object.values(element.attributes).forEach(({ name, value }) => {
      if (!shapeAttrs.includes(name)) path.setAttribute(name, value);
    });
  } else {
    Object.assign(config, element);
  }

  // set d
  let description;
  const { round } = defaultOptions;

  if (type === 'circle') description = pathToString(getCirclePath(config), round);
  else if (type === 'ellipse') description = pathToString(getEllipsePath(config), round);
  else if (['polyline', 'polygon'].includes(type)) description = pathToString(getPolyPath(config), round);
  else if (type === 'rect') description = pathToString(getRectanglePath(config), round);
  else if (type === 'line') description = pathToString(getLinePath(config), round);
  else if (type === 'glyph') description = isElement ? element.getAttribute('d') : element.type;

  // replace target element
  if (description) {
    path.setAttribute('d', description);
    if (replace && isElement) {
      element.before(path, element);
      element.remove();
    }
    return path;
  }
  return false;
}
