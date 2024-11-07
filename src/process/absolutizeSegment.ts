import type {
  AbsoluteCommand,
  AbsoluteSegment,
  ASegment,
  CSegment,
  HSegment,
  LSegment,
  MSegment,
  PathSegment,
  QSegment,
  SSegment,
  TSegment,
  VSegment,
} from "../types";

/**
 * Returns an absolute segment of a `PathArray` object.
 *
 * @param segment the segment object
 * @param index the segment index
 * @param lastX the last known X value
 * @param lastY the last known Y value
 * @returns the absolute segment
 */
const absolutizeSegment = (
  segment: PathSegment,
  index: number,
  lastX: number,
  lastY: number,
) => {
  const [pathCommand] = segment;
  const absCommand = pathCommand.toUpperCase() as AbsoluteCommand;
  const isAbsolute = absCommand === pathCommand;

  /* istanbul ignore else @preserve */
  if (index === 0 || isAbsolute) return segment as MSegment | AbsoluteSegment;
  // const values = segment.slice(1) as number[];
  if (absCommand === "A") {
    return [
      absCommand,
      segment[1],
      segment[2],
      segment[3],
      segment[4],
      segment[5],
      (segment as ASegment)[6] + lastX,
      (segment as ASegment)[7] + lastY,
    ] as ASegment;
  } else if (absCommand === "V") {
    return [absCommand, (segment as VSegment)[1] + lastY] as VSegment;
  } else if (absCommand === "H") {
    return [absCommand, (segment as HSegment)[1] + lastX] as HSegment;
  } else if (absCommand === "L") {
    return [
      absCommand,
      (segment as LSegment)[1] + lastX,
      (segment as LSegment)[2] + lastY,
    ] as LSegment;
  } else {
    // use brakets for `eslint: no-case-declaration`
    // https://stackoverflow.com/a/50753272/803358
    const absValues = [] as number[];
    const seglen = segment.length;
    for (let j = 1; j < seglen; j += 1) {
      absValues.push((segment[j] as number) + (j % 2 ? lastX : lastY));
    }
    // for c, s, q, t
    return [absCommand as typeof absCommand | number].concat(absValues) as
      | MSegment
      | QSegment
      | TSegment
      | SSegment
      | CSegment;
  }
};
export default absolutizeSegment;
