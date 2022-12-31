import isSpace from './isSpace';
import type PathParser from './pathParser';

/**
 * Points the parser to the next character in the
 * path string every time it encounters any kind of
 * space character.
 *
 * @param path the `PathParser` instance
 */
const skipSpaces = (path: PathParser) => {
  const { pathValue, max } = path;
  while (path.index < max && isSpace(pathValue.charCodeAt(path.index))) {
    path.index += 1;
  }
};
export default skipSpaces;
