import finalizeSegment from './finalizeSegment.js';
import paramCounts from '../util/paramsCount.js';
import scanFlag from './scanFlag.js';
import scanParam from './scanParam.js';
import skipSpaces from './skipSpaces.js';
import isPathCommand from '../util/isPathCommand.js';
import isDigitStart from '../util/isDigitStart.js';
import isArcCommand from '../util/isArcCommand.js';
import invalidPathValue from '../util/invalidPathValue.js';

export default function scanSegment(state) {
  const { max } = state;
  const cmdCode = state.pathValue.charCodeAt(state.index);
  const reqParams = paramCounts[state.pathValue[state.index].toLowerCase()];

  state.segmentStart = state.index;

  if (!isPathCommand(cmdCode)) {
    state.err = `${invalidPathValue}: ${state.pathValue[state.index]} not a path command`;
    return;
  }

  state.index += 1;
  skipSpaces(state);

  state.data = [];

  if (!reqParams) {
    // Z
    finalizeSegment(state);
    return;
  }

  for (;;) {
    for (let i = reqParams; i > 0; i -= 1) {
      if (isArcCommand(cmdCode) && (i === 3 || i === 4)) scanFlag(state);
      else scanParam(state);

      if (state.err.length) {
        return;
      }
      state.data.push(state.param);

      skipSpaces(state);

      // after ',' param is mandatory
      if (state.index < max && state.pathValue.charCodeAt(state.index) === 0x2C/* , */) {
        state.index += 1;
        skipSpaces(state);
      }
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
