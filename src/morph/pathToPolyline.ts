// src/convert/pathToPolyline.ts
import type {
  LSegment,
  PointTuple,
  PolygonArray,
  PolylineArray,
  // PathArray,
} from "../types";
import { normalizePath } from "../process/normalizePath";
import { isPolygonArray } from "../util/isPolygonArray";
import { isPolylineArray } from "../util/isPolylineArray";
import { isClosedPath } from "../util/isClosedPath";
import { error } from "../util/error";

/**
 * Converts any `PolyLineArray`/`PolygonArray` path (closed or open) to an explicit polyline (M + L*).
 * If the path is closed (has Z), the Z is replaced with an explicit L back to the initial M point.
 * This allows uniform processing without special-casing Z.
 *
 * @param path string or PathArray
 * @returns PolylineArray (M + L*) — never contains Z
 */
export const pathToPolyline = <T extends PolygonArray | PolylineArray>(
  path: string | T,
): PolylineArray => {
  const normal = normalizePath(path);
  if (!isPolygonArray(normal) && !isPolylineArray(normal)) {
    throw TypeError(
      `${error}: pathValue is not a polyline/polygon`,
    );
  }

  // If not closed, return as-is (already a polyline)
  if (!isClosedPath(normal)) {
    return normal as PolylineArray;
  }

  // Closed → replace Z with explicit L to initial M
  const result: PolylineArray = [normal[0]]; // Keep M
  const [mx, my] = normal[0].slice(1) as PointTuple;

  for (let i = 1; i < normal.length; i++) {
    const seg = normal[i];
    if (seg[0].toUpperCase() === "Z") {
      result.push(["L", mx, my]);
    } else {
      result.push(seg as LSegment);
    }
  }

  return result;
};
