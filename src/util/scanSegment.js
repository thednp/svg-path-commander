import finalizeSegment from './finalizeSegment.js'
import paramCounts from './paramsCount.js'
import scanFlag from './scanFlag.js'
import scanParam from './scanParam.js'
import isCommand from './isCommand.js'
import isDigitStart from './isDigitStart.js'
import isArc from './isArc.js'
import skipSpaces from './skipSpaces.js'

export default function(state) {
  let max = state.max, cmdCode, comma_found, need_params, i;

  state.segmentStart = state.index;
  cmdCode = state.pathValue.charCodeAt(state.index);

  if (!isCommand(cmdCode)) {
    state.err = 'SvgPath: bad command ' + state.pathValue[state.index] + ' (at pos ' + state.index + ')';
    return;
  }

  need_params = paramCounts[state.pathValue[state.index].toLowerCase()];

  state.index++;
  skipSpaces(state);

  state.data = [];

  if (!need_params) {
    // Z
    finalizeSegment(state);
    return;
  }

  comma_found = false;

  for (;;) {
    for (i = need_params; i > 0; i--) {
      if (isArc(cmdCode) && (i === 3 || i === 4)) scanFlag(state);
      else scanParam(state);

      if (state.err.length) {
        return;
      }
      state.data.push(state.param);

      skipSpaces(state);
      comma_found = false;

      if (state.index < max && state.pathValue.charCodeAt(state.index) === 0x2C/* , */) {
        state.index++;
        skipSpaces(state);
        comma_found = true;
      }
    }

    // after ',' param is mandatory
    if (comma_found) {
      continue;
    }

    if (state.index >= state.max) {
      break;
    }

    // Stop on next segment
    if (!isDigitStart(state.pathValue.charCodeAt(state.index))) {
      break;
    }
  }

  finalizeSegment(state);
}