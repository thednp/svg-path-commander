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

  while (data.length >= paramsCounts[relativeCommand]) {
    // overloaded `moveTo`
    // https://github.com/rveciana/svg-path-properties/blob/master/src/parse.ts
    if (relativeCommand === "m" && data.length > 2) {
      path.segments.push(
        [pathCommand as PathCommand | number].concat(
          data.splice(0, 2) as number[],
        ) as PathSegment,
      );
      relativeCommand = "l";
      pathCommand = pathCommand === "m" ? "l" : "L";
    } else {
      path.segments.push(
        [pathCommand as PathCommand | number].concat(
          data.splice(0, paramsCounts[relativeCommand]) as number[],
        ) as PathSegment,
      );
    }

    if (!paramsCounts[relativeCommand]) {
      break;
    }
  }
};
