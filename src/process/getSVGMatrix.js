import CSSMatrix from 'dommatrix';

/**
 * Returns a transformation matrix to apply to `<path>` elements.
 *
 * @see SVGPath.transformObject
 *
 * @param {SVGPath.transformObject} transform the `transformObject`
 * @returns {CSSMatrix} a new transformation matrix
 */
export default function getSVGMatrix(transform) {
  let matrix = new CSSMatrix();
  const { origin } = transform;
  const [originX, originY] = origin;
  const { translate } = transform;
  const { rotate } = transform;
  const { skew } = transform;
  const { scale } = transform;

  // set translate
  if (Array.isArray(translate) && translate.every((x) => !Number.isNaN(+x))
    && translate.some((x) => x !== 0)) {
    matrix = matrix.translate(...translate);
  } else if (typeof translate === 'number' && !Number.isNaN(translate)) {
    matrix = matrix.translate(translate);
  }

  if (rotate || skew || scale) {
    // set SVG transform-origin, always defined
    matrix = matrix.translate(originX, originY);

    // set rotation
    if (Array.isArray(rotate) && rotate.every((x) => !Number.isNaN(+x))
      && rotate.some((x) => x !== 0)) {
      matrix = matrix.rotate(...rotate);
    } else if (typeof rotate === 'number' && !Number.isNaN(rotate)) {
      matrix = matrix.rotate(rotate);
    }

    // set skew(s)
    if (Array.isArray(skew) && skew.every((x) => !Number.isNaN(+x))
      && skew.some((x) => x !== 0)) {
      matrix = skew[0] ? matrix.skewX(skew[0]) : matrix;
      matrix = skew[1] ? matrix.skewY(skew[1]) : matrix;
    } else if (typeof skew === 'number' && !Number.isNaN(skew)) {
      matrix = matrix.skewX(skew);
    }

    // set scale
    if (Array.isArray(scale) && scale.every((x) => !Number.isNaN(+x))
      && scale.some((x) => x !== 1)) {
      matrix = matrix.scale(...scale);
    } else if (typeof scale === 'number' && !Number.isNaN(scale)) {
      matrix = matrix.scale(scale);
    }
    // set SVG transform-origin
    matrix = matrix.translate(-originX, -originY);
  }

  return matrix;
}
