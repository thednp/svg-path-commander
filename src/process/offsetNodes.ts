import type { SegmentMeasure } from "../util/measureSegments.ts";
import { getSegmentFrame } from "../util/segmentFrame.ts";

/**
 * A point of a path with the direction of the path at that point.
 */
export type OffsetNode = {
  /** The X coordinate of the point. */
  x: number;
  /** The Y coordinate of the point. */
  y: number;
  /** The X component of the unit tangent. */
  tx: number;
  /** The Y component of the unit tangent. */
  ty: number;
  /** Whether a join precedes this node. */
  corner: boolean;
};

/**
 * Returns the sampled points of the drawable segments of a sub-path.
 *
 * A line gives its two end points, a curve gives `steps` samples spread
 * evenly over its length. The tangent of every sample is the tangent of the
 * path at that point, so the normal of the sample is the direction the path
 * is offset to.
 *
 * The first point of a segment is a corner when the segment follows another
 * one, and the closing segment of a closed sub-path ends with a corner that
 * joins the last segment to the first one.
 *
 * @param measures - the measured segments of the sub-path
 * @param steps - the number of the intervals a curve is sampled with
 * @returns the sampled points of the sub-path
 */
export const getOffsetNodes = (measures: SegmentMeasure[], steps: number): OffsetNode[] => {
  const nodes: OffsetNode[] = [];

  for (const measure of measures) {
    const command = measure.geometry[0];
    // the moveto only holds the start of the sub-path
    if (command === "M") continue;
    // a segment without a length does not move the path
    if (measure.length <= 0) continue;
    const isFirst = nodes.length === 0;

    if (command === "L" || command === "Z") {
      const dx = measure.endX - measure.startX;
      const dy = measure.endY - measure.startY;
      const length = Math.sqrt(dx * dx + dy * dy);
      const tx = dx / length;
      const ty = dy / length;
      nodes.push({ x: measure.startX, y: measure.startY, tx, ty, corner: !isFirst });
      nodes.push({ x: measure.endX, y: measure.endY, tx, ty, corner: false });
      continue;
    }

    for (let i = 0; i <= steps; i += 1) {
      const frame = getSegmentFrame(
        measure.geometry,
        measure.startX,
        measure.startY,
        measure.endX,
        measure.endY,
        (measure.length * i) / steps,
        measure.length,
      );
      nodes.push({
        x: frame.point.x,
        y: frame.point.y,
        tx: frame.tangent.x,
        ty: frame.tangent.y,
        corner: !isFirst && i === 0,
      });
    }
  }

  // a closed sub-path ends with the corner that joins the closing segment
  // to the first segment of the sub-path
  const last = measures[measures.length - 1];
  if (nodes.length && last && last.geometry[0] === "Z") {
    const first = nodes[0];
    nodes.push({ x: first.x, y: first.y, tx: first.tx, ty: first.ty, corner: true });
  }

  return nodes;
};
