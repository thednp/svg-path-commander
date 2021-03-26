import isSpace from '../util/isSpace.js';

export default function skipSpaces(state) {
  while (state.index < state.max && isSpace(state.pathValue.charCodeAt(state.index))) {
    state.index += 1;
  }
}
