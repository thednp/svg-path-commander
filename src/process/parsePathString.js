import clonePath from './clonePath.js'
import roundPath from './roundPath.js'
import SVGPathArray from '../util/svgPathArray.js'
import scanSegment from '../util/scanSegment.js'
import skipSpaces from '../util/skipSpaces.js'
import invalidPathValue from '../util/invalidPathValue.js'
import isPathArray from '../util/isPathArray.js'

// Returns array of segments:
export default function(pathString) {
  if ( isPathArray(pathString) ) {
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
      // state.err = 'Path string should start with `M` or `m`';
      state.err = invalidPathValue;
      state.segments = [];
    } else {
      state.segments[0][0] = 'M';
    }
  }
  return roundPath(state.segments)
}