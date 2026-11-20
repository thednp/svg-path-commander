import type { CubicCoordinates, NormalArray, Point, QuadCoordinates } from "../types.ts";
import { buildPathLengthTable } from "../util/pathLengthTable.ts";
import { getPointAtCubicSegmentLength } from "../math/cubicTools.ts";
import { getPointAtQuadSegmentLength } from "../math/quadTools.ts";
import { arcPoint, getArcProps } from "../math/arcTools.ts";

/**
 * Returns the number of samples of a segment.
 *
 * The samples are spread over the parameter of the segment, so their number
 * grows with the length of the segment: a straight segment needs none, a
 * curve needs one every step.
 *
 * @param length - the length of the segment
 * @param step - the maximum distance between two samples
 * @returns the number of samples of the segment
 */
const sampleCount = (length: number, step: number): number => Math.max(2, Math.ceil(length / step));

/**
 * Returns the points of a normalized path, sampled along its segments.
 *
 * The samples are the points the simplification measures: they sit on the
 * path itself, so the distance between the path and the result is measured
 * against the path and not against an approximation of it.
 *
 * A straight segment needs no sample of its own, the chord of a straight
 * segment is the segment: the same goes for the close segment, the
 * deviation of a chord from a straight line is at its ends and the ends are
 * the samples of the segments around it.
 *
 * @param path - the normalized path to sample
 * @param step - the maximum distance between two samples
 * @returns the samples of the path, in path order
 */
export const samplePath = (path: NormalArray, step: number): Point[] => {
  const { measures } = buildPathLengthTable(path);
  const samples: Point[] = [];

  for (const measure of measures) {
    const { segment, startX, startY, endX, endY, length } = measure;
    const command = segment[0];

    if (command === "Z") {
      // the close segment returns to the start of the sub-path
      samples.push({ x: endX, y: endY });
      continue;
    }

    if (command === "M" || command === "L") {
      samples.push({ x: endX, y: endY });
    } else if (command === "C") {
      const count = sampleCount(length, step);
      const coords = [
        startX,
        startY,
        segment[1] as number,
        segment[2] as number,
        segment[3] as number,
        segment[4] as number,
        endX,
        endY,
      ] as CubicCoordinates;
      for (let i = 1; i < count; i += 1) {
        samples.push(getPointAtCubicSegmentLength(coords, i / count));
      }
      // the last sample of a segment is its end point
      samples.push({ x: endX, y: endY });
    } else if (command === "Q") {
      const count = sampleCount(length, step);
      const coords = [
        startX,
        startY,
        segment[1] as number,
        segment[2] as number,
        endX,
        endY,
      ] as QuadCoordinates;
      for (let i = 1; i < count; i += 1) {
        samples.push(getPointAtQuadSegmentLength(coords, i / count));
      }
      samples.push({ x: endX, y: endY });
    } else {
      // a normalized path holds no other command than the ones handled here
      const rx = segment[1] as number;
      const ry = segment[2] as number;
      const angle = segment[3] as number;
      // a zero radius is a straight line to the end point
      if (rx === 0 || ry === 0) {
        samples.push({ x: endX, y: endY });
        continue;
      }
      const {
        center,
        rx: radiusX,
        ry: radiusY,
        startAngle,
        endAngle,
      } = getArcProps(
        startX,
        startY,
        rx,
        ry,
        angle,
        segment[4] as number,
        segment[5] as number,
        endX,
        endY,
      );
      const count = sampleCount(length, step);
      const alpha = (((angle % 360) + 360) % 360) * (Math.PI / 180);
      const sweep = endAngle - startAngle;
      for (let i = 1; i < count; i += 1) {
        const [x, y] = arcPoint(
          center.x,
          center.y,
          radiusX,
          radiusY,
          alpha,
          startAngle + (sweep * i) / count,
        );
        samples.push({ x, y });
      }
      samples.push({ x: endX, y: endY });
    }
  }

  return samples;
};
