import shapeToPath from './shapeToPath';

/**
 * Returns a new `<path>` from a `<glyph>` element, only using its `d` attribute,
 * all other attributes are ignored.
 *
 * If `pathInput` is a valid path string, will create a `<path>` and return it.
 *
 * @deprecated use shapeToPath
 * @see shapeToPath a new and more flexible utility
 *
 * @param {SVGElement | String} pathInput a `<glyph>` element or path string
 * @returns {SVGPathElement} a new `<path>` element
 */
export default function createPath(pathInput) {
  return shapeToPath(pathInput);
}
