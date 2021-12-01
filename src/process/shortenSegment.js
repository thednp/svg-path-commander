/**
 * Shorten a single segment of a `pathArray` object.
 *
 * @param {SVGPathCommander.pathSegment} segment the segment object
 * @param {any} params the coordinates of the previous segment
 * @param {string} prevCommand the path command of the previous segment
 * @returns {any} the shortened segment
 */
export default function shortenSegment(segment, params, prevCommand) {
  const [pathCommand] = segment;
  const values = segment.slice(1);
  const {
    x1: px1, y1: py1, x2: px2, y2: py2,
  } = params;
  let result = segment.slice();
  const [x, y] = segment.slice(-2);

  if (!'TQ'.includes(segment[0])) {
    // optional but good to be cautious
    params.qx = null;
    params.qy = null;
  }

  if (pathCommand === 'L') {
    if (px1 === segment[1]) {
      result = ['V', segment[1]];
    } else if (py1 === segment[2]) {
      result = ['H', segment[2]];
    }
    params.x = +x;
    params.y = +y;
  } else if (pathCommand === 'C') {
    const [x2, y2] = values.slice(-4);
    const [x1, y1] = values;

    if (['C', 'S'].includes(prevCommand)
      && x1 === px1 * 2 - px2
      && y1 === py1 * 2 - py2) {
      result = ['S', x2, y2, x, y];
    }
    params.x1 = x1;
    params.y1 = y1;
  } else if (pathCommand === 'Q') {
    const [nx, ny] = values;
    if (['Q', 'T'].includes(prevCommand)
      && nx === px1 * 2 - px2
      && ny === py1 * 2 - py2) {
      result = ['T', x, y];
    }
    params.qx = nx;
    params.qy = ny;
  }
  return result;
}
