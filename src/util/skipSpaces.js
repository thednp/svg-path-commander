import isSpace from './isSpace.js'

export default function(state) {
  while (state.index < state.max && isSpace(state.pathValue.charCodeAt(state.index))) {
    state.index++;
  }
}