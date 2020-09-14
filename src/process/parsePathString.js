import clonePath from './clonePath.js'
import roundPath from './roundPath.js'
import scanSegment from './scanSegment.js'
import skipSpaces from './skipSpaces.js'
import SVGPathArray from '../util/svgPathArray.js'
import invalidPathValue from '../util/invalidPathValue.js'
import isPathArray from '../util/isPathArray.js'

// Returns array of segments:
export default function(pathString,round) {
  if ( isPathArray(pathString) ) {
    return clonePath(pathString)
  }

  let state = new SVGPathArray(pathString);

  skipSpaces(state);

  while (state.index < state.max && !state.err.length) {
    scanSegment(state);
  }

  if (state.err.length) {
    state.segments = [];
  } else if (state.segments.length) {

    if ('mM'.indexOf(state.segments[0][0]) < 0) {
      // state.err = 'Path string should start with `M` or `m`';
      state.err = `${invalidPathValue}: missing M/m`;
      state.segments = [];
    } else {
      state.segments[0][0] = 'M';
    }
  }
  return roundPath(state.segments,round)
}