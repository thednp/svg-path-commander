import finalizeSegment from './finalizeSegment';
import paramCounts from './paramsCount';
import scanFlag from './scanFlag';
import scanParam from './scanParam';
import skipSpaces from './skipSpaces';
import isPathCommand from './isPathCommand';
import isDigitStart from './isDigitStart';
import isArcCommand from './isArcCommand';
import invalidPathValue from './invalidPathValue';
import error from './error';

/**
 * Scans every character in the path string to determine
 * where a segment starts and where it ends.
 *
 * @param {SVGPath.PathParser} path the `PathParser` instance
 */
export default function scanSegment(path) {
  const { max, pathValue, index } = path;
  const cmdCode = pathValue.charCodeAt(index);
  const reqParams = paramCounts[pathValue[index].toLowerCase()];

  path.segmentStart = index;

  if (!isPathCommand(cmdCode)) {
    path.err = `${error}: ${invalidPathValue} "${pathValue[index]}" is not a path command`;
    return;
  }

  path.index += 1;
  skipSpaces(path);

  path.data = [];

  if (!reqParams) {
    // Z
    finalizeSegment(path);
    return;
  }

  for (;;) {
    for (let i = reqParams; i > 0; i -= 1) {
      if (isArcCommand(cmdCode) && (i === 3 || i === 4)) scanFlag(path);
      else scanParam(path);

      if (path.err.length) {
        return;
      }
      path.data.push(path.param);

      skipSpaces(path);

      // after ',' param is mandatory
      if (path.index < max && pathValue.charCodeAt(path.index) === 0x2C/* , */) {
        path.index += 1;
        skipSpaces(path);
      }
    }

    if (path.index >= path.max) {
      break;
    }

    // Stop on next segment
    if (!isDigitStart(pathValue.charCodeAt(path.index))) {
      break;
    }
  }

  finalizeSegment(path);
}
