/**
 * Shorten a single segment of a `pathArray` object.
 *
 * @param {SVGPathCommander.pathSegment} segment the segment object
 * @param {any} params the coordinates of the previous segment
 * @param {string} prevCommand the path command of the previous segment
 * @returns {SVGPathCommander.shortSegment | SVGPathCommander.pathSegment} the shortened segment
 */
export default function shortenSegment(segment, params, prevCommand) {
  const [pathCommand] = segment;
  const values = segment.slice(1).map((n) => +n);
  const {
    x1: px1, y1: py1, x2: px2, y2: py2, x: px, y: py,
  } = params;
  let result = segment;
  const [x, y] = values.slice(-2);

  if (!'TQ'.includes(pathCommand)) {
    // optional but good to be cautious
    params.qx = null;
    params.qy = null;
  }

  if (pathCommand === 'L') {
    if (px === x) {
      result = ['V', y];
    } else if (py === y) {
      result = ['H', x];
    }
  } else if (pathCommand === 'C') {
    const [x1, y1] = values;

    if ('CS'.includes(prevCommand)
      && x1 === px1 * 2 - px2
      && y1 === py1 * 2 - py2) {
      // @ts-ignore -- the amount of numbers should suffice
      result = ['S', ...values.slice(-4)];
    }
    params.x1 = x1;
    params.y1 = y1;
  } else if (pathCommand === 'Q') {
    const [qx, qy] = values;
    params.qx = qx;
    params.qy = qy;

    if ('QT'.includes(prevCommand)
      && qx === px1 * 2 - px2
      && qy === py1 * 2 - py2) {
      // @ts-ignore -- the amount of numbers should suffice
      result = ['T', ...values.slice(-2)];
    }
  }

  return result;
}
