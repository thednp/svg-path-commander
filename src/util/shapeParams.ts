import type { ShapeParams } from "../interface";

/**
 * Supported shapes and their specific parameters.
 */
const shapeParams: ShapeParams = {
  line: ["x1", "y1", "x2", "y2"],
  circle: ["cx", "cy", "r"],
  ellipse: ["cx", "cy", "rx", "ry"],
  rect: ["width", "height", "x", "y", "rx", "ry"],
  polygon: ["points"],
  polyline: ["points"],
  glyph: ["d"],
};

export default shapeParams;
