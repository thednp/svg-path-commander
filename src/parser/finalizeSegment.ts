import { paramsCounts } from "./paramsCount.ts";
import type { PathParser } from "./pathParser.ts";
import type { PathCommand, PathSegment, RelativeCommand } from "../types.ts";

/**
 * Breaks the parsing of a pathString once a segment is finalized.
 *
 * @param path - The PathParser instance
 */
export const finalizeSegment = (path: PathParser): void => {
  let pathCommand = path.pathValue[path.segmentStart] as PathCommand;
  let relativeCommand = pathCommand.toLowerCase() as RelativeCommand;
  const { data } = path;
  let index = 0;

  while (data.length - index >= paramsCounts[relativeCommand]) {
    // overloaded `moveTo`
    // https://github.com/rveciana/svg-path-properties/blob/master/src/parse.ts
    if (relativeCommand === "m" && data.length - index > 2) {
      const segment = new Array<number | PathCommand>(3);
      segment[0] = pathCommand;
      segment[1] = data[index] as number;
      segment[2] = data[index + 1] as number;
      path.segments.push(segment as PathSegment);
      index += 2;
      relativeCommand = "l";
      pathCommand = pathCommand === "m" ? "l" : "L";
    } else {
      const paramCount = paramsCounts[relativeCommand];
      const segment = new Array<number | PathCommand>(paramCount + 1);
      segment[0] = pathCommand;
      for (let i = 0; i < paramCount; i += 1) {
        segment[i + 1] = data[index + i] as number;
      }
      path.segments.push(segment as PathSegment);
      index += paramCount;
    }

    if (!paramsCounts[relativeCommand]) {
      break;
    }
  }
};
