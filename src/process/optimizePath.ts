import type { AbsoluteSegment, PathArray, PathCommand } from "../types";
import pathToAbsolute from "../convert/pathToAbsolute";
import shortenSegment from "./shortenSegment";
import paramsParser from "../parser/paramsParser";
import iterate from "./iterate";
import normalizeSegment from "./normalizeSegment";
import relativizeSegment from "./relativizeSegment";
import roundSegment from "./roundSegment";

/**
 * Optimizes a `pathArray` object:
 * * convert segments to shorthand if possible
 * * select shortest segments from absolute and relative `pathArray`s
 *
 * @param pathInput a string or `pathArray`
 * @param roundOption the amount of decimals to round values to
 * @returns the optimized `pathArray`
 */
const optimizePath = (pathInput: PathArray, roundOption?: number) => {
  const path = pathToAbsolute(pathInput);
  // allow for ZERO decimals or use an aggressive value of 2
  const round = typeof roundOption === "number" && roundOption >= 0
    ? roundOption
    : /* istanbul ignore next @preserve */ 2;
  // this utility overrides the iterator params
  const optimParams = { ...paramsParser };

  const allPathCommands = [] as PathCommand[];
  let pathCommand = "M" as PathCommand;
  let prevCommand = "Z" as PathCommand;

  return iterate(path, (seg, i, lastX, lastY) => {
    optimParams.x = lastX;
    optimParams.y = lastY;
    const normalizedSegment = normalizeSegment(seg, optimParams);
    let result = seg;
    [pathCommand] = seg;

    // Save current path command
    allPathCommands[i] = pathCommand;
    if (i) {
      // Get previous path command for `shortenSegment`
      prevCommand = allPathCommands[i - 1];
      const shortSegment = shortenSegment(
        seg as AbsoluteSegment,
        normalizedSegment,
        optimParams,
        prevCommand,
      );
      const absSegment = roundSegment(shortSegment, round);
      const absString = absSegment.join("");
      const relativeSegment = relativizeSegment(shortSegment, i, lastX, lastY);
      const relSegment = roundSegment(relativeSegment, round);
      const relString = relSegment.join("");
      result = absString.length < relString.length ? absSegment : relSegment;
    }

    const seglen = normalizedSegment.length;
    optimParams.x1 = +normalizedSegment[seglen - 2];
    optimParams.y1 = +normalizedSegment[seglen - 1];
    optimParams.x2 = +normalizedSegment[seglen - 4] || optimParams.x1;
    optimParams.y2 = +normalizedSegment[seglen - 3] || optimParams.y1;

    return result;
  });
};

export default optimizePath;
