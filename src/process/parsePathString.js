import clonePath from '../util/clonePath.js'
import roundPath from '../util/roundPath.js'
import SVGPathArray from '../util/svgPathArray.js'
import scanSegment from '../util/scanSegment.js'
import skipSpaces from '../util/skipSpaces.js'

// Returns array of segments:
export default function(pathString) {

  if ( Array.isArray(pathString) ) {
    return clonePath(pathString)
  }

  let state = new SVGPathArray(pathString), max = state.max;

  skipSpaces(state);

  while (state.index < max && !state.err.length) {
    scanSegment(state);
  }

  if (state.err.length) {
    state.segments = [];
  } else if (state.segments.length) {

    if ('mM'.indexOf(state.segments[0][0]) < 0) {
      state.err = 'SvgPath: string should start with `M` or `m`';
      state.segments = [];
    } else {
      state.segments[0][0] = 'M';
    }
  }
  return roundPath(state.segments)
}