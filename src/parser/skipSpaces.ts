import { isSpace } from "./isSpace.ts";
import type { PathParser } from "./pathParser.ts";

/**
 * Points the parser to the next character in the
 * path string every time it encounters any kind of
 * space character.
 *
 * @param path - The PathParser instance
 */
export const skipSpaces = (path: PathParser): void => {
  const { pathValue, max } = path;
  while (path.index < max && isSpace(pathValue.charCodeAt(path.index))) {
    path.index += 1;
  }
};
