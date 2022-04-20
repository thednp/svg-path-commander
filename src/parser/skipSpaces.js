import isSpace from './isSpace';

/**
 * Points the parser to the next character in the
 * path string every time it encounters any kind of
 * space character.
 *
 * @param {SVGPath.PathParser} path the `PathParser` instance
 */
export default function skipSpaces(path) {
  const { pathValue, max } = path;
  while (path.index < max && isSpace(pathValue.charCodeAt(path.index))) {
    path.index += 1;
  }
}
