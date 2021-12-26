import pathLengthFactory from './pathLengthFactory';

/**
 * Returns the shape total length, or the equivalent to `shape.getTotalLength()`.
 *
 * The `normalizePath` version is lighter, faster, more efficient and more accurate
 * with paths that are not `curveArray`.
 *
 * @param {string | SVGPathCommander.pathArray} pathInput the target `pathArray`
 * @returns {number} the shape total length
 */
export default function getTotalLength(pathInput) {
  // @ts-ignore - it's fine
  return pathLengthFactory(pathInput);
}
