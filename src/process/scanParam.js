import isDigit from '../util/isDigit.js';
import invalidPathValue from '../util/invalidPathValue.js';

export default function scanParam(state) {
  const start = state.index;
  let index = start;
  const { max } = state;
  let zeroFirst = false;
  let hasCeiling = false;
  let hasDecimal = false;
  let hasDot = false;
  let ch;

  if (index >= max) {
    // state.err = 'SvgPath: missed param (at pos ' + index + ')';
    state.err = `${invalidPathValue}: missing param ${state.pathValue[index]}`;
    return;
  }
  ch = state.pathValue.charCodeAt(index);

  if (ch === 0x2B/* + */ || ch === 0x2D/* - */) {
    index += 1;
    ch = (index < max) ? state.pathValue.charCodeAt(index) : 0;
  }

  // This logic is shamelessly borrowed from Esprima
  // https://github.com/ariya/esprimas
  if (!isDigit(ch) && ch !== 0x2E/* . */) {
    // state.err = 'SvgPath: param should start with 0..9 or `.` (at pos ' + index + ')';
    state.err = `${invalidPathValue} at index ${index}: ${state.pathValue[index]} is not a number`;
    return;
  }

  if (ch !== 0x2E/* . */) {
    zeroFirst = (ch === 0x30/* 0 */);
    index += 1;

    ch = (index < max) ? state.pathValue.charCodeAt(index) : 0;

    if (zeroFirst && index < max) {
      // decimal number starts with '0' such as '09' is illegal.
      if (ch && isDigit(ch)) {
        // state.err = 'SvgPath: numbers started with `0` such as `09`
        // are illegal (at pos ' + start + ')';
        state.err = `${invalidPathValue}: ${state.pathValue[start]} illegal number`;
        return;
      }
    }

    while (index < max && isDigit(state.pathValue.charCodeAt(index))) {
      index += 1;
      hasCeiling = true;
    }
    ch = (index < max) ? state.pathValue.charCodeAt(index) : 0;
  }

  if (ch === 0x2E/* . */) {
    hasDot = true;
    index += 1;
    while (isDigit(state.pathValue.charCodeAt(index))) {
      index += 1;
      hasDecimal = true;
    }
    ch = (index < max) ? state.pathValue.charCodeAt(index) : 0;
  }

  if (ch === 0x65/* e */ || ch === 0x45/* E */) {
    if (hasDot && !hasCeiling && !hasDecimal) {
      // state.err = 'SvgPath: invalid float exponent (at pos ' + index + ')';
      state.err = `${invalidPathValue}: ${state.pathValue[index]} invalid float exponent`;
      return;
    }

    index += 1;

    ch = (index < max) ? state.pathValue.charCodeAt(index) : 0;
    if (ch === 0x2B/* + */ || ch === 0x2D/* - */) {
      index += 1;
    }
    if (index < max && isDigit(state.pathValue.charCodeAt(index))) {
      while (index < max && isDigit(state.pathValue.charCodeAt(index))) {
        index += 1;
      }
    } else {
      // state.err = 'SvgPath: invalid float exponent (at pos ' + index + ')';
      state.err = `${invalidPathValue}: ${state.pathValue[index]} invalid float exponent`;
      return;
    }
  }

  state.index = index;
  state.param = +state.pathValue.slice(start, index);
}
