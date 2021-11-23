import CSSMatrix from 'dommatrix';

/**
 * Returns a transformation matrix to apply to `<path>` elements.
 *
 * @param {SVGPC.transformObject} transform the `transformObject`
 * @returns {CSSMatrix} a new transformation matrix
 */
export default function getSVGMatrix(transform) {
  let matrix = new CSSMatrix();
  const { origin } = transform;
  const originX = +origin[0];
  const originY = +origin[1];
  const { translate } = transform;
  const { rotate } = transform;
  const { skew } = transform;
  const { scale } = transform;

  // set translate
  if (!Number.isNaN(translate) || (Array.isArray(translate) && translate.some((x) => +x !== 0))) {
    matrix = Array.isArray(translate)
      ? matrix.translate(+translate[0] || 0, +translate[1] || 0, +translate[2] || 0)
      : matrix.translate(+translate || 0, 0, 0);
  }

  if (rotate || skew || scale) {
    // set SVG transform-origin, always defined
    // matrix = matrix.translate(+originX,+originY,+originZ)
    matrix = matrix.translate(+originX, +originY);

    // set rotation
    if (rotate) {
      matrix = Array.isArray(rotate) && rotate.some((x) => +x !== 0)
        ? matrix.rotate(+rotate[0] || 0, +rotate[1] || 0, +rotate[2] || 0)
        : matrix.rotate(+rotate || 0);
    }
    // set skew(s)
    if (Array.isArray(skew) && skew.some((x) => +x !== 0)) {
      if (Array.isArray(skew)) {
        matrix = skew[0] ? matrix.skewX(+skew[0] || 0) : matrix;
        matrix = skew[1] ? matrix.skewY(+skew[1] || 0) : matrix;
      } else {
        matrix = matrix.skewX(+skew || 0);
      }
    }
    // set scale
    if (!Number.isNaN(scale) || (Array.isArray(scale) && scale.some((x) => +x !== 1))) {
      matrix = Array.isArray(scale)
        ? (matrix.scale(+scale[0] || 1, +scale[1] || 1, +scale[2] || 1))
        : matrix.scale(+scale || 1);
    }
    // set SVG transform-origin
    // matrix = matrix.translate(-originX,-originY,-originZ)
    matrix = matrix.translate(-originX, -originY);
  }
  return matrix;
}
