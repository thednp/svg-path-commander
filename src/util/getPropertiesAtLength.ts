import type { PathArray, PathSegment } from "../types.ts";
import type { SegmentProperties } from "../interface.ts";
import type { SegmentMeasure } from "./measureSegments.ts";
import type { PathFrame } from "./segmentFrame.ts";
import { measureSegments } from "./measureSegments.ts";
import { getSegmentFrame } from "./segmentFrame.ts";

/**
 * Returns the length of a measured segment.
 *
 * The length is taken from the accumulated lengths, the total up to the
 * segment minus the total before it, and not from the length the segment
 * was measured with: the two differ in the last bits, and this keeps the
 * result identical to the one the previous implementation returned.
 *
 * @param measure - the measured segment
 * @returns the length of the segment
 */
const segmentLength = (measure: SegmentMeasure): number =>
  measure.lengthAtSegment + measure.length - measure.lengthAtSegment;

/**
 * Returns the frame of a measured segment at a given distance.
 *
 * @param measure - the measured segment
 * @param offset - the distance from the start of the segment
 * @returns the frame of the segment
 */
const frameOf = (measure: SegmentMeasure | undefined, offset = 0): PathFrame => {
  // an empty path has no frame, but the result still has to be well formed
  if (!measure) {
    return {
      point: { x: 0, y: 0 },
      tangent: { x: 0, y: 0 },
      normal: { x: 0, y: 0 },
      angle: 0,
    };
  }
  return getSegmentFrame(
    measure.geometry,
    measure.startX,
    measure.startY,
    measure.endX,
    measure.endY,
    offset,
    measure.length,
  );
};

/**
 * Returns the segment, its index and length as well as
 * the length to that segment at a given length in a path.
 *
 * The point at the given length is returned with the frame of the path at
 * that point: the unit tangent vector, the unit normal vector and the angle
 * of the tangent in degrees.
 *
 * @param pathInput target `pathArray`
 * @param distance the given length
 * @returns the requested properties
 */
export const getPropertiesAtLength = <T extends PathArray>(
  pathInput: string | T,
  distance?: number,
): SegmentProperties => {
  // one pass over the path, the measure table holds the length of every
  // segment and the length accumulated before it
  const measures = measureSegments(pathInput);
  const lastIndex = measures.length - 1;

  // an empty path has no segment, but the result still has to be well formed
  const segment = (measures[0]?.segment ?? ["M", 0, 0]) as PathSegment;

  // If the path is empty, return 0.
  // an infinite distance is not an error, it is out of range and clamps
  // to the last segment like any other out of range distance
  if (lastIndex <= 0 || !distance || distance < 0) {
    return {
      segment,
      index: 0,
      length: 0,
      lengthAtSegment: 0,
      ...frameOf(measures[0]),
    };
  }

  const last = measures[lastIndex];
  const pathLength = last.lengthAtSegment + last.length;

  if (distance >= pathLength) {
    return {
      segment: last.segment,
      index: last.index,
      length: segmentLength(last),
      lengthAtSegment: last.lengthAtSegment,
      ...frameOf(last, distance - last.lengthAtSegment),
    };
  }

  // the segment is the last one whose accumulated length does not exceed
  // the distance, a zero length segment wins over the one before it
  for (let i = lastIndex; i > 0; i--) {
    const measure = measures[i];
    if (measure.lengthAtSegment <= distance) {
      return {
        segment: measure.segment,
        index: measure.index,
        length: segmentLength(measure),
        lengthAtSegment: measure.lengthAtSegment,
        ...frameOf(measure, distance - measure.lengthAtSegment),
      };
    }
  }

  // the distance is inside the first segment, which is only possible when
  // the path does not start with a moveto
  const first = measures[0];
  return {
    segment: first.segment,
    index: first.index,
    length: segmentLength(first),
    lengthAtSegment: first.lengthAtSegment,
    ...frameOf(first, distance - first.lengthAtSegment),
  };
};
