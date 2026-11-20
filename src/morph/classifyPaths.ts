import type { NormalArray, PathFeature } from "../types.ts";
import { getPathBBox } from "../util/getPathBBox.ts";
import { polygonArea } from "../math/polygonTools.ts";
import { samplePolygon } from "./samplePolygon.ts";
import { isPolygonArray } from "../util/isPolygonArray.ts";
import { isPolylineArray } from "../util/isPolylineArray.ts";
import { isPointInsideBBox } from "../intersect/isPointInsideBBox.ts";

/**
 * Classifies paths into outer (containing) and inner (hole) paths.
 *
 * A path is an inner path when it is contained by another path of the
 * same set. The winding of a contour is not used for the classification:
 * the shoelace sign only tells the direction of the contour, and in the
 * SVG coordinate system (y pointing down) the usual outer contour has a
 * *negative* signed area.
 *
 * @param paths - Array of normalized path arrays to classify
 * @returns Object with `outers` (containing shapes) and `inners` (holes)
 */
export const classifyPaths = (
  paths: NormalArray[],
): {
  outers: PathFeature[];
  inners: PathFeature[];
} => {
  const features: PathFeature[] = paths.map((path) => {
    const signedArea = polygonArea(samplePolygon(path));
    const bbox = getPathBBox(path);
    return {
      isPoly: isPolygonArray(path) || isPolylineArray(path),
      size: bbox.width * bbox.height,
      path,
      signedArea,
      area: Math.abs(signedArea),
      bbox,
    };
  });

  const outers: PathFeature[] = [];
  const inners: PathFeature[] = [];

  for (const feature of features) {
    // a hole is a path contained by a bigger path of the same set
    const isInner = features.some(
      (other) =>
        other !== feature &&
        other.area > feature.area &&
        isPointInsideBBox(
          [other.bbox.x, other.bbox.y, other.bbox.x2, other.bbox.y2],
          [feature.bbox.cx, feature.bbox.cy],
        ),
    );

    if (isInner) {
      inners.push(feature);
    } else {
      outers.push(feature);
    }
  }

  return { outers, inners };
};
