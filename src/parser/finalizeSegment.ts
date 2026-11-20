import { paramsCountsByCode } from "./paramsCount.ts";
import type { PathParser } from "./pathParser.ts";
import type { PathCommand, PathSegment } from "../types.ts";

/**
 * Breaks the parsing of a pathString once a segment is finalized.
 *
 * @param path - The PathParser instance
 */
export const finalizeSegment = (path: PathParser): void => {
  let pathCommand = path.pathValue[path.segmentStart] as PathCommand;
  const { data } = path;
  let index = 0;
  // the number of parameters of the command, by character code
  let paramCount = paramsCountsByCode[pathCommand.charCodeAt(0) | 0x20];
  // a moveto is the only command that can be overloaded
  let isMove = pathCommand === "m" || pathCommand === "M";

  while (data.length - index >= paramCount) {
    // overloaded `moveTo`
    // https://github.com/rveciana/svg-path-properties/blob/master/src/parse.ts
    if (isMove && data.length - index > 2) {
      // oxlint-disable-next-line unicorn/no-new-array -- preallocated for a faster fill
      const segment = new Array<number | PathCommand>(3);
      segment[0] = pathCommand;
      segment[1] = data[index] as number;
      segment[2] = data[index + 1] as number;
      path.segments.push(segment as PathSegment);
      index += 2;
      isMove = false;
      pathCommand = pathCommand === "m" ? "l" : "L";
      // the lineto has two parameters
      paramCount = 2;
    } else {
      // oxlint-disable-next-line unicorn/no-new-array -- preallocated for a faster fill
      const segment = new Array<number | PathCommand>(paramCount + 1);
      segment[0] = pathCommand;
      for (let i = 0; i < paramCount; i += 1) {
        segment[i + 1] = data[index + i] as number;
      }
      path.segments.push(segment as PathSegment);
      index += paramCount;
    }

    if (!paramCount) {
      break;
    }
  }
};
