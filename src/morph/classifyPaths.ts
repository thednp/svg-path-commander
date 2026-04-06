import type { NormalArray, PathFeature } from "../types.ts";
import { getPathBBox } from "../util/getPathBBox.ts";
import { polygonArea } from "../math/polygonTools.ts";
import { samplePolygon } from "./samplePolygon.ts";
import { isPolygonArray } from "../util/isPolygonArray.ts";
import { isPolylineArray } from "../util/isPolylineArray.ts";

/**
 * Classifies paths into outer (containing) and inner (hole) paths.
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
  const outers: PathFeature[] = [];
  const inners: PathFeature[] = [];

  for (const path of paths) {
    const signedArea = polygonArea(samplePolygon(path));
    const bbox = getPathBBox(path);
    const feature: PathFeature = {
      isPoly: isPolygonArray(path) || isPolylineArray(path),
      size: bbox.width * bbox.height,
      path,
      signedArea,
      area: Math.abs(signedArea),
      bbox,
    };

    if (signedArea > 0) {
      outers.push(feature);
    } else {
      inners.push(feature);
    }
  }

  return { outers, inners };
};
