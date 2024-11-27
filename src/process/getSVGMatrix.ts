import CSSMatrix from "@thednp/dommatrix";
// import type { TransformObject } from '../interface';
import type { TransformObjectValues } from "../types";

/**
 * Returns a transformation matrix to apply to `<path>` elements.
 *
 * @see TransformObjectValues
 *
 * @param transform the `transformObject`
 * @returns a new transformation matrix
 */
const getSVGMatrix = (transform: TransformObjectValues): CSSMatrix => {
  let matrix = new CSSMatrix();
  const { origin } = transform;
  const [originX, originY] = origin as [number, number, number];
  const { translate } = transform;
  const { rotate } = transform;
  const { skew } = transform;
  const { scale } = transform;

  // set translate
  if (
    Array.isArray(translate) &&
    translate.length >= 2 &&
    translate.every((x) => !Number.isNaN(+x)) &&
    translate.some((x) => x !== 0)
  ) {
    matrix = matrix.translate(...(translate as [number, number, number?]));
  } else if (typeof translate === "number" && !Number.isNaN(translate)) {
    matrix = matrix.translate(translate);
  }

  if (rotate || skew || scale) {
    // set SVG transform-origin, always defined
    matrix = matrix.translate(originX, originY);

    // set rotation
    if (
      Array.isArray(rotate) &&
      rotate.length >= 2 &&
      rotate.every((x) => !Number.isNaN(+x)) &&
      rotate.some((x) => x !== 0)
    ) {
      matrix = matrix.rotate(...(rotate as [number, number, number?]));
    } else if (typeof rotate === "number" && !Number.isNaN(rotate)) {
      matrix = matrix.rotate(rotate);
    }

    // set skew(s)
    if (
      Array.isArray(skew) && skew.length === 2 && skew.every((x) =>
        !Number.isNaN(+x)
      ) && skew.some((x) => x !== 0)
    ) {
      matrix = skew[0] ? matrix.skewX(skew[0]) : matrix;
      matrix = skew[1] ? matrix.skewY(skew[1]) : matrix;
    } else if (typeof skew === "number" && !Number.isNaN(skew)) {
      matrix = matrix.skewX(skew);
    }

    // set scale
    if (
      Array.isArray(scale) && scale.length >= 2 && scale.every((x) =>
        !Number.isNaN(+x)
      ) && scale.some((x) => x !== 1)
    ) {
      matrix = matrix.scale(...(scale as [number, number, number?]));
    } else if (typeof scale === "number" && !Number.isNaN(scale)) {
      matrix = matrix.scale(scale);
    }
    // set SVG transform-origin
    matrix = matrix.translate(-originX, -originY);
  }

  return matrix;
};
export default getSVGMatrix;
