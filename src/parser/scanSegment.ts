import { finalizeSegment } from "./finalizeSegment.ts";
import { paramsCounts } from "./paramsCount.ts";
import { scanFlag } from "./scanFlag.ts";
import { scanParam } from "./scanParam.ts";
import { skipSpaces } from "./skipSpaces.ts";
import { isPathCommand } from "./isPathCommand.ts";
import { isDigitStart } from "./isDigitStart.ts";
import { isArcCommand } from "./isArcCommand.ts";
import { isMoveCommand } from "./isMoveCommand.ts";
import { invalidPathValue } from "./invalidPathValue.ts";
import { error } from "../util/error.ts";

import type { PathParser } from "./pathParser.ts";
import type { PathSegment, RelativeCommand } from "../types.ts";

/**
 * Scans every character in the path string to determine
 * where a segment starts and where it ends.
 *
 * @param path - The PathParser instance
 */
export const scanSegment = (path: PathParser) => {
  const { max, pathValue, index, segments } = path;
  const cmdCode = pathValue.charCodeAt(index);
  const reqParams =
    paramsCounts[pathValue[index].toLowerCase() as RelativeCommand];

  path.segmentStart = index;

  // segments always start with a path command
  if (!isPathCommand(cmdCode)) {
    path.err = `${error}: ${invalidPathValue} "${
      pathValue[index]
    }" is not a path command at index ${index}`;
    return;
  }

  // after a Z segment, we only expect a MoveTo path command
  const lastSegment = segments[segments.length - 1] as PathSegment | undefined;
  if (
    !isMoveCommand(cmdCode) &&
    lastSegment?.[0]?.toLocaleLowerCase() === "z"
  ) {
    path.err = `${error}: ${invalidPathValue} "${
      pathValue[index]
    }" is not a MoveTo path command at index ${index}`;
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
      if (
        path.index < max &&
        pathValue.charCodeAt(path.index) === 0x2c /* , */
      ) {
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
};
