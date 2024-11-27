import type {
  aSegment,
  cSegment,
  hSegment,
  lSegment,
  MSegment,
  PathSegment,
  qSegment,
  RelativeCommand,
  RelativeSegment,
  sSegment,
  tSegment,
  vSegment,
} from "../types";

/**
 * Returns a relative segment of a `PathArray` object.
 *
 * @param segment the segment object
 * @param index the segment index
 * @param lastX the last known X value
 * @param lastY the last known Y value
 * @returns the relative segment
 */
const relativizeSegment = (
  segment: PathSegment,
  index: number,
  lastX: number,
  lastY: number,
) => {
  const [pathCommand] = segment;
  const relCommand = pathCommand.toLowerCase() as RelativeCommand;
  const isRelative = pathCommand === relCommand;

  /* istanbul ignore else @preserve */
  if (index === 0 || isRelative) return segment as MSegment | RelativeSegment;

  if (relCommand === "a") {
    return [
      relCommand,
      segment[1],
      segment[2],
      segment[3],
      segment[4],
      segment[5],
      (segment as aSegment)[6] - lastX,
      (segment as aSegment)[7] - lastY,
    ] as aSegment;
  } else if (relCommand === "v") {
    return [relCommand, (segment as vSegment)[1] - lastY] as vSegment;
  } else if (relCommand === "h") {
    return [relCommand, (segment as hSegment)[1] - lastX] as hSegment;
  } else if (relCommand === "l") {
    return [
      relCommand,
      (segment as lSegment)[1] - lastX,
      (segment as lSegment)[2] - lastY,
    ] as lSegment;
  } else {
    // use brakets for `eslint: no-case-declaration`
    // https://stackoverflow.com/a/50753272/803358
    const relValues = [] as number[];
    const seglen = segment.length;
    for (let j = 1; j < seglen; j += 1) {
      relValues.push((segment[j] as number) - (j % 2 ? lastX : lastY));
    }
    // for c, s, q, t
    return [relCommand as RelativeCommand | number].concat(relValues) as
      | qSegment
      | tSegment
      | sSegment
      | cSegment;
  }
};

export default relativizeSegment;
