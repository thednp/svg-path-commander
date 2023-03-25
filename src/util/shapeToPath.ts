import type { ShapeParams } from '../interface';
import type { ShapeOps, ShapeTypes } from '../types';
import pathToString from '../convert/pathToString';
import defaultOptions from '../options/options';
import error from '../parser/error';
import isValidPath from './isValidPath';
import shapeToPathArray from './shapeToPathArray';
import shapeParams from './shapeParams';

/**
 * Returns a new `<path>` element created from attributes of a `<line>`, `<polyline>`,
 * `<polygon>`, `<rect>`, `<ellipse>`, `<circle>` or `<glyph>`. If `replace` parameter
 * is `true`, it will replace the target. The default `ownerDocument` is your current
 * `document` browser page, if you want to use in server-side using `jsdom`, you can
 * pass the `jsdom` `document` to `ownDocument`.
 *
 * It can also work with an options object, see the type below
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
  const targetIsElement = element instanceof win.SVGElement;
  const tagName = targetIsElement ? element.tagName : null;

  if (tagName === 'path') throw TypeError(`${error}: "${tagName}" is already SVGPathElement`);
  if (tagName && supportedShapes.every(s => tagName !== s)) throw TypeError(`${error}: "${tagName}" is not SVGElement`);

  const path = doc.createElementNS('http://www.w3.org/2000/svg', 'path');
  const type = (targetIsElement ? tagName : element.type) as ShapeOps['type'];
  const shapeAttrs = shapeParams[type] as string[];
  const config = { type } as Record<string, string>;

  // set d
  const round = defaultOptions.round as number;
  const pathArray = shapeToPathArray(element, doc);
  const description = pathArray && pathArray.length ? pathToString(pathArray, round) : '';

  if (targetIsElement) {
    shapeAttrs.forEach(p => {
      config[p] = element.getAttribute(p) as string;
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

  // replace target element
  if (isValidPath(description)) {
    path.setAttribute('d', description);
    if (replace && targetIsElement) {
      element.before(path, element);
      element.remove();
    }
    return path;
  }
  return false;
};

export default shapeToPath;
