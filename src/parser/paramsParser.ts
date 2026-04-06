import type { ParserParams } from "../interface";

/**
 * Default parser parameters object used to track position state
 * while iterating through path segments.
 */
export const paramsParser: ParserParams = {
  mx: 0,
  my: 0,
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  x: 0,
  y: 0,
  qx: null,
  qy: null,
};
