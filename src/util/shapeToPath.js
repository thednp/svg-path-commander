import pathToString from '../convert/pathToString';

/**
 * Supported shapes and their specific parameters.
 *
 * @type {object}
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
 * @param {SVGPC.lineAttr} attr shape configuration
 * @return {SVGPC.pathArray} a new line `pathArray`
 */
export function getLinePath(attr) {
  const {
    x1, y1, x2, y2,
  } = attr;
  return [['M', +x1, +y1], ['L', +x2, +y2]];
}

/**
 * Returns a new `pathArray` like from polyline/polygon attributes.
 *
 * @param {SVGPC.polyAttr} attr shape configuration
 * @return {SVGPC.pathArray} a new polygon/polyline `pathArray`
 */
export function getPolyPath(attr) {
  const pathArray = [];
  let { points } = attr;

  points = points.split(/[\s|,]/).map(Number);

  let index = 0;
  while (index < points.length) {
    pathArray.push([(index ? 'L' : 'M'), (points[index]), (points[index + 1])]);
    index += 2;
  }

  return attr.type === 'polygon' ? pathArray.concat([['z']]) : pathArray;
}

/**
 * Returns a new `pathArray` from circle/ellipse attributes.
 *
 * @param {SVGPC.ellipseAttr | SVGPC.circleAttr} attr shape configuration
 * @return {SVGPC.pathArray} a circle/ellipse `pathArray`
 */
export function getEllipsePath(attr) {
  const {
    type, cx, cy, r,
  } = attr;
  let { rx, ry } = attr;

  if (type === 'circle' && r > 0) {
    rx = r;
    ry = r;
  }

  return [
    ['M', (cx - rx), cy],
    ['a', rx, ry, 0, 1, 0, (2 * rx), 0],
    ['a', rx, ry, 0, 1, 0, (-2 * rx), 0],
  ];
}

/**
 * Returns a new `pathArray` like from rect attributes.
 *
 * @param {SVGPC.rectAttr} attr object with properties above
 * @return {SVGPC.pathArray} a new `pathArray` from `<rect>` attributes
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
 * The newly created `<path>` element keeps all non-specific
 * attributes like `class`, `fill`, etc.
 *
 * @param {SVGPC.shapeTypes} element target shape
 * @param {boolean} replace option to replace target
 * @return {?SVGPathElement} the newly created `<path>` element
 */
export default function shapeToPath(element, replace) {
  const supportedShapes = Object.keys(shapeParams).concat(['glyph']);

  if (!supportedShapes.some((s) => element.tagName === s)) {
    throw TypeError(`shapeToPath: ${element} is not SVGElement`);
  }

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const type = element.tagName;
  const shapeAttrs = shapeParams[type];

  // set config
  const config = { type };
  shapeAttrs.forEach((p) => { config[p] = element.getAttribute(p); });

  // set no-specific shape attributes: fill, stroke, etc
  Object.values(element.attributes).forEach(({ name, value }) => {
    if (!shapeAttrs.includes(name)) path.setAttribute(name, value);
  });

  // set d
  let description;
  if (['circle', 'ellipse'].includes(type)) description = pathToString(getEllipsePath(config));
  else if (['polyline', 'polygon'].includes(type)) description = pathToString(getPolyPath(config));
  else if (type === 'rect') description = pathToString(getRectanglePath(config));
  else if (type === 'line') description = pathToString(getLinePath(config));
  else if (type === 'glyph') description = element.getAttribute('d');

  // replace target element
  if (description) {
    path.setAttribute('d', description);
    if (replace) {
      element.before(path, element);
      element.remove();
    }
    return path;
  }
  return null;
}
